/**
 * Kaynak ürün görsellerini yeniden adlandırır ve assets/img/products/ altına kopyalar.
 *
 * Kaynak: Desktop\DURU_KATALOG 2026 Folder\gorseller\{ürün klasörü}\
 * Hedef isim: {slug}-01.webp, {slug}-02.webp, ...
 *
 * Kullanım: node scripts/import-product-images.js
 */
const fs = require('fs');
const path = require('path');

const SOURCE_ROOT = path.join(
  process.env.USERPROFILE || '',
  'Desktop',
  'DURU_KATALOG 2026 Folder',
  'gorseller'
);
const DEST_ROOT = path.join(__dirname, '..', 'assets', 'img', 'products');
const MANIFEST_PATH = path.join(__dirname, '..', 'assets', 'data', 'product-images.json');
const URUNLER_PATH = path.join(__dirname, '..', 'assets', 'data', 'urunler.json');

const PRODUCT_SLUGS = new Set(
  JSON.parse(fs.readFileSync(URUNLER_PATH, 'utf8')).urunler.map((p) => p.slug)
);

const FOLDER_TO_SLUG = {
  'Duru HD1800': 'duru-hd1800',
  'Duru HD5': 'duru-hd5',
  'Duru HD50': 'duru-hd50',
  'Duru HD75': 'duru-hd75',
  'Duru HR5': 'duru-hr5',
  'Duru Max10': 'duru-max10',
  'Duru Max5': 'duru-max5',
  'Duru Mist Blower 15HP (400L)': 'duru-mist-blower-15hp',
  'Duru Plus': 'duru-plus',
  'Duru Sırt10': 'duru-sirt10',
  'Duru X10': 'duru-x10',
  'Duru X20': 'duru-x20',
  'Entosis 20': 'entosis-20',
  'Entosis 50': 'entosis-50',
  'Entosis Mist Blower (500L)': 'entosis-mist-blower-500l',
  'Sera Max 50': 'sera-max-50',
  'Sera Plus 20': 'sera-plus-20',
  'Sera Ultra 20': 'sera-ultra-20',
};

const IMAGE_EXT = /\.(webp|jpe?g|png)$/i;

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSortKey(fileName, productLabel) {
  const base = path.basename(fileName).replace(IMAGE_EXT, '');

  if (base === productLabel) return [0, 0];

  const dashMatch = base.match(new RegExp(`^${escapeRegex(productLabel)}-(\\d+)$`));
  if (dashMatch) return [1, parseInt(dashMatch[1], 10)];

  const parenMatch = base.match(new RegExp(`^${escapeRegex(productLabel)} \\((\\d+)\\)$`));
  if (parenMatch) return [1, parseInt(parenMatch[1], 10)];

  return [2, base.localeCompare(productLabel)];
}

function sortImages(files, productLabel) {
  return files
    .filter((f) => IMAGE_EXT.test(f))
    .sort((a, b) => {
      const ka = getSortKey(a, productLabel);
      const kb = getSortKey(b, productLabel);
      if (ka[0] !== kb[0]) return ka[0] - kb[0];
      if (ka[1] !== kb[1]) return ka[1] - kb[1];
      return a.localeCompare(b, 'tr');
    });
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function resolveFolderSlug(folderName) {
  if (PRODUCT_SLUGS.has(folderName)) return folderName;
  if (FOLDER_TO_SLUG[folderName]) return FOLDER_TO_SLUG[folderName];

  const normalized = folderName.normalize('NFC');
  for (const [key, slug] of Object.entries(FOLDER_TO_SLUG)) {
    if (key.normalize('NFC') === normalized) return slug;
  }
  return null;
}

function main() {
  if (!fs.existsSync(SOURCE_ROOT)) {
    console.error('Kaynak klasör bulunamadı:', SOURCE_ROOT);
    process.exit(1);
  }

  fs.mkdirSync(DEST_ROOT, { recursive: true });

  const manifest = {};
  const folders = fs.readdirSync(SOURCE_ROOT, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const entry of folders) {
    const productLabel = entry.name;
    const slug = resolveFolderSlug(productLabel);
    if (!slug) {
      console.warn('Slug eşleşmesi yok, atlanıyor:', productLabel);
      continue;
    }

    const folderPath = path.join(SOURCE_ROOT, productLabel);
    const files = fs.readdirSync(folderPath);
    const sortLabel = slug;
    const sorted = sortImages(files, sortLabel);

    if (!sorted.length) {
      console.warn('Görsel yok:', productLabel);
      continue;
    }

    const slugFolderPath = path.join(SOURCE_ROOT, slug);
    if (folderPath !== slugFolderPath && !fs.existsSync(slugFolderPath)) {
      fs.renameSync(folderPath, slugFolderPath);
      console.log('Klasör yeniden adlandırıldı:', productLabel, '→', slug);
    }

    const workFolder = fs.existsSync(slugFolderPath) ? slugFolderPath : folderPath;
    const renamed = [];

    sorted.forEach((file, index) => {
      const targetName = `${slug}-${pad2(index + 1)}.webp`;
      const srcPath = path.join(workFolder, file);
      const renamedPath = path.join(workFolder, targetName);

      if (srcPath !== renamedPath) {
        if (fs.existsSync(renamedPath)) fs.unlinkSync(renamedPath);
        fs.renameSync(srcPath, renamedPath);
      }

      const destPath = path.join(DEST_ROOT, targetName);
      fs.copyFileSync(renamedPath, destPath);
      renamed.push(targetName);
    });

    manifest[slug] = renamed;
    console.log(`${slug}: ${renamed.length} görsel → ${renamed.join(', ')}`);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log('\nManifest yazıldı:', MANIFEST_PATH);
  console.log('Toplam ürün:', Object.keys(manifest).length);
}

main();
