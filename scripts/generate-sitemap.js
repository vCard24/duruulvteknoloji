/**
 * robots.txt + sitemap.xml üretimi (Google Search Console / Bing Webmaster)
 */
const fs = require('fs');
const path = require('path');
const { SITE_ORIGIN, productOgImageUrl, blogCoverOgImageUrl } = require('./seo-meta');

const ROOT = path.join(__dirname, '..');
const imageManifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/product-images.json'), 'utf8')
);
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/urunler.json'), 'utf8'));
const blogPosts = fs.existsSync(path.join(ROOT, 'assets/data/blog-posts.json'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/blog-posts.json'), 'utf8'))
  : [];

const SKIP_DIRS = new Set(['api', 'emergent', 'yigitornek', 'node_modules', 'scripts', 'urun_yazilari']);
const NOINDEX = new Set(['tesekkurler/index.html']);

function toLoc(relPath) {
  let p = relPath.replace(/\\/g, '/').replace(/index\.html$/, '');
  if (p && !p.endsWith('/')) p += '/';
  return p ? `${SITE_ORIGIN}/${p}` : `${SITE_ORIGIN}/`;
}

function lastModFromFile(filePath) {
  const stat = fs.statSync(filePath);
  return stat.mtime.toISOString().slice(0, 10);
}

function collectStaticPages() {
  const urls = [];

  function walk(dir, relBase) {
    for (const name of fs.readdirSync(dir)) {
      if (SKIP_DIRS.has(name)) continue;
      const full = path.join(dir, name);
      const rel = relBase ? `${relBase}/${name}` : name;
      if (fs.statSync(full).isDirectory()) {
        walk(full, rel);
      } else if (name === 'index.html') {
        urls.push({ rel, file: full });
      }
    }
  }

  walk(ROOT, '');
  return urls.filter((u) => !NOINDEX.has(u.rel));
}

function imageForPage(rel) {
  const m = rel.match(/^urunler\/([^/]+)\/([^/]+)\/index\.html$/);
  if (m && m[2] !== 'index.html') {
    const slug = m[2];
    if (catalog.urunler.some((p) => p.slug === slug)) {
      return productOgImageUrl(slug, imageManifest);
    }
  }
  const blogM = rel.match(/^blog\/([^/]+)\/index\.html$/);
  if (blogM && blogM[1] !== 'index.html') {
    return blogCoverOgImageUrl(blogM[1], ROOT);
  }
  if (rel === 'index.html') {
    return productOgImageUrl('duru-hd50', imageManifest);
  }
  return null;
}

function priorityFor(rel) {
  if (rel === 'index.html') return '1.0';
  if (rel === 'urunler/index.html') return '0.9';
  if (/^urunler\/[^/]+\/[^/]+\/index\.html$/.test(rel)) return '0.8';
  if (/^blog\/[^/]+\/index\.html$/.test(rel)) return '0.7';
  if (rel === 'blog/index.html') return '0.75';
  return '0.5';
}

const pages = collectStaticPages();
const urlEntries = pages
  .map(({ rel, file }) => {
    const loc = toLoc(rel);
    const lastmod = lastModFromFile(file);
    const priority = priorityFor(rel);
    const img = imageForPage(rel);
    const imageTag = img
      ? `\n    <image:image>\n      <image:loc>${img}</image:loc>\n    </image:image>`
      : '';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>${imageTag}\n  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /emergent/
Disallow: /yigitornek/
Disallow: /tesekkurler/

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots, 'utf8');
console.log(`sitemap.xml: ${pages.length} URL`);
console.log('robots.txt yazıldı');
