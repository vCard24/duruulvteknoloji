/**
 * Fill EN/AR homepage + catalog only. Never writes blog/ or urunler/.
 * Usage: node scripts/fill-locale-home-katalog.js
 */
const fs = require('fs');
const path = require('path');
const { siteHeader, siteFooter } = require('./site-layout');
const { renderHeadAssets, renderBodyScripts } = require('./head-assets');
const { renderSeoHead } = require('./seo-meta');
const { localePaths, UI } = require('./i18n');
const { ICONS } = require('./category-icons');

const ROOT = path.join(__dirname, '..');
const DEFAULT_OG = 'assets/img/products/duru-hd50-01.webp';

const HERO = {
  h480: 'duru-hero-480.7c973795.webp',
  h720: 'duru-hero-720.a1573a72.webp',
  h960: 'duru-hero-960.1c1fc32f.webp',
  badge120: '36-yillik-tecrube-120.bfcfcad6.webp',
  badge200: '36-yillik-tecrube-200.b9743baa.webp',
};

const KATALOG_KAPAK = {
  w400: 'katalog-kapak-400.375dc383.webp',
  w800: 'katalog-kapak-800.c911e00b.webp',
};

const CATEGORY_COUNTS = {
  'arac-uzeri-ilaclama': 5,
  'sera-tipi-ulv-ilaclama': 5,
  'sirt-tipi-ulv-ilaclama': 1,
  'el-tipi-ulv-ilaclama': 7,
  'nemlendirme-ulv': 3,
  'termal-sisleme': 2,
};

const CATEGORY_ORDER = [
  'arac-uzeri-ilaclama',
  'sera-tipi-ulv-ilaclama',
  'sirt-tipi-ulv-ilaclama',
  'el-tipi-ulv-ilaclama',
  'nemlendirme-ulv',
  'termal-sisleme',
];

const FEATURED = [
  {
    slug: 'entosis-mist-blower-500l',
    model: 'EMB-500',
    image: 'entosis-mist-blower-500l-01.webp',
    en: {
      name: 'Entosis Mist Blower (500L)',
      summary: '500 L tank · joystick control · 6+1 nozzles · 35-micron ULV',
    },
    ar: {
      name: 'Entosis Mist Blower (500L)',
      summary: 'خزان 500 لتر · تحكم جويستيك · 6+1 فوهات · ULV 35 ميكرون',
    },
  },
  {
    slug: 'entosis-50',
    model: 'ENT-50',
    image: 'entosis-50-01.webp',
    en: {
      name: 'Entosis 50',
      summary: '50 L tank · 4400 W · 7-hectare capacity · 0–49 micron',
    },
    ar: {
      name: 'Entosis 50',
      summary: 'خزان 50 لتر · 4400 واط · سعة 7 دونم · 0–49 ميكرون',
    },
  },
  {
    slug: 'duru-x20',
    model: 'X-20',
    image: 'duru-x20-01.webp',
    en: {
      name: 'Duru X20',
      summary: '20 L tank · 4400 W · 0–49 micron ULV',
    },
    ar: {
      name: 'Duru X20',
      summary: 'خزان 20 لتر · 4400 واط · ULV 0–49 ميكرون',
    },
  },
];

