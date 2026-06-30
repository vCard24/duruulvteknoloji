/**
 * Zengin blog düzeni — tüm yazılar için otomatik TOC, etiketler, hero meta.
 *
 * SEO stratejisi:
 * - İçindekiler: h2 anchor linkleri → UX, sayfa içi gezinme, olası SERP jump linkleri
 * - İlgili Etiketler: odak/ek anahtar kelimeler → iç link (ürün kategorisi veya ilgili blog)
 */

const BLOG_RICH_OVERRIDES = {
  'sis-ufleme-makinesi-mist-blower-nedir-rehber': {
    tag: 'ÜRÜN REHBERİ',
    readMinutes: 12,
    lead:
      'Geniş alanlarda sivrisinek ve vektör mücadelesi için sis üfleme makinesi (mist blower) teknolojisinin çalışma prensibi, Duru ve Entosis model incelemeleri ve uzman alım kriterleri.',
    tags: [
      { label: 'Sis Üfleme Makinesi', href: 'urunler/arac-uzeri-ilaclama/index.html' },
      { label: 'Mist Blower', href: 'urunler/arac-uzeri-ilaclama/duru-mist-blower-15hp/index.html' },
      { label: 'Araç Üstü İlaçlama', href: 'urunler/arac-uzeri-ilaclama/index.html' },
      { label: 'Belediye İlaçlama', href: 'blog/belediye-ilaclama-ekipmani-secimi/index.html' },
    ],
    toc: [
      { id: 'nedir', label: 'Sis üfleme makinesi nedir?' },
      { id: 'fark', label: 'Mist blower vs pülverizatör' },
      { id: 'mikron', label: 'Damlacık boyutu (35 μm)' },
      { id: 'modeller', label: 'Profesyonel modeller' },
      { id: 'duru-15hp', label: 'Duru Mist Blower 15HP' },
      { id: 'entosis-500l', label: 'Entosis Mist Blower 500L' },
      { id: 'alim', label: 'Alım kriterleri' },
      { id: 'uygulama', label: 'Pratik uygulama bilgileri' },
      { id: 'sonuc', label: 'Sonuç' },
    ],
  },
};

const BLOG_CATEGORY_TAG = {
  'ulv-ilaclama-nedir': 'TEMEL BİLGİ',
  'mist-blower-ulv-pulverizator-farki': 'TEKNİK REHBER',
  'belediye-ilaclama-ekipmani-secimi': 'BELEDİYE',
  'belediye-ilaclama-neden-yetersiz': 'BELEDİYE',
  'sera-zararlilari-ulv-karsilastirma': 'SERA',
  'sivrisinek-ilaclama-mikron-capi': 'TEKNİK REHBER',
  'duru-ulv-hikayesi': 'KURUMSAL',
  'ulv-cihazi-alirken-7-soru': 'ALIM REHBERİ',
  'kamu-alimlarinda-ce-iso-sertifikasi': 'KURUMSAL',
  'yaz-oncesi-belediye-ilaclama-hazirlik': 'BELEDİYE',
  'sonbahar-sera-hasere-kontrolu': 'SERA',
  'sinekle-mucadele-pencere-sinekligi-yeterli-mi': 'REHBER',
  'sis-ufleme-makinesi-mist-blower-nedir-rehber': 'ÜRÜN REHBERİ',
};

/** Etiket metni → en alakalı iç sayfa */
const TAG_LINK_RULES = [
  { re: /sis\s*üfleme|mist\s*blower|araç\s*üstü|arac\s*ustu/, href: 'urunler/arac-uzeri-ilaclama/index.html' },
  { re: /belediye|sokak\s*ilaç/, href: 'urunler/arac-uzeri-ilaclama/index.html' },
  { re: /sera|serada|bitki/, href: 'urunler/sera-tipi-ulv-ilaclama/index.html' },
  { re: /sırt|sirt\s*tipi/, href: 'urunler/sirt-tipi-ulv-ilaclama/index.html' },
  { re: /el\s*tipi|taşınabilir|tasinabilir/, href: 'urunler/el-tipi-ulv-ilaclama/index.html' },
  { re: /sivrisinek|karasinek|mikron/, href: 'blog/sivrisinek-ilaclama-mikron-capi/index.html' },
  { re: /ulv|sisleme|sisleme|pulverizatör|pulverizator/, href: 'urunler/index.html' },
  { re: /sertifika|ce|iso|ihale|kamu/, href: 'blog/kamu-alimlarinda-ce-iso-sertifikasi/index.html' },
  { re: /sineklik|sinek/, href: 'blog/sinekle-mucadele-pencere-sinekligi-yeterli-mi/index.html' },
  { re: /dezenfeksiyon|hastane/, href: 'urunler/el-tipi-ulv-ilaclama/index.html' },
];

