/**
 * Merkezi SEO head: canonical, Open Graph, Twitter Card (SERP / sosyal önizleme görseli).
 */
const fs = require('fs');
const path = require('path');

const SITE_ORIGIN = 'https://www.duruulvteknoloji.com.tr';
const SITE_NAME = 'Duru ULV Teknoloji Sistemleri';
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/assets/img/products/duru-hd50-01.webp`;

function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

/** Dosya yolu → mutlak canonical URL (index.html → dizin slash) */
function canonicalUrl(relPath) {
  let p = String(relPath || '').replace(/\\/g, '/').replace(/^\//, '');
  p = p.replace(/index\.html$/, '');
  if (p && !p.endsWith('/')) p += '/';
  return p ? `${SITE_ORIGIN}/${p}` : `${SITE_ORIGIN}/`;
}

function productOgImageUrl(slug, manifest) {
  const files = manifest && manifest[slug];
  const file = files && files[0] ? files[0] : `${slug}-01.webp`;
  return `${SITE_ORIGIN}/assets/img/products/${file}`;
}

function blogCoverOgImageUrl(slug, rootDir) {
  const dir = path.join(rootDir || path.join(__dirname, '..'), 'assets', 'img', 'blog');
  for (const ext of ['webp', 'png', 'jpg']) {
    const file = `${slug}-cover.${ext}`;
    if (fs.existsSync(path.join(dir, file))) {
      return `${SITE_ORIGIN}/assets/img/blog/${file}`;
    }
  }
  return `${SITE_ORIGIN}/assets/img/blog/${slug}-cover.webp`;
}

function renderSeoHead({
  title,
  description,
  canonicalPathRel,
  ogType = 'website',
  ogImage,
  ogImageAlt,
  ogImageWidth = 1200,
  ogImageHeight = 630,
  keywords,
  locale = 'tr_TR',
  robots,
}) {
  const canonical = canonicalUrl(canonicalPathRel);
  const image = ogImage || DEFAULT_OG_IMAGE;
  const imageAlt = ogImageAlt || title;

  let block = `  <!-- duru:seo-meta -->
  <link rel="canonical" href="${escAttr(canonical)}">
  <meta property="og:type" content="${escAttr(ogType)}">
  <meta property="og:site_name" content="${escAttr(SITE_NAME)}">
  <meta property="og:locale" content="${escAttr(locale)}">
  <meta property="og:title" content="${escAttr(title)}">
  <meta property="og:description" content="${escAttr(description)}">
  <meta property="og:url" content="${escAttr(canonical)}">
  <meta property="og:image" content="${escAttr(image)}">
  <meta property="og:image:width" content="${ogImageWidth}">
  <meta property="og:image:height" content="${ogImageHeight}">
  <meta property="og:image:alt" content="${escAttr(imageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escAttr(title)}">
  <meta name="twitter:description" content="${escAttr(description)}">
  <meta name="twitter:image" content="${escAttr(image)}">
  <meta name="twitter:image:alt" content="${escAttr(imageAlt)}">`;

  if (keywords) {
    block += `\n  <meta name="keywords" content="${escAttr(keywords)}">`;
  }
  if (robots) {
    block += `\n  <meta name="robots" content="${escAttr(robots)}">`;
  }
  block += `\n  <!-- /duru:seo-meta -->`;
  return block;
}

function injectSeoHead(html, seoBlock) {
  const markerRe = /\s*<!-- duru:seo-meta -->[\s\S]*?<!-- \/duru:seo-meta -->/;
  if (markerRe.test(html)) {
    return html.replace(markerRe, `\n${seoBlock}`);
  }
  return html.replace(/(<meta name="description"[^>]*>)/, `$1\n${seoBlock}`);
}

function organizationSchemaJson(kurumsal) {
  const k = kurumsal || {};
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    logo: `${SITE_ORIGIN}/assets/img/duru-hd-logo.svg`,
    email: k.email || undefined,
    telephone: k.telefon || undefined,
    address: k.adres
      ? {
          '@type': 'PostalAddress',
          streetAddress: [k.adres.satir1, k.adres.satir2].filter(Boolean).join(', '),
          addressLocality: 'Kayseri',
          addressCountry: 'TR',
        }
      : undefined,
    sameAs: k.whatsapp ? [`https://wa.me/${k.whatsapp}`] : undefined,
  });
}

function productSchemaJson(product, meta, canonicalPathRel) {
  const url = canonicalUrl(canonicalPathRel);
  const image = productOgImageUrl(product.slug, meta.imageManifest);
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.ad_tr,
    description: meta.metaDescription || product.kisa_aciklama_tr,
    image,
    url,
    brand: { '@type': 'Brand', name: 'Duru ULV' },
    manufacturer: { '@type': 'Organization', name: SITE_NAME },
    sku: product.model_kodu,
  });
}

function webSiteSchemaJson() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_ORIGIN}/urunler/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });
}

/** FAQ cevaplarından markdown kalıntılarını temizle (schema plain text) */
function faqPlainText(text) {
  return String(text || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function faqPageSchemaJson(faqs) {
  if (!faqs || !faqs.length) return null;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faqPlainText(f.a),
      },
    })),
  });
}

/** Ürün/blog sayfasına FAQPage JSON-LD enjekte et veya güncelle */
function injectFaqSchema(html, faqs) {
  const schema = faqPageSchemaJson(faqs);
  const faqRe =
    /\s*<script type="application\/ld\+json">\{[^<]*"@type"\s*:\s*"FAQPage"[^<]*\}<\/script>/;
  if (!schema) {
    return html.replace(faqRe, '');
  }
  const tag = `\n  <script type="application/ld+json">${schema}</script>`;
  if (faqRe.test(html)) {
    return html.replace(faqRe, tag);
  }
  const productRe =
    /(<script type="application\/ld\+json">\{[^<]*"@type"\s*:\s*"Product"[^<]*\}<\/script>)/;
  if (productRe.test(html)) {
    return html.replace(productRe, `$1${tag}`);
  }
  const blogRe =
    /(<script type="application\/ld\+json">\{[^<]*"@type"\s*:\s*"BlogPosting"[^<]*\}<\/script>)/;
  if (blogRe.test(html)) {
    return html.replace(blogRe, `$1${tag}`);
  }
  return html.replace(/<\/head>/, `${tag}\n</head>`);
}

module.exports = {
  SITE_ORIGIN,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  canonicalUrl,
  productOgImageUrl,
  blogCoverOgImageUrl,
  renderSeoHead,
  injectSeoHead,
  organizationSchemaJson,
  productSchemaJson,
  webSiteSchemaJson,
  faqPlainText,
  faqPageSchemaJson,
  injectFaqSchema,
};