const COPY = {
  en: {
    homeTitle: 'Duru ULV Technology Systems — Professional ULV Spraying Machines',
    homeDescription:
      'Duru ULV — Professional ULV spraying systems for municipalities, public agencies, and industry. Turkish engineering since 1990.',
    homeH1Lead: 'Professional ULV spraying systems for municipalities, public agencies, and industry.',
    homeH1Accent: 'professional ULV',
    heroBadge: 'Turkish engineering since 1990',
    heroLead:
      'Duru ULV designs and manufactures ultra-low volume (ULV) machines for disinfection, pest control, and agricultural spraying. 36 years of engineering experience, proven reliability with CE, TSE, and ISO certifications.',
    exploreProducts: 'Explore Products',
    heroImgAlt: 'Entosis Mist Blower — Duru ULV professional spraying system',
    experienceAlt: '36 years of experience — since 1990',
    featuredModelLabel: 'Featured model',
    featuredModelName: 'Entosis Mist Blower 500L',
    featuredModelMeta: '35-micron ULV · 6+1 nozzles',
    catEyebrow: 'Product Categories',
    catTitle: 'The right ULV machine for every field.',
    catLead:
      '23 models · 6 categories. Vehicle-mounted, greenhouse, backpack, handheld, humidification, and thermal fogging product family.',
    categories: {
      'arac-uzeri-ilaclama': {
        title: 'Vehicle-Mounted',
        homeDesc:
          'High-capacity mist blowers and ULV sprayers mounted on pick-ups and light trucks.',
        catalogDesc:
          'High-capacity mist blowers and ULV sprayers mounted on pick-ups and light trucks. Designed for municipal, public, and large-area applications.',
      },
      'sera-tipi-ulv-ilaclama': {
        title: 'Greenhouse',
        homeDesc:
          'Electric ULV machines delivering fine droplet spraying for enclosed greenhouse environments.',
        catalogDesc:
          'Electric ULV machines delivering fine droplet spraying for enclosed greenhouse environments. For farms and floriculture.',
      },
      'sirt-tipi-ulv-ilaclama': {
        title: 'Backpack',
        homeDesc:
          'Professional ULV units operators can carry on their back for high field mobility.',
        catalogDesc:
          'Professional ULV units operators can carry on their back for high field mobility.',
      },
      'el-tipi-ulv-ilaclama': {
        title: 'Handheld',
        homeDesc:
          'Compact, lightweight handheld ULV sprayers for hospitals, hotels, warehouses, and factories.',
        catalogDesc:
          'Compact, lightweight handheld ULV sprayers for hospitals, hotels, warehouses, and factories.',
      },
      'nemlendirme-ulv': {
        title: 'Humidification',
        homeDesc:
          'Float-controlled ULV humidification systems for mushroom houses, greenhouses, and storage.',
        catalogDesc:
          'Float-controlled ULV humidification systems for mushroom houses, greenhouses, and storage. Hygrostat and rotating-head models.',
      },
      'termal-sisleme': {
        title: 'Thermal',
        homeDesc:
          'Thermal hot fogging machines for sewers, open areas, and frost protection.',
        catalogDesc:
          'Thermal hot fogging machines for sewers, open areas, and frost protection. Briggs-engine and handheld models.',
      },
    },
    statsEyebrow: 'Why Duru ULV',
    statsTitle: '36 years in the field, three generations of engineering.',
    statsLead:
      'Designed and manufactured in Kayseri since 1990, Duru ULV machines serve professional field work at every scale—from municipal mosquito control and hospital disinfection to greenhouse biological control and factory pest management.',
    stats: [
      { value: '36+', label: 'years of engineering experience' },
      { value: '23', label: 'active ULV models' },
      { value: '6', label: 'categories: vehicle, greenhouse, backpack, handheld, humidity, thermal' },
      { value: '7', label: 'accredited certificates & approvals' },
    ],
    sectorsEyebrow: 'Applications',
    sectorsTitle: 'Trusted across public, healthcare, agriculture, and industry.',
    sectors: [
      'Municipalities',
      'Hospitals',
      'Greenhouses',
      'Factories',
      'Industry',
      'Public institutions',
    ],
    featuredEyebrow: 'Featured Models',
    featuredTitle: 'The three models most preferred in the field.',
    viewAllProducts: 'View all products →',
    ctaTitle: 'Get a quote tailored to your tender or operation.',
    ctaText:
      'Select and compare multiple models, then request a custom quote with a single form. Our team responds the same business day.',
    callUs: 'Call Us',
    catalogTitle: 'Product Catalog — Duru ULV',
    catalogDescription:
      'Duru ULV product catalog — 23 models, 6 categories. Download the PDF or browse online.',
    catalogH1: '23 models, one reference document.',
    catalogLeadBefore: 'Download our ',
    catalogLeadStrong: '2026 updated catalog',
    catalogLeadAfter:
      ' with technical specs for our vehicle-mounted, greenhouse, backpack, handheld, humidification, and thermal fogging machines—or view it in the browser and browse online product pages.',
    downloadPdf: 'Download catalog (PDF)',
    viewPdf: 'View PDF',
    onlineCatalog: 'Online catalog',
    catalogMeta: 'Duru ULV Product Catalog · 2026 · PDF',
    catalogCoverAlt: 'Duru ULV Product Catalog 2026 cover',
    catalogCoverAria: 'Open Duru ULV Product Catalog 2026 PDF in a new tab',
    catalogCatsTitle: 'Product groups in the catalog',
    catalogCtaTitle: 'Pick from the catalog and request a quote',
    catalogCtaText: 'Compare models and request a custom quote for the machines that fit your needs.',
  },
  ar: {
    homeTitle: 'دورو يو إل في لأنظمة التكنولوجيا — أجهزة رش ULV احترافية',
    homeDescription:
      'دورو يو إل في — أنظمة رش ULV احترافية للبلديات والجهات العامة والصناعة. هندسة تركية منذ 1990.',
    homeH1Lead: 'أنظمة رش ULV احترافية للبلديات والجهات العامة والصناعة.',
    homeH1Accent: 'ULV احترافية',
    heroBadge: 'هندسة تركية منذ 1990',
    heroLead:
      'تصمّم دورو يو إل في وتنتج أجهزة الحجم المنخفض جدًا (ULV) للتعقيم ومكافحة الآفات والرش الزراعي. خبرة هندسية تمتد 36 عامًا، وموثوقية مثبتة ميدانيًا بشهادات CE وTSE وISO.',
    exploreProducts: 'استكشف المنتجات',
    heroImgAlt: 'Entosis Mist Blower — نظام رش احترافي من دورو يو إل في',
    experienceAlt: '36 عامًا من الخبرة — منذ 1990',
    featuredModelLabel: 'الطراز المميز',
    featuredModelName: 'Entosis Mist Blower 500L',
    featuredModelMeta: 'ULV 35 ميكرون · 6+1 فوهات',
    catEyebrow: 'فئات المنتجات',
    catTitle: 'جهاز ULV المناسب لكل ميدان.',
    catLead:
      '23 موديلًا · 6 فئات. عائلة منتجات: مركبات، بيوت محمية، ظهر، يدوي، ترطيب، وتضبيب حراري.',
    categories: {
      'arac-uzeri-ilaclama': {
        title: 'مركبات',
        homeDesc:
          'أجهزة نفخ رذاذ ومرشات ULV عالية السعة تُركَّب على الشاحنات الخفيفة والبيك أب.',
        catalogDesc:
          'أجهزة نفخ رذاذ ومرشات ULV عالية السعة تُركَّب على الشاحنات الخفيفة والبيك أب. مصمَّمة للبلديات والجهات العامة والمساحات الواسعة.',
      },
      'sera-tipi-ulv-ilaclama': {
        title: 'بيوت محمية',
        homeDesc:
          'أجهزة ULV كهربائية ترش بقطر قطرات منخفض في بيئات البيوت المحمية المغلقة.',
        catalogDesc:
          'أجهزة ULV كهربائية ترش بقطر قطرات منخفض في بيئات البيوت المحمية المغلقة. للمزارع وزراعة الأزهار.',
      },
      'sirt-tipi-ulv-ilaclama': {
        title: 'ظهر',
        homeDesc:
          'أجهزة ULV احترافية يحملها المشغّل على ظهره لمرونة عالية في الميدان.',
        catalogDesc:
          'أجهزة ULV احترافية يحملها المشغّل على ظهره لمرونة عالية في الميدان.',
      },
      'el-tipi-ulv-ilaclama': {
        title: 'يدوي',
        homeDesc:
          'مرشات ULV يدوية مدمجة وخفيفة للمستشفيات والفنادق والمستودعات والمصانع.',
        catalogDesc:
          'مرشات ULV يدوية مدمجة وخفيفة للمستشفيات والفنادق والمستودعات والمصانع.',
      },
      'nemlendirme-ulv': {
        title: 'ترطيب',
        homeDesc:
          'أنظمة ترطيب ULV بمستوى عوامة لمزارع الفطر والبيوت المحمية والمستودعات.',
        catalogDesc:
          'أنظمة ترطيب ULV بمستوى عوامة لمزارع الفطر والبيوت المحمية والمستودعات. موديلات بهيجروستات ورأس دوّار.',
      },
      'termal-sisleme': {
        title: 'حراري',
        homeDesc:
          'أجهزة تضبيب حراري ساخن للمجاري والمناطق المفتوحة ومكافحة الصقيع.',
        catalogDesc:
          'أجهزة تضبيب حراري ساخن للمجاري والمناطق المفتوحة ومكافحة الصقيع. موديلات بمحرك Briggs ويدوية.',
      },
    },
    statsEyebrow: 'لماذا دورو يو إل في',
    statsTitle: '36 عامًا في الميدان، وثلاثة أجيال من الهندسة.',
    statsLead:
      'أجهزة دورو يو إل في المصمَّمة والمصنَّعة في قيصري منذ 1990 تقدّم حلولًا احترافية على كل مقياس—من مكافحة البعوض في البلديات وتعقيم المستشفيات إلى المكافحة البيولوجية في البيوت المحمية ومكافحة الآفات في المصانع.',
    stats: [
      { value: '36+', label: 'عامًا من الخبرة الهندسية' },
      { value: '23', label: 'موديل ULV نشط' },
      { value: '6', label: 'فئات: مركبات، بيوت محمية، ظهر، يدوي، ترطيب، حراري' },
      { value: '7', label: 'شهادات واعتمادات معتمدة' },
    ],
    sectorsEyebrow: 'مجالات الاستخدام',
    sectorsTitle: 'موثوقون في القطاع العام والرعاية الصحية والزراعة والصناعة.',
    sectors: [
      'البلديات',
      'المستشفيات',
      'البيوت المحمية',
      'المصانع',
      'الصناعة',
      'المؤسسات العامة',
    ],
    featuredEyebrow: 'الموديلات المميزة',
    featuredTitle: 'ثلاثة موديلات الأكثر تفضيلًا في الميدان.',
    viewAllProducts: 'عرض جميع المنتجات ←',
    ctaTitle: 'احصل على عرض سعر مخصص لمناقصتك أو عمليتك.',
    ctaText:
      'اختر عدة موديلات وقارنها، ثم اطلب عرض سعر مخصص عبر نموذج واحد. يرد فريقنا في نفس يوم العمل.',
    callUs: 'اتصل بنا',
    catalogTitle: 'كتالوج المنتجات — Duru ULV',
    catalogDescription:
      'كتالوج منتجات دورو يو إل في — 23 موديلًا، 6 فئات. حمّل ملف PDF أو تصفّح عبر الإنترنت.',
    catalogH1: '23 موديلًا، وثيقة مرجعية واحدةحدة.',
    catalogLeadBefore: 'يمكنك تنزيل ',
    catalogLeadStrong: 'كتالوج 2026 المحدَّث',
    catalogLeadAfter:
      ' الذي يتضمن المواصفات الفنية لأجهزة المركبات والبيوت المحمية والظهر واليدوي والترطيب والتضبيب الحراري، أو عرضه في المتصفح وتصفّح صفحات المنتجات عبر الإنترنت.',
    downloadPdf: 'تحميل الكتالوج (PDF)',
    viewPdf: 'عرض PDF',
    onlineCatalog: 'كتالوج عبر الإنترنت',
    catalogMeta: 'كتالوج منتجات دورو يو إل في · 2026 · PDF',
    catalogCoverAlt: 'غلاف كتالوج منتجات دورو يو إل في 2026',
    catalogCoverAria: 'افتح ملف PDF لكتالوج دورو يو إل في 2026 في تبويب جديد',
    catalogCatsTitle: 'مجموعات المنتجات في الكتالوج',
    catalogCtaTitle: 'اختر من الكتالوج واطلب عرض سعر',
    catalogCtaText: 'قارن الموديلات واطلب عرض سعر مخصص للأجهزة التي تناسب احتياجك.',
  },
};

