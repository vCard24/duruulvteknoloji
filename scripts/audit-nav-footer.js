const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['node_modules', 'yigitornek', 'emergent', 'scripts', '.git']);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name) || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

function extract(html, start, end) {
  const i = html.indexOf(start);
  if (i < 0) return null;
  const j = html.indexOf(end, i);
  if (j < 0) return null;
  return html.slice(i, j + end.length);
}

function footerSiteLinks(footer) {
  if (!footer) return [];
  const m = footer.match(/site-footer__links[\s\S]*?<\/ul>/);
  if (!m) return [];
  return [...m[0].matchAll(/>([^<]+)<\/a>/g)].map((x) => x[1].trim());
}

function mobileLinks(header) {
  if (!header) return [];
  return [...header.matchAll(/mobile-menu__link[^>]*>([^<]+)/g)].map((m) => m[1].trim());
}

const files = walk(ROOT);
const headerSigs = new Map();
const footerSigs = new Map();
const issues = [];

for (const f of files) {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  const html = fs.readFileSync(f, 'utf8');
  const header = extract(html, '<header class="site-header', '</header>');
  const footer = extract(html, '<footer class="site-footer', '</footer>');

  const nav = [...(header || '').matchAll(/site-nav__link[^>]*>([^<]+)/g)].map((m) =>
    m[1].trim().replace(/\s+/g, ' ')
  );
  const mobile = mobileLinks(header);
  const fLinks = footerSiteLinks(footer);
  const cert = footer && footer.includes('site-footer__certs');
  const teklifFooter = fLinks.some((l) => l.includes('Teklif'));

  const navKey = nav.join('|');
  const footerKey = `${fLinks.join('|')}||certs:${cert}`;

  if (!headerSigs.has(navKey)) headerSigs.set(navKey, []);
  headerSigs.get(navKey).push(rel);
  if (!footerSigs.has(footerKey)) footerSigs.set(footerKey, []);
  footerSigs.get(footerKey).push(rel);

  const blogCount = mobile.filter((x) => x.startsWith('Blog')).length;
  if (blogCount > 1) issues.push({ file: rel, issue: `duplicate Blog in mobile (${blogCount})` });

  if (!header) issues.push({ file: rel, issue: 'missing header' });
  if (!footer) issues.push({ file: rel, issue: 'missing footer' });
  if (header && !header.includes('aria-label="Ana menü"')) issues.push({ file: rel, issue: 'missing nav aria-label' });

  const mobileBlock = (header || '').match(/mobile-menu[\s\S]*/)?.[0] || '';
  const desktopHasNavLink = (header.match(/data-nav-link/g) || []).length;
  const mobileHasNavLink = (mobileBlock.match(/data-nav-link/g) || []).length;
  if (desktopHasNavLink >= 7 && mobileHasNavLink === 0) {
    issues.push({ file: rel, issue: 'mobile links missing data-nav-link' });
  }

  if (teklifFooter && !fLinks.includes('Kalite Politikamız')) {
    issues.push({ file: rel, issue: 'footer has Teklif Al but no Kalite Politikamız' });
  }
  if (!teklifFooter && fLinks.length > 0) {
    // track pages without teklif in footer
  }

  const langAria = header && /lang-switcher[^>]*aria-label/.test(header);
  if (header && header.includes('lang-switcher') && !langAria && rel === 'index.html') {
    issues.push({ file: rel, issue: 'index has lang-switcher aria-label, others may not' });
  }

  if (!html.includes('main.js')) issues.push({ file: rel, issue: 'missing main.js' });
  if (!html.includes('whatsapp-btn')) issues.push({ file: rel, issue: 'missing whatsapp button' });
}

console.log('HEADER NAV VARIANTS:', headerSigs.size);
for (const [k, v] of headerSigs) {
  console.log('  [' + v.length + ']', k);
  if (v.length <= 3) console.log('    ', v.join(', '));
  else console.log('    sample:', v.slice(0, 2).join(', '), '...');
}

console.log('\nFOOTER SITE LINK VARIANTS:', footerSigs.size);
for (const [k, v] of footerSigs) {
  console.log('  [' + v.length + ']', k);
  if (v.length <= 5) console.log('    ', v.join(', '));
}

const withTeklif = [];
const withoutTeklif = [];
for (const [k, v] of footerSigs) {
  if (k.includes('Teklif')) withTeklif.push(...v);
  else withoutTeklif.push(...v);
}
console.log('\nFooter Teklif Al: WITH', withTeklif.length, 'WITHOUT', withoutTeklif.length);
if (withTeklif.length) console.log('  with:', withTeklif.join(', '));

const withCerts = [];
const withoutCerts = [];
for (const [k, v] of footerSigs) {
  if (k.includes('certs:true')) withCerts.push(...v);
  else withoutCerts.push(...v);
}
console.log('\nFooter certs section: WITH', withCerts.length, 'WITHOUT', withoutCerts.length);
if (withoutCerts.length) console.log('  without certs:', withoutCerts.slice(0, 10).join(', '), withoutCerts.length > 10 ? '...' : '');

console.log('\nISSUES:', issues.length);
for (const i of issues) console.log(' ', i.file, '-', i.issue);
