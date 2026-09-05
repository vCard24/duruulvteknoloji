/**
 * Fill EN/AR blog post pages + update locale blog indexes.
 * Never writes TR blog/ or urunler/.
 * Usage: node scripts/fill-locale-blog-posts.js
 */
const fs = require('fs');
const path = require('path');
const { siteHeader, siteFooter } = require('./site-layout');
const { renderHeadAssets, renderBodyScripts } = require('./head-assets');
const { renderSeoHead } = require('./seo-meta');
const { localePaths } = require('./i18n');
const { POSTS } = require('./locale-blog-bodies');

const ROOT = path.join(__dirname, '..');
const META = JSON.parse(fs.readFileSync(path.join(__dirname, '_blog-meta.json'), 'utf8'));
const META_BY_SLUG = Object.fromEntries(META.map((m) => [m.slug, m]));

const BLOG_COVER = {
  'ulv-ilaclama-nedir': 'ulv-ilaclama-nedir-cover-400.3d4b96e7.webp',
  'mist-blower-ulv-pulverizator-farki': 'mist-blower-ulv-pulverizator-farki-cover-400.b1aad346.webp',
  'belediye-ilaclama-ekipmani-secimi': 'belediye-ilaclama-ekipmani-secimi-cover-400.4f981e8a.webp',
  'belediye-ilaclama-neden-yetersiz': 'belediye-ilaclama-neden-yetersiz-cover-400.df1ae0c3.webp',
  'sera-zararlilari-ulv-karsilastirma': 'sera-zararlilari-ulv-karsilastirma-cover-400.d293740a.webp',
  'sivrisinek-ilaclama-mikron-capi': 'sivrisinek-ilaclama-mikron-capi-cover-400.57b20c50.webp',
  'duru-ulv-hikayesi': 'duru-ulv-hikayesi-cover-400.6532f3a7.webp',
  'ulv-cihazi-alirken-7-soru': 'ulv-cihazi-alirken-7-soru-cover-400.0a1764a4.webp',
  'kamu-alimlarinda-ce-iso-sertifikasi': 'kamu-alimlarinda-ce-iso-sertifikasi-cover-400.66a91de1.webp',
  'yaz-oncesi-belediye-ilaclama-hazirlik': 'yaz-oncesi-belediye-ilaclama-hazirlik-cover-400.4e6299f8.webp',
  'sonbahar-sera-hasere-kontrolu': 'sonbahar-sera-hasere-kontrolu-cover-400.08d61e7d.webp',
  'sinekle-mucadele-pencere-sinekligi-yeterli-mi':
    'sinekle-mucadele-pencere-sinekligi-yeterli-mi-cover-400.4bb6515a.webp',
  'sis-ufleme-makinesi-mist-blower-nedir-rehber':
    'sis-ufleme-makinesi-mist-blower-nedir-rehber-cover-400.ecead5f1.webp',
};

// Prefer hashed covers from corporate fill; fallback to unhashed cover from meta
function coverFile(slug) {
  if (BLOG_COVER[slug]) return BLOG_COVER[slug];
  const m = META_BY_SLUG[slug];
  return m && m.cover ? m.cover : 'ulv-ilaclama-nedir-cover.webp';
}

function coverFull(slug) {
  const f = coverFile(slug);
  // hero/og prefer non-400 when available
  if (f.includes('-cover-400.')) {
    const base = f.replace(/-cover-400\.[a-f0-9]+\.webp$/i, '-cover.webp');
    const full = path.join(ROOT, 'assets/img/blog', base);
    if (fs.existsSync(full)) return base;
  }
  return META_BY_SLUG[slug]?.cover || f;
}

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

