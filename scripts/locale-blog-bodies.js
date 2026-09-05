/**
 * EN/AR blog post bodies. Built from _blog-meta.json + locale-blog-blurbs.js
 */
const meta = require('./_blog-meta.json');
const blurbs = require('./locale-blog-blurbs');

const UI = {
  en: {
    backLabel: '← All blog posts',
    tocHeading: 'Contents',
    tagsHeading: 'Related tags',
    faqEyebrow: 'FAQ',
    faqTitle: 'Quick answers',
    homeCrumb: 'Home',
    blogCrumb: 'Blog',
    ctaHeading: 'Get a tailored ULV quote',
    ctaText:
      'Tell us your application area and capacity needs—we will recommend the right Duru ULV setup.',
  },
  ar: {
    backLabel: '→ كل مقالات المدونة',
    tocHeading: 'المحتويات',
    tagsHeading: 'وسوم ذات صلة',
    faqEyebrow: 'أسئلة شائعة',
    faqTitle: 'إجابات سريعة',
    homeCrumb: 'الرئيسية',
    blogCrumb: 'المدونة',
    ctaHeading: 'اطلب عرض سعر ULV مخصصاً',
    ctaText: 'أخبرنا بمجال التطبيق والسعة المطلوبة—نقترح تجهيزة Duru ULV المناسبة.',
  },
};

const DATE_EN = {
  '2026-06-03': '3 June 2026',
  '2026-06-05': '5 June 2026',
  '2026-06-08': '8 June 2026',
  '2026-06-10': '10 June 2026',
  '2026-06-12': '12 June 2026',
  '2026-06-15': '15 June 2026',
  '2026-06-18': '18 June 2026',
  '2026-06-20': '20 June 2026',
  '2026-06-22': '22 June 2026',
  '2026-06-26': '26 June 2026',
  '2026-06-28': '28 June 2026',
  '2026-06-30': '30 June 2026',
  '2026-07-02': '2 July 2026',
};

const DATE_AR = {
  '2026-06-03': '3 حزيران/يونيو 2026',
  '2026-06-05': '5 حزيران/يونيو 2026',
  '2026-06-08': '8 حزيران/يونيو 2026',
  '2026-06-10': '10 حزيران/يونيو 2026',
  '2026-06-12': '12 حزيران/يونيو 2026',
  '2026-06-15': '15 حزيران/يونيو 2026',
  '2026-06-18': '18 حزيران/يونيو 2026',
  '2026-06-20': '20 حزيران/يونيو 2026',
  '2026-06-22': '22 حزيران/يونيو 2026',
  '2026-06-26': '26 حزيران/يونيو 2026',
  '2026-06-28': '28 حزيران/يونيو 2026',
  '2026-06-30': '30 حزيران/يونيو 2026',
  '2026-07-02': '2 تموز/يوليو 2026',
};

function dateLabel(locale, iso) {
  if (locale === 'en') return DATE_EN[iso] || 'June 2026';
  return DATE_AR[iso] || 'حزيران/يونيو 2026';
}

function readLabel(locale, readTr) {
  if (locale === 'en') {
    if (readTr && /12/.test(readTr)) return '8 min read';
    if (readTr && /4|5|6|7|8|9|10|11/.test(readTr)) return '4 min read';
    return '3 min read';
  }
  if (readTr && /12/.test(readTr)) return '٨ دقائق قراءة';
  if (readTr && /4|5|6|7|8|9|10|11/.test(readTr)) return '٤ دقائق قراءة';
  return '٣ دقائق قراءة';
}

function fallbackPara(locale, heading) {
  if (locale === 'en') {
    return `<p style="color:rgba(43,46,51,0.8);line-height:1.65;margin-bottom:1.25rem">This section covers <strong>${heading}</strong> for professional ULV programs. Browse the <a href="{{products}}" style="color:var(--color-primary);font-weight:600">product catalog</a> or <a href="{{quote}}" style="color:var(--color-primary);font-weight:600">request a quote</a>.</p>`;
  }
  return `<p style="color:rgba(43,46,51,0.8);line-height:1.65;margin-bottom:1.25rem">يغطي هذا القسم <strong>${heading}</strong> لبرامج ULV الاحترافية. راجع <a href="{{products}}" style="color:var(--color-primary);font-weight:600">كتالوج المنتجات</a> أو <a href="{{quote}}" style="color:var(--color-primary);font-weight:600">اطلب عرض سعر</a>.</p>`;
}

function buildLocale(locale, m) {
  const c = (blurbs[m.slug] && blurbs[m.slug][locale]) || {};
  const ui = UI[locale];
  const sections = m.h2.map((h, i) => {
    const heading =
      (c.headings && c.headings[h.id]) ||
      (locale === 'en' ? `Section ${i + 1}` : `القسم ${i + 1}`);
    const html =
      (c.paras && c.paras[h.id]) || fallbackPara(locale, heading);
    return { id: h.id, heading, html };
  });
  const faqs =
    c.faqs && c.faqs.length
      ? c.faqs
      : (m.faqs || []).map((_, i) =>
          locale === 'en'
            ? {
                q: `Question ${i + 1}`,
                a: 'Contact Duru ULV for application-specific guidance.',
              }
            : {
                q: `سؤال ${i + 1}`,
                a: 'تواصل مع Duru ULV لإرشاد خاص بالتطبيق.',
              }
        );

  return {
    title: c.title || m.titleTr,
    description:
      c.description ||
      (locale === 'en'
        ? 'Technical guidance from Duru ULV on professional ULV spraying.'
        : 'إرشاد تقني من Duru ULV حول رش ULV الاحترافي.'),
    tag: c.tag || (locale === 'en' ? 'GUIDE' : 'دليل'),
    dateLabel: c.dateLabel || dateLabel(locale, m.datePublished),
    readLabel: c.readLabel || readLabel(locale, m.readTr),
    sections,
    faqs,
    tags: [c.tag || 'ULV', 'Duru ULV'],
    ctaHeading: c.ctaHeading || ui.ctaHeading,
    ctaText: c.ctaText || ui.ctaText,
    backLabel: ui.backLabel,
    tocHeading: ui.tocHeading,
    tagsHeading: ui.tagsHeading,
    faqEyebrow: ui.faqEyebrow,
    faqTitle: ui.faqTitle,
    homeCrumb: ui.homeCrumb,
    blogCrumb: ui.blogCrumb,
  };
}

const POSTS = {};
for (const m of meta) {
  POSTS[m.slug] = {
    en: buildLocale('en', m),
    ar: buildLocale('ar', m),
  };
}

module.exports = { POSTS };
