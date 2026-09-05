/**
 * Fill EN/AR product compare pages only. Never writes blog/ or urunler/.
 * Usage: node scripts/fill-locale-compare.js
 */
const fs = require('fs');
const path = require('path');
const { siteHeader, siteFooter } = require('./site-layout');
const { renderHeadAssets, renderBodyScripts, withHashedAssetPaths } = require('./head-assets');
const { renderSeoHead } = require('./seo-meta');
const { localePaths } = require('./i18n');
const { loadManifest } = require('./static-asset-hashes');

const ROOT = path.join(__dirname, '..');
const DEFAULT_OG = 'assets/img/products/duru-hd50-01.webp';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonForScript(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

function writePage(rel, html) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, 'utf8');
  console.log('wrote', rel.replace(/\\/g, '/'));
}

function buildEmbed(locale) {
  const catalog = JSON.parse(
    fs.readFileSync(path.join(ROOT, `assets/data/urunler.${locale}.json`), 'utf8')
  );
  const nameKey = locale === 'en' ? 'ad_en' : 'ad_ar';
  const descKey = locale === 'en' ? 'kisa_aciklama_en' : 'kisa_aciklama_ar';
  return {
    urunler: (catalog.urunler || []).map((p) => ({
      slug: p.slug,
      kategori_slug: p.kategori_slug,
      ad_tr: p[nameKey] || p.ad_tr,
      ad_en: p.ad_en || undefined,
      ad_ar: p.ad_ar || undefined,
      model_kodu: p.model_kodu,
      kisa_aciklama_tr: p[descKey] || p.kisa_aciklama_tr,
      gorsel: p.gorsel,
      teknik_tablo: p.teknik_tablo,
    })),
  };
}

const COPY = {
  en: {
    title: 'Product Comparison — Duru ULV',
    description:
      'Compare Duru ULV products side by side. Up to 4 models with a shareable URL.',
    eyebrow: 'Product Comparison',
    h1: 'Review your selected products side by side.',
    lead:
      'Compare up to 4 models at once and request a quote for all of them in one step. Comparison links can be shared via URL.',
    countSuffix: ' / 4 selected',
    msgs: {
      'empty-title': 'No products selected yet',
      'empty-body':
        'Add products with the <strong>Compare</strong> button on product pages (max 4), then open <strong>Compare</strong> in the menu.',
      'empty-cta': 'Explore Products →',
      clear: 'Clear all',
      print: 'Print',
      pdf: 'Comparison PDF',
      'quote-pdf': 'Quote PDF',
      'form-quote': 'Send quote via form →',
      feature: 'Feature',
      action: 'Actions',
      inspect: 'View',
      'get-quote': 'Get Quote',
      remove: 'Remove',
      'alert-max': 'You can compare up to 4 products.',
      'err-not-found': 'Selected products were not found. Clear the list and add them again.',
      'err-load':
        'Could not load product data. Refresh the page or open the site via a local web server.',
      'err-clear': 'Clear list',
      'err-slugs': 'Selected slugs:',
      'pdf-fail': 'Comparison PDF module failed to load. Refresh and try again.',
      'quote-pdf-fail': 'Quote PDF module failed to load. Refresh and try again.',
      'pdf-missing': 'PDF module not loaded',
    },
  },
  ar: {
    title: 'مقارنة المنتجات — Duru ULV',
    description: 'قارن منتجات Duru ULV جنباً إلى جنب. حتى 4 طرازات مع رابط قابل للمشاركة.',
    eyebrow: 'مقارنة المنتجات',
    h1: 'راجع المنتجات المحددة جنباً إلى جنب.',
    lead:
      'يمكنك مقارنة ما يصل إلى 4 طرازات دفعة واحدة وطلب عرض سعر للجميع بخطوة واحدة. رابط المقارنة قابل للمشاركة عبر URL.',
    countSuffix: ' / 4 محدد',
    msgs: {
      'empty-title': 'لم يتم اختيار منتجات بعد',
      'empty-body':
        'أضف المنتجات عبر زر <strong>قارن</strong> في صفحات المنتج (حد أقصى 4)، ثم افتح <strong>قارن</strong> من القائمة.',
      'empty-cta': 'استكشف المنتجات ←',
      clear: 'مسح الكل',
      print: 'طباعة',
      pdf: 'PDF المقارنة',
      'quote-pdf': 'PDF العرض',
      'form-quote': 'إرسال طلب عبر النموذج ←',
      feature: 'الميزة',
      action: 'إجراءات',
      inspect: 'عرض',
      'get-quote': 'اطلب عرضاً',
      remove: 'إزالة',
      'alert-max': 'يمكنك مقارنة ما يصل إلى 4 منتجات.',
      'err-not-found': 'لم يتم العثور على المنتجات المحددة. امسح القائمة وأضفها مجدداً.',
      'err-load': 'تعذر تحميل بيانات المنتجات. حدّث الصفحة أو افتح الموقع عبر خادم ويب محلي.',
      'err-clear': 'مسح القائمة',
      'err-slugs': 'المعرفات المحددة:',
      'pdf-fail': 'تعذر تحميل وحدة PDF للمقارنة. حدّث الصفحة وحاول مجدداً.',
      'quote-pdf-fail': 'تعذر تحميل وحدة PDF للعرض. حدّث الصفحة وحاول مجدداً.',
      'pdf-missing': 'وحدة PDF غير محمّلة',
    },
  },
};

