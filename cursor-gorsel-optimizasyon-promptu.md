# Cursor promptu — görsel optimizasyonu

Aşağıdakinin tamamını Cursor Agent'a yapıştır.

---

Bu repoda görsel optimizasyonu yapacaksın. Boyutlar CSS'ten ölçüldü,
aşağıda veriliyor — bunları tahmin etme, aynen kullan.

## ÖNCE OKU: bozmaman gereken sözleşmeler

1. **`<slug>-01.webp` dosya adı sözleşmeseldir, SİLİNEMEZ ve
   YENİDEN ADLANDIRILAMAZ.** Şu dosyalar bu adı string birleştirmeyle
   üretiyor: `compare.js:428`, `compare-pdf.js:45`, `quote-form.js:115`,
   `quote-pdf.js:67`. Orijinali yerinde kalacak, varyantlar EK olarak
   üretilecek.

2. **Ürün dosyalarındaki sayı genişlik DEĞİL, sıra numarasıdır.**
   `duru-hd50-01.webp` → 1. görsel. Ama hero'da `duru-hero-720.webp` →
   720 piksel genişlik. İki kalıbı karıştırma:
   - Ürün varyantı: `<slug>-<NN>-<genişlik>.webp`  (örn. `duru-hd50-01-800.webp`)
   - Hero varyantı: `<ad>-<genişlik>.webp`         (mevcut yapı korunur)

3. **`.svg` dosyalarına dokunma.** Logolar ve ikonlar SVG.

4. **Orijinal `.png`/`.jpg` kaynaklarını silme.** Kaynak olarak kalsınlar.

## ADIM 1 — Envanter

`assets/img/` altındaki her raster görsel için tablo çıkar:
yol, piksel boyutu, dosya boyutu, format, alfa kanalı var mı.

## ADIM 2 — Üretilecek varyantlar

Ölçülen render genişlikleri ve üretilecek maksimum boyut:

| Kullanım | Render | Üretilecek genişlikler |
|---|---|---|
| Hero (`assets/img/hero/`) | ~600 px | 480, 720, 960, 1200 — ZATEN VAR, doğrula yeter |
| Galeri ana görsel | ~636 px | 640, 1200 |
| Galeri küçük resim | ~72–90 px | 200 (tek varyant, adı `<slug>-<NN>-thumb.webp`) |
| Ürün kartı (`grid-3`) | ~390 px | 400, 800 |
| Blog kapak | ~720 px | 720, 1200 |
| Blog kart | 16:9 kart | 400, 800 |

Kurallar:
- Kaynak hedeften küçükse UPSCALE ETME, o varyantı atla.
- Hepsi WebP. JPEG üretme.
- Fotoğraf: lossy quality=82 başla. Düz grafik/az renkli: lossless dene,
  küçük çıkarsa onu kullan.
- Alfa kanalı varsa koru.
- EXIF/ICC metadata sil.
- Bütçe: 1200w ≤120 KB, 800w ≤80 KB, 400w ≤35 KB, thumb ≤8 KB.
  Aşarsa quality'yi 5'er düşür, 65'te dur. Hâlâ aşarsa "BÜTÇE AŞILDI"
  diye işaretle ve bana bildir.

## ADIM 3 — Markup düzeltmeleri

### 3a. Küçük resimler tam boy dosya indiriyor — ASIL SORUN BU

Şu anki hâli (her ürün detay sayfasında):

```html
<button data-gallery-thumb data-src=".../duru-k100-01.webp" data-alt="...">
  <img src=".../duru-k100-01.webp" loading="lazy">
</button>
```

72 piksellik kare için tam boy dosya iniyor. 6 görselli üründe 6 kez.

Olması gereken:

```html
<button data-gallery-thumb
        data-src=".../duru-k100-01-1200.webp"
        data-srcset=".../duru-k100-01-640.webp 640w, .../duru-k100-01-1200.webp 1200w"
        data-alt="...">
  <img src=".../duru-k100-01-thumb.webp" width="90" height="90" loading="lazy" alt="">
</button>
```

`data-src` tam boy kalmalı — lightbox onu kullanıyor.

### 3b. Ana galeri görseli

Şu an `width`/`height`/`srcset` yok, üstelik her ürün sayfasının LCP
elemanı. Şuna çevir:

