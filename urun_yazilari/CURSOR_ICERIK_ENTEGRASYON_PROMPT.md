# DURU ULV — Cursor Prompt: SEO İçeriklerini Siteye Entegre Et

## Bağlam

Bu projede zaten bir site iskeleti var (emergent.sh referansından statik HTML olarak
inşa edildi — anasayfa, kategori sayfaları, ürün sayfaları, karşılaştırma, teklif formu
vb. çalışıyor). Şimdi indirdiğim dosya paketini bu siteye **içerik olarak** entegre
etmeni istiyorum. Bu bir tasarım/yapı değişikliği değil, **içerik doldurma** görevi.

## Bu Görevde 2 Farklı İşlem Var — İkisini de Eksiksiz Yap

| | Ürün sayfaları | Blog sayfaları |
|---|---|---|
| **Durum** | Sayfalar **zaten mevcut** (önceden kurulmuş) | Sayfalar **muhtemelen henüz yok** |
| **Senin işin** | Mevcut sayfaya **içerik enjekte etmek** (var olan placeholder/boş alanları doldurmak) | **Sıfırdan yeni sayfa oluşturmak** (11 yeni HTML dosyası + varsa `/blog/` liste sayfasına kart ekleme) |
| **Kontrol** | Önce `urunler.json`'daki slug'la eşleşen `/urunler/[kategori]/[urun]/index.html` dosyasını bul | Önce projede `/blog/` klasörü/route'u var mı diye kontrol et — **varsa o yapıyı kullan, yoksa kur** |

⚠️ Bu ikisi birbirinden bağımsız 2 ayrı iş — sadece ürün sayfalarını doldurup blogları
atlama, ya da tam tersi yapma. Aşağıdaki Bölüm 1 ve Bölüm 2'nin **ikisini de** uygula.

## Elimdeki Dosyalar (hepsi proje kökündeki `urun_yazilari/` klasöründe)

1. **`urunler.json`** — kataloğun 18 ürününün tam verisi (isim, kategori, slug, teknik
   tablo). Bu dosya muhtemelen projede başka bir yerde (örn. `assets/data/`) zaten
   kullanılıyor; `urun_yazilari/` içindeki kopya sadece referans amaçlı, oradan okuyup
   karşılaştır ama projenin asıl veri kaynağını değiştirme.

2. **Ürün SEO metinleri** (`urun_yazilari/` içinde, 4 dosya, toplam 18 ürün — kataloğun
   tamamı):
   - `urun-metinleri-1-parti.md` → Duru HD50, Duru HD5, Duru X20 (Araç Üzeri + El Tipi)
   - `01-arac-uzeri-kalan.md` → Duru Mist Blower 15HP, Duru HD1800, Duru HD75
   - `02-sera-tipi.md` → Entosis 50, Sera Max 50, Sera Ultra 20, Entosis 20, Sera Plus 20
   - `03-sirt-tipi.md` → Duru Sırt10
   - `04-el-tipi-kalan.md` → Duru HR5, Duru Max5, Duru Plus, Duru X10, Duru Max10

3. **Blog yazıları** (`urun_yazilari/` içinde, 4 dosya, toplam 11 yazı):
   - `01-faz1-temel-egitici.md` → 4 yazı (ULV nedir, mist blower farkı, belediye seçim
     kriterleri, belediye ilaçlaması neden yetersiz)
   - `02-faz2-sorun-cozum.md` → 2 yazı (sera zararlıları karşılaştırması, mikron çapı)
   - `03-faz3-kurumsal-otorite.md` → 3 yazı (36 yıllık hikaye, alırken 7 soru, ISO/CE
     sertifikaları)
   - `04-faz4-mevsimsel.md` → 2 yazı (yaz öncesi belediye hazırlığı, sonbahar sera
     bakımı — bu ikisinde yayın zamanlaması önerisi de var, dosyada işaretli)

4. **`RANKMATH_STANDART.md`** (`urun_yazilari/` içinde) — her metnin neden bu formatta
   (SEO Başlığı / Meta Açıklama / Odak Anahtar Kelime / Ek Anahtar Kelimeler + gövde)
   yazıldığını açıklayan referans doküman. Bunu **ilk iş olarak** oku, format mantığını
   anla, sonra diğer dosyalara geç.

