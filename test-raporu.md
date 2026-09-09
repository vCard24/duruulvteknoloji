# Push Öncesi Test / Kontrol Raporu

**Tarih:** 2026-09-09  
**Kapsam:** Salt okuma denetim (hiçbir kaynak dosya değiştirilmedi)  
**Odak:** Son turlar — `href` temizliği, `build:pages`, stub canonical düzeltmesi sonrası regresyon  

**Yöntem özeti:**
- Tüm site `.html` dosyaları tarandı (`api/`, `node_modules`, `.git` link/asset çözümlemesinden hariç tutuldu; HTML sayısı için ayrıca `api/outbox` dahil disk sayımı yapıldı).
- Göreli URL’ler `path/` → `path/index.html` kuralıyla diske çözüldü.
- `assets/js/**` ve `scripts/**` için `node --check`.
- `sitemap.xml` loc doğrulama + `JSON.parse` (JSON-LD).

---

## 1. Kırık İç Linkler

**Bulunan sorun sayısı:** 0

Sorun bulunamadı.

Tüm `<a href>` göreli hedefleri (http(s)/mailto/tel/javascript/#/? hariç) diskte mevcut `…/index.html` veya dosya yoluna çözüldü.

---

## 2. Kırık Asset Referansları (CSS / JS / Görsel)

**Bulunan sorun sayısı:** 0

Sorun bulunamadı.

Kontrol edilenler: `<link href>`, `<script src>`, `<img src>`, `srcset` / `<source srcset>`.  
Hash’li türevler (`site.c10a4048.css`, `blog.e03fc87b.css`, `rtl.f6262147.css`, `compare.4ebe2e9b.js`, `main.d7ff27ce.js`, `quote-form.1f1b4170.js`, `pdf-utils.ea29aa73.js`, `compare-pdf.9f330944.js`, `quote-pdf.78f3e9c5.js` vb.) HTML referanslarıyla diskteki dosya adları eşleşiyor; stale hash referansı yok.

---

## 3. JavaScript Söz Dizimi

**Bulunan sorun sayısı:** 0

Sorun bulunamadı.

`node --check` ile `assets/js/` ve `scripts/` altındaki tüm `.js` dosyaları kontrol edildi; syntax hatası yok.

---

## 4. Form ve Fonksiyonel Linkler

**Bulunan sorun sayısı:** 0 (üretim mantığı simülasyonu + disk doğrulama)

### 4a. `quote-form.js` / `compare.js` örnek URL’ler

Locale + `sitePrefix` simülasyonu (kaynak fonksiyon mantığıyla aynı path üretimi):

| Bağlam | Helper | Üretilen href | Disk hedefi | Durum |
|--------|--------|---------------|-------------|--------|
| `fiyat-teklifi/` | `thanksUrl` (TR) | `../tesekkurler/` | `tesekkurler/index.html` | OK |
| `fiyat-teklifi/` | `productsIndexUrl` (TR) | `../urunler/` | `urunler/index.html` | OK |
| `en/fiyat-teklifi/` | `thanksUrl` | `../../en/tesekkurler/` | `en/tesekkurler/index.html` | OK |
| `en/fiyat-teklifi/` | `productsIndexUrl` | `../../en/products/` | `en/products/index.html` | OK |
| `en/fiyat-teklifi/` | `quotePageUrl` | `../../en/fiyat-teklifi/` | `en/fiyat-teklifi/index.html` | OK |
| `urun-karsilastirma/` | `quotePageUrl` + query | `../fiyat-teklifi/?products=duru-hd5` | `fiyat-teklifi/index.html` | OK |
| `ar/urun-karsilastirma/` | `productsIndexUrl` | `../../ar/products/` | `ar/products/index.html` | OK |

`resolveComparePath` örnekleri:

| pathname | Sonuç | Disk | Durum |
|----------|--------|------|--------|
| `/` | `/urun-karsilastirma/` | `urun-karsilastirma/index.html` | OK |
| `/en/` | `/en/urun-karsilastirma/` | `en/urun-karsilastirma/index.html` | OK |
| `/ar/products/duru-hd5/` | `/ar/urun-karsilastirma/` | `ar/urun-karsilastirma/index.html` | OK |
| `/blog/ulv-ilaclama-nedir/` | `/urun-karsilastirma/` | `urun-karsilastirma/index.html` | OK |

### 4b. `tel:` / `mailto:` / `wa.me`

**Bulunan sorun sayısı:** 0

Sorun bulunamadı (format kontrolleri: `tel:+…`, `mailto:user@host`, `https://wa.me/<digits>`).

---

## 5. Sitemap Geçerliliği

**Bulunan sorun sayısı:** 0

| Kontrol | Sonuç |
|---------|--------|
| XML yapısı (`urlset`, `<url>` dengesi) | OK |
| `<loc>` sayısı | **162** |
| `<loc>` → disk (`path/` → `path/index.html`) | **0 kırık** |
| Duplike `<loc>` | **0** |
| `index.html` içeren `<loc>` | **0** |

---

## 6. robots.txt Sanity

**Bulunan sorun sayısı:** 0 (bilinçli Disallow’lar not edildi)

```
Allow: /
Disallow: /api/
Disallow: /emergent/
Disallow: /yigitornek/
Disallow: /tesekkurler/
Disallow: /en/tesekkurler/
Disallow: /ar/tesekkurler/
Sitemap: https://www.duruulvteknoloji.com.tr/sitemap.xml
```

- Ürünler (`/urunler/`, `/products/`), kategoriler, blog, katalog **Disallow edilmiyor**.
- `tesekkurler` noindex/thanks sayfası — bilinçli engel.
- Sitemap satırı doğru.

---

## 7. JSON-LD Geçerliliği

**Bulunan sorun sayısı:** 0

Sorun bulunamadı. Tüm `application/ld+json` blokları `JSON.parse` ile geçerli.

---

## 8. Çoklu Dil (TR/EN/AR) Tutarlılığı

**Bulunan sorun sayısı:** 0

Örneklenen 10 sayfa (lang-switcher + hreflang hedefleri diskte var):

1. `index.html`  
2. `hakkimizda/index.html`  
3. `urunler/index.html`  
4. `urunler/el-tipi-ulv-ilaclama/duru-hd5/index.html`  
5. `blog/index.html`  
6. `blog/ulv-ilaclama-nedir/index.html`  
7. `en/index.html`  
8. `en/products/duru-hd5/index.html`  
9. `ar/index.html`  
10. `ar/iletisim/index.html`  

Sorun bulunamadı.

---

## 9. 404 Sayfası

**Kritik kırık link:** 0  

| Dosya | Var mı? | İç göreli linkler |
|-------|---------|-------------------|
| `404.html` | Evet | OK |
| `en/404.html` | Evet | OK |
| `ar/404.html` | Evet | OK |

**Kalite notu (kırık link değil):**
- `en/404.html` ve `ar/404.html` içinde `<title></title>` boş (önceki SEO denetiminde de vardı).
- TR `404.html` title dolu: “Sayfa bulunamadı - Duru ULV”.

---

## 10. Genel Regresyon

| Kontrol | Sonuç | Beklenen / önceki |
|---------|--------|-------------------|
| Disk `.html` (node_modules/.git hariç, **api dahil**) | **241** | 241 |
| `git ls-files '*.html'` | **235** | 235 |
| `api/outbox` HTML | 6 | (tracked değil) |
| `href="…index.html"` taraması (api/ + http(s)/mailto/tel hariç) | **0** | 0 |
| Duplike `<title>` grubu | **4** | Önceki SEO: **10** → **azaldı** |
| Duplike meta description grubu | **2** | Önceki SEO: **6** → **azaldı** |

### Kalan duplike title grupları

1. **سياسة الجودة والشهادات — Duru ULV** (2) — `ar/kalite-politikamiz/` + `ar/quality-policy/` (stub + gerçek)  
2. **إعادة توجيه** (30) — `ar/urunler/...` redirect stub’ları (bilinçli)  
3. **Quality Policy &amp; Certifications — Duru ULV** (2) — `en/kalite-politikamiz/` + `en/quality-policy/`  
4. **Redirecting** (30) — `en/urunler/...` redirect stub’ları (bilinçli)

### Kalan duplike description grupları

1. AR quality-policy stub + `kalite-politikamiz`  
2. EN quality-policy stub + `kalite-politikamiz`

**Not:** Önceki rapordaki about/contact stub–hedef title/description çiftleri bu taramada artık ayrı gruplarda görünmüyor (kurumsal EN/AR sayfalarının build sonrası title metinleri stub’lardan farklılaşmış olabilir). Quality-policy çiftleri ve locale `urunler/` redirect title’ları bilinçli/legacy.

---

## Öncelik Özeti

| Öncelik | Kategori | Sorun sayısı | Değerlendirme |
|---------|----------|--------------|---------------|
| P0 | 1. Kırık iç linkler | 0 | Temiz |
| P0 | 2. Kırık / stale asset | 0 | Temiz |
| P0 | 3. JS syntax | 0 | Temiz |
| P1 | 5. Sitemap | 0 | Temiz |
| P1 | 7. JSON-LD parse | 0 | Temiz |
| P2 | 4. Form URL’leri / tel-mailto-wa | 0 | Temiz |
| P2 | 8. Lang-switcher / hreflang örneklem | 0 | Temiz |
| P2 | 9. 404 varlığı + iç linkler | 0 kırık; 2 boş title | Push engeli değil |
| P3 | 6. robots.txt | 0 | Temiz (thanks Disallow bilinçli) |
| P3 | 10. Regresyon (`index.html` href, sayılar) | 0 kritik | Duplike title/desc **azaldı**; kalanlar stub/redirect |

### Push kararı (denetim görüşü)

Son turların (`href` temizliği, `build:pages`, stub canonical) **kırık link, kırık hash’li asset veya JS syntax regresyonu üretmediği** doğrulandı. Sitemap ve JSON-LD sağlam.  

Kalan maddeler (EN/AR 404 boş title, quality-policy stub meta tekrarı, locale `urunler/` redirect title tekrarı) **önceden bilinen / bilinçli yapı**; bu denetimde yeni P0/P1 regresyon yok.

---

*Bu dosya yalnızca denetim çıktısıdır. Commit/push bu rapor kapsamında yapılmamıştır.*
