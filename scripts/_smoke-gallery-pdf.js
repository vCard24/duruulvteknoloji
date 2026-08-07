/** Galeri + PDF sözleşme smoke — node scripts/_smoke-gallery-pdf.js */
const fs = require('fs');
const path = require('path');

const page = 'urunler/termal-sisleme/duru-k100/index.html';
const html = fs.readFileSync(page, 'utf8');
const dir = path.dirname(page);
const blocks = html.match(/<button[^>]*data-gallery-thumb[\s\S]*?<\/button>/g) || [];
console.log('thumbs', blocks.length);
let ok = true;

function existsRel(u) {
  return fs.existsSync(path.join(dir, u));
}

for (const b of blocks) {
  const ds = (b.match(/data-src="([^"]+)"/) || [])[1];
  const dss = (b.match(/data-srcset="([^"]+)"/) || [])[1];
  const img = (b.match(/<img[^>]*src="([^"]+)"/) || [])[1];
  for (const u of [ds, img].filter(Boolean)) {
    if (!existsRel(u)) {
      console.log('MISSING', u);
      ok = false;
    }
  }
  if (dss) {
    for (const part of dss.split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (!existsRel(u)) {
        console.log('MISSING srcset', u);
        ok = false;
      }
    }
  }
}

const urunler = require('../assets/data/urunler.json');
for (const p of urunler.urunler) {
  const f = path.join('assets/img/products', `${p.slug}-01.webp`);
  if (!fs.existsSync(f)) {
    console.log('PDF/compare MISSING', f);
    ok = false;
  }
}

const mainJs = fs.readFileSync('assets/js/main.js', 'utf8');
const comparePdf = fs.readFileSync('assets/js/compare-pdf.js', 'utf8');
const quotePdf = fs.readFileSync('assets/js/quote-pdf.js', 'utf8');
console.log('main.js srcset sync:', /dataset\.srcset/.test(mainJs) ? 'OK' : 'FAIL');
console.log('compare-pdf -01.webp:', /'-01\.webp'/.test(comparePdf) ? 'OK' : 'FAIL');
console.log('quote-pdf -01.webp:', /'-01\.webp'/.test(quotePdf) ? 'OK' : 'FAIL');
console.log(ok ? 'GALLERY+PDF_CONTRACT OK' : 'FAIL');
process.exit(ok ? 0 : 1);
