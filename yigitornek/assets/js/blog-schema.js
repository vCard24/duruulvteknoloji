/**
 * Blog yazı sayfalarına Article JSON-LD enjekte eder.
 * TR: body.blog-article · EN/DE/AR: body.article-page under /blog/
 */
(function () {
  var SITE_ORIGIN = "https://www.yigitcelikkapi.com.tr";
  var BRAND = "Yiğit Çelik Kapı";

  function toSchemaUrl(href) {
    if (!href) return "";

    var raw = String(href).trim().replace(/\\/g, "/");
    if (/^https?:\/\//i.test(raw)) {
      try {
        var parsed = new URL(raw);
        if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
          return SITE_ORIGIN + parsed.pathname;
        }
      } catch (_e) {
        /* keep */
      }
      return raw;
    }

    if (/^file:/i.test(raw)) {
      var fromAssets = raw.match(/\/(assets\/.+)$/i);
      if (fromAssets) return SITE_ORIGIN + "/" + fromAssets[1];
    }

    while (raw.indexOf("../") === 0) raw = raw.slice(3);
    raw = raw.replace(/^\.\//, "").replace(/^\/+/, "");

    return SITE_ORIGIN + "/" + raw;
  }

  function isBlogArticlePage() {
    var body = document.body;
    if (!body) return false;
    if (body.classList.contains("blog-article")) return true;
    var path = (window.location.pathname || "").replace(/\\/g, "/");
    return body.classList.contains("article-page") && /\/blog\/[^/]+/i.test(path);
  }

  function resolveBlogArticleUrl() {
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      var href = canonical.getAttribute("href") || "";
      if (/^https?:\/\//i.test(href)) {
        return href.replace(/\/?$/, "/");
      }
    }

    var path = (window.location.pathname || "").replace(/\\/g, "/");
    var langMatch = path.match(/\/(en|de|ar)\/blog\/([^/]+)/i);
    if (langMatch) {
      return (
        SITE_ORIGIN +
        "/" +
        langMatch[1].toLowerCase() +
        "/blog/" +
        langMatch[2] +
        "/"
      );
    }

    var slugMatch = path.match(/\/blog\/([^/]+)/i);
    if (slugMatch) {
      return SITE_ORIGIN + "/blog/" + slugMatch[1] + "/";
    }

    return SITE_ORIGIN + "/blog/";
  }

  function parseBlogDateIso() {
    var kicker = document.querySelector(".blog-article__kicker");
    if (kicker) {
      var m = kicker.textContent.match(/(\d{2})\.(\d{2})\.(\d{4})/);
      if (m) return m[3] + "-" + m[2] + "-" + m[1];
    }

    var timeEl = document.querySelector("time[datetime]");
    if (timeEl) {
      var dt = timeEl.getAttribute("datetime") || "";
      var dm = dt.match(/(\d{2})\.(\d{2})\.(\d{4})/);
      if (dm) return dm[3] + "-" + dm[2] + "-" + dm[1];
      if (/^\d{4}-\d{2}-\d{2}/.test(dt)) return dt.slice(0, 10);
    }

    return null;
  }

  function injectBlogArticleJsonLd() {
    if (!isBlogArticlePage()) return;
    if (document.getElementById("yck-article-jsonld")) return;

    var headlineEl = document.querySelector(".page-hero h1");
    var descMeta = document.querySelector('meta[name="description"]');
    var coverImg = document.querySelector(".blog-article__cover img");

    var headline =
      (headlineEl && headlineEl.textContent.trim()) ||
      document.title.split("|")[0].trim();
    var description =
      (descMeta && descMeta.getAttribute("content")) || headline;
    var pageUrl = resolveBlogArticleUrl();
    var imageSrc = coverImg
      ? toSchemaUrl(coverImg.getAttribute("src") || "")
      : "";
    var datePublished = parseBlogDateIso();

    var schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": pageUrl + "#article",
      headline: headline,
      description: description,
      author: {
        "@type": "Organization",
        name: BRAND,
      },
      publisher: {
        "@type": "Organization",
        name: BRAND,
        logo: {
          "@type": "ImageObject",
          url: SITE_ORIGIN + "/assets/img/yigit_logo.svg",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": pageUrl,
      },
      inLanguage: document.documentElement.lang || "tr",
    };

    if (imageSrc) schema.image = [imageSrc];
    if (datePublished) {
      schema.datePublished = datePublished;
      schema.dateModified = datePublished;
    }

    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "yck-article-jsonld";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectBlogArticleJsonLd);
  } else {
    injectBlogArticleJsonLd();
  }
})();
