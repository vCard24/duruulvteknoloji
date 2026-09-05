/**
 * Fill EN/AR thank-you pages only. Never writes TR tesekkurler/ blog/ urunler/.
 * Usage: node scripts/fill-locale-tesekkurler.js
 */
const fs = require('fs');
const path = require('path');
const { siteHeader, siteFooter } = require('./site-layout');
const { renderHeadAssets, renderBodyScripts } = require('./head-assets');
const { renderSeoHead } = require('./seo-meta');
const { localePaths } = require('./i18n');

const ROOT = path.join(__dirname, '..');
const DEFAULT_OG = 'assets/img/products/duru-hd50-01.webp';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function writePage(rel, html) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, 'utf8');
  console.log('wrote', rel.replace(/\\/g, '/'));
}

const COPY = {
  en: {
    title: 'Thank You — Duru ULV',
    description: 'Your quote request was received. The Duru ULV team will get back to you shortly.',
    h1: 'Thank you!',
    body:
      'Your quote request has reached us. Our sales engineer will reply the same business day. For urgent cases you can also reach us on WhatsApp or by phone.',
    home: 'Back to home →',
  },
  ar: {
    title: 'شكراً لك — Duru ULV',
    description: 'تم استلام طلب عرض السعر. سيتواصل معك فريق Duru ULV قريباً.',
    h1: 'شكراً لك!',
    body:
      'وصلنا طلب عرض السعر. سيرد مهندس المبيعات في نفس يوم العمل. للحالات العاجلة يمكنك التواصل عبر واتساب أو الهاتف.',
    home: 'العودة إلى الصفحة الرئيسية ←',
  },
};

function writeThanks(locale) {
  const loc = localePaths(locale);
  const ui = loc.ui;
  const copy = COPY[locale];
  const outRel = `${locale}/tesekkurler/index.html`;
  const depth = outRel.split('/').filter(Boolean).length - 1;
  const prefix = '../'.repeat(depth);
  const trRel = 'tesekkurler/index.html';
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/urunler.json'), 'utf8'));
  const wa = data.kurumsal_bilgiler.whatsapp;
  const seo = renderSeoHead({
    title: copy.title,
    description: copy.description,
    canonicalPathRel: outRel,
    hreflangSourceRel: trRel,
    ogImage: DEFAULT_OG,
    ogImageAlt: copy.h1,
    locale: ui.ogLocale,
    robots: 'noindex, nofollow',
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

  const html = `<!DOCTYPE html>
<html ${loc.htmlLangAttrs}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(copy.description)}">
  <title>${esc(copy.title)}</title>
${seo}
  <link rel="icon" href="${prefix}assets/img/duru-icon.svg" type="image/svg+xml">
${renderHeadAssets(prefix, { extraStylesheets: extra })}
</head>
<body>

${header}
  <main>
    <section class="section section--lg bg-muted">
      <div class="container container--narrow">
        <div class="empty-state">
          <div class="success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
          </div>
          <h1 class="section-title" style="margin-bottom:1rem">${esc(copy.h1)}</h1>
          <p style="color:rgba(43,46,51,0.75);line-height:1.65;max-width:28rem;margin:0 auto 2rem">${esc(copy.body)}</p>
          <div style="display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:center;margin-bottom:2rem">
            <a href="tel:+903523202086" class="btn btn--outline">+90 352 320 20 86</a>
            <a href="https://wa.me/${esc(wa)}" class="btn btn--primary" style="background:#25D366;border-color:#25D366" target="_blank" rel="noopener">WhatsApp</a>
          </div>
          <a href="${loc.homeHref(prefix)}" class="link-arrow">${esc(copy.home)}</a>
        </div>
      </div>
    </section>
  </main>
${footer}

${renderBodyScripts(prefix)}
</body>
</html>
`;
  writePage(outRel, html);
}

['en', 'ar'].forEach(writeThanks);
console.log('done');
