/**
 * WordPress ürün detay şablonundan taşınan lightbox ve karşılaştırma davranışı.
 * allProducts ve currentProductIndex sayfa içi inline script ile tanımlanır.
 */
var YCK_SITE_ORIGIN = "https://www.yigitcelikkapi.com.tr";
var YCK_BRAND_NAME = "Yiğit Çelik Kapı";

function isArProductPage() {
  return (document.documentElement.getAttribute("lang") || "").toLowerCase() === "ar";
}

function isEnProductPage() {
  return (document.documentElement.getAttribute("lang") || "").toLowerCase() === "en";
}

function productMsg(tr, ar, en) {
  if (isArProductPage()) return ar;
  if (isEnProductPage()) return en != null ? en : tr;
  return tr;
}

function toAbsoluteProductUrl(href) {
  if (!href) return "";

  var raw = String(href).trim().replace(/\\/g, "/");
  if (/^https?:\/\//i.test(raw)) {
    try {
      var parsed = new URL(raw);
      if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
        return YCK_SITE_ORIGIN + parsed.pathname;
      }
    } catch (_e) {
      /* keep absolute URL as-is */
    }
    return raw;
  }

  if (/^file:/i.test(raw)) {
    var fromAssets = raw.match(/\/(assets\/.+)$/i);
    if (fromAssets) return YCK_SITE_ORIGIN + "/" + fromAssets[1];
  }

  while (raw.indexOf("../") === 0) raw = raw.slice(3);
  raw = raw.replace(/^\.\//, "").replace(/^\/+/, "");

  return YCK_SITE_ORIGIN + "/" + raw;
}

function readProductSpecValues() {
  var props = [];
  document.querySelectorAll(".specs-grid-clean .spec-item").forEach(function (item) {
    var labelEl = item.querySelector(".spec-label");
    var valueEl = item.querySelector(".spec-value");
    var name = labelEl ? labelEl.textContent.trim() : "";
    var value = valueEl ? valueEl.textContent.trim() : "";
    if (name && value) {
      props.push({
        "@type": "PropertyValue",
        name: name,
        value: value,
      });
    }
  });
  return props;
}

function injectProductJsonLd() {
  if (!document.body || !document.body.getAttribute("data-product-id")) return;
  if (!document.querySelector(".product-detail-v2")) return;
  if (document.getElementById("yck-product-jsonld")) return;

  var subtitleEl = document.querySelector(".product-subtitle");
  var codeEl = document.querySelector(".code-value");
  var codeTitleEl = document.querySelector(".product-code-title");
  var descEl = document.querySelector(".product-description-clean p");
  var imgEl = document.querySelector(".image-container img");
  var seriesEl = document.querySelector(".series-badge-clean");
  var canonicalEl = document.querySelector('link[rel="canonical"]');

  var sku =
    (codeEl && codeEl.textContent.trim()) ||
    (codeTitleEl && codeTitleEl.textContent.replace(/^KOD:\s*/i, "").trim()) ||
    "";
  var name = (subtitleEl && subtitleEl.textContent.trim()) || document.title.split("|")[0].trim();
  var description =
    (descEl && descEl.textContent.trim()) ||
    (document.querySelector('meta[name="description"]') || {}).content ||
    name;
  var imageSrc = "";
  if (imgEl) {
    var imageHref = imgEl.getAttribute("src") || "";
    imageSrc = toAbsoluteProductUrl(imageHref);
  }
  var pageUrl =
    (canonicalEl && canonicalEl.getAttribute("href")) || "";
  if (!pageUrl || !/^https?:\/\//i.test(pageUrl)) {
    pageUrl = YCK_SITE_ORIGIN + "/";
  }

  var schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": pageUrl + "#product",
    name: name,
    description: description,
    sku: sku,
    mpn: sku,
    brand: {
      "@type": "Brand",
      name: YCK_BRAND_NAME,
    },
    manufacturer: {
      "@type": "Organization",
      name: YCK_BRAND_NAME,
      url: YCK_SITE_ORIGIN + "/",
    },
    offers: {
      "@type": "Offer",
      url: pageUrl,
      availability: "https://schema.org/InStock",
      priceCurrency: "TRY",
      seller: {
        "@type": "Organization",
        name: YCK_BRAND_NAME,
      },
    },
  };

  if (imageSrc) schema.image = [imageSrc];
  if (seriesEl && seriesEl.textContent.trim()) {
    schema.category = seriesEl.textContent.trim();
  }

  var specs = readProductSpecValues();
  if (specs.length) schema.additionalProperty = specs;

  var script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "yck-product-jsonld";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

var lightboxLastFocus = null;

function getLightboxEl() {
  return document.getElementById("product-lightbox");
}

function getLightboxFocusables() {
  var lightbox = getLightboxEl();
  if (!lightbox) return [];

  return Array.prototype.slice
    .call(
      lightbox.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    )
    .filter(function (el) {
      return !el.disabled && el.getAttribute("aria-hidden") !== "true";
    });
}

function setPageBehindLightboxHidden(hidden) {
  ["header-root", "footer-root"].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (hidden) el.setAttribute("aria-hidden", "true");
    else el.removeAttribute("aria-hidden");
  });

  var main = document.querySelector(".main-content");
  if (!main) return;
  if (hidden) main.setAttribute("aria-hidden", "true");
  else main.removeAttribute("aria-hidden");
}