const SECTOR_ICONS = [
  '<svg class="sector-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg>',
  '<svg class="sector-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 6v4M12 14h.01M10 2h4a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>',
  '<svg class="sector-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/></svg>',
  '<svg class="sector-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 20h20M4 20V10l8-6 8 6v10"/><path d="M9 20v-6h6v6"/></svg>',
  '<svg class="sector-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  '<svg class="sector-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
];

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

function h1WithAccent(lead, accent) {
  const i = lead.toLowerCase().indexOf(accent.toLowerCase());
  if (i < 0) {
    return `${esc(lead)}`;
  }
  const before = lead.slice(0, i);
  const match = lead.slice(i, i + accent.length);
  const after = lead.slice(i + accent.length);
  return `${esc(before)}<span class="hero__title-accent">${esc(match)}</span>${esc(after)}`;
}

function compareLabelSpan(locale) {
  const ui = UI[locale] || UI.en;
  const inactive = ui.compare;
  const active = ui.compareInList;
  return `<span data-compare-label data-label-inactive="${esc(inactive)}" data-label-active="${esc(active)}">${esc(inactive)}</span>`;
}

function productHref(loc, prefix, slug) {
  return `${prefix}${loc.locale}/products/${slug}/index.html`;
}

function categoryHref(loc, prefix, slug) {
  return `${prefix}${loc.locale}/products/${slug}/index.html`;
}

