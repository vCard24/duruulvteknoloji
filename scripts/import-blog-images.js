/**
 * Duru ULV — blog kapak görsellerini kaynak klasörden siteye aktarır.
 * Kullanım: node scripts/import-blog-images.js [kaynak-klasör]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const SOURCE = args[0] || path.join('C:', 'Users', 'mosta', 'Desktop', 'DURU-HD', 'duru-blog');
const TARGET = path.join(ROOT, 'assets', 'img', 'blog');
const RENAME_SOURCE = process.argv.includes('--rename-source');

/** Proje köküne bırakılan slug-cover.webp / slug-detail.webp dosyalarını assets/img/blog/ altına taşır */
function syncFromProjectRoot() {
  if (!fs.existsSync(ROOT)) return 0;
  fs.mkdirSync(TARGET, { recursive: true });
  let n = 0;
  fs.readdirSync(ROOT).forEach((name) => {
    if (!/\.(webp|png)$/i.test(name)) return;
    if (!/-cover\.webp$|-detail\.webp$|-sertifikalar\.png$/i.test(name)) return;
    const src = path.join(ROOT, name);
    const dest = path.join(TARGET, name);
    if (!fs.statSync(src).isFile()) return;
    fs.copyFileSync(src, dest);
    n++;
    console.log(`  ✓ kök → assets/img/blog/${name}`);
  });
  return n;
}

/** Kaynak dosya adı → hedef: {slug}-cover.webp */
const IMAGE_MAP = [
  ['ulv-ilaclama-nedir.webp', 'ulv-ilaclama-nedir-cover.webp'],
  ['Mist Blower ile ULV Pulverizatör Arasındaki Fark Nedir.webp', 'mist-blower-ulv-pulverizator-farki-cover.webp'],
  ['Belediyeler İçin İlaçlama Ekipmanı Seçerken Nelere Dikkat Edilmeli.webp', 'belediye-ilaclama-ekipmani-secimi-cover.webp'],
  ['Belediye İlaçlaması Neden Bazı Bölgelerde Yetersiz Kalıyor.webp', 'belediye-ilaclama-neden-yetersiz-cover.webp'],
  ['Sera Zararlılarına Karşı Geleneksel İlaçlama mı, ULV mi Hangisi Daha Etkili.webp', 'sera-zararlilari-ulv-karsilastirma-cover.webp'],
  ['Sivrisinek ve Karasinek Mücadelesinde Doğru Mikron Çapı Neden Önemli.webp', 'sivrisinek-ilaclama-mikron-capi-cover.webp'],
  ["36 Yıllık Tecrübe Duru ULV'nin Hikayesi ve Sektördeki Yeri.webp", 'duru-ulv-hikayesi-cover.webp'],
  ['ULV Cihazı Alırken Sorulması Gereken 7 Soru.webp', 'ulv-cihazi-alirken-7-soru-cover.webp'],
  ['Kamu Kurumları İçin ISO ve CE Sertifikasının Önemi ULV Ekipmanlarında Nelere Bakılmalı.webp', 'kamu-alimlarinda-ce-iso-sertifikasi-cover.webp'],
  ['Yaz Sezonu Öncesi Belediyeler İçin İlaçlama Ekipmanı Hazırlık Rehberi.webp', 'yaz-oncesi-belediye-ilaclama-hazirlik-cover.webp'],
  ['Sonbahar Döneminde Sera İçi Haşere Kontrolü Neden Kritik.webp', 'sonbahar-sera-hasere-kontrolu-cover.webp'],
  ['Sinekle Mücadelede Pencere Sinekliği Yeterli mi.webp', 'sinekle-mucadele-pencere-sinekligi-yeterli-mi-cover.webp'],
];

/** Ek görseller — slug-detail.webp (isteğe bağlı, makale içi kullanım için) */
const EXTRA_MAP = [
  ['Mist Blower ile ULV Pulverizatör Arasındaki Fark Nedir-detay2.gorsel.webp', 'mist-blower-ulv-pulverizator-farki-detail.webp'],
  ['sera-ilaclama-detay.webp', 'sera-zararlilari-ulv-karsilastirma-detail.webp'],
];

function copyPair(sourceName, targetName) {
  let src = path.join(SOURCE, sourceName);
  if (!fs.existsSync(src) && sourceName !== targetName) {
    src = path.join(SOURCE, targetName);
  }
  const dest = path.join(TARGET, targetName);
  if (!fs.existsSync(src)) {
    console.warn(`  ⚠ Kaynak yok: ${sourceName}`);
    return false;
  }
  fs.copyFileSync(src, dest);
  const kb = Math.round(fs.statSync(dest).size / 1024);
  console.log(`  ✓ ${targetName} (${kb} KB)`);
  return true;
}

if (!fs.existsSync(SOURCE)) {
  console.error(`Kaynak klasör bulunamadı: ${SOURCE}`);
  process.exit(1);
}

fs.mkdirSync(TARGET, { recursive: true });

const fromRoot = syncFromProjectRoot();
if (fromRoot) console.log(`Proje kökünden ${fromRoot} görsel kopyalandı.\n`);

console.log(`Kaynak: ${SOURCE}`);
console.log(`Hedef:  ${TARGET}\n`);
console.log('Kapak görselleri:');

let ok = 0;
IMAGE_MAP.forEach(([src, dest]) => {
  if (copyPair(src, dest)) ok++;
});

console.log('\nEk görseller (detail):');
EXTRA_MAP.forEach(([src, dest]) => copyPair(src, dest));

console.log(`\nÖzet: ${ok}/${IMAGE_MAP.length} kapak görseli kopyalandı.`);

if (ok < IMAGE_MAP.length) {
  process.exit(1);
}

if (RENAME_SOURCE) {
  console.log('\nKaynak klasörde dosya adları düzeltiliyor:');
  [...IMAGE_MAP, ...EXTRA_MAP].forEach(([src, dest]) => {
    const from = path.join(SOURCE, src);
    const to = path.join(SOURCE, dest);
    if (!fs.existsSync(from) || src === dest) return;
    if (fs.existsSync(to) && from !== to) fs.unlinkSync(to);
    fs.renameSync(from, to);
    console.log(`  ↳ ${dest}`);
  });
}
