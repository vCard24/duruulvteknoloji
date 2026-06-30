# DURU ULV — Cursor Talimat Dosyası: emergent.sh Tasarımını Statik HTML'e Dönüştürme

## Amaç (en önemli kısım — önce bunu anla)

Elimde `emergent` adlı bir klasör var — bu, emergent.sh'in ürettiği bir proje (muhtemelen
React/Next.js gibi bir framework ile, build sistemi gerektiren bir yapı). Bu klasördeki
**tasarımı (renkler, fontlar, spacing, kart stilleri, buton stilleri, layout, görsel dil)
referans alıp**, **sıfırdan, framework'süz, derlemeye gerek olmayan, saf HTML/CSS/JS**
dosyaları üreteceksin.

### Kesin kurallar

1. **`emergent` klasöründen TEK BİR DOSYA bile kopyalama, import etme, link verme, require
   etme.** O klasör nihai projeye dahil olmayacak — sadece senin (Cursor'un) "bu nasıl
   görünüyor" diye bakıp anlayacağın bir referans. Final teslimatta o klasöre hiçbir
   bağımlılık olmamalı.
2. **Üreteceğin her sayfa kendi başına, bağımsız bir `index.html` dosyası olacak.** İçinde
   gerekli tüm CSS (`<link>` ile ortak bir `style.css` dosyasına bağlanabilir) ve JS
   (`<script>` ile ortak `main.js` gibi dosyalara bağlanabilir) referansları olacak, ama
   hiçbir build adımı (npm install, webpack, vite, next build vb.) gerekmeyecek.
3. **Teslimat şekli:** Kullanıcı bu dosyaları doğrudan bir `public_html` klasörüne
   sürükleyip bırakacak ve tarayıcıda anında çalışacak. Yani:
   - Göreli yollar (`./assets/css/style.css`, `../assets/img/...` gibi) kullan, mutlak
     `/` kökten başlayan yollar yerine (sunucuya göre değişebileceği için göreli yol daha
     güvenli, ama proje kök dizini sabitse `/assets/...` de kabul edilebilir — tutarlı ol).
   - Hiçbir `.env`, `package.json`, `node_modules` gerektirmeyecek.
4. **Görseller şimdilik boş/placeholder bırakılacak.** Her ürün/sayfa için bir görsel
   alanı (örn. `<img src="../assets/img/products/duru-x20-01.jpg" alt="Duru X20">` gibi)
   tanımla, ama gerçek görsel dosyası olmasın — kullanıcı kendi görsellerini bu yollara
   adım adım ekleyecek. Görsel `alt` metinleri ürün adına göre doğru ve anlamlı olsun
   (SEO için önemli).
5. **`urunler.json` dosyasını oku ve ürün sayfalarını/kategorilerini bu veriye göre üret.**
   Bu dosya, kataloğun gerçek 18 ürününü, kategorilerini ve tam teknik tablolarını
   içeriyor. Hiçbir ürün adını veya teknik veriyi kendi kafandan üretme/tahmin etme —
   hepsi bu JSON'da var.

## emergent Klasöründen Ne Alınacak (sadece görsel referans)

emergent klasörünü incele ve şu görsel/yapısal kararları not al, sonra bunları yeni statik
HTML'de uygula:

- Renk paleti (CSS değişkenleri/hex kodları) — koyu yeşil/gri aile olmalıydı, emergent
  çıktısında hangi tonları kullandıysa onları **birebir** al (örn. `:root { --color-primary:
  ...; }` şeklinde bir CSS değişken dosyası çıkar)
- Font aileleri (Space Grotesk başlıklarda, IBM Plex Sans/Source Sans gövde metninde
  olmalıydı — emergent'in gerçekte hangi fontu kullandığını kontrol et ve onu al)
- Buton stilleri (köşe yuvarlaklığı, dolgu/outline varyantları, hover efektleri)
- Kart stilleri (ürün kartı, kategori kartı — gölge, kenarlık, padding, hover animasyonu)
- Header/footer yapısı, navigasyon stili
- WhatsApp floating buton stili/konumu/animasyonu
- Spacing/grid sistemi (kaç kolonlu grid, container genişliği, breakpoint'ler)
- Mikro-animasyonlar (hover geçişleri, transition süreleri/easing)

Bunları bulduktan sonra, ayrı bir `design-tokens.css` (veya `variables.css`) dosyasında
CSS custom properties olarak tanımla — böylece tüm sayfalar aynı tasarım dilini kullanır
ve ileride renk/font değişikliği tek dosyadan yapılabilir.

## emergent'te OLMAYAN Sayfaların Tasarımı

emergent çıktısında sadece **anasayfa** ve **bir örnek ürün sayfası** var. Aşağıdaki
sayfalar emergent'te yok — bunları, **yukarıda çıkardığın aynı tasarım dilini (renk,
font, buton, kart, spacing) kullanarak** sıfırdan, ama tutarlı şekilde sen tasarlayacaksın.
Bu sayfalar "farklı bir site" gibi görünmemeli, aynı ailenin parçası gibi hissettirmeli:

1. **Kategori sayfası** — ürün kartlarının grid halinde listelendiği sayfa (anasayfadaki
   kart stilini kullan)
2. **Ürün Karşılaştırma sayfası** (`/urun-karsilastirma/`) — boş durum + dolu durum
   (yan yana max 4 ürün tablosu), "Tümünü temizle", "Karşılaştırmayı yazdır", "Seçili
   ürünler için teklif al" aksiyonları
3. **Teklif formu sayfası** (`/fiyat-teklifi/`) — Ad-Soyad, Firma/Kurum, Telefon, E-posta,
   İl/İlçe, Mesaj, KVKK onay checkbox'ı; seçili ürünler varsa otomatik listelenir
4. **Hakkımızda** — kurumsal metin + sertifika rozetleri (bkz. `urunler.json` →
   `kurumsal_bilgiler.sertifikalar`)
5. **İletişim** — telefon/WhatsApp/adres (bkz. `urunler.json` → `kurumsal_bilgiler`)
6. **Kalite Politikamız / Sertifikalar** — sertifika listesi + açıklama
7. **Gizlilik Politikası, KVKK, Kullanım Koşulları** — yasal metin placeholder'ları
   (içerik sonradan eklenecek, sadece sayfa iskeleti + tutarlı tasarım yeterli)
8. **Teşekkürler sayfası** — form gönderiminden sonra yönlenilecek basit onay sayfası

## Sayfa Yapısı / Klasör Organizasyonu (önerilen)

```
/ (kök — public_html içine bu yapı kopyalanacak)
├── index.html                          → Anasayfa
├── assets/
│   ├── css/
│   │   ├── design-tokens.css           → Renk/font CSS değişkenleri (emergent'ten çıkarılan)
│   │   ├── main.css                    → Genel layout, header/footer, ortak bileşenler
│   │   └── components.css              → Kart, buton, form, tablo stilleri
│   ├── js/
│   │   ├── compare.js                  → Karşılaştırma state yönetimi (URL query param ile)
│   │   └── main.js                     → Genel etkileşimler (mobil menü, WhatsApp pulse vb.)
│   ├── img/
│   │   └── products/                   → Boş/placeholder — kullanıcı sonra dolduracak
│   └── data/
│       └── urunler.json                → (bu dosyayı projeye dahil et, JS ile fetch/okunabilir)
├── urunler/
│   ├── index.html                      → Tüm ürünler / kategori seçim sayfası
│   ├── arac-uzeri-ilaclama/
│   │   ├── index.html                  → Kategori sayfası
│   │   ├── duru-mist-blower-15hp/index.html
│   │   ├── entosis-mist-blower-500l/index.html
│   │   ├── duru-hd1800/index.html
│   │   ├── duru-hd75/index.html
│   │   └── duru-hd50/index.html
│   ├── sera-tipi-ulv-ilaclama/
│   │   ├── index.html
│   │   ├── entosis-50/index.html
│   │   ├── sera-max-50/index.html
│   │   ├── sera-ultra-20/index.html
│   │   ├── entosis-20/index.html
│   │   └── sera-plus-20/index.html
│   ├── sirt-tipi-ulv-ilaclama/
│   │   ├── index.html
│   │   └── duru-sirt10/index.html
│   └── el-tipi-ulv-ilaclama/
│       ├── index.html
│       ├── duru-hd5/index.html
│       ├── duru-hr5/index.html
│       ├── duru-max5/index.html
│       ├── duru-plus/index.html
│       ├── duru-x20/index.html
│       ├── duru-x10/index.html
│       └── duru-max10/index.html
├── urun-karsilastirma/index.html
├── fiyat-teklifi/index.html
├── tesekkurler/index.html
├── hakkimizda/index.html
├── kalite-politikamiz/index.html
├── iletisim/index.html
├── gizlilik-politikasi/index.html
├── kvkk/index.html
└── kullanim-kosullari/index.html
```

Her ürün klasörü `slug` adını taşıyor — bu slug'lar `urunler.json` içindeki `slug`
alanlarıyla birebir eşleşiyor, böylece URL yapısı veri dosyasıyla tutarlı kalıyor.

## Ürün Sayfası İçeriği (her ürün için)

`urunler.json`'daki her ürün kaydı için şu bloklarla bir sayfa üret:

1. Galeri alanı (placeholder görsel, `alt` metni ürün adıyla dolu)
2. Başlık (`ad_tr`) + model kodu (`model_kodu`) + kısa açıklama (`kisa_aciklama_tr`)
3. Aksiyon barı: **"Teklif Al"** + **"Karşılaştır"** butonları — ⚠️ fiyat YOK, sepet YOK
4. Teknik özellikler tablosu — `teknik_tablo` dizisindeki her `{ozellik, deger}` çiftini
   bir `<table>` satırı olarak bas (iki sütun: Özellik / Değer)
5. Geniş açıklama metni bloğu — şimdilik placeholder paragraf (içerik sonra elle eklenecek)
6. Kullanım alanları ikon grid'i (Belediye, Hastane, Sera, Çiftlik, Fabrika, Askeriye)
7. SSS bloğu (akordeon) — placeholder 3-4 soru-cevap
8. "İlgili ürünler" — aynı `kategori_slug`'a sahip diğer 2-3 ürünün kartı

## Karşılaştırma Sistemi (teknik not)

- Karşılaştırmaya eklenen ürünler `localStorage` **DEĞİL**, URL query param ile taşınsın
  (örn. `?compare=duru-x20,entosis-50` gibi, ürün `slug`'larını kullanarak) — bu hem
  paylaşılabilir link sağlar hem sayfa yenilendiğinde veri kaybolmaz.
- Maksimum 4 ürün.
- "Karşılaştır" butonuna tıklayınca JS ile URL güncellensin ve karşılaştırma sayfasına
  yönlendirme/güncelleme yapılsın.

## Genel Bileşenler (her sayfada ortak)

- **Header:** Logo + navigasyon (Anasayfa, Ürünler, Karşılaştır, Hakkımızda, İletişim) +
  dil seçici placeholder (TR/EN/AR — şimdilik sadece görsel, işlevsel olmasına gerek yok)
- **Footer:** İletişim bilgileri (`urunler.json` → `kurumsal_bilgiler`), sertifika
  rozetleri, yasal sayfa linkleri
- **WhatsApp butonu:** Sağ-alt köşede sabit, `kurumsal_bilgiler.whatsapp` numarasına
  `https://wa.me/905320659117` formatında link

## Fiyat Politikası (kesinlikle uygulanacak)

`urunler.json` → `kurumsal_bilgiler.fiyat_politikasi` alanında belirtildiği gibi: **sitenin
hiçbir sayfasında, hiçbir ürün için fiyat gösterilmeyecek.** "Sepete Ekle/Satın Al" butonu
olmayacak, sadece "Teklif Al" ve "Karşılaştır".

## Bu Aşamada Yapılmayacaklar

- EN/AR içerik üretme (sadece dil seçici UI'da görünsün, içerik tek dil TR)
- Gerçek email/SMTP/PDF gönderimi (form şimdilik mock/placeholder submit davranışı yeterli)
- İl/ilçe SEO sayfaları (81 il + ilçeler) — sonraki aşama
- Blog sistemi — sonraki aşama
- Gerçek ürün fotoğrafları — placeholder kalacak, kullanıcı kendisi ekleyecek

---

**Sıradaki adım:** Bu yapı kurulduktan sonra, kullanıcı (Duru ekibi) ürün görsellerini ve
ek içerikleri (geniş açıklama metinleri, SSS, il/ilçe sayfaları, blog) adım adım, mevcut
sayfaları düzenleyerek ekleyecek. Bu yüzden HTML'in **temiz, okunabilir, yorum satırlarıyla
işaretlenmiş** (`<!-- ÜRÜN GÖRSELİ: buraya eklenecek -->`, `<!-- GENİŞ AÇIKLAMA: buraya
gelecek -->` gibi) olması, sonraki manuel düzenlemeleri kolaylaştıracaktır.
