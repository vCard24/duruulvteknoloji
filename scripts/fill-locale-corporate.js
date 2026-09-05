/**
 * Fill EN/AR corporate pages only. Never writes blog/ (TR) or urunler/.
 * Usage: node scripts/fill-locale-corporate.js
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
  const extra = locale === 'ar' ? ['assets/css/rtl.css'] : [];
  const blogCss =
    opts.extraCss === 'blog'
      ? `\n  <link rel="stylesheet" href="${prefix}assets/css/blog.b400a01d.css">`
      : '';

  return `<!DOCTYPE html>
<html ${loc.htmlLangAttrs}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(opts.description)}">
  <title>${esc(opts.title)}</title>
${seo}
  <link rel="icon" href="${prefix}assets/img/duru-icon.svg" type="image/svg+xml">
${renderHeadAssets(prefix, { extraStylesheets: extra })}${blogCss}
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

const BLOG_POSTS = [
  {
    slug: 'ulv-ilaclama-nedir',
    en: {
      title: 'What Is ULV Spraying? How It Differs from Cold Fogging',
      excerpt: 'Learn how ultra-low volume spraying works and when it outperforms conventional fogging.',
    },
    ar: {
      title: 'ما هو الرش بالحجم المنخفض جداً (ULV)؟ وما الفرق عن التضبيب البارد؟',
      excerpt: 'تعرّف على مبدأ عمل رش ULV ومتى يتفوق على طرق التضبيب التقليدية.',
    },
  },
  {
    slug: 'mist-blower-ulv-pulverizator-farki',
    en: {
      title: 'Mist Blower vs ULV Sprayer: Key Differences',
      excerpt: 'A clear comparison of airflow mist blowers and true ULV micronization for field work.',
    },
    ar: {
      title: 'الفرق بين جهاز Mist Blower ورشاش ULV',
      excerpt: 'مقارنة واضحة بين نفخ الرذاذ بالهواء والرش الدقيق بتقنية ULV.',
    },
  },
  {
    slug: 'belediye-ilaclama-ekipmani-secimi',
    en: {
      title: 'Choosing Spraying Equipment for Municipalities',
      excerpt: 'Capacity, certifications, and spare-parts support—what cities should check before buying.',
    },
    ar: {
      title: 'اختيار معدات الرش للبلديات',
      excerpt: 'السعة والشهادات ودعم قطع الغيار—ما يجب على البلديات التحقق منه قبل الشراء.',
    },
  },
  {
    slug: 'belediye-ilaclama-neden-yetersiz',
    en: {
      title: 'Why Municipal Spraying Sometimes Falls Short',
      excerpt: 'Technical reasons street treatments miss harborage sites—and how source control helps.',
    },
    ar: {
      title: 'لماذا قد يكون رش البلديات غير كافٍ في بعض المناطق؟',
      excerpt: 'أسباب تقنية لقصور الرش في الشوارع وكيف تساعد المكافحة من المصدر.',
    },
  },
  {
    slug: 'sera-zararlilari-ulv-karsilastirma',
    en: {
      title: 'Greenhouse Pests: Conventional Spray vs ULV',
      excerpt: 'Which method works better against aphids, thrips, and whitefly—and safer for growers.',
    },
    ar: {
      title: 'آفات البيوت المحمية: الرش التقليدي أم ULV؟',
      excerpt: 'أي الطريقتين أنجع ضد المن والتربس والذبابة البيضاء وأكثر أماناً للمزارع.',
    },
  },
  {
    slug: 'sivrisinek-ilaclama-mikron-capi',
    en: {
      title: 'Why Droplet Micron Size Matters for Mosquito Control',
      excerpt: 'How ULV droplet diameter affects coverage and efficacy against mosquitoes and flies.',
    },
    ar: {
      title: 'لماذا يهم قطر القطرة بالميكرون في مكافحة البعوض؟',
      excerpt: 'كيف يؤثر قطر قطرات ULV على التغطية والفعالية ضد البعوض والذباب.',
    },
  },
  {
    slug: 'duru-ulv-hikayesi',
    en: {
      title: '36 Years of Experience: The Duru ULV Story',
      excerpt: 'From 1990 in Kayseri to today’s certified ULV manufacturing footprint.',
    },
    ar: {
      title: '36 عاماً من الخبرة: قصة Duru ULV',
      excerpt: 'من عام 1990 في قيصري إلى بصمة تصنيع ULV المعتمدة اليوم.',
    },
  },
  {
    slug: 'ulv-cihazi-alirken-7-soru',
    en: {
      title: '7 Questions to Ask Before Buying a ULV Machine',
      excerpt: 'A practical checklist for buyers evaluating tank size, micron range, and service.',
    },
    ar: {
      title: '7 أسئلة يجب طرحها قبل شراء جهاز ULV',
      excerpt: 'قائمة عملية لتقييم سعة الخزان ونطاق الميكرون وخدمة ما بعد البيع.',
    },
  },
  {
    slug: 'kamu-alimlarinda-ce-iso-sertifikasi',
    en: {
      title: 'CE & ISO Certifications in Public Procurement',
      excerpt: 'What tenders should require when specifying ULV equipment for public agencies.',
    },
    ar: {
      title: 'شهادات CE وISO في المشتريات العامة',
      excerpt: 'ما يجب أن تشترطه المناقصات عند تحديد معدات ULV للجهات العامة.',
    },
  },
  {
    slug: 'yaz-oncesi-belediye-ilaclama-hazirlik',
    en: {
      title: 'Pre-Summer Equipment Prep Guide for Municipalities',
      excerpt: 'Maintenance checklist and procurement timing before peak mosquito season.',
    },
    ar: {
      title: 'دليل تجهيز معدات البلديات قبل موسم الصيف',
      excerpt: 'قائمة صيانة وتوقيت التوريد قبل ذروة موسم البعوض.',
    },
  },
  {
    slug: 'sonbahar-sera-hasere-kontrolu',
    en: {
      title: 'Why Autumn Greenhouse Pest Control Is Critical',
      excerpt: 'Reduce overwintering populations with timely ULV treatments before winter.',
    },
    ar: {
      title: 'لماذا تكون مكافحة آفات البيوت المحمية في الخريف حاسمة؟',
      excerpt: 'قلّل أعداد الآفات الشتوية برش ULV في الوقت المناسب قبل الشتاء.',
    },
  },
  {
    slug: 'sinekle-mucadele-pencere-sinekligi-yeterli-mi',
    en: {
      title: 'Are Window Screens Enough Against Flies?',
      excerpt: 'Screens block entry—but outdoor ULV treatments address breeding sources.',
    },
    ar: {
      title: 'هل شبك النوافذ كافٍ لمكافحة الذباب؟',
      excerpt: 'الشبك يمنع الدخول—لكن رش ULV في الخارج يعالج مصادر التكاثر.',
    },
  },
  {
    slug: 'sis-ufleme-makinesi-mist-blower-nedir-rehber',
    en: {
      title: 'Mist Blower Buying Guide: What You Need to Know',
      excerpt: 'How mist blowers work, where they shine, and how Duru/Entosis models fit.',
    },
    ar: {
      title: 'دليل شراء جهاز Mist Blower: ما تحتاج معرفته',
      excerpt: 'كيف يعمل الجهاز وأين يتفوق وكيف تناسب موديلات Duru وEntosis.',
    },
  },
];

function contactMain(locale, prefix) {
  if (locale === 'en') {
    return `    <section class="section bg-white border-y">
      <div class="container">
        <div class="eyebrow">Contact</div>
        <h1 class="section-title">Contact Us</h1>
        <p style="margin-top:1rem;max-width:40rem;color:rgba(43,46,51,0.75);line-height:1.65">Get in touch. Same-day response during business hours.</p>
      </div>
    </section>
    <section class="section bg-muted">
      <div class="container">
        <div class="grid-2">
          <div class="contact-card">
            <h2 class="section-title" style="font-size:1.5rem;margin-bottom:1.5rem">Direct contact</h2>
            <ul class="contact-list">
              <li><div><div class="contact-list__label">Phone</div><div class="contact-list__value"><a href="tel:+903523202086">+90 352 320 20 86</a></div></div></li>
              <li><div><div class="contact-list__label">WhatsApp</div><div class="contact-list__value"><a href="https://wa.me/905320659117" target="_blank" rel="noopener">+90 532 065 91 17</a></div></div></li>
              <li><div><div class="contact-list__label">Email</div><div class="contact-list__value"><a href="mailto:info@entosis.com.tr">info@entosis.com.tr</a></div></div></li>
              <li><div><div class="contact-list__label">Address</div><div class="contact-list__value" style="font-size:0.875rem;font-weight:400;color:rgba(43,46,51,0.8)">Osman Kavuncu Mah. Emirhan Cad. No: 4/C<br>Melikgazi / Kayseri / Türkiye</div></div></li>
            </ul>
            <div style="margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:0.75rem">
              <a href="${prefix}en/fiyat-teklifi/index.html" class="btn btn--primary">Request a Quote →</a>
              <a href="https://wa.me/905320659117" class="btn btn--outline" target="_blank" rel="noopener">WhatsApp</a>
            </div>
          </div>
          <div class="contact-card">
            <h2 class="section-title" style="font-size:1.5rem;margin-bottom:1.5rem">Send a Message</h2>
            <form class="quote-form" action="mailto:info@entosis.com.tr" method="get" enctype="text/plain">
              <label class="form-field"><span class="form-field__label">Full Name</span><input type="text" name="name" required autocomplete="name"></label>
              <label class="form-field"><span class="form-field__label">Email</span><input type="email" name="email" required autocomplete="email"></label>
              <label class="form-field"><span class="form-field__label">Subject</span><input type="text" name="subject" required></label>
              <label class="form-field"><span class="form-field__label">Message</span><textarea name="body" rows="5" required></textarea></label>
              <button type="submit" class="btn btn--primary">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>`;
  }
  return `    <section class="section bg-white border-y">
      <div class="container">
        <div class="eyebrow">اتصل بنا</div>
        <h1 class="section-title">تواصل معنا</h1>
        <p style="margin-top:1rem;max-width:40rem;color:rgba(43,46,51,0.75);line-height:1.65">تواصل مع فريقنا. رد في نفس يوم العمل.</p>
      </div>
    </section>
    <section class="section bg-muted">
      <div class="container">
        <div class="grid-2">
          <div class="contact-card">
            <h2 class="section-title" style="font-size:1.5rem;margin-bottom:1.5rem">تواصل مباشر</h2>
            <ul class="contact-list">
              <li><div><div class="contact-list__label">الهاتف</div><div class="contact-list__value"><a href="tel:+903523202086">+90 352 320 20 86</a></div></div></li>
              <li><div><div class="contact-list__label">واتساب</div><div class="contact-list__value"><a href="https://wa.me/905320659117" target="_blank" rel="noopener">+90 532 065 91 17</a></div></div></li>
              <li><div><div class="contact-list__label">البريد الإلكتروني</div><div class="contact-list__value"><a href="mailto:info@entosis.com.tr">info@entosis.com.tr</a></div></div></li>
              <li><div><div class="contact-list__label">العنوان</div><div class="contact-list__value" style="font-size:0.875rem;font-weight:400;color:rgba(43,46,51,0.8)">Osman Kavuncu Mah. Emirhan Cad. No: 4/C<br>Melikgazi / Kayseri / Türkiye</div></div></li>
            </ul>
            <div style="margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:0.75rem">
              <a href="${prefix}ar/fiyat-teklifi/index.html" class="btn btn--primary">طلب عرض سعر ←</a>
              <a href="https://wa.me/905320659117" class="btn btn--outline" target="_blank" rel="noopener">واتساب</a>
            </div>
          </div>
          <div class="contact-card">
            <h2 class="section-title" style="font-size:1.5rem;margin-bottom:1.5rem">أرسل رسالة</h2>
            <form class="quote-form" action="mailto:info@entosis.com.tr" method="get" enctype="text/plain">
              <label class="form-field"><span class="form-field__label">الاسم الكامل</span><input type="text" name="name" required autocomplete="name"></label>
              <label class="form-field"><span class="form-field__label">بريدك الإلكتروني</span><input type="email" name="email" required autocomplete="email"></label>
              <label class="form-field"><span class="form-field__label">الموضوع</span><input type="text" name="subject" required></label>
              <label class="form-field"><span class="form-field__label">الرسالة</span><textarea name="body" rows="5" required></textarea></label>
              <button type="submit" class="btn btn--primary">إرسال</button>
            </form>
          </div>
        </div>
      </div>
    </section>`;
}

function aboutMain(locale, prefix) {
  if (locale === 'en') {
    return `    <section class="section section--lg bg-white border-y">
      <div class="container container--text">
        <div class="eyebrow">About Us</div>
        <h1 class="section-title">About Duru ULV Technology Systems</h1>
        <div style="margin-top:1.5rem;display:flex;flex-direction:column;gap:1.25rem;color:rgba(43,46,51,0.8);line-height:1.65">
          <p>Founded in 1990 in Kayseri, Turkey, Duru ULV Technology Systems is a manufacturer of Ultra Low Volume (ULV) spraying and disinfection equipment. With over 36 years of engineering experience, we design and produce professional-grade machines for pest control, disinfection, and agricultural applications.</p>
          <p>As a direct manufacturer — not a distributor — we offer full control over product quality, customization, and after-sales technical support. Our products are CE, TSE, ISO 9001, ISO 14001, and ISO 45001 certified, and comply with WHO vector control guidelines.</p>
          <p>We serve municipalities, public institutions, agricultural enterprises, hospitals, hotels, and industrial facilities across Turkey and internationally.</p>
        </div>
        <a href="${prefix}en/fiyat-teklifi/index.html" class="btn btn--primary" style="margin-top:2rem">Request a Quote →</a>
      </div>
    </section>`;
  }
  return `    <section class="section section--lg bg-white border-y">
      <div class="container container--text">
        <div class="eyebrow">من نحن</div>
        <h1 class="section-title">من نحن — Duru ULV Technology Systems</h1>
        <div style="margin-top:1.5rem;display:flex;flex-direction:column;gap:1.25rem;color:rgba(43,46,51,0.8);line-height:1.65">
          <p>تأسست شركة Duru ULV Technology Systems عام 1990 في مدينة قيصري بتركيا، وهي شركة مصنّعة لمعدات الرش بالحجم المنخفض جداً (ULV) والتعقيم. بخبرة هندسية تمتد لأكثر من 36 عاماً، نصمم وننتج أجهزة احترافية لمكافحة الحشرات والتعقيم والتطبيقات الزراعية.</p>
          <p>بوصفنا مصنّعاً مباشراً — لا موزعاً — نتمتع بسيطرة كاملة على جودة المنتج والتخصيص والدعم الفني. منتجاتنا حاصلة على شهادات CE وTSE وISO 9001 وISO 14001 وISO 45001، وتستوفي إرشادات منظمة الصحة العالمية.</p>
          <p>نخدم البلديات والمؤسسات الحكومية والمشاريع الزراعية والمستشفيات والفنادق والمنشآت الصناعية في تركيا وعلى المستوى الدولي.</p>
        </div>
        <a href="${prefix}ar/fiyat-teklifi/index.html" class="btn btn--primary" style="margin-top:2rem">طلب عرض سعر ←</a>
      </div>
    </section>`;
}

function qualityMain(locale) {
  const certs =
    locale === 'en'
      ? [
          ['CE', 'CE Marking'],
          ['TSE', 'TSE Certificate'],
          ['ISO 9001', 'ISO 9001:2015'],
          ['ISO 14001', 'ISO 14001'],
          ['ISO 45001', 'ISO 45001'],
          ['Agriculture', 'Ministry of Agriculture Approval'],
          ['Industry', 'Ministry of Industry Approval'],
        ]
      : [
          ['CE', 'علامة CE'],
          ['TSE', 'شهادة TSE'],
          ['ISO 9001', 'ISO 9001:2015'],
          ['ISO 14001', 'ISO 14001'],
          ['ISO 45001', 'ISO 45001'],
          ['الزراعة', 'اعتماد وزارة الزراعة'],
          ['الصناعة', 'اعتماد وزارة الصناعة'],
        ];
  const cards = certs
    .map(
      ([code, label]) => `          <div class="cert-card">
            <div class="cert-card__code">${esc(code)}</div>
            <div class="cert-card__label">${esc(label)}</div>
          </div>`
    )
    .join('\n');

  if (locale === 'en') {
    return `    <section class="section bg-white border-y">
      <div class="container container--text">
        <div class="eyebrow">Quality</div>
        <h1 class="section-title">Quality Policy &amp; Certifications</h1>
        <p style="margin-top:1rem;color:rgba(43,46,51,0.75);line-height:1.65">Our products meet international standards for safety, quality, and environmental management.</p>
      </div>
    </section>
    <section class="section bg-muted">
      <div class="container">
        <div class="cert-grid">
${cards}
        </div>
      </div>
    </section>`;
  }
  return `    <section class="section bg-white border-y">
      <div class="container container--text">
        <div class="eyebrow">الجودة</div>
        <h1 class="section-title">سياسة الجودة والشهادات</h1>
        <p style="margin-top:1rem;color:rgba(43,46,51,0.75);line-height:1.65">منتجاتنا تستوفي المعايير الدولية للسلامة والجودة وإدارة البيئة.</p>
      </div>
    </section>
    <section class="section bg-muted">
      <div class="container">
        <div class="cert-grid">
${cards}
        </div>
      </div>
    </section>`;
}

function blogMain(locale, prefix) {
  const trBlog = `${prefix}blog/`;
  const cards = BLOG_POSTS.map((post) => {
    const t = post[locale];
    const img = `${prefix}assets/img/blog/${BLOG_COVER[post.slug]}`;
    const trHref = `${trBlog}${post.slug}/index.html`;
    if (locale === 'en') {
      return `          <article class="blog-card lift-card">
            <a href="${trHref}" class="blog-card__media" tabindex="-1" aria-hidden="true">
              <img src="${img}" alt="${esc(t.title)}" class="blog-card__img" width="400" height="225" loading="lazy" decoding="async">
            </a>
            <div class="blog-card__body">
              <h2 class="blog-card__title"><a href="${trHref}">${esc(t.title)}</a></h2>
              <p class="blog-card__excerpt">${esc(t.excerpt)}</p>
              <p class="blog-card__meta" style="margin-top:0.75rem">Full article available in Turkish</p>
              <a href="${trHref}" class="blog-card__link">Read in Turkish →</a>
            </div>
          </article>`;
    }
    return `          <article class="blog-card lift-card">
            <a href="${trHref}" class="blog-card__media" tabindex="-1" aria-hidden="true">
              <img src="${img}" alt="${esc(t.title)}" class="blog-card__img" width="400" height="225" loading="lazy" decoding="async">
            </a>
            <div class="blog-card__body">
              <h2 class="blog-card__title"><a href="${trHref}">${esc(t.title)}</a></h2>
              <p class="blog-card__excerpt">${esc(t.excerpt)}</p>
              <p class="blog-card__meta" style="margin-top:0.75rem">المقال الكامل متاح باللغة التركية</p>
              <a href="${trHref}" class="blog-card__link">اقرأ بالتركية ←</a>
            </div>
          </article>`;
  }).join('\n');

  if (locale === 'en') {
    return `    <section class="blog-hero">
      <div class="container">
        <div class="eyebrow">Blog</div>
        <h1>Blog &amp; Resources</h1>
        <p>Technical guides and industry insights from Duru ULV Technology Systems.</p>
      </div>
    </section>
    <section class="section bg-muted border-y">
      <div class="container">
        <div class="blog-grid">
${cards}
        </div>
      </div>
    </section>`;
  }
  return `    <section class="blog-hero">
      <div class="container">
        <div class="eyebrow">المدونة</div>
        <h1>المدونة والموارد</h1>
        <p>أدلة تقنية ورؤى من Duru ULV.</p>
      </div>
    </section>
    <section class="section bg-muted border-y">
      <div class="container">
        <div class="blog-grid">
${cards}
        </div>
      </div>
    </section>`;
}

for (const locale of ['en', 'ar']) {
  const prefixDepth2 = '../../';
  // Contact — nav path + English alias
  const contactOpts = {
    trRel: 'iletisim/index.html',
    title: locale === 'en' ? 'Contact Us — Duru ULV' : 'تواصل معنا — Duru ULV',
    description:
      locale === 'en'
        ? 'Contact Duru ULV — phone, WhatsApp, email. Same-day response during business hours.'
        : 'تواصل مع دورو يو إل في — هاتف، واتساب، بريد. رد في نفس يوم العمل.',
    h1: locale === 'en' ? 'Contact Us' : 'تواصل معنا',
    main: contactMain(locale, prefixDepth2),
  };
  writePage(
    `${locale}/iletisim/index.html`,
    pageShell(locale, { ...contactOpts, rel: 'iletisim/index.html' })
  );
  writePage(
    `${locale}/contact/index.html`,
    pageShell(locale, { ...contactOpts, rel: 'contact/index.html' })
  );

  const aboutOpts = {
    trRel: 'hakkimizda/index.html',
    title:
      locale === 'en'
        ? 'About Duru ULV Technology Systems — Duru ULV'
        : 'من نحن — Duru ULV Technology Systems',
    description:
      locale === 'en'
        ? 'About Duru ULV — manufacturer of ULV spraying equipment since 1990 in Kayseri, Turkey.'
        : 'عن دورو يو إل في — مصنّع معدات رش ULV منذ 1990 في قيصري، تركيا.',
    h1:
      locale === 'en'
        ? 'About Duru ULV Technology Systems'
        : 'من نحن — Duru ULV Technology Systems',
    main: aboutMain(locale, prefixDepth2),
  };
  writePage(
    `${locale}/hakkimizda/index.html`,
    pageShell(locale, { ...aboutOpts, rel: 'hakkimizda/index.html' })
  );
  writePage(
    `${locale}/about/index.html`,
    pageShell(locale, { ...aboutOpts, rel: 'about/index.html' })
  );

  const qualityOpts = {
    trRel: 'kalite-politikamiz/index.html',
    title:
      locale === 'en'
        ? 'Quality Policy & Certifications — Duru ULV'
        : 'سياسة الجودة والشهادات — Duru ULV',
    description:
      locale === 'en'
        ? 'Duru ULV quality policy and certifications: CE, TSE, ISO 9001, ISO 14001, ISO 45001.'
        : 'سياسة الجودة وشهادات دورو يو إل في: CE وTSE وISO.',
    h1: locale === 'en' ? 'Quality Policy & Certifications' : 'سياسة الجودة والشهادات',
    main: qualityMain(locale),
  };
  writePage(
    `${locale}/kalite-politikamiz/index.html`,
    pageShell(locale, { ...qualityOpts, rel: 'kalite-politikamiz/index.html' })
  );
  writePage(
    `${locale}/quality-policy/index.html`,
    pageShell(locale, { ...qualityOpts, rel: 'quality-policy/index.html' })
  );

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
      extraCss: 'blog',
      main: blogMain(locale, prefixDepth2),
    })
  );
}

console.log('BLOG_CARDS', BLOG_POSTS.length);
