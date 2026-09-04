/**
 * urunler.json → urunler.en.json / urunler.ar.json
 * Yapı aynı; metin alanları çevrilir. slug / model_kodu / teknik_tablo aynı kalır.
 * Kullanım: node scripts/build-locale-catalogs.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'assets/data/urunler.json');

const CAT = {
  en: {
    'arac-uzeri-ilaclama': {
      ad_tr: 'Vehicle-Mounted ULV Sprayers',
      kisa_ad: 'Vehicle-Mounted',
      aciklama_tr:
        'High-capacity mist blowers and ULV sprayers mounted on pick-ups and light trucks. Designed for municipalities, public agencies, and large-area applications.',
    },
    'sera-tipi-ulv-ilaclama': {
      ad_tr: 'Greenhouse ULV Sprayers',
      kisa_ad: 'Greenhouse',
      aciklama_tr:
        'Electric ULV machines for enclosed greenhouses with fine droplet size. Built for farms and floriculture.',
    },
    'sirt-tipi-ulv-ilaclama': {
      ad_tr: 'Backpack ULV Sprayers',
      kisa_ad: 'Backpack',
      aciklama_tr:
        'Professional ULV units carried on the operator’s back for high field mobility.',
    },
    'el-tipi-ulv-ilaclama': {
      ad_tr: 'Handheld ULV Sprayers',
      kisa_ad: 'Handheld',
      aciklama_tr:
        'Compact, lightweight handheld ULV sprayers for hospitals, hotels, warehouses, and factories.',
    },
    'nemlendirme-ulv': {
      ad_tr: 'ULV Humidification Machines',
      kisa_ad: 'Humidification',
      aciklama_tr:
        'Float-controlled ULV humidification systems for mushroom houses, greenhouses, and storage. Hygrostat and rotating-head models.',
    },
    'termal-sisleme': {
      ad_tr: 'Thermal Fogging & Frost Protection',
      kisa_ad: 'Thermal',
      aciklama_tr:
        'Thermal hot fogging machines for sewers, open areas, and frost protection. Briggs-powered and handheld models.',
    },
  },
  ar: {
    'arac-uzeri-ilaclama': {
      ad_tr: 'أجهزة الرش ULV المثبتة على المركبات',
      kisa_ad: 'مركبات',
      aciklama_tr:
        'أجهزة نفخ الضباب ورش ULV عالية السعة تُركب على الشاحنات الصغيرة. مصممة للبلديات والجهات العامة والمساحات الكبيرة.',
    },
    'sera-tipi-ulv-ilaclama': {
      ad_tr: 'أجهزة ULV للبيوت المحمية',
      kisa_ad: 'بيوت محمية',
      aciklama_tr:
        'أجهزة ULV كهربائية للبيوت المحمية المغلقة بقطرات دقيقة. مناسبة للمزارع وزراعة الأزهار.',
    },
    'sirt-tipi-ulv-ilaclama': {
      ad_tr: 'أجهزة ULV المحمولة على الظهر',
      kisa_ad: 'ظهر',
      aciklama_tr: 'وحدات ULV احترافية تُحمل على ظهر المشغّل لحرية حركة عالية في الميدان.',
    },
    'el-tipi-ulv-ilaclama': {
      ad_tr: 'أجهزة ULV اليدوية',
      kisa_ad: 'يدوي',
      aciklama_tr:
        'أجهزة رش ULV يدوية خفيفة ومدمجة للمستشفيات والفنادق والمستودعات والمصانع.',
    },
    'nemlendirme-ulv': {
      ad_tr: 'أجهزة الترطيب ULV',
      kisa_ad: 'ترطيب',
      aciklama_tr:
        'أنظمة ترطيب ULV بتحكم عوامة لمزارع الفطر والبيوت المحمية والمخازن. موديلات بهيجروستات ورأس دوّار.',
    },
    'termal-sisleme': {
      ad_tr: 'التضبيب الحراري ومكافحة الصقيع',
      kisa_ad: 'حراري',
      aciklama_tr:
        'أجهزة تضبيب حراري ساخن للمجاري والمناطق المفتوحة ومكافحة الصقيع. موديلات بمحرك Briggs ويدوية.',
    },
  },
};

const PROD = {
  en: {
    'duru-mist-blower-15hp': {
      ad_tr: 'Duru Mist Blower 15HP (400L)',
      kisa_aciklama_tr: '400 L tank, 15 HP engine, professional vehicle-mounted mist blower',
      meta_title: 'Duru Mist Blower 15HP (400L) — Vehicle-Mounted ULV | Duru ULV',
      meta_desc:
        'Professional 400 L mist blower with 15 HP engine for municipal and large-area ULV spraying. Request a quote from Duru ULV.',
    },
    'entosis-mist-blower-500l': {
      ad_tr: 'Entosis Mist Blower (500L)',
      kisa_aciklama_tr: '500 L tank, joystick control, 6+1 nozzles, 35-micron ULV',
      meta_title: 'Entosis Mist Blower 500L — Joystick ULV | Duru ULV',
      meta_desc:
        'High-capacity 500 L Entosis mist blower with joystick control and 35-micron ULV for large-scale vector control.',
    },
    'duru-hd1800': {
      ad_tr: 'Duru HD1800',
      kisa_aciklama_tr: 'High-capacity vehicle-mounted ULV sprayer for demanding field operations',
      meta_title: 'Duru HD1800 Vehicle-Mounted ULV Sprayer | Duru ULV',
      meta_desc: 'Duru HD1800 professional vehicle-mounted ULV sprayer. Technical specs and quote request.',
    },
    'duru-hd75': {
      ad_tr: 'Duru HD75',
      kisa_aciklama_tr: 'Compact vehicle-mounted ULV unit for municipal and industrial spraying',
      meta_title: 'Duru HD75 Vehicle-Mounted ULV | Duru ULV',
      meta_desc: 'Duru HD75 vehicle-mounted ULV sprayer — compact professional performance. Request a quote.',
    },
    'duru-hd50': {
      ad_tr: 'Duru HD50',
      kisa_aciklama_tr: 'Reliable vehicle-mounted ULV sprayer for daily municipal operations',
      meta_title: 'Duru HD50 Vehicle-Mounted ULV Sprayer | Duru ULV',
      meta_desc: 'Duru HD50 professional vehicle-mounted ULV fogger for municipalities and pest control teams.',
    },
    'entosis-50': {
      ad_tr: 'Entosis 50',
      kisa_aciklama_tr: 'Electric greenhouse ULV sprayer with 50 L capacity',
      meta_title: 'Entosis 50 Greenhouse ULV Sprayer | Duru ULV',
      meta_desc: 'Entosis 50 electric ULV machine for greenhouse crop protection. CE-certified Turkish manufacturing.',
    },
    'sera-max-50': {
      ad_tr: 'Sera Max 50',
      kisa_aciklama_tr: 'High-performance 50 L greenhouse ULV sprayer',
      meta_title: 'Sera Max 50 Greenhouse ULV | Duru ULV',
      meta_desc: 'Sera Max 50 greenhouse ULV sprayer for intensive indoor plant protection applications.',
    },
    'sera-ultra-20': {
      ad_tr: 'Sera Ultra 20',
      kisa_aciklama_tr: 'Compact 20 L ultra-fine greenhouse ULV sprayer',
      meta_title: 'Sera Ultra 20 Greenhouse ULV | Duru ULV',
      meta_desc: 'Sera Ultra 20 compact greenhouse ULV sprayer with fine droplet control.',
    },
    'entosis-20': {
      ad_tr: 'Entosis 20',
      kisa_aciklama_tr: '20 L electric greenhouse ULV for smaller protected spaces',
      meta_title: 'Entosis 20 Greenhouse ULV Sprayer | Duru ULV',
      meta_desc: 'Entosis 20 electric greenhouse ULV sprayer — efficient coverage for mid-size houses.',
    },
    'sera-plus-20': {
      ad_tr: 'Sera Plus 20',
      kisa_aciklama_tr: '20 L greenhouse ULV sprayer for routine crop protection',
      meta_title: 'Sera Plus 20 Greenhouse ULV | Duru ULV',
      meta_desc: 'Sera Plus 20 greenhouse ULV machine for reliable indoor pest and disease control.',
    },
    'duru-sirt10': {
      ad_tr: 'Duru SRT 10',
      kisa_aciklama_tr: 'Professional backpack ULV sprayer for mobile field work',
      meta_title: 'Duru SRT 10 Backpack ULV Sprayer | Duru ULV',
      meta_desc: 'Duru SRT 10 backpack ULV sprayer — portable professional fogging for field operators.',
    },
    'duru-hd5': {
      ad_tr: 'Duru HD5',
      kisa_aciklama_tr: 'Handheld ULV sprayer for indoor disinfection and pest control',
      meta_title: 'Duru HD5 Handheld ULV Sprayer | Duru ULV',
      meta_desc:
        'Duru HD5 handheld ULV fogger for hospitals, hotels, and industrial indoor applications. Request a quote.',
    },
    'duru-hr5': {
      ad_tr: 'Duru HR5',
      kisa_aciklama_tr: 'Lightweight handheld ULV unit for confined indoor spaces',
      meta_title: 'Duru HR5 Handheld ULV | Duru ULV',
      meta_desc: 'Duru HR5 compact handheld ULV sprayer for precise indoor fogging.',
    },
    'duru-max5': {
      ad_tr: 'Duru Max5',
      kisa_aciklama_tr: 'High-output handheld ULV sprayer for professional teams',
      meta_title: 'Duru Max5 Handheld ULV Sprayer | Duru ULV',
      meta_desc: 'Duru Max5 handheld ULV machine — strong output for professional disinfection teams.',
    },
    'duru-plus': {
      ad_tr: 'Duru Plus 3"',
      kisa_aciklama_tr: 'Handheld ULV sprayer with 3-inch fan for wider indoor coverage',
      meta_title: 'Duru Plus 3" Handheld ULV | Duru ULV',
      meta_desc: 'Duru Plus 3" handheld ULV sprayer for wider droplet throw in indoor spaces.',
    },
    'duru-x20': {
      ad_tr: 'Duru X20',
      kisa_aciklama_tr: '20-class handheld ULV sprayer for intensive indoor programs',
      meta_title: 'Duru X20 Handheld ULV Sprayer | Duru ULV',
      meta_desc: 'Duru X20 handheld ULV fogger for intensive indoor pest and hygiene programs.',
    },
    'duru-x10': {
      ad_tr: 'Duru X10',
      kisa_aciklama_tr: 'Versatile handheld ULV sprayer for daily facility use',
      meta_title: 'Duru X10 Handheld ULV | Duru ULV',
      meta_desc: 'Duru X10 handheld ULV sprayer — versatile daily use for facilities and service teams.',
    },
    'duru-max10': {
      ad_tr: 'Duru Max10',
      kisa_aciklama_tr: 'Higher-capacity handheld ULV for larger indoor volumes',
      meta_title: 'Duru Max10 Handheld ULV Sprayer | Duru ULV',
      meta_desc: 'Duru Max10 handheld ULV machine for larger indoor volumes and longer duty cycles.',
    },
    'duru-dmxl': {
      ad_tr: 'Duru DMXL',
      kisa_aciklama_tr: 'ULV humidification system for controlled growing environments',
      meta_title: 'Duru DMXL ULV Humidifier | Duru ULV',
      meta_desc: 'Duru DMXL ULV humidification machine for greenhouses, mushroom houses, and storage.',
    },
    'duru-mxl': {
      ad_tr: 'Duru MXL',
      kisa_aciklama_tr: 'Float-controlled ULV humidification for stable climate control',
      meta_title: 'Duru MXL ULV Humidification | Duru ULV',
      meta_desc: 'Duru MXL float-controlled ULV humidifier for stable humidity in protected crops.',
    },
    'duru-mxl-hgs': {
      ad_tr: 'Duru MXL-HGS',
      kisa_aciklama_tr: 'Hygrostat-controlled ULV humidification with rotating head',
      meta_title: 'Duru MXL-HGS Hygrostat ULV Humidifier | Duru ULV',
      meta_desc: 'Duru MXL-HGS ULV humidifier with hygrostat control and rotating head options.',
    },
    'duru-k100': {
      ad_tr: 'Duru K 100',
      kisa_aciklama_tr: 'Thermal fogger for open areas, sewers, and frost protection',
      meta_title: 'Duru K 100 Thermal Fogger | Duru ULV',
      meta_desc: 'Duru K 100 thermal fogging machine for open areas, sewer treatment, and frost protection.',
    },
    'termal-el-tipi': {
      ad_tr: 'Handheld Thermal Fogger',
      kisa_aciklama_tr: 'Portable thermal fogger for targeted outdoor and sewer applications',
      meta_title: 'Handheld Thermal Fogger | Duru ULV',
      meta_desc: 'Portable thermal fogger from Duru ULV for targeted outdoor and sewer fogging jobs.',
    },
  },
  ar: {
    'duru-mist-blower-15hp': {
      ad_tr: 'Duru Mist Blower 15HP (400L)',
      kisa_aciklama_tr: 'خزان 400 لتر، محرك 15 حصان، جهاز نفخ ضباب احترافي على المركبة',
      meta_title: 'Duru Mist Blower 15HP (400L) — رش ULV على المركبة | Duru ULV',
      meta_desc: 'جهاز نفخ ضباب بسعة 400 لتر ومحرك 15 حصان للرش البلدي والمساحات الكبيرة. اطلب عرض سعر من Duru ULV.',
    },
    'entosis-mist-blower-500l': {
      ad_tr: 'Entosis Mist Blower (500L)',
      kisa_aciklama_tr: 'خزان 500 لتر، تحكم جوستيك، 6+1 فوهات، ULV بـ 35 ميكرون',
      meta_title: 'Entosis Mist Blower 500L — ULV بعصا تحكم | Duru ULV',
      meta_desc: 'جهاز Entosis بسعة 500 لتر مع تحكم جوستيك وULV بقطر 35 ميكرون لمكافحة النواقل واسعة النطاق.',
    },
    'duru-hd1800': {
      ad_tr: 'Duru HD1800',
      kisa_aciklama_tr: 'جهاز رش ULV عالي السعة مثبت على المركبة للعمليات الميدانية الشاقة',
      meta_title: 'Duru HD1800 جهاز ULV على المركبة | Duru ULV',
      meta_desc: 'Duru HD1800 جهاز رش ULV احترافي على المركبة. المواصفات وطلب عرض السعر.',
    },
    'duru-hd75': {
      ad_tr: 'Duru HD75',
      kisa_aciklama_tr: 'وحدة ULV مدمجة على المركبة للرش البلدي والصناعي',
      meta_title: 'Duru HD75 جهاز ULV على المركبة | Duru ULV',
      meta_desc: 'Duru HD75 جهاز رش ULV على المركبة بأداء احترافي مدمج. اطلب عرض سعر.',
    },
    'duru-hd50': {
      ad_tr: 'Duru HD50',
      kisa_aciklama_tr: 'جهاز رش ULV موثوق على المركبة للعمليات البلدية اليومية',
      meta_title: 'Duru HD50 جهاز ULV على المركبة | Duru ULV',
      meta_desc: 'Duru HD50 جهاز تضبيب ULV احترافي على المركبة للبلديات وفرق مكافحة الآفات.',
    },
    'entosis-50': {
      ad_tr: 'Entosis 50',
      kisa_aciklama_tr: 'جهاز ULV كهربائي للبيوت المحمية بسعة 50 لتر',
      meta_title: 'Entosis 50 جهاز ULV للبيوت المحمية | Duru ULV',
      meta_desc: 'Entosis 50 جهاز ULV كهربائي لحماية محاصيل البيوت المحمية. تصنيع تركي بشهادة CE.',
    },
    'sera-max-50': {
      ad_tr: 'Sera Max 50',
      kisa_aciklama_tr: 'جهاز ULV عالي الأداء بسعة 50 لتر للبيوت المحمية',
      meta_title: 'Sera Max 50 جهاز ULV للبيوت المحمية | Duru ULV',
      meta_desc: 'Sera Max 50 لجهاز الرش ULV في البيوت المحمية لتطبيقات الحماية المكثفة.',
    },
    'sera-ultra-20': {
      ad_tr: 'Sera Ultra 20',
      kisa_aciklama_tr: 'جهاز ULV مدمج بسعة 20 لتر بقطرات فائقة الدقة',
      meta_title: 'Sera Ultra 20 جهاز ULV للبيوت المحمية | Duru ULV',
      meta_desc: 'Sera Ultra 20 جهاز ULV مدمج للبيوت المحمية مع تحكم دقيق بحجم القطرة.',
    },
    'entosis-20': {
      ad_tr: 'Entosis 20',
      kisa_aciklama_tr: 'جهاز ULV كهربائي بسعة 20 لتر للمساحات المحمية الأصغر',
      meta_title: 'Entosis 20 جهاز ULV للبيوت المحمية | Duru ULV',
      meta_desc: 'Entosis 20 جهاز ULV كهربائي بكفاءة تغطية للبيوت المحمية متوسطة الحجم.',
    },
    'sera-plus-20': {
      ad_tr: 'Sera Plus 20',
      kisa_aciklama_tr: 'جهاز ULV بسعة 20 لتر للحماية الروتينية للمحاصيل',
      meta_title: 'Sera Plus 20 جهاز ULV للبيوت المحمية | Duru ULV',
      meta_desc: 'Sera Plus 20 لجهاز ULV موثوق لمكافحة الآفات والأمراض داخل البيوت المحمية.',
    },
    'duru-sirt10': {
      ad_tr: 'Duru SRT 10',
      kisa_aciklama_tr: 'جهاز ULV احترافي محمول على الظهر للعمل الميداني المتنقل',
      meta_title: 'Duru SRT 10 جهاز ULV على الظهر | Duru ULV',
      meta_desc: 'Duru SRT 10 جهاز تضبيب ULV محمول على الظهر للمشغّلين الميدانيين.',
    },
    'duru-hd5': {
      ad_tr: 'Duru HD5',
      kisa_aciklama_tr: 'جهاز رش ULV يدوي للتطهير ومكافحة الآفات الداخلية',
      meta_title: 'Duru HD5 جهاز ULV يدوي | Duru ULV',
      meta_desc: 'Duru HD5 جهاز تضبيب ULV يدوي للمستشفيات والفنادق والتطبيقات الصناعية الداخلية.',
    },
    'duru-hr5': {
      ad_tr: 'Duru HR5',
      kisa_aciklama_tr: 'وحدة ULV يدوية خفيفة للمساحات الداخلية الضيقة',
      meta_title: 'Duru HR5 جهاز ULV يدوي | Duru ULV',
      meta_desc: 'Duru HR5 جهاز رش ULV يدوي مدمج للتضبيب الداخلي الدقيق.',
    },
    'duru-max5': {
      ad_tr: 'Duru Max5',
      kisa_aciklama_tr: 'جهاز ULV يدوي عالي الإنتاج للفرق المهنية',
      meta_title: 'Duru Max5 جهاز ULV يدوي | Duru ULV',
      meta_desc: 'Duru Max5 جهاز ULV يدوي بقوة إخراج عالية لفرق التطهير المهنية.',
    },
    'duru-plus': {
      ad_tr: 'Duru Plus 3"',
      kisa_aciklama_tr: 'جهاز ULV يدوي بمروحة 3 إنش لتغطية داخلية أوسع',
      meta_title: 'Duru Plus 3" جهاز ULV يدوي | Duru ULV',
      meta_desc: 'Duru Plus 3" جهاز رش ULV يدوي لمدى رمي أوسع داخل المساحات المغلقة.',
    },
    'duru-x20': {
      ad_tr: 'Duru X20',
      kisa_aciklama_tr: 'جهاز ULV يدوي من فئة 20 للبرامج الداخلية المكثفة',
      meta_title: 'Duru X20 جهاز ULV يدوي | Duru ULV',
      meta_desc: 'Duru X20 جهاز تضبيب ULV يدوي لبرامج النظافة ومكافحة الآفات الداخلية المكثفة.',
    },
    'duru-x10': {
      ad_tr: 'Duru X10',
      kisa_aciklama_tr: 'جهاز ULV يدوي متعدد الاستخدامات للاستخدام اليومي في المنشآت',
      meta_title: 'Duru X10 جهاز ULV يدوي | Duru ULV',
      meta_desc: 'Duru X10 جهاز رش ULV يدوي متعدد الاستخدامات للمنشآت وفرق الخدمة اليومية.',
    },
    'duru-max10': {
      ad_tr: 'Duru Max10',
      kisa_aciklama_tr: 'جهاز ULV يدوي بسعة أعلى للأحجام الداخلية الأكبر',
      meta_title: 'Duru Max10 جهاز ULV يدوي | Duru ULV',
      meta_desc: 'Duru Max10 جهاز ULV يدوي للأحجام الداخلية الأكبر ودورات العمل الأطول.',
    },
    'duru-dmxl': {
      ad_tr: 'Duru DMXL',
      kisa_aciklama_tr: 'نظام ترطيب ULV لبيئات الزراعة المتحكم بها',
      meta_title: 'Duru DMXL جهاز ترطيب ULV | Duru ULV',
      meta_desc: 'Duru DMXL جهاز ترطيب ULV للبيوت المحمية ومزارع الفطر والمخازن.',
    },
    'duru-mxl': {
      ad_tr: 'Duru MXL',
      kisa_aciklama_tr: 'ترطيب ULV بتحكم عوامة لاستقرار المناخ',
      meta_title: 'Duru MXL ترطيب ULV | Duru ULV',
      meta_desc: 'Duru MXL جهاز ترطيب ULV بتحكم عوامة لرطوبة مستقرة في المحاصيل المحمية.',
    },
    'duru-mxl-hgs': {
      ad_tr: 'Duru MXL-HGS',
      kisa_aciklama_tr: 'ترطيب ULV بتحكم هيجروستات ورأس دوّار',
      meta_title: 'Duru MXL-HGS جهاز ترطيب ULV بالهيجروستات | Duru ULV',
      meta_desc: 'Duru MXL-HGS جهاز ترطيب ULV مع تحكم هيجروستات وخيارات رأس دوّار.',
    },
    'duru-k100': {
      ad_tr: 'Duru K 100',
      kisa_aciklama_tr: 'جهاز تضبيب حراري للمناطق المفتوحة والمجاري ومكافحة الصقيع',
      meta_title: 'Duru K 100 جهاز تضبيب حراري | Duru ULV',
      meta_desc: 'Duru K 100 جهاز تضبيب حراري للمناطق المفتوحة ومعالجة المجاري ومكافحة الصقيع.',
    },
    'termal-el-tipi': {
      ad_tr: 'جهاز تضبيب حراري يدوي',
      kisa_aciklama_tr: 'جهاز تضبيب حراري محمول للتطبيقات الخارجية والمجاري المستهدفة',
      meta_title: 'جهاز تضبيب حراري يدوي | Duru ULV',
      meta_desc: 'جهاز تضبيب حراري محمول من Duru ULV لأعمال التضبيب الخارجية والمجاري.',
    },
  },
};

const KURUMSAL = {
  en: {
    firma_adi: 'Duru ULV Technology Systems',
    fiyat_politikasi:
      'No product prices are shown on the website. Sales are handled only via quote form or direct contact.',
    adres: {
      satir1: 'Osman Kavuncu Mah. Emirhan Cad. No: 4/C',
      satir2: 'Melikgazi / Kayseri / Türkiye',
    },
  },
  ar: {
    firma_adi: 'دورو يو إل في لأنظمة التكنولوجيا',
    fiyat_politikasi:
      'لا تُعرض أسعار المنتجات على الموقع. يتم البيع عبر نموذج طلب العرض أو التواصل المباشر فقط.',
    adres: {
      satir1: 'Osman Kavuncu Mah. Emirhan Cad. No: 4/C',
      satir2: 'Melikgazi / Kayseri / Türkiye',
    },
  },
};

function buildLocale(locale) {
  const src = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const catMap = CAT[locale];
  const prodMap = PROD[locale];
  const kExtra = KURUMSAL[locale];

  src.kurumsal_bilgiler = {
    ...src.kurumsal_bilgiler,
    ...kExtra,
    adres: { ...src.kurumsal_bilgiler.adres, ...kExtra.adres },
  };

  src.kategoriler = src.kategoriler.map((c) => {
    const t = catMap[c.slug] || {};
    return { ...c, ...t };
  });

  src.urunler = src.urunler.map((p) => {
    const t = prodMap[p.slug] || {};
    return {
      ...p,
      ad_tr: t.ad_tr || p.ad_tr,
      kisa_aciklama_tr: t.kisa_aciklama_tr || p.kisa_aciklama_tr,
      meta_title: t.meta_title || undefined,
      meta_desc: t.meta_desc || undefined,
      // teknik_tablo / slug / model_kodu / gorsel / kategori_slug unchanged
    };
  });

  const out = path.join(ROOT, 'assets/data', `urunler.${locale}.json`);
  fs.writeFileSync(out, JSON.stringify(src, null, 2) + '\n', 'utf8');
  console.log(`wrote ${out} (${src.urunler.length} products)`);
}

buildLocale('en');
buildLocale('ar');
