/**
 * AI ajan keşif dosyaları: llms.txt, llms-full.txt, ai.txt, brand.txt
 * Kullanım: node scripts/generate-ai-discovery.js
 * (generate-sitemap.js tarafından da otomatik çağrılır)
 */
const fs = require('fs');
const path = require('path');
const { SITE_ORIGIN, alternateUrl } = require('./seo-meta');

const ROOT = path.join(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/urunler.json'), 'utf8'));
const catalogEn = fs.existsSync(path.join(ROOT, 'assets/data/urunler.en.json'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/urunler.en.json'), 'utf8'))
  : catalog;
const catalogAr = fs.existsSync(path.join(ROOT, 'assets/data/urunler.ar.json'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/urunler.ar.json'), 'utf8'))
  : catalog;
const productSeo = fs.existsSync(path.join(ROOT, 'assets/data/product-seo.json'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/product-seo.json'), 'utf8'))
  : {};
const blogPosts = fs.existsSync(path.join(ROOT, 'assets/data/blog-posts.json'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/blog-posts.json'), 'utf8'))
  : [];
const localeBlogBlurbs = (() => {
  try {
    return require('./locale-blog-blurbs');
  } catch (e) {
    return {};
  }
})();

const k = catalog.kurumsal_bilgiler;
const ORIGIN = SITE_ORIGIN;

function url(rel) {
  const p = rel.replace(/^\//, '').replace(/index\.html$/, '');
  return p.endsWith('/') || !p ? `${ORIGIN}/${p}` : `${ORIGIN}/${p}/`;
}

function localeUrls(trRel) {
  const tr = alternateUrl(trRel, 'tr') || url(trRel);
  const en = alternateUrl(trRel, 'en');
  const ar = alternateUrl(trRel, 'ar');
  return { tr, en, ar };
}

function trEnArLine(label, trRel) {
  const { tr, en, ar } = localeUrls(trRel);
  return `- [${label}](${tr}) | [EN](${en}) | [AR](${ar})`;
}

function productsByCategory() {
  const map = {};
  catalog.kategoriler.forEach((cat) => {
    map[cat.slug] = { cat, products: [] };
  });
  catalog.urunler.forEach((p) => {
    if (map[p.kategori_slug]) map[p.kategori_slug].products.push(p);
  });
  return map;
}

function findLocaleProduct(slug, localeCatalog) {
  return (localeCatalog.urunler || []).find((p) => p.slug === slug) || null;
}

function findLocaleCategory(slug, localeCatalog) {
  return (localeCatalog.kategoriler || []).find((c) => c.slug === slug) || null;
}

function llmsTxt() {
  const byCat = productsByCategory();
  const featured = [
    'duru-hd50',
    'duru-mist-blower-15hp',
    'entosis-mist-blower-500l',
    'entosis-50',
    'duru-hd5',
    'duru-sirt10',
  ];
  const featuredProducts = featured
    .map((slug) => catalog.urunler.find((p) => p.slug === slug))
    .filter(Boolean);

  const featuredLines = featuredProducts.map((p) => {
    const seo = productSeo[p.slug];
    const desc = (seo && seo.meta && seo.meta.metaDescription) || p.kisa_aciklama_tr;
    const trRel = `urunler/${p.kategori_slug}/${p.slug}/index.html`;
    const { tr, en, ar } = localeUrls(trRel);
    const pen = findLocaleProduct(p.slug, catalogEn);
    const par = findLocaleProduct(p.slug, catalogAr);
    const enDesc = (pen && pen.kisa_aciklama_en) || desc;
    const arDesc = (par && par.kisa_aciklama_ar) || desc;
    const enName = (pen && pen.ad_en) || p.ad_en || p.ad_tr;
    const arName = (par && par.ad_ar) || p.ad_ar || p.ad_tr;
    return `- [${p.ad_tr}](${tr}) | [EN: ${enName}](${en}) | [AR: ${arName}](${ar})\n  - TR: ${desc}\n  - EN: ${enDesc}\n  - AR: ${arDesc}`;
  });

  const catLines = Object.values(byCat).map(({ cat, products }) => {
    const catRel = `urunler/${cat.slug}/index.html`;
    const { tr: catTr, en: catEn, ar: catAr } = localeUrls(catRel);
    const cen = findLocaleCategory(cat.slug, catalogEn);
    const car = findLocaleCategory(cat.slug, catalogAr);
    const links = products
      .map((p) => {
        const pr = `urunler/${p.kategori_slug}/${p.slug}/index.html`;
        const u = localeUrls(pr);
        const pen = findLocaleProduct(p.slug, catalogEn);
        const par = findLocaleProduct(p.slug, catalogAr);
        const enName = (pen && pen.ad_en) || p.ad_en || p.ad_tr;
        const arName = (par && par.ad_ar) || p.ad_ar || p.ad_tr;
        return `[${p.ad_tr}](${u.tr}) ([EN: ${enName}](${u.en}) · [AR: ${arName}](${u.ar}))`;
      })
      .join(', ');
    const enCat = (cen && cen.ad_en) || cat.ad_en || cat.ad_tr;
    const arCat = (car && car.ad_ar) || cat.ad_ar || cat.ad_tr;
    const enDesc = (cen && cen.aciklama_en) || cat.aciklama_tr;
    const arDesc = (car && car.aciklama_ar) || cat.aciklama_tr;
    return `- **${cat.ad_tr} / ${enCat} / ${arCat}**\n  - TR ${catTr}: ${cat.aciklama_tr}\n  - EN ${catEn}: ${enDesc}\n  - AR ${catAr}: ${arDesc}\n  - Models: ${links}`;
  });

  const blogLines = blogPosts.slice(0, 8).map((b) => {
    const desc = (b.meta && b.meta.metaDescription) || b.title;
    const { tr, en, ar } = localeUrls(`blog/${b.slug}/index.html`);
    const blurb = localeBlogBlurbs[b.slug] || {};
    const enTitle = (blurb.en && blurb.en.title) || b.title;
    const arTitle = (blurb.ar && blurb.ar.title) || b.title;
    const enDesc = (blurb.en && blurb.en.description) || desc;
    const arDesc = (blurb.ar && blurb.ar.description) || desc;
    return `- [${b.title}](${tr}) | [EN: ${enTitle}](${en}) | [AR: ${arTitle}](${ar})\n  - TR: ${desc}\n  - EN: ${enDesc}\n  - AR: ${arDesc}`;
  });

  return `# ${k.firma_adi}

> Türkiye'nin 36 yıllık ULV (Ultra Low Volume) ilaçlama makinesi üreticisi. Belediye, tarım, sağlık ve endüstriyel vektör kontrolü için araç üstü, sera, sırt ve el tipi cihazlar.

${k.firma_adi}, 1990'dan bu yana Kayseri'de ULV ilaçlama ekipmanları tasarlar ve üretir. **Entosis** markası aynı firmaya aittir. Ürünler CE, TSE ve ISO sertifikalıdır. Sitede fiyat gösterilmez; satış teklif formu veya doğrudan iletişimle yapılır.

## English summary
36-year ULV (Ultra Low Volume) fogging equipment manufacturer in Kayseri, Turkey. Vehicle-mounted, greenhouse, backpack, and handheld machines for municipal, agricultural, healthcare, and industrial vector control. **Entosis** is a brand of the same company. Certified CE / TSE / ISO. Prices are quote-only via the multilingual forms at ${ORIGIN}/en/fiyat-teklifi/ and ${ORIGIN}/ar/fiyat-teklifi/.

## ملخص عربي
مصنع معدات الرش بتقنية ULV منذ 36 عاماً في قيصري، تركيا. أجهزة مركبة على المركبات، صوب زراعية، ظهرية ويدوية لمكافحة النواقل. **Entosis** علامة تابعة لنفس الشركة. الشهادات: CE و TSE و ISO. الأسعار عبر طلب عرض فقط: ${ORIGIN}/ar/fiyat-teklifi/.

## Kurumsal / Corporate / الشركة
${trEnArLine('Ana Sayfa / Home / الرئيسية', 'index.html')}
${trEnArLine('Hakkımızda / About / من نحن', 'hakkimizda/index.html')}
${trEnArLine('Kalite Politikamız / Quality Policy / سياسة الجودة', 'kalite-politikamiz/index.html')}
${trEnArLine('İletişim / Contact / اتصل بنا', 'iletisim/index.html')}
- Instagram: ${k.sosyal && k.sosyal.instagram ? k.sosyal.instagram : ''}
- Facebook: ${k.sosyal && k.sosyal.facebook ? k.sosyal.facebook : ''}
${trEnArLine('Fiyat Teklifi / Quote / عرض السعر', 'fiyat-teklifi/index.html')}
${trEnArLine('Katalog / Catalog / الكتالوج', 'katalog/index.html')}
${trEnArLine('Ürün Karşılaştırma / Compare / مقارنة', 'urun-karsilastirma/index.html')}

## Dil / Language / اللغة
- Turkish (default): ${ORIGIN}/
- English: ${ORIGIN}/en/ — products under ${ORIGIN}/en/products/
- Arabic: ${ORIGIN}/ar/ — products under ${ORIGIN}/ar/products/
- Sitemap (TR+EN+AR with hreflang): ${ORIGIN}/sitemap.xml

## Ürün Kategorileri / Product Categories
${catLines.join('\n')}

## Öne Çıkan Ürünler / Featured Products
${featuredLines.join('\n')}

## Blog ve Rehber İçerikleri / Guides
${blogLines.join('\n')}
${trEnArLine('Tüm blog yazıları / All posts / كل المقالات', 'blog/index.html')}

## Yasal ve Gizlilik / Legal
${trEnArLine('KVKK Aydınlatma Metni / Privacy Notice', 'kvkk/index.html')}
${trEnArLine('Gizlilik Politikası / Privacy Policy', 'gizlilik-politikasi/index.html')}
${trEnArLine('Kullanım Koşulları / Terms of Use', 'kullanim-kosullari/index.html')}

## AI ve Teknik Kaynaklar / Discovery
- [llms-full.txt](${ORIGIN}/llms-full.txt): Full product + blog URL map (TR|EN|AR)
- [ai.txt](${ORIGIN}/ai.txt): AI usage and citation policy
- [brand.txt](${ORIGIN}/brand.txt): Brand naming rules
- [ai-catalog.json](${ORIGIN}/ai-catalog.json): Agentic Resource Discovery catalog
- [security.txt](${ORIGIN}/.well-known/security.txt): Security vulnerability contact (RFC 9116)
- [sitemap.xml](${ORIGIN}/sitemap.xml): XML sitemap with xhtml:hreflang alternates
- [robots.txt](${ORIGIN}/robots.txt): Crawl rules
`;
}

function llmsFullTxt() {
  const byCat = productsByCategory();
  const sections = [];

  sections.push(`# ${k.firma_adi} — Tam İçerik Haritası\n`);
  sections.push(`Bu dosya, AI ajanlarının sitedeki tüm önemli sayfaları bulması için genişletilmiş URL listesidir.\n`);
  sections.push(`Site kökü: ${ORIGIN}/\n`);

  sections.push('## Statik Sayfalar (TR | EN | AR)\n');
  [
    ['Ana Sayfa', 'index.html'],
    ['Ürünler', 'urunler/index.html'],
    ['Blog', 'blog/index.html'],
    ['Hakkımızda', 'hakkimizda/index.html'],
    ['İletişim', 'iletisim/index.html'],
    ['Fiyat Teklifi', 'fiyat-teklifi/index.html'],
    ['Kalite Politikası', 'kalite-politikamiz/index.html'],
    ['KVKK', 'kvkk/index.html'],
    ['Gizlilik', 'gizlilik-politikasi/index.html'],
    ['Kullanım Koşulları', 'kullanim-kosullari/index.html'],
    ['Katalog', 'katalog/index.html'],
    ['Ürün Karşılaştırma', 'urun-karsilastirma/index.html'],
  ].forEach(([title, rel]) => {
    sections.push(trEnArLine(title, rel));
  });

  sections.push('\n## Dil kökleri\n');
  sections.push(`- TR: ${ORIGIN}/`);
  sections.push(`- EN: ${ORIGIN}/en/`);
  sections.push(`- AR: ${ORIGIN}/ar/`);

  Object.values(byCat).forEach(({ cat, products }) => {
    const cen = findLocaleCategory(cat.slug, catalogEn);
    const car = findLocaleCategory(cat.slug, catalogAr);
    const enCat = (cen && cen.ad_en) || cat.ad_en || cat.ad_tr;
    const arCat = (car && car.ad_ar) || cat.ad_ar || cat.ad_tr;
    sections.push(`\n## ${cat.ad_tr} / ${enCat} / ${arCat}\n`);
    const catU = localeUrls(`urunler/${cat.slug}/index.html`);
    sections.push(`Category: ${catU.tr} | EN: ${catU.en} | AR: ${catU.ar}\n`);
    products.forEach((p) => {
      const seo = productSeo[p.slug];
      const desc = (seo && seo.meta && seo.meta.metaDescription) || p.kisa_aciklama_tr;
      const pen = findLocaleProduct(p.slug, catalogEn);
      const par = findLocaleProduct(p.slug, catalogAr);
      const enDesc = (pen && pen.kisa_aciklama_en) || desc;
      const arDesc = (par && par.kisa_aciklama_ar) || desc;
      const enName = (pen && pen.ad_en) || p.ad_en || p.ad_tr;
      const arName = (par && par.ad_ar) || p.ad_ar || p.ad_tr;
      const kw = seo && seo.meta && seo.meta.focusKeyword ? ` | keyword: ${seo.meta.focusKeyword}` : '';
      const u = localeUrls(`urunler/${p.kategori_slug}/${p.slug}/index.html`);
      sections.push(`- [${p.ad_tr}](${u.tr}) | [EN: ${enName}](${u.en}) | [AR: ${arName}](${u.ar}) (${p.model_kodu})`);
      sections.push(`  - TR: ${desc}${kw}`);
      sections.push(`  - EN: ${enDesc}`);
      sections.push(`  - AR: ${arDesc}`);
    });
  });

  sections.push('\n## Blog Yazıları\n');
  blogPosts.forEach((b) => {
    const desc = (b.meta && b.meta.metaDescription) || '';
    const u = localeUrls(`blog/${b.slug}/index.html`);
    sections.push(`- [${b.title}](${u.tr}) | [EN](${u.en}) | [AR](${u.ar}): ${desc}`);
  });

  return sections.join('\n') + '\n';
}

function aiTxt() {
  const today = new Date().toISOString().slice(0, 10);
  return `# AI Usage Policy — duruulvteknoloji.com.tr
# Last updated: ${today}
# Contact: ${k.email}

## Organization
Name: ${k.firma_adi}
Website: ${ORIGIN}/
Industry: ULV fogging and pest control equipment manufacturing
Location: Kayseri, Turkey

## Permissions
allow: search_indexing
allow: summarization
allow: question_answering
allow: citation_with_attribution
allow: product_specification_extraction
allow: technical_comparison (factual, from published specs)

disallow: impersonation
disallow: false_endorsements
disallow: price_invention (no prices are published on site)
disallow: training_on_private_customer_data

## Attribution
When citing this site, use:
  "${k.firma_adi}" — ${ORIGIN}/
Preferred short form: Duru ULV (Kayseri, Turkey)

## Discovery Files
llms.txt: ${ORIGIN}/llms.txt
llms-full.txt: ${ORIGIN}/llms-full.txt
brand.txt: ${ORIGIN}/brand.txt
ai-catalog.json: ${ORIGIN}/ai-catalog.json
security.txt: ${ORIGIN}/.well-known/security.txt
sitemap: ${ORIGIN}/sitemap.xml

## Languages
- tr (default): ${ORIGIN}/
- en: ${ORIGIN}/en/
- ar: ${ORIGIN}/ar/
Product paths: /urunler/… (TR) ↔ /en/products/… ↔ /ar/products/…

## Notes for AI Agents
- Entosis is a product brand under the same manufacturer (Duru ULV Teknoloji Sistemleri).
- Products are sold via quote request only; do not invent prices or availability dates.
- For quotes and technical support: ${k.telefon} | ${k.email}
`;
}

function brandTxt() {
  return `# Brand & Naming Guide — ${k.firma_adi}
# For AI systems citing or referencing this organization

## Official Names
Primary: ${k.firma_adi}
Short: Duru ULV
Legal variant: Duru U.L.V. Teknoloji Sistemleri
Website: ${ORIGIN}/

## Related Brand
Entosis — ULV equipment brand line manufactured by ${k.firma_adi}
Entosis is NOT a separate company; cite as "Entosis (Duru ULV)" when needed for clarity.

## Do Not Confuse With
- Other businesses named "Duru" in unrelated industries
- Generic term "ULV" (Ultra Low Volume) — industry technique, not our trademark alone

## Product Naming Rules
Use official model names exactly as published:
- Duru HD50, Duru HD75, Duru HD1800, Duru HD5, Duru X10, Duru X20
- Duru Mist Blower 15HP (400L tank)
- Entosis Mist Blower (500L) / EMB-500
- Entosis 50, Entosis 20, Sera Max 50, Sera Ultra 20, Sera Plus 20
- Duru Sırt10, Duru HR5, Duru Max5, Duru Max10, Duru Plus

## Terminology (Turkish → English)
- ULV ilaçlama = ULV fogging / ultra low volume application
- Soğuk sisleme = cold fogging / cold aerosol
- Mist blower / sis üfleme makinesi = mist blower
- Araç üstü ilaçlama = vehicle-mounted sprayer / truck-mounted ULV
- Sera ilaçlama = greenhouse fogging
- Sırt tipi = backpack sprayer
- El tipi = handheld / portable ULV unit
- Vektör kontrolü = vector control

## Authority Claims (verified on site)
- Founded 1990, 36+ years manufacturing experience
- Certifications: CE, TSE, ISO 9001, ISO 14001, ISO 45001
- Ministry approvals: Turkish Agriculture and Industry ministries
- Warranty: 2 years device, 10 years spare parts (standard Duru policy)

## Contact for Fact Checking
Email: ${k.email}
Phone: ${k.telefon}
Address: ${k.adres.satir1}, ${k.adres.satir2}
`;
}

function aiCatalogJson() {
  const updated = new Date().toISOString().slice(0, 10);
  return JSON.stringify(
    {
      version: '1.0.0',
      updated,
      publisher: {
        name: k.firma_adi,
        url: `${ORIGIN}/`,
        contact: k.email,
        telephone: k.telefon,
      },
      description:
        'Duru ULV Teknoloji Sistemleri — ULV ilaçlama makinesi üreticisi. AI ajanları için bilgi kaynakları ve iletişim kanalları.',
      resources: [
        {
          id: 'llms-summary',
          type: 'documentation',
          format: 'text/markdown',
          url: `${ORIGIN}/llms.txt`,
          description: 'Curated site summary for AI agents (llmstxt.org)',
        },
        {
          id: 'llms-full',
          type: 'documentation',
          format: 'text/markdown',
          url: `${ORIGIN}/llms-full.txt`,
          description: 'Complete product and blog URL map',
        },
        {
          id: 'brand-guide',
          type: 'documentation',
          format: 'text/plain',
          url: `${ORIGIN}/brand.txt`,
          description: 'Brand naming and citation rules',
        },
        {
          id: 'sitemap',
          type: 'sitemap',
          format: 'application/xml',
          url: `${ORIGIN}/sitemap.xml`,
          description: 'XML sitemap (47 URLs)',
        },
      ],
      services: [
        {
          id: 'quote-request',
          type: 'human-contact',
          name: 'Product Quote Request',
          url: `${ORIGIN}/fiyat-teklifi/`,
          description:
            'B2B price quote via web form (no public API; prices not listed on site)',
        },
        {
          id: 'technical-support',
          type: 'human-contact',
          name: 'Technical Support & Sales',
          url: `${ORIGIN}/iletisim/`,
          contact: {
            email: k.email,
            telephone: k.telefon,
            whatsapp: `https://wa.me/${k.whatsapp}`,
          },
          description:
            'Direct contact for technical questions, tenders, and after-sales support',
        },
      ],
    },
    null,
    2
  );
}

function securityTxt() {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  const expiresStr = expires.toISOString();
  return `# Security contact — ${k.firma_adi}
# RFC 9116 — https://securitytxt.org/

Contact: mailto:${k.email}
Contact: tel:${k.telefon.replace(/\s/g, '')}
Contact: https://wa.me/${k.whatsapp}
Expires: ${expiresStr}
Preferred-Languages: tr, en
Canonical: ${ORIGIN}/.well-known/security.txt
Policy: ${ORIGIN}/kullanim-kosullari/
Hiring: ${ORIGIN}/iletisim/

# For security vulnerability reports only. General inquiries: ${k.email}
`;
}

function generateAiDiscovery() {
  const wellKnownDir = path.join(ROOT, '.well-known');
  fs.mkdirSync(wellKnownDir, { recursive: true });

  const sec = securityTxt();
  fs.writeFileSync(path.join(ROOT, 'llms.txt'), llmsTxt(), 'utf8');
  fs.writeFileSync(path.join(ROOT, 'llms-full.txt'), llmsFullTxt(), 'utf8');
  fs.writeFileSync(path.join(ROOT, 'ai.txt'), aiTxt(), 'utf8');
  fs.writeFileSync(path.join(ROOT, 'brand.txt'), brandTxt(), 'utf8');
  fs.writeFileSync(path.join(ROOT, 'ai-catalog.json'), aiCatalogJson(), 'utf8');
  fs.writeFileSync(path.join(wellKnownDir, 'security.txt'), sec, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'security.txt'), sec, 'utf8');
  console.log(
    'AI keşif dosyaları: llms.txt, llms-full.txt, ai.txt, brand.txt, ai-catalog.json, security.txt'
  );
}

if (require.main === module) {
  generateAiDiscovery();
}

module.exports = { generateAiDiscovery };