function msgAttrs(msgs) {
  return Object.entries(msgs)
    .map(([k, v]) => ` data-msg-${k}="${esc(v)}"`)
    .join('');
}

function writeCompare(locale) {
  const loc = localePaths(locale);
  const ui = loc.ui;
  const copy = COPY[locale];
  const outRel = `${locale}/urun-karsilastirma/index.html`;
  const depth = outRel.split('/').filter(Boolean).length - 1;
  const prefix = '../'.repeat(depth);
  const trRel = 'urun-karsilastirma/index.html';
  const manifest = loadManifest();
  const seo = renderSeoHead({
    title: copy.title,
    description: copy.description,
    canonicalPathRel: outRel,
    hreflangSourceRel: trRel,
    ogImage: DEFAULT_OG,
    ogImageAlt: copy.h1,
    locale: ui.ogLocale,
  });
  const header = siteHeader({
    prefix,
    locale,
    trPathRel: trRel,
    homeHref: loc.homeHref(prefix),
    productsHref: loc.productsHref(prefix),
    catalogHref: loc.catalogHref(prefix),
    blogHref: loc.blogHref(prefix),
    compareHref: loc.compareHref(prefix),
    aboutHref: loc.aboutHref(prefix),
    contactHref: loc.contactHref(prefix),
    quoteHref: loc.quoteHref(prefix),
  });
  const footer = siteFooter({
    prefix,
    locale,
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
  const extra = locale === 'ar' ? ['assets/css/rtl.css'] : [];
  const extraCss = [
    `assets/css/pdf-export.css`,
    `assets/css/compare-print.css`,
  ];
  const embed = jsonForScript(buildEmbed(locale));
  const pdfScripts = withHashedAssetPaths(
    `  <script src="${prefix}assets/js/vendor/html2canvas.min.js"></script>
  <script src="${prefix}assets/js/vendor/jspdf.umd.min.js"></script>
  <script src="${prefix}assets/js/pdf-utils.js"></script>
  <script src="${prefix}assets/js/quote-pdf.js"></script>
  <script src="${prefix}assets/js/compare-pdf.js"></script>`,
    manifest
  );

  const html = `<!DOCTYPE html>
<html ${loc.htmlLangAttrs}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(copy.description)}">
  <title>${esc(copy.title)}</title>
${seo}
  <link rel="icon" href="${prefix}assets/img/duru-icon.svg" type="image/svg+xml">
${renderHeadAssets(prefix, { extraStylesheets: [...extra, ...extraCss] })}
</head>
<body>

${header}
  <main>
    <section class="section bg-white border-y" style="padding-bottom:2rem">
      <div class="container">
        <div class="section-header-row">
          <div>
            <div class="eyebrow">${esc(copy.eyebrow)}</div>
            <h1 class="section-title">${esc(copy.h1)}</h1>
            <p style="max-width:36rem;margin-top:1rem;color:rgba(43,46,51,0.7);line-height:1.65">${esc(copy.lead)}</p>
          </div>
          <div style="text-align:right">
            <span id="compare-count-display" style="font-family:var(--font-display);font-size:3rem;font-weight:700;color:var(--color-primary)">0</span>
            <span style="font-size:0.875rem;color:rgba(43,46,51,0.65);text-transform:uppercase;letter-spacing:0.16em">${esc(copy.countSuffix)}</span>
          </div>
        </div>
      </div>
    </section>
    <div id="compare-app"${msgAttrs(copy.msgs)}></div>
    <div id="compare-pdf-sheet" class="pdf-sheet" aria-hidden="true"></div>
    <div id="quote-pdf-sheet" class="pdf-sheet" aria-hidden="true"></div>
    <script id="duru-urunler-embed" type="application/json">${embed}</script>
  </main>
${footer}

${renderBodyScripts(prefix, { extraScripts: pdfScripts })}
</body>
</html>
`;

  writePage(outRel, html);
}

['en', 'ar'].forEach(writeCompare);
console.log('done');
