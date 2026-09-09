# Duru ULV — Teknik SEO Denetim Raporu

- **Tarih:** 2026-09-09
- **Kapsam:** Salt okuma denetimi (kaynak dosyalar değiştirilmedi; yalnızca bu rapor yazıldı)
- **Origin:** https://www.duruulvteknoloji.com.tr
- **HTML dosya sayısı:** 241
- **Sitemap:** `sitemap.xml` (162 `<loc>`)
- **Sitemap dışı bırakılan (bilinçli/teknik):** 80 (redirect stub ≈ 66, api/outbox, 404, google verify, tesekkurler, kök index çift sayımı)

---

## 1. Sitemap ↔ Gerçek Sayfa Uyuşmazlığı

### 1a. Sitemap’te var, gerçek sayfa yok (orphan — 404 riski)

**Toplam:** 0

_Sorun bulunamadı._


### 1b. Sayfa var, sitemap’te yok (kanonik public sayfalar)

**Toplam:** 0

_Kanonik public `index.html` seti ile sitemap `<loc>` sayısı birebir: her ikisi de ~162. Meta-refresh stub’lar, `api/outbox/**`, `404`, Google verify ve `tesekkurler` bu listeden çıkarıldı._

_Sorun bulunamadı._


### 1c. Search Console riski — dosya var ama sitemap’te yok (redirect stub / teknik)

Bu URL’ler diskte gerçek HTML olarak duruyor; Google iç link veya eski URL ile keşfedebilir, sitemap’te yoktur. Search Console’daki “Sayfa sitemap’te yok / keşfedildi ama dizine eklenmedi” sinyallerinin ana adayları bunlar.

**Toplam (redirect stub):** 66

