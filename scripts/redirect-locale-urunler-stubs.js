/**
 * Replace empty en|ar/urunler stubs with 301-friendly redirect HTML,
 * targeting flat locale products URLs. Does NOT touch TR urunler/.
 * Usage: node scripts/redirect-locale-urunler-stubs.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function redirectHtml(toAbsPath, locale) {
  const title = locale === 'ar' ? 'Redirecting...' : 'Redirecting...';
  const msg =
    locale === 'ar'
      ? `This page has moved. If you are not redirected, <a href="${toAbsPath}">click here</a>.`
      : `This page has moved. If you are not redirected, <a href="${toAbsPath}">click here</a>.`;
  // Keep body bilingual-safe ASCII; AR pages still use lang=ar for document language.
  const msgAr = `تم نقل هذه الصفحة. إذا لم تُحوَّل تلقائياً، <a href="${toAbsPath}">انقر هنا</a>.`;
  const bodyMsg = locale === 'ar' ? msgAr : msg;
  const pageTitle = locale === 'ar' ? 'إعادة توجيه' : 'Redirecting';
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=${toAbsPath}">
  <link rel="canonical" href="https://www.duruulvteknoloji.com.tr${toAbsPath}">
  <title>${pageTitle}</title>
  <script>location.replace(${JSON.stringify(toAbsPath)});</script>
</head>
<body>
  <p>${bodyMsg}</p>
</body>
</html>
`;
}

function targetFor(relPosix) {
  // en/urunler/.../index.html
  const parts = relPosix.split('/').filter(Boolean);
  // [locale, urunler, ...]
  const locale = parts[0];
  if (parts[1] !== 'urunler') return null;
  const rest = parts.slice(2); // after urunler, may end with index.html
  if (rest[rest.length - 1] === 'index.html') rest.pop();

  if (rest.length === 0) return `/${locale}/products/`;
  if (rest.length === 1) return `/${locale}/products/${rest[0]}/`;
  if (rest.length === 2) return `/${locale}/products/${rest[1]}/`; // category/slug → flat slug
  return `/${locale}/products/`;
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (ent.name === 'index.html') acc.push(p);
  }
  return acc;
}

let n = 0;
for (const locale of ['en', 'ar']) {
  const files = walk(path.join(ROOT, locale, 'urunler'));
  for (const file of files) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    const to = targetFor(rel);
    if (!to) continue;
    fs.writeFileSync(file, redirectHtml(to, locale), 'utf8');
    console.log(rel, '->', to);
    n++;
  }
}
console.log('rewrote', n, 'stubs');
