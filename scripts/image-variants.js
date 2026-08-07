/**
 * İçerik-hash'li görsel varyant yardımcıları.
 * Biçim: <ad>-<genişlik|thumb>.<hash8>.webp
 * İstisna: <slug>-NN.webp taban dosyalar hash almaz.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'assets', 'data', 'image-variants.json');

function contentHash8(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8);
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return {};
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

function saveManifest(manifest) {
  const sorted = {};
  for (const k of Object.keys(manifest).sort()) sorted[k] = manifest[k];
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(sorted, null, 2)}\n`);
}

/** logicalBase örn. duru-hd50-01-400 | duru-hero-480 | cover-stem-720 */
function hashedFileName(logicalBase, hash) {
  return `${logicalBase}.${hash}.webp`;
}

function variantFileRegex(logicalBase) {
  return new RegExp(`^${escapeRegex(logicalBase)}(?:\\.[a-f0-9]{8})?\\.webp$`, 'i');
}

/** Eski unhashed + önceki hash'li kopyaları sil; silinen adları döndür */
function removePriorVariants(dir, logicalBase, keepName) {
  const removed = [];
  if (!fs.existsSync(dir)) return removed;
  const re = variantFileRegex(logicalBase);
  for (const name of fs.readdirSync(dir)) {
    if (!re.test(name)) continue;
    if (keepName && name === keepName) continue;
    fs.unlinkSync(path.join(dir, name));
    removed.push(path.relative(ROOT, path.join(dir, name)).replace(/\\/g, '/'));
  }
  return removed;
}

/**
 * Buffer'ı hash'leyip yazar; manifest'i günceller.
 * Aynı içerik/hash ise dosyaya dokunmaz (yeniden yazmaz).
 * @returns {{ fileName: string, hash: string, logicalBase: string, removed: string[], wrote: boolean }}
 */
function writeHashedVariant(dir, logicalBase, buffer, manifest) {
  const hash = contentHash8(buffer);
  const fileName = hashedFileName(logicalBase, hash);
  const dest = path.join(dir, fileName);
  const removed = removePriorVariants(dir, logicalBase, fileName);
  let wrote = false;
  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, buffer);
    wrote = true;
  }
  manifest[logicalBase] = fileName;
  return { fileName, hash, logicalBase, removed, wrote };
}

function resolveVariantFile(dir, logicalBase, manifest) {
  const fromManifest = manifest && manifest[logicalBase];
  if (fromManifest && fs.existsSync(path.join(dir, fromManifest))) {
    return fromManifest;
  }
  if (!fs.existsSync(dir)) return null;
  const re = new RegExp(`^${escapeRegex(logicalBase)}\\.[a-f0-9]{8}\\.webp$`, 'i');
  const hit = fs.readdirSync(dir).find((n) => re.test(n));
  if (hit) return hit;
  // Geriye dönük: hash'siz
  const legacy = `${logicalBase}.webp`;
  if (fs.existsSync(path.join(dir, legacy))) return legacy;
  return null;
}

function availableWidths(dir, stem, candidateWidths, manifest) {
  return candidateWidths.filter((w) => resolveVariantFile(dir, `${stem}-${w}`, manifest));
}

function resolveThumb(dir, stem, manifest) {
  return resolveVariantFile(dir, `${stem}-thumb`, manifest);
}

/** index.html hero preload/srcset/img + rozet srcset */
function patchIndexHeroRefs(manifest) {
  const indexPath = path.join(ROOT, 'index.html');
  if (!fs.existsSync(indexPath)) return;
  let html = fs.readFileSync(indexPath, 'utf8');
  const heroDir = path.join(ROOT, 'assets', 'img', 'hero');

  const h480 = resolveVariantFile(heroDir, 'duru-hero-480', manifest);
  const h720 = resolveVariantFile(heroDir, 'duru-hero-720', manifest);
  const h960 = resolveVariantFile(heroDir, 'duru-hero-960', manifest);

  if (h480 && h720 && h960) {
    const srcset = `assets/img/hero/${h480} 480w, assets/img/hero/${h720} 720w, assets/img/hero/${h960} 960w`;
    html = html.replace(
      /imagesrcset="assets\/img\/hero\/duru-hero[^"]*"/,
      `imagesrcset="${srcset}"`
    );
    html = html.replace(
      /href="assets\/img\/hero\/duru-hero-480[^"]*\.webp"/,
      `href="assets/img/hero/${h480}"`
    );
    html = html.replace(
      /(<source\s+type="image\/webp"\s+srcset=")[^"]*(")/,
      `$1${srcset}$2`
    );
    html = html.replace(
      /(<img src=")assets\/img\/hero\/duru-hero-960[^"]*\.webp(")/,
      `$1assets/img/hero/${h960}$2`
    );
  }

  const badge120 = resolveVariantFile(heroDir, '36-yillik-tecrube-120', manifest);
  const badge200 = resolveVariantFile(heroDir, '36-yillik-tecrube-200', manifest);
  if (badge120 && badge200) {
    html = html.replace(
      /src="assets\/img\/hero\/36-yillik-tecrube-120[^"]*\.webp"/,
      `src="assets/img/hero/${badge120}"`
    );
    html = html.replace(
      /srcset="assets\/img\/hero\/36-yillik-tecrube-120[^"]*"/,
      `srcset="assets/img/hero/${badge120} 120w, assets/img/hero/${badge200} 200w"`
    );
  }

  fs.writeFileSync(indexPath, html);
  console.log('  ✓ index.html hero referansları güncellendi');
}

/** Sayfa üreticilerini çalıştır — ürün/blog HTML + JSON yolları */
function rebuildSitePages() {
  console.log('\nHTML yeniden üretiliyor (build:pages)…');
  const r = spawnSync('npm', ['run', 'build:pages'], {
    cwd: ROOT,
    shell: true,
    stdio: 'inherit',
  });
  if (r.status !== 0) {
    throw new Error('build:pages başarısız');
  }
}

function syncAllImageRefs(manifest) {
  saveManifest(manifest);
  patchIndexHeroRefs(manifest);
  rebuildSitePages();
  // build:pages index.html'i ezmez; hero patch'i koru (yeniden uygula)
  patchIndexHeroRefs(loadManifest());
}

module.exports = {
  ROOT,
  MANIFEST_PATH,
  contentHash8,
  loadManifest,
  saveManifest,
  hashedFileName,
  writeHashedVariant,
  removePriorVariants,
  resolveVariantFile,
  availableWidths,
  resolveThumb,
  patchIndexHeroRefs,
  rebuildSitePages,
  syncAllImageRefs,
};