- `ar/about/index.html` → `https://www.duruulvteknoloji.com.tr/ar/about/`
- `ar/contact/index.html` → `https://www.duruulvteknoloji.com.tr/ar/contact/`
- `ar/quality-policy/index.html` → `https://www.duruulvteknoloji.com.tr/ar/quality-policy/`
- `ar/urunler/arac-uzeri-ilaclama/duru-hd1800/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/arac-uzeri-ilaclama/duru-hd1800/`
- `ar/urunler/arac-uzeri-ilaclama/duru-hd50/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/arac-uzeri-ilaclama/duru-hd50/`
- `ar/urunler/arac-uzeri-ilaclama/duru-hd75/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/arac-uzeri-ilaclama/duru-hd75/`
- `ar/urunler/arac-uzeri-ilaclama/duru-mist-blower-15hp/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/arac-uzeri-ilaclama/duru-mist-blower-15hp/`
- `ar/urunler/arac-uzeri-ilaclama/entosis-mist-blower-500l/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/arac-uzeri-ilaclama/entosis-mist-blower-500l/`
- `ar/urunler/arac-uzeri-ilaclama/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/arac-uzeri-ilaclama/`
- `ar/urunler/el-tipi-ulv-ilaclama/duru-hd5/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/el-tipi-ulv-ilaclama/duru-hd5/`
- `ar/urunler/el-tipi-ulv-ilaclama/duru-hr5/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/el-tipi-ulv-ilaclama/duru-hr5/`
- `ar/urunler/el-tipi-ulv-ilaclama/duru-max10/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/el-tipi-ulv-ilaclama/duru-max10/`
- `ar/urunler/el-tipi-ulv-ilaclama/duru-max5/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/el-tipi-ulv-ilaclama/duru-max5/`
- `ar/urunler/el-tipi-ulv-ilaclama/duru-plus/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/el-tipi-ulv-ilaclama/duru-plus/`
- `ar/urunler/el-tipi-ulv-ilaclama/duru-x10/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/el-tipi-ulv-ilaclama/duru-x10/`
- `ar/urunler/el-tipi-ulv-ilaclama/duru-x20/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/el-tipi-ulv-ilaclama/duru-x20/`
- `ar/urunler/el-tipi-ulv-ilaclama/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/el-tipi-ulv-ilaclama/`
- `ar/urunler/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/`
- `ar/urunler/nemlendirme-ulv/duru-dmxl/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/nemlendirme-ulv/duru-dmxl/`
- `ar/urunler/nemlendirme-ulv/duru-mxl/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/nemlendirme-ulv/duru-mxl/`
- `ar/urunler/nemlendirme-ulv/duru-mxl-hgs/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/nemlendirme-ulv/duru-mxl-hgs/`
- `ar/urunler/nemlendirme-ulv/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/nemlendirme-ulv/`
- `ar/urunler/sera-tipi-ulv-ilaclama/entosis-20/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/sera-tipi-ulv-ilaclama/entosis-20/`
- `ar/urunler/sera-tipi-ulv-ilaclama/entosis-50/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/sera-tipi-ulv-ilaclama/entosis-50/`
- `ar/urunler/sera-tipi-ulv-ilaclama/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/sera-tipi-ulv-ilaclama/`
- `ar/urunler/sera-tipi-ulv-ilaclama/sera-max-50/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/sera-tipi-ulv-ilaclama/sera-max-50/`
- `ar/urunler/sera-tipi-ulv-ilaclama/sera-plus-20/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/sera-tipi-ulv-ilaclama/sera-plus-20/`
- `ar/urunler/sera-tipi-ulv-ilaclama/sera-ultra-20/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/sera-tipi-ulv-ilaclama/sera-ultra-20/`
- `ar/urunler/sirt-tipi-ulv-ilaclama/duru-sirt10/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/sirt-tipi-ulv-ilaclama/duru-sirt10/`
- `ar/urunler/sirt-tipi-ulv-ilaclama/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/sirt-tipi-ulv-ilaclama/`
- `ar/urunler/termal-sisleme/duru-k100/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/termal-sisleme/duru-k100/`
- `ar/urunler/termal-sisleme/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/termal-sisleme/`
- `ar/urunler/termal-sisleme/termal-el-tipi/index.html` → `https://www.duruulvteknoloji.com.tr/ar/urunler/termal-sisleme/termal-el-tipi/`
- `en/about/index.html` → `https://www.duruulvteknoloji.com.tr/en/about/`
- `en/contact/index.html` → `https://www.duruulvteknoloji.com.tr/en/contact/`
- `en/quality-policy/index.html` → `https://www.duruulvteknoloji.com.tr/en/quality-policy/`
- `en/urunler/arac-uzeri-ilaclama/duru-hd1800/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/arac-uzeri-ilaclama/duru-hd1800/`
- `en/urunler/arac-uzeri-ilaclama/duru-hd50/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/arac-uzeri-ilaclama/duru-hd50/`
- `en/urunler/arac-uzeri-ilaclama/duru-hd75/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/arac-uzeri-ilaclama/duru-hd75/`
- `en/urunler/arac-uzeri-ilaclama/duru-mist-blower-15hp/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/arac-uzeri-ilaclama/duru-mist-blower-15hp/`
- `en/urunler/arac-uzeri-ilaclama/entosis-mist-blower-500l/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/arac-uzeri-ilaclama/entosis-mist-blower-500l/`
- `en/urunler/arac-uzeri-ilaclama/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/arac-uzeri-ilaclama/`
- `en/urunler/el-tipi-ulv-ilaclama/duru-hd5/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/el-tipi-ulv-ilaclama/duru-hd5/`
- `en/urunler/el-tipi-ulv-ilaclama/duru-hr5/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/el-tipi-ulv-ilaclama/duru-hr5/`
- `en/urunler/el-tipi-ulv-ilaclama/duru-max10/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/el-tipi-ulv-ilaclama/duru-max10/`
- `en/urunler/el-tipi-ulv-ilaclama/duru-max5/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/el-tipi-ulv-ilaclama/duru-max5/`
- `en/urunler/el-tipi-ulv-ilaclama/duru-plus/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/el-tipi-ulv-ilaclama/duru-plus/`
- `en/urunler/el-tipi-ulv-ilaclama/duru-x10/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/el-tipi-ulv-ilaclama/duru-x10/`
- `en/urunler/el-tipi-ulv-ilaclama/duru-x20/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/el-tipi-ulv-ilaclama/duru-x20/`
- `en/urunler/el-tipi-ulv-ilaclama/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/el-tipi-ulv-ilaclama/`
- `en/urunler/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/`
- `en/urunler/nemlendirme-ulv/duru-dmxl/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/nemlendirme-ulv/duru-dmxl/`
- `en/urunler/nemlendirme-ulv/duru-mxl/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/nemlendirme-ulv/duru-mxl/`
- `en/urunler/nemlendirme-ulv/duru-mxl-hgs/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/nemlendirme-ulv/duru-mxl-hgs/`
- `en/urunler/nemlendirme-ulv/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/nemlendirme-ulv/`
- `en/urunler/sera-tipi-ulv-ilaclama/entosis-20/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/sera-tipi-ulv-ilaclama/entosis-20/`
- `en/urunler/sera-tipi-ulv-ilaclama/entosis-50/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/sera-tipi-ulv-ilaclama/entosis-50/`
- `en/urunler/sera-tipi-ulv-ilaclama/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/sera-tipi-ulv-ilaclama/`
- `en/urunler/sera-tipi-ulv-ilaclama/sera-max-50/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/sera-tipi-ulv-ilaclama/sera-max-50/`
- `en/urunler/sera-tipi-ulv-ilaclama/sera-plus-20/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/sera-tipi-ulv-ilaclama/sera-plus-20/`
- `en/urunler/sera-tipi-ulv-ilaclama/sera-ultra-20/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/sera-tipi-ulv-ilaclama/sera-ultra-20/`
- `en/urunler/sirt-tipi-ulv-ilaclama/duru-sirt10/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/sirt-tipi-ulv-ilaclama/duru-sirt10/`
- `en/urunler/sirt-tipi-ulv-ilaclama/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/sirt-tipi-ulv-ilaclama/`
- `en/urunler/termal-sisleme/duru-k100/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/termal-sisleme/duru-k100/`
- `en/urunler/termal-sisleme/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/termal-sisleme/`
- `en/urunler/termal-sisleme/termal-el-tipi/index.html` → `https://www.duruulvteknoloji.com.tr/en/urunler/termal-sisleme/termal-el-tipi/`


### 1d. Sitemap dışı bırakılan diğer örnekler (referans)