> 📁 **Önemli:** `urun_yazilari/` klasörü sadece **kaynak içerik** klasörü — nihai
> sitenin bir parçası değil. İçeriği oradan okuyup ilgili sayfalara işledikten sonra,
> bu klasörü projenin canlı/yayın dizininde (örn. `public_html`, `dist`, `build`)
> bulundurmana gerek yok; sadece geliştirme ortamında kalması yeterli.

## Her Ürün/Blog Dosyasının İç Yapısı (önemli — nasıl parse edeceğini anlamak için)

Her ürün veya blog bölümü şu sabit formatta:

```
## [Başlık]

\`\`\`
SEO Başlığı:        ...
Meta Açıklama:       ...
Odak Anahtar Kelime: ...
Ek Anahtar Kelimeler: ...
Görsel alt metni:    ...
\`\`\`

### [Halk dili H1]
[gövde paragrafı]

### [İkinci H2]
[gövde paragrafı]

... (devamı)

### Sıkça Sorulan Sorular
**Soru?** Cevap.
```

Yani her blok kendi kod içindeki meta verisini taşıyor, sonrasında gerçek sayfa
içeriği (H2'ler + paragraflar + SSS) geliyor.

## Yapman Gerekenler

### 1. Ürün Sayfalarına İçerik Yerleştirme

Her ürün dosyasındaki her bölüm için, `urunler.json`'daki ilgili ürünün `slug`'ını
bularak doğru ürün sayfasına (`/urunler/[kategori-slug]/[urun-slug]/index.html`) git ve:

- **`<title>`** etiketine "SEO Başlığı" değerini yaz
- **`<meta name="description">`** etiketine "Meta Açıklama" değerini yaz
- Sayfanın "geniş açıklama metni" / placeholder içerik bloğuna, kod bloğundan sonraki
  tüm `### ` başlıklı bölümleri (Nedir? → Nerelerde Kullanılır? → Teknik Üstünlükler →
  Fiyat ve Teklif Süreci) `<h2>` + `<p>` olarak yerleştir
- "Sıkça Sorulan Sorular" bölümünü, sayfadaki mevcut akordeon/FAQ bileşenine
  (`data-accordion` yapısı zaten var) soru-cevap çiftleri olarak ekle
- Ana ürün görselinin `alt` özniteliğini dosyadaki "Görsel alt metni" değeriyle güncelle
- Metin içindeki `[...](...)` formatındaki markdown linkleri gerçek `<a href="...">`
  etiketine çevir (bunlar ilgili kategori/ürün sayfalarına iç link, zaten doğru
  göreli yollarla yazıldı — örn. `/urunler/sera-tipi-ulv-ilaclama/sera-max-50/`)
- Eğer kullandığın bir SEO eklentisi/meta yönetim sistemi varsa (örn. bir JSON/config
  dosyasında SEO verisi tutuyorsanız), "Odak Anahtar Kelime" ve "Ek Anahtar Kelimeler"
  değerlerini de oraya işle; yoksa bunları `<meta name="keywords">` veya schema.org
  `Product` açıklamasında referans olarak kullanabilirsin

### 2. Blog Sayfaları Oluşturma (11 yeni sayfa — muhtemelen sıfırdan)

Önce projede `/blog/` için zaten bir klasör/route/şablon olup olmadığını kontrol et.
**Yoksa** (büyük ihtimalle yok, çünkü bu site iskeletinde blog bölümü henüz
kurulmamıştı), bu bölümü **sıfırdan sen kuracaksın**: bir blog liste sayfası
(`/blog/index.html`) ve 11 ayrı yazı sayfası. Varsa, mevcut yapıyı kullan. Her iki
durumda da, **her 11 blog yazısı için ayrı bir sayfa oluşturulmuş olmalı** — bu adım
atlanabilir değil.

Her blog yazısı için:

- `/blog/[slug]/index.html` şeklinde bir sayfa oluştur (slug'ı başlıktan türet, örn.
  "ULV İlaçlama Nedir? Soğuk Sisleme ile Farkı Nelerdir?" → `ulv-ilaclama-nedir/`)
- Sayfanın `<title>` ve `<meta name="description">` etiketlerini dosyadaki "SEO Başlığı"
  ve "Meta Açıklama" değerleriyle doldur
- Gövde içeriğini (`### ` başlıkları `<h2>`, paragrafları `<p>` olarak) sayfaya yerleştir
- **ÖNEMLİ — yazar imzası YOK:** Blog sayfasında "yazar adı", "yazar avatarı" veya
  kişiye ait bir imza alanı OLMAYACAK. Bunun yerine sayfanın üstünde/altında sade bir
  "Duru U.L.V. Teknoloji Sistemleri" rozeti/etiketi olacak (logo + marka adı + tarih).
  Eğer schema.org `BlogPosting`/`Article` işaretlemesi ekliyorsan, `author` alanını bir
  kişi değil **`Organization`** tipi olarak işaretle (örn. `"author": {"@type":
  "Organization", "name": "Duru U.L.V. Teknoloji Sistemleri"}`)
- `/blog/` ana liste sayfası varsa, oraya da bu 11 yazının kartlarını ekle
- 04-faz4-mevsimsel.md dosyasındaki 2 yazıda "Yayın zamanlaması önerisi" notu var
  (şubat-mart ve eylül-ekim) — bu notu sayfaya basma, sadece senin (geliştiricinin)
  bilgisi için, yayın tarihini buna göre ayarlamak istersem ben sana ayrıca söylerim;
  şimdilik hepsini aynı anda yayına alabilirsin

### 3. İç Linkleri Kontrol Et

Metinlerdeki markdown linkler (`[Sera Max 50](/urunler/sera-tipi-ulv-ilaclama/sera-max-50/)`
gibi) zaten doğru slug'larla yazıldı, ama yine de siteye yerleştirirken şu yolların
gerçekten var olan sayfalarla eşleştiğini doğrula:
- `/urunler/[kategori]/` kategori sayfaları
- `/urunler/[kategori]/[urun]/` ürün sayfaları
- `/fiyat-teklifi/` teklif formu
- `/iletisim/` iletişim sayfası

Eğer bir link hedefi henüz yoksa (örn. blog ana liste sayfası), o sayfayı da oluştur.

### 4. Dış (Otorite) Linkler

Bazı metinlerde dış link var (örn. `[Dünya Sağlık Örgütü'nün önerdiği ULV ilaçlama
kriterlerine](https://www.who.int/)`, `[T.C. Gıda Tarım ve Hayvancılık
Bakanlığı'nın](https://www.tarimorman.gov.tr/)`). Bunları `target="_blank"
rel="noopener"` ile yeni sekmede açılacak şekilde işaretle — bunlar gerçek, resmi kurum
siteleri, değiştirme.

### 5. Fiyat Politikası — Tekrar Kontrol

Hiçbir ürün metninde fiyat rakamı YOK (bilerek böyle yazıldı) — sadece "Teklif Al"
CTA'sına yönlendirme var. Sayfaya yerleştirirken bu CTA'nın gerçek "Teklif Al" butonuna
(zaten sitede var olan) bağlandığından emin ol, yeni bir buton icat etme.

## Kontrol Listesi (işin bitince kendi kendine doğrula — hem enjeksiyon hem yeni sayfa oluşturma adımlarını kapsar)

- [ ] 18 ürünün hepsinde `<title>` ve `<meta description>` güncellendi mi?
- [ ] 18 ürünün hepsinde gövde içeriği (Nedir/Nerelerde Kullanılır/Teknik/Fiyat/SSS)
      yerleşti mi?
- [ ] 11 blog yazısının **11'i de yeni HTML sayfası olarak oluşturuldu mu** (sıfırdan
      kurulmuş `/blog/` yapısı dahil), hepsinde yazar imzası YOK mu?
- [ ] `/blog/` liste/ana sayfası, bu 11 yazıya link veren kartları içeriyor mu?
- [ ] Markdown linkler gerçek `<a>` etiketine çevrildi mi, hedefler doğru mu?
- [ ] Görsel `alt` metinleri güncellendi mi?
- [ ] Hiçbir sayfada fiyat rakamı yok, hepsi "Teklif Al"a yönlendiriyor mu?

Bu işlemi tamamladıktan sonra bana hangi sayfaların güncellendiğini ve varsa
eşleşmeyen/eksik kalan bir link veya slug olup olmadığını özetle.
