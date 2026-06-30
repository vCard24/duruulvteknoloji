/**
 * URUN_GORSEL_ALT_METINLERI.md dosyasındaki alt metinleri ürün sayfalarına uygular.
 * Proje kökündeki *.webp dosyalarını assets/img/products/ altına taşır.
 *
 * Kullanım: node scripts/apply-product-image-alts.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MD_PATH = path.join(ROOT, 'URUN_GORSEL_ALT_METINLERI.md');
const URUNLER_PATH = path.join(ROOT, 'assets/data/urunler.json');
const MANIFEST_PATH = path.join(ROOT, 'assets/data/product-images.json');
const ALTS_PATH = path.join(ROOT, 'assets/data/product-image-alts.json');
const PRODUCTS_IMG_DIR = path.join(ROOT, 'assets/img/products');

const ROW_RE = /^\|\s*`([^`]+\.webp)`\s*\|[^|]*\|\s*`([^`]+)`\s*\|/;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugFromFileName(fileName) {
  return fileName.replace(/-\d{2}\.webp$/, '');
}

function parseAltMd(content) {
  const byFile = {};
  const bySlug = {};

  for (const line of content.split('\n')) {
    const m = line.match(ROW_RE);
    if (!m) continue;
    const fileName = m[1].trim();
    const alt = m[2].trim();
    byFile[fileName] = alt;
    const slug = slugFromFileName(fileName);
    if (!bySlug[slug]) bySlug[slug] = [];
    bySlug[slug].push(fileName);
  }

  for (const slug of Object.keys(bySlug)) {
    bySlug[slug].sort((a, b) => {
      const na = parseInt(a.match(/-(\d{2})\.webp$/)[1], 10);
      const nb = parseInt(b.match(/-(\d{2})\.webp$/)[1], 10);
      return na - nb;
    });
  }

  return { byFile, bySlug };
}

function syncRootWebp() {
  const moved = [];
  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.webp')) continue;
    const src = path.join(ROOT, entry.name);
    const dest = path.join(PRODUCTS_IMG_DIR, entry.name);
    fs.mkdirSync(PRODUCTS_IMG_DIR, { recursive: true });
    if (fs.existsSync(dest)) fs.unlinkSync(dest);
    fs.copyFileSync(src, dest);
    fs.unlinkSync(src);
    moved.push(entry.name);
  }
  return moved;
}

function galleryHtml(files, byFile, prefix) {
  const mainFile = files[0];
  const mainAlt = byFile[mainFile];
  const mainSrc = `${prefix}assets/img/products/${mainFile}`;

  const thumbs = files
    .map((file, i) => {
      const alt = byFile[file];
      const src = `${prefix}assets/img/products/${file}`;
      const active = i === 0 ? ' is-active' : '';
      return `<button type="button" class="product-gallery__thumb${active}" data-gallery-thumb data-src="${src}" data-alt="${esc(alt)}" aria-label="Görsel ${i + 1}"><img src="${src}" alt="${esc(alt)}" loading="lazy"></button>`;
    })
    .join('\n            ');

  return `<div data-product-gallery>
          <div class="product-gallery__main">
            <img data-gallery-main src="${mainSrc}" alt="${esc(mainAlt)}">
          </div>
          <div class="product-gallery__thumbs">
            ${thumbs}
          </div>
        </div>`;
}

const GALLERY_RE =
  /<div data-product-gallery>\s*<div class="[^"]*product-gallery__main[^"]*">[\s\S]*?<\/div>\s*<div class="product-gallery__thumbs">[\s\S]*?<\/div>\s*<\/div>/;

function main() {
  if (!fs.existsSync(MD_PATH)) {
    console.error('Dosya bulunamadı:', MD_PATH);
    process.exit(1);
  }

  const { byFile, bySlug } = parseAltMd(fs.readFileSync(MD_PATH, 'utf8'));
  const urunler = JSON.parse(fs.readFileSync(URUNLER_PATH, 'utf8')).urunler;

  const moved = syncRootWebp();
  if (moved.length) {
    console.log('Proje kökünden taşınan görseller:', moved.join(', '));
  }

  fs.mkdirSync(PRODUCTS_IMG_DIR, { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(bySlug, null, 2) + '\n', 'utf8');
  fs.writeFileSync(ALTS_PATH, JSON.stringify(byFile, null, 2) + '\n', 'utf8');

  const updated = [];
  const missingPages = [];
  const missingImages = [];
  const slugMismatches = [];

  for (const product of urunler) {
    const pagePath = path.join(ROOT, 'urunler', product.kategori_slug, product.slug, 'index.html');
    const files = bySlug[product.slug];

    if (!files || !files.length) {
      slugMismatches.push(`${product.slug} — URUN_GORSEL_ALT_METINLERI.md içinde görsel listesi yok`);
      continue;
    }

    if (!fs.existsSync(pagePath)) {
      missingPages.push(pagePath);
      continue;
    }

    for (const file of files) {
      if (!fs.existsSync(path.join(PRODUCTS_IMG_DIR, file))) {
        missingImages.push(file);
      }
    }

    let html = fs.readFileSync(pagePath, 'utf8');
    if (!GALLERY_RE.test(html)) {
      missingPages.push(`${pagePath} — data-product-gallery bloğu bulunamadı`);
      continue;
    }

    const prefix = '../../../';
    const newGallery = galleryHtml(files, byFile, prefix);
    html = html.replace(GALLERY_RE, newGallery);
    fs.writeFileSync(pagePath, html, 'utf8');
    updated.push(`${product.slug} (${files.length} görsel)`);
  }

  console.log('\n=== Özet ===');
  console.log(`Güncellenen ürün sayfası: ${updated.length}`);
  updated.forEach((line) => console.log('  ✓', line));

  if (missingImages.length) {
    console.log(`\nBulunamayan görsel dosyası (${[...new Set(missingImages)].length}):`);
    [...new Set(missingImages)].forEach((f) => console.log('  ✗', f));
  } else {
    console.log('\nBulunamayan görsel dosyası: yok');
  }

  if (slugMismatches.length) {
    console.log(`\nEşleşmeyen slug (${slugMismatches.length}):`);
    slugMismatches.forEach((line) => console.log('  ✗', line));
  }

  if (missingPages.length) {
    console.log(`\nSayfa / galeri sorunu (${missingPages.length}):`);
    missingPages.forEach((line) => console.log('  ✗', line));
  }

  console.log(`\nManifest: ${MANIFEST_PATH}`);
  console.log(`Alt metinler: ${ALTS_PATH}`);
  console.log(`MD satır sayısı (görsel): ${Object.keys(byFile).length}`);
}

main();