function pageShell(locale, opts) {
  const loc = localePaths(locale);
  const ui = loc.ui;
  const outRel = `${locale}/${opts.rel}`;
  const depth = outRel.split('/').filter(Boolean).length - 1;
  const prefix = '../'.repeat(depth);
  const seo = renderSeoHead({
    title: opts.title,
    description: opts.description,
    canonicalPathRel: outRel,
    hreflangSourceRel: opts.trRel,
    ogImage: opts.ogImage || `assets/img/blog/${coverFull(opts.slug || '')}`,
    ogImageAlt: opts.h1,
    locale: ui.ogLocale,
  });
  const header = siteHeader({
    prefix,
    locale,
    trPathRel: opts.trRel,
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
  const extra = ['assets/css/blog.css'];
  if (locale === 'ar') extra.unshift('assets/css/rtl.css');

  const schema = opts.schema
    ? `\n  <script type="application/ld+json">${opts.schema}</script>`
    : '';
  const faqSchema = opts.faqSchema
    ? `\n  <script type="application/ld+json">${opts.faqSchema}</script>`
    : '';

  return `<!DOCTYPE html>
<html ${loc.htmlLangAttrs}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(opts.description)}">
  <title>${esc(opts.title)}</title>
${seo}${schema}${faqSchema}
  <link rel="icon" href="${prefix}assets/img/duru-icon.svg" type="image/svg+xml">
${renderHeadAssets(prefix, { extraStylesheets: extra })}
</head>
<body>

${header}
  <main>
${opts.main}
  </main>
${footer}

${renderBodyScripts(prefix)}
</body>
</html>
`;
}

function icon(name) {
  const paths = {
    calendar:
      '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${
    name === 'chevron' ? '2' : '1.5'
  }" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="blog-icon ${
    name === 'chevron' ? 'accordion__icon' : 'blog-icon--meta'
  }">${paths[name]}</svg>`;
}

function rewriteLocaleLinks(html, locale) {
  // Bodies may use {{products}}, {{quote}}, {{blog}} tokens
  const p = `../../../${locale}/`;
  return String(html || '')
    .replace(/\{\{products\}\}/g, `${p}products/index.html`)
    .replace(/\{\{quote\}\}/g, `${p}fiyat-teklifi/index.html`)
    .replace(/\{\{blog\}\}/g, `${p}blog/index.html`)
    .replace(/\{\{home\}\}/g, `${p}index.html`);
}

function renderPost(locale, slug) {
  const meta = META_BY_SLUG[slug];
  const body = POSTS[slug] && POSTS[slug][locale];
  if (!meta || !body) throw new Error(`Missing content for ${locale}/${slug}`);

  const loc = localePaths(locale);
  const prefix = '../../../';
  const cover = coverFull(slug);
  const coverCard = coverFile(slug);
  const titleFull = `${body.title} — Duru ULV`;
  const trRel = `blog/${slug}/index.html`;

  const toc = body.sections
    .map(
      (s) =>
        `            <li><a href="#${esc(s.id)}" class="blog-toc__link">${esc(s.heading)}</a></li>`
    )
    .join('\n');

  const tags = (body.tags || [body.tag, 'ULV', 'Duru ULV'])
    .slice(0, 5)
    .map(
      (t) =>
        `          <a href="${loc.productsHref(prefix)}" class="blog-tag">${esc(t)}</a>`
    )
    .join('\n');

  let articleInner = '';
  body.sections.forEach((s, idx) => {
    articleInner += `<h2 id="${esc(s.id)}">${esc(s.heading)}</h2>\n`;
    if (idx === 0) {
      articleInner += `<figure class="blog-figure blog-figure--featured">
          <div class="blog-figure__frame">
            <img src="${prefix}assets/img/blog/${esc(cover)}" sizes="(max-width: 900px) 100vw, 720px" alt="${esc(
        body.title
      )}" class="blog-figure__img" width="720" height="405" loading="lazy" decoding="async">
          </div>
          <figcaption class="blog-figure__caption">${esc(body.title)}</figcaption>
        </figure>\n`;
    }
    articleInner += rewriteLocaleLinks(s.html, locale) + '\n';
  });

  articleInner += `<div class="blog-cta-bar blog-cta-bar--hero">
  <div class="blog-cta-bar__content">
    <h3 class="blog-cta-bar__heading">${esc(body.ctaHeading)}</h3>
    <p class="blog-cta-bar__text">${esc(body.ctaText)}</p>
  </div>
  <div class="blog-cta-bar__actions">
    <a href="${loc.quoteHref(prefix)}" class="btn btn--white btn--sm">${esc(
    locale === 'en' ? 'Request a Quote' : 'اطلب عرض سعر'
  )}</a>
    <a href="${loc.productsHref(prefix)}" class="btn btn--outline-white btn--sm">${esc(
    locale === 'en' ? 'Browse Products' : 'تصفح المنتجات'
  )}</a>
  </div>
</div>`;

  const faqsHtml = (body.faqs || [])
    .map(
      (f) => `          <div class="accordion__item">
            <button type="button" class="accordion__trigger" aria-expanded="false">${esc(
              f.q
            )}${icon('chevron')}</button>
            <div class="accordion__content">${esc(f.a)}</div>
          </div>`
    )
    .join('\n');

  const main = `  <div class="breadcrumb-bar">
    <div class="container">
      <ol class="breadcrumb">
        <li><a href="${loc.homeHref(prefix)}">${esc(body.homeCrumb)}</a></li>
        <li><a href="${loc.blogHref(prefix)}">${esc(body.blogCrumb)}</a></li>
        <li><span class="breadcrumb__current">${esc(body.title)}</span></li>
      </ol>
    </div>
  </div>
    <section class="blog-hero blog-hero--rich">
      <div class="container blog-hero__inner">
        <span class="blog-hero__tag">${esc(body.tag)}</span>
        <h1>${esc(body.title)}</h1>
        <p class="blog-hero__lead">${esc(body.description)}</p>
        <div class="blog-hero__meta">
          <span class="blog-hero__meta-item">${icon('calendar')} ${esc(body.dateLabel)}</span>
          <span class="blog-hero__meta-item">${icon('clock')} ${esc(body.readLabel)}</span>
          <span class="blog-hero__meta-item">${icon('user')} Hacı DURUÖZ</span>
        </div>
      </div>
    </section>

    <section class="section bg-white blog-section--rich">
      <div class="container blog-layout">
        <aside class="blog-sidebar" aria-label="${esc(body.tocHeading)}">
          <div class="blog-sidebar__panel">
            <h2 class="blog-sidebar__heading">${esc(body.tocHeading)}</h2>
            <ol class="blog-toc">
${toc}
            </ol>
          </div>
          <div class="blog-sidebar__panel">
            <h2 class="blog-sidebar__heading">${esc(body.tagsHeading)}</h2>
            <div class="blog-tags">
${tags}
            </div>
          </div>
        </aside>
        <div class="blog-main">
          <article class="blog-article blog-article--rich">
${articleInner}
          </article>
          <p class="blog-back"><a href="${loc.blogHref(prefix)}">${esc(body.backLabel)}</a></p>
        </div>
      </div>
    </section>

    <section class="section bg-muted border-y">
      <div class="container container--text">
        <div class="eyebrow">${esc(body.faqEyebrow)}</div>
        <h2 class="section-title" style="margin-bottom:2rem">${esc(body.faqTitle)}</h2>
        <div class="accordion" data-accordion>
${faqsHtml}
        </div>
      </div>
    </section>`;

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: body.title,
    description: body.description,
    datePublished: meta.datePublished || '2026-06-01',
    dateModified: meta.datePublished || '2026-06-01',
    url: `https://www.duruulvteknoloji.com.tr/${locale}/blog/${slug}/`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.duruulvteknoloji.com.tr/${locale}/blog/${slug}/`,
    },
    author: { '@type': 'Person', name: 'Hacı DURUÖZ' },
    publisher: {
      '@type': 'Organization',
      name: 'Duru U.L.V. Teknoloji Sistemleri',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.duruulvteknoloji.com.tr/assets/img/duru-hd-logo.svg',
      },
    },
    image: `https://www.duruulvteknoloji.com.tr/assets/img/blog/${cover}`,
  });

  const faqSchema =
    body.faqs && body.faqs.length
      ? JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: body.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        })
      : '';

  const html = pageShell(locale, {
    rel: `blog/${slug}/index.html`,
    trRel,
    slug,
    title: titleFull,
    description: body.description,
    h1: body.title,
    main,
    schema,
    faqSchema,
    ogImage: `assets/img/blog/${cover}`,
  });
  writePage(`${locale}/blog/${slug}/index.html`, html);
  return { slug, coverCard, body };
}