function trapLightboxTab(e) {
  if (e.key !== "Tab") return;

  var focusables = getLightboxFocusables();
  if (!focusables.length) return;

  var first = focusables[0];
  var last = focusables[focusables.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else if (document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function initLightboxA11y() {
  var lightbox = getLightboxEl();
  if (!lightbox || lightbox.getAttribute("data-yck-a11y") === "1") return;

  if (lightbox.parentNode !== document.body) {
    document.body.appendChild(lightbox);
  }

  var img = document.getElementById("lightbox-image");
  if (img && !lightbox.querySelector(".lightbox-stage")) {
    var stage = document.createElement("div");
    stage.className = "lightbox-stage";
    img.parentNode.insertBefore(stage, img);
    stage.appendChild(img);
  }

  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", productMsg("Ürün görseli büyütme", "تكبير صورة المنتج", "Enlarge product image"));
  lightbox.setAttribute("data-yck-a11y", "1");

  var closeEl = lightbox.querySelector(".lightbox-close");
  if (closeEl && closeEl.tagName !== "BUTTON") {
    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = closeEl.className;
    closeBtn.innerHTML = closeEl.innerHTML;
    closeBtn.setAttribute("aria-label", productMsg("Lightbox kapat", "إغلاق", "Close"));
    closeEl.parentNode.replaceChild(closeBtn, closeEl);
  }

  var prevBtn = document.getElementById("lightbox-prev-btn");
  var nextBtn = document.getElementById("lightbox-next-btn");
  if (prevBtn) prevBtn.setAttribute("aria-label", productMsg("Önceki görsel", "الصورة السابقة", "Previous image"));
  if (nextBtn) nextBtn.setAttribute("aria-label", productMsg("Sonraki görsel", "الصورة التالية", "Next image"));

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeProductLightbox();
  });
}

function openProductLightbox() {
  const lightbox = getLightboxEl();
  const lightboxImg = document.getElementById("lightbox-image");
  const mainImg = document.querySelector(".image-container img");

  if (mainImg && lightbox && lightboxImg) {
    lightboxLastFocus = document.activeElement;
    lightboxImg.src = mainImg.getAttribute("src") || mainImg.src;
    lightboxImg.alt = mainImg.getAttribute("alt") || "";
    lightbox.classList.add("active");
    setPageBehindLightboxHidden(true);
    document.body.classList.add("yck-lightbox-open");

    var focusables = getLightboxFocusables();
    var closeBtn = lightbox.querySelector(".lightbox-close");
    if (closeBtn) closeBtn.focus();
    else if (focusables.length) focusables[0].focus();
  }
}

function closeProductLightbox() {
  const lightbox = getLightboxEl();
  if (lightbox) {
    lightbox.classList.remove("active");
  }
  setPageBehindLightboxHidden(false);
  document.body.classList.remove("yck-lightbox-open");

  if (lightboxLastFocus && typeof lightboxLastFocus.focus === "function") {
    lightboxLastFocus.focus();
  }
  lightboxLastFocus = null;
}

function navigateLightbox(direction) {
  const lightboxImg = document.getElementById("lightbox-image");
  if (!lightboxImg || typeof allProducts === "undefined") {
    return;
  }

  if (direction === "next") {
    currentProductIndex = (currentProductIndex + 1) % allProducts.length;
  } else {
    currentProductIndex =
      (currentProductIndex - 1 + allProducts.length) % allProducts.length;
  }

  const newProduct = allProducts[currentProductIndex];

  if (newProduct && newProduct.image) {
    lightboxImg.style.opacity = "0";
    setTimeout(() => {
      lightboxImg.src = newProduct.image;
      lightboxImg.style.opacity = "1";
    }, 200);
  }
}

document.addEventListener("keydown", function (e) {
  const lightbox = getLightboxEl();
  if (!lightbox || !lightbox.classList.contains("active")) {
    return;
  }
  if (e.key === "Escape") {
    e.preventDefault();
    closeProductLightbox();
  } else if (e.key === "ArrowLeft") {
    navigateLightbox("prev");
  } else if (e.key === "ArrowRight") {
    navigateLightbox("next");
  } else if (e.key === "Tab") {
    trapLightboxTab(e);
  }
});

function applyCompareButtonState(button, isActive) {
  if (!button) return;
  const text = button.querySelector(".compare-text");
  if (isActive) {
    if (text) text.textContent = productMsg("Karşılaştırmadan Çıkar", "إزالة من المقارنة", "Remove from comparison");
    button.style.background = "#e33a3a";
    button.style.color = "white";
    button.style.borderColor = "#e33a3a";
  } else {
    if (text) text.textContent = productMsg("Karşılaştır", "قارن", "Compare");
    button.style.background = "white";
    button.style.color = "#0a0a0a";
    button.style.borderColor = "";
  }
}

function toggleCompare(productId) {
  const compare = window.yigitCompare;
  if (!compare) return;

  const button = event.currentTarget;
  const result = compare.toggle(productId);
  if (result.action === "limited") return;
  applyCompareButtonState(button, result.action === "added");
}

document.addEventListener("DOMContentLoaded", function () {
  injectProductJsonLd();
  initLightboxA11y();

  const compare = window.yigitCompare;
  if (!compare) return;

  const raw = document.body.getAttribute("data-product-id");
  const productId = raw ? parseInt(raw, 10) : 0;
  if (!productId) return;

  const button = document.querySelector(".btn-compare-clean");
  if (compare.getIds().indexOf(productId) !== -1) {
    applyCompareButtonState(button, true);
  }
});
