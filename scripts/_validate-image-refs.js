/**
 * Validate image refs in HTML after responsive image build.
 * node scripts/_validate-image-refs.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'emergent', 'yigitornek']);

function walkHtml(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walkHtml(p, acc);
    } else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function extractUrls(attrValue) {
  return attrValue
    .split(',')
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean);
}

const ATTR_RE = /\b(?:src|href|data-src|data-srcset|imagesrcset|srcset)=["']([^"']+)["']/gi;
const htmls = walkHtml(ROOT);
const missing = [];

for (const file of htmls) {
  const html = fs.readFileSync(file, 'utf8');
  let m;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(html))) {
    for (const rel of extractUrls(m[1])) {
      if (/^(https?:|data:|mailto:|tel:|#)/i.test(rel)) continue;
      const clean = rel.split('?')[0];
      if (!/\.(webp|png|jpe?g|gif|svg|avif)$/i.test(clean)) continue;
      const abs = path.normalize(path.join(path.dirname(file), clean));
      if (!fs.existsSync(abs)) {
        missing.push({
          file: path.relative(ROOT, file).replace(/\\/g, '/'),
          ref: rel,
        });
      }
    }
  }
}

const productsDir = path.join(ROOT, 'assets', 'img', 'products');
const bases = fs.readdirSync(productsDir).filter((f) => /^[a-z0-9-]+-\d{2}\.webp$/i.test(f));

console.log('HTML files scanned:', htmls.length);
console.log('Missing image refs:', missing.length);
missing.slice(0, 50).forEach((x) => console.log(`  ${x.file} -> ${x.ref}`));
console.log('Base originals present:', bases.length);

const samplePath = path.join(ROOT, 'urunler', 'termal-sisleme', 'duru-k100', 'index.html');
if (fs.existsSync(samplePath)) {
  const sample = fs.readFileSync(samplePath, 'utf8');
  console.log('\n--- duru-k100 sample ---');
  console.log((sample.match(/rel="preload"[^\n]+/) || [''])[0].slice(0, 200));
  console.log((sample.match(/data-gallery-main[^>]+/) || [''])[0].slice(0, 250));
  console.log((sample.match(/data-gallery-thumb[^>]+/) || [''])[0].slice(0, 280));
  console.log('og:image:width', (sample.match(/og:image:width" content="(\d+)"/) || [])[1]);
  console.log('og:image:height', (sample.match(/og:image:height" content="(\d+)"/) || [])[1]);
}

process.exit(missing.length ? 1 : 0);
