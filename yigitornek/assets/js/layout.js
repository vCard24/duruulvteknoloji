(function () {
  var _chrome = (typeof window !== "undefined" && window.YCK_LAYOUT_CHROME) || {};
  var PARTIAL_HEADER = _chrome.PARTIAL_HEADER || "";
  var PARTIAL_FOOTER = _chrome.PARTIAL_FOOTER || "";
  var PARTIAL_CORPORATE_SUBNAV = _chrome.PARTIAL_CORPORATE_SUBNAV || "";
  var PARTIAL_CORPORATE_CTA = _chrome.PARTIAL_CORPORATE_CTA || "";

  function applyRoot(html) {
    var root = document.body.getAttribute("data-root") || "";
    return html.split("{{ROOT}}").join(root);
  }



  var CORPORATE_HUB_PAGES = [
    { id: "hakkimizda", title: "Hakkımızda", desc: "Tarihçemiz, üretim gücümüz ve küresel erişimimiz", href: "hakkimizda/index.html" },
    { id: "degerlerimiz", title: "Değerlerimiz", desc: "Temel ilkelerimiz ve kurumsal değerlerimiz", href: "degerlerimiz/index.html" },
    { id: "misyon-vizyon", title: "Misyon & Vizyon", desc: "Hedeflerimiz ve geleceğe bakışımız", href: "misyon-vizyon/index.html" },
    { id: "belgelerimiz", title: "Belgelerimiz", desc: "TSE, ISO ve kalite sertifikalarımız", href: "belgelerimiz/index.html" },
    { id: "kalite-politikamiz", title: "Kalite Politikamız", desc: "Sürekli gelişim ve mükemmellik anlayışımız", href: "kalite-politikamiz/index.html" },
  ];

  function buildCorporateHubHtml(pageId) {
    var idx = -1;
    for (var i = 0; i < CORPORATE_HUB_PAGES.length; i++) {
      if (CORPORATE_HUB_PAGES[i].id === pageId) {
        idx = i;
        break;
      }
    }

    var prev = idx > 0 ? CORPORATE_HUB_PAGES[idx - 1] : null;
    var next = idx >= 0 && idx < CORPORATE_HUB_PAGES.length - 1 ? CORPORATE_HUB_PAGES[idx + 1] : null;

    var html =
      "<section class=\"corporate-hub\" aria-labelledby=\"corporate-hub-heading\">\n" +
      "  <div class=\"container\">\n" +
      "    <div class=\"corporate-hub__head\">\n" +
      "      <p class=\"corporate-hub__eyebrow\">\n" +
      "        <span class=\"corporate-hub__eyebrow-line\" aria-hidden=\"true\"></span>\n" +
      "        KURUMSAL\n" +
      "      </p>\n" +
      "      <h2 class=\"corporate-hub__title\" id=\"corporate-hub-heading\">Diğer kurumsal sayfalar</h2>\n" +
      "    </div>\n";

    if (prev || next) {
      html += "    <div class=\"corporate-hub__adjacent\">\n";
      if (prev) {
        html +=
          "      <a href=\"{{ROOT}}" + prev.href + "\" class=\"corporate-hub__adjacent-link corporate-hub__adjacent-link--prev\">\n" +
          "        <span class=\"corporate-hub__adjacent-label\">← Önceki</span>\n" +
          "        <span class=\"corporate-hub__adjacent-title\">" + prev.title + "</span>\n" +
          "      </a>\n";
      } else {
        html += "      <span class=\"corporate-hub__adjacent-spacer\" aria-hidden=\"true\"></span>\n";
      }
      if (next) {
        html +=
          "      <a href=\"{{ROOT}}" + next.href + "\" class=\"corporate-hub__adjacent-link corporate-hub__adjacent-link--next\">\n" +
          "        <span class=\"corporate-hub__adjacent-label\">Sonraki →</span>\n" +
          "        <span class=\"corporate-hub__adjacent-title\">" + next.title + "</span>\n" +
          "      </a>\n";
      } else {
        html += "      <span class=\"corporate-hub__adjacent-spacer\" aria-hidden=\"true\"></span>\n";
      }
      html += "    </div>\n";
    }

    html += "    <div class=\"corporate-hub__grid\">\n";
    CORPORATE_HUB_PAGES.forEach(function (page) {
      var isCurrent = page.id === pageId;
      html +=
        "      <a href=\"{{ROOT}}" + page.href + "\" class=\"corporate-hub-card" +
        (isCurrent ? " corporate-hub-card--current" : "") + "\"" +
        (isCurrent ? " aria-current=\"page\"" : "") + ">\n" +
        "        <span class=\"corporate-hub-card__title\">" + page.title + "</span>\n" +
        "        <span class=\"corporate-hub-card__desc\">" + page.desc + "</span>\n" +
        "      </a>\n";
    });
    html += "    </div>\n  </div>\n</section>\n";

    return html;
  }


  /** Tüm sayfalarda favicon (tek noktadan, data-root ile uyumlu) */
  function ensureFavicon() {
    if (document.querySelector("link[data-yigit-icon]")) return;
    var root = document.body.getAttribute("data-root") || "";
    var link = document.createElement('link');
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = root + "assets/img/yigit_logo.svg";
    link.setAttribute("data-yigit-icon", "1");
    document.head.appendChild(link);
  }

  var megaCountsLoaded = false;

  function syncMegaMenuSeriesCounts() {
    if (megaCountsLoaded) return;
    megaCountsLoaded = true;
    var root = document.body.getAttribute("data-root") || "";
    fetch(root + "assets/data/products.json")
      .then(function (res) {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then(function (products) {
        var counts = {};
        products.forEach(function (p) {
          if (p.seriesSlug) {
            counts[p.seriesSlug] = (counts[p.seriesSlug] || 0) + 1;
          }
        });
        document.querySelectorAll(".mega-series-link").forEach(function (link) {
          var href = link.getAttribute("href") || "";
          var match = href.match(/seri\/([^/]+)\//);
          if (!match) return;
          var badge = link.querySelector(".count");
          if (badge) {
            var n = counts[match[1]] || 0;
            var pageLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
            var unit =
              pageLang === "ar" ? " منتج" : pageLang === "en" ? " products" : " Ürün";
            badge.textContent = n + unit;
          }
        });
      })
      .catch(function () {});
  }

  function wireMegaMenuSeriesCounts() {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    var wrap = document.querySelector('[data-mega="products"]');
    if (!wrap) return;
    function trigger() {
      syncMegaMenuSeriesCounts();
      wrap.removeEventListener("mouseenter", trigger);
      wrap.removeEventListener("focusin", trigger);
    }
    wrap.addEventListener("mouseenter", trigger);
    wrap.addEventListener("focusin", trigger);
  }

  function loadBlogSchemaIfNeeded() {
    var body = document.body;
    if (!body) return;

    var path = (window.location.pathname || "").replace(/\\/g, "/");
    var isBlogArticle =
      body.classList.contains("blog-article") ||
      (body.classList.contains("article-page") && /\/blog\/[^/]+/i.test(path));

    if (!isBlogArticle) return;
    if (document.querySelector("script[data-yck-blog-schema]")) return;

    var root = body.getAttribute("data-root") || "";
    var script = document.createElement("script");
    script.src = root + "assets/js/blog-schema.js";
    script.setAttribute("data-yck-blog-schema", "1");
    document.head.appendChild(script);
  }

  function loadSiteSchemaIfNeeded() {
    var body = document.body;
    if (!body) return;
    if (!body.classList.contains("page-home") && !body.classList.contains("page-contact")) return;
    if (document.querySelector("script[data-yck-site-schema]")) return;

    var root = body.getAttribute("data-root") || "";
    var script = document.createElement("script");
    script.src = root + "assets/js/site-schema.js?v=20260625";
    script.setAttribute("data-yck-site-schema", "1");
    document.head.appendChild(script);
  }

  function loadFormValidate() {
    if (document.querySelector("script[data-yck-form-validate]")) return;
    var root = (document.body && document.body.getAttribute("data-root")) || "";
    var script = document.createElement("script");
    script.src = root + "assets/js/form-validate.js?v=20260625";
    script.defer = true;
    script.setAttribute("data-yck-form-validate", "1");
    document.head.appendChild(script);
  }

  function loadContactForm() {
    if (document.querySelector("script[data-yck-contact-form]")) return;
    var root = (document.body && document.body.getAttribute("data-root")) || "";
    var script = document.createElement("script");
    script.src = root + "assets/js/contact-form.js?v=20260702";
    script.defer = true;
    script.setAttribute("data-yck-contact-form", "1");
    document.head.appendChild(script);
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    var host = location.hostname;
    var isLocal = host === "localhost" || host === "127.0.0.1";
    var isProduction = /(^|\.)yigitcelikkapi\.com\.tr$/i.test(host);
    if (!isLocal && !isProduction) return;
    if (location.protocol !== "https:" && !isLocal) return;

    var root = document.body.getAttribute("data-root") || "";
    navigator.serviceWorker.register(root + "sw.js").catch(function () {});
  }

  function injectCorporateChrome() {
    var body = document.body;
    if (!body || !body.classList.contains("page-corporate")) return;

    var pageId = body.getAttribute("data-corporate-page") || "";

    var subRoot = document.getElementById("corporate-subnav-root");
    if (subRoot) {
      subRoot.innerHTML = applyRoot(PARTIAL_CORPORATE_SUBNAV);
      if (pageId) {
        var active = subRoot.querySelector('[data-corp="' + pageId + '"]');
        if (active) {
          active.setAttribute("aria-current", "page");
          requestAnimationFrame(function () {
            active.scrollIntoView({ inline: "center", block: "nearest" });
          });
        }
      }
    }

    var hubRoot = document.getElementById("corporate-crosslinks-root");
    if (hubRoot) {
      hubRoot.innerHTML = applyRoot(buildCorporateHubHtml(pageId));
    }

    var ctaRoot = document.getElementById("corporate-cta-root");
    if (ctaRoot) {
      ctaRoot.innerHTML = applyRoot(PARTIAL_CORPORATE_CTA);
    }
  }

  function injectWhatsAppFloat() {
    if (document.getElementById("whatsapp-float")) return;
    var link = document.createElement("a");
    link.id = "whatsapp-float";
    link.className = "whatsapp-float";
    link.href =
      "https://wa.me/905076999469?text=" +
      encodeURIComponent("Merhaba, ürünleriniz hakkında bilgi almak istiyorum.");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "WhatsApp ile yazın");
    link.style.cssText =
      "position:fixed;right:1.25rem;bottom:1.25rem;z-index:999;display:inline-flex;align-items:center;justify-content:center;width:3.25rem;height:3.25rem;border-radius:9999px;color:#fff;background:#25d366;box-shadow:0 8px 28px rgba(37,211,102,.45);text-decoration:none;";
    link.innerHTML =
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
    document.body.appendChild(link);
  }

  function loadI18nEn(onReady) {
    if ((document.documentElement.getAttribute("lang") || "").toLowerCase() !== "en") {
      if (onReady) onReady();
      return;
    }
    if (window.yckEnSite) {
      if (onReady) onReady();
      return;
    }
    if (document.querySelector("script[data-yck-i18n-en]")) {
      var triesEn = 0;
      var timerEn = setInterval(function () {
        if (window.yckEnSite || ++triesEn > 100) {
          clearInterval(timerEn);
          if (onReady) onReady();
        }
      }, 30);
      return;
    }
    var rootEn = (document.body && document.body.getAttribute("data-root")) || "";
    var scriptEn = document.createElement("script");
    scriptEn.src = rootEn + "assets/js/i18n-en.js?v=20260701";
    scriptEn.setAttribute("data-yck-i18n-en", "1");
    scriptEn.onload = function () {
      if (onReady) onReady();
    };
    scriptEn.onerror = function () {
      if (onReady) onReady();
    };
    document.head.appendChild(scriptEn);
  }

  function loadI18nAr(onReady) {
    if ((document.documentElement.getAttribute("lang") || "").toLowerCase() !== "ar") {
      if (onReady) onReady();
      return;
    }
    if (window.yckArSite) {
      if (onReady) onReady();
      return;
    }
    if (document.querySelector("script[data-yck-i18n-ar]")) {
      var tries = 0;
      var timer = setInterval(function () {
        if (window.yckArSite || ++tries > 100) {
          clearInterval(timer);
          if (onReady) onReady();
        }
      }, 30);
      return;
    }
    var root = (document.body && document.body.getAttribute("data-root")) || "";
    var script = document.createElement("script");
    script.src = root + "assets/js/i18n-ar.js?v=20260625";
    script.setAttribute("data-yck-i18n-ar", "1");
    script.onload = function () {
      if (onReady) onReady();
    };
    script.onerror = function () {
      if (onReady) onReady();
    };
    document.head.appendChild(script);
  }

  function loadCompareUtils(onReady) {
    if (window.yigitCompare) {
      if (onReady) onReady();
      return;
    }
    if (document.querySelector("script[data-yck-compare-utils]")) {
      var tries = 0;
      var timer = setInterval(function () {
        if (window.yigitCompare || ++tries > 80) {
          clearInterval(timer);
          if (onReady) onReady();
        }
      }, 30);
      return;
    }
    var rootCu = (document.body && document.body.getAttribute("data-root")) || "";
    var scriptCu = document.createElement("script");
    scriptCu.src = rootCu + "assets/js/compare-utils.js?v=20260706";
    scriptCu.defer = true;
    scriptCu.setAttribute("data-yck-compare-utils", "1");
    scriptCu.onload = function () {
      if (onReady) onReady();
    };
    scriptCu.onerror = function () {
      if (onReady) onReady();
    };
    document.head.appendChild(scriptCu);
  }

  function fixRtlHorizontalScroll() {
    var root = document.documentElement;
    if (root.getAttribute("dir") !== "rtl") return;

    function reset() {
      var y = window.scrollY || root.scrollTop || 0;
      window.scrollTo(0, y);
      root.scrollLeft = 0;
      document.body.scrollLeft = 0;
    }

    reset();
    requestAnimationFrame(reset);
    window.setTimeout(reset, 0);
    window.setTimeout(reset, 120);
    window.addEventListener("pageshow", reset, { once: true });
  }

  function inject() {
    ensureFavicon();
    loadBlogSchemaIfNeeded();
    loadSiteSchemaIfNeeded();
    loadFormValidate();
    loadContactForm();
    registerServiceWorker();
    injectWhatsAppFloat();

    var hr = document.getElementById("header-root");
    var fr = document.getElementById("footer-root");
    if (!hr || !fr) return;

    loadI18nRoutes().then(function (pages) {
      hr.innerHTML = applyRoot(PARTIAL_HEADER);
      fr.innerHTML = applyRoot(PARTIAL_FOOTER);
      fixRtlHorizontalScroll();

      injectCorporateChrome();
      wireMegaMenuSeriesCounts();
      localizeHeaderForLanguage(pages);
      wireLanguageSwitcher(pages);

      document.addEventListener("yck-layout-ready", function () {
        wireLanguageSwitcher(pages);
      });

      loadCompareUtils(function () {
        if (window.yigitCompare && typeof window.yigitCompare.repairCompareHrefs === "function") {
          window.yigitCompare.repairCompareHrefs();
        }
        if (window.yigitCompare && typeof window.yigitCompare.updateBadges === "function") {
          window.yigitCompare.updateBadges();
        } else if (typeof window.updateHeaderCompareCount === "function") {
          window.updateHeaderCompareCount();
        }
      });

      if (window.yigitSite && typeof window.yigitSite.init === "function") {
        window.yigitSite.init();
      }

      loadI18nEn(function () {
        if (window.yckEnSite && typeof window.yckEnSite.applyChrome === "function") {
          window.yckEnSite.applyChrome();
        }
        loadI18nAr(function () {
          if (window.yckArSite && typeof window.yckArSite.applyChrome === "function") {
            window.yckArSite.applyChrome();
          }
          fixRtlHorizontalScroll();
          document.dispatchEvent(new CustomEvent("yck-layout-ready"));
        });
      });
    });
  }

  function normalizeRestPath(rest) {
    return (rest || '').replace(/^\/+/, '');
  }

  function currentLang() {
    var lang = (document.documentElement.getAttribute('lang') || 'tr').toLowerCase();
    if (lang !== 'en' && lang !== 'ar') return 'tr';
    return lang;
  }

  function localizeRest(rest, lang, pages) {
    var p = normalizeRestPath(rest);
    var hasHash = p.indexOf('#') >= 0;
    var base = hasHash ? p.split('#')[0] : p;
    var hash = hasHash ? '#' + p.split('#').slice(1).join('#') : '';
    if (lang === 'tr') return p;
    if (/^(en|de|ar)\//.test(base)) return p;
    if (base === 'index.html' || base === '' || base === 'index') return lang + '/index.html' + hash;
    if (lang === 'ar') {
      if (pages && pages[base]) return 'ar/' + pages[base] + hash;
      if (/^urun-karsilastirma\//.test(base)) {
        return 'ar/' + base.replace(/^urun-karsilastirma\//, 'مقارنة-المنتجات/') + hash;
      }
      if (/^urunler\//.test(base)) {
        return 'ar/' + base.replace(/^urunler\//, 'المنتجات/') + hash;
      }
      return p;
    }
    if (lang === "en" || lang === "de") {
      if (base === "index.html" || base === "" || base === "index") return lang + "/index.html" + hash;
      return lang + "/" + base + hash;
    }
    return p;
  }

  function localizeHeaderForLanguage(pages) {
    var lang = currentLang();
    if (lang === "tr") return;
    var root = document.body.getAttribute("data-root") || "";
    var containers = [
      document.getElementById("header-root"),
      document.getElementById("footer-root"),
      document.getElementById("corporate-subnav-root"),
      document.getElementById("corporate-crosslinks-root"),
      document.getElementById("corporate-cta-root"),
    ];
    containers.forEach(function (container) {
      if (!container) return;
      container.querySelectorAll("a[href]").forEach(function (a) {
        if (a.hasAttribute("lang")) return;
        var href = a.getAttribute("href") || "";
        if (!href || href[0] === "#" || /^([a-z]+:)?\/\//i.test(href) || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) return;
        if (root && href.indexOf(root) !== 0) return;
        var rest = root ? href.slice(root.length) : href;
        if (/^assets\//.test(rest)) return;
        var hashIdx = rest.indexOf("#");
        var base = hashIdx >= 0 ? rest.slice(0, hashIdx) : rest;
        var hash = hashIdx >= 0 ? rest.slice(hashIdx) : "";
        if (lang === "ar" && /urun-karsilastirma/.test(rest)) {
          a.setAttribute("href", root + "ar/مقارنة-المنتجات/index.html" + hash);
          return;
        }
        if (lang === "ar" && /^ar\/urun-karsilastirma\//.test(rest)) {
          a.setAttribute("href", root + "ar/مقارنة-المنتجات/index.html" + hash);
          return;
        }
        if (lang === "ar" && pages && pages[base]) {
          a.setAttribute("href", root + "ar/" + pages[base] + hash);
          return;
        }
        var next = localizeRest(rest, lang, pages);
        a.setAttribute("href", root + next);
      });
    });
  }

  var i18nRoutePages = null;

  function loadI18nRoutes() {
    if (i18nRoutePages) return Promise.resolve(i18nRoutePages);
    if (window.location.protocol === "file:") {
      i18nRoutePages = {};
      return Promise.resolve(i18nRoutePages);
    }
    var root = (document.body && document.body.getAttribute("data-root")) || "";
    var lang = currentLang();
    var routesFile = "routes-ar.json";
    return fetch(root + "assets/data/i18n/" + routesFile)
      .then(function (res) {
        return res.ok ? res.json() : { pages: {} };
      })
      .then(function (data) {
        i18nRoutePages = data.pages || {};
        return i18nRoutePages;
      })
      .catch(function () {
        i18nRoutePages = {};
        return i18nRoutePages;
      });
  }

  function currentPageTrRel() {
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && canonical.href) {
      try {
        var url = new URL(canonical.href);
        var p = (url.pathname || "/").replace(/^\/+/, "").replace(/\/$/, "");
        if (p === "en" || p === "en/index.html") return "index.html";
        if (p.indexOf("en/") === 0) p = p.slice(3);
        if (p === "ar" || p === "ar/index.html") return "index.html";
        if (p.indexOf("ar/") === 0) p = p.slice(3);
        if (p === "" || p === "index.html") return "index.html";
        if (!/\/index\.html$/i.test(p)) p = p.replace(/\/?$/, "/index.html");
        return p;
      } catch (e) {}
    }
    var path = (window.location.pathname || "/").replace(/^\/+/, "");
    path = path.replace(/^(en|de|ar)\//, "");
    if (path === "" || path === "index.html") return "index.html";
    if (!/\/index\.html$/i.test(path)) path = path.replace(/\/?$/, "/index.html");
    return path;
  }

  function stubLangHomeHref(targetLang) {
    var origin = window.location.origin || "";
    if (origin) return origin + "/" + targetLang + "/index.html";
    return "/" + targetLang + "/index.html";
  }

  function resolveLangHref(targetLang, pages) {
    var trRel = currentPageTrRel();
    var root = document.body.getAttribute("data-root") || "";
    if (targetLang === "tr") {
      if ((document.documentElement.getAttribute("lang") || "").toLowerCase() === "ar") {
        var arRel = currentPageTrRel();
        var trKey = null;
        Object.keys(pages).forEach(function (k) {
          if (pages[k] === arRel) trKey = k;
        });
        trRel = trKey || "index.html";
      }
      if (trRel === "index.html") return root ? root + "index.html" : "/index.html";
      return root + trRel.replace(/^\//, "");
    }
    if (targetLang === "ar") {
      var arTarget = pages[trRel] || pages["index.html"] || "index.html";
      return root + "ar/" + arTarget.replace(/^\//, "");
    }
    if (targetLang === "en") {
      if (trRel === "index.html") return root + "en/index.html";
      return root + "en/" + trRel.replace(/^\//, "");
    }
    return root + trRel.replace(/^\//, "");
  }

  function wireLanguageSwitcher(pages) {
    var apply = function (routePages) {
      document.querySelectorAll(".lang-switcher a[lang]").forEach(function (a) {
        var target = (a.getAttribute("lang") || "tr").toLowerCase();
        a.setAttribute("href", resolveLangHref(target, routePages));
      });
    };
    if (pages) {
      apply(pages);
      return;
    }
    loadI18nRoutes().then(apply);
  }

  if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
