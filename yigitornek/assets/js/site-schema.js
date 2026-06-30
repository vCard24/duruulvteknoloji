/**
 * Ana sayfa: Organization + Manufacturer + WebSite
 * İletişim: LocalBusiness (fabrika konumu, Organization'a bağlı)
 */
(function () {
  var SITE = "https://www.yigitcelikkapi.com.tr";
  var ORG_ID = SITE + "/#organization";
  var BRAND = "Yiğit Çelik Kapı";
  var LOGO = SITE + "/assets/img/yigit_logo.svg";
  var HERO_IMAGE = SITE + "/assets/img/yigit_celik_kapi-07-1200x700.webp";
  var MAP_URL = "https://maps.app.goo.gl/NcXjJC897NZNiCUW6";

  var ADDRESS = {
    "@type": "PostalAddress",
    streetAddress: "Karpuzsekisi Mah. 34. Cad. No:24",
    addressLocality: "Hacılar",
    addressRegion: "Kayseri",
    addressCountry: "TR",
  };

  var GEO = {
    "@type": "GeoCoordinates",
    latitude: 38.707763,
    longitude: 35.338577,
  };

  var SAME_AS = [
    "https://www.instagram.com/yigit.celikkapi/",
    "https://www.facebook.com/yigitcelikkapi/",
    "https://www.yigitcelikkapi.com.tr/",
  ];

  var OPENING_HOURS = [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "17:30",
    },
  ];

  var AREA_SERVED = [
    { "@type": "Country", name: "Turkey" },
    { "@type": "AdministrativeArea", name: "Middle East" },
    { "@type": "AdministrativeArea", name: "Europe" },
  ];

  var KNOWS_ABOUT = {
    tr: [
      "Çelik kapı üretimi",
      "Yangın kapısı",
      "Villa ve bina giriş kapıları",
      "TSE belgeli üretim",
      "İhracat",
    ],
    en: [
      "Steel door manufacturing",
      "Fire-rated doors",
      "Villa and building entrance doors",
      "TSE-certified production",
      "Export",
    ],
    ar: [
      "تصنيع الأبواب الفولاذية",
      "أبواب مقاومة للحريق",
      "أبواب الفيلا ومداخل المباني",
      "إنتاج معتمد TSE",
      "التصدير",
    ],
  };

  function pageLang() {
    return (document.documentElement.getAttribute("lang") || "tr").toLowerCase().slice(0, 2);
  }

  function pageDescription() {
    var meta = document.querySelector('meta[name="description"]');
    return (meta && meta.getAttribute("content")) || BRAND;
  }

  function pageCanonical() {
    var link = document.querySelector('link[rel="canonical"]');
    var href = link && link.getAttribute("href");
    if (href && /^https?:\/\//i.test(href)) {
      return href.replace(/\/?$/, "/");
    }
    var path = (window.location.pathname || "/").replace(/\\/g, "/");
    if (!path.endsWith("/")) path += "/";
    return SITE + path;
  }

  function appendJsonLd(id, graph) {
    if (document.getElementById(id)) return;
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    });
    document.head.appendChild(script);
  }

  function injectHomeSchema() {
    if (!document.body || !document.body.classList.contains("page-home")) return;

    var lang = pageLang();
    var pageUrl = pageCanonical();
    var websiteId = pageUrl.replace(/\/$/, "") + "/#website";
    var knows = KNOWS_ABOUT[lang] || KNOWS_ABOUT.tr;

    appendJsonLd("yck-home-jsonld", [
      {
        "@type": ["Organization", "Manufacturer"],
        "@id": ORG_ID,
        name: BRAND,
        url: SITE + "/",
        logo: {
          "@type": "ImageObject",
          url: LOGO,
          width: 179,
          height: 64,
        },
        image: HERO_IMAGE,
        foundingDate: "2003",
        description: pageDescription(),
        email: "info@yigitcelikkapi.com.tr",
        telephone: "+90-352-311-55-41",
        address: ADDRESS,
        areaServed: AREA_SERVED,
        knowsAbout: knows,
        sameAs: SAME_AS,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: pageUrl,
        name: BRAND,
        description: pageDescription(),
        inLanguage: lang,
        publisher: { "@id": ORG_ID },
      },
    ]);
  }

  function injectContactSchema() {
    if (!document.body || !document.body.classList.contains("page-contact")) return;

    var pageUrl = pageCanonical();

    appendJsonLd("yck-contact-jsonld", [
      {
        "@type": ["Organization", "Manufacturer"],
        "@id": ORG_ID,
        name: BRAND,
        url: SITE + "/",
        logo: LOGO,
      },
      {
        "@type": "LocalBusiness",
        "@id": SITE + "/#localbusiness",
        name: BRAND,
        url: pageUrl,
        image: HERO_IMAGE,
        telephone: "+90-352-311-55-41",
        email: "info@yigitcelikkapi.com.tr",
        address: ADDRESS,
        geo: GEO,
        hasMap: MAP_URL,
        parentOrganization: { "@id": ORG_ID },
        openingHoursSpecification: OPENING_HOURS,
        areaServed: AREA_SERVED,
        sameAs: SAME_AS,
      },
    ]);
  }

  function boot() {
    injectHomeSchema();
    injectContactSchema();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
