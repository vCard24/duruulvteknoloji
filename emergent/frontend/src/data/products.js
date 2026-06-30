// Duru ULV — full product catalog
// 17 products across 4 categories. Real names from the brand catalog.

const ASSET = {
  mist1: 'https://customer-assets.emergentagent.com/job_244aeb65-ccc6-4184-8b90-b6f4956db5db/artifacts/szo6afyq_duru-mist-blo.jpg',
  mist2: 'https://customer-assets.emergentagent.com/job_244aeb65-ccc6-4184-8b90-b6f4956db5db/artifacts/3rk873yh_duru-mist-blo2.jpg',
  mist4: 'https://customer-assets.emergentagent.com/job_244aeb65-ccc6-4184-8b90-b6f4956db5db/artifacts/jeyab48h_duru-mist-blo4.jpg',
  mist5: 'https://customer-assets.emergentagent.com/job_244aeb65-ccc6-4184-8b90-b6f4956db5db/artifacts/pa21dgkb_duru-mist-blo5.jpg',
  greenhouse: 'https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
  factory: 'https://images.unsplash.com/photo-1727870752423-4d51d5b500c7?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
  hospital: 'https://images.unsplash.com/photo-1777269749032-d8d458ae594d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
};

export const CATEGORIES = [
  {
    slug: 'arac-uzeri',
    name: 'Araç Üzeri ULV İlaçlama Makineleri',
    short: 'Araç Üzeri',
    description: 'Pick-up ve kamyonet üzerine monte edilen yüksek kapasiteli mist blower ve ULV pulverizatörler. Belediye, kamu ve büyük arazi uygulamaları için tasarlandı.',
    icon: 'Truck',
  },
  {
    slug: 'sera-tipi',
    name: 'Sera Tipi ULV İlaçlama Makineleri',
    short: 'Sera Tipi',
    description: 'Kapalı sera ortamlarında düşük damla çapı ile etkili ilaçlama yapan elektrikli ULV makineleri. Tarım işletmeleri ve çiçekçilik için.',
    icon: 'Flower2',
  },
  {
    slug: 'sirt-tipi',
    name: 'Sırt Tipi ULV İlaçlama Makineleri',
    short: 'Sırt Tipi',
    description: 'Operatörün sırtında taşıyabileceği, sahada hareket kabiliyeti yüksek profesyonel ULV cihazları.',
    icon: 'Backpack',
  },
  {
    slug: 'el-tipi',
    name: 'El Tipi ULV İlaçlama Makineleri',
    short: 'El Tipi',
    description: 'Hastane, otel, depo, fabrika gibi iç mekânlar için kompakt ve hafif el tipi ULV pulverizatörler.',
    icon: 'Wrench',
  },
];

// Helper to build a thumbnail set
const galleryFor = (mainKey) => {
  const all = [ASSET.mist1, ASSET.mist2, ASSET.mist4, ASSET.mist5];
  const main = ASSET[mainKey] || ASSET.mist1;
  const others = all.filter(u => u !== main).slice(0, 3);
  return [main, ...others];
};