- `404.html` → 404 sayfası
- `api/outbox/failed-2026-06-30-080240.html` → API/outbox (public indexlenecek sayfa değil)
- `api/outbox/quote-2026-06-30-080319-Test.html` → API/outbox (public indexlenecek sayfa değil)
- `api/outbox/quote-2026-06-30-080328-Test.html` → API/outbox (public indexlenecek sayfa değil)
- `api/outbox/quote-2026-06-30-084826-mostar-bas-m.html` → API/outbox (public indexlenecek sayfa değil)
- `api/outbox/quote-2026-06-30-085242-mostar-bas-m.html` → API/outbox (public indexlenecek sayfa değil)
- `api/outbox/quote-2026-06-30-085508-mostar-bas-m.html` → API/outbox (public indexlenecek sayfa değil)
- `ar/404.html` → 404 sayfası
- `ar/about/index.html` → meta-refresh redirect stub
- `ar/contact/index.html` → meta-refresh redirect stub
- `ar/quality-policy/index.html` → meta-refresh redirect stub
- `ar/tesekkurler/index.html` → teşekkür (genelde noindex)
- `ar/urunler/arac-uzeri-ilaclama/duru-hd1800/index.html` → meta-refresh redirect stub
- `ar/urunler/arac-uzeri-ilaclama/duru-hd50/index.html` → meta-refresh redirect stub
- `ar/urunler/arac-uzeri-ilaclama/duru-hd75/index.html` → meta-refresh redirect stub
- `ar/urunler/arac-uzeri-ilaclama/duru-mist-blower-15hp/index.html` → meta-refresh redirect stub
- `ar/urunler/arac-uzeri-ilaclama/entosis-mist-blower-500l/index.html` → meta-refresh redirect stub
- `ar/urunler/arac-uzeri-ilaclama/index.html` → meta-refresh redirect stub
- `ar/urunler/el-tipi-ulv-ilaclama/duru-hd5/index.html` → meta-refresh redirect stub
- `ar/urunler/el-tipi-ulv-ilaclama/duru-hr5/index.html` → meta-refresh redirect stub
- `ar/urunler/el-tipi-ulv-ilaclama/duru-max10/index.html` → meta-refresh redirect stub
- `ar/urunler/el-tipi-ulv-ilaclama/duru-max5/index.html` → meta-refresh redirect stub
- `ar/urunler/el-tipi-ulv-ilaclama/duru-plus/index.html` → meta-refresh redirect stub
- `ar/urunler/el-tipi-ulv-ilaclama/duru-x10/index.html` → meta-refresh redirect stub
- `ar/urunler/el-tipi-ulv-ilaclama/duru-x20/index.html` → meta-refresh redirect stub
- `ar/urunler/el-tipi-ulv-ilaclama/index.html` → meta-refresh redirect stub
- `ar/urunler/index.html` → meta-refresh redirect stub
- `ar/urunler/nemlendirme-ulv/duru-dmxl/index.html` → meta-refresh redirect stub
- `ar/urunler/nemlendirme-ulv/duru-mxl/index.html` → meta-refresh redirect stub
- `ar/urunler/nemlendirme-ulv/duru-mxl-hgs/index.html` → meta-refresh redirect stub
- `ar/urunler/nemlendirme-ulv/index.html` → meta-refresh redirect stub
- `ar/urunler/sera-tipi-ulv-ilaclama/entosis-20/index.html` → meta-refresh redirect stub
- `ar/urunler/sera-tipi-ulv-ilaclama/entosis-50/index.html` → meta-refresh redirect stub
- `ar/urunler/sera-tipi-ulv-ilaclama/index.html` → meta-refresh redirect stub
- `ar/urunler/sera-tipi-ulv-ilaclama/sera-max-50/index.html` → meta-refresh redirect stub
- `ar/urunler/sera-tipi-ulv-ilaclama/sera-plus-20/index.html` → meta-refresh redirect stub
- `ar/urunler/sera-tipi-ulv-ilaclama/sera-ultra-20/index.html` → meta-refresh redirect stub
- `ar/urunler/sirt-tipi-ulv-ilaclama/duru-sirt10/index.html` → meta-refresh redirect stub
- `ar/urunler/sirt-tipi-ulv-ilaclama/index.html` → meta-refresh redirect stub
- `ar/urunler/termal-sisleme/duru-k100/index.html` → meta-refresh redirect stub


## 2. İç Linklerde `/index.html` Sorunu

### 2a. `<a href>` içinde `index.html`

**Toplam:** 7665

_Site genelinde göreli navigasyon `…/index.html` kullanıyor; sunucu `/path/` → dosya eşlemesi yapıyorsa çoğu 200 döner, ancak Search Console’da temiz URL ile `/index.html` ayrı sinyaller üretebilir._

