/**
 * AI ajan keşif dosyaları: llms.txt, llms-full.txt, ai.txt, brand.txt
 * Kullanım: node scripts/generate-ai-discovery.js
 * (generate-sitemap.js tarafından da otomatik çağrılır)
 */
const fs = require('fs');
const path = require('path');
const { SITE_ORIGIN } = require('./seo-meta');

const ROOT = path.join(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/urunler.json'), 'utf8'));
const productSeo = fs.existsSync(path.join(ROOT, 'assets/data/product-seo.json'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/product-seo.json'), 'utf8'))
  : {};
const blogPosts = fs.existsSync(path.join(ROOT, 'assets/data/blog-posts.json'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/blog-posts.json'), 'utf8'))
  : [];

const k = catalog.kurumsal_bilgiler;
const ORIGIN = SITE_ORIGIN;

function url(rel) {
  const p = rel.replace(/^\//, '').replace(/index\.html$/, '');
  return p.endsWith('/') || !p ? `${ORIGIN}/${p}` : `${ORIGIN}/${p}/`;
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

  const blogLines = blogPosts.slice(0, 8).map((b) => {
    const desc = (b.meta && b.meta.metaDescription) || b.title;
    return `- [${b.title}](${url(`blog/${b.slug}/`)}): ${desc}`;
  });

  const catLines = Object.values(byCat).map(({ cat, products }) => {
    const links = products
      .map((p) => `[${p.ad_tr}](${url(`urunler/${p.kategori_slug}/${p.slug}/`)})`)
      .join(', ');
    return `- **${cat.ad_tr}** (${url(`urunler/${cat.slug}/`)}): ${cat.aciklama_tr} Modeller: ${links}`;
  });

  const featuredLines = featuredProducts.map((p) => {
    const seo = productSeo[p.slug];
    const desc = (seo && seo.meta && seo.meta.metaDescription) || p.kisa_aciklama_tr;
    return `- [${p.ad_tr}](${url(`urunler/${p.kategori_slug}/${p.slug}/`)}): ${desc}`;
  });

  return `# ${k.firma_adi}

> Türkiye'nin 36 yıllık ULV (Ultra Low Volume) ilaçlama makinesi üreticisi. Belediye, tarım, sağlık ve endüstriyel vektör kontrolü için araç üstü, sera, sırt ve el tipi cihazlar.

${k.firma_adi}, 1990'dan bu yana Kayseri'de ULV ilaçlama ekipmanları tasarlar ve üretir. **Entosis** markası aynı firmaya aittir. Ürünler CE, TSE ve ISO sertifikalıdır. Sitede fiyat gösterilmez; satış teklif formu veya doğrudan iletişimle yapılır.

## Kurumsal
- [Ana Sayfa](${url('')}): ULV ilaçlama makineleri ve mist blower ürün gamı
- [Hakkımızda](${url('hakkimizda/')}): 36 yıllık üretim tecrübesi, sertifikalar
- [Kalite Politikamız](${url('kalite-politikamiz/')}): CE, TSE, ISO 9001/14001/45001
- [İletişim](${url('iletisim/')}): ${k.telefon}, ${k.email}
- [Fiyat Teklifi](${url('fiyat-teklifi/')}): Kurumsal teklif talep formu

## Ürün Kategorileri
${catLines.join('\n')}

## Öne Çıkan Ürünler
${featuredLines.join('\n')}

## Blog ve Rehber İçerikleri
${blogLines.join('\n')}
- [Tüm blog yazıları](${url('blog/')})

## Yasal ve Gizlilik
- [KVKK Aydınlatma Metni](${url('kvkk/')})
- [Gizlilik Politikası](${url('gizlilik-politikasi/')})
- [Kullanım Koşulları](${url('kullanim-kosullari/')})

## AI ve Teknik Kaynaklar
- [llms-full.txt](${ORIGIN}/llms-full.txt): Tüm ürün ve blog URL listesi (genişletilmiş harita)
- [ai.txt](${ORIGIN}/ai.txt): Yapay zeka kullanım ve atıf politikası
- [brand.txt](${ORIGIN}/brand.txt): Marka adlandırma ve doğru referans kuralları
- [ai-catalog.json](${ORIGIN}/ai-catalog.json): Agentic Resource Discovery — kaynak ve iletişim kataloğu
- [security.txt](${ORIGIN}/.well-known/security.txt): Güvenlik açığı bildirimi (RFC 9116)
- [sitemap.xml](${ORIGIN}/sitemap.xml): XML site haritası
- [robots.txt](${ORIGIN}/robots.txt): Tarama kuralları
`;
}

function llmsFullTxt() {
  const byCat = productsByCategory();
  const sections = [];

  sections.push(`# ${k.firma_adi} — Tam İçerik Haritası\n`);
  sections.push(`Bu dosya, AI ajanlarının sitedeki tüm önemli sayfaları bulması için genişletilmiş URL listesidir.\n`);
  sections.push(`Site kökü: ${ORIGIN}/\n`);

  sections.push('## Statik Sayfalar\n');
  [
    ['Ana Sayfa', ''],
    ['Ürünler', 'urunler/'],
    ['Blog', 'blog/'],
    ['Hakkımızda', 'hakkimizda/'],
    ['İletişim', 'iletisim/'],
    ['Fiyat Teklifi', 'fiyat-teklifi/'],
    ['Kalite Politikası', 'kalite-politikamiz/'],
    ['KVKK', 'kvkk/'],
    ['Gizlilik', 'gizlilik-politikasi/'],
    ['Kullanım Koşulları', 'kullanim-kosullari/'],
  ].forEach(([title, rel]) => {
    sections.push(`- [${title}](${url(rel)})`);
  });

  Object.values(byCat).forEach(({ cat, products }) => {
    sections.push(`\n## ${cat.ad_tr}\n`);
    sections.push(`Kategori: ${url(`urunler/${cat.slug}/`)}\n`);
    products.forEach((p) => {
      const seo = productSeo[p.slug];
      const desc = (seo && seo.meta && seo.meta.metaDescription) || p.kisa_aciklama_tr;
      const kw = seo && seo.meta && seo.meta.focusKeyword ? ` | Anahtar: ${seo.meta.focusKeyword}` : '';
      sections.push(`- [${p.ad_tr}](${url(`urunler/${p.kategori_slug}/${p.slug}/`)}) (${p.model_kodu}): ${desc}${kw}`);
    });
  });

  sections.push('\n## Blog Yazıları\n');
  blogPosts.forEach((b) => {
    const desc = (b.meta && b.meta.metaDescription) || '';
    sections.push(`- [${b.title}](${url(`blog/${b.slug}/`)}): ${desc}`);
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
