# DURU ULV — RankMath SEO Uyumlu İçerik Üretim Standardı

Bu dosya, hem kalan 15 ürün metni hem de blog yazıları için **her metinde uygulanan
sabit kural seti**dir. RankMath'in 100/100 puan kriterlerine göre hazırlanmıştır.

## RankMath 100/100 Kriterleri (kaynak: rankmath.com resmi dokümantasyonu)

Her metin için aşağıdakilerin TÜMÜ sağlanmalı:

1. **Odak anahtar kelime (focus keyword) SEO başlığında** geçmeli, tercihen başlığın
   ilk yarısında (ilk %50'sinde).
2. **Odak anahtar kelime meta açıklamada** geçmeli (meta açıklama 120-160 karakter).
3. **Odak anahtar kelime URL/slug'da** geçmeli.
4. **Odak anahtar kelime içeriğin ilk %10'unda** (yani ilk paragrafta) geçmeli.
5. **Odak anahtar kelime en az bir alt başlıkta (H2/H3)** geçmeli.
6. **Odak anahtar kelime içerikte ~%1 yoğunlukla** geçmeli (600 kelimelik bir metinde
   yaklaşık 5-6 kez — fazlası "keyword stuffing" sayılır, kaçınılmalı).
7. **İçerik en az 600 kelime** olmalı (RankMath'in "considere using at least 600 words"
   uyarısını geçmek için) — kullanıcının belirttiği 450 kelime alt sınırının üzerinde,
   güvenli tarafta kalmak için biz **600 kelimeyi standart alt sınır** olarak
   uygulayacağız, mümkün olduğunda 650-750'ye kadar çıkacağız.
8. **Görsel alt metninde odak anahtar kelime** geçmeli (Cursor zaten ürün görsellerine
   `alt` ekliyor — bu metinlerde önerilen alt metni de vereceğiz).
9. **En az bir dış (otorite) link** — biz bu kuralı **T.C. Sağlık Bakanlığı, WHO,
   ISO gibi resmi/otorite kaynaklara** link vererek karşılayacağız (örn. "Dünya Sağlık
   Örgütü'nün ULV kriterleri" ifadesini bir dış linke bağlamak).
10. **En az bir iç link** — ilgili kategori sayfasına veya başka bir ürün sayfasına.
11. **URL kısa ve odak kelimeyi içermeli** — zaten Cursor'un kurduğu slug yapısı buna uygun.
12. **Başlıkta sayı veya güç kelimesi** (bonus puan) — "%99,999 etkinlik", "36 yıl",
    "2 yıl garanti" gibi somut rakamları başlıklara/alt başlıklara serpiştireceğiz.

## Bu Projeye Özgü Ek Kurallar (önceki onaylarımızdan)

- **Halk dili önce, model kodu sonra:** H1 ve ilk cümle halk dilinde olacak (örn. "Araç
  Üstü İlaçlama Makinesi"), model kodu (Duru HD75 gibi) parantez içinde / ikinci cümlede.
- **Fiyat gösterilmeyecek:** "Fiyat" kelimesi başlıkta SEO için kullanılabilir, ama içerik
  her zaman "Teklif Al" CTA'sına yönlendirir.
- **Kataloğun gerçek teknik verisi** kullanılacak (uydurma rakam yok).
- **Tek bir odak anahtar kelime + 2-4 ikincil anahtar kelime** her ürün/blog için
  belirlenecek ve dosyanın başında not edilecek (RankMath'te "Focus Keyword" ve
  "Additional Keywords" alanlarına bu şekilde girilecek).

## Her Ürün Metni İçin Teslim Edilecek Paket

Her ürün için şu 5 öğe verilecek (RankMath'e doğrudan girilebilir formatta):

```
SEO Başlığı (Title):     [55-60 karakter, odak kelime başta]
Meta Açıklama:           [120-156 karakter, odak kelime içerir, CTA içerir]
Odak Anahtar Kelime:     [tek, ana terim]
Ek Anahtar Kelimeler:    [3-4 terim, virgülle ayrılmış]
URL Slug önerisi:        [Cursor'daki mevcut slug ile uyumlu, değişmeyecek]
---
[Gövde metin — H2 başlıklı bölümler]
```

## Görsel Alt Metni Kuralı

Her ürün sayfasının ana görseli için önerilen `alt` metni de veriyoruz; format:
`"[Halk dili terim] - [Model adı]"` örn. `alt="El tipi ilaçlama makinesi - Duru X10"`

---

Bu standart, aşağıdaki dosyalarda uygulanmıştır:
- `urunler/` klasöründe kalan 15 ürünün tam metinleri (kategori bazlı gruplanmış)
- `bloglar/` klasöründe blog yazıları