const RELATED_BLOG_BY_SLUG = {
  'ulv ilaclama': 'ulv-ilaclama-nedir',
  'mist blower': 'mist-blower-ulv-pulverizator-farki',
  'belediye ilaclama': 'belediye-ilaclama-ekipmani-secimi',
  'sera zararlilari': 'sera-zararlilari-ulv-karsilastirma',
  'ulv cihazi': 'ulv-cihazi-alirken-7-soru',
};

function normalizeKey(s) {
  const trMap = {
    ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
    Ç: 'c', Ğ: 'g', İ: 'i', I: 'i', Ö: 'o', Ş: 's', Ü: 'u',
  };
  let t = String(s);
  for (const [from, to] of Object.entries(trMap)) {
    t = t.split(from).join(to);
  }
  return t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slugifyHeading(heading) {
  const base = normalizeKey(heading)
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 56);
  return base || 'bolum';
}

function formatTagLabel(label) {
  return label
    .trim()
    .replace(/\bulv\b/gi, 'ULV')
    .replace(/\bce\b/gi, 'CE')
    .replace(/\biso\b/gi, 'ISO');
}

function resolveTagHref(keyword, currentSlug) {
  const key = normalizeKey(keyword);

  if (RELATED_BLOG_BY_SLUG[key]) {
    const slug = RELATED_BLOG_BY_SLUG[key];
    if (slug !== currentSlug) return `blog/${slug}/index.html`;
  }

  for (const rule of TAG_LINK_RULES) {
    if (rule.re.test(keyword) || rule.re.test(key)) return rule.href;
  }

  return 'blog/index.html';
}

function estimateReadMinutes(sections, faqs) {
  let text = '';
  (sections || []).forEach((s) => {
    text += `${s.heading} ${s.body} `;
  });
  (faqs || []).forEach((f) => {
    text += `${f.q} ${f.a} `;
  });
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 200));
}

function buildTocFromSections(sections) {
  const used = new Set();
  return (sections || []).map((sec) => {
    let id = slugifyHeading(sec.heading);
    let n = 2;
    while (used.has(id)) {
      id = `${slugifyHeading(sec.heading)}-${n}`;
      n += 1;
    }
    used.add(id);
    const label = sec.heading.replace(/\?+$/, '').trim();
    return { id, label };
  });
}

function buildTagsFromMeta(meta, slug) {
  const tags = [];
  const seen = new Set();

  function add(label, href) {
    const key = normalizeKey(label);
    if (!label || seen.has(key)) return;
    seen.add(key);
    tags.push({ label: formatTagLabel(label), href: href || resolveTagHref(label, slug) });
  }

  if (meta.focusKeyword) add(meta.focusKeyword, resolveTagHref(meta.focusKeyword, slug));

  if (meta.additionalKeywords) {
    meta.additionalKeywords
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4)
      .forEach((kw) => add(kw, resolveTagHref(kw, slug)));
  }

  return tags.slice(0, 5);
}

function buildRichLayout(post) {
  const overrides = BLOG_RICH_OVERRIDES[post.slug] || {};
  const autoToc = buildTocFromSections(post.sections);

  return {
    tag: overrides.tag || BLOG_CATEGORY_TAG[post.slug] || 'BLOG',
    readMinutes: overrides.readMinutes || estimateReadMinutes(post.sections, post.faqs),
    lead: overrides.lead || post.meta.metaDescription || post.title,
    tags: overrides.tags || buildTagsFromMeta(post.meta, post.slug),
    toc: overrides.toc || autoToc,
    sectionIds: overrides.toc
      ? null
      : autoToc.map((t) => t.id),
  };
}

function applySectionIds(sections, layout) {
  if (!sections || !layout.sectionIds) return sections;
  return sections.map((sec, i) => ({
    ...sec,
    id: layout.sectionIds[i] || slugifyHeading(sec.heading),
  }));
}

function standardBlogCta(prefix) {
  return `<div class="blog-cta-bar blog-cta-bar--hero">
  <div class="blog-cta-bar__content">
    <h3 class="blog-cta-bar__heading">ULV çözümünüz için teklif alın</h3>
    <p class="blog-cta-bar__text">İhtiyacınıza uygun ilaçlama makinesini birlikte belirleyelim; teknik destek ve kurumsal fiyat bilgisi için bize ulaşın.</p>
  </div>
  <div class="blog-cta-bar__actions">
    <a href="${prefix}fiyat-teklifi/index.html" class="btn btn--white btn--sm">Teklif Al</a>
    <a href="${prefix}urunler/index.html" class="btn btn--outline-white btn--sm">Ürünleri İncele</a>
  </div>
</div>`;
}

module.exports = {
  BLOG_RICH_OVERRIDES,
  buildRichLayout,
  applySectionIds,
  slugifyHeading,
  standardBlogCta,
};