```html
<img data-gallery-main
     src=".../duru-k100-01-640.webp"
     srcset=".../duru-k100-01-640.webp 640w, .../duru-k100-01-1200.webp 1200w"
     sizes="(max-width: 1024px) 100vw, 640px"
     width="640" height="480"
     fetchpriority="high" alt="...">
```

Ayrıca `<head>`'e ana görsel için `<link rel="preload" as="image">` ekle
(ana sayfadaki hero preload'unu örnek al).

### 3c. main.js — galeri srcset'i atlıyor

`main.js` ana görseli `mainImg.src = thumb.dataset.src` ile değiştiriyor.
Düz `src` atadığı için srcset devre dışı kalıyor. `applyIndex` ve
`stepLightbox` fonksiyonlarında `data-srcset` varsa `mainImg.srcset`'i de
güncelle, yoksa `srcset`'i temizle. Lightbox tam boy kullanmaya devam etsin.

### 3d. Ürün kartları

`product-card__image` içindeki `<img>`'lere `srcset`/`sizes`
(`(max-width:767px) 100vw, (max-width:1024px) 50vw, 390px`) ve
`width`/`height` ekle.

## ADIM 4 — JSON tutarsızlığını düzelt

`urunler.json` ve `product-seo.json` ürün görsellerini **18 tanesi `.jpg`,
5 tanesi `.webp`** olarak yazıyor. `.webp` olan 5 tanesi:
`duru-dmxl`, `duru-mxl`, `duru-mxl-hgs`, `duru-k100`, `termal-el-tipi`.
Oysa `product-images.json` ve tüm JS kodu hepsini `.webp` kabul ediyor.

Yap:
1. `assets/img/products/` altında bu 23 slug için gerçekte hangi
   uzantının var olduğunu tespit et.
2. `urunler.json` ve `product-seo.json`'daki yolları gerçeğe göre
   düzelt — hepsi aynı uzantıda olmalı.
3. Uyuşmazlık bulursan düzeltmeden önce bana listele.

Ayrıca `product-images.json` ve `product-image-alts.json` yeni thumb
varyantlarını yansıtacak şekilde güncellensin. **Bu dört JSON birbiriyle
tutarlı kalmalı** — biri güncellenip diğeri unutulursa aynı hata geri gelir.

## ADIM 5 — og:image

Ürün sayfalarında `og:image:width=1200 og:image:height=630` yazıyor ama
gösterilen dosya 4:3 ürün fotoğrafı. Ya doğru boyutu yaz ya da 1200×630
bir OG varyantı üret.

## ADIM 6 — Doğrulama

Bitince:
- Tablo: dosya | eski | yeni | kazanç | uygulanan quality
- Tüm HTML'lerdeki `src`/`srcset`/`data-src`/`data-srcset` yollarını tara,
  diskte KARŞILIĞI OLMAYAN her referansı listele
- `-01.webp` orijinallerinin hâlâ yerinde olduğunu doğrula
- Bir ürün sayfasını tarayıcıda aç, galeri ve lightbox'ın çalıştığını,
  PDF indirmenin bozulmadığını kontrol et

Değişiklikleri diff olarak göster, onaysız commit etme.

## ADIM 7 — Dosya adı hijyeni

7a. assets/img/ altında şu kalıplara uymayan dosyaları LİSTELE
    (silme, adlandırma yapma, önce bana göster):
    - büyük harf içerenler
    - boşluk veya Türkçe karakter (ğüşiöç İĞÜŞÖÇ) içerenler
    - ürün klasöründe <slug>-<NN>.webp kalıbına uymayanlar
    Her biri için: nerede referans veriliyor, kaç yerde geçiyor.

7b. Yeniden adlandırma gerekiyorsa TEK SEFERDE yap ve aynı commit'te
    şu dört JSON ile tüm HTML/JS referanslarını birlikte güncelle:
    product-images.json, product-image-alts.json, urunler.json,
    product-seo.json
    Adlandırma sonrası hiçbir referans kırık kalmamalı — doğrula.

7c. YENİ eklenecek ürün görselleri için kural:
    assets/img/products/<slug>-<NN>.webp
    - slug urunler.json'daki slug ile birebir aynı
    - NN iki haneli, 01'den başlar, boşluk bırakmadan artar
    - sadece küçük harf, rakam ve tire; Türkçe karakter yok
    Bu kurala uymayan yeni dosya görürsen üretimi durdur ve bana bildir.