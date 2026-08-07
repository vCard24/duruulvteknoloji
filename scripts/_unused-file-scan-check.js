const fs = require('fs');
const path = require('path');
const r = JSON.parse(
  fs.readFileSync(path.join(__dirname, '_unused-file-scan-report.json'), 'utf8')
);
const B = new Set(r.B.map((x) => x.path));
const C = new Set(r.C.map((x) => x.path));

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const relRoot = path.relative(path.join(__dirname, '..'), d);
    if (relRoot === '' && ['.git', 'node_modules', 'sources'].includes(e.name))
      continue;
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (e.name !== '.htaccess.bak')
      a.push(path.relative(path.join(__dirname, '..'), p).replace(/\\/g, '/'));
  }
  return a;
}

const all = walk(path.join(__dirname, '..'));
const A = all.filter((f) => !B.has(f) && !C.has(f));
const check = [
  'package.json',
  'package-lock.json',
  'hostinger-exclude.txt',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'llms-full.txt',
  'ai-catalog.json',
  'ai.txt',
  'brand.txt',
  'security.txt',
  'index.html',
  'assets/img/duru-icon.svg',
  'assets/img/duru-hd-logo.svg',
  'googled0d43f15a40df6d8.html',
  'api/send-quote.php',
  'assets/css/site.css',
  'assets/css/design-tokens.css',
];
for (const i of check) {
  console.log(B.has(i) ? 'B' : C.has(i) ? 'C' : A.includes(i) ? 'A' : '?', i);
}
const z01 = all.filter((f) =>
  /^assets\/img\/products\/.+-01\.webp$/i.test(f)
);
console.log(
  '01 total',
  z01.length,
  'A',
  z01.filter((f) => A.includes(f)).length,
  'B',
  z01.filter((f) => B.has(f)).length,
  'C',
  z01.filter((f) => C.has(f)).length
);
console.log(
  'wellknown',
  all.filter((f) => f.startsWith('.well-known/'))
);
console.log(
  'scripts A sample',
  A.filter((f) => f.startsWith('scripts/')).slice(0, 40)
);
console.log(
  'api A',
  A.filter((f) => f.startsWith('api/'))
);
console.log(
  'meta in A',
  A.filter((f) =>
    /^(404|robots|sitemap|llms|ai-catalog|ai\.txt|brand|security)/.test(f)
  )
);