- `404.html:38` → `index.html`
- `404.html:42` → `index.html`
- `404.html:43` → `urunler/index.html`
- `404.html:44` → `katalog/index.html`
- `404.html:45` → `blog/index.html`
- `404.html:46` → `urun-karsilastirma/index.html`
- `404.html:47` → `hakkimizda/index.html`
- `404.html:48` → `iletisim/index.html`
- `404.html:51` → `index.html`
- `404.html:51` → `index.html`
- `404.html:52` → `fiyat-teklifi/index.html`
- `404.html:58` → `index.html`
- `404.html:58` → `index.html`
- `404.html:59` → `index.html`
- `404.html:60` → `urunler/index.html`
- `404.html:61` → `katalog/index.html`
- `404.html:62` → `blog/index.html`
- `404.html:63` → `urun-karsilastirma/index.html`
- `404.html:64` → `hakkimizda/index.html`
- `404.html:65` → `iletisim/index.html`
- `404.html:66` → `fiyat-teklifi/index.html`
- `404.html:79` → `index.html`
- `404.html:80` → `urunler/index.html`
- `404.html:81` → `iletisim/index.html`
- `404.html:90` → `index.html`
- `404.html:99` → `index.html`
- `404.html:100` → `urunler/index.html`
- `404.html:101` → `katalog/index.html`
- `404.html:102` → `blog/index.html`
- `404.html:103` → `urun-karsilastirma/index.html`
- `404.html:104` → `hakkimizda/index.html`
- `404.html:105` → `kalite-politikamiz/index.html`
- `404.html:106` → `iletisim/index.html`
- `404.html:132` → `gizlilik-politikasi/index.html`
- `404.html:133` → `kvkk/index.html`
- `404.html:134` → `kullanim-kosullari/index.html`
- `api/outbox/quote-2026-06-30-084826-mostar-bas-m.html:1` → `http://localhost:8080/urunler/sera-tipi-ulv-ilaclama/entosis-50/index.html`
- `api/outbox/quote-2026-06-30-084826-mostar-bas-m.html:1` → `http://localhost:8080/urunler/sera-tipi-ulv-ilaclama/sera-max-50/index.html`
- `api/outbox/quote-2026-06-30-084826-mostar-bas-m.html:1` → `http://localhost:8080/urunler/sera-tipi-ulv-ilaclama/sera-ultra-20/index.html`
- `api/outbox/quote-2026-06-30-085242-mostar-bas-m.html:1` → `http://localhost:8080/urunler/sera-tipi-ulv-ilaclama/sera-ultra-20/index.html`
- `api/outbox/quote-2026-06-30-085508-mostar-bas-m.html:1` → `http://localhost:8080/urunler/sera-tipi-ulv-ilaclama/entosis-50/index.html`
- `api/outbox/quote-2026-06-30-085508-mostar-bas-m.html:1` → `http://localhost:8080/urunler/sera-tipi-ulv-ilaclama/sera-max-50/index.html`
- `api/outbox/quote-2026-06-30-085508-mostar-bas-m.html:1` → `http://localhost:8080/urunler/sera-tipi-ulv-ilaclama/sera-ultra-20/index.html`
- `ar/about/index.html:43` → `../../ar/index.html`
- `ar/about/index.html:47` → `../../ar/index.html`
- `ar/about/index.html:48` → `../../ar/products/index.html`
- `ar/about/index.html:49` → `../../ar/katalog/index.html`
- `ar/about/index.html:50` → `../../ar/blog/index.html`
- `ar/about/index.html:51` → `../../ar/urun-karsilastirma/index.html`
- `ar/about/index.html:52` → `../../ar/hakkimizda/index.html`
- `ar/about/index.html:53` → `../../ar/iletisim/index.html`
- `ar/about/index.html:56` → `../../hakkimizda/index.html`
- `ar/about/index.html:56` → `../../en/hakkimizda/index.html`
- `ar/about/index.html:57` → `../../ar/fiyat-teklifi/index.html`
- `ar/about/index.html:63` → `../../hakkimizda/index.html`
- `ar/about/index.html:63` → `../../en/hakkimizda/index.html`
- `ar/about/index.html:64` → `../../ar/index.html`
- `ar/about/index.html:65` → `../../ar/products/index.html`
- `ar/about/index.html:66` → `../../ar/katalog/index.html`
- `ar/about/index.html:67` → `../../ar/blog/index.html`
- `ar/about/index.html:68` → `../../ar/urun-karsilastirma/index.html`
- `ar/about/index.html:69` → `../../ar/hakkimizda/index.html`
- `ar/about/index.html:70` → `../../ar/iletisim/index.html`
- `ar/about/index.html:71` → `../../ar/fiyat-teklifi/index.html`
- `ar/about/index.html:87` → `../../ar/fiyat-teklifi/index.html`
- `ar/about/index.html:170` → `../../ar/kalite-politikamiz/index.html`
- `ar/about/index.html:178` → `../../ar/index.html`
- `ar/about/index.html:187` → `../../ar/index.html`
- `ar/about/index.html:188` → `../../ar/products/index.html`
- `ar/about/index.html:189` → `../../ar/katalog/index.html`
- `ar/about/index.html:190` → `../../ar/blog/index.html`
- `ar/about/index.html:191` → `../../ar/urun-karsilastirma/index.html`
- `ar/about/index.html:192` → `../../ar/hakkimizda/index.html`
- `ar/about/index.html:193` → `../../ar/kalite-politikamiz/index.html`
- `ar/about/index.html:194` → `../../ar/iletisim/index.html`
- `ar/about/index.html:220` → `../../ar/gizlilik-politikasi/index.html`
- `ar/about/index.html:221` → `../../ar/kvkk/index.html`
- `ar/about/index.html:222` → `../../ar/kullanim-kosullari/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:45` → `../../../ar/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:49` → `../../../ar/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:50` → `../../../ar/products/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:51` → `../../../ar/katalog/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:52` → `../../../ar/blog/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:53` → `../../../ar/urun-karsilastirma/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:54` → `../../../ar/hakkimizda/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:55` → `../../../ar/iletisim/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:58` → `../../../blog/belediye-ilaclama-ekipmani-secimi/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:58` → `../../../en/blog/belediye-ilaclama-ekipmani-secimi/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:59` → `../../../ar/fiyat-teklifi/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:65` → `../../../blog/belediye-ilaclama-ekipmani-secimi/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:65` → `../../../en/blog/belediye-ilaclama-ekipmani-secimi/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:66` → `../../../ar/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:67` → `../../../ar/products/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:68` → `../../../ar/katalog/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:69` → `../../../ar/blog/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:70` → `../../../ar/urun-karsilastirma/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:71` → `../../../ar/hakkimizda/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:72` → `../../../ar/iletisim/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:73` → `../../../ar/fiyat-teklifi/index.html`
- `ar/blog/belediye-ilaclama-ekipmani-secimi/index.html:81` → `../../../ar/index.html`

_… ve 7565 kayıt daha (toplam 7665)._


### 2b. Hreflang içinde `index.html`

**Toplam:** 0

_Sorun bulunamadı._


### 2c. Canonical içinde `index.html`

**Toplam:** 0

_Sorun bulunamadı._


