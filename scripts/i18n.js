/**
 * Çok dil (tr/en/ar) yardımcısı — sayfa üretimi yolları, UI metinleri, head attrs.
 */
const path = require('path');

const UI = {
  tr: {
    home: 'Anasayfa',
    products: 'Ürünler',
    view: 'İncele',
    compare: 'Karşılaştır',
    quote: 'Teklif Al',
    quoteArrow: 'Teklif Al →',
    catalogEyebrow: 'Ürün Kataloğu',
    categories: 'Kategoriler',
    allModels: 'Tüm modeller',
    productsLead:
      'Belediye, kamu, tarım ve sanayi uygulamaları için profesyonel ULV ilaçlama makineleri. Fiyat yerine teklif alın — karşılaştırma yapın.',
    brandSuffix: 'Duru ULV',
    modelUnit: 'model',
    categoryUnit: 'kategori',
    related: 'İlgili ürünler',
    specs: 'Teknik özellikler',
    specsEyebrow: 'Teknik Özellikler',
    specsHeadingSuffix: 'teknik tablo',
    galleryImage: 'Görsel',
    ogLocale: 'tr_TR',
    modelLabel: 'Model',
    requestEyebrow: 'Talep edin',
    requestTitle: 'Özel teklif & teknik bilgi',
    sameDayNote: 'Aynı iş günü dönüş',
    whatsappCta: 'veya WhatsApp ile hızlıca yazın',
    whyModel: 'Neden bu model',
    productDetails: 'Detaylı açıklama',
    usageAreas: 'Kullanım Alanları',
    wherePreferred: 'Bu model nerede tercih ediliyor?',
    faqEyebrow: 'Sıkça Sorulan Sorular',
    faqHeading: 'Hızlı yanıtlar',
    detailP1Suffix:
      'Duru ULV mühendislik birikimiyle tasarlanmış, sahada kanıtlanmış profesyonel bir modeldir.',
    detailP2:
      'Teknik detaylar ve özel teklif için formu doldurabilir veya doğrudan ekibimizle iletişime geçebilirsiniz.',
    usageLabels: {
      belediye: 'Belediye',
      hastane: 'Hastane',
      sera: 'Sera',
      fabrika: 'Fabrika',
      askeriye: 'Askeriye',
      ciftlik: 'Çiftlik',
    },
    faqsFallback: [
      {
        q: 'ULV nedir, Pulverizatörden farkı nedir?',
        a: 'ULV (Ultra Low Volume), çok düşük hacimde ilacın 0–50 mikron arası damlalara parçalanarak havaya dağıtılması esasına dayanır. Klasik pulverizatöre göre çok daha az ilaçla, çok daha geniş bir alanı kaplar.',
      },
      {
        q: 'Hangi solüsyonlarla uyumludur?',
        a: 'sc, ec ve wp formülasyonlu profesyonel pestisit ve dezenfektanlarla uyumludur.',
      },
      {
        q: 'Garanti süresi ve servis ağı nasıl?',
        a: 'Tüm makineler fabrikadan 2 yıl garantili çıkar. Türkiye genelinde yetkili servis ağımız mevcuttur.',
      },
      {
        q: 'İhalelerde teknik şartname desteği veriyor musunuz?',
        a: 'Evet, kamu ihalelerinde teknik şartname yazımına destek sağlıyoruz. İletişim formundan veya WhatsApp üzerinden ulaşmanız yeterlidir.',
      },
    ],
  },
  en: {
    home: 'Home',
    products: 'Products',
    view: 'View',
    compare: 'Compare',
    quote: 'Request a Quote',
    quoteArrow: 'Request Quote →',
    catalogEyebrow: 'Product Catalog',
    categories: 'Categories',
    allModels: 'All models',
    productsLead:
      'Professional ULV spraying machines for municipalities, public agencies, agriculture, and industry. Request a quote — compare models.',
    brandSuffix: 'Duru ULV',
    modelUnit: 'models',
    categoryUnit: 'categories',
    related: 'Related products',
    specs: 'Technical specifications',
    specsEyebrow: 'Technical Specifications',
    specsHeadingSuffix: 'specifications',
    galleryImage: 'Image',
    ogLocale: 'en_US',
    modelLabel: 'Model',
    requestEyebrow: 'Request a Quote',
    requestTitle: 'Get a custom quote & technical info',
    sameDayNote: 'Same business day response',
    whatsappCta: 'or message us on WhatsApp',
    whyModel: 'Why this model',
    productDetails: 'Product Details',
    usageAreas: 'Applications',
    wherePreferred: 'Where is this model preferred?',
    faqEyebrow: 'FAQ',
    faqHeading: 'FAQ',
    detailP1Suffix:
      'Engineered with Duru ULV expertise and proven in the field as a professional model.',
    detailP2:
      'For technical details and a custom quote, fill out the form or contact our team directly.',
    usageLabels: {
      belediye: 'Municipal',
      hastane: 'Hospital',
      sera: 'Greenhouse',
      fabrika: 'Factory',
      askeriye: 'Military',
      ciftlik: 'Farm',
    },
    faqsFallback: [
      {
        q: 'What is ULV and how does it differ from a conventional sprayer?',
        a: 'ULV (Ultra Low Volume) atomizes pesticide into 0–50 micron droplets at very low volume. Compared with conventional sprayers, it covers a much larger area with far less chemical.',
      },
      {
        q: 'Which formulations is it compatible with?',
        a: 'Compatible with professional SC, EC, and WP pesticide and disinfectant formulations.',
      },
      {
        q: 'What are the warranty and service network terms?',
        a: 'All machines ship with a 2-year factory warranty. An authorized service network is available across Turkey.',
      },
      {
        q: 'Do you support tender technical specifications?',
        a: 'Yes — we support public tender specification writing. Contact us via the form or WhatsApp.',
      },
    ],
  },
  ar: {
    home: 'الرئيسية',
    products: 'المنتجات',
    view: 'عرض',
    compare: 'قارن',
    quote: 'طلب عرض سعر',
    quoteArrow: 'طلب عرض →',
    catalogEyebrow: 'كتالوج المنتجات',
    categories: 'الفئات',
    allModels: 'جميع الموديلات',
    productsLead:
      'أجهزة رش ULV احترافية للبلديات والجهات العامة والزراعة والصناعة. اطلب عرض سعر — وقارن الموديلات.',
    brandSuffix: 'Duru ULV',
    modelUnit: 'موديل',
    categoryUnit: 'فئة',
    related: 'منتجات ذات صلة',
    specs: 'المواصفات الفنية',
    specsEyebrow: 'المواصفات الفنية',
    specsHeadingSuffix: 'المواصفات',
    galleryImage: 'صورة',
    ogLocale: 'ar_AR',
    modelLabel: 'الطراز',
    requestEyebrow: 'طلب عرض سعر',
    requestTitle: 'احصل على عرض سعر وبيانات فنية',
    sameDayNote: 'رد في نفس يوم العمل',
    whatsappCta: 'أو تواصل معنا عبر واتساب',
    whyModel: 'لماذا هذا الطراز',
    productDetails: 'تفاصيل المنتج',
    usageAreas: 'مجالات الاستخدام',
    wherePreferred: 'أين يُستخدم هذا الطراز؟',
    faqEyebrow: 'الأسئلة الشائعة',
    faqHeading: 'الأسئلة الشائعة',
    detailP1Suffix:
      'مصمَّم بخبرة Duru ULV ومُثبت ميدانيًا كنموذج احترافي.',
    detailP2:
      'للحصول على التفاصيل الفنية وعرض سعر مخصص، عبّئ النموذج أو تواصل مباشرة مع فريقنا.',
    usageLabels: {
      belediye: 'البلديات',
      hastane: 'المستشفيات',
      sera: 'البيوت المحمية',
      fabrika: 'المصانع',
      askeriye: 'العسكرية',
      ciftlik: 'المزارع',
    },
    faqsFallback: [
      {
        q: 'ما هو ULV وما الفرق عن الرش التقليدي؟',
        a: 'ULV (الحجم المنخفض للغاية) يفتّت المبيد إلى قطرات 0–50 ميكرون بحجم منخفض جدًا، فيغطي مساحة أكبر بكثير بكمية أقل من المادة مقارنة بالرش التقليدي.',
      },
      {
        q: 'مع أي تركيبات يتوافق الجهاز؟',
        a: 'متوافق مع تركيبات SC وEC وWP للمبيدات ومطهرات التعقيم المهنية.',
      },
      {
        q: 'ما مدة الضمان وشبكة الخدمة؟',
        a: 'تخرج جميع الأجهزة بضمان مصنعي لمدة سنتين، مع شبكة خدمة معتمدة في تركيا.',
      },
      {
        q: 'هل تقدمون دعم المواصفات الفنية للمناقصات؟',
        a: 'نعم، ندعم كتابة المواصفات الفنية لمناقصات البلديات والجهات العامة. تواصل عبر النموذج أو واتساب.',
      },
    ],
  },
};

