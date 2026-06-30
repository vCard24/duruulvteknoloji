/**
 * English site — navigation labels, hero slides, shared UI strings
 */
(function () {
  if ((document.documentElement.getAttribute("lang") || "").toLowerCase() !== "en") return;

  window.YCK_HERO_EN = [
    {
      title: "23 years of experience, boundless trust",
      description:
        "Since 2003 we have delivered quality and trust in every product through our steel door manufacturing expertise.",
      cta: "2026 Catalog",
      ctaLink: "assets/catalog/yigit_celikkapi_2026_katalog.pdf",
      ctaExternal: true,
      image: "assets/img/yigit_celik_kapi-04.webp",
    },
    {
      title: "Modern design, strong presence",
      description:
        "Steel doors that combine beauty and durability — Yiğit Çelik Kapı merges design and security with modern production.",
      cta: "About us",
      ctaLink: "hakkimizda/index.html",
      image: "assets/img/yigit_celik_kapi-07.webp",
    },
    {
      title: "10,000 m² facility, advanced production",
      description:
        "In Kayseri we manufacture with state-of-the-art machinery in a large facility — quality, strength and aesthetics in every door.",
      cta: "Our products",
      ctaLink: "urunler/index.html",
      image: "assets/img/yigit_celik_kapi-02.webp",
    },
    {
      title: "Elegant design, safe living",
      description: "A sense of luxury in every detail and strength in every structure.",
      cta: "Our values",
      ctaLink: "#degerlerimiz",
      image: "assets/img/yigit_celik_kapi-10.webp",
    },
    {
      title: "On-time delivery, global logistics",
      description:
        "From production to delivery we keep our promises. Strong logistics from Türkiye to Europe, the Middle East and Africa.",
      cta: "Download 2026 Catalog",
      ctaLink: "assets/catalog/yigit_celikkapi_2026_katalog.pdf",
      ctaExternal: true,
      image: "assets/img/yigit_celik_kapi-01.webp",
    },
  ];

  var TEXT_PAIRS = [
    ["Ana Sayfa", "Home"],
    ["Ürünler", "Products"],
    ["Ürün Serileri", "Product series"],
    ["Ürün Katalogları", "Product catalogs"],
    ["Kurumsal", "Company"],
    ["Hakkımızda", "About us"],
    ["Değerlerimiz", "Our values"],
    ["Misyon & Vizyon", "Mission & vision"],
    ["Belgelerimiz", "Certificates"],
    ["Kalite Politikamız", "Quality policy"],
    ["Blog", "Blog"],
    ["İletişim", "Contact"],
    ["Fiyat Teklifi", "Get a quote"],
    ["Karşılaştır", "Compare"],
    ["Katalog", "Catalog"],
    ["İLETİŞİM", "CONTACT"],
    ["Projeniz İçin ", "Get a "],
    ["Fiyat Teklifi", "Quote"],
    [" Alın", " for Your Project"],
    ["Formu doldurun veya bizi arayın.", "Fill in the form or call us."],
    ["TSE belgeli üretim ve geniş ürün yelpazemizle projelerinize uygun çözümler için formu doldurun veya bizi arayın.", "Fill in the form or call us for TSE-certified solutions across our wide product range."],
    ["Teklif Al", "Get a quote"],
    ["Bizi Arayın", "Call us"],
    ["Hızlı İletişim", "Quick contact"],
    ["Adres", "Address"],
    ["Telefon", "Phone"],
    ["E-posta", "Email"],
    ["KVKK Aydınlatma Metni", "Privacy notice (KVKK)"],
    ["Gizlilik Politikası", "Privacy policy"],
    ["Kullanım Koşulları", "Terms of use"],
    ["Tüm hakları saklıdır.", "All rights reserved."],
    ["Ana menü", "Main menu"],
    ["Dil seçici", "Language switcher"],
    ["Menüyü aç", "Open menu"],
    ["Menüyü kapat", "Close menu"],
    ["WhatsApp ile yazın", "Message us on WhatsApp"],
    ["Ürün", "Product"],
    ["Ürünler", "Products"],
    ["Seri", "Series"],
    ["Devamını oku", "Read more"],
    ["Fiyat teklifi al", "Get a quote"],
    ["Tüm Ürünler", "All products"],
    ["Popüler modeller", "Popular models"],
    ["Seçili ürünler", "Selected products"],
    ["Merhaba, ürünleriniz hakkında bilgi almak istiyorum.", "Hello, I would like information about your products."],
    // Corporate chrome (layout.js inject)
    ["Kurumsal sayfalar", "Company pages"],
    ["Diğer kurumsal sayfalar", "Other company pages"],
    ["← Önceki", "← Previous"],
    ["Sonraki →", "Next →"],
    ["Fabrikamız", "Our factory"],
    ["Tarihçemiz, üretim gücümüz ve küresel erişimimiz", "Our history, production strength and global reach"],
    ["Temel ilkelerimiz ve kurumsal değerlerimiz", "Our core principles and corporate values"],
    ["Hedeflerimiz ve geleceğe bakışımız", "Our goals and outlook for the future"],
    ["TSE, ISO ve kalite sertifikalarımız", "Our TSE, ISO and quality certificates"],
    ["Sürekli gelişim ve mükemmellik anlayışımız", "Our commitment to continuous improvement and excellence"],
    ["Ürün kataloglarımızı inceleyin", "Browse our product catalogs"],
    ["2026 ürün ve lazer kataloglarımızı görüntüleyin, indirin veya çevrimiçi önizleyin.", "View, download or preview our 2026 product and laser catalogs online."],
    ["2026 Katalog", "2026 Catalog"],
    ["2026 Lazer", "2026 Laser"],
    ["Tüm Kataloglar", "All catalogs"],
    ["Fiyat Teklifi Al", "Get a quote"],
    // Header / footer chrome
    ["2003'ten Beri Güvenilir Çelik Kapı", "Trusted steel doors since 2003"],
    ["Kataloglar", "Catalogs"],
    ["2026 Kataloğu", "2026 Catalog"],
    ["2023 Kataloğu", "2023 Catalog"],
    ["2021 Kataloğu", "2021 Catalog"],
    ["Özellikler", "Features"],
    ["Beyaz Kapı", "White doors"],
    ["Bina Giriş Kapıları", "Building entrance doors"],
    ["Camlı Kapılar", "Glazed doors"],
    ["Çift Açılır Kapılar", "Double-leaf doors"],
    ["Komple Metal Çelik Kapı", "Full metal steel doors"],
    ["Tek Açılır Kapılar", "Single-leaf doors"],
    ["Villa Kapısı", "Villa doors"],
    ["Tüm Ürünleri Gör →", "View all products →"],
    ["Ürün Karşılaştır", "Product comparison"],
    ["Ürün karşılaştırma", "Product comparison"],
    ["TEKLİF AL →", "GET A QUOTE →"],
    ["TEKLİF AL", "GET A QUOTE"],
    ["GÖNDER →", "SEND →"],
    ["KARŞILAŞTIR", "COMPARE"],
    ["KURUMSAL", "COMPANY"],
    ["ÜRÜN SERİLERİ", "PRODUCT SERIES"],
    ["Tüm belgeler →", "All certificates →"],
    ["Kalite belgelerimiz", "Our quality certificates"],
    ["Kalite belgesi", "Quality certificate"],
    ["Sosyal medya", "Social media"],
    ["Yukarı çık", "Back to top"],
    ["Yiğit Çelik Kapı ana sayfa", "Yiğit Çelik Kapı home"],
    ["Yiğit Çelik Kapı konumu", "Yiğit Çelik Kapı location"],
    ["2003 yılından beri güvenlik ve estetiği bir arada sunan, TSE belgeli çelik kapı üreticisi. Kaliteli üretim, güvenilir hizmet.", "Since 2003, a TSE-certified steel door manufacturer combining security and aesthetics. Quality production, dependable service."],
    ["Tüm Ürünler →", "All products →"],
    // Series names (mega menu + footer)
    ["Lüks Kabartma Seri", "Luxury Embossed Series"],
    ["Lüks PVC Kabartma Seri", "Luxury PVC Embossed Series"],
    ["Lüks PVC Seri", "Luxury PVC Series"],
    ["Elit Laminoks Seri", "Elite Laminox Series"],
    ["Lüks Kompozit Seri", "Luxury Composite Series"],
    ["Renkli Saruhan Seri", "Colour Saruhan Series"],
    ["Lüks Saruhan Rustik", "Luxury Saruhan Rustik"],
    ["Lüks Ultralam Seri", "Luxury Ultralam Series"],
    ["Klasik Laminoks Seri", "Classic Laminox Series"],
    ["Sac Panel Seri", "Sheet Panel Series"],
    ["Lazer Seri", "Laser Series"],
    ["Profil Kasalı Seri", "Profile Frame Series"],
    ["Thermo Ahşap Seri", "Thermo Wood Series"],
    ["Granit Taş Yüzey", "Granite Stone Surface"],
    ["Nitelikli Seri", "Premium Series"],
    ["Bakır Seri", "Copper Series"],
    ["Yangın Kapısı", "Fire-rated doors"],
    // Form placeholders (footer quick contact)
    ["Adınız", "Your first name"],
    ["Soyadınız", "Your last name"],
    ["Mesajınız…", "Your message…"],
    ["Ad", "First name"],
    ["Soyad", "Last name"],
    ["Mesaj", "Message"],
  ];

  var ATTR_PAIRS = [
    ["Adınız", "Your first name"],
    ["Soyadınız", "Your last name"],
    ["Mesajınız…", "Your message…"],
    ["E-posta", "Email"],
    ["Telefon", "Phone"],
    ["Ürün karşılaştırma", "Product comparison"],
    ["Karşılaştır", "Compare"],
    ["Yukarı çık", "Back to top"],
    ["WhatsApp ile yazın", "Message us on WhatsApp"],
    ["Kurumsal sayfalar", "Company pages"],
  ];

  function sortedPairs(pairs) {
    return pairs.slice().sort(function (a, b) {
      return b[0].length - a[0].length;
    });
  }

  function replaceInText(raw, tr, en) {
    if (raw.indexOf(tr) === -1) return raw;
    return raw.split(tr).join(en);
  }

  function applyTextPairs(rootEl) {
    if (!rootEl) return;
    sortedPairs(TEXT_PAIRS).forEach(function (pair) {
      rootEl.querySelectorAll("a, button, span, p, h1, h2, h3, h4, label, legend, summary, li, th, td, dt, dd, [title], [aria-label]").forEach(function (el) {
        if (el.children.length === 0) {
          if (el.textContent.trim() === pair[0]) el.textContent = pair[1];
          return;
        }
        el.childNodes.forEach(function (node) {
          if (node.nodeType !== 3) return;
          node.textContent = replaceInText(node.textContent, pair[0], pair[1]);
        });
        var title = el.getAttribute("title");
        if (title === pair[0]) el.setAttribute("title", pair[1]);
        var aria = el.getAttribute("aria-label");
        if (aria === pair[0]) el.setAttribute("aria-label", pair[1]);
      });
    });
  }

  function applyAttributePairs(rootEl) {
    if (!rootEl) return;
    sortedPairs(ATTR_PAIRS).forEach(function (pair) {
      rootEl.querySelectorAll("input, textarea, select, button, a, iframe").forEach(function (el) {
        ["placeholder", "title", "aria-label"].forEach(function (attr) {
          var val = el.getAttribute(attr);
          if (val === pair[0]) el.setAttribute(attr, pair[1]);
        });
      });
    });
  }

  function patchMisyonAmp() {
    document.querySelectorAll(".corporate-subnav__link, .dropdown-simple a, .nav-mobile a, .footer-col a").forEach(function (el) {
      if (el.innerHTML.indexOf("Misyon &amp; Vizyon") !== -1) {
        el.innerHTML = el.innerHTML.replace(/Misyon &amp; Vizyon/g, "Mission &amp; vision");
      }
    });
  }

  function patchProductCountBadges(rootEl) {
    if (!rootEl) return;
    rootEl.querySelectorAll(".mega-series-link .count").forEach(function (badge) {
      badge.textContent = String(badge.textContent || "").replace(/(\d+)\s*Ürün/i, "$1 products");
    });
  }

  function patchFooterCtaTitle() {
    var title = document.getElementById("footer-cta-heading");
    if (!title || title.getAttribute("data-en-done")) return;
    title.innerHTML = 'Get a <span class="footer-cta__accent">Quote</span> for Your Project';
    title.setAttribute("data-en-done", "1");
  }

  function patchWhatsAppFloat() {
    var wa = document.getElementById("whatsapp-float");
    if (!wa) return;
    wa.setAttribute("aria-label", "Message us on WhatsApp");
    wa.href =
      "https://wa.me/905076999469?text=" +
      encodeURIComponent("Hello, I would like information about your products.");
  }

  window.yckEnSite = {
    applyChrome: function () {
      var roots = [
        document.getElementById("header-root"),
        document.getElementById("footer-root"),
        document.getElementById("corporate-subnav-root"),
        document.getElementById("corporate-crosslinks-root"),
        document.getElementById("corporate-cta-root"),
      ];
      roots.forEach(function (rootEl) {
        applyTextPairs(rootEl);
        applyAttributePairs(rootEl);
        patchProductCountBadges(rootEl);
      });
      patchMisyonAmp();
      patchFooterCtaTitle();
      patchWhatsAppFloat();
    },
  };

  document.addEventListener("yck-layout-ready", function () {
    window.yckEnSite.applyChrome();
  });

  if (document.getElementById("header-root") && document.getElementById("header-root").children.length) {
    window.yckEnSite.applyChrome();
  }
})();
