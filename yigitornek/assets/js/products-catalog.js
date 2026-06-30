/**
 * Seri sayfası: #series-product-grid[data-series-slug]
 * Ürünler sayfası: #all-products-catalog
 * Veri: assets/data/products.json
 */
(function () {
  var SERIES_BATCH = 12;
  var productLinks = {};

  /** Mega menü / urunler#hash ile eşleşen özellik slug'ları */
  var FEATURE_SLUGS = [
    "beyaz-kapi",
    "bina-giris-kapilari",
    "camli-kapilar",
    "cift-acilir-kapilar",
    "komple-metal-celik-kapi",
    "tek-acilir-kapilar",
    "villa-kapisi",
  ];

  function root() {
    return document.body.getAttribute("data-root") || "";
  }

  function isArLang() {
    return (document.documentElement.getAttribute("lang") || "").toLowerCase() === "ar";
  }

  function isEnLang() {
    return (document.documentElement.getAttribute("lang") || "").toLowerCase() === "en";
  }

  function catMsg(tr, ar, en) {
    if (isArLang()) return ar;
    if (isEnLang()) return en || tr;
    return tr;
  }

  var productStringsAr = null;
  var productSpecsAr = null;
  var productStringsEn = null;
  var productSpecsEn = null;

  async function loadProductI18n() {
    if (isArLang() && productStringsAr) return;
    if (isEnLang() && productStringsEn) return;
    if (!isArLang() && !isEnLang()) return;
    try {
      var base = root() + "assets/data/i18n/";
      if (isArLang()) {
        var responses = await Promise.all([
          fetch(base + "product-strings-ar.json"),
          fetch(base + "product-specs-ar.json"),
        ]);
        if (responses[0].ok) productStringsAr = await responses[0].json();
        if (responses[1].ok) productSpecsAr = await responses[1].json();
      } else if (isEnLang()) {
        var responsesEn = await Promise.all([
          fetch(base + "product-strings-en.json"),
          fetch(base + "product-specs-en.json"),
        ]);
        if (responsesEn[0].ok) productStringsEn = await responsesEn[0].json();
        if (responsesEn[1].ok) productSpecsEn = await responsesEn[1].json();
      }
    } catch (e) {
      console.warn("products-catalog: i18n load failed", e);
    }
  }

  function mapArLookup(map, text) {
    if (!map || text == null || text === "") return text;
    var key = String(text);
    return map[key] || text;
  }

  function productName(p) {
    var name = p.name || "";
    if (isArLang() && productStringsAr) {
      return mapArLookup(productStringsAr.names, name) || name;
    }
    if (isEnLang() && productStringsEn) {
      return mapArLookup(productStringsEn.names, name) || name;
    }
    return name;
  }

  function productSummary(p) {
    var summary = p.summary || p.name || "";
    if (isArLang() && productStringsAr) {
      return mapArLookup(productStringsAr.summaries, summary) || summary;
    }
    if (isEnLang() && productStringsEn) {
      return mapArLookup(productStringsEn.summaries, summary) || summary;
    }
    return summary;
  }

  function productSpec(text) {
    if (!text) return "";
    if (isArLang() && productSpecsAr) {
      return mapArLookup(productSpecsAr, text) || text;
    }
    if (isEnLang() && productSpecsEn) {
      return mapArLookup(productSpecsEn, text) || text;
    }
    return text;
  }

  function seriesNameFromProduct(p) {
    if (isArLang() && SERIES_NAMES_AR[p.seriesSlug]) return SERIES_NAMES_AR[p.seriesSlug];
    if (isEnLang() && SERIES_NAMES_EN[p.seriesSlug]) return SERIES_NAMES_EN[p.seriesSlug];
    return p.seriesName || p.seriesSlug || "";
  }

  var SERIES_SLUG_AR = {
    "luks-kabartma-seri": "سلسلة-النقش-الفاخر",
    "luks-pvc-kabartma-seri": "سلسلة-pvc-النقش-الفاخر",
    "luks-pvc-seri": "سلسلة-pvc-الفاخر",
    "elit-laminoks-seri": "سلسلة-اليت-لامينокс",
    "luks-kompozit-seri": "سلسلة-الكompozit-الفاخر",
    "renkli-saruhan-seri": "سلسلة-ساروهان-الملونة",
    "luks-saruhan-rustik": "سلسلة-سارuhan-الrustik",
    "luks-ultralam-seri": "سلسلة-ultralam-الفاخر",
    "klasik-laminoks-seri": "سلسلة-لامينокс-الكلاسيكي",
    "sac-panel-seri": "سلسلة-الpanel-المعدني",
    "lazer-seri": "سلسلة-الليزر",
    "profik-kasali-seri": "سلسلة-الإطار-المprofil",
    "thermo-ahsap-seri": "سلسلة-thermo-خشب",
    "granit-tas-yuzey": "سلسلة-سطح-الجرanit",
    "nitelikli-seri": "سلسلة-الجودة",
    "bakir-seri": "سلسلة-النحاس",
    "yangin-kapisi": "سلسلة-ابواب-الحريق",
  };

  var SERIES_NAMES_AR = {
    "luks-kabartma-seri": "سلسلة النقش الفاخر",
    "luks-pvc-kabartma-seri": "سلسلة PVC النقش الفاخر",
    "luks-pvc-seri": "سلسلة PVC الفاخرة",
    "elit-laminoks-seri": "سلسلة Elit Laminoks",
    "luks-kompozit-seri": "سلسلة Kompozit الفاخرة",
    "renkli-saruhan-seri": "سلسلة Saruhan الملونة",
    "luks-saruhan-rustik": "سلسلة Saruhan Rustik الفاخرة",
    "luks-ultralam-seri": "سلسلة Ultralam الفاخرة",
    "klasik-laminoks-seri": "سلسلة Laminoks الكلاسيكية",
    "sac-panel-seri": "سلسلة Panel المعدني",
    "lazer-seri": "سلسلة الليزر",
    "profik-kasali-seri": "سلسلة الإطار Profil",
    "thermo-ahsap-seri": "سلسلة Thermo خشب",
    "granit-tas-yuzey": "سلسلة سطح Granite",
    "nitelikli-seri": "سلسلة الجودة",
    "bakir-seri": "سلسلة النحاس",
    "yangin-kapisi": "أبواب الحريق",
  };

  var SERIES_NAMES_EN = {
    "luks-kabartma-seri": "Luxury Embossed Series",
    "luks-pvc-kabartma-seri": "Luxury PVC Embossed Series",
    "luks-pvc-seri": "Luxury PVC Series",
    "elit-laminoks-seri": "Elite Laminox Series",
    "luks-kompozit-seri": "Luxury Composite Series",
    "renkli-saruhan-seri": "Colour Saruhan Series",
    "luks-saruhan-rustik": "Luxury Saruhan Rustik",
    "luks-ultralam-seri": "Luxury Ultralam Series",
    "klasik-laminoks-seri": "Classic Laminox Series",
    "sac-panel-seri": "Sheet Panel Series",
    "lazer-seri": "Laser Series",
    "profik-kasali-seri": "Profile Frame Series",
    "thermo-ahsap-seri": "Thermo Wood Series",
    "granit-tas-yuzey": "Granite Stone Surface",
    "nitelikli-seri": "Premium Series",
    "bakir-seri": "Copper Series",
    "yangin-kapisi": "Fire-Rated Doors",
  };

  function mapTrPathToAr(base) {
    if (!base) return base;
    var out = String(base);
    out = out
      .replace(/^urunler\//, "المنتجات/")
      .replace(/^urun-karsilastirma\//, "مقارنة-المنتجات/")
      .replace(/^fiyat-teklifi\//, "طلب-عرض-سعر/");
    var seriesMatch = out.match(/^seri\/([^/]+)\/(.*)$/);
    if (seriesMatch && SERIES_SLUG_AR[seriesMatch[1]]) {
      out = "السلسلة/" + SERIES_SLUG_AR[seriesMatch[1]] + "/" + seriesMatch[2];
    }
    var productMatch = out.match(/^urun\/((?:yc|yn)-[a-z0-9-]+)/i);
    if (productMatch) {
      var shortCode = productMatch[1].match(/^((?:yc|yn)-\d+)/i);
      if (shortCode) {
        out = "منتج/" + shortCode[1].toLowerCase() + "/index.html";
      } else {
        out = out.replace(/^urun\//, "منتج/");
      }
    }
    return out;
  }

  function seriesDisplayName(row) {
    if (isArLang() && SERIES_NAMES_AR[row.slug]) return SERIES_NAMES_AR[row.slug];
    if (isEnLang() && SERIES_NAMES_EN[row.slug]) return SERIES_NAMES_EN[row.slug];
    return row.name;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function slugify(v) {
    var map = {
      "ç": "c", "Ç": "c",
      "ğ": "g", "Ğ": "g",
      "ı": "i", "İ": "i",
      "ö": "o", "Ö": "o",
      "ş": "s", "Ş": "s",
      "ü": "u", "Ü": "u",
    };
    var out = String(v || "")
      .split("")
      .map(function (ch) { return map[ch] || ch; })
      .join("")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    return out || "urun";
  }

  function detailHref(p) {
    var lang = (document.documentElement.getAttribute("lang") || "tr").toLowerCase();
    var base = productLinks[String(p.id)];
    if (!base) {
      var slug = slugify((p.code || "") + "-" + (p.name || ""));
      base = "urun/" + slug + "/index.html";
    }
    if (lang === "ar") {
      base = mapTrPathToAr(base);
      return root() + "ar/" + base;
    }
    if ((lang === "en" || lang === "de") && base.indexOf(lang + "/") !== 0) {
      base = lang + "/" + base;
    }
    return root() + base;
  }

  function hasEmbeddedCatalog() {
    return (
      window.YCK_PRODUCTS &&
      Array.isArray(window.YCK_PRODUCTS) &&
      window.YCK_PRODUCT_LINKS &&
      typeof window.YCK_PRODUCT_LINKS === "object"
    );
  }

  function waitForEmbeddedCatalog() {
    return new Promise(function (resolve, reject) {
      if (hasEmbeddedCatalog()) return resolve();
      var tries = 0;
      var timer = setInterval(function () {
        if (hasEmbeddedCatalog()) {
          clearInterval(timer);
          resolve();
        } else if (++tries > 150) {
          clearInterval(timer);
          reject(new Error("products-data timeout"));
        }
      }, 30);
    });
  }

  function ensureProductsDataScript() {
    if (hasEmbeddedCatalog()) return Promise.resolve();

    if (document.querySelector("script[data-yck-products-data]")) {
      return waitForEmbeddedCatalog();
    }

    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = root() + "assets/js/products-data.js";
      script.setAttribute("data-yck-products-data", "1");
      script.onload = function () {
        if (hasEmbeddedCatalog()) resolve();
        else reject(new Error("products-data incomplete"));
      };
      script.onerror = function () {
        reject(new Error("products-data load failed"));
      };
      document.head.appendChild(script);
    });
  }

  async function loadCatalogData() {
    if (hasEmbeddedCatalog()) {
      return {
        products: window.YCK_PRODUCTS,
        links: window.YCK_PRODUCT_LINKS,
      };
    }

    if (window.location.protocol === "file:") {
      await ensureProductsDataScript();
      return {
        products: window.YCK_PRODUCTS,
        links: window.YCK_PRODUCT_LINKS || {},
      };
    }

    try {
      var productsUrl = root() + "assets/data/products.json";
      var linksUrl = root() + "assets/data/product-links.json";
      var responses = await Promise.all([fetch(productsUrl), fetch(linksUrl)]);
      if (responses[0].ok && responses[1].ok) {
        return {
          products: await responses[0].json(),
          links: await responses[1].json(),
        };
      }
    } catch (e) {
      console.warn("products-catalog: fetch failed, using embedded data", e);
    }

    await ensureProductsDataScript();
    return {
      products: window.YCK_PRODUCTS,
      links: window.YCK_PRODUCT_LINKS || {},
    };
  }

  function localizedPath(base) {
    var lang = (document.documentElement.getAttribute("lang") || "tr").toLowerCase();
    if (lang === "ar") {
      return root() + "ar/" + mapTrPathToAr(base);
    }
    if (lang === "en" || lang === "de") {
      return root() + lang + "/" + base;
    }
    return root() + base;
  }

  function wireSeriesCardNavigation(items) {
    var mount = document.getElementById("series-product-grid");
    if (!mount) return;
    var map = {};
    items.forEach(function (p) {
      map[String(p.id)] = p;
    });

    mount.addEventListener("click", function (e) {
      // Compare checkbox clicks should NOT navigate.
      if (e.target && e.target.closest && e.target.closest(".js-compare-cb")) return;
      if (e.target && e.target.closest && e.target.closest(".product-card__compare-wrap")) return;
      if (e.target && e.target.closest && e.target.closest("a")) return;

      var card = e.target && e.target.closest ? e.target.closest(".product-card--series") : null;
      if (!card) return;

      var id = card.getAttribute("data-product-id");
      var p = map[String(id || "")];
      if (!p) return;

      window.location.href = detailHref(p);
    });

    mount.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (e.target && e.target.closest && e.target.closest(".js-compare-cb")) return;
      if (e.target && e.target.closest && e.target.closest(".product-card__compare-wrap")) return;
      if (e.target && e.target.closest && e.target.closest("a")) return;

      var card = e.target && e.target.closest ? e.target.closest(".product-card--series") : null;
      if (!card) return;

      var id = card.getAttribute("data-product-id");
      var p = map[String(id || "")];
      if (!p) return;

      e.preventDefault();
      window.location.href = detailHref(p);
    });
  }

  /** Yerel yol (assets/...) veya tam URL */
  function imgSrc(p) {
    var u = p.image || "";
    if (/^https?:\/\//i.test(u)) return u;
    return root() + u;
  }

  function cmp() {
    return window.yigitCompare || null;
  }

  function wireSeriesCompare() {
    var mount = document.getElementById("series-product-grid");
    if (!mount) return;

    function syncFromStorage() {
      var compare = cmp();
      if (!compare) return;
      var ids = compare.getIds();
      mount.querySelectorAll(".js-compare-cb").forEach(function (cb) {
        var id = Number(cb.getAttribute("data-product-id"));
        cb.checked = ids.indexOf(id) !== -1;
      });
      compare.updateBadges();
    }

    mount.addEventListener("change", function (e) {
      var t = e.target;
      if (!t || !t.classList || !t.classList.contains("js-compare-cb")) return;
      var compare = cmp();
      if (!compare) return;
      var id = Number(t.getAttribute("data-product-id"));
      var ids = compare.getIds();
      var inList = ids.indexOf(id) !== -1;
      if (t.checked && !inList) {
        var result = compare.toggle(id);
        if (result.action === "limited") t.checked = false;
      } else if (!t.checked && inList) {
        compare.toggle(id);
      }
    });

    syncFromStorage();
    window.addEventListener("storage", function (ev) {
      var compare = cmp();
      if (compare && ev.key === compare.KEY) syncFromStorage();
    });
    window.addEventListener("yck-compare-change", syncFromStorage);
  }

  /** WordPress ile aynı sıra (sayılar products.json'dan hesaplanır) */
  var SERIES_NAV = [
    { slug: "luks-kabartma-seri", name: "Lüks Kabartma Seri" },
    { slug: "luks-pvc-kabartma-seri", name: "Lüks PVC Kabartma Seri" },
    { slug: "luks-pvc-seri", name: "Lüks PVC Seri" },
    { slug: "elit-laminoks-seri", name: "Elit Laminoks Seri" },
    { slug: "luks-kompozit-seri", name: "Lüks Kompozit Seri" },
    { slug: "renkli-saruhan-seri", name: "Renkli Saruhan Seri" },
    { slug: "luks-saruhan-rustik", name: "Lüks Saruhan Rustik" },
    { slug: "luks-ultralam-seri", name: "Lüks Ultralam Seri" },
    { slug: "klasik-laminoks-seri", name: "Klasik Laminoks Seri" },
    { slug: "sac-panel-seri", name: "Sac Panel Seri" },
    { slug: "lazer-seri", name: "Lazer Seri" },
    { slug: "profik-kasali-seri", name: "Profil Kasalı Seri" },
    { slug: "thermo-ahsap-seri", name: "Thermo Ahşap Seri" },
    { slug: "granit-tas-yuzey", name: "Granit Taş Yüzey" },
    { slug: "nitelikli-seri", name: "Nitelikli Seri" },
    { slug: "bakir-seri", name: "Bakır Seri" },
    { slug: "yangin-kapisi", name: "Yangın Kapısı" },
  ];

  function seriesCountsFromProducts(products) {
    var counts = {};
    products.forEach(function (p) {
      var slug = p.seriesSlug;
      if (slug) counts[slug] = (counts[slug] || 0) + 1;
    });
    return counts;
  }

  function buildSeriesSidebar(currentSlug, countMap) {
    var html =
      '<div class="series-sidebar__panel">' +
      '<nav class="series-sidebar" aria-label="' +
      catMsg("Ürün serileri", "سلاسل المنتجات", "Product series") +
      '">' +
      '<p class="series-sidebar__title">' +
      catMsg("Ürün Serileri", "سلاسل المنتجات", "Product series") +
      "</p>" +
      '<ul class="series-sidebar__list">';
    SERIES_NAV.forEach(function (row) {
      var href = localizedPath("seri/" + row.slug + "/index.html");
      var active = row.slug === currentSlug;
      var cls = "series-sidebar__link" + (active ? " is-active" : "");
      var count = countMap[row.slug] || 0;
      var label = seriesDisplayName(row);
      html +=
        "<li>" +
        '<a class="' +
        cls +
        '" href="' +
        esc(href) +
        '" aria-label="' +
        esc(label + ", " + count + " " + catMsg("ürün", "منتج", "products")) +
        '">' +
        '<span class="series-sidebar__label">' +
        esc(label) +
        "</span>" +
        '<span class="series-sidebar__count" aria-hidden="true">' +
        count +
        "</span>" +
        "</a></li>";
    });
    html +=
      "</ul></nav>" +
      '<div class="series-sidebar__actions">' +
      '<a href="' +
      esc(localizedPath("urunler/index.html")) +
      '" class="series-sidebar__action series-sidebar__action--ghost">' +
      catMsg("Tüm Ürünler", "جميع المنتجات", "All Products") +
      "</a>" +
      '<a href="' +
      esc(localizedPath("urun-karsilastirma/index.html")) +
      '" class="series-sidebar__action series-sidebar__action--primary" data-yck-compare-link>' +
      catMsg("Karşılaştır ", "قارن ", "Compare ") +
      '<span class="yck-compare-badge yck-compare-badge--sidebar js-compare-badge" aria-label="' +
      catMsg("Seçili ürün sayısı", "عدد المنتجات المحددة", "Selected product count") +
      '" hidden aria-hidden="true">0</span>' +
      "</a></div></div>";
    return html;
  }

  function renderProductImageBlock(p, href, variant) {
    var imgHtml =
      '<img src="' +
      esc(imgSrc(p)) +
      '" alt="' +
      esc(productName(p)) +
      '" loading="lazy" width="600" height="800"/>' +
      '<span class="product-card__overlay" aria-hidden="true">' +
      catMsg("Detay İncele", "عرض التفاصيل", "View details") +
      "</span>";

    if (variant === "series") {
      var id = String(p.id);
      var compareLabel = esc(
        p.code + " – " + productName(p) + " " + catMsg("karşılaştırmaya ekle", "أضف للمقارنة", "add to compare")
      );
      return (
        '<div class="product-card__img product-card__img--series">' +
        '<label class="product-card__compare-wrap">' +
        '<input type="checkbox" class="product-card__compare js-compare-cb" data-product-id="' +
        esc(id) +
        '" aria-label="' +
        compareLabel +
        '"/>' +
        "</label>" +
        '<a href="' +
        esc(href) +
        '" aria-label="' +
        catMsg("Ürün detayını aç", "فتح تفاصيل المنتج", "Open product details") +
        '">' +
        imgHtml +
        "</a></div>"
      );
    }

    return '<a class="product-card__img" href="' + esc(href) + '">' + imgHtml + "</a>";
  }

  function renderProductCard(p, options) {
    var opts = options || {};
    var variant = opts.variant === "series" ? "series" : "catalog";
    var href = detailHref(p);

    if (variant === "series") {
      var id = String(p.id);
      var cardLabel = esc(
        p.code + " – " + productName(p) + ", " + catMsg("ürün detayı", "تفاصيل المنتج", "product details")
      );
      return (
        '<article class="product-card product-card--series" data-product-id="' +
        esc(id) +
        '" tabindex="0" aria-label="' +
        cardLabel +
        '">' +
        renderProductImageBlock(p, href, "series") +
        '<div class="product-card__body product-card__body--series">' +
        '<p class="product-card__code-line">' +
        '<span class="product-card__code-label">' +
        catMsg("KOD:", "الرمز:", "CODE:") +
        "</span> " +
        "<strong>" +
        esc(p.code) +
        "</strong></p>" +
        '<p class="product-card__desc"><a href="' +
        esc(href) +
        '">' +
        esc(productSummary(p)) +
        "</a></p>" +
        "</div></article>"
      );
    }

    return (
      '<article class="product-card">' +
      renderProductImageBlock(p, href, "catalog") +
      '<div class="product-card__body">' +
      '<span class="product-card__code">' +
      esc(p.code) +
      "</span>" +
      '<h3 class="product-card__title"><a href="' +
      esc(href) +
      '">' +
      esc(productName(p)) +
      "</a></h3>" +
      '<ul class="product-card__meta">' +
      "<li><strong>" +
      catMsg("Renk:", "اللون:", "Colour:") +
      "</strong> " +
      esc(productSpec(p.color)) +
      "</li>" +
      "<li><strong>" +
      catMsg("Kasa:", "الإطار:", "Frame:") +
      "</strong> " +
      esc(productSpec(p.design)) +
      "</li>" +
      "<li><strong>" +
      catMsg("Malzeme:", "المادة:", "Material:") +
      "</strong> " +
      esc(productSpec(p.material)) +
      "</li>" +
      "</ul></div></article>"
    );
  }

  function card(p) {
    return renderProductCard(p, { variant: "catalog" });
  }

  function cardSeries(p) {
    return renderProductCard(p, { variant: "series" });
  }

  function normText(s) {
    return String(s || "")
      .toLocaleLowerCase("tr")
      .replace(/\s+/g, " ")
      .trim();
  }

  function productSearchBlob(p) {
    return normText(
      [p.code, p.name, p.summary, p.color, p.design, p.material, p.seriesName].join(" ")
    );
  }

  function uniqueColors(products) {
    var seen = {};
    products.forEach(function (p) {
      var c = String(p.color || "").trim();
      if (c && c !== "-") seen[c] = true;
    });
    return Object.keys(seen).sort(function (a, b) {
      return a.localeCompare(b, "tr");
    });
  }

  function catalogFiltersActive(filters) {
    return !!(filters.query || filters.series || filters.color || filters.feature);
  }

  function filterCatalogProducts(all, filters) {
    var q = normText(filters.query);
    var qCompact = q.replace(/\s+/g, "");
    return all.filter(function (p) {
      if (filters.series && p.seriesSlug !== filters.series) return false;
      if (filters.color && String(p.color || "").trim() !== filters.color) return false;
      if (filters.feature) {
        var feats = p.features || [];
        if (feats.indexOf(filters.feature) === -1) return false;
      }
      if (!q) return true;
      var blob = productSearchBlob(p);
      if (blob.indexOf(q) !== -1) return true;
      if (qCompact && blob.replace(/\s+/g, "").indexOf(qCompact) !== -1) return true;
      return false;
    });
  }

  function seriesOrderIndex(slug) {
    for (var i = 0; i < SERIES_NAV.length; i++) {
      if (SERIES_NAV[i].slug === slug) return i;
    }
    return 999;
  }

  function renderCatalogGrid(allMount, products, grouped) {
    if (!products.length) {
      allMount.innerHTML =
        '<p class="catalog-empty">' +
        catMsg(
          "Aramanızla eşleşen model bulunamadı. Filtreleri temizleyip tekrar deneyin.",
          "لم يُعثر على نماذج مطابقة. امسح الفلاتر وحاول مجدداً.",
          "No models match your search. Clear filters and try again."
        ) +
        "</p>";
      return;
    }

    if (grouped) {
      var groups = {};
      products.forEach(function (p) {
        var k = p.seriesSlug;
        if (!groups[k]) groups[k] = [];
        groups[k].push(p);
      });
      var slugs = Object.keys(groups).sort(function (a, b) {
        return seriesOrderIndex(a) - seriesOrderIndex(b);
      });
      var html = "";
      slugs.forEach(function (slug) {
        var list = groups[slug];
        var title = seriesNameFromProduct(list[0]);
        html +=
          '<h3 class="catalog-series-title" id="cat-' +
          esc(slug) +
          '">' +
          esc(title) +
          "</h3>";
        html += '<div class="product-grid catalog-product-grid">';
        html += list.map(card).join("");
        html += "</div>";
      });
      allMount.innerHTML = html;
      return;
    }

    allMount.innerHTML =
      '<div class="product-grid catalog-product-grid">' +
      products.map(card).join("") +
      "</div>";
  }

  function parseCatalogHash() {
    var raw = (window.location.hash || "").replace(/^#/, "");
    if (!raw) return {};
    var out = {};
    if (raw.indexOf("=") === -1) {
      if (FEATURE_SLUGS.indexOf(raw) !== -1) out.feature = raw;
      return out;
    }
    raw.split("&").forEach(function (part) {
      var kv = part.split("=");
      if (kv.length < 2) return;
      var key = decodeURIComponent(kv[0].trim());
      var val = decodeURIComponent(kv.slice(1).join("=").trim());
      if (key === "seri") out.series = val;
      if (key === "renk") out.color = val;
      if (key === "q") out.query = val;
      if (key === "ozellik") out.feature = val;
    });
    return out;
  }

  function writeCatalogHash(filters) {
    var next = "";
    if (filters.feature && !filters.series && !filters.color && !filters.query) {
      next = "#" + filters.feature;
    } else {
      var parts = [];
      if (filters.feature) parts.push("ozellik=" + encodeURIComponent(filters.feature));
      if (filters.series) parts.push("seri=" + encodeURIComponent(filters.series));
      if (filters.color) parts.push("renk=" + encodeURIComponent(filters.color));
      if (filters.query) parts.push("q=" + encodeURIComponent(filters.query));
      if (parts.length) next = "#" + parts.join("&");
    }
    if (window.location.hash !== next) {
      history.replaceState(null, "", window.location.pathname + window.location.search + next);
    }
  }

  function initCatalogPage(allMount, all) {
    var colors = uniqueColors(all);
    var filterBar = document.createElement("div");
    filterBar.className = "catalog-filters";
    filterBar.setAttribute("aria-label", catMsg("Ürün filtresi", "فلتر المنتجات", "Product filter"));
    filterBar.innerHTML =
      '<div class="catalog-filters__row">' +
      '<label class="catalog-filters__field catalog-filters__field--search">' +
      '<span class="catalog-filters__label">' + catMsg("Ara", "بحث", "Search") + "</span>" +
      '<input type="search" class="catalog-filters__input" id="catalog-search" placeholder="' +
      catMsg("Kod veya model adı…", "رمز أو اسم النموذج…", "Code or model name…") +
      '" autocomplete="off" />' +
      "</label>" +
      '<label class="catalog-filters__field">' +
      '<span class="catalog-filters__label">' + catMsg("Seri", "السلسلة", "Series") + "</span>" +
      '<select class="catalog-filters__select" id="catalog-series">' +
      '<option value="">' + catMsg("Tüm seriler", "جميع السلاسل", "All series") + "</option>" +
      SERIES_NAV.map(function (row) {
        return (
          '<option value="' +
          esc(row.slug) +
          '">' +
          esc(seriesDisplayName(row)) +
          "</option>"
        );
      }).join("") +
      "</select></label>" +
      '<label class="catalog-filters__field">' +
      '<span class="catalog-filters__label">' + catMsg("Renk", "اللون", "Colour") + "</span>" +
      '<select class="catalog-filters__select" id="catalog-color">' +
      '<option value="">' + catMsg("Tüm renkler", "جميع الألوان", "All colours") + "</option>" +
      colors
        .map(function (c) {
          return '<option value="' + esc(c) + '">' + esc(c) + "</option>";
        })
        .join("") +
      "</select></label>" +
      '<button type="button" class="catalog-filters__reset" id="catalog-reset" hidden>' +
      catMsg("Filtreleri temizle", "مسح الفلاتر", "Clear filters") +
      "</button>" +
      "</div>" +
      '<p class="catalog-filters__count" id="catalog-result-count" aria-live="polite"></p>';

    allMount.parentNode.insertBefore(filterBar, allMount);

    var searchEl = filterBar.querySelector("#catalog-search");
    var seriesEl = filterBar.querySelector("#catalog-series");
    var colorEl = filterBar.querySelector("#catalog-color");
    var resetEl = filterBar.querySelector("#catalog-reset");
    var countEl = filterBar.querySelector("#catalog-result-count");

    var filters = { query: "", series: "", color: "", feature: "" };
    var debounceTimer = null;

    function readFiltersFromUI() {
      filters.query = searchEl.value.trim();
      filters.series = seriesEl.value;
      filters.color = colorEl.value;
    }

    function syncUIFromFilters() {
      searchEl.value = filters.query || "";
      seriesEl.value = filters.series || "";
      colorEl.value = filters.color || "";
    }

    function updateCount(shown, total) {
      if (catalogFiltersActive(filters)) {
        countEl.textContent =
          shown +
          " / " +
          total +
          " " +
          catMsg("model gösteriliyor", "نموذج معروض", "models shown");
      } else {
        countEl.textContent =
          total + " " + catMsg("model listeleniyor", "نموذج مدرج", "models listed");
      }
      resetEl.hidden = !catalogFiltersActive(filters);
    }

    function applyFilters() {
      readFiltersFromUI();
      var items = filterCatalogProducts(all, filters);
      renderCatalogGrid(allMount, items, !catalogFiltersActive(filters));
      updateCount(items.length, all.length);
      writeCatalogHash(filters);
      if (filters.feature && allMount) {
        allMount.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    function scheduleApply() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyFilters, 200);
    }

    Object.assign(filters, parseCatalogHash());
    syncUIFromFilters();
    applyFilters();

    searchEl.addEventListener("input", scheduleApply);
    seriesEl.addEventListener("change", applyFilters);
    colorEl.addEventListener("change", applyFilters);
    resetEl.addEventListener("click", function () {
      filters = { query: "", series: "", color: "", feature: "" };
      syncUIFromFilters();
      applyFilters();
      searchEl.focus();
    });
    window.addEventListener("hashchange", function () {
      Object.assign(filters, parseCatalogHash());
      syncUIFromFilters();
      applyFilters();
    });
  }

  function syncSeriesCompareUI(mount) {
    var compare = cmp();
    if (!compare || !mount) return;
    var ids = compare.getIds();
    mount.querySelectorAll(".js-compare-cb").forEach(function (cb) {
      var id = Number(cb.getAttribute("data-product-id"));
      cb.checked = ids.indexOf(id) !== -1;
    });
  }

  function ensureSeriesLoadMoreMount(grid) {
    var el = document.getElementById("series-load-more-mount");
    if (el) return el;
    if (!grid || !grid.parentNode) return null;
    el = document.createElement("div");
    el.id = "series-load-more-mount";
    el.className = "series-load-more-mount";
    grid.parentNode.insertBefore(el, grid.nextSibling);
    return el;
  }

  function mountSeriesGrid(seriesMount, items, useSeriesLayout) {
    var shown = Math.min(SERIES_BATCH, items.length);
    var loadMoreEl = ensureSeriesLoadMoreMount(seriesMount);

    function renderSlice(count) {
      seriesMount.classList.add("product-grid");
      seriesMount.classList.toggle("product-grid--series", useSeriesLayout);
      seriesMount.innerHTML = items
        .slice(0, count)
        .map(function (p) {
          return renderProductCard(p, {
            variant: useSeriesLayout ? "series" : "catalog",
          });
        })
        .join("");

      if (useSeriesLayout) syncSeriesCompareUI(seriesMount);

      if (loadMoreEl) {
        if (count >= items.length) {
          loadMoreEl.innerHTML = "";
        } else {
          var remaining = items.length - count;
          loadMoreEl.innerHTML =
            '<p class="series-load-more-wrap">' +
            '<button type="button" class="series-load-more" aria-live="polite">' +
            catMsg("Daha fazla yükle ", "تحميل المزيد ", "Load more ") +
            '<span class="series-load-more__count">(' +
            remaining +
            catMsg(" kaldı)", " متبقٍ)", " remaining)") +
            "</span>" +
            "</button></p>";
          loadMoreEl.querySelector(".series-load-more").addEventListener("click", function () {
            shown = Math.min(shown + SERIES_BATCH, items.length);
            renderSlice(shown);
            if (cmp()) cmp().updateBadges();
          });
        }
      }
    }

    renderSlice(shown);

    if (useSeriesLayout) wireSeriesCompare();
    wireSeriesCardNavigation(items);
  }

  async function run() {
    var seriesMount = document.getElementById("series-product-grid");
    var allMount = document.getElementById("all-products-catalog");
    if (!seriesMount && !allMount) return;

    await loadProductI18n();

    var all;
    try {
      var catalog = await loadCatalogData();
      all = catalog.products;
      productLinks = catalog.links;
    } catch (e) {
      console.error("products-catalog:", e);
      var err =
        '<p class="section__lead">' +
        catMsg(
          "Ürün listesi yüklenemedi. ",
          "تعذّر تحميل قائمة المنتجات. ",
          "Product list could not be loaded. "
        ) +
        (window.location.protocol === "file:"
          ? catMsg(
              'Dosyayı çift tıklamak yerine proje klasöründe <code>python -m http.server 8080</code> çalıştırıp <a href="http://localhost:8080/">http://localhost:8080</a> adresini açın.',
              'بدلاً من فتح الملف مباشرة، شغّل <code>python -m http.server 8080</code> وافتح <a href="http://localhost:8080/">http://localhost:8080</a>.',
              'Instead of opening the file directly, run <code>python -m http.server 8080</code> in the project folder and open <a href="http://localhost:8080/">http://localhost:8080</a>.'
            )
          : catMsg(
              "Sayfayı yenileyin veya daha sonra tekrar deneyin.",
              "حدّث الصفحة أو حاول لاحقاً.",
              "Refresh the page or try again later."
            )) +
        "</p>";
      if (seriesMount) seriesMount.innerHTML = err;
      if (allMount) allMount.innerHTML = err;
      return;
    }

    if (seriesMount) {
      var slug = seriesMount.getAttribute("data-series-slug");
      var sidebarEl = document.getElementById("series-sidebar-mount");
      var useSeriesLayout =
        seriesMount.getAttribute("data-layout") === "series" || !!sidebarEl;

      if (sidebarEl) {
        sidebarEl.innerHTML = buildSeriesSidebar(slug, seriesCountsFromProducts(all));
      }

      var countEl = document.getElementById("series-product-count");
      var items = all.filter(function (x) {
        return x.seriesSlug === slug;
      });

      if (countEl) {
        countEl.innerHTML =
          '<span class="series-main__product-badge">' +
          '<span class="series-main__count-icon" aria-hidden="true"></span>' +
          "<strong>" +
          items.length +
          "</strong> " +
          catMsg("Ürün", "منتج", "Products") +
          "</span>";
      }

      if (!items.length) {
        var quoteHref = esc(localizedPath("fiyat-teklifi/index.html"));
        seriesMount.innerHTML = catMsg(
          '<p class="section__lead">Bu seri için veri tabanında henüz model kaydı yok. Özel üretim ve güncel stok için <a href="' +
            quoteHref +
            '">teklif formu</a> ile iletişime geçebilirsiniz.</p>',
          '<p class="section__lead">لا توجد نماذج مسجّلة لهذه السلسلة بعد. للإنتاج الخاص والمخزون الحالي تواصل عبر <a href="' +
            quoteHref +
            '">نموذج العرض</a>.</p>',
          '<p class="section__lead">No models are listed for this series yet. For custom production and current stock, contact us via the <a href="' +
            quoteHref +
            '">quote form</a>.</p>'
        );
      } else {
        mountSeriesGrid(seriesMount, items, useSeriesLayout);
      }
      if (cmp()) cmp().updateBadges();
      return;
    }

    if (allMount) {
      initCatalogPage(allMount, all);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  if (window.location.protocol === "file:" && !hasEmbeddedCatalog()) {
    ensureProductsDataScript().catch(function () {});
  }
})();