function catalogFileName(locale) {
  if (locale === 'en') return 'urunler.en.json';
  if (locale === 'ar') return 'urunler.ar.json';
  return 'urunler.json';
}

function localePaths(locale) {
  const ui = UI[locale] || UI.tr;
  if (locale === 'tr') {
    return {
      locale: 'tr',
      lang: 'tr',
      htmlLangAttrs: 'lang="tr"',
      ui,
      catalogFile: catalogFileName('tr'),
      homeHref: (prefix) => `${prefix}index.html`,
      productsHref: (prefix) => `${prefix}urunler/index.html`,
      quoteHref: (prefix) => `${prefix}fiyat-teklifi/index.html`,
      compareHref: (prefix) => `${prefix}urun-karsilastirma/index.html`,
      productFile: (p) => path.join('urunler', p.kategori_slug, p.slug, 'index.html'),
      productPrefix: '../../../',
      productHrefFromCategory: (p) => `${p.slug}/index.html`,
      productHrefFromIndex: (p) => `${p.kategori_slug}/${p.slug}/index.html`,
      productHrefRelated: (p) => `../${p.slug}/index.html`,
      categoryFile: (c) => path.join('urunler', c.slug, 'index.html'),
      categoryPrefix: '../../',
      categoryHrefFromProduct: () => '../index.html',
      productsIndexFile: path.join('urunler', 'index.html'),
      productsIndexPrefix: '../',
      productsIndexHrefFromProduct: () => '../../index.html',
      trProductRel: (p) => `urunler/${p.kategori_slug}/${p.slug}/index.html`,
      trCategoryRel: (c) => `urunler/${c.slug}/index.html`,
      trProductsIndexRel: 'urunler/index.html',
      canonicalProduct: (p) => `urunler/${p.kategori_slug}/${p.slug}/index.html`,
      canonicalCategory: (c) => `urunler/${c.slug}/index.html`,
      canonicalProductsIndex: 'urunler/index.html',
      extraStylesheets: [],
    };
  }

  return {
    locale,
    lang: locale,
    htmlLangAttrs: locale === 'ar' ? 'lang="ar" dir="rtl"' : `lang="${locale}"`,
    ui,
    catalogFile: catalogFileName(locale),
    homeHref: (prefix) => `${prefix}index.html`,
    productsHref: (prefix) => `${prefix}${locale}/products/index.html`,
    quoteHref: (prefix) => `${prefix}${locale}/fiyat-teklifi/index.html`,
    compareHref: (prefix) => `${prefix}${locale}/urun-karsilastirma/index.html`,
    productFile: (p) => path.join(locale, 'products', p.slug, 'index.html'),
    productPrefix: '../../',
    productHrefFromCategory: (p) => `../${p.slug}/index.html`,
    productHrefFromIndex: (p) => `${p.slug}/index.html`,
    productHrefRelated: (p) => `../${p.slug}/index.html`,
    categoryFile: (c) => path.join(locale, 'products', c.slug, 'index.html'),
    categoryPrefix: '../../',
    categoryHrefFromProduct: (c) => `../${c.slug}/index.html`,
    productsIndexFile: path.join(locale, 'products', 'index.html'),
    productsIndexPrefix: '../../',
    productsIndexHrefFromProduct: () => '../index.html',
    trProductRel: (p) => `urunler/${p.kategori_slug}/${p.slug}/index.html`,
    trCategoryRel: (c) => `urunler/${c.slug}/index.html`,
    trProductsIndexRel: 'urunler/index.html',
    canonicalProduct: (p) => `${locale}/products/${p.slug}/index.html`,
    canonicalCategory: (c) => `${locale}/products/${c.slug}/index.html`,
    canonicalProductsIndex: `${locale}/products/index.html`,
    extraStylesheets: locale === 'ar' ? ['assets/css/rtl.css'] : [],
  };
}

module.exports = { UI, catalogFileName, localePaths };
