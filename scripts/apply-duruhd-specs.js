/**
 * duruhd.com kaynaklı spec düzeltmeleri + nemlendirme/termal kategorileri.
 * Kullanım: node scripts/apply-duruhd-specs.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'assets/data/urunler.json');
const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));

const SPEC_BY_SLUG = {
  'duru-hd50': {
    kisa_aciklama_tr: '50 L tank, 3.5–5 kW 220V, araç üzeri kompakt ULV',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '3.5–5 kW, 220V 50Hz' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '50 litre' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'İlaç Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
      { ozellik: 'Püskürtme', deger: 'ULV' },
    ],
  },
  'duru-hd75': {
    kisa_aciklama_tr: '100 L tank, 10 kW 220V, araç üzeri ULV',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '10 kW, 220V 50Hz' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '100 litre (50 × 2)' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'İlaç Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
      { ozellik: 'Kumanda', deger: 'ULV motor, ilaç ve yanar döner lamba aç/kapa' },
      { ozellik: 'Ağırlık', deger: '85 kg' },
      { ozellik: 'Ölçüler', deger: 'En: 70 cm, Boy: 120 cm, Yükseklik: 110 cm' },
    ],
  },
  'duru-hd1800': {
    kisa_aciklama_tr: '100 L tank, 18 hp, araç üzeri ULV',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '18 hp benzinli' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '100 litre' },
      { ozellik: 'Püskürtme', deger: 'ULV' },
      { ozellik: 'ULV Mikron', deger: '0–49' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
    ],
  },
  'sera-max-50': {
    kisa_aciklama_tr: '100 L tank (25×4), 8800 W, 4 başlıklı fanlı sera ULV',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '2200 W × 4 = 8800 W, 220V AC' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '25 × 4 = 100 litre' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'İlaç Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
      { ozellik: 'Başlık', deger: '4 adet ULV başlık' },
      { ozellik: 'Fan', deger: '4 × 30 cm (120 cm toplam)' },
      { ozellik: 'Ağırlık', deger: '85 kg' },
      { ozellik: 'Ölçüler', deger: 'En: 84 cm, Boy: 126 cm, Yükseklik: 150 cm' },
    ],
  },
  'sera-ultra-20': {
    kisa_aciklama_tr: '48 L tank, ~4000 W, fanlı sera ULV',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '2000 W × 2 = 4000 W, 220V AC' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '48 litre' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'İlaç Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
      { ozellik: 'Başlık', deger: '2 adet ULV başlık' },
      { ozellik: 'Ağırlık', deger: '57 kg' },
      { ozellik: 'Ölçüler', deger: 'En: 84 cm, Boy: 110 cm, Yükseklik: 150 cm' },
    ],
  },
  'entosis-20': {
    kisa_aciklama_tr: '20 L tank, 4400 W, 2 başlıklı fanlı sera ULV',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '2200 W × 2 = 4400 W, 220V 50Hz' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '20 litre' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'İlaç Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
      { ozellik: 'Ağırlık', deger: '17 kg' },
      { ozellik: 'Ölçüler', deger: 'En: 52 cm, Boy: 70 cm, Yükseklik: 70 cm' },
    ],
  },
  'sera-plus-20': {
    kisa_aciklama_tr: '20 L tank, 2800 W, sera ULV',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '2800 W, 220V 50Hz' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '20 litre' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'İlaç Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
    ],
  },
  'entosis-50': {
    kisa_aciklama_tr: '50 L tank, 4400 W, fanlı sera ULV',
    teknik_tablo: [
      { ozellik: 'U.L.V Motor', deger: '2200 W × 2 = 4400 W, 220V AC' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '50 litre' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
      { ozellik: 'Kapasite', deger: 'Maksimum 6–7 dönüm' },
    ],
  },
  'duru-sirt10': {
    ad_tr: 'Duru SRT 10',
    model_kodu: 'SRT-10',
    kisa_aciklama_tr: '10 L tank, 2200 W elektrik, sırt tipi ULV',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '2200 W, 220V AC' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '10 litre' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'Damla Çapı', deger: '9–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
      { ozellik: 'Ağırlık (boş)', deger: '8 kg' },
      { ozellik: 'Ölçüler', deger: '40 × 50 × 48 cm' },
    ],
  },
  'duru-hd5': {
    kisa_aciklama_tr: '5 L tank, 2200 W, el tipi ULV',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '2200 W, 220V AC 50Hz' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '5 litre' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'İlaç Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
      { ozellik: 'Ağırlık', deger: '4.2 kg' },
      { ozellik: 'Ölçüler', deger: 'En: 20 cm, Boy: 45 cm, Yükseklik: 45 cm' },
    ],
  },
  'duru-hr5': {
    kisa_aciklama_tr: '5 L tank, 2200 W, hortumlu el tipi ULV',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '2200 W, 220V AC 50Hz' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '5 litre' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'İlaç Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
      { ozellik: 'Özellik', deger: 'Hortumlu el tipi' },
    ],
  },
  'duru-max5': {
    kisa_aciklama_tr: '5 L tank, 2200 W, oynar başlıklı el tipi ULV',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '2200 W, 220V AC 50Hz' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '5 litre' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'İlaç Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
      { ozellik: 'Ağırlık', deger: '5.2 kg' },
      { ozellik: 'Ölçüler', deger: 'En: 20 cm, Boy: 45 cm, Yükseklik: 57 cm' },
      { ozellik: 'Başlık', deger: 'Yukarı–aşağı oynar başlık' },
    ],
  },
  'duru-plus': {
    ad_tr: 'Duru Plus 3"',
    model_kodu: 'PLUS-3"',
    kisa_aciklama_tr: '3 L tank, 1300 W, 3 inch mini el tipi ULV',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '1300 W, 220V AC' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '3 litre' },
      { ozellik: 'Başlık / Nozul', deger: '3 inch (3")' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'İlaç Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
    ],
  },
  'duru-x20': {
    kisa_aciklama_tr: '20 L tank, 4000 W, oynar başlıklı el tipi ULV',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '2000 W × 2 = 4000 W, 220V AC 50Hz' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '20 litre' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'İlaç Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
      { ozellik: 'Ağırlık', deger: '12 kg' },
      { ozellik: 'Ölçüler', deger: '46 × 60 × 68 cm' },
      { ozellik: 'Başlık', deger: '2 adet oynar başlık' },
    ],
  },
  'duru-max10': {
    kisa_aciklama_tr: '10 L tank, 2200 W, oynar başlıklı el tipi ULV',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '2200 W, 220V AC 50Hz' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '10 litre' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'İlaç Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
      { ozellik: 'Ağırlık', deger: '6.7 kg' },
      { ozellik: 'Ölçüler', deger: 'En: 34 cm, Boy: 50 cm, Yükseklik: 60 cm' },
      { ozellik: 'Başlık', deger: 'Oynar başlık' },
    ],
  },
  'duru-x10': {
    // Kalacak — kaynakta ayrı X10 kartı yok; 10 L el tipi çizgisinde tutulur
    kisa_aciklama_tr: '10 L tank, 2200 W, el tipi ULV',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '2200 W, 220V AC' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '10 litre' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
    ],
  },
};

const NEW_CATEGORIES = [
  {
    slug: 'nemlendirme-ulv',
    ad_tr: 'Nemlendirme ULV Makineleri',
    kisa_ad: 'Nemlendirme',
    aciklama_tr:
      'Mantarhane, sera ve depo ortamları için şamandıralı ULV nemlendirme sistemleri. Higrostatlı ve döner başlıklı modeller.',
    ikon: 'droplets',
  },
  {
    slug: 'termal-sisleme',
    ad_tr: 'Termal Sisleme & Don Önleyici',
    kisa_ad: 'Termal',
    aciklama_tr:
      'Kanalizasyon, açık alan ve don önleme için termal sıcak sisleme makineleri. Briggs motorlu ve el tipi modeller.',
    ikon: 'flame',
  },
];

const NEW_PRODUCTS = [
  {
    slug: 'duru-dmxl',
    kategori_slug: 'nemlendirme-ulv',
    ad_tr: 'Duru DMXL',
    model_kodu: 'DMXL',
    kisa_aciklama_tr: 'Döner başlıklı ULV nemlendirme, şamandıralı tank',
    gorsel: 'assets/img/products/duru-dmxl-01.jpg',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '2200 W, 220V AC 50Hz' },
      { ozellik: 'Tank', deger: 'Şamandıralı – sınırsız (şebeke bağlantılı)' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'İlaç Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
      { ozellik: 'Başlık', deger: 'Döner başlık' },
      { ozellik: 'Ağırlık', deger: '5.2 kg' },
      { ozellik: 'Ölçüler', deger: 'En: 20 cm, Boy: 45 cm, Yükseklik: 57 cm' },
    ],
  },
  {
    slug: 'duru-mxl',
    kategori_slug: 'nemlendirme-ulv',
    ad_tr: 'Duru MXL',
    model_kodu: 'MXL',
    kisa_aciklama_tr: 'ULV nemlendirme, 1300 W, şamandıralı tank',
    gorsel: 'assets/img/products/duru-mxl-01.jpg',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '1300 W, 220V AC' },
      { ozellik: 'Tank', deger: 'Şamandıralı – sınırsız (şebeke bağlantılı)' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'İlaç Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
    ],
  },
  {
    slug: 'duru-mxl-hgs',
    kategori_slug: 'nemlendirme-ulv',
    ad_tr: 'Duru MXL-HGS',
    model_kodu: 'MXL-HGS',
    kisa_aciklama_tr: 'Higrostatlı ULV nemlendirme, 1300 W, şamandıralı',
    gorsel: 'assets/img/products/duru-mxl-hgs-01.jpg',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '1300 W, 220V AC' },
      { ozellik: 'Tank', deger: 'Şamandıralı – sınırsız (şebeke bağlantılı)' },
      { ozellik: 'Kontrol', deger: 'Higrostatlı nem kontrolü' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '0–49 l/h' },
      { ozellik: 'İlaç Damla Çapı', deger: '0–49 mikron' },
      { ozellik: 'Solüsyon Tipleri', deger: 'sc, ec, wp' },
    ],
  },
  {
    slug: 'duru-k100',
    kategori_slug: 'termal-sisleme',
    ad_tr: 'Duru K 100',
    model_kodu: 'K-100',
    kisa_aciklama_tr: '15 hp Briggs, 20 L, termal kanalizasyon / don önleyici',
    gorsel: 'assets/img/products/duru-k100-01.jpg',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '15 hp benzinli Briggs' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '20 litre' },
      { ozellik: 'İlaç Çıkış Debisi', deger: '15 bar' },
      { ozellik: 'Püskürtme Hortumu', deger: '2.30 m esnek metal kanal aparatı' },
      { ozellik: 'Yakıt Tüketimi (motor)', deger: '0,75–1 L/saat' },
      { ozellik: 'İlaç Yakıt Tüketimi', deger: '10–20 L/saat (ayarlanabilir)' },
      { ozellik: 'Damla Çapı', deger: '~20 mikron (termal)' },
      { ozellik: 'Teker', deger: '2 frenli + 2 düz teker' },
    ],
  },
  {
    slug: 'termal-el-tipi',
    kategori_slug: 'termal-sisleme',
    ad_tr: 'Termal El Tipi',
    model_kodu: 'TERMAL-EL',
    kisa_aciklama_tr: '32/38 hp, 16 L (8×2), termal el tipi / kanal / don önleme',
    gorsel: 'assets/img/products/termal-el-tipi-01.jpg',
    teknik_tablo: [
      { ozellik: 'Motor', deger: '32 / 38 hp' },
      { ozellik: 'İlaç Tank Kapasitesi', deger: '8 × 2 = 16 litre' },
      { ozellik: 'Uygulama', deger: 'Termal sisleme, kanal ilaçlama, don önleme' },
      { ozellik: 'Damla Çapı', deger: '~20 mikron (termal)' },
    ],
  },
];

// Kategoriler
for (const cat of NEW_CATEGORIES) {
  if (!data.kategoriler.some((c) => c.slug === cat.slug)) {
    data.kategoriler.push(cat);
  }
}

// Mevcut ürün patch
let patched = 0;
for (const p of data.urunler) {
  const patch = SPEC_BY_SLUG[p.slug];
  if (!patch) continue;
  Object.assign(p, patch);
  patched++;
}

// Yeni ürünler
let added = 0;
for (const np of NEW_PRODUCTS) {
  if (!data.urunler.some((u) => u.slug === np.slug)) {
    data.urunler.push(np);
    added++;
  }
}

fs.writeFileSync(DATA, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Patched ${patched} products, added ${added} products, categories: ${data.kategoriler.length}`);
console.log(`Total products: ${data.urunler.length}`);
