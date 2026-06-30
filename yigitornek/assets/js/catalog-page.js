(function () {
  var ROOT = document.body.getAttribute("data-root") || "";

  function isAr() {
    return (document.documentElement.getAttribute("lang") || "").toLowerCase() === "ar";
  }

  function isEn() {
    return (document.documentElement.getAttribute("lang") || "").toLowerCase() === "en";
  }

  function cmsg(tr, ar, en) {
    if (isAr()) return ar;
    if (isEn()) return en || tr;
    return tr;
  }

  var CATALOGS_TR = {    "2026": {
      year: "2026",
      title: "2026 Ürün Kataloğu",
      desc: "En güncel ürün kataloğumuz. Tüm yeni modeller, renk seçenekleri ve seriler tek dosyada.",
      pdf: ROOT + "assets/catalog/yigit_celikkapi_2026_katalog.pdf",
      cover: ROOT + "assets/catalog/covers/cover-2026.png",
      coverAlt: "Yiğit Çelik Kapı 2026 ürün kataloğu kapağı",
      downloadName: "Yigit-Celik-Kapi-2026-Katalog.pdf",
      size: "~21 MB",
      highlights: [
        "Lüks Kompozit, Ultralam ve Lazer serileri",
        "Villa, bina girişi ve yangın kapısı modelleri",
        "Model kodları ve teknik özellikler",
        "TSE belgeli üretim standartları",
      ],
    },
    "2023": {
      year: "2023",
      title: "2023 Ürün Kataloğu",
      desc: "Güvenlik çelik kapı sistemlerimizin kapsamlı tanıtımı; laminoks, kompozit ve PVC serileri.",
      pdf: ROOT + "assets/catalog/yigit_celikkapi_2023_katalog.pdf",
      cover: ROOT + "assets/catalog/covers/cover-2023.png",
      coverAlt: "Yiğit Çelik Kapı 2023 ürün kataloğu kapağı",
      downloadName: "Yigit-Celik-Kapi-2023-Katalog.pdf",
      size: "~26 MB",
      highlights: [
        "Laminoks ve PVC kabartma serileri",
        "Sac panel ve granit taş yüzey modelleri",
        "Çift açılır ve camlı kapı seçenekleri",
        "Avrupa ve Orta Doğu ihracat referansları",
      ],
    },
    "2021": {
      year: "2021",
      title: "2021 Ürün Kataloğu",
      desc: "Klasik ürün gamımızı yansıtan arşiv kataloğumuz; temel seriler ve model çeşitliliği.",
      pdf: ROOT + "assets/catalog/yigit_celikkapi_2021_katalog.pdf",
      cover: ROOT + "assets/catalog/covers/cover-2021.png",
      coverAlt: "Yiğit Çelik Kapı 2021 ürün kataloğu kapağı",
      downloadName: "Yigit-Celik-Kapi-2021-Katalog.pdf",
      size: "~12 MB",
      highlights: [
        "Elit Laminoks ve Klasik Laminoks serileri",
        "Renkli Saruhan ve rustik modeller",
        "Villa ve apartman giriş kapıları",
        "Yiğit Çelik Kapı üretim kapasitesi ve kalite",
      ],
    },
    "lazer-2026": {
      year: "2026",
      title: "2026 Lazer Katalog",
      desc: "Lazer kesim panel desenleri ve LAZER serisi modeller. Desen kodları, uygulama örnekleri ve teknik bilgiler.",
      pdf: ROOT + "assets/catalog/yigit_lazer_katalog_2026.pdf",
      cover: ROOT + "assets/catalog/covers/lazer-katalogu-2026.webp",
      coverAlt: "Yiğit Çelik Kapı 2026 Lazer katalog kapağı",
      downloadName: "Yigit-Lazer-Katalog-2026.pdf",
      size: "~41 MB",
      highlights: [
        "Lazer kesim panel desenleri",
        "LAZER serisi model kodları",
        "Villa ve giriş kapısı uygulamaları",
        "Yiğit Çelik Kapı lazer üretim kapasitesi",
      ],
    },
  };

  var CATALOGS_AR = {
    "2026": {
      year: "2026",
      title: "Catalog منتجات 2026",
      desc: "أحدث كتالوج منتجاتنا. جميع النماذج الجديدة والألوان والسلاسل في ملف واحد.",
      pdf: ROOT + "assets/catalog/yigit_celikkapi_2026_katalog.pdf",
      cover: ROOT + "assets/catalog/covers/cover-2026.png",
      coverAlt: "غلاف Catalog 2026 — Yiğit Çelik Kapı",
      downloadName: "Yigit-Celik-Kapi-2026-Katalog.pdf",
      size: "~21 MB",
      highlights: [
        "سلاسل Kompozit الفاخر وUltralam والليزر",
        "نماذج فيلا ومداخل مباني وأبواب حريق",
        "رموز النماذج والمواصفات الفنية",
        "معايير إنتاج معتمدة TSE",
      ],
    },
    "2023": {
      year: "2023",
      title: "Catalog منتجات 2023",
      desc: "عرض شامل لأنظمة الأبواب الفولاذية؛ سلاسل laminoks وkompozit وPVC.",
      pdf: ROOT + "assets/catalog/yigit_celikkapi_2023_katalog.pdf",
      cover: ROOT + "assets/catalog/covers/cover-2023.png",
      coverAlt: "غلاف Catalog 2023 — Yiğit Çelik Kapı",
      downloadName: "Yigit-Celik-Kapi-2023-Katalog.pdf",
      size: "~26 MB",
      highlights: [
        "سلاسل laminoks وPVC المنقوش",
        "نماذج panel معدني وسطح granit",
        "خيارات أبواب مزدوجة وزجاجية",
        "مراجع تصدير أوروبا والشرق الأوسط",
      ],
    },
    "2021": {
      year: "2021",
      title: "Catalog منتجات 2021",
      desc: "كتالوج أرشيفي يعكس مجموعة منتجاتنا الكلاسيكية.",
      pdf: ROOT + "assets/catalog/yigit_celikkapi_2021_katalog.pdf",
      cover: ROOT + "assets/catalog/covers/cover-2021.png",
      coverAlt: "غلاف Catalog 2021 — Yiğit Çelik Kapı",
      downloadName: "Yigit-Celik-Kapi-2021-Katalog.pdf",
      size: "~12 MB",
      highlights: [
        "سلاسل Elit Laminoks وKlasik Laminoks",
        "نماذج Saruhan الملونة والrustik",
        "أبواب فيلا ومداخل شقق",
        "طاقة إنتاج وجودة Yiğit Çelik Kapı",
      ],
    },
    "lazer-2026": {
      year: "2026",
      title: "Catalog Lazer 2026",
      desc: "أنماط panel بالقطع بالليزر ونماذج سلسلة LAZER.",
      pdf: ROOT + "assets/catalog/yigit_lazer_katalog_2026.pdf",
      cover: ROOT + "assets/catalog/covers/lazer-katalogu-2026.webp",
      coverAlt: "غلاف Catalog Lazer 2026",
      downloadName: "Yigit-Lazer-Katalog-2026.pdf",
      size: "~41 MB",
      highlights: [
        "أنماط panel بالقطع بالليزر",
        "رموز نماذج سلسلة LAZER",
        "تطبيقات فيلا ومداخل",
        "قدرة إنتاج الليزر",
      ],
    },
  };

  var CATALOGS_EN = {
    "2026": {
      year: "2026",
      title: "2026 Product Catalog",
      desc: "Our latest product catalog. All new models, colour options and series in one file.",
      pdf: ROOT + "assets/catalog/yigit_celikkapi_2026_katalog.pdf",
      cover: ROOT + "assets/catalog/covers/cover-2026.png",
      coverAlt: "Yiğit Çelik Kapı 2026 product catalog cover",
      downloadName: "Yigit-Celik-Kapi-2026-Katalog.pdf",
      size: "~21 MB",
      highlights: [
        "Luxury Composite, Ultralam and Laser series",
        "Villa, building entrance and fire-rated door models",
        "Model codes and technical specifications",
        "TSE-certified production standards",
      ],
    },
    "2023": {
      year: "2023",
      title: "2023 Product Catalog",
      desc: "Comprehensive overview of our security steel door systems; laminox, composite and PVC series.",
      pdf: ROOT + "assets/catalog/yigit_celikkapi_2023_katalog.pdf",
      cover: ROOT + "assets/catalog/covers/cover-2023.png",
      coverAlt: "Yiğit Çelik Kapı 2023 product catalog cover",
      downloadName: "Yigit-Celik-Kapi-2023-Katalog.pdf",
      size: "~26 MB",
      highlights: [
        "Laminox and PVC embossed series",
        "Sheet panel and granite stone surface models",
        "Double-leaf and glazed door options",
        "Europe and Middle East export references",
      ],
    },
    "2021": {
      year: "2021",
      title: "2021 Product Catalog",
      desc: "Archive catalog reflecting our classic product range; core series and model variety.",
      pdf: ROOT + "assets/catalog/yigit_celikkapi_2021_katalog.pdf",
      cover: ROOT + "assets/catalog/covers/cover-2021.png",
      coverAlt: "Yiğit Çelik Kapı 2021 product catalog cover",
      downloadName: "Yigit-Celik-Kapi-2021-Katalog.pdf",
      size: "~12 MB",
      highlights: [
        "Elite Laminox and Classic Laminox series",
        "Colour Saruhan and rustic models",
        "Villa and apartment entrance doors",
        "Yiğit Çelik Kapı production capacity and quality",
      ],
    },
    "lazer-2026": {
      year: "2026",
      title: "2026 Laser Catalog",
      desc: "Laser-cut panel patterns and LAZER series models. Pattern codes, application examples and technical details.",
      pdf: ROOT + "assets/catalog/yigit_lazer_katalog_2026.pdf",
      cover: ROOT + "assets/catalog/covers/lazer-katalogu-2026.webp",
      coverAlt: "Yiğit Çelik Kapı 2026 Laser catalog cover",
      downloadName: "Yigit-Lazer-Katalog-2026.pdf",
      size: "~41 MB",
      highlights: [
        "Laser-cut panel patterns",
        "LAZER series model codes",
        "Villa and entrance door applications",
        "Yiğit Çelik Kapı laser production capacity",
      ],
    },
  };

  function getCatalogs() {
    if (isAr()) return CATALOGS_AR;
    if (isEn()) return CATALOGS_EN;
    return CATALOGS_TR;
  }

  var DEFAULT = "2026";

  function parseHash() {
    var hash = (location.hash || "").replace(/^#/, "");
    var catalogs = getCatalogs();
    return catalogs[hash] ? hash : DEFAULT;
  }
  function renderHighlights(items) {
    return items.map(function (text) {
      return "<li>" + text + "</li>";
    }).join("");
  }

  function setCatalog(year) {
    var catalogs = getCatalogs();
    var data = catalogs[year];
    if (!data) return;
    var cover = document.getElementById("catalog-cover");
    var eyebrow = document.getElementById("catalog-eyebrow");
    var title = document.getElementById("catalog-title");
    var desc = document.getElementById("catalog-desc");
    var highlights = document.getElementById("catalog-highlights");
    var viewBtn = document.getElementById("catalog-view-btn");
    var downloadBtn = document.getElementById("catalog-download-btn");
    var note = document.getElementById("catalog-note");
    var viewerTitle = document.getElementById("catalog-viewer-title");
    var viewerOpen = document.getElementById("catalog-viewer-open");
    var frame = document.getElementById("catalog-frame");
    var panel = document.getElementById("catalog-panel");

    if (cover) {
      cover.src = data.cover;
      cover.alt = data.coverAlt;
    }
    if (eyebrow) eyebrow.textContent = data.year + " · " + cmsg("PDF Katalog", "PDF Catalog", "PDF Catalog");
    if (title) title.textContent = data.title;
    if (desc) desc.textContent = data.desc;
    if (highlights) highlights.innerHTML = renderHighlights(data.highlights);
    if (viewBtn) {
      viewBtn.href = data.pdf;
      if (viewBtn.lastChild && viewBtn.lastChild.nodeType === 3) {
        viewBtn.lastChild.textContent = " " + cmsg("PDF Görüntüle", "عرض PDF", "View PDF");
      }
    }
    if (downloadBtn) {
      downloadBtn.href = data.pdf;
      downloadBtn.setAttribute("download", data.downloadName);
      if (downloadBtn.lastChild && downloadBtn.lastChild.nodeType === 3) {
        downloadBtn.lastChild.textContent = " " + cmsg("PDF İndir", "تحميل PDF", "Download PDF");
      }
    }
    if (note) {
      note.textContent =
        cmsg("PDF format · ", "صيغة PDF · ", "PDF format · ") +
        data.size +
        cmsg(" · Bayiler ve proje planlaması için uygundur.", " · مناسب للموزّعين وتخطيط المشاريع.", " · Suitable for dealers and project planning.");
    }
    if (viewerTitle) {
      viewerTitle.textContent = data.title + cmsg(" — Çevrimiçi Önizleme", " — معاينة على الإنترنت", " — Online Preview");
    }
    if (viewerOpen) {
      viewerOpen.href = data.pdf;
      viewerOpen.textContent = cmsg("Yeni sekmede aç", "فتح في تبويب جديد", "Open in new tab");
    }
    if (frame) {
      frame.src = data.pdf + "#view=FitH";
      frame.title = cmsg(
        "Yiğit Çelik Kapı " + data.year + " ürün kataloğu PDF",
        "PDF Catalog " + data.year + " — Yiğit Çelik Kapı",
        "Yiğit Çelik Kapı " + data.year + " product catalog PDF"
      );
    }
    if (panel) panel.setAttribute("aria-labelledby", "catalog-tab-" + year);

    document.querySelectorAll(".catalog-picker__item").forEach(function (btn) {
      var active = btn.getAttribute("data-catalog") === year;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (location.hash !== "#" + year) {
      history.replaceState(null, "", "#" + year);
    }

    document.title = data.title + " | Yiğit Çelik Kapı";
  }

  function init() {
    var picker = document.querySelector(".catalog-picker");
    if (!picker) return;

    picker.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-catalog]");
      if (!btn) return;
      setCatalog(btn.getAttribute("data-catalog"));
    });

    window.addEventListener("hashchange", function () {
      setCatalog(parseHash());
    });

    setCatalog(parseHash());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
