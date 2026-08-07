const fs = require('fs');
const path = require('path');
const {
  loadManifest,
  assetHref,
  HASH_TARGETS,
} = require('./static-asset-hashes');

const ROOT = path.join(__dirname, '..');
const m = loadManifest();

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'sources', 'emergent'].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (e.name.endsWith('.html')) a.push(p);
  }
  return a;
}

let broken = 0;
let total = 0;
let unhashed = 0;
const unhashedRe =
  /assets\/(css|js)\/(site|blog|pdf-export|compare-print|main|compare|pdf-utils|compare-pdf|quote-form|quote-pdf)\.(css|js)$/;

for (const f of walk(ROOT)) {
  const html = fs.readFileSync(f, 'utf8');
  const re =
    /\b(?:href|src)=["']([^"']*assets\/(?:css|js)\/[^"']+)["']/gi;
  let x;
  while ((x = re.exec(html))) {
    total += 1;
    const raw = x[1].split('?')[0].replace(/\\/g, '/');
    const idx = raw.indexOf('assets/');
    const rel = idx === -1 ? raw : raw.slice(idx);
    if (unhashedRe.test(rel)) {
      unhashed += 1;
      console.log('UNHASHED', path.relative(ROOT, f), rel);
    }
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      broken += 1;
      console.log('BROKEN', path.relative(ROOT, f), rel);
    }
  }
}

let missingSource = 0;
console.log({ totalRefs: total, broken, unhashedLogical: unhashed });
console.log('targets (kaynak → türev):');
for (const t of HASH_TARGETS) {
  const h = assetHref(t, m);
  const srcOk = fs.existsSync(path.join(ROOT, t));
  const hashOk = fs.existsSync(path.join(ROOT, h));
  if (!srcOk) missingSource += 1;
  console.log(' ', t, srcOk ? '✓' : 'EKSIK', '→', h, hashOk ? 'OK' : 'MISSING');
}

const site = assetHref('assets/css/site.css', m);
for (const depth of ['', '../', '../../', '../../../']) {
  const href = depth + site;
  const i = href.indexOf('assets/');
  const prefix = href.slice(0, i);
  const dataUrl = prefix + 'assets/data/urunler.json';
  const imgUrl = prefix + 'assets/img/products/duru-k100-01.webp';
  const okData = fs.existsSync(path.join(ROOT, path.normalize(dataUrl.replace(/^\.\.\//, '') === dataUrl ? dataUrl : '')));
  // resolve like browser from a page at depth
  const pageDir =
    depth === ''
      ? ROOT
      : depth === '../'
        ? path.join(ROOT, 'katalog')
        : depth === '../../'
          ? path.join(ROOT, 'blog', 'x')
          : path.join(ROOT, 'urunler', 'a', 'b');
  const resolvedData = path.normalize(path.join(pageDir, prefix + 'assets/data/urunler.json'));
  const resolvedImg = path.normalize(path.join(pageDir, prefix + 'assets/img/products/duru-k100-01.webp'));
  console.log('sitePrefix', { depth, prefix, data: fs.existsSync(resolvedData), img: fs.existsSync(resolvedImg) });
}

process.exit(broken || unhashed || missingSource ? 1 : 0);