function heroPreload(prefix) {
  const srcset = `${prefix}assets/img/hero/${HERO.h480} 480w, ${prefix}assets/img/hero/${HERO.h720} 720w, ${prefix}assets/img/hero/${HERO.h960} 960w`;
  const sizes = '(max-width: 767px) calc(100vw - 3rem), (max-width: 1024px) 50vw, 600px';
  return `  <link rel="preload" as="image" type="image/webp" href="${prefix}assets/img/hero/${HERO.h480}" imagesrcset="${srcset}" imagesizes="${sizes}" fetchpriority="high">`;
}

function categoryCards(locale, prefix, variant) {
  const loc = localePaths(locale);
  const ui = loc.ui;
  const copy = COPY[locale];
  const explore = ui.exploreCta;
  const unit = ui.modelUnit;

  return CATEGORY_ORDER.map((slug) => {
    const cat = copy.categories[slug];
    const count = CATEGORY_COUNTS[slug];
    const desc = variant === 'catalog' ? cat.catalogDesc : cat.homeDesc;
    const countLabel =
      locale === 'en' && count === 1 ? '1 model' : `${count} ${unit}`;
    return `          <a href="${categoryHref(loc, prefix, slug)}" class="category-card">
            <div class="category-card__icon">
              ${ICONS[slug] || ''}
            </div>
            <h3 class="category-card__title">${esc(cat.title)}</h3>
            <p class="category-card__desc">${esc(desc)}</p>
            <div class="category-card__footer">
              <span class="category-card__count">${esc(countLabel)}</span>
              <span style="color:var(--color-primary);font-weight:600">${esc(explore)}</span>
            </div>
          </a>`;
  }).join('\n');
}

