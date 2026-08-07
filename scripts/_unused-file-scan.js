/**
 * Unused-file scan — report only, deletes nothing.
 * node scripts/_unused-file-scan.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_TOP = new Set(['.git', 'node_modules', 'sources']);
const SKIP_FILES = new Set(['.htaccess.bak']);

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const relFromRoot = path.relative(ROOT, dir);
    if (relFromRoot === '' && SKIP_TOP.has(e.name)) continue;
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else {
      const rel = path.relative(ROOT, p).replace(/\\/g, '/');
      if (SKIP_FILES.has(e.name) || SKIP_FILES.has(rel)) continue;
      acc.push(p);
    }
  }
  return acc;
}

const allFiles = walk(ROOT);
const relOf = (p) => path.relative(ROOT, p).replace(/\\/g, '/');
const fileSet = new Set(allFiles.map(relOf));
const referenced = new Map();

function mark(abs, source) {
  const key = path.normalize(abs);
  const r = relOf(key);
  if (!fileSet.has(r)) return;
  if (!referenced.has(key)) referenced.set(key, new Set());
  referenced.get(key).add(source);
}

function addRef(raw, source, baseDir) {
  if (!raw || typeof raw !== 'string') return;
  let url = raw.trim().split('#')[0].split('?')[0];
  if (!url) return;

  const absSite = url.match(
    /^https?:\/\/(?:www\.)?duruulvteknoloji\.com\.tr\/(.+)$/i
  );
  if (absSite) {
    url = absSite[1];
    baseDir = ROOT;
  } else if (/^(https?:|data:|mailto:|tel:|javascript:)/i.test(url)) {
    return;
  }

  url = url.replace(/^\.\//, '').replace(/^\/+/, '');
  if (!url || url === '.' || url.startsWith('#')) return;

  const candidates = [];
  if (path.isAbsolute(url) || /^[a-z]:\\/i.test(url)) {
    candidates.push(url);
  } else {
    candidates.push(path.normalize(path.join(baseDir || ROOT, url)));
    candidates.push(path.normalize(path.join(ROOT, url)));
  }

  // Directory URL → index.html
  for (const c of [...candidates]) {
    if (!path.extname(c)) {
      candidates.push(path.join(c, 'index.html'));
      candidates.push(c.replace(/[/\\]+$/, '') + '/index.html');
    }
  }

  for (const c of candidates) mark(c, source);
}

function extractSrcset(v) {
  return String(v || '')
    .split(',')
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function scanHtml(file) {
  const html = fs.readFileSync(file, 'utf8');
  const base = path.dirname(file);
  const src = relOf(file);
  const attrRe =
    /\b(?:src|href|data-src|data-srcset|imagesrcset|srcset)=["']([^"']+)["']/gi;
  let m;
  while ((m = attrRe.exec(html))) {
    const attr = (m[0].match(/([a-z-]+)=/i) || [])[1]?.toLowerCase() || '';
    const vals =
      attr === 'srcset' || attr === 'data-srcset' || attr === 'imagesrcset'
        ? extractSrcset(m[1])
        : [m[1]];
    for (const v of vals) addRef(v, src, base);
  }
  const metas = [
    /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*>/gi,
  ];
  for (const re of metas) {
    re.lastIndex = 0;
    while ((m = re.exec(html))) addRef(m[1], src, ROOT);
  }
}

function scanCss(file) {
  const css = fs.readFileSync(file, 'utf8');
  const base = path.dirname(file);
  const src = relOf(file);
  const re = /url\(\s*(['"]?)([^)'"]+)\1\s*\)/gi;
  let m;
  while ((m = re.exec(css))) {
    const u = m[2].trim();
    if (u.startsWith('data:')) continue;
    addRef(u, src, base);
  }
  const imp = /@import\s+(?:url\()?['"]([^'"]+)['"]/gi;
  while ((m = imp.exec(css))) addRef(m[1], src, base);
}

function scanJs(file) {
  const text = fs.readFileSync(file, 'utf8');
  const src = relOf(file);
  const dir = path.dirname(file);
  let m;

  const reImp =
    /(?:import\s+(?:[^'"]+from\s+)?|require\s*\(\s*)['"]([^'"]+)['"]/g;
  while ((m = reImp.exec(text))) {
    const p = m[1];
    if (p.startsWith('.')) {
      let resolved = path.normalize(path.join(dir, p));
      if (!fs.existsSync(resolved) && fs.existsSync(resolved + '.js')) {
        resolved += '.js';
      }
      mark(resolved, src);
    } else if (p.startsWith('/') || p.startsWith('assets')) {
      addRef(p, src, ROOT);
    }
  }

  const reFetch = /fetch\s*\(\s*['"]([^'"]+)['"]/g;
  while ((m = reFetch.exec(text))) addRef(m[1], src, ROOT);

  const reStr =
    /['"`]((?:\.\.\/)*(?:assets\/|\.well-known\/|api\/)?[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g|gif|svg|css|js|json|html|pdf|txt|xml|woff2?|ttf|otf|ico|php|md))['"`]/g;
  while ((m = reStr.exec(text))) {
    const cleaned = m[1];
    if (/^-\d{2}\.webp$/i.test(cleaned)) continue;
    addRef(cleaned, src, dir);
    addRef(cleaned, src, ROOT);
  }
}

function walkJson(obj, fn) {
  if (obj == null) return;
  if (typeof obj === 'string') {
    fn(obj);
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v) => walkJson(v, fn));
    return;
  }
  if (typeof obj === 'object') {
    for (const v of Object.values(obj)) walkJson(v, fn);
  }
}

function scanJsonFile(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return;
  const data = JSON.parse(fs.readFileSync(abs, 'utf8'));
  walkJson(data, (s) => {
    if (
      /\.(webp|png|jpe?g|gif|svg|pdf|html|css|js|json|txt|xml)$/i.test(s) ||
      s.includes('assets/') ||
      s.includes('/')
    ) {
      if (s.includes('/')) addRef(s, relPath, ROOT);
      else {
        for (const sub of ['products', 'blog', 'hero']) {
          const c = path.join(ROOT, 'assets/img', sub, s);
          if (fs.existsSync(c)) addRef(`assets/img/${sub}/${s}`, relPath, ROOT);
        }
      }
    }
  });
}

function scanTextRefs(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return;
  const text = fs.readFileSync(abs, 'utf8');
  let m;
  const loc = /<loc>([^<]+)<\/loc>/gi;
  while ((m = loc.exec(text))) {
    const mm = m[1].match(/duruulvteknoloji\.com\.tr\/(.*)$/i);
    if (!mm) continue;
    const p = mm[1].replace(/\/$/, '');
    if (!p) {
      addRef('index.html', relPath, ROOT);
      continue;
    }
    addRef(p, relPath, ROOT);
    addRef(p + '/index.html', relPath, ROOT);
  }
  const pathRe =
    /(?:https?:\/\/(?:www\.)?duruulvteknoloji\.com\.tr\/)?((?:assets\/|\.well-known\/|api\/|blog\/|urunler\/|katalog\/|fiyat-teklifi\/|hakkimizda\/|iletisim\/|kvkk\/|gizlilik|kullanim|kalite|tesekkurler\/)[a-zA-Z0-9_./-]*|[a-zA-Z0-9_.-]+\.(?:html?|xml|txt|json|webp|png|pdf|css|js|svg))/g;
  while ((m = pathRe.exec(text))) addRef(m[1], relPath, ROOT);
}

for (const f of allFiles) {
  const r = relOf(f);
  const ext = path.extname(f).toLowerCase();
  // Bu tarama yardımcıları kendi çıktı yollarını A'ya sızdırır — atla
  if (/_unused-file-scan/i.test(r)) continue;
  try {
    if (ext === '.html') scanHtml(f);
    else if (ext === '.css') scanCss(f);
    else if (ext === '.js') scanJs(f);
  } catch (e) {
    console.error('scan err', r, e.message);
  }
}

// build-css.js path.join ile okur — string birleştirme; elle bağla
for (const name of ['design-tokens.css', 'main.css', 'components.css']) {
  mark(path.join(ROOT, 'assets', 'css', name), 'scripts/build-css.js');
}

for (const j of [
  'assets/data/product-images.json',
  'assets/data/product-image-alts.json',
  'assets/data/urunler.json',
  'assets/data/product-seo.json',
  'assets/data/image-variants.json',
  'assets/data/product-image-dims.json',
  'ai-catalog.json',
]) {
  scanJsonFile(j);
}

for (const t of [
  'sitemap.xml',
  'robots.txt',
  'llms.txt',
  'llms-full.txt',
  'ai.txt',
  'brand.txt',
  'security.txt',
]) {
  scanTextRefs(t);
}

// package.json scripts may reference files
const pkgPath = path.join(ROOT, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const blob = JSON.stringify(pkg);
  const re = /scripts\/[a-zA-Z0-9_.-]+\.js/g;
  let m;
  while ((m = re.exec(blob))) addRef(m[0], 'package.json', ROOT);
}

const BASE01_RE =
  /^assets\/img\/products\/[a-z0-9]+(?:-[a-z0-9]+)*-01\.webp$/i;
const ICON_RE =
  /(favicon|apple-touch-icon|android-chrome|site\.webmanifest|duru-icon|duru-hd-logo|\.ico$)/i;

function isRisky(rel) {
  if (BASE01_RE.test(rel)) return 'compare/quote runtime string concat (-01.webp)';
  if (rel.startsWith('.well-known/')) return '.well-known convention';
  if (/^google[a-z0-9]+\.html$/i.test(rel)) {
    return 'Google Search Console doğrulama dosyası';
  }
  if (
    [
      '404.html',
      'robots.txt',
      'sitemap.xml',
      'llms.txt',
      'llms-full.txt',
      'ai-catalog.json',
      'ai.txt',
      'brand.txt',
      'security.txt',
    ].includes(rel)
  ) {
    return 'site/meta / AI discovery convention';
  }
  if (rel.startsWith('api/')) return 'api/ backend';
  if (
    [
      '.gitignore',
      '.deployignore',
      '.htaccess',
      'package.json',
      'package-lock.json',
      'hostinger-exclude.txt',
    ].includes(rel)
  ) {
    return 'repo/deploy tooling';
  }
  if (rel.startsWith('scripts/')) return 'scripts/ build tooling';
  if (ICON_RE.test(rel)) return 'favicon/icon';
  if (rel === 'index.html') return 'site entry';
  return null;
}

function guessWhyC(rel, size) {
  const reasons = [];
  if (rel.startsWith('urun_yazilari/') || rel.endsWith('.md')) {
    reasons.push('içerik/talimat markdown; runtime siteye bağlı değil');
  }
  if (/\.(map|log|bak|tmp|old)$/i.test(rel)) {
    reasons.push('yedek/geçici uzantı');
  }
  if (rel.includes('yigitornek')) {
    reasons.push('eski örnek site kalıntısı');
  }
  if (/perf-audit|CURSOR_|URUN_GORSEL|hostinger/i.test(rel)) {
    reasons.push('dokümantasyon / audit / yerel not');
  }
  if (/assets\/img\/.*(?<!\.\w{8})\.(webp|png|jpe?g)$/i.test(rel) && !/-01\.webp$/i.test(rel)) {
    if (!/\.[a-f0-9]{8}\.(webp)$/i.test(rel) && !/-\d{2}\.webp$/i.test(rel)) {
      reasons.push('hash’siz / referanssız görsel adayı');
    }
  }
  if (/\.[a-f0-9]{8}\.webp$/i.test(rel)) {
    reasons.push('hash’li varyant ama HTML/JSON/JS taramasında referans yok (orphan?)');
  }
  if (/-\d{2}\.webp$/i.test(rel) && !/-01\.webp$/i.test(rel)) {
    reasons.push('ürün galeri tabanı (-NN); HTML’de geçmiyor olabilir');
  }
  if (rel.startsWith('assets/data/') && rel.endsWith('.json')) {
    reasons.push('data JSON; doğrudan HTML href’i olmayabilir ama build kullanıyor olabilir — B’ye alınmalı mı kontrol');
  }
  if (!reasons.length) {
    reasons.push('statik taramada hiçbir HTML/CSS/JS/JSON/sitemap/robots/llms referansı bulunamadı');
  }
  return reasons.join('; ');
}

const A = [];
const B = [];
const C = [];

for (const f of allFiles) {
  const rel = relOf(f);
  const st = fs.statSync(f);
  if (referenced.has(path.normalize(f))) {
    A.push(rel);
    continue;
  }
  const risk = isRisky(rel);
  if (risk) {
    B.push({
      path: rel,
      bytes: st.size,
      mtime: st.mtime.toISOString().slice(0, 10),
      why: risk,
    });
    continue;
  }
  C.push({
    path: rel,
    bytes: st.size,
    mtime: st.mtime.toISOString().slice(0, 10),
    why: guessWhyC(rel, st.size),
  });
}

B.sort((a, b) => a.path.localeCompare(b.path));
C.sort((a, b) => a.path.localeCompare(b.path));

const out = {
  scanned: allFiles.length,
  A_count: A.length,
  B_count: B.length,
  C_count: C.length,
  C_bytes: C.reduce((s, x) => s + x.bytes, 0),
  B,
  C,
};

const outPath = path.join(ROOT, 'scripts', '_unused-file-scan-report.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(
  JSON.stringify(
    {
      scanned: out.scanned,
      A_count: out.A_count,
      B_count: out.B_count,
      C_count: out.C_count,
      C_bytes: out.C_bytes,
      C_MB: +(out.C_bytes / 1024 / 1024).toFixed(2),
      report: 'scripts/_unused-file-scan-report.json',
    },
    null,
    2
  )
);
