/**
 * CSS/JS içerik-hash yardımcıları.
 * Biçim: <ad>.<hash8>.<css|js>
 * Manifest: assets/data/static-asset-hashes.json
 *
 * Mantıksal anahtar örn. "assets/css/site.css" → "assets/css/site.a3f9c1d2.css"
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'assets', 'data', 'static-asset-hashes.json');

/** Yayınlanacak / hash'lenecek mantıksal yollar (repo köküne göre) */
const HASH_TARGETS = [
  'assets/css/site.css',
  'assets/css/blog.css',
  'assets/css/pdf-export.css',
  'assets/css/compare-print.css',
  'assets/js/main.js',
  'assets/js/compare.js',
  'assets/js/pdf-utils.js',
  'assets/js/compare-pdf.js',
  'assets/js/quote-form.js',
  'assets/js/quote-pdf.js',
];

function contentHash8(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8);
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return {};
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

function saveManifest(manifest) {
  const sorted = {};
  for (const k of Object.keys(manifest).sort()) sorted[k] = manifest[k];
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(sorted, null, 2)}\n`);
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** site.css → { dir, base: 'site', ext: '.css' } */
function splitLogical(logicalRel) {
  const abs = path.join(ROOT, logicalRel);
  const dir = path.dirname(abs);
  const ext = path.extname(abs);
  const base = path.basename(abs, ext);
  return { abs, dir, base, ext, logicalRel };
}

function hashedName(base, hash, ext) {
  return `${base}.${hash}${ext}`;
}

/** Kaynak: hash'siz varsa onu, yoksa mevcut hash'liyi oku */
function resolveSourcePath(logicalRel) {
  const { abs, dir, base, ext } = splitLogical(logicalRel);
  if (fs.existsSync(abs)) return abs;
  const re = new RegExp(`^${escapeRegex(base)}\\.[a-f0-9]{8}${escapeRegex(ext)}$`, 'i');
  if (!fs.existsSync(dir)) {
    throw new Error(`Kaynak yok: ${logicalRel}`);
  }
  const hit = fs.readdirSync(dir).find((n) => re.test(n));
  if (hit) return path.join(dir, hit);
  throw new Error(`Kaynak yok: ${logicalRel}`);
}

/**
 * İçeriği hash'leyip yazar; yalnızca ESKİ hash'li türevleri siler.
 * Hash'siz kaynak (site.css, main.js …) KORUNUR.
 * @returns {{ logical: string, fileName: string, relHashed: string, removed: string[], wrote: boolean, hash: string }}
 */
function writeHashedAsset(logicalRel, buffer, manifest) {
  const { dir, base, ext, abs } = splitLogical(logicalRel);
  fs.mkdirSync(dir, { recursive: true });
  const hash = contentHash8(buffer);
  const fileName = hashedName(base, hash, ext);
  const dest = path.join(dir, fileName);
  const hashedOnlyRe = new RegExp(
    `^${escapeRegex(base)}\\.[a-f0-9]{8}${escapeRegex(ext)}$`,
    'i'
  );
  const removed = [];
  const sourceName = path.basename(abs);

  for (const name of fs.readdirSync(dir)) {
    if (name === sourceName) continue; // kaynak dokunulmaz
    if (name === fileName) continue;
    if (!hashedOnlyRe.test(name)) continue;
    fs.unlinkSync(path.join(dir, name));
    removed.push(path.relative(ROOT, path.join(dir, name)).replace(/\\/g, '/'));
  }

  let wrote = false;
  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, buffer);
    wrote = true;
  } else {
    // Aynı hash — içerik zaten doğru
    const existing = fs.readFileSync(dest);
    if (!existing.equals(buffer)) {
      fs.writeFileSync(dest, buffer);
      wrote = true;
    }
  }

  const relHashed = path.relative(ROOT, dest).replace(/\\/g, '/');
  manifest[logicalRel] = relHashed;
  return { logical: logicalRel, fileName, relHashed, removed, wrote, hash };
}

/** Mantıksal yol → güncel hash'li relatif yol (yoksa mantıksal) */
function assetHref(logicalRel, manifest) {
  const m = manifest || loadManifest();
  return m[logicalRel] || logicalRel;
}

module.exports = {
  ROOT,
  MANIFEST_PATH,
  HASH_TARGETS,
  contentHash8,
  loadManifest,
  saveManifest,
  resolveSourcePath,
  writeHashedAsset,
  assetHref,
  splitLogical,
};