## 3. Canonical Etiket Tutarlılığı

Beklenen temiz URL = dosya yolundan türetilen `https://www.duruulvteknoloji.com.tr/…/` (kök için `/`).

**Toplam sorun:** 6

- `ar/about/index.html:10` — canonical uyuşmuyor: https://www.duruulvteknoloji.com.tr/ar/about/  
  Beklenen: `https://www.duruulvteknoloji.com.tr/ar/hakkimizda/`
- `ar/contact/index.html:10` — canonical uyuşmuyor: https://www.duruulvteknoloji.com.tr/ar/contact/  
  Beklenen: `https://www.duruulvteknoloji.com.tr/ar/iletisim/`
- `ar/quality-policy/index.html:10` — canonical uyuşmuyor: https://www.duruulvteknoloji.com.tr/ar/quality-policy/  
  Beklenen: `https://www.duruulvteknoloji.com.tr/ar/kalite-politikamiz/`
- `en/about/index.html:10` — canonical uyuşmuyor: https://www.duruulvteknoloji.com.tr/en/about/  
  Beklenen: `https://www.duruulvteknoloji.com.tr/en/hakkimizda/`
- `en/contact/index.html:10` — canonical uyuşmuyor: https://www.duruulvteknoloji.com.tr/en/contact/  
  Beklenen: `https://www.duruulvteknoloji.com.tr/en/iletisim/`
- `en/quality-policy/index.html:10` — canonical uyuşmuyor: https://www.duruulvteknoloji.com.tr/en/quality-policy/  
  Beklenen: `https://www.duruulvteknoloji.com.tr/en/kalite-politikamiz/`


## 4. Hreflang Bütünlüğü

### 4a. Hedef dosya yok

**Toplam:** 0

_Sorun bulunamadı._


### 4b. Karşılıklılık (reciprocity) eksik

**Toplam:** 16

- `ar/about/index.html:11` `/ar/about/` → `/hakkimizda/` (tr): /hakkimizda/ geri hreflang ile /ar/about/ işaret etmiyor
- `ar/about/index.html:12` `/ar/about/` → `/en/hakkimizda/` (en): /en/hakkimizda/ geri hreflang ile /ar/about/ işaret etmiyor
- `ar/about/index.html:13` `/ar/about/` → `/ar/hakkimizda/` (ar): /ar/hakkimizda/ geri hreflang ile /ar/about/ işaret etmiyor
- `ar/contact/index.html:11` `/ar/contact/` → `/iletisim/` (tr): /iletisim/ geri hreflang ile /ar/contact/ işaret etmiyor
- `ar/contact/index.html:12` `/ar/contact/` → `/en/iletisim/` (en): /en/iletisim/ geri hreflang ile /ar/contact/ işaret etmiyor
- `ar/contact/index.html:13` `/ar/contact/` → `/ar/iletisim/` (ar): /ar/iletisim/ geri hreflang ile /ar/contact/ işaret etmiyor
- `ar/quality-policy/index.html:11` `/ar/quality-policy/` → `/kalite-politikamiz/` (tr): /kalite-politikamiz/ geri hreflang ile /ar/quality-policy/ işaret etmiyor
- `ar/quality-policy/index.html:12` `/ar/quality-policy/` → `/en/kalite-politikamiz/` (en): /en/kalite-politikamiz/ geri hreflang ile /ar/quality-policy/ işaret etmiyor
- `en/about/index.html:11` `/en/about/` → `/hakkimizda/` (tr): /hakkimizda/ geri hreflang ile /en/about/ işaret etmiyor
- `en/about/index.html:12` `/en/about/` → `/en/hakkimizda/` (en): /en/hakkimizda/ geri hreflang ile /en/about/ işaret etmiyor
- `en/about/index.html:13` `/en/about/` → `/ar/hakkimizda/` (ar): /ar/hakkimizda/ geri hreflang ile /en/about/ işaret etmiyor
- `en/contact/index.html:11` `/en/contact/` → `/iletisim/` (tr): /iletisim/ geri hreflang ile /en/contact/ işaret etmiyor
- `en/contact/index.html:12` `/en/contact/` → `/en/iletisim/` (en): /en/iletisim/ geri hreflang ile /en/contact/ işaret etmiyor
- `en/contact/index.html:13` `/en/contact/` → `/ar/iletisim/` (ar): /ar/iletisim/ geri hreflang ile /en/contact/ işaret etmiyor
- `en/quality-policy/index.html:11` `/en/quality-policy/` → `/kalite-politikamiz/` (tr): /kalite-politikamiz/ geri hreflang ile /en/quality-policy/ işaret etmiyor
- `en/quality-policy/index.html:13` `/en/quality-policy/` → `/ar/kalite-politikamiz/` (ar): /ar/kalite-politikamiz/ geri hreflang ile /en/quality-policy/ işaret etmiyor


## 5. Yapısal Veri (JSON-LD) Sorunları

### 5a. Product — offers / review / aggregateRating yok

**Toplam:** 69

