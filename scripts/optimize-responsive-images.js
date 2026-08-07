/**
 * Ürün + blog raster görsellerinden responsive WebP varyantları üretir.
 * Orijinal <slug>-NN.webp / *-cover.webp dosyalarına dokunmaz.
 *
 * Kullanım: node scripts/optimize-responsive-images.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

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

function isProductVariant(name) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*-\d{2}-(?:\d+|thumb)\.webp$/i.test(name);
}

async function encodeWebp(input, output, width, { losslessPrefer = false, thumb = false } = {}) {
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

  const pipeline = () => {
    let img = sharp(input).rotate().resize({
      width: thumb ? 200 : width,
      height: thumb ? 200 : undefined,
      fit: thumb ? 'cover' : 'inside',
      withoutEnlargement: true,
    });
    if (meta.hasAlpha) {
      // keep alpha
    }
    return img;
  };

  if (losslessPrefer || (meta.channels && meta.channels <= 3 && !meta.hasAlpha && srcW <= 400)) {
    // try lossless for flat/simple; compare later
  }

  // Prefer lossy; for low-color try lossless if smaller
  while (quality >= 65) {
    const buf = await pipeline()
      .webp({ quality, effort: 4, alphaQuality: quality })
      .toBuffer({ resolveWithObject: true });
    lastSize = buf.info.size;
    lastBuf = buf.data;
    if (!maxKb || kb(lastSize) <= maxKb) break;
    quality -= 5;
  }

  if (losslessPrefer || meta.hasAlpha === false) {
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
  }

  fs.writeFileSync(output, lastBuf);
  const outKb = kb(lastSize);
  const over = maxKb && outKb > maxKb;
  if (over) {
    budgetExceeded.push({ file: path.relative(ROOT, output).replace(/\\/g, '/'), outKb, maxKb, quality });
  }

  const outMeta = await sharp(lastBuf).metadata();
  report.push({
    file: path.relative(ROOT, output).replace(/\\/g, '/'),
    src: path.relative(ROOT, input).replace(/\\/g, '/'),
    width: outMeta.width,
    height: outMeta.height,
    kb: outKb,
    quality: usedLossless ? 'lossless' : quality,
    budgetOk: !over,
  });

  return { skipped: false, kb: outKb, quality: usedLossless ? 'lossless' : quality, over };
}

async function optimizeProducts() {
  const files = fs.readdirSync(PRODUCTS_DIR).filter(isBaseProduct);
  console.log(`\nÜrün taban görselleri: ${files.length}`);

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
      const outName = `${stem}-${w}.webp`;
      const out = path.join(PRODUCTS_DIR, outName);
      const res = await encodeWebp(input, out, w);
      if (res.skipped) {
        console.log(`    skip ${w}w (src ${res.srcW}px)`);
      } else {
        const m = await sharp(out).metadata();
        dims[outName] = { width: m.width, height: m.height };
        console.log(`    ${w}w → ${res.kb} KB q=${res.quality}${res.over ? ' BÜTÇE AŞILDI' : ''}`);
      }
    }

    const thumbName = `${stem}-thumb.webp`;
    const thumbOut = path.join(PRODUCTS_DIR, thumbName);
    const tres = await encodeWebp(input, thumbOut, 200, { thumb: true });
    if (!tres.skipped) {
      const m = await sharp(thumbOut).metadata();
      dims[thumbName] = { width: m.width, height: m.height };
      console.log(`    thumb → ${tres.kb} KB q=${tres.quality}${tres.over ? ' BÜTÇE AŞILDI' : ''}`);
      if (baseAlt) alts[thumbName] = baseAlt;
    }
  }

  fs.writeFileSync(ALTS_PATH, `${JSON.stringify(alts, null, 2)}\n`);
  fs.writeFileSync(DIMS_PATH, `${JSON.stringify(dims, null, 2)}\n`);
}

async function optimizeBlog() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => /-cover\.(webp|png|jpe?g)$/i.test(f));
  console.log(`\nBlog kapakları: ${files.length}`);

  for (const file of files) {
    const input = path.join(BLOG_DIR, file);
    const stem = file.replace(/\.(webp|png|jpe?g)$/i, '');
    console.log(`  ${file}`);

    // Cover page: 720, 1200; card: 400, 800 — union set
    const widths = [...new Set([...BLOG_COVER_WIDTHS, ...BLOG_CARD_WIDTHS])].sort((a, b) => a - b);
    for (const w of widths) {
      const out = path.join(BLOG_DIR, `${stem}-${w}.webp`);
      const res = await encodeWebp(input, out, w, { losslessPrefer: false });
      if (res.skipped) {
        console.log(`    skip ${w}w (src ${res.srcW}px)`);
      } else {
        console.log(`    ${w}w → ${res.kb} KB q=${res.quality}${res.over ? ' BÜTÇE AŞILDI' : ''}`);
      }
    }
  }
}

async function verifyHero() {
  console.log('\nHero doğrulama (mevcut varyantlar; 1200 üretilmez):');
  const heroBudget = { 480: 45, 720: 70, 960: 100 };
  for (const w of [480, 720, 960]) {
    const f = path.join(HERO_DIR, `duru-hero-${w}.webp`);
    if (!fs.existsSync(f)) {
      console.log(`  EKSİK: duru-hero-${w}.webp`);
      continue;
    }
    const st = fs.statSync(f);
    const meta = await sharp(f).metadata();
    const limit = heroBudget[w];
    const over = limit && kb(st.size) > limit;
    console.log(
      `  duru-hero-${w}.webp ${meta.width}x${meta.height} ${kb(st.size)} KB${over ? ' BÜTÇE AŞILDI' : ''}`
    );
    if (over) {
      budgetExceeded.push({
        file: `assets/img/hero/duru-hero-${w}.webp`,
        outKb: kb(st.size),
        maxKb: limit,
        quality: 'existing',
      });
    }
  }
  const legacy1200 = path.join(HERO_DIR, 'duru-hero-1200.webp');
  if (fs.existsSync(legacy1200)) {
    console.log('  UYARI: duru-hero-1200.webp hâlâ var — silinmeli');
  }
}

async function main() {
  await optimizeProducts();
  await optimizeBlog();
  await verifyHero();

  const reportPath = path.join(ROOT, 'scripts', '_image-optimize-report.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), report, budgetExceeded }, null, 2)
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
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
