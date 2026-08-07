/**
 * Hash'li görsel varyant + taban dosya doğrulaması / referans taraması.
 *
 * Kapsam (HTML): src, srcset, href, data-src, data-srcset, imagesrcset,
 *   og:image / twitter:image content
 * Kapsam (JSON): product-images, product-image-alts, urunler, product-seo,
 *   image-variants
 * Kapsam (JS): assets/js içindeki string literal görsel yolları
 * Disk: products/blog/hero altındaki tüm webp/png/jpg (hash'li + taban)
 *
 * node scripts/validate-image-variants.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'emergent', 'yigitornek', 'sources']);

const IMG_DIRS = [
  path.join(ROOT, 'assets', 'img', 'products'),
  path.join(ROOT, 'assets', 'img', 'blog'),
  path.join(ROOT, 'assets', 'img', 'hero'),
];

const JSON_FILES = [
  'assets/data/product-images.json',
  'assets/data/product-image-alts.json',
  'assets/data/urunler.json',
  'assets/data/product-seo.json',
  'assets/data/image-variants.json',
];

/** Ürün taban: slug-NN.webp — hash YOK */
const BASE_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*-\d{2}\.webp$/i;
/** Hash sızmış taban (yasak): slug-NN.hash.webp */
const HASHED_BASE_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*-\d{2}\.[a-f0-9]{8}\.webp$/i;

function walk(dir, pred, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(p, pred, acc);
    } else if (pred(e.name, p)) acc.push(p);
  }
  return acc;
}

function rel(p) {
  return path.relative(ROOT, p).replace(/\\/g, '/');
}