- `ar/products/duru-dmxl/index.html:30` (نظام ترطيب ULV - Duru DMXL)
- `ar/products/duru-hd1800/index.html:30` (جهاز رش ULV مركب على السيارة - Duru HD1800)
- `ar/products/duru-hd5/index.html:30` (جهاز رش ULV محمول باليد - Duru HD5)
- `ar/products/duru-hd50/index.html:30` (جهاز رش ULV مركب على السيارة - Duru HD50)
- `ar/products/duru-hd75/index.html:30` (جهاز رش ULV مركب على السيارة - Duru HD75)
- `ar/products/duru-hr5/index.html:30` (جهاز رش ULV محمول باليد - Duru HR5)
- `ar/products/duru-k100/index.html:30` (جهاز تضبيب حراري - Duru K 100)
- `ar/products/duru-max10/index.html:30` (جهاز رش ULV محمول باليد - Duru Max10)
- `ar/products/duru-max5/index.html:30` (جهاز رش ULV محمول باليد - Duru Max5)
- `ar/products/duru-mist-blower-15hp/index.html:30` (جهاز نفخ ضباب مركب على السيارة - Duru 15HP)
- `ar/products/duru-mxl/index.html:30` (نظام ترطيب ULV - Duru MXL)
- `ar/products/duru-mxl-hgs/index.html:30` (نظام ترطيب ULV - Duru MXL-HGS)
- `ar/products/duru-plus/index.html:30` (جهاز رش ULV محمول باليد - Duru Plus 3")
- `ar/products/duru-sirt10/index.html:30` (جهاز رش ULV محمول على الظهر - Duru SRT 10)
- `ar/products/duru-x10/index.html:30` (جهاز رش ULV محمول باليد - Duru X10)
- `ar/products/duru-x20/index.html:30` (جهاز رش ULV محمول باليد - Duru X20)
- `ar/products/entosis-20/index.html:30` (جهاز رش البيوت المحمية - Entosis 20)
- `ar/products/entosis-50/index.html:30` (جهاز رش البيوت المحمية - Entosis 50)
- `ar/products/entosis-mist-blower-500l/index.html:30` (جهاز نفخ ضباب مركب على السيارة - Entosis 500L)
- `ar/products/sera-max-50/index.html:30` (جهاز رش البيوت المحمية - Sera Max 50)
- `ar/products/sera-plus-20/index.html:30` (جهاز رش البيوت المحمية - Sera Plus 20)
- `ar/products/sera-ultra-20/index.html:30` (جهاز رش البيوت المحمية - Sera Ultra 20)
- `ar/products/termal-el-tipi/index.html:30` (جهاز تضبيب حراري محمول باليد - Duru)
- `en/products/duru-dmxl/index.html:30` (ULV Humidification System - Duru DMXL)
- `en/products/duru-hd1800/index.html:30` (Truck-Mounted ULV Fogger - Duru HD1800)
- `en/products/duru-hd5/index.html:30` (Handheld ULV Fogger - Duru HD5)
- `en/products/duru-hd50/index.html:30` (Truck-Mounted ULV Fogger - Duru HD50)
- `en/products/duru-hd75/index.html:30` (Truck-Mounted ULV Fogger - Duru HD75)
- `en/products/duru-hr5/index.html:30` (Handheld ULV Fogger - Duru HR5)
- `en/products/duru-k100/index.html:30` (Thermal Fogger - Duru K 100)
- `en/products/duru-max10/index.html:30` (Handheld ULV Fogger - Duru Max10)
- `en/products/duru-max5/index.html:30` (Handheld ULV Fogger - Duru Max5)
- `en/products/duru-mist-blower-15hp/index.html:30` (Truck-Mounted Mist Blower - Duru 15HP)
- `en/products/duru-mxl/index.html:30` (ULV Humidification System - Duru MXL)
- `en/products/duru-mxl-hgs/index.html:30` (ULV Humidification System - Duru MXL-HGS)
- `en/products/duru-plus/index.html:30` (Handheld ULV Fogger - Duru Plus 3")
- `en/products/duru-sirt10/index.html:30` (Backpack ULV Fogger - Duru SRT 10)
- `en/products/duru-x10/index.html:30` (Handheld ULV Fogger - Duru X10)
- `en/products/duru-x20/index.html:30` (Handheld ULV Fogger - Duru X20)
- `en/products/entosis-20/index.html:30` (Greenhouse ULV Fogger - Entosis 20)
- `en/products/entosis-50/index.html:30` (Greenhouse ULV Fogger - Entosis 50)
- `en/products/entosis-mist-blower-500l/index.html:30` (Truck-Mounted Mist Blower - Entosis 500L)
- `en/products/sera-max-50/index.html:30` (Greenhouse ULV Fogger - Sera Max 50)
- `en/products/sera-plus-20/index.html:30` (Greenhouse ULV Fogger - Sera Plus 20)
- `en/products/sera-ultra-20/index.html:30` (Greenhouse ULV Fogger - Sera Ultra 20)
- `en/products/termal-el-tipi/index.html:30` (Handheld Thermal Fogger - Duru)
- `urunler/arac-uzeri-ilaclama/duru-hd1800/index.html:32` (Duru HD1800)
- `urunler/arac-uzeri-ilaclama/duru-hd50/index.html:32` (Duru HD50)
- `urunler/arac-uzeri-ilaclama/duru-hd75/index.html:32` (Duru HD75)
- `urunler/arac-uzeri-ilaclama/duru-mist-blower-15hp/index.html:32` (Duru Mist Blower 15HP (400L))
- `urunler/arac-uzeri-ilaclama/entosis-mist-blower-500l/index.html:32` (Entosis Mist Blower (500L))
- `urunler/el-tipi-ulv-ilaclama/duru-hd5/index.html:32` (Duru HD5)
- `urunler/el-tipi-ulv-ilaclama/duru-hr5/index.html:32` (Duru HR5)
- `urunler/el-tipi-ulv-ilaclama/duru-max10/index.html:32` (Duru Max10)
- `urunler/el-tipi-ulv-ilaclama/duru-max5/index.html:32` (Duru Max5)
- `urunler/el-tipi-ulv-ilaclama/duru-plus/index.html:32` (Duru Plus 3")
- `urunler/el-tipi-ulv-ilaclama/duru-x10/index.html:32` (Duru X10)
- `urunler/el-tipi-ulv-ilaclama/duru-x20/index.html:32` (Duru X20)
- `urunler/nemlendirme-ulv/duru-dmxl/index.html:32` (Duru DMXL)
- `urunler/nemlendirme-ulv/duru-mxl/index.html:32` (Duru MXL)
- `urunler/nemlendirme-ulv/duru-mxl-hgs/index.html:32` (Duru MXL-HGS)
- `urunler/sera-tipi-ulv-ilaclama/entosis-20/index.html:32` (Entosis 20)
- `urunler/sera-tipi-ulv-ilaclama/entosis-50/index.html:32` (Entosis 50)
- `urunler/sera-tipi-ulv-ilaclama/sera-max-50/index.html:32` (Sera Max 50)
- `urunler/sera-tipi-ulv-ilaclama/sera-plus-20/index.html:32` (Sera Plus 20)
- `urunler/sera-tipi-ulv-ilaclama/sera-ultra-20/index.html:32` (Sera Ultra 20)
- `urunler/sirt-tipi-ulv-ilaclama/duru-sirt10/index.html:32` (Duru SRT 10)
- `urunler/termal-sisleme/duru-k100/index.html:32` (Duru K 100)
- `urunler/termal-sisleme/termal-el-tipi/index.html:32` (Termal El Tipi)


### 5b. FAQPage — şema soruları görünür içerikle eşleşmiyor

**Toplam:** 0

_Sorun bulunamadı._


### 5c. Diğer schema notları

**Toplam:** 0

_Sorun bulunamadı._


## 6. Robots ve Indexleme Engelleri

### 6a. `robots.txt`

```
# AI discovery: https://www.duruulvteknoloji.com.tr/llms.txt | https://www.duruulvteknoloji.com.tr/ai-catalog.json | https://www.duruulvteknoloji.com.tr/.well-known/security.txt

User-agent: *
Allow: /
Disallow: /api/
Disallow: /emergent/
Disallow: /yigitornek/
Disallow: /tesekkurler/
Disallow: /en/tesekkurler/
Disallow: /ar/tesekkurler/

# Major AI crawlers (explicit allow — site is open for indexing & citation with attribution)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: https://www.duruulvteknoloji.com.tr/sitemap.xml
```

**Disallow kuralları:**

- `/api/`
- `/emergent/`
- `/yigitornek/`
- `/tesekkurler/`
- `/en/tesekkurler/`
- `/ar/tesekkurler/`

**Değerlendirme:** Ürün/kategori kökünü tamamen kapatan geniş Disallow görünmüyor. `tesekkurler` yolları engellenmiş olabilir (bilinçli).

### 6b. `noindex` meta içeren sayfalar

**Toplam:** 4

- `404.html:25` — `<meta name="robots" content="noindex, follow">`
- `ar/tesekkurler/index.html:25` — `<meta name="robots" content="noindex, nofollow">`
- `en/tesekkurler/index.html:25` — `<meta name="robots" content="noindex, nofollow">`
- `tesekkurler/index.html:25` — `<meta name="robots" content="noindex, nofollow">`


## 7. Kırık İç Linkler / Asset Referansları

**Toplam:** 0

_Sorun bulunamadı._


## 8. Meta Bilgi Tekrarları

### 8a. Aynı `<title>`

**Toplam duplike title grubu:** 10

- **Title:** "Duru ULV — Fiyat Teklifi" (6 sayfa)
  - `api/outbox/failed-2026-06-30-080240.html:1`
  - `api/outbox/quote-2026-06-30-080319-Test.html:1`
  - `api/outbox/quote-2026-06-30-080328-Test.html:1`
  - `api/outbox/quote-2026-06-30-084826-mostar-bas-m.html:1`
  - `api/outbox/quote-2026-06-30-085242-mostar-bas-m.html:1`
  - `api/outbox/quote-2026-06-30-085508-mostar-bas-m.html:1`
- **Title:** "" (2 sayfa)
  - `ar/404.html:6`
  - `en/404.html:6`
- **Title:** "من نحن — Duru ULV Technology Systems" (2 sayfa)
  - `ar/about/index.html:8`
  - `ar/hakkimizda/index.html:7`
- **Title:** "تواصل معنا — Duru ULV" (2 sayfa)
  - `ar/contact/index.html:8`
  - `ar/iletisim/index.html:7`
- **Title:** "سياسة الجودة والشهادات — Duru ULV" (2 sayfa)
  - `ar/kalite-politikamiz/index.html:7`
  - `ar/quality-policy/index.html:8`
- **Title:** "إعادة توجيه" (30 sayfa)
  - `ar/urunler/arac-uzeri-ilaclama/duru-hd1800/index.html:7`
  - `ar/urunler/arac-uzeri-ilaclama/duru-hd50/index.html:7`
  - `ar/urunler/arac-uzeri-ilaclama/duru-hd75/index.html:7`
  - `ar/urunler/arac-uzeri-ilaclama/duru-mist-blower-15hp/index.html:7`
  - `ar/urunler/arac-uzeri-ilaclama/entosis-mist-blower-500l/index.html:7`
  - `ar/urunler/arac-uzeri-ilaclama/index.html:7`
  - `ar/urunler/el-tipi-ulv-ilaclama/duru-hd5/index.html:7`
  - `ar/urunler/el-tipi-ulv-ilaclama/duru-hr5/index.html:7`
  - `ar/urunler/el-tipi-ulv-ilaclama/duru-max10/index.html:7`
  - `ar/urunler/el-tipi-ulv-ilaclama/duru-max5/index.html:7`
  - _… +20 daha_
- **Title:** "About Duru ULV Technology Systems — Duru ULV" (2 sayfa)
  - `en/about/index.html:8`
  - `en/hakkimizda/index.html:7`
- **Title:** "Contact Us — Duru ULV" (2 sayfa)
  - `en/contact/index.html:8`
  - `en/iletisim/index.html:7`
- **Title:** "Quality Policy &amp; Certifications — Duru ULV" (2 sayfa)
  - `en/kalite-politikamiz/index.html:7`
  - `en/quality-policy/index.html:8`
- **Title:** "Redirecting" (30 sayfa)
  - `en/urunler/arac-uzeri-ilaclama/duru-hd1800/index.html:7`
  - `en/urunler/arac-uzeri-ilaclama/duru-hd50/index.html:7`
  - `en/urunler/arac-uzeri-ilaclama/duru-hd75/index.html:7`
  - `en/urunler/arac-uzeri-ilaclama/duru-mist-blower-15hp/index.html:7`
  - `en/urunler/arac-uzeri-ilaclama/entosis-mist-blower-500l/index.html:7`
  - `en/urunler/arac-uzeri-ilaclama/index.html:7`
  - `en/urunler/el-tipi-ulv-ilaclama/duru-hd5/index.html:7`
  - `en/urunler/el-tipi-ulv-ilaclama/duru-hr5/index.html:7`
  - `en/urunler/el-tipi-ulv-ilaclama/duru-max10/index.html:7`
  - `en/urunler/el-tipi-ulv-ilaclama/duru-max5/index.html:7`
  - _… +20 daha_


### 8b. Aynı meta description

**Toplam duplike description grubu:** 6

- **Description:** "عن دورو يو إل في — مصنّع معدات رش ULV منذ 1990 في قيصري، تركيا." (2 sayfa)
  - `ar/about/index.html:7`
  - `ar/hakkimizda/index.html:6`
- **Description:** "تواصل مع دورو يو إل في — هاتف، واتساب، بريد. رد في نفس يوم العمل." (2 sayfa)
  - `ar/contact/index.html:7`
  - `ar/iletisim/index.html:6`
- **Description:** "سياسة الجودة وشهادات دورو يو إل في: CE وTSE وISO." (2 sayfa)
  - `ar/kalite-politikamiz/index.html:6`
  - `ar/quality-policy/index.html:7`
- **Description:** "About Duru ULV — manufacturer of ULV spraying equipment since 1990 in Kayseri, Turkey." (2 sayfa)
  - `en/about/index.html:7`
  - `en/hakkimizda/index.html:6`
- **Description:** "Contact Duru ULV — phone, WhatsApp, email. Same-day response during business hours." (2 sayfa)
  - `en/contact/index.html:7`
  - `en/iletisim/index.html:6`
- **Description:** "Duru ULV quality policy and certifications: CE, TSE, ISO 9001, ISO 14001, ISO 45001." (2 sayfa)
  - `en/kalite-politikamiz/index.html:6`
  - `en/quality-policy/index.html:7`


---

## Öncelik Özeti (çok → az)

| Sıra | Kategori | Sorun sayısı |
|------|----------|--------------|
| 1 | İç link /index.html (a href) | 7665 |
| 2 | Product JSON-LD (offers/review/aggregateRating yok) | 69 |
| 3 | Keşfedilebilir ama sitemap’te yok (redirect stub) | 66 |
| 4 | Hreflang reciprocity | 16 |
| 5 | Duplike title | 10 |
| 6 | Canonical tutarsızlığı / eksik | 6 |
| 7 | Duplike meta description | 6 |
| 8 | noindex meta | 4 |
| 9 | Kırık iç link/asset | 0 |
| 10 | Hreflang hedefi yok | 0 |
| 11 | FAQPage görünür içerik uyumsuzluğu | 0 |
| 12 | Hreflang’te /index.html | 0 |
| 13 | Canonical’da /index.html | 0 |
| 14 | Sitemap orphan (sayfa yok) | 0 |
| 15 | Kanonik public sayfa sitemap’te yok | 0 |
| 16 | Diğer schema notları | 0 |

### Search Console ile ilişki

- Sitemap orphan (**0**) — sitemap’te ölü URL yok.
- Kanonik public sayfa ↔ sitemap (**0** eksik) — birebir hizalı (~162).
- **Asıl SC adayı:** diskte var ama sitemap’te olmayan **redirect stub** URL’leri (**66**) + iç linklerden keşfedilen `…/index.html` varyantları (**7665** href).
- Legacy `en/about`, `en/contact`, `en/quality-policy` (ve AR) stub’larında canonical çoğu zaman **kendi legacy URL’sine** işaret ediyor; refresh hedefi `hakkimizda` / `iletisim` / `kalite-politikamiz` — bu, duplike/yanlış sinyal üretir.

### Önerilen odak sırası

1. Redirect stub’larda canonical + hreflang’i **hedef kanonik URL**’ye sabitle (veya 301 + noindex); sitemap’e stub ekleme.
2. Navigasyonda temiz URL (`/path/`) — `…/index.html` crawl gürültüsünü azalt.
3. Product JSON-LD için `offers` (veya Google’ın kabul ettiği alternatif alan).
4. Duplike title/description (özellikle stub ↔ kanonik çiftler).
5. Hreflang reciprocity (legacy about/contact/quality-policy yüzeyleri).

_Bu rapor otomatik üretildi; satır numaraları denetim anındaki dosya içeriğine göredir._
