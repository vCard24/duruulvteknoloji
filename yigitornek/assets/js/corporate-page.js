(function () {
  function initCorporateReveal() {
    if (!document.body.classList.contains("page-corporate")) return;
    if (document.body.hasAttribute("data-corp-reveal-init")) return;
    document.body.setAttribute("data-corp-reveal-init", "1");

    var targets = document.querySelectorAll(
      ".page-corporate .page-block, .page-corporate .corporate-band, .page-corporate .corporate-section-band, .page-corporate .corporate-mission-panel, .page-corporate .mv-vision-mosaic, .page-corporate .mv-closing-band, .page-contact .contact-factory-band, .page-contact .contact-cards-band, .page-contact .contact-map-form"
    );

    targets.forEach(function (el, i) {
      el.classList.add("corporate-reveal");
      el.style.transitionDelay = Math.min(i * 0.06, 0.36) + "s";
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initBreadcrumbSchema() {
    if (!document.body.classList.contains("page-corporate")) return;
    if (document.querySelector("script[data-yck-corporate-schema]")) return;

    var root = document.body.getAttribute("data-root") || "";
    var origin = window.location.origin || "https://www.yigitcelikkapi.com.tr";
    var path = (window.location.pathname || "").replace(/\\/g, "/");
    var pageUrl = origin + (path.startsWith("/") ? path : "/" + path);

    var isEn = /^\/en(\/|$)/.test(path);
    var homeLabel = isEn ? "Home" : "Ana Sayfa";
    var crumbCurrent = document.querySelector(".corporate-breadcrumb [aria-current='page']");
    var pageName = crumbCurrent ? crumbCurrent.textContent.trim() : document.title.split("|")[0].trim();

    var schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: homeLabel,
          item: origin + root.replace(/\/?$/, "/") + "index.html",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: pageName,
          item: pageUrl,
        },
      ],
    };

    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-yck-corporate-schema", "1");
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  function boot() {
    if (!document.body.classList.contains("page-corporate")) return;
    initBreadcrumbSchema();
    initCorporateReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  document.addEventListener("yck-layout-ready", boot);
})();
