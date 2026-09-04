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
    galleryImage: 'Görsel',
    ogLocale: 'tr_TR',
  },
  en: {
    home: 'Home',
    products: 'Products',
    view: 'View',
    compare: 'Compare',
    quote: 'Get a Quote',
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
    galleryImage: 'Image',
    ogLocale: 'en_US',
  },
  ar: {
    home: 'الرئيسية',
    products: 'المنتجات',
    view: 'عرض',
    compare: 'مقارنة',
    quote: 'اطلب عرض سعر',
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
    galleryImage: 'صورة',
    ogLocale: 'ar_AR',
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
