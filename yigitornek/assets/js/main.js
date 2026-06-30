(function () {
  /* Slayt arka planları WordPress ana sayfa (Elementor) ile aynı dosya adları: yigit_celik_kapi-04 … -01 */
  const HERO_SLIDES = [
    {
      title: "23 yıllık tecrübe, sınırsız güven",
      description:
        "2003'ten bu yana çelik kapı sektöründe edindiğimiz bilgi birikimi ve deneyimle, her üründe güveni ve kaliteyi garanti ediyoruz.",
      cta: "2026 Kataloğumuz",
      ctaLink: "assets/catalog/yigit_celikkapi_2026_katalog.pdf",
      ctaExternal: true,
      image: "assets/img/yigit_celik_kapi-04.webp",
    },
    {
      title: "Modern tasarım, sağlam duruş",
      description:
        "Estetik çizgilerle güçlendirilmiş çelik kapılar… Yiğit Çelik Kapı, modern üretim teknolojisiyle tasarım ve güvenliği buluşturur.",
      cta: "Kurumsal",
      ctaLink: "hakkimizda/index.html",
      image: "assets/img/yigit_celik_kapi-07.webp",
    },
    {
      title: "10.000 m² modern tesis, son teknoloji üretim",
      description:
        "Kayseri Organize Sanayi Bölgesi'ndeki geniş üretim alanımızda, en ileri teknolojilerle donatılmış makinelerle çalışıyoruz. Modern altyapımız sayesinde her kapıda yüksek kaliteyi, dayanıklılığı ve estetiği bir araya getirdik.",
      cta: "Ürünlerimiz",
      ctaLink: "urunler/index.html",
      image: "assets/img/yigit_celik_kapi-02.webp",
    },
    {
      title: "Estetik tasarım, güvenli yaşam, huzurlu anlar.",
      description: "Her detayında şıklığı, her yapısında dayanıklılığı hissedin.",
      cta: "Değerlerimiz",
      ctaLink: "#degerlerimiz",
      image: "assets/img/yigit_celik_kapi-10.webp",
    },
    {
      title: "Termin hassasiyeti, global sevkiyat gücü",
      description:
        "Üretimden teslimata kadar her aşamada sözümüzün arkasındayız. Zamanında termin ve güçlü lojistik ağımızla, Türkiye'den Avrupa'ya, Orta Doğu'dan Afrika'ya güvenli ve hızlı sevkiyat sağlıyoruz.",
      cta: "2026 Kataloğumuzu İndirin",
      ctaLink: "assets/catalog/yigit_celikkapi_2026_katalog.pdf",
      ctaExternal: true,
      image: "assets/img/yigit_celik_kapi-01.webp",
    },
  ];

  function getRootPrefix() {
    return document.body.getAttribute("data-root") || "";
  }

  function isUnderArSite() {
    var path = (window.location.pathname || "").replace(/\\/g, "/");
    return /\/ar(\/|$)/.test(path);
  }

  function resolveHeroHref(link) {
    if (/^(https?:|mailto:|tel:|#)/.test(link)) return link;
    var prefix = getRootPrefix();
    if (link.indexOf("assets/") === 0) return prefix + link;
    var lang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (lang === "ar") {
      if (isUnderArSite()) return link;
      return prefix + "ar/" + link;
    }
    return prefix + link;
  }

  function bindNav() {
    const nav = document.getElementById("site-nav");
    const toggle = document.getElementById("nav-toggle");
    const mobile = document.getElementById("nav-mobile");
    if (!nav || !toggle || !mobile) return;

    const openIcon = toggle.querySelector(".icon-open");
    const closeIcon = toggle.querySelector(".icon-close");

    window.addEventListener("scroll", function () {
      if (window.scrollY > 10) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    });

    function setMobileNavOpen(open) {
      mobile.classList.toggle("is-open", open);
      document.body.classList.toggle("is-nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (openIcon && closeIcon) {
        openIcon.classList.toggle("nav-toggle__icon--hidden", open);
        closeIcon.classList.toggle("nav-toggle__icon--hidden", !open);
      }
    }

    toggle.addEventListener("click", function () {
      setMobileNavOpen(!mobile.classList.contains("is-open"));
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobile.classList.contains("is-open")) {
        setMobileNavOpen(false);
      }
    });

    mobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMobileNavOpen(false);
      });
    });
  }

  function bindScrollTop() {
    const btn = document.getElementById("scroll-top");
    if (!btn) return;
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /** Ana sayfa kurumsal mozaik — dönüşümlü görsel havuzu */
  var HOME_ABOUT_IMAGE_POOL = [
    "assets/img/lazer-kesim.jpg",
    "assets/img/kapi,kilit.jpg",
    "assets/img/fabrikas.jpg",
    "assets/img/yigit-posts-18.jpg",
    "assets/img/yigit-posts-24.jpg",
    "assets/img/yigit-posts-19.jpg",
    "assets/img/yigit-posts-33.jpg",
    "assets/img/yigit-posts-34.jpg",
  ];
  var HOME_ABOUT_FALLBACK = "assets/img/lazer-kesim.jpg";
  var HOME_ABOUT_SLOT_INTERVAL_MS = 4500;

  function homeAboutImageSrc(prefix, relativePath) {
    var slash = relativePath.lastIndexOf("/");
    if (slash === -1) return prefix + encodeURIComponent(relativePath);
    return prefix + relativePath.slice(0, slash + 1) + encodeURIComponent(relativePath.slice(slash + 1));
  }

  function assignHomeAboutImage(img, relativePath, prefix) {
    var tried = [];

    function loadPath(path) {
      if (!path || tried.indexOf(path) !== -1) return;
      tried.push(path);
      img.onerror = function () {
        if (path !== HOME_ABOUT_FALLBACK) {
          loadPath(HOME_ABOUT_FALLBACK);
        } else {
          img.onerror = null;
        }
      };
      img.setAttribute("src", homeAboutImageSrc(prefix, path));
    }

    loadPath(relativePath);
  }

  function initHomeAboutStage(imgEl) {
    var existing = imgEl.closest(".home-about__img-stage");
    if (existing) {
      var layers = existing.querySelectorAll(".home-about__layer");
      var visible = 0;
      layers.forEach(function (layer, idx) {
        if (layer.classList.contains("is-visible")) visible = idx;
      });
      return { layers: layers, visible: visible };
    }

    var stage = document.createElement("div");
    stage.className = "home-about__img-stage js-home-about-stage";

    var layerA = imgEl;
    var layerB = imgEl.cloneNode(false);
    layerB.setAttribute("aria-hidden", "true");

    layerA.classList.add("home-about__layer", "is-visible");
    layerB.classList.add("home-about__layer");

    var parent = imgEl.parentNode;
    parent.replaceChild(stage, imgEl);
    stage.appendChild(layerA);
    stage.appendChild(layerB);

    return { layers: [layerA, layerB], visible: 0 };
  }

  function crossfadeHomeAboutStage(state, relativePath, prefix) {
    var nextIdx = state.visible === 0 ? 1 : 0;
    var currentLayer = state.layers[state.visible];
    var nextLayer = state.layers[nextIdx];
    var revealed = false;

    function reveal() {
      if (revealed) return;
      revealed = true;
      nextLayer.classList.add("is-visible");
      currentLayer.classList.remove("is-visible");
      state.visible = nextIdx;
      nextLayer.removeEventListener("load", reveal);
      nextLayer.removeEventListener("error", reveal);
    }

    nextLayer.addEventListener("load", reveal);
    nextLayer.addEventListener("error", reveal);
    assignHomeAboutImage(nextLayer, relativePath, prefix);

    if (nextLayer.complete && nextLayer.naturalWidth > 0) {
      window.requestAnimationFrame(reveal);
    }
  }

  function bindHomeAboutRotatingImages() {
    var imgs = document.querySelectorAll(".js-home-about-img");
    if (imgs.length < 2) return;

    var pool = HOME_ABOUT_IMAGE_POOL.slice();
    var n = pool.length;
    if (n < 2) return;

    var prefix = getRootPrefix();
    var stages = [initHomeAboutStage(imgs[0]), initHomeAboutStage(imgs[1])];
    var poolCursor = 0;
    var activeSlot = 0;
    var timer = null;

    assignHomeAboutImage(stages[0].layers[stages[0].visible], pool[poolCursor % n], prefix);
    poolCursor += 1;
    assignHomeAboutImage(stages[1].layers[stages[1].visible], pool[poolCursor % n], prefix);
    poolCursor += 1;

    function cycleNextSlot() {
      var path = pool[poolCursor % n];
      poolCursor += 1;
      crossfadeHomeAboutStage(stages[activeSlot], path, prefix);
      activeSlot = activeSlot === 0 ? 1 : 0;
      timer = window.setTimeout(cycleNextSlot, HOME_ABOUT_SLOT_INTERVAL_MS);
    }

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function startRotation() {
      if (timer || reduceMotion.matches) return;
      timer = window.setTimeout(cycleNextSlot, HOME_ABOUT_SLOT_INTERVAL_MS);
    }

    function stopRotation() {
      if (!timer) return;
      window.clearTimeout(timer);
      timer = null;
    }

    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener("change", function () {
        stopRotation();
        if (!reduceMotion.matches) startRotation();
      });
    }

    startRotation();
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopRotation();
      else startRotation();
    });
  }

  function bindHero() {
    const section = document.getElementById("hero");
    if (!section) return;

    if (document.documentElement.lang === "ar" && !window.YCK_HERO_AR) {
      document.addEventListener("yck-ar-i18n-ready", bindHero, { once: true });
      return;
    }
    if (document.documentElement.lang === "en" && !window.YCK_HERO_EN) {
      document.addEventListener("yck-layout-ready", bindHero, { once: true });
      return;
    }

    const slidesEl = section.querySelector("[data-hero-slides]");
    const titleEl = section.querySelector("[data-hero-title]");
    const descEl = section.querySelector("[data-hero-desc]");
    const ctaEl = section.querySelector("[data-hero-cta]");
    const curEl = section.querySelector("[data-hero-current]");
    const totalEl = section.querySelector("[data-hero-total]");
    const liveEl = section.querySelector("[data-hero-live]");
    const prevBtn = section.querySelector("[data-hero-prev]");
    const nextBtn = section.querySelector("[data-hero-next]");

    if (!slidesEl || !titleEl || !descEl || !ctaEl) return;

    const prefix = getRootPrefix();
    let current = 0;
    const slides = document.documentElement.lang === "ar" && window.YCK_HERO_AR
      ? window.YCK_HERO_AR
      : document.documentElement.lang === "en" && window.YCK_HERO_EN
        ? window.YCK_HERO_EN
        : HERO_SLIDES;
    const n = slides.length;
    if (totalEl) totalEl.textContent = "0" + n;

    function renderSlide(i) {
      const s = slides[i];
      titleEl.textContent = s.title;
      descEl.textContent = s.description;
      ctaEl.textContent = s.cta;
      var link = s.ctaLink;
      ctaEl.setAttribute("href", resolveHeroHref(link));
      if (s.ctaExternal || link.endsWith(".pdf")) {
        ctaEl.setAttribute("target", "_blank");
        ctaEl.setAttribute("rel", "noopener");
      } else {
        ctaEl.removeAttribute("target");
        ctaEl.removeAttribute("rel");
      }
      if (curEl) curEl.textContent = "0" + (i + 1);
      if (liveEl) {
        liveEl.textContent = "Slayt " + (i + 1) + " / " + n + ": " + s.title + ". " + s.description;
      }

      const slideEls = slidesEl.querySelectorAll(".hero__slide");
      slideEls.forEach(function (el, domIdx) {
        el.classList.toggle("is-active", i > 0 && domIdx === i - 1);
      });
      section.classList.toggle("hero--carousel-on", i > 0);
      if (i === 0) {
        prefetchSlideBg(1);
      } else {
        ensureSlideBg(i);
        prefetchSlideBg((i + 1) % n);
      }
    }

    function go(i) {
      current = (i + n) % n;
      renderSlide(current);
    }

    var HERO_INTERVAL = 7000;
    var HERO_FIRST_AUTOPLAY_MS = 45000;
    var autoplayTimer = null;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function startAutoplay() {
      stopAutoplay();
      if (reduceMotion.matches) return;
      var delay = current === 0 ? HERO_FIRST_AUTOPLAY_MS : HERO_INTERVAL;
      autoplayTimer = setTimeout(function () {
        go(current + 1);
        autoplayTimer = setInterval(function () {
          go(current + 1);
        }, HERO_INTERVAL);
      }, delay);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearTimeout(autoplayTimer);
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay() {
      startAutoplay();
    }

    function ensureSlideBg(idx) {
      if (idx === 0) return;
      const img = slides[idx];
      if (!img) return;
      const el = slidesEl.querySelectorAll(".hero__slide")[idx - 1];
      if (!el) return;
      const d = el.querySelector(".hero__slide-bg");
      if (!d || d.dataset.bgLoaded === "1") return;
      d.style.backgroundImage = "url(" + prefix + img.image + ")";
      d.dataset.bgLoaded = "1";
    }

    function prefetchSlideBg(idx) {
      const img = slides[idx];
      if (!img) return;
      const pre = new Image();
      pre.src = prefix + img.image;
    }

    prefetchSlideBg(1);

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        go(current - 1);
        resetAutoplay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        go(current + 1);
        resetAutoplay();
      });
    }

    if (reduceMotion.matches) {
      section.classList.add("hero--reduce-motion");
    }
    reduceMotion.addEventListener("change", function () {
      section.classList.toggle("hero--reduce-motion", reduceMotion.matches);
      if (reduceMotion.matches) stopAutoplay();
      else startAutoplay();
    });

    startAutoplay();
  }

  function updateHeaderCompareCount() {
    if (window.yigitCompare) {
      window.yigitCompare.updateBadges();
      return;
    }
    var el = document.getElementById("compare-count-header");
    if (!el) return;
    try {
      var list = JSON.parse(localStorage.getItem("yck_compare") || "[]");
      el.textContent = String(list.length);
    } catch (_e) {
      el.textContent = "0";
    }
  }
  window.updateHeaderCompareCount = updateHeaderCompareCount;

  function bindFactoryReveal() {
    var blocks = document.querySelectorAll("[data-factory-reveal]");
    if (!blocks.length) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function activate(el) {
      if (el.classList.contains("is-active")) return;
      el.classList.add("is-active");

      var colorLayer = el.querySelector(".factory-reveal__color");
      if (!colorLayer) return;

      function markComplete() {
        el.classList.add("is-complete");
        colorLayer.removeEventListener("animationend", markComplete);
      }

      colorLayer.addEventListener("animationend", markComplete);
    }

    blocks.forEach(function (el) {
      if (reduceMotion.matches) {
        activate(el);
        el.classList.add("is-complete");
        return;
      }

      if (!("IntersectionObserver" in window)) {
        activate(el);
        return;
      }

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              activate(el);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.35, rootMargin: "0px 0px -5% 0px" }
      );

      observer.observe(el);
    });
  }

  function scheduleBindHero() {
    if (!document.getElementById("hero")) return;
    function run() {
      requestAnimationFrame(function () {
        requestAnimationFrame(bindHero);
      });
    }
    if (document.readyState === "complete") {
      run();
    } else {
      window.addEventListener("load", run, { once: true });
    }
  }

  function markContentReady() {
    document.documentElement.classList.add("content-ready");
  }

  function init() {
    bindNav();
    bindScrollTop();
    scheduleBindHero();
    bindHomeAboutRotatingImages();
    bindFactoryReveal();
    updateHeaderCompareCount();
    window.addEventListener("storage", updateHeaderCompareCount);
    if (document.readyState === "complete") {
      markContentReady();
    } else {
      window.addEventListener("load", markContentReady, { once: true });
    }
  }

  window.yigitSite = { init: init };
})();
