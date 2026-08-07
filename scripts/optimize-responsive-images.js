/**
 * Ürün + blog raster görsellerinden hash'li responsive WebP varyantları üretir.
 * Orijinal <slug>-NN.webp / *-cover.webp dosyalarına dokunmaz (hash yok).
 * Varyant adı: <stem>-<width|thumb>.<hash8>.webp
 *
 * Kullanım: node scripts/optimize-responsive-images.js
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const sharp = require('sharp');
const {
  loadManifest,
  writeHashedVariant,
  syncAllImageRefs,
  resolveVariantFile,
} = require('./image-variants');

const ROOT = path.join(__dirname, '..');
const PRODUCTS_DIR = path.join(ROOT, 'assets', 'img', 'products');
const BLOG_DIR = path.join(ROOT, 'assets', 'img', 'blog');
const HERO_DIR = path.join(ROOT, 'assets', 'img', 'hero');
const ALTS_PATH = path.join(ROOT, 'assets', 'data', 'product-image-alts.json');
const DIMS_PATH = path.join(ROOT, 'assets', 'data', 'product-image-dims.json');

const BUDGET = { 1200: 120, 800: 80, 400: 35, 720: 70, 960: 100, thumb: 8 };
const PRODUCT_WIDTHS = [400, 640, 800, 1200];
const BLOG_COVER_WIDTHS = [400, 720, 800, 1200];
const BLOG_CARD_WIDTHS = [400, 800];

const report = [];
const budgetExceeded = [];

function kb(bytes) {
  return +(bytes / 1024).toFixed(1);
}

function isBaseProduct(name) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*-\d{2}\.webp$/i.test(name);
}

async function encodeWebpBuffer(input, width, { thumb = false } = {}) {
  const meta = await sharp(input).metadata();
  const srcW = meta.width || 0;
  if (width && srcW && srcW < width) {
    return { skipped: true, reason: 'no-upscale', srcW };
  }

  const budgetsKey = thumb ? 'thumb' : String(width);
  const maxKb = BUDGET[budgetsKey];
  let quality = 82;
  let usedLossless = false;
  let lastSize = Infinity;
  let lastBuf = null;

  const pipeline = () =>
    sharp(input)
      .rotate()
      .resize({
        width: thumb ? 200 : width,
        height: thumb ? 200 : undefined,
        fit: thumb ? 'cover' : 'inside',
        withoutEnlargement: true,
      });

  while (quality >= 65) {
    const buf = await pipeline()
      .webp({ quality, effort: 4, alphaQuality: quality })
      .toBuffer({ resolveWithObject: true });
    lastSize = buf.info.size;
    lastBuf = buf.data;
    if (!maxKb || kb(lastSize) <= maxKb) break;
    quality -= 5;
  }

  try {
    const losslessBuf = await pipeline()
      .webp({ lossless: true, effort: 4 })
      .toBuffer({ resolveWithObject: true });
    if (losslessBuf.info.size < lastSize) {
      lastSize = losslessBuf.info.size;
      lastBuf = losslessBuf.data;
      usedLossless = true;
      quality = 'lossless';
    }
  } catch (_) {
    /* ignore */
  }

  const outKb = kb(lastSize);
  const over = maxKb && outKb > maxKb;
  const outMeta = await sharp(lastBuf).metadata();

  return {
    skipped: false,
    buffer: lastBuf,
    kb: outKb,
    quality: usedLossless ? 'lossless' : quality,
    over,
    maxKb,
    width: outMeta.width,
    height: outMeta.height,
  };
}

function record(fileRel, srcRel, res) {
  if (res.over) {
    budgetExceeded.push({
      file: fileRel,
      outKb: res.kb,
      maxKb: res.maxKb,
      quality: res.quality,
    });
  }
  report.push({
    file: fileRel,
    src: srcRel,
    width: res.width,
    height: res.height,
    kb: res.kb,
    quality: res.quality,
    budgetOk: !res.over,
  });
}

