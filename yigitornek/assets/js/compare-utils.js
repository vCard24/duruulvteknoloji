/**
 * Karşılaştırma listesi + toast bildirimleri (site geneli tek modül)
 */
(function () {
  var COMPARE_KEY = "yck_compare";
  var LEGACY_COMPARE_KEY = "yigitCompareProducts";
  var MAX_ITEMS = 8;
  var toastTimer = null;

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

  function parseCompareIds(raw) {
    try {
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr)
        ? arr
            .map(Number)
            .filter(function (n) {
              return !isNaN(n);
            })
            .map(function (n) {
              if (n === 677) return 49;
              return n;
            })
        : [];
    } catch (e) {
      return [];
    }
  }

  function migrateCompareStorage() {
    var current = parseCompareIds(localStorage.getItem(COMPARE_KEY));
    var legacy = parseCompareIds(localStorage.getItem(LEGACY_COMPARE_KEY));
    if (!legacy.length) return;
    legacy.forEach(function (id) {
      if (current.indexOf(id) === -1) current.push(id);
    });
    localStorage.setItem(COMPARE_KEY, JSON.stringify(current.slice(0, MAX_ITEMS)));
    localStorage.removeItem(LEGACY_COMPARE_KEY);
  }

  migrateCompareStorage();

  function getIds() {
    return parseCompareIds(localStorage.getItem(COMPARE_KEY));
  }

  function setIds(ids, options) {
    var opts = options || {};
    var prevCount = getIds().length;
    var uniq = [];
    ids.forEach(function (id) {
      if (uniq.indexOf(id) === -1) uniq.push(id);
    });
    uniq = uniq.slice(0, MAX_ITEMS);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(uniq));
    updateBadges({ pulse: !opts.silent && uniq.length > prevCount });
    if (!opts.silent) {
      window.dispatchEvent(
        new CustomEvent("yck-compare-change", { detail: { ids: getIds() } })
      );
    }
  }

  function setBadgeEl(el, n) {
    if (!el) return;
    el.textContent = String(n);
    if (n > 0) {
      el.hidden = false;
      el.removeAttribute("aria-hidden");
      el.classList.add("yck-compare-badge--visible");
    } else {
      el.hidden = true;
      el.setAttribute("aria-hidden", "true");
      el.classList.remove("yck-compare-badge--visible");
    }
  }

  function pageRoot() {
    return (document.body && document.body.getAttribute("data-root")) || "";
  }

  function currentLang() {
    var lang = (document.documentElement.getAttribute("lang") || "tr").toLowerCase();
    if (lang === "en" || lang === "de" || lang === "ar") return lang;
    return "tr";
  }

  function getComparePageHref() {
    var root = pageRoot();
    var lang = currentLang();
    if (lang === "ar") return root + "ar/مقارنة-المنتجات/index.html";
    if (lang === "en" || lang === "de") return root + lang + "/urun-karsilastirma/index.html";
    return root + "urun-karsilastirma/index.html";
  }

  function shouldFixCompareHref(href) {
    if (!href || /^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) return false;
    return /urun-karsilastirma/i.test(href);
  }

  function repairCompareHrefs() {
    var compareHref = getComparePageHref();
    document.querySelectorAll("a[href]").forEach(function (link) {
      if (link.closest(".lang-switcher")) return;
      var href = link.getAttribute("href") || "";
      if (!shouldFixCompareHref(href)) return;
      link.setAttribute("href", compareHref);
    });
  }

  function compareLinkLabel(n) {
    if (n <= 0) return msg("Karşılaştır", "قارن", "Compare");
    if (n === 1) return msg("Karşılaştır, 1 ürün seçili", "قارن، منتج واحد محدد", "Compare, 1 product selected");
    return msg("Karşılaştır, " + n + " ürün seçili", "قارن، " + n + " منتجات محددة", "Compare, " + n + " products selected");
  }

  function updateCompareLinks(n) {
    var compareHref = getComparePageHref();
    document.querySelectorAll("[data-yck-compare-link]").forEach(function (link) {
      link.setAttribute("href", compareHref);
      link.setAttribute("aria-label", compareLinkLabel(n));
      link.classList.toggle("yck-compare-link--active", n > 0);
    });
    repairCompareHrefs();
  }

  function updateBadges(options) {
    var opts = options || {};
    var n = getIds().length;
    var badges = document.querySelectorAll(
      ".yck-compare-badge, .js-compare-badge, .series-main__compare-badge"
    );
    badges.forEach(function (el) {
      setBadgeEl(el, n);
    });
    updateCompareLinks(n);
    if (opts.pulse && n > 0) {
      document.querySelectorAll(".yck-compare-badge--nav.yck-compare-badge--visible").forEach(function (el) {
        el.classList.remove("yck-compare-badge--pulse");
        void el.offsetWidth;
        el.classList.add("yck-compare-badge--pulse");
      });
    }
  }

  function ensureToastRoot() {
    var root = document.getElementById("yck-toast-root");
    if (root) return root;
    root = document.createElement("div");
    root.id = "yck-toast-root";
    root.className = "yck-toast-root";
    root.setAttribute("aria-live", "polite");
    root.setAttribute("aria-atomic", "true");
    document.body.appendChild(root);
    return root;
  }

  function showToast(message, type) {
    if (!message) return;
    var root = ensureToastRoot();
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    root.innerHTML =
      '<div class="yck-toast yck-toast--' +
      (type || "info") +
      '" role="status">' +
      message +
      "</div>";
    toastTimer = setTimeout(function () {
      root.innerHTML = "";
      toastTimer = null;
    }, 2800);
  }

  /**
   * @returns {{ action: 'added'|'removed'|'limited'|'unchanged', ids: number[] }}
   */
  function toggle(productId, options) {
    var opts = options || {};
    var id = Number(productId);
    if (isNaN(id)) return { action: "unchanged", ids: getIds() };

    var ids = getIds();
    var index = ids.indexOf(id);

    if (index > -1) {
      ids.splice(index, 1);
      setIds(ids, { silent: opts.silent });
      if (!opts.silent) showToast(msg("Karşılaştırma listesinden kaldırıldı.", "تمت الإزالة من قائمة المقارنة.", "Removed from comparison list."), "info");
      return { action: "removed", ids: getIds() };
    }

    if (ids.length >= MAX_ITEMS) {
      if (!opts.silent) {
        showToast(msg("En fazla 8 ürün karşılaştırabilirsiniz.", "يمكنكم مقارنة 8 منتجات كحد أقصى.", "You can compare up to 8 products."), "warning");
      }
      return { action: "limited", ids: ids };
    }

    ids.push(id);
    setIds(ids, { silent: opts.silent });
    if (!opts.silent) showToast(msg("Karşılaştırmaya eklendi.", "تمت الإضافة للمقارنة.", "Added to comparison."), "success");
    return { action: "added", ids: getIds() };
  }

  window.yigitCompare = {
    KEY: COMPARE_KEY,
    MAX: MAX_ITEMS,
    getIds: getIds,
    setIds: setIds,
    toggle: toggle,
    updateBadges: updateBadges,
    showToast: showToast,
    migrate: migrateCompareStorage,
    getComparePageHref: getComparePageHref,
    repairCompareHrefs: repairCompareHrefs,
  };

  window.updateHeaderCompareCount = updateBadges;

  function initCompareLinks() {
    repairCompareHrefs();
    updateBadges();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCompareLinks);
  } else {
    initCompareLinks();
  }

  document.addEventListener("yck-layout-ready", initCompareLinks);
})();
