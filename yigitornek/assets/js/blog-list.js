/**
 * Blog liste sayfası: #blog-list-root
 * Veri: assets/data/blog.json
 */
(function () {
  var WPM = 200;
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

  function readingMinutes(wordCount) {
    var words = Number(wordCount) || 0;
    return Math.max(1, Math.ceil(words / WPM));
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

  function renderMeta(post) {
    var catSlug = categorySlug(post.category);
    var mins = readingMinutes(post.wordCount);
    return (
      '<div class="blog-card__meta">' +
      '<span class="blog-card__category blog-card__category--' + esc(catSlug) + '">' + esc(post.category || msg("Blog", "المدونة")) + "</span>" +
      '<time class="blog-card__date" datetime="' + esc(parseDateIso(post.date)) + '">' + esc(post.date || "") + "</time>" +
      '<span class="blog-card__read-time">' + mins + msg(" dk okuma", " د قراءة", " min read") + "</span>" +
      "</div>"
    );
  }

  function renderFeatured(post) {
    return (
      '<article class="blog-featured">' +
      '<a class="blog-featured__media" href="' + esc(postHref(post.slug)) + '">' +
      '<img src="' + esc(imageSrc(post.image)) + '" alt="' + esc(post.title) + '" loading="eager" width="960" height="540" decoding="async" />' +
      '<span class="blog-featured__badge">' + msg("Öne Çıkan", "مميز", "Featured") + "</span>" +
      "</a>" +
      '<div class="blog-featured__body">' +
      renderMeta(post) +
      '<h2 class="blog-featured__title"><a href="' + esc(postHref(post.slug)) + '">' + esc(post.title) + "</a></h2>" +
      '<p class="blog-featured__excerpt">' + esc(post.excerpt || "") + "</p>" +
      '<a class="blog-card__more" href="' + esc(postHref(post.slug)) + '">' + msg("Devamını oku →", "اقرأ المزيد ←", "Read more →") + "</a>" +
      "</div>" +
      "</article>"
    );
  }

  function renderCard(post) {
    return (
      '<article class="blog-card">' +
      '<a class="blog-card__media" href="' + esc(postHref(post.slug)) + '">' +
      '<img src="' + esc(imageSrc(post.image)) + '" alt="' + esc(post.title) + '" loading="lazy" width="800" height="500" decoding="async" />' +
      "</a>" +
      '<div class="blog-card__body">' +
      renderMeta(post) +
      '<h2 class="blog-card__title"><a href="' + esc(postHref(post.slug)) + '">' + esc(post.title) + "</a></h2>" +
      '<p class="blog-card__excerpt">' + esc(post.excerpt || "") + "</p>" +
      '<a class="blog-card__more" href="' + esc(postHref(post.slug)) + '">' + msg("Devamını oku →", "اقرأ المزيد ←", "Read more →") + "</a>" +
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

    var url = root() + "assets/data/blog.json";
    if (window.location.protocol !== "file:") {
      return fetch(url)
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
      var script = document.createElement("script");
      script.src = root() + "assets/js/blog-data.js";
      script.defer = true;
      script.setAttribute("data-yck-blog-data", "1");
      script.onload = function () {
        if (window.YCK_BLOG) resolve(window.YCK_BLOG);
        else reject(new Error("blog-data empty"));
      };
      script.onerror = function () { reject(new Error("blog-data load failed")); };
      document.head.appendChild(script);
    });
  }

  function init() {
    var mount = document.getElementById("blog-list-root");
    if (!mount) return;

    Promise.all([loadArBlogI18n(), loadEnBlogI18n()])
      .then(function () { return loadBlogPosts(); })
      .then(function (posts) {
        if (!Array.isArray(posts) || !posts.length) {
          mount.innerHTML =
            '<p class="blog-list-page__empty">' +
            msg("Henüz blog yazısı yok.", "لا توجد مقالات بعد.", "No blog posts yet.") +
            "</p>";
          return;
        }

        posts = posts.map(localizePost);
        var featured = posts.find(function (p) { return p.featured; }) || posts[0];
        var rest = posts.filter(function (p) { return p.slug !== featured.slug; });
        var html = renderFeatured(featured);

        if (rest.length) {
          html += '<div class="blog-list">' + rest.map(renderCard).join("") + "</div>";
        }

        mount.innerHTML = html;
      })
      .catch(function () {
        mount.innerHTML =
          '<p class="blog-list-page__empty">' +
          msg("Blog yazıları yüklenemedi. ", "تعذّر تحميل المقالات. ", "Could not load blog posts. ") +
          (window.location.protocol === "file:"
            ? msg(
                'Dosyayı doğrudan açmak yerine proje klasöründe <code>python -m http.server 8080</code> çalıştırıp <a href="http://localhost:8080/blog/">http://localhost:8080/blog/</a> adresini kullanın.',
                'بدلاً من فتح الملف مباشرة، شغّلوا <code>python -m http.server 8080</code> واستخدموا <a href="http://localhost:8080/ar/المدونة/">http://localhost:8080/ar/المدونة/</a>.',
                'Instead of opening the file directly, run <code>python -m http.server 8080</code> and use <a href="http://localhost:8080/en/blog/">http://localhost:8080/en/blog/</a>.'
              )
            : msg("Lütfen sayfayı yenileyin.", "يرجى تحديث الصفحة.", "Please refresh the page.")) +
          "</p>";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