async function optimizeProducts(manifest) {
  const files = fs.readdirSync(PRODUCTS_DIR).filter(isBaseProduct);
  console.log(`\nÜrün taban görselleri: ${files.length}`);
  const allRemoved = [];

  const alts = fs.existsSync(ALTS_PATH)
    ? JSON.parse(fs.readFileSync(ALTS_PATH, 'utf8'))
    : {};
  const dims = fs.existsSync(DIMS_PATH)
    ? JSON.parse(fs.readFileSync(DIMS_PATH, 'utf8'))
    : {};

  for (const file of files) {
    const input = path.join(PRODUCTS_DIR, file);
    const stem = file.replace(/\.webp$/i, '');
    const baseAlt = alts[file] || '';
    const baseMeta = await sharp(input).metadata();
    dims[file] = { width: baseMeta.width, height: baseMeta.height };
    console.log(`  ${file}`);

    for (const w of PRODUCT_WIDTHS) {
      const logical = `${stem}-${w}`;
      const res = await encodeWebpBuffer(input, w);
      if (res.skipped) {
        console.log(`    skip ${w}w (src ${res.srcW}px)`);
        continue;
      }
      const written = writeHashedVariant(PRODUCTS_DIR, logical, res.buffer, manifest);
      allRemoved.push(...written.removed);
      dims[written.fileName] = { width: res.width, height: res.height };
      record(`assets/img/products/${written.fileName}`, `assets/img/products/${file}`, res);
      console.log(
        `    ${w}w → ${written.fileName} ${res.kb} KB q=${res.quality}${res.over ? ' BÜTÇE AŞILDI' : ''}`
      );
    }

    const tres = await encodeWebpBuffer(input, 200, { thumb: true });
    if (!tres.skipped) {
      const logical = `${stem}-thumb`;
      const written = writeHashedVariant(PRODUCTS_DIR, logical, tres.buffer, manifest);
      allRemoved.push(...written.removed);
      dims[written.fileName] = { width: tres.width, height: tres.height };
      if (baseAlt) alts[written.fileName] = baseAlt;
      alts[`${stem}-thumb`] = baseAlt;
      record(`assets/img/products/${written.fileName}`, `assets/img/products/${file}`, tres);
      console.log(
        `    thumb → ${written.fileName} ${tres.kb} KB q=${tres.quality}${tres.over ? ' BÜTÇE AŞILDI' : ''}`
      );
    }
  }

  fs.writeFileSync(ALTS_PATH, `${JSON.stringify(alts, null, 2)}\n`);
  fs.writeFileSync(DIMS_PATH, `${JSON.stringify(dims, null, 2)}\n`);
  return allRemoved;
}

async function optimizeBlog(manifest) {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => /-cover\.(webp|png|jpe?g)$/i.test(f));
  console.log(`\nBlog kapakları: ${files.length}`);
  const allRemoved = [];

  for (const file of files) {
    const input = path.join(BLOG_DIR, file);
    const stem = file.replace(/\.(webp|png|jpe?g)$/i, '');
    console.log(`  ${file}`);

    const widths = [...new Set([...BLOG_COVER_WIDTHS, ...BLOG_CARD_WIDTHS])].sort((a, b) => a - b);
    for (const w of widths) {
      const logical = `${stem}-${w}`;
      const res = await encodeWebpBuffer(input, w);
      if (res.skipped) {
        console.log(`    skip ${w}w (src ${res.srcW}px)`);
        continue;
      }
      const written = writeHashedVariant(BLOG_DIR, logical, res.buffer, manifest);
      allRemoved.push(...written.removed);
      record(`assets/img/blog/${written.fileName}`, `assets/img/blog/${file}`, res);
      console.log(
        `    ${w}w → ${written.fileName} ${res.kb} KB q=${res.quality}${res.over ? ' BÜTÇE AŞILDI' : ''}`
      );
    }
  }
  return allRemoved;
}

async function verifyHero(manifest) {
  console.log('\nHero doğrulama (hash\'li varyantlar; 1200 yok):');
  const heroBudget = { 480: 45, 720: 70, 960: 100 };
  for (const w of [480, 720, 960]) {
    const logical = `duru-hero-${w}`;
    const name = resolveVariantFile(HERO_DIR, logical, manifest);
    if (!name) {
      console.log(`  EKSİK: ${logical}.*.webp`);
      continue;
    }
    const f = path.join(HERO_DIR, name);
    const st = fs.statSync(f);
    const meta = await sharp(f).metadata();
    const limit = heroBudget[w];
    const over = limit && kb(st.size) > limit;
    console.log(
      `  ${name} ${meta.width}x${meta.height} ${kb(st.size)} KB${over ? ' BÜTÇE AŞILDI' : ''}`
    );
    if (over) {
      budgetExceeded.push({
        file: `assets/img/hero/${name}`,
        outKb: kb(st.size),
        maxKb: limit,
        quality: 'existing',
      });
    }
  }
}

async function main() {
  const manifest = loadManifest();
  const removedProducts = await optimizeProducts(manifest);
  const removedBlog = await optimizeBlog(manifest);
  await verifyHero(manifest);

  const allRemoved = [...removedProducts, ...removedBlog];
  console.log(`\nSilinen eski varyantlar: ${allRemoved.length}`);
  if (allRemoved.length) {
    allRemoved.forEach((f) => console.log(`  - ${f}`));
  } else {
    console.log('  (yok — ilk üretim veya içerik aynı)');
  }

  const reportPath = path.join(ROOT, 'scripts', '_image-optimize-report.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), report, budgetExceeded, removed: allRemoved },
      null,
      2
    )
  );

  console.log(`\nRapor: ${path.relative(ROOT, reportPath)}`);
  if (budgetExceeded.length) {
    console.log('\nBÜTÇE AŞILDI:');
    for (const row of budgetExceeded) {
      console.log(`  ${row.file} → ${row.outKb} KB (limit ${row.maxKb} KB, q=${row.quality})`);
    }
  } else {
    console.log('\nTüm yeni varyantlar bütçe içinde.');
  }

  syncAllImageRefs(manifest);

  console.log('\nDoğrulama…');
  const v = spawnSync('node', ['scripts/validate-image-variants.js'], {
    cwd: ROOT,
    shell: true,
    stdio: 'inherit',
  });
  if (v.status !== 0) process.exitCode = v.status || 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
