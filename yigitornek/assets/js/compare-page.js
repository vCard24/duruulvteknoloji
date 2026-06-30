(function () {
  var productStringsEn = null;
  var productSpecsEn = null;
  var seriesNamesEn = null;

  function getRoot() {
    return document.body.getAttribute("data-root") || "";
  }

  function isArLang() {
    return (document.documentElement.getAttribute("lang") || "").toLowerCase() === "ar";
  }

  function isEnLang() {
    return (document.documentElement.getAttribute("lang") || "").toLowerCase() === "en";
  }

  function msg(tr, ar, en) {
    if (isArLang()) return ar;
    if (isEnLang()) return en != null ? en : tr;
    return tr;
  }

  function mapLookup(map, text) {
    if (!map || text == null || text === "") return text;
    return map[String(text)] || text;
  }

  function loadProductI18n() {
    if (window.location.protocol === "file:") return Promise.resolve();
    if (!isEnLang() || (productStringsEn && productSpecsEn)) {
      return Promise.resolve();
    }
    var base = getRoot() + "assets/data/i18n/";
    return Promise.all([
      fetch(base + "product-strings-en.json").then(function (r) {
        return r.ok ? r.json() : {};
      }),
      fetch(base + "product-specs-en.json").then(function (r) {
        return r.ok ? r.json() : {};
      }),
      fetch(base + "series-names-en.json").then(function (r) {
        return r.ok ? r.json() : {};
      }),
    ])
      .then(function (results) {
        productStringsEn = results[0];
        productSpecsEn = results[1];
        seriesNamesEn = results[2];
      })
      .catch(function () {
        productStringsEn = productStringsEn || {};
        productSpecsEn = productSpecsEn || {};
        seriesNamesEn = seriesNamesEn || {};
      });
  }

  function localizedName(product) {
    var name = product.name || "";
    if (isEnLang() && productStringsEn && productStringsEn.names) {
      return mapLookup(productStringsEn.names, name) || name;
    }
    return name;
  }

  function localizedSeries(product) {
    if (isEnLang() && seriesNamesEn && product.seriesSlug && seriesNamesEn[product.seriesSlug]) {
      return seriesNamesEn[product.seriesSlug].title || product.seriesName;
    }
    return product.seriesName || "";
  }

  function localizedSpec(value) {
    if (!value) return value;
    if (isEnLang() && productSpecsEn) {
      return mapLookup(productSpecsEn, value) || value;
    }
    return value;
  }

  function assetAbsUrl(rel) {
    var path = String(rel || "")
      .replace(/^(\.\.\/)+/, "")
      .replace(/^\/+/, "");
    if (!path) return "";
    var origin = window.location.origin.replace(/\/$/, "");
    if (window.location.protocol === "file:") {
      origin = "https://www.yigitcelikkapi.com.tr";
    }
    return origin + "/" + path;
  }

  function productImageUrl(product) {
    if (!product || !product.image) return "";
    return assetAbsUrl(getRoot() + product.image);
  }

  function quoteFormHref() {
    var root = getRoot();
    if (isArLang()) {
      return root + "ar/طلب-عرض-سعر/index.html?kaynak=karsilastir";
    }
    if (isEnLang()) {
      return root + "en/fiyat-teklifi/index.html?kaynak=karsilastir";
    }
    return root + "fiyat-teklifi/index.html?kaynak=karsilastir";
  }

  function mapTrPathToAr(base) {
    if (!base) return base;
    var out = String(base);
    out = out
      .replace(/^urunler\//, "المنتجات/")
      .replace(/^urun-karsilastirma\//, "مقارنة-المنتجات/")
      .replace(/^fiyat-teklifi\//, "طلب-عرض-سعر/");
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

  function productHref(links, productId) {
    var root = getRoot();
    var url = links[String(productId)] || "urunler/index.html";
    if (isArLang()) {
      return root + "ar/" + mapTrPathToAr(url);
    }
    if (isEnLang()) {
      var path = (window.location.pathname || "").replace(/\\/g, "/");
      if (/\/en(\/|$)/.test(path)) {
        return "../" + url;
      }
      return root + "en/" + url;
    }
    return root + url;
  }

  function getCompareIds() {
    if (window.yigitCompare) return window.yigitCompare.getIds();
    try {
      return JSON.parse(localStorage.getItem("yck_compare") || "[]");
    } catch (_e) {
      return [];
    }
  }

  function saveCompareIds(ids) {
    if (window.yigitCompare) {
      window.yigitCompare.setIds(ids);
      return;
    }
    localStorage.setItem("yck_compare", JSON.stringify(ids));
    if (typeof window.updateHeaderCompareCount === "function") {
      window.updateHeaderCompareCount();
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderEmpty(options) {
    const opts = options || {};
    const empty = document.getElementById("compare-empty");
    const grid = document.getElementById("compare-grid");
    const actions = document.getElementById("compare-actions");
    const suggestions = document.getElementById("compare-suggestions");
    if (empty) {
      empty.hidden = false;
      const lead = empty.querySelector("p:not(.compare-empty__icon)");
      if (lead && opts.message) {
        lead.textContent = opts.message;
      } else if (lead && !opts.message) {
        lead.textContent = msg(
          "Karşılaştırmak istediğiniz ürünleri seçmek için ürün sayfalarına gidin ve “Karşılaştır” butonuna tıklayın.",
          "للمقارنة، انتقلوا إلى صفحات المنتجات واضغطوا على زر «قارن».",
          "To compare products, visit product pages and click the “Compare” button."
        );
      }
    }
    if (grid) {
      grid.hidden = true;
      grid.innerHTML = "";
    }
    if (actions) actions.hidden = true;
    if (suggestions) {
      suggestions.hidden = !!opts.message;
    }
    if (!opts.message && opts.products && opts.links) {
      renderSuggestions(opts.products, opts.links);
    }
  }

  function pickFeaturedProducts(products) {
    var seen = {};
    var picks = [];
    products.forEach(function (p) {
      if (!p || !p.image || p.image.indexOf("400x400") !== -1) return;
      var slug = p.seriesSlug || "";
      if (seen[slug]) return;
      seen[slug] = true;
      picks.push(p);
    });
    if (picks.length < 4) {
      products.forEach(function (p) {
        if (picks.length >= 4) return;
        if (!p || picks.some(function (x) { return x.id === p.id; })) return;
        if (p.image && p.image.indexOf("400x400") === -1) picks.push(p);
      });
    }
    return picks.slice(0, 4);
  }

  function renderSuggestions(products, links) {
    var mount = document.getElementById("compare-suggestions-grid");
    var wrap = document.getElementById("compare-suggestions");
    if (!mount || !wrap) return;

    var root = getRoot();
    var picks = pickFeaturedProducts(products);
    if (!picks.length) {
      wrap.hidden = true;
      return;
    }

    wrap.hidden = false;
    mount.innerHTML = picks
      .map(function (product) {
        var url = productHref(links, product.id);
        var img = productImageUrl(product);
        return (
          '<article class="compare-suggestion-card">' +
          '<a class="compare-suggestion-card__image" href="' + escapeHtml(url) + '">' +
          (img ? '<img src="' + escapeHtml(img) + '" alt="" loading="lazy" width="600" height="800" decoding="async" />' : "") +
          "</a>" +
          '<div class="compare-suggestion-card__body">' +
          '<p class="compare-suggestion-card__code">' + escapeHtml(product.code || "") + "</p>" +
          '<h4 class="compare-suggestion-card__title"><a href="' + escapeHtml(url) + '">' + escapeHtml(localizedName(product)) + "</a></h4>" +
          '<button type="button" class="compare-suggestion-card__add" data-add-id="' + product.id + '">' +
          msg("Karşılaştırmaya ekle", "أضف للمقارنة", "Add to comparison") +
          "</button>" +
          "</div></article>"
        );
      })
      .join("");
  }

  function loadCatalogData(root) {
    if (window.YCK_PRODUCTS && window.YCK_PRODUCT_LINKS) {
      return Promise.resolve([window.YCK_PRODUCTS, window.YCK_PRODUCT_LINKS]);
    }
    return Promise.all([
      fetch(root + "assets/data/products.json").then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      }),
      fetch(root + "assets/data/product-links.json").then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      }),
    ]);
  }

  function renderProducts(products, links, ids) {
    const root = getRoot();
    const empty = document.getElementById("compare-empty");
    const grid = document.getElementById("compare-grid");
    const actions = document.getElementById("compare-actions");
    const byId = new Map(products.map(function (p) { return [p.id, p]; }));

    const items = ids
      .map(function (id) { return byId.get(Number(id)); })
      .filter(Boolean);

    if (!items.length) {
      renderEmpty(
        ids.length
          ? {
              message: msg(
                "Seçili ürünler yüklenemedi. Sayfayı yenileyin veya ürünleri tekrar seçin.",
                "تعذّر تحميل المنتجات المحددة. حدّثوا الصفحة أو اختاروا المنتجات مجدداً.",
                "Selected products could not be loaded. Refresh the page or select products again."
              ),
            }
          : { products: products, links: links }
      );
      return;
    }

    if (empty) empty.hidden = true;
    if (actions) actions.hidden = false;
    if (!grid) return;

    grid.hidden = false;
    grid.innerHTML = items
      .map(function (product) {
        const url = productHref(links, product.id);
        const img = productImageUrl(product);
        return (
          '<article class="compare-card">' +
          '<button type="button" class="compare-card__remove" data-remove-id="' + product.id + '" aria-label="' +
          msg("Kaldır", "إزالة", "Remove") +
          '">×</button>' +
          '<a class="compare-card__image" href="' + escapeHtml(url) + '">' +
          (img ? '<img src="' + escapeHtml(img) + '" alt="" loading="lazy" decoding="async" />' : "") +
          "</a>" +
          '<div class="compare-card__body">' +
          '<p class="compare-card__code">' + escapeHtml(product.code || "") + "</p>" +
          '<h2 class="compare-card__title"><a href="' + escapeHtml(url) + '">' + escapeHtml(localizedName(product)) + "</a></h2>" +
          '<dl class="compare-card__specs">' +
          specRow(msg("Seri", "السلسلة", "Series"), localizedSeries(product)) +
          specRow(msg("Renk", "اللون", "Colour"), localizedSpec(product.color)) +
          specRow(msg("Tasarım", "التصميم", "Design"), localizedSpec(product.design)) +
          specRow(msg("Malzeme", "المادة", "Material"), localizedSpec(product.material)) +
          "</dl>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function specRow(label, value) {
    if (!value || value === "-") return "";
    return (
      "<div><dt>" + escapeHtml(label) + "</dt><dd>" + escapeHtml(value) + "</dd></div>"
    );
  }

  function bindEvents(products, links) {
    document.addEventListener("click", function (e) {
      const addBtn = e.target.closest("[data-add-id]");
      if (addBtn) {
        const id = Number(addBtn.getAttribute("data-add-id"));
        const compare = window.yigitCompare;
        if (compare) {
          const result = compare.toggle(id);
          if (result.action === "added" || result.action === "removed") {
            renderProducts(products, links, getCompareIds());
          }
        } else {
          var ids = getCompareIds();
          if (ids.indexOf(id) === -1) ids.push(id);
          saveCompareIds(ids.slice(0, 8));
          renderProducts(products, links, getCompareIds());
        }
        return;
      }

      const removeBtn = e.target.closest("[data-remove-id]");
      if (removeBtn) {
        const id = Number(removeBtn.getAttribute("data-remove-id"));
        const ids = getCompareIds().filter(function (x) { return x !== id; });
        saveCompareIds(ids);
        if (window.yigitCompare) {
          window.yigitCompare.showToast(
            msg("Ürün karşılaştırma listesinden kaldırıldı.", "تمت إزالة المنتج من قائمة المقارنة.", "Product removed from comparison list."),
            "info"
          );
        }
        renderProducts(products, links, ids);
        return;
      }

      if (e.target.closest("#compare-clear")) {
        if (
          confirm(
            msg(
              "Karşılaştırma listesindeki tüm ürünler kaldırılsın mı?",
              "هل تريدون إزالة جميع المنتجات من قائمة المقارنة؟",
              "Remove all products from the comparison list?"
            )
          )
        ) {
          saveCompareIds([]);
          if (window.yigitCompare) {
            window.yigitCompare.showToast(
              msg("Karşılaştırma listesi temizlendi.", "تم مسح قائمة المقارنة.", "Comparison list cleared."),
              "info"
            );
          }
          renderEmpty({ products: products, links: links });
        }
      }
    });
  }

  function init() {
    const root = getRoot();
    const ids = getCompareIds();
    var quoteBtn = document.getElementById("compare-quote-btn");
    if (quoteBtn) quoteBtn.setAttribute("href", quoteFormHref());
    loadProductI18n()
      .then(function () {
        return loadCatalogData(root);
      })
      .then(function (results) {
        const products = results[0];
        const links = results[1];
        renderProducts(products, links, ids);
        bindEvents(products, links);
        if (!ids.length) {
          renderSuggestions(products, links);
        }
      })
      .catch(function () {
        renderEmpty(
          ids.length
            ? {
                message: msg(
                  "Ürün verisi yüklenemedi. Sayfayı bir web sunucusu üzerinden açmayı deneyin (ör. python -m http.server).",
                  "تعذّر تحميل بيانات المنتجات. جرّبوا فتح الصفحة عبر خادم ويب (مثل python -m http.server).",
                  "Product data could not be loaded. Try opening the page via a web server (e.g. python -m http.server)."
                ),
              }
            : undefined
        );
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
