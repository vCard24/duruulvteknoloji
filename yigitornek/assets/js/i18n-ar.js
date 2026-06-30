/**
 * Arapça site — menü yolları, hero slaytları, ortak etiketler
 */
(function () {
  if ((document.documentElement.getAttribute("lang") || "").toLowerCase() !== "ar") return;

  window.YCK_HERO_AR = [
    {
      title: "23 عاماً من الخبرة، ثقة بلا حدود",
      description:
        "منذ 2003 نضمن الجودة والثقة في كل منتج بفضل خبرتنا المتراكمة في صناعة الأبواب الفولاذية.",
      cta: "Catalog 2026",
      ctaLink: "assets/catalog/yigit_celikkapi_2026_katalog.pdf",
      ctaExternal: true,
      image: "assets/img/yigit_celik_kapi-04.webp",
    },
    {
      title: "تصميم عصري، حضور قوي",
      description:
        "أبواب فولاذية تجمع بين الجمال والمتانة… Yiğit Çelik Kapı تدمج التصميم والأمان بتقنيات إنتاج حديثة.",
      cta: "من نحن",
      ctaLink: "من-نحن/index.html",
      image: "assets/img/yigit_celik_kapi-07.webp",
    },
    {
      title: "منشأة 10.000 م²، إنتاج بتقنية متقدمة",
      description:
        "في Kayseri ننتج بأحدث الآلات في مساحة واسعة؛ جودة عالية ومتانة وجمال في كل باب.",
      cta: "منتجاتنا",
      ctaLink: "المنتجات/index.html",
      image: "assets/img/yigit_celik_kapi-02.webp",
    },
    {
      title: "تصميم أنيق، حياة آمنة، لحظات مطمئنة",
      description: "شعور بالفخامة في كل تفصيلة، وبالقوة في كل هيكل.",
      cta: "قيمنا",
      ctaLink: "#degerlerimiz",
      image: "assets/img/yigit_celik_kapi-10.webp",
    },
    {
      title: "التزام بالمواعيد، قوة شحن عالمية",
      description:
        "من الإنتاج إلى التسليم نفي بوعودنا. شبكة لوجستية قوية من Türkiye إلى أوروبا والشرق الأوسط وأفريقيا.",
      cta: "حمّل Catalog 2026",
      ctaLink: "assets/catalog/yigit_celikkapi_2026_katalog.pdf",
      ctaExternal: true,
      image: "assets/img/yigit_celik_kapi-01.webp",
    },
  ];

  var PATH_PAIRS = [
    ["seri/luks-kabartma-seri/", "السلسلة/سلسلة-النقش-الفاخر/"],
    ["seri/luks-pvc-kabartma-seri/", "السلسلة/سلسلة-pvc-النقش-الفاخر/"],
    ["seri/luks-pvc-seri/", "السلسلة/سلسلة-pvc-الفاخر/"],
    ["seri/elit-laminoks-seri/", "السلسلة/سلسلة-اليت-لامينокс/"],
    ["seri/luks-kompozit-seri/", "السلسلة/سلسلة-الكompozit-الفاخر/"],
    ["seri/renkli-saruhan-seri/", "السلسلة/سلسلة-ساروهان-الملونة/"],
    ["seri/luks-saruhan-rustik/", "السلسلة/سلسلة-سارuhan-الrustik/"],
    ["seri/luks-ultralam-seri/", "السلسلة/سلسلة-ultralam-الفاخر/"],
    ["seri/klasik-laminoks-seri/", "السلسلة/سلسلة-لامينокс-الكلاسيكي/"],
    ["seri/sac-panel-seri/", "السلسلة/سلسلة-الpanel-المعدني/"],
    ["seri/lazer-seri/", "السلسلة/سلسلة-الليزر/"],
    ["seri/profik-kasali-seri/", "السلسلة/سلسلة-الإطار-المprofil/"],
    ["seri/thermo-ahsap-seri/", "السلسلة/سلسلة-thermo-خشب/"],
    ["seri/granit-tas-yuzey/", "السلسلة/سلسلة-سطح-الجرanit/"],
    ["seri/nitelikli-seri/", "السلسلة/سلسلة-الجودة/"],
    ["seri/bakir-seri/", "السلسلة/سلسلة-النحاس/"],
    ["seri/yangin-kapisi/", "السلسلة/سلسلة-ابواب-الحريق/"],
    ["urun-karsilastirma/", "مقارنة-المنتجات/"],
    ["fiyat-teklifi/", "طلب-عرض-سعر/"],
    ["urunler/", "المنتجات/"],
    ["hakkimizda/", "من-نحن/"],
    ["degerlerimiz/", "قيمنا/"],
    ["misyon-vizyon/", "الرسالة-والرؤية/"],
    ["belgelerimiz/", "الشهادات/"],
    ["kalite-politikamiz/", "سياسة-الجودة/"],
    ["iletisim/", "اتصل-بنا/"],
    ["katalog/", "كتالوجات/"],
    ["blog/", "المدونة/"],
    ["kvkk/", "حماية-البيانات/"],
    ["gizlilik-politikasi/", "سياسة-الخصوصية/"],
    ["kullanim-kosullari/", "شروط-الاستخدام/"],
    ["tesekkurler/", "شكرا-لكم/"],
  ];

  var TEXT_PAIRS = [
    [
      "2003 yılından beri güvenlik ve estetiği bir arada sunan, TSE belgeli çelik kapı üreticisi. Kaliteli üretim, güvenilir hizmet.",
      "منذ 2003 نقدم الأمان والجمال معاً كمصنع أبواب فولاذية معتمد TSE. إنتاج جيد وخدمة موثوقة."
    ],
    [
      "TSE belgeli üretim ve geniş ürün yelpazemizle projelerinize uygun çözümler için formu doldurun veya bizi arayın.",
      "املأ النموذج أو اتصل بنا لحلول مناسبة لمشاريعكم بإنتاج معتمد TSE ومجموعة منتجات واسعة."
    ],
    [
      "2026 ürün ve lazer kataloglarımızı görüntüleyin, indirin veya çevrimiçi önizleyin.",
      "اعرض أو حمّل كتالوجات 2026 للمنتجات والليزر."
    ],
    [
      "Tarihçemiz, üretim gücümüz ve küresel erişimimiz",
      "تاريخنا وقوة إنتاجنا وانتشارنا العالمي"
    ],
    [
      "Temel ilkelerimiz ve kurumsal değerlerimiz",
      "مبادئنا الأساسية وقيمنا المؤسسية"
    ],
    [
      "Sürekli gelişim ve mükemmellik anlayışımız",
      "التطوير المستمر وفهم التميز"
    ],
    [
      "TS EN 1634-1+A1:2018 Uygunluk Belgesi",
      "شهادة مطابقة TS EN 1634-1+A1:2018"
    ],
    [
      "TSE, ISO ve kalite sertifikalarımız",
      "شهادات TSE وISO والجودة"
    ],
    [
      "2003'ten Beri Güvenilir Çelik Kapı",
      "أبواب فولاذية موثوقة منذ 2003"
    ],
    [
      "Hedeflerimiz ve geleceğe bakışımız",
      "أهدافنا ورؤيتنا للمستقبل"
    ],
    [
      "Ürün kataloglarımızı inceleyin",
      "اطّلع على كتالوجات منتجاتنا"
    ],
    [
      "TSE Yangına Dayanım Belgesi",
      "شهادة TSE لمقاومة الحريق"
    ],
    [
      "TS EN 1435-1 Deney Raporu",
      "تقرير اختبار TS EN 1435-1"
    ],
    [
      "Diğer kurumsal sayfalar",
      "صفحات الشركة الأخرى"
    ],
    [
      "Yiğit Çelik Kapı konumu",
      "موقع Yiğit Çelik Kapı"
    ],
    [
      "Komple Metal Çelik Kapı",
      "أبواب فولاذية معدنية كاملة"
    ],
    [
      "Lüks PVC Kabartma Seri",
      "سلسلة PVC النقش الفاخر"
    ],
    [
      "Tüm hakları saklıdır.",
      "جميع الحقوق محفوظة."
    ],
    [
      "Klasik Laminoks Seri",
      "سلسلة Laminoks الكلاسيكية"
    ],
    [
      "Misyon &amp; Vizyon",
      "الرسالة والرؤية"
    ],
    [
      "Gizlilik Politikası",
      "سياسة الخصوصية"
    ],
    [
      "Kalite belgelerimiz",
      "شهادات الجودة"
    ],
    [
      "Bina Giriş Kapıları",
      "أبواب مدخل المباني"
    ],
    [
      "Çift Açılır Kapılar",
      "أبواب مزدوجة الفتح"
    ],
    [
      "Renkli Saruhan Seri",
      "سلسلة Saruhan الملونة"
    ],
    [
      "Lüks Saruhan Rustik",
      "سلسلة Saruhan Rustik الفاخرة"
    ],
    [
      "Kalite Politikamız",
      "سياسة الجودة"
    ],
    [
      "WhatsApp ile yazın",
      "راسلنا عبر واتساب"
    ],
    [
      "Kullanım Koşulları",
      "شروط الاستخدام"
    ],
    [
      "Tüm Ürünleri Gör →",
      "عرض جميع المنتجات ←"
    ],
    [
      "Ürün karşılaştırma",
      "مقارنة المنتجات"
    ],
    [
      "Tek Açılır Kapılar",
      "أبواب ذات فتح واحد"
    ],
    [
      "Lüks Kabartma Seri",
      "سلسلة النقش الفاخر"
    ],
    [
      "Elit Laminoks Seri",
      "سلسلة Elit Laminoks"
    ],
    [
      "Lüks Kompozit Seri",
      "سلسلة Kompozit الفاخرة"
    ],
    [
      "Lüks Ultralam Seri",
      "سلسلة Ultralam الفاخرة"
    ],
    [
      "Profil Kasalı Seri",
      "سلسلة الإطار Profil"
    ],
    [
      "Kurumsal sayfalar",
      "صفحات الشركة"
    ],
    [
      "Thermo Ahşap Seri",
      "سلسلة Thermo خشب"
    ],
    [
      "Fiyat Teklifi Al",
      "طلب عرض سعر"
    ],
    [
      "Ürün Karşılaştır",
      "مقارنة المنتجات"
    ],
    [
      "Granit Taş Yüzey",
      "سلسلة سطح Granite"
    ],
    [
      "Misyon & Vizyon",
      "الرسالة والرؤية"
    ],
    [
      "Tüm Kataloglar",
      "جميع الكتالوجات"
    ],
    [
      "Hızlı İletişim",
      "تواصل سريع"
    ],
    [
      "Tüm belgeler →",
      "جميع الشهادات ←"
    ],
    [
      "Kalite belgesi",
      "شهادة الجودة"
    ],
    [
      "Sac Panel Seri",
      "سلسلة Panel المعدني"
    ],
    [
      "Nitelikli Seri",
      "سلسلة الجودة"
    ],
    [
      "Sonraki slayt",
      "الشريحة التالية"
    ],
    [
      "ÜRÜN SERİLERİ",
      "سلاسل المنتجات"
    ],
    [
      "Tüm Ürünler →",
      "جميع المنتجات ←"
    ],
    [
      "Ürün Serileri",
      "سلاسل المنتجات"
    ],
    [
      "2026 Kataloğu",
      "Catalog 2026"
    ],
    [
      "2023 Kataloğu",
      "Catalog 2023"
    ],
    [
      "2021 Kataloğu",
      "Catalog 2021"
    ],
    [
      "Camlı Kapılar",
      "أبواب زجاجية"
    ],
    [
      "Lüks PVC Seri",
      "سلسلة PVC الفاخرة"
    ],
    [
      "Yangın Kapısı",
      "أبواب الحريق"
    ],
    [
      "Değerlerimiz",
      "قيمنا"
    ],
    [
      "Belgelerimiz",
      "الشهادات"
    ],
    [
      "Önceki slayt",
      "الشريحة السابقة"
    ],
    [
      "2026 Katalog",
      "Catalog 2026"
    ],
    [
      "Sosyal medya",
      "وسائل التواصل"
    ],
    [
      "Villa Kapısı",
      "أبواب الفillas"
    ],
    [
      "TEKLİF AL →",
      "طلب عرض سعر ←"
    ],
    [
      "Karşılaştır",
      "قارن"
    ],
    [
      "KARŞILAŞTIR",
      "قارن"
    ],
    [
      "Hakkımızda",
      "من نحن"
    ],
    [
      "Fabrikamız",
      "مصنعنا"
    ],
    [
      "Kataloglar",
      "الكتالوجات"
    ],
    [
      "2026 Lazer",
      "Lazer 2026"
    ],
    [
      "Yukarı çık",
      "إلى الأعلى"
    ],
    [
      "Mesajınız…",
      "رسالتك…"
    ],
    [
      "Özellikler",
      "الميزات"
    ],
    [
      "Dil seçici",
      "مبدّل اللغة"
    ],
    [
      "Beyaz Kapı",
      "أبواب بيضاء"
    ],
    [
      "Lazer Seri",
      "سلسلة الليزر"
    ],
    [
      "Bakır Seri",
      "سلسلة النحاس"
    ],
    [
      "Ana Sayfa",
      "الرئيسية"
    ],
    [
      "TEKLİF AL",
      "طلب عرض سعر"
    ],
    [
      "Menüyü aç",
      "فتح القائمة"
    ],
    [
      "Sonraki →",
      "التالي ←"
    ],
    [
      "Soyadınız",
      "اللقب"
    ],
    [
      "Kurumsal",
      "الشركة"
    ],
    [
      "İletişim",
      "اتصل بنا"
    ],
    [
      "GÖNDER →",
      "إرسال ←"
    ],
    [
      "← Önceki",
      "← السابق"
    ],
    [
      "İLETİŞİM",
      "تواصل"
    ],
    [
      "KURUMSAL",
      "الشركة"
    ],
    [
      "Ana menü",
      "القائمة الرئيسية"
    ],
    [
      "Ürünler",
      "المنتجات"
    ],
    [
      "Katalog",
      "كتالوج"
    ],
    [
      "E-posta",
      "البريد الإلكتروني"
    ],
    [
      "Telefon",
      "الهاتف"
    ],
    [
      "Keşfet",
      "استكشف"
    ],
    [
      "Adınız",
      "اسمك"
    ],
    [
      "Soyad",
      "اللقب"
    ],
    [
      "Mesaj",
      "الرسالة"
    ],
    [
      " Ürün",
      " منتج"
    ],
    [
      "Blog",
      "المدونة"
    ],
    [
      "KVKK",
      "حماية البيانات"
    ],
    [
      "Ad",
      "الاسم"
    ]
  ];

  var PLACEHOLDER_PAIRS = [
    ["Adınız", "اسمك"],
    ["Soyadınız", "اللقب"],
    ["E-posta", "البريد الإلكتروني"],
    ["Telefon", "الهاتف"],
    ["Mesajınız…", "رسالتك…"],
  ];

  function remapPathsInHref(href) {
    if (!href || /^(https?:|mailto:|tel:|#|javascript:)/.test(href)) return href;
    var out = href;
    PATH_PAIRS.forEach(function (pair) {
      out = out.split(pair[0]).join(pair[1]);
    });
    return out;
  }

  function applyPaths(rootEl) {
    if (!rootEl) return;
    rootEl.querySelectorAll("a[href]").forEach(function (a) {
      if (a.closest(".lang-switcher") && a.hasAttribute("lang")) return;
      var h = a.getAttribute("href");
      var next = remapPathsInHref(h);
      if (next !== h) a.setAttribute("href", next);
    });
  }

  function applyTextPairs(rootEl) {
    if (!rootEl) return;
    TEXT_PAIRS.forEach(function (pair) {
      rootEl.querySelectorAll("a, button, span, p, h1, h2, h3, h4, label, legend, summary, li, th, td, [title], [aria-label]").forEach(function (el) {
        if (el.children.length === 0) {
          if (el.textContent.trim() === pair[0]) el.textContent = pair[1];
          return;
        }
        el.childNodes.forEach(function (node) {
          if (node.nodeType !== 3) return;
          var raw = node.textContent;
          if (raw.indexOf(pair[0]) !== -1) {
            node.textContent = raw.split(pair[0]).join(pair[1]);
          }
        });
        var title = el.getAttribute("title");
        if (title === pair[0]) el.setAttribute("title", pair[1]);
        var aria = el.getAttribute("aria-label");
        if (aria === pair[0]) el.setAttribute("aria-label", pair[1]);
      });
    });
  }

  function patchProductCountBadges(rootEl) {
    if (!rootEl) return;
    rootEl.querySelectorAll(".mega-series-link .count").forEach(function (badge) {
      badge.textContent = String(badge.textContent || "").replace(/(\d+)\s*Ürün/i, "$1 منتج");
    });
  }

  function patchNavAriaLabels(rootEl) {
    if (!rootEl) return;
    var nav = rootEl.querySelector ? rootEl.querySelector("#site-nav") : null;
    if (nav && nav.getAttribute("aria-label") === "Ana menü") {
      nav.setAttribute("aria-label", "القائمة الرئيسية");
    }
    rootEl.querySelectorAll(".lang-switcher[aria-label]").forEach(function (el) {
      if (el.getAttribute("aria-label") === "Dil seçici") {
        el.setAttribute("aria-label", "مبدّل اللغة");
      }
    });
  }

  function patchWhatsAppFloat() {
    var wa = document.getElementById("whatsapp-float");
    if (!wa) return;
    wa.setAttribute("aria-label", "راسلنا عبر واتساب");
    wa.href =
      "https://wa.me/905071219932?text=" +
      encodeURIComponent("مرحباً، أود الحصول على معلومات حول منتجاتكم.");
  }

  function patchArWhatsAppLinks(rootEl) {
    if (!rootEl) return;
    rootEl.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (!/wa\.me/i.test(href)) return;
      var suffix = "";
      var q = href.indexOf("?");
      if (q >= 0) suffix = href.slice(q);
      a.setAttribute("href", "https://wa.me/905071219932" + suffix);
      if (/\+90\s*507/.test(a.textContent || "")) {
        a.textContent = "+90 507 121 99 32";
      }
    });
  }

  function removeLinkedInLinks(rootEl) {
    if (!rootEl) return;
    rootEl.querySelectorAll('a[href*="linkedin.com"]').forEach(function (a) {
      a.remove();
    });
  }

  function applyPlaceholders(rootEl) {
    if (!rootEl) return;
    PLACEHOLDER_PAIRS.forEach(function (pair) {
      rootEl.querySelectorAll("[placeholder]").forEach(function (el) {
        if (el.getAttribute("placeholder") === pair[0]) el.setAttribute("placeholder", pair[1]);
      });
    });
  }

  function patchFooterCtaTitle() {
    var title = document.getElementById("footer-cta-heading");
    if (!title || title.getAttribute("data-ar-done")) return;
    title.innerHTML = 'اطلب <span class="footer-cta__accent">عرض سعر</span> لمشروعك';
    title.setAttribute("data-ar-done", "1");
  }

  window.yckArSite = {
    applyChrome: function () {
      var roots = [
        document.getElementById("header-root"),
        document.getElementById("footer-root"),
        document.getElementById("corporate-subnav-root"),
        document.getElementById("corporate-crosslinks-root"),
        document.getElementById("corporate-cta-root"),
      ];
      roots.forEach(function (rootEl) {
        applyPaths(rootEl);
        applyTextPairs(rootEl);
        applyPlaceholders(rootEl);
        patchProductCountBadges(rootEl);
        patchNavAriaLabels(rootEl);
        patchArWhatsAppLinks(rootEl);
        removeLinkedInLinks(rootEl);
      });
      patchFooterCtaTitle();
      patchWhatsAppFloat();
    },
    remapPathsInHref: remapPathsInHref,
  };

  document.addEventListener("yck-layout-ready", function () {
    window.yckArSite.applyChrome();
  });

  if (document.getElementById("header-root") && document.getElementById("header-root").children.length) {
    window.yckArSite.applyChrome();
  }

  document.dispatchEvent(new CustomEvent("yck-ar-i18n-ready"));
})();
