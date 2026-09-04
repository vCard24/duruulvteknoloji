/**
 * robots.txt + sitemap.xml üretimi (Google Search Console / Bing Webmaster)
 * hreflang: her TR URL için EN/AR alternate (xhtml:link)
 */
const fs = require('fs');
const path = require('path');
const {
  SITE_ORIGIN,
  productOgImageUrl,
  blogCoverOgImageUrl,
  alternateUrl,
  shouldIncludeHreflang,
  injectSeoHead,
  renderSeoHead,
  DEFAULT_OG_IMAGE,
} = require('./seo-meta');

const ROOT = path.join(__dirname, '..');
const imageManifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/product-images.json'), 'utf8')
);
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/urunler.json'), 'utf8'));
const blogPosts = fs.existsSync(path.join(ROOT, 'assets/data/blog-posts.json'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/blog-posts.json'), 'utf8'))
  : [];

const SKIP_DIRS = new Set([
  'api',
  'emergent',
  'yigitornek',
  'node_modules',
  'scripts',
  'urun_yazilari',
  'en',
  'ar',
  'assets',
]);
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

function xhtmlAlternates(trRel) {
  if (!shouldIncludeHreflang(trRel)) return '';
  const tr = alternateUrl(trRel, 'tr');
  const en = alternateUrl(trRel, 'en');
  const ar = alternateUrl(trRel, 'ar');
  if (!tr || !en || !ar) return '';
  return [
    `    <xhtml:link rel="alternate" hreflang="tr" href="${tr}" />`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${en}" />`,
    `    <xhtml:link rel="alternate" hreflang="ar" href="${ar}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${tr}" />`,
  ].join('\n');
}

function urlEntry(loc, lastmod, priority, imageTag, alternatesXml) {
  const altBlock = alternatesXml ? `\n${alternatesXml}` : '';
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>${imageTag}${altBlock}\n  </url>`;
}

/** Ana sayfa generate edilmez; hreflang'i SEO bloğuna enjekte et */
function ensureIndexHreflang() {
  const indexPath = path.join(ROOT, 'index.html');
  if (!fs.existsSync(indexPath)) return;
  let html = fs.readFileSync(indexPath, 'utf8');
  if (html.includes('hreflang="x-default"')) return;

  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  const title = titleMatch ? titleMatch[1] : 'Duru ULV';
  const description = descMatch ? descMatch[1] : '';
  const seoBlock = renderSeoHead({
    title,
    description,
    canonicalPathRel: 'index.html',
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: 'Duru ULV',
  });
  html = injectSeoHead(html, seoBlock);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('  ✓ index.html hreflang eklendi');
}

const pages = collectStaticPages().filter((u) => shouldIncludeHreflang(u.rel));
const urlBlocks = [];

pages.forEach(({ rel, file }) => {
  const lastmod = lastModFromFile(file);
  const priority = priorityFor(rel);
  const img = imageForPage(rel);
  const imageTag = img
    ? `\n    <image:image>\n      <image:loc>${img}</image:loc>\n    </image:image>`
    : '';
  const alts = xhtmlAlternates(rel);

  const trLoc = toLoc(rel);
  const enLoc = alternateUrl(rel, 'en');
  const arLoc = alternateUrl(rel, 'ar');

  urlBlocks.push(urlEntry(trLoc, lastmod, priority, imageTag, alts));
  if (enLoc && enLoc !== trLoc) {
    urlBlocks.push(urlEntry(enLoc, lastmod, priority, '', alts));
  }
  if (arLoc && arLoc !== trLoc) {
    urlBlocks.push(urlEntry(arLoc, lastmod, priority, '', alts));
  }
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlBlocks.join('\n')}
</urlset>
`;

ensureIndexHreflang();

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
console.log(`sitemap.xml: ${urlBlocks.length} URL (${pages.length} TR × dil varyantı)`);
console.log('robots.txt korundu (değiştirilmedi)');

require('./generate-ai-discovery').generateAiDiscovery();