function extractSrcsetUrls(value) {
  return String(value || '')
    .split(',')
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function pushRef(refs, source, raw, baseDir) {
  if (!raw) return;
  let url = String(raw).trim();
  if (!url || /^(https?:\/\/|data:|mailto:|tel:|#)/i.test(url)) {
    // Mutlak site URL → köke çevir
    const m = url.match(/^https?:\/\/(?:www\.)?duruulvteknoloji\.com\.tr\/(.+)$/i);
    if (!m) return;
    url = m[1];
    baseDir = ROOT;
  }
  const clean = url.split('?')[0];
  if (!/\.(webp|png|jpe?g|gif|svg|avif)$/i.test(clean)) return;

  let abs;
  if (clean.startsWith('/') || /^[a-z]:\\/i.test(clean)) {
    abs = path.normalize(path.join(ROOT, clean.replace(/^\//, '')));
  } else if (baseDir === ROOT || clean.startsWith('assets/')) {
    abs = path.normalize(path.join(ROOT, clean));
  } else {
    abs = path.normalize(path.join(baseDir, clean));
  }

  refs.push({
    source: source.replace(/\\/g, '/'),
    ref: clean.replace(/\\/g, '/'),
    abs,
    exists: fs.existsSync(abs),
  });
}

function collectHtmlRefs() {
  const refs = [];
  const htmls = walk(ROOT, (name) => name.endsWith('.html'));
  const attrRe =
    /\b(?:src|href|data-src|data-srcset|imagesrcset|srcset)=["']([^"']+)["']/gi;
  const metaRe =
    /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
  const metaReAlt =
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*>/gi;

  for (const file of htmls) {
    const html = fs.readFileSync(file, 'utf8');
    const baseDir = path.dirname(file);
    let m;
    attrRe.lastIndex = 0;
    while ((m = attrRe.exec(html))) {
      const attr = m[0].match(/^\s*([a-z-]+)=/i)?.[1]?.toLowerCase() || '';
      const urls =
        attr === 'srcset' || attr === 'data-srcset' || attr === 'imagesrcset'
          ? extractSrcsetUrls(m[1])
          : [m[1]];
      for (const u of urls) pushRef(refs, rel(file), u, baseDir);
    }
    for (const re of [metaRe, metaReAlt]) {
      re.lastIndex = 0;
      while ((m = re.exec(html))) {
        pushRef(refs, rel(file), m[1], ROOT);
      }
    }
  }
  return refs;
}

function collectJsonRefs() {
  const refs = [];

  function walkObj(obj, source, trail) {
    if (obj == null) return;
    if (typeof obj === 'string') {
      if (/\.(webp|png|jpe?g|gif|svg|avif)$/i.test(obj) || obj.includes('assets/img/')) {
        // image-variants değerleri sadece dosya adı olabilir
        const candidate = obj.includes('/')
          ? obj
          : guessJsonImagePath(obj, source);
        if (candidate) pushRef(refs, `${source}${trail}`, candidate, ROOT);
      }
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => walkObj(v, source, `${trail}[${i}]`));
      return;
    }
    if (typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) {
        walkObj(v, source, `${trail}.${k}`);
      }
    }
  }

  function guessJsonImagePath(fileName, source) {
    if (!/\.(webp|png|jpe?g)$/i.test(fileName)) return null;
    // product-images / alts / variants → products (veya hero/blog adına göre)
    if (/cover|detail|sis-ufleme|ulv-|blog/i.test(fileName) || source.includes('blog')) {
      const p = path.join(ROOT, 'assets/img/blog', fileName);
      if (fs.existsSync(p)) return `assets/img/blog/${fileName}`;
    }
    if (/hero|36-yillik|duru-hero/i.test(fileName)) {
      return `assets/img/hero/${fileName}`;
    }
    // image-variants logical keys map to filename values
    if (source.includes('image-variants')) {
      // try products, blog, hero
      for (const sub of ['products', 'blog', 'hero']) {
        const p = path.join(ROOT, 'assets/img', sub, fileName);
        if (fs.existsSync(p)) return `assets/img/${sub}/${fileName}`;
      }
      // missing — still record under products as default for broken check
      return `assets/img/products/${fileName}`;
    }
    return `assets/img/products/${fileName}`;
  }

  for (const relPath of JSON_FILES) {
    const abs = path.join(ROOT, relPath);
    if (!fs.existsSync(abs)) continue;
    const data = JSON.parse(fs.readFileSync(abs, 'utf8'));
    walkObj(data, relPath, '');
  }
  return refs;
}

function collectJsRefs() {
  const refs = [];
  const jsDir = path.join(ROOT, 'assets', 'js');
  if (!fs.existsSync(jsDir)) return refs;
  // Tam yol veya dosya adı; '-01.webp' gibi sonek birleştirmelerini atla
  const strRe =
    /['"`]((?:[^'"`]*\/)?[a-z0-9][a-z0-9._-]*\.(?:webp|png|jpe?g|gif|svg|avif))['"`]/gi;
  for (const name of fs.readdirSync(jsDir)) {
    if (!name.endsWith('.js')) continue;
    const file = path.join(jsDir, name);
    const text = fs.readFileSync(file, 'utf8');
    let m;
    strRe.lastIndex = 0;
    while ((m = strRe.exec(text))) {
      const raw = m[1];
      if (/^-\d{2}\.webp$/i.test(raw)) continue;
      pushRef(refs, rel(file), raw, ROOT);
    }
  }
  return refs;
}

/** Diskteki tüm raster'lar: hash'li varyant + taban (slug-NN) + yedek alias */
function listDiskImages() {
  const files = [];
  const rasterRe = /\.(webp|png|jpe?g)$/i;
  for (const dir of IMG_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!rasterRe.test(name)) continue;
      files.push(path.join(dir, name));
    }
  }
  return files;
}

function listBaseProducts() {
  const dir = path.join(ROOT, 'assets', 'img', 'products');
  const urunler = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'assets/data/urunler.json'), 'utf8')
  );
  const expected = [];
  for (const p of urunler.urunler) {
    const name = `${p.slug}-01.webp`;
    const abs = path.join(dir, name);
    expected.push({
      slug: p.slug,
      file: `assets/img/products/${name}`,
      exists: fs.existsSync(abs),
      hashedIllegally: fs
        .readdirSync(dir)
        .some((f) => HASHED_BASE_RE.test(f) && f.startsWith(`${p.slug}-01.`)),
    });
  }
  const hashedBases = fs.readdirSync(dir).filter((f) => HASHED_BASE_RE.test(f));
  return { expected, hashedBases };
}

function printTable(headers, rows) {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => String(r[i] ?? '').length))
  );
  const line = (cols) =>
    cols.map((c, i) => String(c).padEnd(widths[i])).join('  ');
  console.log(line(headers));
  console.log(widths.map((w) => '-'.repeat(w)).join('  '));
  for (const r of rows) console.log(line(r));
}

function main() {
  const htmlRefs = collectHtmlRefs();
  const jsonRefs = collectJsonRefs();
  const jsRefs = collectJsRefs();
  const allRefs = [...htmlRefs, ...jsonRefs, ...jsRefs];

  // Kırık yollar
  const broken = allRefs.filter((r) => !r.exists);
  const brokenUnique = [];
  const seenBroken = new Set();
  for (const b of broken) {
    const k = `${b.source}|${b.ref}`;
    if (seenBroken.has(k)) continue;
    seenBroken.add(k);
    brokenUnique.push(b);
  }

  // Referanslanan dosya adları (normalize)
  const referencedAbs = new Set(
    allRefs.filter((r) => r.exists).map((r) => path.normalize(r.abs))
  );
  // String birleştirme sözleşmesi: bilinen ürünlerin products/<slug>-NN.webp
  const productsDir = path.join(ROOT, 'assets', 'img', 'products');
  const urunler = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'assets/data/urunler.json'), 'utf8')
  );
  const productSlugs = new Set(urunler.urunler.map((p) => p.slug));
  if (fs.existsSync(productsDir)) {
    for (const name of fs.readdirSync(productsDir)) {
      if (!BASE_RE.test(name)) continue;
      const slug = name.replace(/-\d{2}\.webp$/i, '');
      if (!productSlugs.has(slug)) continue;
      referencedAbs.add(path.normalize(path.join(productsDir, name)));
    }
  }

  const diskImages = listDiskImages();
  const orphans = diskImages.filter((f) => !referencedAbs.has(path.normalize(f)));

  const bases = listBaseProducts();

  console.log('=== 1) Kırık referanslar (ref → disk yok) ===');
  console.log(`Toplam ref: ${allRefs.length} | Kırık: ${brokenUnique.length}`);
  if (brokenUnique.length) {
    printTable(
      ['Kaynak', 'Referans'],
      brokenUnique.slice(0, 80).map((b) => [b.source, b.ref])
    );
  } else {
    console.log('(yok)');
  }

  console.log('\n=== 2) Yetim görseller (diskte var, referans yok) ===');
  console.log(
    `Disk raster (varyant+taban): ${diskImages.length} | Yetim: ${orphans.length}`
  );
  if (orphans.length) {
    printTable(
      ['Dosya'],
      orphans.map((f) => [rel(f)])
    );
  } else {
    console.log('(yok)');
  }

  console.log('\n=== 3) Taban <slug>-01.webp (hash YOK, yerinde) ===');
  printTable(
    ['Slug', 'Dosya', 'Var', 'Hash sızmış?'],
    bases.expected.map((b) => [
      b.slug,
      b.file,
      b.exists ? 'evet' : 'HAYIR',
      b.hashedIllegally ? 'EVET!' : 'hayır',
    ])
  );
  if (bases.hashedBases.length) {
    console.log('\nYasak hash\'li taban dosyalar:');
    bases.hashedBases.forEach((f) => console.log(' ', f));
  }

  // Galeri / PDF sözleşme smoke
  console.log('\n=== 4) Galeri + PDF sözleşme (duru-k100) ===');
  const page = path.join(
    ROOT,
    'urunler/termal-sisleme/duru-k100/index.html'
  );
  const html = fs.readFileSync(page, 'utf8');
  const thumbs = [...html.matchAll(/data-gallery-thumb([^>]*)>/g)];
  const main = html.match(/data-gallery-main([^>]*)>/);
  const checks = [];
  function attr(s, name) {
    const m = s.match(new RegExp(`${name}="([^"]*)"`));
    return m ? m[1] : '';
  }
  if (main) {
    const src = attr(main[1], 'src');
    const srcset = attr(main[1], 'srcset');
    checks.push(['gallery-main src', src, fs.existsSync(path.join(path.dirname(page), src)) ? 'OK' : 'EKSIK']);
    checks.push(['gallery-main srcset', srcset ? 'var' : 'yok', srcset ? 'OK' : 'EKSIK']);
  }
  thumbs.forEach((t, i) => {
    const ds = attr(t[1], 'data-src');
    const dss = attr(t[1], 'data-srcset');
    const img = (t[1].match(/<img[^>]*src="([^"]*)"/) || [])[1] ||
      html.slice(t.index, t.index + 400).match(/<img[^>]*src="([^"]*)"/)?.[1];
    // thumb button is self-closing in our markup with img inside — re-read block
    checks.push([`thumb[${i}] data-src`, ds || '—', ds && fs.existsSync(path.join(path.dirname(page), ds)) ? 'OK' : 'EKSIK']);
    if (dss) {
      const first = extractSrcsetUrls(dss)[0];
      checks.push([
        `thumb[${i}] data-srcset`,
        first || '—',
        first && fs.existsSync(path.join(path.dirname(page), first)) ? 'OK' : 'EKSIK',
      ]);
    }
  });
  // Re-parse thumbs properly for img src
  const thumbBlocks = html.match(/<button[^>]*data-gallery-thumb[\s\S]*?<\/button>/g) || [];
  thumbBlocks.forEach((block, i) => {
    const imgSrc = (block.match(/<img[^>]*src="([^"]*)"/) || [])[1];
    if (imgSrc) {
      checks.push([
        `thumb[${i}] img`,
        imgSrc,
        fs.existsSync(path.join(path.dirname(page), imgSrc)) ? 'OK' : 'EKSIK',
      ]);
    }
  });
  const base01 = path.join(ROOT, 'assets/img/products/duru-k100-01.webp');
  checks.push(['compare/pdf -01.webp', 'duru-k100-01.webp', fs.existsSync(base01) ? 'OK' : 'EKSIK']);
  printTable(['Kontrol', 'Değer', 'Durum'], checks);

  const mainJs = fs.readFileSync(path.join(ROOT, 'assets/js/main.js'), 'utf8');
  const pdfJs = fs.readFileSync(path.join(ROOT, 'assets/js/compare-pdf.js'), 'utf8');
  console.log(
    '\nmain.js srcset sync:',
    /dataset\.srcset/.test(mainJs) ? 'OK (applyIndex/lightbox)' : 'EKSIK'
  );
  console.log(
    'compare-pdf -01.webp:',
    /slug \+ '-01\.webp'/.test(pdfJs) || /'-01\.webp'/.test(pdfJs) ? 'OK' : 'EKSIK'
  );

  const fail =
    brokenUnique.length > 0 ||
    orphans.length > 0 ||
    bases.expected.some((b) => !b.exists || b.hashedIllegally) ||
    bases.hashedBases.length > 0;

  process.exit(fail ? 1 : 0);
}

main();