export const PRODUCTS = [
  // ===== Araç Üzeri =====
  {
    slug: 'duru-mist-blower-15hp-400l',
    name: 'Duru Mist Blower 15HP (400L)',
    model: 'DMB-15HP-400',
    category: 'arac-uzeri',
    summary: '400 L tank, 15 HP motor, araç üzeri profesyonel mist blower',
    images: galleryFor('mist1'),
    specs: [
      ['Motor', '15 Hp Amerikan motor'],
      ['Batarya', '12 V DC – 60 Ah'],
      ['İlaç Tank Kapasitesi', '400 litre'],
      ['Püskürtme Sistemleri', 'Mist blower – ULV – Pulverizatör'],
      ['Holder Hortum', '30 metre'],
      ['Pompa', '14 litre / dakika, 150 bar'],
      ['ULV Mikron', '35'],
      ['Ağırlık', '340 kg'],
    ],
    description: '400 litre tank kapasitesi ile orta ölçekli belediye ve kamu uygulamalarına yönelik tasarlanmış mist blower modelidir. Mist, ULV ve pulverizatör modlarında çalışabilir.'
  },
  {
    slug: 'entosis-mist-blower-500l',
    name: 'Entosis Mist Blower (500L)',
    model: 'EMB-500',
    category: 'arac-uzeri',
    summary: '500 L tank, joystick kumanda, 6+1 nozul, 35 mikron ULV',
    images: galleryFor('mist2'),
    specs: [
      ['Motor', '15 Hp – 18 hp Amerikan motor'],
      ['Batarya', '12 v DC – 60 Ah'],
      ['MİST Başlık Hareketi', '340 derece sağa ve sola, 210 derece yukarı ve aşağı'],
      ['Kumanda', 'Joystick Hareketli'],
      ['İlaç Tank Kapasitesi', '500 litre'],
      ['İlaç Formülasyonu', 'sc – ec – wp'],
      ['Pompa', '14 litre / dakika, 150 bar'],
      ['Püskürtme Sistemleri', 'Mist blower – ULV – Pulverizatör'],
      ['Holder Hortum', '30 metre (isteğe bağlı 50 metre)'],
      ['Yakıt Deposu', '30 litre'],
      ['Nozul Sayısı', '6+1 adet'],
      ['Yakıt Tüketimi', '4 litre'],
      ['ULV Mikron', '35'],
      ['El Yıkama Tankı', '15 litre'],
      ['Ağırlık', '400 kg'],
      ['Ölçüler', 'En: 105 cm, Boy: 150 cm, Yükseklik: 170 cm'],
    ],
    description: 'Entosis Mist Blower (500L), büyük ölçekli belediye sivrisinek mücadelesi, fabrika çevresi dezenfeksiyonu ve geniş tarım arazileri için tasarlanmış araç üzeri profesyonel bir ULV pulverizatördür. Joystick kumandalı 340° dönebilen başlığı, 6+1 nozul yapısı ve mist/ULV/pulverizatör üçlü püskürtme sistemi ile sahada esneklik sağlar.\n\n500 litrelik ana ilaç tankı, 30 metre holder hortumu (opsiyonel 50 m) ve 15 litre el yıkama tankı operatörün uzun mesai sürelerinde kesintisiz çalışmasına imkân tanır. 12V DC – 60 Ah batarya altyapısı, 220V şebekeden bağımsız saha kullanımı için optimize edilmiştir.'
  },
  {
    slug: 'duru-hd1800',
    name: 'Duru HD1800',
    model: 'HD-1800',
    category: 'arac-uzeri',
    summary: 'Endüstriyel tip yüksek kapasiteli araç üzeri ULV',
    images: galleryFor('mist4'),
    specs: [
      ['Motor', 'Endüstriyel benzinli motor'],
      ['İlaç Tank Kapasitesi', '300 litre'],
      ['Püskürtme', 'ULV – Mist blower'],
      ['ULV Mikron', '15 – 50'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Ağırlık', '210 kg'],
    ],
    description: 'HD1800, büyük belediye filolarına ve kamu ihalelerine yönelik yüksek dayanım odaklı bir araç üzeri ULV modelidir.'
  },
  {
    slug: 'duru-hd75',
    name: 'Duru HD75',
    model: 'HD-75',
    category: 'arac-uzeri',
    summary: 'Orta ölçek belediye uygulamaları için araç üzeri ULV',
    images: galleryFor('mist5'),
    specs: [
      ['Motor', 'Benzinli motor'],
      ['İlaç Tank Kapasitesi', '200 litre'],
      ['Püskürtme', 'ULV – Mist'],
      ['ULV Mikron', '15 – 49'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Ağırlık', '180 kg'],
    ],
    description: 'HD75, ilçe belediyeleri ve orta ölçekli işletmeler için optimize edilmiş, taşınabilir araç üzeri bir modeldir.'
  },
  {
    slug: 'duru-hd50',
    name: 'Duru HD50',
    model: 'HD-50',
    category: 'arac-uzeri',
    summary: 'Kompakt araç üzeri ULV – küçük filo & saha uygulamaları',
    images: galleryFor('mist1'),
    specs: [
      ['Motor', 'Benzinli motor'],
      ['İlaç Tank Kapasitesi', '150 litre'],
      ['Püskürtme', 'ULV'],
      ['ULV Mikron', '15 – 49'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Ağırlık', '140 kg'],
    ],
    description: 'HD50, küçük araçlara monte edilebilen kompakt bir araç üzeri ULV cihazıdır.'
  },

  // ===== Sera Tipi =====
  {
    slug: 'entosis-50',
    name: 'Entosis 50',
    model: 'ENT-50',
    category: 'sera-tipi',
    summary: '50 L tank, 4400 W, 7 dönüm kapasite, 0–49 mikron',
    images: [ASSET.greenhouse, ASSET.mist2, ASSET.mist1, ASSET.mist4],
    specs: [
      ['U.L.V Motor', '2200 W × 2 = 4400 W, 220V AC'],
      ['İlaç Tank Kapasitesi', '50 litre'],
      ['İlaç Çıkış Debisi', '0–49 l/h'],
      ['Damla Çapı', '0–49 mikron'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Kapasite', 'Maksimum 7 dönüm'],
      ['Ölçüler', 'En: 70 cm, Boy: 100 cm, Yükseklik: 170 cm'],
    ],
    description: 'Entosis 50, profesyonel sera ve kapalı alan uygulamaları için tasarlanmış elektrikli bir ULV ilaçlama makinesidir. 4400 W çift motor mimarisi sayesinde 7 dönüme kadar kapalı alanda etkili ilaçlama yapabilir.\n\n0–49 mikron damla çapı ayarı ve 0–49 l/h çıkış debisi, sc/ec/wp formülasyonlu pestisit ve dezenfektanlarla esnek kullanım sağlar. Sera tesislerinde yerine sabit konuşlandırılıp zaman ayarlı çalışacak şekilde kurulabilir.'
  },
  {
    slug: 'sera-max-50',
    name: 'Sera Max 50',
    model: 'SMX-50',
    category: 'sera-tipi',
    summary: '50 L tank, sera için yüksek kapasiteli ULV',
    images: [ASSET.greenhouse, ASSET.mist4, ASSET.mist1, ASSET.mist5],
    specs: [
      ['Motor', '4400 W, 220V AC'],
      ['İlaç Tank Kapasitesi', '50 litre'],
      ['İlaç Çıkış Debisi', '0–49 l/h'],
      ['Damla Çapı', '0–49 mikron'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Kapasite', 'Maksimum 7 dönüm'],
    ],
    description: 'Sera Max 50, büyük seralarda kesintisiz ilaçlama yapmak için tasarlanmış yüksek kapasiteli bir ULV modelidir.'
  },
  {
    slug: 'sera-ultra-20',
    name: 'Sera Ultra 20',
    model: 'SULTRA-20',
    category: 'sera-tipi',
    summary: '20 L tank, orta ölçek sera, ULV elektrikli',
    images: [ASSET.greenhouse, ASSET.mist5, ASSET.mist2, ASSET.mist1],
    specs: [
      ['Motor', '2200 W, 220V AC'],
      ['İlaç Tank Kapasitesi', '20 litre'],
      ['İlaç Çıkış Debisi', '0–49 l/h'],
      ['Damla Çapı', '0–49 mikron'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Kapasite', 'Maksimum 3 dönüm'],
    ],
    description: 'Sera Ultra 20, küçük ve orta ölçekli seralar için kompakt bir ULV modelidir.'
  },
  {
    slug: 'entosis-20',
    name: 'Entosis 20',
    model: 'ENT-20',
    category: 'sera-tipi',
    summary: '20 L tank, 2200 W, kompakt sera ULV',
    images: [ASSET.greenhouse, ASSET.mist1, ASSET.mist2, ASSET.mist5],
    specs: [
      ['Motor', '2200 W, 220V AC'],
      ['İlaç Tank Kapasitesi', '20 litre'],
      ['İlaç Çıkış Debisi', '0–49 l/h'],
      ['Damla Çapı', '0–49 mikron'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Kapasite', 'Maksimum 3 dönüm'],
    ],
    description: 'Entosis 20, kompakt yapısı ile dar sera koridorlarında dahi rahat çalışmak için tasarlanmıştır.'
  },
  {
    slug: 'sera-plus-20',
    name: 'Sera Plus 20',
    model: 'SPL-20',
    category: 'sera-tipi',
    summary: '20 L tank, sera ULV, dayanıklı şasi',
    images: [ASSET.greenhouse, ASSET.mist4, ASSET.mist5, ASSET.mist2],
    specs: [
      ['Motor', '2200 W, 220V AC'],
      ['İlaç Tank Kapasitesi', '20 litre'],
      ['İlaç Çıkış Debisi', '0–49 l/h'],
      ['Damla Çapı', '0–49 mikron'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Kapasite', 'Maksimum 3 dönüm'],
    ],
    description: 'Sera Plus 20, güçlendirilmiş şasi ve sahada uzun ömürlü kullanım için tasarlanmış sera tipi ULV modelidir.'
  },

  // ===== Sırt Tipi =====
  {
    slug: 'duru-sirt-10',
    name: 'Duru Sırt10',
    model: 'SIRT-10',
    category: 'sirt-tipi',
    summary: '10 L tank, sırtta taşınabilir ULV, saha tipi',
    images: [ASSET.mist5, ASSET.mist1, ASSET.mist2, ASSET.mist4],
    specs: [
      ['Motor', 'Benzinli 2 zamanlı'],
      ['İlaç Tank Kapasitesi', '10 litre'],
      ['Yakıt Deposu', '1.5 litre'],
      ['Damla Çapı', '0–49 mikron'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Ağırlık (boş)', '8 kg'],
    ],
    description: 'Duru Sırt10, operatörün sırtında rahatça taşıyabileceği, sahada manevra kabiliyeti yüksek profesyonel bir ULV cihazıdır.'
  },

  // ===== El Tipi =====
  {
    slug: 'duru-hd5',
    name: 'Duru HD5',
    model: 'HD-5',
    category: 'el-tipi',
    summary: '5 L tank, el tipi ULV, hafif yapı',
    images: [ASSET.mist2, ASSET.mist5, ASSET.mist1, ASSET.mist4],
    specs: [
      ['Motor', '1000 W, 220V AC'],
      ['İlaç Tank Kapasitesi', '5 litre'],
      ['İlaç Çıkış Debisi', '0–49 l/h'],
      ['Damla Çapı', '0–49 mikron'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Ağırlık', '4.5 kg'],
    ],
    description: 'HD5, küçük iç mekânlar, klinikler ve ofisler için kompakt bir el tipi ULV modelidir.'
  },
  {
    slug: 'duru-hr5',
    name: 'Duru HR5',
    model: 'HR-5',
    category: 'el-tipi',
    summary: '5 L tank, el tipi ULV, dayanıklı gövde',
    images: [ASSET.mist1, ASSET.mist2, ASSET.mist5, ASSET.mist4],
    specs: [
      ['Motor', '1100 W, 220V AC'],
      ['İlaç Tank Kapasitesi', '5 litre'],
      ['İlaç Çıkış Debisi', '0–49 l/h'],
      ['Damla Çapı', '0–49 mikron'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Ağırlık', '4.8 kg'],
    ],
    description: 'HR5, hastane koridorları, oteller ve gıda işletmeleri için optimize edilmiş el tipi bir ULV modelidir.'
  },
  {
    slug: 'duru-max5',
    name: 'Duru Max5',
    model: 'MAX-5',
    category: 'el-tipi',
    summary: '5 L tank, yüksek motor gücü, el tipi ULV',
    images: [ASSET.mist4, ASSET.mist1, ASSET.mist2, ASSET.mist5],
    specs: [
      ['Motor', '1500 W, 220V AC'],
      ['İlaç Tank Kapasitesi', '5 litre'],
      ['İlaç Çıkış Debisi', '0–49 l/h'],
      ['Damla Çapı', '0–49 mikron'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Ağırlık', '5 kg'],
    ],
    description: 'Max5, daha güçlü motoru ile orta ölçek iç mekânlar için tercih edilen el tipi modeldir.'
  },
  {
    slug: 'duru-plus',
    name: 'Duru Plus',
    model: 'PLUS',
    category: 'el-tipi',
    summary: '7 L tank, el tipi ULV, dengeli tutuş',
    images: [ASSET.mist5, ASSET.mist4, ASSET.mist1, ASSET.mist2],
    specs: [
      ['Motor', '1500 W, 220V AC'],
      ['İlaç Tank Kapasitesi', '7 litre'],
      ['İlaç Çıkış Debisi', '0–49 l/h'],
      ['Damla Çapı', '0–49 mikron'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Ağırlık', '6.5 kg'],
    ],
    description: 'Duru Plus, ergonomik tutuş açısı ile uzun süreli kullanımda yorgunluğu azaltır.'
  },
  {
    slug: 'duru-x20',
    name: 'Duru X20',
    model: 'X-20',
    category: 'el-tipi',
    summary: '20 L tank, 4400 W, 0–49 mikron ULV',
    images: [ASSET.mist1, ASSET.mist4, ASSET.mist2, ASSET.mist5],
    specs: [
      ['Motor', '2200w × 2: 4400 W, 220V AC, 50hz'],
      ['İlaç Tank Kapasitesi', '20 litre'],
      ['İlaç Çıkış Debisi', '0–49 l/h'],
      ['İlaç Damla Çapı', '0–49 mikron'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Ağırlık', '12 kg'],
      ['Ölçüler', '46 cm × 60 cm × 68 cm'],
    ],
    description: 'Duru X20, el tipi kategorinin en güçlü modellerinden biri olarak 4400 W çift motoruyla 20 litrelik ana tanktan sürekli ULV çıkışı sağlar. Hastane, otel, AVM, depo ve fabrika gibi geniş iç mekânlarda profesyonel dezenfeksiyon ve haşere mücadelesinde tercih edilir.\n\n0–49 mikron ayarlanabilir damla çapı sayesinde hem soğuk sisleme (ULV) hem de hafif pulverizatör modlarında kullanılabilir; sc, ec ve wp formülasyonlu solüsyonlarla tam uyumludur. 12 kg gövde ağırlığı ve 46 × 60 × 68 cm dış ölçüleri ile masa üstü konuşlandırmaya da uygundur.'
  },
  {
    slug: 'duru-x10',
    name: 'Duru X10',
    model: 'X-10',
    category: 'el-tipi',
    summary: '10 L tank, 2200 W, el tipi ULV',
    images: [ASSET.mist2, ASSET.mist1, ASSET.mist4, ASSET.mist5],
    specs: [
      ['Motor', '2200 W, 220V AC'],
      ['İlaç Tank Kapasitesi', '10 litre'],
      ['İlaç Çıkış Debisi', '0–49 l/h'],
      ['Damla Çapı', '0–49 mikron'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Ağırlık', '8.5 kg'],
    ],
    description: 'X10, orta ölçek iç mekânlar için 10 litrelik tankı ile dengeli bir çözüm sunar.'
  },
  {
    slug: 'duru-max10',
    name: 'Duru Max10',
    model: 'MAX-10',
    category: 'el-tipi',
    summary: '10 L tank, yüksek güç el tipi ULV',
    images: [ASSET.mist4, ASSET.mist2, ASSET.mist1, ASSET.mist5],
    specs: [
      ['Motor', '2500 W, 220V AC'],
      ['İlaç Tank Kapasitesi', '10 litre'],
      ['İlaç Çıkış Debisi', '0–49 l/h'],
      ['Damla Çapı', '0–49 mikron'],
      ['Solüsyon Tipleri', 'sc, ec, wp'],
      ['Ağırlık', '9 kg'],
    ],
    description: 'Max10, yüksek motor gücü ile el tipi kategorinin profesyonel saha modelidir.'
  },
];

export const getProductBySlug = (slug) => PRODUCTS.find(p => p.slug === slug);
export const getCategoryBySlug = (slug) => CATEGORIES.find(c => c.slug === slug);
export const getProductsByCategory = (slug) => PRODUCTS.filter(p => p.category === slug);
export const getRelated = (slug, limit = 3) => {
  const p = getProductBySlug(slug);
  if (!p) return [];
  return PRODUCTS.filter(x => x.category === p.category && x.slug !== slug).slice(0, limit);
};
