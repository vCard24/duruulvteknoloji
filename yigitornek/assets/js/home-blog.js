/**
 * Ana sayfa blog bölümü: #home-blog-root
 * Veri: assets/data/blog.json / blog-data.js
 */
(function () {
  var BLOG_SLUGS_AR = null;
  var POSTS_AR = null;
  var POSTS_EN = null;

  function root() {
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

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function categorySlug(category) {
    return String(category || "blog")
      .toLowerCase()
      .replace(/ı/g, "i")
      .replace(/İ/g, "i")
      .replace(/ğ/g, "g")
      .replace(/Ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/Ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/Ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/Ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/Ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function parseDateIso(dateStr) {
    var parts = String(dateStr || "").split(".");
    if (parts.length !== 3) return dateStr || "";
    return parts[2] + "-" + parts[1] + "-" + parts[0];
  }

  function postHref(slug) {
    if (isArLang() && BLOG_SLUGS_AR && BLOG_SLUGS_AR[slug]) {
      var arSlug = BLOG_SLUGS_AR[slug];
      var path = (window.location.pathname || "").replace(/\\/g, "/");
      if (/\/ar\/المدونة(\/|$)/.test(path) || path.indexOf("/المدونة/index.html") !== -1) {
        return arSlug + "/index.html";
      }
      if (path.indexOf("/ar/") !== -1 || path.endsWith("/ar") || path.endsWith("/ar/")) {
        return root() + "المدونة/" + arSlug + "/index.html";
      }
      return root() + "ar/المدونة/" + arSlug + "/index.html";
    }
    return root() + "blog/" + slug + "/index.html";
  }

  function localizePost(post) {
    if (isArLang() && POSTS_AR && POSTS_AR[post.slug]) {
      var ar = POSTS_AR[post.slug];
      return Object.assign({}, post, {
        title: ar.title || post.title,
        excerpt: ar.excerpt || post.excerpt,
        category: ar.category || post.category,
      });
    }
    if (isEnLang() && POSTS_EN && POSTS_EN[post.slug]) {
      var en = POSTS_EN[post.slug];
      return Object.assign({}, post, {
        title: en.title || post.title,
        excerpt: en.excerpt || post.excerpt,
        category: en.category || post.category,
      });
    }
    return post;
  }

  function imageSrc(image) {
    return root() + String(image || "").replace(/^\//, "");
  }

  function renderCompactMeta(post) {
    var catSlug = categorySlug(post.category);
    return (
      '<div class="blog-card__meta blog-card__meta--compact">' +
      '<span class="blog-card__category blog-card__category--' + esc(catSlug) + '">' + esc(post.category || "Blog") + "</span>" +
      '<time class="blog-card__date" datetime="' + esc(parseDateIso(post.date)) + '">' + esc(post.date || "") + "</time>" +
      "</div>"
    );
  }

  function renderCompactCard(post, index) {
    var loading = index === 0 ? "eager" : "lazy";
    var badge = post.featured
      ? '<span class="blog-card__home-badge">' + msg("Öne çıkan", "مميز", "Featured") + "</span>"
      : "";

    return (
      '<article class="blog-card blog-card--home">' +
      '<a class="blog-card__media" href="' + esc(postHref(post.slug)) + '">' +
      '<img src="' + esc(imageSrc(post.image)) + '" alt="' + esc(post.title) + '" loading="' + loading + '" width="400" height="300" decoding="async" />' +
      badge +
      "</a>" +
      '<div class="blog-card__body">' +
      renderCompactMeta(post) +
      '<h2 class="blog-card__title"><a href="' + esc(postHref(post.slug)) + '">' + esc(post.title) + "</a></h2>" +
      "</div>" +
      "</article>"
    );
  }

  function loadEnBlogI18n() {
    if (!isEnLang()) return Promise.resolve();
    if (window.YCK_BLOG_EN && Array.isArray(window.YCK_BLOG_EN)) {
      POSTS_EN = {};
      window.YCK_BLOG_EN.forEach(function (p) {
        POSTS_EN[p.slug] = p;
      });
      return Promise.resolve();
    }
    if (POSTS_EN) return Promise.resolve();
    var base = root() + "assets/data/i18n/";
    return fetch(base + "blog-posts-en.json")
      .then(function (r) {
        if (!r.ok) throw new Error("blog-posts-en");
        return r.json();
      })
      .then(function (data) {
        POSTS_EN = data;
      })
      .catch(function () {
        POSTS_EN = POSTS_EN || {};
      });
  }

  function loadArBlogI18n() {
    if (!isArLang()) return Promise.resolve();
    if (window.YCK_BLOG_SLUGS_AR && window.YCK_BLOG_AR) {
      BLOG_SLUGS_AR = window.YCK_BLOG_SLUGS_AR;
      POSTS_AR = {};
      window.YCK_BLOG_AR.forEach(function (p) {
        POSTS_AR[p.slug] = p;
      });
      return Promise.resolve();
    }
    if (BLOG_SLUGS_AR && POSTS_AR) return Promise.resolve();
    var base = root() + "assets/data/i18n/";
    return Promise.all([
      fetch(base + "blog-slugs-ar.json").then(function (r) {
        if (!r.ok) throw new Error("blog-slugs-ar");
        return r.json();
      }),
      fetch(base + "blog-posts-ar.json").then(function (r) {
        if (!r.ok) throw new Error("blog-posts-ar");
        return r.json();
      }),
    ])
      .then(function (results) {
        BLOG_SLUGS_AR = results[0];
        POSTS_AR = results[1];
      })
      .catch(function () {
        BLOG_SLUGS_AR = BLOG_SLUGS_AR || {};
        POSTS_AR = POSTS_AR || {};
      });
  }

  function loadBlogPosts() {
    if (isEnLang() && window.YCK_BLOG_EN && Array.isArray(window.YCK_BLOG_EN)) {
      return Promise.resolve(window.YCK_BLOG_EN);
    }
    if (isArLang() && window.YCK_BLOG_AR && Array.isArray(window.YCK_BLOG_AR)) {
      return Promise.resolve(window.YCK_BLOG_AR);
    }
    if (window.YCK_BLOG && Array.isArray(window.YCK_BLOG)) {
      return Promise.resolve(window.YCK_BLOG);
    }

    if (window.location.protocol !== "file:") {
      return fetch(root() + "assets/data/blog.json")
        .then(function (res) {
          if (!res.ok) throw new Error("blog.json");
          return res.json();
        })
        .catch(function () {
          return loadEmbeddedBlog();
        });
    }

    return loadEmbeddedBlog();
  }

  function loadEmbeddedBlog() {
    return new Promise(function (resolve, reject) {
      if (window.YCK_BLOG) return resolve(window.YCK_BLOG);
      if (document.querySelector("script[data-yck-blog-data]")) {
        var tries = 0;
        var timer = setInterval(function () {
          if (window.YCK_BLOG) {
            clearInterval(timer);
            resolve(window.YCK_BLOG);
          } else if (++tries > 100) {
            clearInterval(timer);
            reject(new Error("blog-data timeout"));
          }
        }, 30);
        return;
      }
      reject(new Error("blog-data missing"));
    });
  }

  function loadBlogCss() {
    if (document.querySelector('link[data-yck-blog-css]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = root() + "assets/css/blog.css?v=20260706";
    link.setAttribute("data-yck-blog-css", "1");
    document.head.appendChild(link);
  }

  function init() {
    var mount = document.getElementById("home-blog-root");
    if (!mount) return;

    loadBlogCss();

    Promise.all([loadArBlogI18n(), loadEnBlogI18n()])
      .then(function () { return loadBlogPosts(); })
      .then(function (posts) {
        if (!Array.isArray(posts) || !posts.length) {
          mount.innerHTML =
            '<p class="home-blog__empty">' + msg("Blog yazıları yüklenemedi.", "تعذّر تحميل المقالات.", "Could not load blog posts.") + "</p>";
          return;
        }

        posts = posts.map(localizePost);
        var sorted = posts.slice().sort(function (a, b) {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        var row = sorted.slice(0, 5);

        mount.innerHTML =
          '<div class="home-blog__row" role="list">' +
          row.map(function (post, index) {
            return renderCompactCard(post, index);
          }).join("") +
          "</div>";
      })
      .catch(function () {
        mount.innerHTML =
          '<p class="home-blog__empty">' +
          msg("Blog yazıları yüklenemedi. ", "تعذّر تحميل المقالات. ", "Could not load blog posts. ") +
          '<a href="' +
          esc(root() + (isArLang() ? "ar/المدونة/index.html" : isEnLang() ? "blog/index.html" : "blog/index.html")) +
          '">' +
          msg("Blog sayfasına gidin →", "انتقل إلى المدونة ←", "Go to blog →") +
          "</a></p>";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleInit);
  } else {
    scheduleInit();
  }

  function scheduleInit() {
    var mount = document.getElementById("home-blog-root");
    if (!mount) return;
    if (!("IntersectionObserver" in window)) {
      init();
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          init();
        });
      },
      { rootMargin: "240px 0px" }
    );
    observer.observe(mount);
  }
})();
