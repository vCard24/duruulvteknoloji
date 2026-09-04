const fs = require('fs');
const path = require('path');
const { renderCategoryCard } = require('./category-icons');
const { siteHeader, siteFooter } = require('./site-layout');
const { renderHeadAssets, renderBodyScripts } = require('./head-assets');
const { buildSiteCss } = require('./build-css');
const {
  renderSeoHead,
  productOgImageUrl,
  productSchemaJson,
  faqPageSchemaJson,
  hreflangTags,
} = require('./seo-meta');
const { localePaths, catalogFileName, translateSpecLabel } = require('./i18n');
const localeProductFaqs = require('./locale-product-faqs');

/** TR sayfa yolu için hreflang alternate etiketleri (tr / en / ar / x-default) */
function hreflang(trPathRel) {
  return hreflangTags(trPathRel);
}

const {
  loadManifest,
  resolveVariantFile,
  availableWidths,
  resolveThumb,
} = require('./image-variants');

const ROOT = path.join(__dirname, '..');

function loadCatalog(locale) {
  const file = path.join(ROOT, 'assets/data', catalogFileName(locale));
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

let data = loadCatalog('tr');
let loc = localePaths('tr');
const IMG_MANIFEST_PATH = path.join(ROOT, 'assets/data/product-images.json');
const ALTS_PATH = path.join(ROOT, 'assets/data/product-image-alts.json');
const imageManifest = fs.existsSync(IMG_MANIFEST_PATH)
  ? JSON.parse(fs.readFileSync(IMG_MANIFEST_PATH, 'utf8'))
  : {};
const imageAlts = fs.existsSync(ALTS_PATH) ? JSON.parse(fs.readFileSync(ALTS_PATH, 'utf8')) : {};
const PRODUCT_SEO_PATH = path.join(ROOT, 'assets/data/product-seo.json');
const productSeo = fs.existsSync(PRODUCT_SEO_PATH)
  ? JSON.parse(fs.readFileSync(PRODUCT_SEO_PATH, 'utf8'))
  : {};
const variantManifest = loadManifest();

const PRODUCTS_IMG_DIR = path.join(ROOT, 'assets', 'img', 'products');
const imageDimCache = new Map();

function productImageFileName(slug, index) {
  const files = imageManifest[slug];
  return files && files[index - 1]
    ? files[index - 1]
    : `${slug}-${String(index).padStart(2, '0')}.webp`;
}

function productImageAlt(slug, index) {
  const fileName = productImageFileName(slug, index);
  const stem = productStem(fileName);
  return (
    imageAlts[fileName] ||
    imageAlts[`${stem}-thumb`] ||
    imageAlts[resolveThumb(PRODUCTS_IMG_DIR, stem, variantManifest) || ''] ||
    ''
  );
}

function productImageSrc(slug, index, prefix) {
  return `${prefix}assets/img/products/${productImageFileName(slug, index)}`;
}

function productImageCount(slug) {
  return imageManifest[slug] ? imageManifest[slug].length : 0;
}

function hasProductImages(slug) {
  return productImageCount(slug) > 0;
}

function productStem(fileName) {
  return String(fileName).replace(/\.webp$/i, '');
}

/** Mevcut genişlik varyantları + thumb; orijinal her zaman fallback. */
function productVariantSet(fileName) {
  const stem = productStem(fileName);
  const widthList = [400, 640, 800, 1200];
  const widths = availableWidths(PRODUCTS_IMG_DIR, stem, widthList, variantManifest);
  const filesByWidth = {};
  for (const w of widths) {
    filesByWidth[w] = resolveVariantFile(PRODUCTS_IMG_DIR, `${stem}-${w}`, variantManifest);
  }
  const thumb = resolveThumb(PRODUCTS_IMG_DIR, stem, variantManifest);
  return { stem, fileName, widths, filesByWidth, thumb };
}

function productPublicPath(fileName, prefix) {
  return `${prefix}assets/img/products/${fileName}`;
}

function productSrcset(fileName, prefix, widths, filesByWidth) {
  return widths
    .map((w) => {
      const f = filesByWidth[w] || resolveVariantFile(PRODUCTS_IMG_DIR, `${productStem(fileName)}-${w}`, variantManifest);
      return f ? `${productPublicPath(f, prefix)} ${w}w` : null;
    })
    .filter(Boolean)
    .join(', ');
}

function productLargestFile(fileName, widths, filesByWidth) {
  if (widths.length) {
    const max = widths[widths.length - 1];
    return filesByWidth[max] || fileName;
  }
  return fileName;
}

function productDisplayFile(fileName, preferredWidth, widths, filesByWidth) {
  if (widths.includes(preferredWidth) && filesByWidth[preferredWidth]) {
    return filesByWidth[preferredWidth];
  }
  const under = widths.filter((w) => w <= preferredWidth);
  if (under.length && filesByWidth[under[under.length - 1]]) {
    return filesByWidth[under[under.length - 1]];
  }
  if (widths.length && filesByWidth[widths[0]]) return filesByWidth[widths[0]];
  return fileName;
}

const PRODUCT_DIMS_PATH = path.join(ROOT, 'assets', 'data', 'product-image-dims.json');
const productDimsFile = fs.existsSync(PRODUCT_DIMS_PATH)
  ? JSON.parse(fs.readFileSync(PRODUCT_DIMS_PATH, 'utf8'))
  : {};

function productImageDims(fileName) {
  if (imageDimCache.has(fileName)) return imageDimCache.get(fileName);
  const hit = productDimsFile[fileName];
  const dims = hit
    ? { width: hit.width, height: hit.height }
    : { width: 1000, height: 1000 };
  imageDimCache.set(fileName, dims);
  return dims;
}

function scaledDims(fileName, displayWidth) {
  const d = productImageDims(fileName);
  const w = Math.min(displayWidth, d.width || displayWidth);
  const h = d.width ? Math.round((d.height / d.width) * w) : displayWidth;
  return { width: w, height: h || displayWidth };
}

function getProductFaqs(product) {
  if (Array.isArray(product.faqs) && product.faqs.length) return product.faqs;
  if (loc.locale === 'tr') {
    const entry = productSeo[product.slug];
    if (entry && entry.faqs && entry.faqs.length) return entry.faqs;
  } else if (localeProductFaqs[loc.locale] && localeProductFaqs[loc.locale][product.slug]) {
    return localeProductFaqs[loc.locale][product.slug];
  }
  return loc.ui.faqsFallback || [];
}

/* emergent ProductDetail — lucide ikonları (Building2, Hospital, Sprout, Factory, ShieldCheck, Cog) */
const USAGE_AREA_ICONS = {
  belediye:
    '<svg class="sector-item__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
  hastane:
    '<svg class="sector-item__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 6v4"/><path d="M14 14h-4"/><path d="M12 14v4"/><path d="M10 2h4a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>',
  sera:
    '<svg class="sector-item__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1.1 1.6-2.6 1.9-4.6-2.8.3-4 1.2-4.9 2.3-.9 1.1-1.4 2.5-1.6 4.7z"/></svg>',
  fabrika:
    '<svg class="sector-item__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></svg>',
  askeriye:
    '<svg class="sector-item__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
  ciftlik:
    '<svg class="sector-item__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
};

function usageAreasHtml() {
  const labels = loc.ui.usageLabels || {};
  return Object.keys(USAGE_AREA_ICONS)
    .map((key) => {
      const icon = USAGE_AREA_ICONS[key];
      const label = labels[key] || key;
      return `          <div class="sector-item">${icon}<span class="sector-item__label">${esc(label)}</span></div>`;
    })
    .join('\n');
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getCategory(slug) {
  return data.kategoriler.find((k) => k.slug === slug);
}

function getRelated(product, limit = 3) {
  return data.urunler
    .filter((p) => p.kategori_slug === product.kategori_slug && p.slug !== product.slug)
    .slice(0, limit);
}

function header(prefix, quoteProducts, trPathRel) {
  const quoteBase = loc.quoteHref(prefix).replace(/\?.*$/, '');
  const quoteHref = quoteProducts
    ? `${quoteBase}?products=${encodeURIComponent(quoteProducts)}`
    : quoteBase;
  return siteHeader({
    prefix,
    quoteHref,
    productsHref: loc.productsHref(prefix),
    homeHref: loc.homeHref(prefix),
    catalogHref: loc.catalogHref(prefix),
    blogHref: loc.blogHref(prefix),
    compareHref: loc.compareHref(prefix),
    aboutHref: loc.aboutHref(prefix),
    contactHref: loc.contactHref(prefix),
    locale: loc.locale,
    trPathRel: trPathRel || loc.trProductsIndexRel,
  });
}

function footer(prefix) {
  return siteFooter({
    prefix,
    locale: loc.locale,
    homeHref: loc.homeHref(prefix),
    productsHref: loc.productsHref(prefix),
    catalogHref: loc.catalogHref(prefix),
    blogHref: loc.blogHref(prefix),
    compareHref: loc.compareHref(prefix),
    aboutHref: loc.aboutHref(prefix),
    qualityHref: loc.qualityHref(prefix),
    contactHref: loc.contactHref(prefix),
    privacyHref: loc.privacyHref(prefix),
    kvkkHref: loc.kvkkHref(prefix),
    termsHref: loc.termsHref(prefix),
  });
}

function productCard(p, linkPrefix, comparePage) {
  return `          <article class="product-card lift-card">
            <a href="${linkPrefix}${p.slug}/index.html" class="product-card__image img-placeholder">
              <img src="${linkPrefix.replace(/\.\.\//g, (m, o) => m)}" style="display:none" alt="${esc(p.ad_tr)}" loading="lazy">
            </a>
            <div class="product-card__body">
              <span class="product-card__model">${esc(p.model_kodu)}</span>
              <a href="${linkPrefix}${p.slug}/index.html" class="product-card__title">${esc(p.ad_tr)}</a>
              <p class="product-card__summary">${esc(p.kisa_aciklama_tr)}</p>
              <div class="product-card__actions">
                <a href="${linkPrefix}${p.slug}/index.html" class="btn btn--primary btn--sm">İncele</a>
                <button type="button" class="btn btn--outline btn--sm" data-compare-toggle="${p.slug}" data-compare-page="${comparePage}"><span data-compare-label>Karşılaştır</span></button>
              </div>
            </div>
          </article>`;
}

function productCardFixed(p, assetPrefix, pagePrefix, comparePage) {
  const ui = loc.ui;
  const baseFile = productImageFileName(p.slug, 1);
  const variants = productVariantSet(baseFile);
  const cardWidths = variants.widths.filter((w) => w === 400 || w === 800);
  const useWidths = cardWidths.length ? cardWidths : variants.widths;
  const displayFile = productDisplayFile(baseFile, 400, useWidths, variants.filesByWidth);
  const img = productPublicPath(displayFile, assetPrefix);
  const srcset = useWidths.length
    ? productSrcset(baseFile, assetPrefix, useWidths, variants.filesByWidth)
    : '';
  const dims = scaledDims(displayFile, 400);
  const imageClass = hasProductImages(p.slug) ? 'product-card__image' : 'product-card__image img-placeholder';
  const imgTag = hasProductImages(p.slug)
    ? `<img src="${img}"${srcset ? ` srcset="${srcset}"` : ''} sizes="(max-width:767px) 100vw, (max-width:1024px) 50vw, 390px" width="${dims.width}" height="${dims.height}" alt="${esc(p.ad_tr)}" loading="lazy" decoding="async">`
    : `<img src="${img}" alt="${esc(p.ad_tr)}" loading="lazy" style="display:none">`;
  return `          <article class="product-card lift-card">
            <a href="${pagePrefix}${p.slug}/index.html" class="${imageClass}">
              ${imgTag}
            </a>
            <div class="product-card__body">
              <span class="product-card__model">${esc(p.model_kodu)}</span>
              <a href="${pagePrefix}${p.slug}/index.html" class="product-card__title">${esc(p.ad_tr)}</a>
              <p class="product-card__summary">${esc(p.kisa_aciklama_tr)}</p>
              <div class="product-card__actions">
                <a href="${pagePrefix}${p.slug}/index.html" class="btn btn--primary btn--sm">${esc(ui.view)}</a>
                <button type="button" class="btn btn--outline btn--sm" data-compare-toggle="${p.slug}" data-compare-page="${comparePage}"><span data-compare-label>${esc(ui.compare)}</span></button>
              </div>
            </div>
          </article>`;
}

function generateProductPage(product) {
  const cat = getCategory(product.kategori_slug);
  const prefix = loc.productPrefix;
  const ui = loc.ui;
  const related = getRelated(product);
  const chips = product.teknik_tablo.slice(0, 4);
  const imageCount = productImageCount(product.slug) || 4;

  const specRows = product.teknik_tablo
    .map((row) => {
      const label = translateSpecLabel(row.ozellik, loc.locale);
      return `              <tr><th scope="row">${esc(label)}</th><td>${esc(row.deger)}</td></tr>`;
    })
    .join('\n');

  const chipHtml = chips
    .map((row) => {
      const label = translateSpecLabel(row.ozellik, loc.locale);
      return `<span class="chip"><span class="chip__key">${esc(label)}:</span> ${esc(row.deger)}</span>`;
    })
    .join('\n            ');

  const faqHtml = getProductFaqs(product).map(
    (f) => `          <div class="accordion__item">
            <button type="button" class="accordion__trigger" aria-expanded="false">${esc(f.q)}<svg class="accordion__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>
            <div class="accordion__content">${esc(f.a)}</div>
          </div>`
  ).join('\n');

  const relatedHtml = related.length
    ? related
        .map((p) => {
          const baseFile = productImageFileName(p.slug, 1);
          const variants = productVariantSet(baseFile);
          const cardWidths = variants.widths.filter((w) => w === 400 || w === 800);
          const useWidths = cardWidths.length ? cardWidths : variants.widths;
          const displayFile = productDisplayFile(baseFile, 400, useWidths, variants.filesByWidth);
          const relImg = productPublicPath(displayFile, prefix);
          const srcset = useWidths.length
            ? productSrcset(baseFile, prefix, useWidths, variants.filesByWidth)
            : '';
          const dims = scaledDims(displayFile, 400);
          const relImageClass = hasProductImages(p.slug) ? 'product-card__image' : 'product-card__image img-placeholder';
          const relHref = loc.productHrefRelated(p);
          const relImgTag = hasProductImages(p.slug)
            ? `<img src="${relImg}"${srcset ? ` srcset="${srcset}"` : ''} sizes="(max-width:767px) 100vw, (max-width:1024px) 50vw, 390px" width="${dims.width}" height="${dims.height}" alt="${esc(p.ad_tr)}" loading="lazy" decoding="async">`
            : '';
          return `          <article class="product-card lift-card">
            <a href="${relHref}" class="${relImageClass}">${relImgTag}</a>
            <div class="product-card__body">
              <span class="product-card__model">${esc(p.model_kodu)}</span>
              <a href="${relHref}" class="product-card__title">${esc(p.ad_tr)}</a>
              <p class="product-card__summary">${esc(p.kisa_aciklama_tr)}</p>
              <div class="product-card__actions"><a href="${relHref}" class="btn btn--primary btn--sm">${esc(ui.view)}</a></div>
            </div>
          </article>`;
        })
        .join('\n')
    : '';

  const thumbs = Array.from({ length: imageCount }, (_, i) => i + 1)
    .map((n, i) => {
      const baseFile = productImageFileName(product.slug, n);
      const variants = productVariantSet(baseFile);
      const galleryWidths = variants.widths.filter((w) => w === 640 || w === 1200);
      const srcsetWidths = galleryWidths.length ? galleryWidths : variants.widths;
      const fullFile = productLargestFile(
        baseFile,
        srcsetWidths.length ? srcsetWidths : variants.widths,
        variants.filesByWidth
      );
      const fullSrc = productPublicPath(fullFile, prefix);
      const srcset = srcsetWidths.length
        ? productSrcset(baseFile, prefix, srcsetWidths, variants.filesByWidth)
        : '';
      const thumbFile = variants.thumb || baseFile;
      const thumbSrc = productPublicPath(thumbFile, prefix);
      const alt = productImageAlt(product.slug, n) || `${product.ad_tr} — ${ui.galleryImage} ${n}`;
      return `<button type="button" class="product-gallery__thumb${i === 0 ? ' is-active' : ''}" data-gallery-thumb data-src="${fullSrc}"${srcset ? ` data-srcset="${srcset}"` : ''} data-alt="${esc(alt)}" aria-label="${esc(ui.galleryImage)} ${n}"><img src="${thumbSrc}" width="90" height="90" alt="" loading="lazy" decoding="async"></button>`;
    })
    .join('\n            ');

  const mainBase = productImageFileName(product.slug, 1);
  const mainVariants = productVariantSet(mainBase);
  const mainGalleryWidths = mainVariants.widths.filter((w) => w === 640 || w === 1200);
  const mainSrcsetWidths = mainGalleryWidths.length ? mainGalleryWidths : mainVariants.widths;
  const mainDisplayFile = productDisplayFile(
    mainBase,
    640,
    mainSrcsetWidths.length ? mainSrcsetWidths : mainVariants.widths,
    mainVariants.filesByWidth
  );
  const mainSrc = productPublicPath(mainDisplayFile, prefix);
  const mainSrcset = mainSrcsetWidths.length
    ? productSrcset(mainBase, prefix, mainSrcsetWidths, mainVariants.filesByWidth)
    : '';
  const mainDims = scaledDims(mainDisplayFile, 640);
  const mainImageClass = hasProductImages(product.slug) ? 'product-gallery__main' : 'product-gallery__main img-placeholder';
  const mainAlt = productImageAlt(product.slug, 1) || product.ad_tr;
  const mainSizes = '(max-width: 1024px) 100vw, 640px';
  const preloadTag = hasProductImages(product.slug)
    ? `  <link rel="preload" as="image" type="image/webp" href="${mainSrc}"${mainSrcset ? ` imagesrcset="${mainSrcset}"` : ''} imagesizes="${mainSizes}" fetchpriority="high">\n`
    : '';
  const ogDims = productImageDims(mainBase);
  const canonicalRel = loc.canonicalProduct(product);
  const pageTitle = product.meta_title || `${product.ad_tr} — ${ui.brandSuffix}`;
  const pageDesc =
    product.meta_desc ||
    `${product.ad_tr} — ${product.kisa_aciklama_tr}. ${ui.brandSuffix} ${cat.kisa_ad}.`;
  const seoBlock = renderSeoHead({
    title: pageTitle,
    description: pageDesc,
    canonicalPathRel: canonicalRel,
    hreflangSourceRel: loc.trProductRel(product),
    ogType: 'product',
    ogImage: productOgImageUrl(product.slug, imageManifest),
    ogImageAlt: mainAlt,
    ogImageWidth: ogDims.width || 1200,
    ogImageHeight: ogDims.height || 630,
    locale: ui.ogLocale,
  });
  const productSchema = productSchemaJson(
    product,
    { metaDescription: pageDesc, imageManifest },
    canonicalRel
  );
  const productFaqs = getProductFaqs(product);
  const faqSchemaTag = productFaqs.length
    ? `\n  <script type="application/ld+json">${faqPageSchemaJson(productFaqs)}</script>`
    : '';

  const productsListHref = loc.productsIndexHrefFromProduct();
  const categoryHref = loc.categoryHrefFromProduct(cat);

  return `<!DOCTYPE html>
<html ${loc.htmlLangAttrs}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(pageDesc)}">
  <title>${esc(pageTitle)}</title>
${seoBlock}
  <script type="application/ld+json">${productSchema}</script>${faqSchemaTag}
  <link rel="icon" href="${prefix}assets/img/duru-icon.svg" type="image/svg+xml">
${preloadTag}${renderHeadAssets(prefix, { extraStylesheets: loc.extraStylesheets })}
</head>
<body>

${header(prefix, product.slug, loc.trProductRel(product))}

  <div class="breadcrumb-bar">
    <div class="container">
      <ol class="breadcrumb">
        <li><a href="${loc.homeHref(prefix)}">${esc(ui.home)}</a> ›</li>
        <li><a href="${productsListHref}">${esc(ui.products)}</a> ›</li>
        <li><a href="${categoryHref}">${esc(cat.kisa_ad)}</a> ›</li>
        <li><span class="breadcrumb__current">${esc(product.ad_tr)}</span></li>
      </ol>
    </div>
  </div>

  <main>
    <section class="section bg-white" style="padding-top:2.5rem;padding-bottom:3.5rem">
      <div class="container product-detail__grid">
        <div data-product-gallery>
          <div class="${mainImageClass}">
            <img data-gallery-main src="${mainSrc}"${mainSrcset ? ` srcset="${mainSrcset}"` : ''} sizes="${mainSizes}" width="${mainDims.width}" height="${mainDims.height}" fetchpriority="high" decoding="async" alt="${esc(mainAlt)}">
          </div>
          <div class="product-gallery__thumbs">
            ${thumbs}
          </div>
        </div>

        <div class="product-info">
          <div class="eyebrow">${esc(cat.kisa_ad)} · ${esc(ui.modelLabel)} ${esc(product.model_kodu)}</div>
          <h1 class="product-info__title">${esc(product.ad_tr)}</h1>
          <p class="product-info__summary">${esc(product.kisa_aciklama_tr)}</p>

          <div class="product-info__chips">
            ${chipHtml}
          </div>

          <div class="action-bar">
            <div class="action-bar__header">
              <div>
                <div class="eyebrow eyebrow--muted">${esc(ui.requestEyebrow)}</div>
                <div style="font-family:var(--font-display);font-weight:600;color:var(--color-primary)">${esc(ui.requestTitle)}</div>
              </div>
              <div class="action-bar__note">${esc(ui.sameDayNote)}</div>
            </div>
            <div class="action-bar__actions">
              <a href="${loc.quoteHref(prefix)}?products=${encodeURIComponent(product.slug)}" class="btn btn--primary">${esc(ui.quoteArrow)}</a>
              <button type="button" class="btn btn--outline" data-compare-toggle="${product.slug}" data-compare-page="${loc.compareHref(prefix)}"><span data-compare-label>${esc(ui.compare)}</span></button>
            </div>
            <a href="https://wa.me/${data.kurumsal_bilgiler.whatsapp}" class="action-bar__wa" target="_blank" rel="noopener">${esc(ui.whatsappCta)}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section bg-muted border-y">
      <div class="container container--narrow">
        <div class="eyebrow">${esc(ui.specsEyebrow)}</div>
        <h2 class="section-title" style="margin-bottom:2rem">${esc(product.ad_tr)} — ${esc(ui.specsHeadingSuffix)}</h2>
        <div class="spec-table-wrap">
          <table class="spec-table">
            <tbody>
${specRows}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container container--text">
        <div class="eyebrow">${esc(ui.whyModel)}</div>
        <h2 class="section-title" style="margin-bottom:1.5rem">${esc(ui.productDetails)}</h2>
        <!-- GENİŞ AÇIKLAMA: buraya gelecek -->
        <p style="color:rgba(43,46,51,0.8);line-height:1.65;margin-bottom:1.25rem">${esc(product.kisa_aciklama_tr)}. ${esc(ui.detailP1Suffix)}</p>
        <p style="color:rgba(43,46,51,0.8);line-height:1.65">${esc(ui.detailP2)}</p>
      </div>
    </section>

    <section class="section bg-muted border-y">
      <div class="container">
        <div class="eyebrow">${esc(ui.usageAreas)}</div>
        <h2 class="section-title" style="margin-bottom:2rem">${esc(ui.wherePreferred)}</h2>
        <div class="sector-grid">
${usageAreasHtml()}
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container container--text">
        <div class="eyebrow">${esc(ui.faqEyebrow)}</div>
        <h2 class="section-title" style="margin-bottom:2rem">${esc(ui.faqHeading)}</h2>
        <div class="accordion" data-accordion>
${faqHtml}
        </div>
      </div>
    </section>

${
  relatedHtml
    ? `    <section class="section bg-muted border-y">
      <div class="container">
        <div class="eyebrow">${esc(ui.related)}</div>
        <h2 class="section-title" style="margin-bottom:2rem">${esc(ui.related)}</h2>
        <div class="grid-3">
${relatedHtml}
        </div>
      </div>
    </section>`
    : ''
}
  </main>

${footer(prefix)}

${renderBodyScripts(prefix)}
</body>
</html>
`;
}

function generateCategoryPage(category) {
  const prefix = loc.categoryPrefix;
  const ui = loc.ui;
  const products = data.urunler.filter((p) => p.kategori_slug === category.slug);
  const cardPagePrefix = loc.locale === 'tr' ? '' : '../';
  const cards = products
    .map((p) => productCardFixed(p, prefix, cardPagePrefix, loc.compareHref(prefix)))
    .join('\n');

  let relatedSection = '';
  if (category.slug === 'sera-tipi-ulv-ilaclama') {
    const humidity = data.urunler.filter((p) => p.kategori_slug === 'nemlendirme-ulv');
    if (humidity.length) {
      const humPrefix = loc.locale === 'tr' ? '../nemlendirme-ulv/' : '../';
      const relatedCards = humidity
        .map((p) => productCardFixed(p, prefix, humPrefix, loc.compareHref(prefix)))
        .join('\n');
      const humIndex =
        loc.locale === 'tr'
          ? '../nemlendirme-ulv/index.html'
          : '../nemlendirme-ulv/index.html';
      relatedSection = `
    <section class="section bg-muted border-y">
      <div class="container">
        <div class="section-header-row">
          <div>
            <div class="eyebrow">${esc(ui.related)}</div>
            <h2 class="section-title">${esc(ui.related)}</h2>
          </div>
          <a href="${humIndex}" class="link-arrow">${esc(ui.view)} →</a>
        </div>
        <div class="grid-3">
${relatedCards}
        </div>
      </div>
    </section>`;
    }
  }

  const catDesc = `${category.ad_tr} — ${ui.brandSuffix} ${products.length} ${ui.modelUnit}. ${category.aciklama_tr}`;
  const catTitle = `${category.kisa_ad} — ${ui.brandSuffix}`;
  const firstProduct = products[0];
  const catOg = firstProduct
    ? productOgImageUrl(firstProduct.slug, imageManifest)
    : undefined;
  const seoBlock = renderSeoHead({
    title: catTitle,
    description: catDesc,
    canonicalPathRel: loc.canonicalCategory(category),
    hreflangSourceRel: loc.trCategoryRel(category),
    ogImage: catOg,
    ogImageAlt: category.ad_tr,
    locale: ui.ogLocale,
  });

  return `<!DOCTYPE html>
<html ${loc.htmlLangAttrs}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(catDesc)}">
  <title>${esc(catTitle)}</title>
${seoBlock}
  <link rel="icon" href="${prefix}assets/img/duru-icon.svg" type="image/svg+xml">
${renderHeadAssets(prefix, { extraStylesheets: loc.extraStylesheets })}
</head>
<body>

${header(prefix, null, loc.trCategoryRel(category))}

  <main>
    <section class="section section--lg bg-white">
      <div class="container">
        <div class="section-header-row">
          <div>
            <div class="eyebrow">Ürün Kategorisi</div>
            <h1 class="section-title">${esc(category.ad_tr)}</h1>
          </div>
          <p>${esc(category.aciklama_tr)}</p>
        </div>
        <p style="font-size:0.875rem;color:rgba(43,46,51,0.6);margin:-1.5rem 0 2rem">${products.length} model</p>
        <div class="grid-3">
${cards}
        </div>
      </div>
    </section>
${relatedSection}
    <section class="section bg-muted border-y">
      <div class="container container--narrow">
        <div class="cta-box">
          <div class="cta-box__grid">
            <div>
              <h2 class="section-title" style="font-size:clamp(1.5rem,3vw,1.875rem)">${esc(category.kisa_ad)} modelleri için teklif alın</h2>
              <p class="cta-box__text">Birden fazla modeli karşılaştırıp tek form ile özel teklif talep edebilirsiniz.</p>
            </div>
            <div class="cta-box__actions">
              <a href="${loc.quoteHref(prefix)}" class="btn btn--primary">${esc(ui.quoteArrow)}</a>
              <a href="${prefix}${loc.locale === 'tr' ? '' : `${loc.locale}/`}iletisim/index.html" class="btn btn--outline">İletişim</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

${footer(prefix)}

${renderBodyScripts(prefix)}
</body>
</html>
`;
}

function generateProductsIndex() {
  const prefix = loc.productsIndexPrefix;
  const ui = loc.ui;
  const categoryCards = data.kategoriler
    .map((cat) => {
      const count = data.urunler.filter((p) => p.kategori_slug === cat.slug).length;
      return renderCategoryCard(cat, { linkPrefix: '', count, headingTag: 'h2', esc });
    })
    .join('\n');

  const allCards = data.urunler
    .map((p) => {
      const cat = getCategory(p.kategori_slug);
      const baseFile = productImageFileName(p.slug, 1);
      const variants = productVariantSet(baseFile);
      const cardWidths = variants.widths.filter((w) => w === 400 || w === 800);
      const useWidths = cardWidths.length ? cardWidths : variants.widths;
      const displayFile = productDisplayFile(baseFile, 400, useWidths, variants.filesByWidth);
      const img = productPublicPath(displayFile, prefix);
      const srcset = useWidths.length
        ? productSrcset(baseFile, prefix, useWidths, variants.filesByWidth)
        : '';
      const dims = scaledDims(displayFile, 400);
      const imageClass = hasProductImages(p.slug) ? 'product-card__image' : 'product-card__image img-placeholder';
      const href = loc.productHrefFromIndex(p);
      const imgTag = hasProductImages(p.slug)
        ? `<img src="${img}"${srcset ? ` srcset="${srcset}"` : ''} sizes="(max-width:767px) 100vw, (max-width:1024px) 50vw, 390px" width="${dims.width}" height="${dims.height}" alt="${esc(p.ad_tr)}" loading="lazy" decoding="async">`
        : `<img src="${img}" alt="${esc(p.ad_tr)}" loading="lazy" style="display:none">`;
      return `          <article class="product-card lift-card">
            <a href="${href}" class="${imageClass}">
              ${imgTag}
            </a>
            <div class="product-card__body">
              <span class="product-card__model">${esc(p.model_kodu)} · ${esc(cat.kisa_ad)}</span>
              <a href="${href}" class="product-card__title">${esc(p.ad_tr)}</a>
              <p class="product-card__summary">${esc(p.kisa_aciklama_tr)}</p>
              <div class="product-card__actions">
                <a href="${href}" class="btn btn--primary btn--sm">${esc(ui.view)}</a>
                <button type="button" class="btn btn--outline btn--sm" data-compare-toggle="${p.slug}" data-compare-page="${loc.compareHref(prefix)}"><span data-compare-label>${esc(ui.compare)}</span></button>
              </div>
            </div>
          </article>`;
    })
    .join('\n');

  const productCount = data.urunler.length;
  const categoryCount = data.kategoriler.length;
  const catNames = data.kategoriler.map((c) => c.kisa_ad.toLowerCase()).join(', ');
  const listDesc =
    loc.locale === 'tr'
      ? `Duru ULV ürün kataloğu — ${productCount} model, ${categoryCount} kategori: ${catNames}.`
      : `${ui.brandSuffix} product catalog — ${productCount} ${ui.modelUnit}, ${categoryCount} ${ui.categoryUnit}: ${catNames}.`;
  const listTitle = `${ui.products} — ${ui.brandSuffix}`;
  const seoBlock = renderSeoHead({
    title: listTitle,
    description: listDesc,
    canonicalPathRel: loc.canonicalProductsIndex,
    hreflangSourceRel: loc.trProductsIndexRel,
    ogImage: productOgImageUrl('duru-hd50', imageManifest),
    ogImageAlt: listTitle,
    locale: ui.ogLocale,
  });

  return `<!DOCTYPE html>
<html ${loc.htmlLangAttrs}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(listDesc)}">
  <title>${esc(listTitle)}</title>
${seoBlock}
  <link rel="icon" href="${prefix}assets/img/duru-icon.svg" type="image/svg+xml">
${renderHeadAssets(prefix, { extraStylesheets: loc.extraStylesheets })}
</head>
<body>

${header(prefix, null, loc.trProductsIndexRel)}

  <div class="breadcrumb-bar">
    <div class="container">
      <ol class="breadcrumb">
        <li><a href="${loc.homeHref(prefix)}">${esc(ui.home)}</a> ›</li>
        <li><span class="breadcrumb__current">${esc(ui.products)}</span></li>
      </ol>
    </div>
  </div>

  <main>
    <section class="section section--lg bg-white">
      <div class="container">
        <div style="margin-bottom:3rem">
          <div class="eyebrow">${esc(ui.catalogEyebrow)}</div>
          <h1 class="section-title">${productCount} ${esc(ui.modelUnit)} · ${categoryCount} ${esc(ui.categoryUnit)}</h1>
          <p style="max-width:36rem;margin-top:1rem;color:rgba(43,46,51,0.75);line-height:1.65">${esc(ui.productsLead)}</p>
        </div>

        <h2 class="section-title" style="font-size:1.5rem;margin-bottom:1.5rem">${esc(ui.categories)}</h2>
        <div class="category-grid" style="margin-bottom:4rem">
${categoryCards}
        </div>

        <h2 class="section-title" style="font-size:1.5rem;margin-bottom:1.5rem">${esc(ui.allModels)}</h2>
        <div class="grid-3">
${allCards}
        </div>
      </div>
    </section>
  </main>

${footer(prefix)}

${renderBodyScripts(prefix)}
</body>
</html>
`;
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

buildSiteCss();

for (const locale of ['tr', 'en', 'ar']) {
  data = loadCatalog(locale);
  loc = localePaths(locale);
  let n = 0;
  for (const product of data.urunler) {
    writeFile(path.join(ROOT, loc.productFile(product)), generateProductPage(product));
    n += 1;
  }
  for (const category of data.kategoriler) {
    writeFile(path.join(ROOT, loc.categoryFile(category)), generateCategoryPage(category));
  }
  writeFile(path.join(ROOT, loc.productsIndexFile), generateProductsIndex());
  console.log(
    `[${locale}] ${n} products, ${data.kategoriler.length} categories → ${loc.productsIndexFile}`
  );
}
