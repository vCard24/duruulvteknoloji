/**
 * Dahili link ve asset kontrolü (kırık href/src)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['api', 'emergent', 'yigitornek', 'node_modules', 'scripts', 'urun_yazilari']);

function collectHtmlFiles(dir, relBase, out) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const rel = relBase ? `${relBase}/${name}` : name;
    if (fs.statSync(full).isDirectory()) {
      collectHtmlFiles(full, rel, out);
    } else if (name.endsWith('.html')) {
      out.push({ rel, full });
    }
  }
}

function resolveTarget(fromFile, href) {
  const fromDir = path.dirname(fromFile);
  let target = path.normalize(path.join(fromDir, href));
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    target = path.join(target, 'index.html');
  }
  return target;
}

function isSkippable(href) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
    return true;
  }
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) return true;
  if (href.startsWith('data:')) return true;
  return false;
}

const files = [];
collectHtmlFiles(ROOT, '', files);
const broken = [];
const attrRe = /\s(?:href|src)=["']([^"']+)["']/gi;

for (const { rel, full } of files) {
  const html = fs.readFileSync(full, 'utf8');
  let m;
  while ((m = attrRe.exec(html)) !== null) {
    const href = m[1];
    if (isSkippable(href)) continue;
    const target = resolveTarget(full, href.split('?')[0].split('#')[0]);
    if (!fs.existsSync(target)) {
      broken.push({ page: rel, link: href, resolved: path.relative(ROOT, target).replace(/\\/g, '/') });
    }
  }
}

if (broken.length === 0) {
  console.log(`OK — ${files.length} HTML dosyasında kırık dahili link yok.`);
} else {
  console.log(`KIRIK LINK: ${broken.length} adet (${files.length} sayfa tarandı)\n`);
  broken.slice(0, 50).forEach((b) => {
    console.log(`  ${b.page}\n    → ${b.link} (${b.resolved})`);
  });
  if (broken.length > 50) console.log(`  ... ve ${broken.length - 50} tane daha`);
  process.exitCode = 1;
}
