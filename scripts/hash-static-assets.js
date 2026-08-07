/**
 * Kaynak CSS/JS'ten içerik-hash'li türev üretir, HTML referanslarını günceller.
 * Hash'siz kaynaklar (site.css, main.js …) korunur; yalnızca eski hash'li türevler silinir.
 *
 * Kullanım: node scripts/hash-static-assets.js
 * build:pages içinde de çalışır.
 */
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  HASH_TARGETS,
  loadManifest,
  saveManifest,
  resolveSourcePath,
  writeHashedAsset,
  assetHref,
} = require('./static-asset-hashes');

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'sources',
  'emergent',
  'yigitornek',
]);

function walkHtml(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

/** href/src içindeki mantıksal CSS/JS yolunu hash'liyle değiştir */
function rewriteAssetRef(ref, manifest) {
  if (!ref || /^(https?:|data:|mailto:|#)/i.test(ref)) return ref;
  const clean = ref.split('?')[0].split('#')[0];
  const norm = clean.replace(/\\/g, '/');

  for (const logical of HASH_TARGETS) {
    const base = path.basename(logical);
    const ext = path.extname(logical);
    const stem = base.slice(0, -ext.length);
    // .../assets/css/site.css | .../assets/css/site.abc12345.css
    const re = new RegExp(
      `(assets/${logical.includes('/css/') ? 'css' : 'js'}/${stem})(?:\\.[a-f0-9]{8})?(${ext.replace('.', '\\.')})$`,
      'i'
    );
    const m = norm.match(re);
    if (!m) continue;
    const hashed = assetHref(logical, manifest);
    const prefix = norm.slice(0, m.index);
    return prefix + hashed.slice(hashed.indexOf('assets/'));
  }
  return ref;
}

function patchHtmlFile(filePath, manifest) {
  let html = fs.readFileSync(filePath, 'utf8');
  const before = html;
  html = html.replace(
    /\b(href|src)=["']([^"']+)["']/gi,
    (full, attr, val) => {
      if (!/\.(css|js)(\?|#|$)/i.test(val) && !/assets\/(css|js)\//i.test(val)) {
        return full;
      }
      const next = rewriteAssetRef(val, manifest);
      if (next === val) return full;
      return `${attr}="${next}"`;
    }
  );
  if (html !== before) {
    fs.writeFileSync(filePath, html);
    return true;
  }
  return false;
}

function main() {
  const manifest = loadManifest();
  const removedAll = [];
  const written = [];

  console.log('CSS/JS hash…');
  for (const logical of HASH_TARGETS) {
    const srcPath = resolveSourcePath(logical);
    const buf = fs.readFileSync(srcPath);
    const result = writeHashedAsset(logical, buf, manifest);
    removedAll.push(...result.removed);
    written.push(result);
    console.log(
      `  ${logical} → ${result.fileName}` +
        (result.wrote ? ' (yazıldı)' : ' (aynı hash)') +
        (result.removed.length ? ` | silinen: ${result.removed.length}` : '')
    );
  }
  saveManifest(manifest);

  console.log('\nHTML referansları…');
  const htmls = walkHtml(ROOT);
  let patched = 0;
  for (const f of htmls) {
    if (patchHtmlFile(f, manifest)) patched += 1;
  }
  console.log(`  ${patched}/${htmls.length} HTML güncellendi`);

  console.log('\nSilinen eski hash’li türevler:');
  if (!removedAll.length) console.log('  (yok)');
  else [...new Set(removedAll)].sort().forEach((r) => console.log(`  - ${r}`));

  // Doğrulama: HTML’deki hedeflenen asset’ler diskte var
  let broken = 0;
  let missingSource = 0;
  for (const f of htmls) {
    const html = fs.readFileSync(f, 'utf8');
    const re = /\b(?:href|src)=["']([^"']*assets\/(?:css|js)\/[^"']+\.(?:css|js))["']/gi;
    let m;
    while ((m = re.exec(html))) {
      const raw = m[1].split('?')[0];
      // relative to file
      const abs = path.normalize(path.join(path.dirname(f), raw));
      const absRoot = path.normalize(path.join(ROOT, raw.replace(/^\.\.\//g, '').replace(/^(\.\.\/)+/, '')));
      // try resolve relative
      let resolved = abs;
      if (!fs.existsSync(resolved)) {
        // strip leading ../ chains by joining from ROOT with assets/...
        const idx = raw.replace(/\\/g, '/').indexOf('assets/');
        if (idx !== -1) {
          resolved = path.join(ROOT, raw.replace(/\\/g, '/').slice(idx));
        }
      }
      if (!fs.existsSync(resolved)) {
        console.error(`  KIRIK: ${path.relative(ROOT, f)} → ${raw}`);
        broken += 1;
      }
    }
  }

  // sitePrefix smoke: hashed href'ten prefix çıkar
  const sample = assetHref('assets/css/site.css', manifest);
  const fakeHref = '../../../' + sample;
  const idx = fakeHref.indexOf('assets/');
  const prefix = fakeHref.slice(0, idx);
  const okPrefix = prefix === '../../../';
  console.log(`\nsitePrefix smoke: href="${fakeHref}" → prefix="${prefix}" ${okPrefix ? 'OK' : 'FAIL'}`);

  console.log('\nDisk (kaynak → türev):');
  for (const logical of HASH_TARGETS) {
    const hashed = assetHref(logical, manifest);
    const exists = fs.existsSync(path.join(ROOT, hashed));
    const sourceOk = fs.existsSync(path.join(ROOT, logical));
    if (!sourceOk) missingSource += 1;
    console.log(
      `  ${logical} ${sourceOk ? '✓' : 'EKSIK KAYNAK'} → ${hashed} ${exists ? '✓' : 'EKSIK'}`
    );
  }

  if (broken > 0 || missingSource > 0 || !okPrefix) process.exitCode = 1;
  else console.log('\nHash tamam.');
}

main();