function featuredProducts(locale, prefix) {
  const loc = localePaths(locale);
  const comparePage = loc.compareHref(prefix);
  const label = compareLabelSpan(locale);
  const ui = UI[locale] || UI.en;

  return FEATURED.map((item) => {
    const t = item[locale];
    const href = productHref(loc, prefix, item.slug);
    return `          <article class="product-card lift-card">
            <a href="${href}" class="product-card__image">
              <img src="${prefix}assets/img/products/${item.image}" alt="${esc(t.name)}" loading="lazy">
            </a>
            <div class="product-card__body">
              <span class="product-card__model">${esc(item.model)}</span>
              <a href="${href}" class="product-card__title">${esc(t.name)}</a>
              <p class="product-card__summary">${esc(t.summary)}</p>
              <div class="product-card__actions">
                <a href="${href}" class="btn btn--primary btn--sm">${esc(ui.view)}</a>
                <button type="button" class="btn btn--outline btn--sm" data-compare-toggle="${item.slug}" data-compare-page="${comparePage}">${label}</button>
              </div>
            </div>
          </article>`;
  }).join('\n\n');
}

function homeMain(locale, prefix) {
  const loc = localePaths(locale);
  const ui = loc.ui;
  const c = COPY[locale];
  const srcset = `${prefix}assets/img/hero/${HERO.h480} 480w, ${prefix}assets/img/hero/${HERO.h720} 720w, ${prefix}assets/img/hero/${HERO.h960} 960w`;
  const sizes = '(max-width: 767px) calc(100vw - 3rem), (max-width: 1024px) 50vw, 600px';
  const arrowSvg =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

  const sectors = c.sectors
    .map(
      (label, i) =>
        `          <div class="sector-item">${SECTOR_ICONS[i]}<span class="sector-item__label">${esc(label)}</span></div>`
    )
    .join('\n');

  const stats = c.stats
    .map(
      (s) => `            <div class="stats-grid__item">
              <div class="stats-grid__value">${esc(s.value)}</div>
              <div class="stats-grid__label">${esc(s.label)}</div>
            </div>`
    )
    .join('\n');

  return `    <!-- HERO -->
    <section class="hero">
      <div class="hero__grid-bg"></div>
      <div class="container hero__content">
        <div>
          <div class="hero__badge">
            <span class="hero__badge-dot"></span>
            ${esc(c.heroBadge)}
          </div>
          <h1 class="hero__title text-balance">
            ${h1WithAccent(c.homeH1Lead, c.homeH1Accent)}
          </h1>
          <p class="hero__lead">
            ${esc(c.heroLead)}
          </p>
          <div class="hero__actions">
            <a href="${loc.quoteHref(prefix)}" class="btn btn--primary">
              ${esc(ui.quote)}
              ${arrowSvg}
            </a>
            <a href="${loc.productsHref(prefix)}" class="btn btn--outline">
              ${esc(c.exploreProducts)}
            </a>
          </div>
          <div class="hero__certs">
            <span><span class="hero__badge-dot"></span> CE</span>
            <span><span class="hero__badge-dot"></span> TSE</span>
            <span><span class="hero__badge-dot"></span> ISO 9001</span>
            <span><span class="hero__badge-dot"></span> ISO 14001</span>
            <span><span class="hero__badge-dot"></span> ISO 45001</span>
          </div>
        </div>

        <div class="hero__visual">
          <div class="hero__image-wrap">
            <picture>
              <source
                type="image/webp"
                srcset="${srcset}"
                sizes="${sizes}">
              <img src="${prefix}assets/img/hero/${HERO.h960}" alt="${esc(c.heroImgAlt)}" width="960" height="645" fetchpriority="high" decoding="async">
            </picture>
            <img
              src="${prefix}assets/img/hero/${HERO.badge120}"
              srcset="${prefix}assets/img/hero/${HERO.badge120} 120w, ${prefix}assets/img/hero/${HERO.badge200} 200w"
              sizes="140px"
              alt="${esc(c.experienceAlt)}"
              class="hero__experience-badge"
              width="200"
              height="200"
              loading="lazy"
              decoding="async">
          </div>
          <div class="hero__featured-card">
            <div class="text-label">${esc(c.featuredModelLabel)}</div>
            <div style="font-family:var(--font-display);font-weight:600;color:var(--color-primary);margin-top:0.25rem">${esc(c.featuredModelName)}</div>
            <div style="font-size:0.75rem;color:rgba(43,46,51,0.65);margin-top:0.25rem">${esc(c.featuredModelMeta)}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="section section--lg bg-white">
      <div class="container">
        <div class="section-header-row">
          <div>
            <div class="eyebrow">${esc(c.catEyebrow)}</div>
            <h2 class="section-title">${esc(c.catTitle)}</h2>
          </div>
          <p>${esc(c.catLead)}</p>
        </div>

        <div class="category-grid">
${categoryCards(locale, prefix, 'home')}
        </div>
      </div>
    </section>

    <!-- WHY DURU ULV -->
    <section class="section section--lg stats-band">
      <div class="container stats-band__grid">
        <div>
          <div class="eyebrow eyebrow--dark">${esc(c.statsEyebrow)}</div>
          <h2 class="section-title text-balance" style="color:white">${esc(c.statsTitle)}</h2>
          <p class="stats-band__lead">
            ${esc(c.statsLead)}
          </p>
        </div>
        <div>
          <div class="stats-grid">
${stats}
          </div>
          <div style="margin-top:2rem;display:flex;flex-wrap:wrap;gap:0.5rem">
            <span class="cert-badge">CE</span>
            <span class="cert-badge">TSE</span>
            <span class="cert-badge">ISO 9001</span>
            <span class="cert-badge">ISO 14001</span>
            <span class="cert-badge">ISO 45001</span>
            <span class="cert-badge">Gıda Tarım Bakanlığı</span>
            <span class="cert-badge">Sanayi Bakanlığı</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTORS -->
    <section class="section section--lg bg-white">
      <div class="container">
        <div style="margin-bottom:2.5rem">
          <div class="eyebrow">${esc(c.sectorsEyebrow)}</div>
          <h2 class="section-title">${esc(c.sectorsTitle)}</h2>
        </div>
        <div class="sector-grid">
${sectors}
        </div>
      </div>
    </section>

    <!-- FEATURED PRODUCTS -->
    <section class="section section--lg bg-muted border-y">
      <div class="container">
        <div class="section-header-row">
          <div>
            <div class="eyebrow">${esc(c.featuredEyebrow)}</div>
            <h2 class="section-title">${esc(c.featuredTitle)}</h2>
          </div>
          <a href="${loc.productsHref(prefix)}" class="link-arrow">${esc(c.viewAllProducts)}</a>
        </div>

        <div class="grid-3">
${featuredProducts(locale, prefix)}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section section--lg bg-white">
      <div class="container container--narrow">
        <div class="cta-box">
          <div class="cta-box__grid">
            <div>
              <h3 class="section-title" style="font-size:clamp(1.5rem,3vw,1.875rem)">${esc(c.ctaTitle)}</h3>
              <p class="cta-box__text">
                ${esc(c.ctaText)}
              </p>
            </div>
            <div class="cta-box__actions">
              <a href="${loc.quoteHref(prefix)}" class="btn btn--primary">${esc(ui.quoteArrow)}</a>
              <a href="${loc.contactHref(prefix)}" class="btn btn--outline">${esc(c.callUs)}</a>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

function catalogMain(locale, prefix) {
  const loc = localePaths(locale);
  const ui = loc.ui;
  const c = COPY[locale];
  const pdf = `${prefix}assets/docs/duru-ulv-katalog-2026.pdf`;

  return `    <section class="section section--lg bg-white border-y">
      <div class="container">
        <div class="hero__content" style="padding:0;grid-template-columns:1fr">
          <div style="display:grid;gap:2.5rem;align-items:center" class="grid-2">
            <div>
              <div class="eyebrow">${esc(ui.catalogEyebrow)}</div>
              <h1 class="section-title">${esc(c.catalogH1)}</h1>
              <p style="margin-top:1rem;color:rgba(43,46,51,0.75);line-height:1.65;max-width:32rem">${esc(c.catalogLeadBefore)}<strong>${esc(c.catalogLeadStrong)}</strong>${esc(c.catalogLeadAfter)}</p>
              <div style="margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:0.75rem">
                <a href="${pdf}" class="btn btn--primary" download="Duru-ULV-Katalog-2026.pdf">${esc(c.downloadPdf)}</a>
                <a href="${pdf}" class="btn btn--outline" target="_blank" rel="noopener">${esc(c.viewPdf)}</a>
                <a href="${loc.productsHref(prefix)}" class="btn btn--outline">${esc(c.onlineCatalog)}</a>
                <a href="${loc.quoteHref(prefix)}" class="btn btn--outline">${esc(ui.quote)}</a>
              </div>
              <p class="text-muted" style="margin-top:1rem;font-size:0.8125rem">${esc(c.catalogMeta)}</p>
            </div>
            <div class="catalog-hero-card">
              <a href="${pdf}"
                 target="_blank" rel="noopener"
                 class="catalog-preview"
                 aria-label="${esc(c.catalogCoverAria)}">
                <img src="${prefix}assets/img/katalog/${KATALOG_KAPAK.w400}"
                     srcset="${prefix}assets/img/katalog/${KATALOG_KAPAK.w400} 400w, ${prefix}assets/img/katalog/${KATALOG_KAPAK.w800} 800w"
                     sizes="(max-width: 767px) calc(100vw - 7rem), (max-width: 1023px) calc((100vw - 4.5rem) / 2 - 4rem), calc((min(100vw, 80rem) - 5.5rem) / 2 - 4rem)"
                     width="400" height="565"
                     alt="${esc(c.catalogCoverAlt)}"
                     loading="lazy" decoding="async">
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section bg-muted border-y">
      <div class="container">
        <div class="eyebrow">${esc(ui.categories)}</div>
        <h2 class="section-title" style="margin-bottom:2rem">${esc(c.catalogCatsTitle)}</h2>
        <div class="category-grid">
${categoryCards(locale, prefix, 'catalog')}
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container container--narrow">
        <div class="cta-box">
          <div class="cta-box__grid">
            <div>
              <h2 class="section-title" style="font-size:clamp(1.5rem,3vw,1.875rem)">${esc(c.catalogCtaTitle)}</h2>
              <p class="cta-box__text">${esc(c.catalogCtaText)}</p>
            </div>
            <div class="cta-box__actions">
              <a href="${loc.compareHref(prefix)}" class="btn btn--outline" data-compare-nav>${esc(ui.compare)}</a>
              <a href="${loc.quoteHref(prefix)}" class="btn btn--primary">${esc(ui.quoteArrow)}</a>
            </div>
          </div>
        </div>
      </div>
    </section>`;
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
    ogImage: DEFAULT_OG,
    ogImageAlt: opts.ogAlt || opts.h1,
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

  const preload = opts.heroPreload ? `${heroPreload(prefix)}\n` : '';

  return `<!DOCTYPE html>
<html ${loc.htmlLangAttrs}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(opts.description)}">
  <title>${esc(opts.title)}</title>
${seo}
  <link rel="icon" href="${prefix}assets/img/duru-icon.svg" type="image/svg+xml">
${preload}${renderHeadAssets(prefix, { extraStylesheets: loc.extraStylesheets })}
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

function buildHome(locale) {
  const c = COPY[locale];
  const prefix = '../';
  const html = pageShell(locale, {
    rel: 'index.html',
    trRel: 'index.html',
    title: c.homeTitle,
    description: c.homeDescription,
    h1: c.homeH1Lead,
    ogAlt: 'Duru ULV',
    heroPreload: true,
    main: homeMain(locale, prefix),
  });
  writePage(`${locale}/index.html`, html);
}

function buildCatalog(locale) {
  const c = COPY[locale];
  const prefix = '../../';
  const html = pageShell(locale, {
    rel: 'katalog/index.html',
    trRel: 'katalog/index.html',
    title: c.catalogTitle,
    description: c.catalogDescription,
    h1: c.catalogH1,
    ogAlt: c.catalogH1,
    heroPreload: false,
    main: catalogMain(locale, prefix),
  });
  writePage(`${locale}/katalog/index.html`, html);
}

for (const locale of ['en', 'ar']) {
  buildHome(locale);
  buildCatalog(locale);
}