function renderBlogIndex(locale) {
  const loc = localePaths(locale);
  const prefix = '../../';
  const cards = Object.keys(POSTS)
    .map((slug) => {
      const body = POSTS[slug][locale];
      const href = `${prefix}${locale}/blog/${slug}/index.html`;
      const img = `${prefix}assets/img/blog/${coverFile(slug)}`;
      const read =
        locale === 'en' ? 'Read article →' : 'اقرأ المقال ←';
      return `          <article class="blog-card lift-card">
            <a href="${href}" class="blog-card__media" tabindex="-1" aria-hidden="true">
              <img src="${img}" alt="${esc(body.title)}" class="blog-card__img" width="400" height="225" loading="lazy" decoding="async">
            </a>
            <div class="blog-card__body">
              <h2 class="blog-card__title"><a href="${href}">${esc(body.title)}</a></h2>
              <p class="blog-card__excerpt">${esc(body.description)}</p>
              <a href="${href}" class="blog-card__link">${esc(read)}</a>
            </div>
          </article>`;
    })
    .join('\n');

  const hero =
    locale === 'en'
      ? `    <section class="blog-hero">
      <div class="container">
        <div class="eyebrow">Blog</div>
        <h1>Blog &amp; Resources</h1>
        <p>Technical guides and industry insights from Duru ULV Technology Systems.</p>
      </div>
    </section>`
      : `    <section class="blog-hero">
      <div class="container">
        <div class="eyebrow">المدونة</div>
        <h1>المدونة والموارد</h1>
        <p>أدلة تقنية ورؤى من Duru ULV.</p>
      </div>
    </section>`;

  const main = `${hero}
    <section class="section bg-muted border-y">
      <div class="container">
        <div class="blog-grid">
${cards}
        </div>
      </div>
    </section>`;

  writePage(
    `${locale}/blog/index.html`,
    pageShell(locale, {
      rel: 'blog/index.html',
      trRel: 'blog/index.html',
      title: locale === 'en' ? 'Blog & Resources — Duru ULV' : 'المدونة والموارد — Duru ULV',
      description:
        locale === 'en'
          ? 'Technical guides and industry insights from Duru ULV Technology Systems.'
          : 'أدلة تقنية ورؤى من Duru ULV.',
      h1: locale === 'en' ? 'Blog & Resources' : 'المدونة والموارد',
      main,
      ogImage: 'assets/img/blog/ulv-ilaclama-nedir-cover.webp',
    })
  );
}

const missing = META.filter((m) => !POSTS[m.slug]).map((m) => m.slug);
if (missing.length) {
  console.error('Missing POSTS for:', missing.join(', '));
  process.exit(1);
}

['en', 'ar'].forEach((locale) => {
  META.forEach((m) => renderPost(locale, m.slug));
  renderBlogIndex(locale);
});
console.log('done posts', META.length * 2, '+ 2 indexes');
