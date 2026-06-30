/**
 * fiyat-teklifi/index.html — teklif formu (çoklu ürün, il/ilçe, PDF)
 *
 * Bölümler:
 *   1) i18n / yardımcılar
 *   2) Veri yükleme (ürün, konum)
 *   3) Ürün slot UI
 *   4) Form alanları ve doğrulama
 *   5) PDF üretimi
 *   6) E-posta HTML
 *   7) API gönderimi
 *   8) Olay bağlama / init
 */
(function () {
  function isAr() {
    return (document.documentElement.getAttribute("lang") || "").toLowerCase() === "ar";
  }

  function isEn() {
    return (document.documentElement.getAttribute("lang") || "").toLowerCase() === "en";
  }

  function qmsg(tr, ar, en) {
    if (isAr()) return ar;
    if (isEn()) return en || tr;
    return tr;
  }

  function thanksHref() {
    try {
      if (isAr()) {
        return new URL("../شكرا-لكم/index.html", window.location.href).href;
      }
      return new URL("../tesekkurler/index.html", window.location.href).href;
    } catch (_e) {
      if (isAr()) return root() + "ar/شكرا-لكم/index.html";
      if (isEn()) return root() + "en/tesekkurler/index.html";
      return root() + "tesekkurler/index.html";
    }
  }

  var SERIES_ORDER = [
    "luks-kabartma-seri", "luks-pvc-kabartma-seri", "luks-pvc-seri", "elit-laminoks-seri",
    "luks-kompozit-seri", "renkli-saruhan-seri", "luks-saruhan-rustik", "luks-ultralam-seri",
    "klasik-laminoks-seri", "sac-panel-seri", "lazer-seri", "profik-kasali-seri",
    "thermo-ahsap-seri", "granit-tas-yuzey", "nitelikli-seri", "bakir-seri", "yangin-kapisi",
  ];

  var MAX_SLOTS = 4;
  var PDF_LOGO_ASPECT = 64.4 / 179.34;

  var state = {
    products: [],
    locations: null,
    trIlIlce: null,
    slots: [emptySlot()],
    pdfLogoDataUrl: "",
    seriesNamesEn: null,
    productStringsEn: null,
  };

  function loadQuoteI18n() {
    if (isFilePreview() || !isEn() || state.seriesNamesEn) return Promise.resolve();
    var base = root() + "assets/data/i18n/";
    return Promise.all([
      fetch(base + "series-names-en.json").then(function (res) {
        return res.ok ? res.json() : null;
      }),
      fetch(base + "product-strings-en.json").then(function (res) {
        return res.ok ? res.json() : null;
      }),
    ])
      .then(function (pair) {
        if (pair[0]) state.seriesNamesEn = pair[0];
        if (pair[1]) state.productStringsEn = pair[1];
      })
      .catch(function () {});
  }

  function seriesDisplayName(slug, fallback) {
    if (isEn() && state.seriesNamesEn && state.seriesNamesEn[slug]) {
      return state.seriesNamesEn[slug].title || fallback;
    }
    return fallback;
  }

  function productDisplayName(p) {
    if (!p) return "";
    var name = p.name || "";
    if (isEn() && state.productStringsEn && state.productStringsEn.names) {
      return state.productStringsEn.names[name] || name;
    }
    return name;
  }

  function openDirLabel(slot) {
    if (slot.openRight) return qmsg("Sağa açılır", "يفتح لليمين", "Opens right");
    if (slot.openLeft) return qmsg("Sola açılır", "يفتح لليسار", "Opens left");
    return qmsg("Belirtilmedi", "غير محدد", "Not specified");
  }

  function emptySlot() {
    return {
      seriesSlug: "",
      productId: "",
      qty: 1,
      openRight: false,
      openLeft: false,
    };
  }

  function root() {
    return document.body.getAttribute("data-root") || "";
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function $(id) {
    return document.getElementById(id);
  }

  function getCompareIds() {
    if (window.yigitCompare) return window.yigitCompare.getIds();
    try {
      return JSON.parse(localStorage.getItem("yck_compare") || "[]");
    } catch (e) {
      return [];
    }
  }

  function loadProducts() {
    if (window.YCK_PRODUCTS) return Promise.resolve(window.YCK_PRODUCTS);
    if (window.location.protocol === "file:") return Promise.reject(new Error("products-data required"));
    return fetch(root() + "assets/data/products.json").then(function (res) {
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    });
  }

  function loadLocations() {
    if (window.YCK_LOCATIONS) return Promise.resolve(window.YCK_LOCATIONS);
    if (window.location.protocol === "file:") return Promise.resolve(null);
    return fetch(root() + "assets/data/locations.json")
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .catch(function () {
        return null;
      });
  }

  function loadTrIlIlce() {
    if (window.YCK_TR_IL_ILCE) return Promise.resolve(window.YCK_TR_IL_ILCE);
    if (window.location.protocol === "file:") return Promise.resolve(null);
    return fetch(root() + "assets/data/tr-il-ilce.json")
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .catch(function () {
        return null;
      });
  }

  function seriesMap(products) {
    var map = {};
    products.forEach(function (p) {
      if (p.seriesSlug) map[p.seriesSlug] = seriesDisplayName(p.seriesSlug, p.seriesName || p.seriesSlug);
    });
    return map;
  }

  function seriesOptionsHtml(products, selected) {
    var map = seriesMap(products);
    var html = '<option value="">' + qmsg("Seri seçin", "اختر السلسلة", "Select series") + "</option>";
    SERIES_ORDER.forEach(function (slug) {
      if (!map[slug]) return;
      html +=
        '<option value="' +
        esc(slug) +
        '"' +
        (selected === slug ? " selected" : "") +
        ">" +
        esc(map[slug]) +
        "</option>";
    });
    Object.keys(map).forEach(function (slug) {
      if (SERIES_ORDER.indexOf(slug) !== -1) return;
      html +=
        '<option value="' +
        esc(slug) +
        '"' +
        (selected === slug ? " selected" : "") +
        ">" +
        esc(map[slug]) +
        "</option>";
    });
    return html;
  }

  function productsBySeries(products, slug) {
    return products
      .filter(function (p) {
        return p.seriesSlug === slug;
      })
      .sort(function (a, b) {
        return String(a.code || "").localeCompare(String(b.code || ""), "tr");
      });
  }

  function productOptionsHtml(products, seriesSlug, selectedId) {
    if (!seriesSlug) {
      return '<option value="">' + qmsg("Önce seri seçin", "اختر السلسلة أولاً", "Select series first") + "</option>";
    }
    var html = '<option value="">' + qmsg("Kod seçin", "اختر الرمز", "Select code") + "</option>";
    productsBySeries(products, seriesSlug).forEach(function (p) {
      html +=
        '<option value="' +
        esc(String(p.id)) +
        '"' +
        (String(selectedId) === String(p.id) ? " selected" : "") +
        ">" +
        esc(p.code || "") +
        " — " +
        esc((p.name || "").slice(0, 40)) +
        "</option>";
    });
    return html;
  }

  function findProduct(products, id) {
    var n = Number(id);
    for (var i = 0; i < products.length; i++) {
      if (Number(products[i].id) === n) return products[i];
    }
    return null;
  }

  function slotProduct(products, slot) {
    return slot.productId ? findProduct(products, slot.productId) : null;
  }

  function mediaHtml(product) {
    if (!product) {
      return (
        '<div class="quote-product-slot__placeholder" aria-hidden="true">' +
        '<span class="quote-product-slot__plus">+</span>' +
        '<span class="quote-product-slot__placeholder-text">' + qmsg("Ürün seçin", "اختر المنتج", "Select product") + "</span></div>"
      );
    }
    var img = product.image ? assetAbsUrl(root() + product.image) : "";
    return img
      ? '<img src="' + esc(img) + '" alt="" width="140" height="175" loading="lazy" decoding="async" />'
      : '<div class="quote-product-slot__placeholder"><span class="quote-product-slot__plus">+</span></div>';
  }

  function renderProductSlots(products) {
    var mount = $("quote-products-slots");
    if (!mount) return;

    mount.innerHTML = state.slots
      .map(function (slot, index) {
        var product = slotProduct(products, slot);
        var n = index + 1;
        return (
          '<article class="quote-product-slot" data-slot-index="' +
          index +
          '">' +
          '<p class="quote-product-slot__label">' + qmsg("Ürün ", "منتج ", "Product ") +
          n +
          "</p>" +
          '<div class="quote-product-slot__selects">' +
          '<label class="sr-only" for="quote-slot-series-' +
          index +
          '">' +
          qmsg("Seri", "السلسلة", "Series") +
          "</label>" +
          '<select id="quote-slot-series-' +
          index +
          '" class="quote-slot-series" data-slot-index="' +
          index +
          '">' +
          seriesOptionsHtml(products, slot.seriesSlug) +
          "</select>" +
          '<label class="sr-only" for="quote-slot-product-' +
          index +
          '">' + qmsg("Ürün kodu", "رمز المنتج", "Product code") + "</label>" +
          '<select id="quote-slot-product-' +
          index +
          '" class="quote-slot-product" data-slot-index="' +
          index +
          '"' +
          (slot.seriesSlug ? "" : " disabled") +
          ">" +
          productOptionsHtml(products, slot.seriesSlug, slot.productId) +
          "</select>" +
          '<div class="quote-product-slot__qty">' +
          '<label for="quote-slot-qty-' +
          index +
          '">' +
          qmsg("Adet", "الكمية", "Qty") +
          "</label>" +
          '<input id="quote-slot-qty-' +
          index +
          '" class="quote-slot-qty" type="number" min="1" max="999" value="' +
          esc(String(slot.qty || 1)) +
          '" data-slot-index="' +
          index +
          '" />' +
          "</div>" +
          "</div>" +
          '<div class="quote-product-slot__media">' +
          mediaHtml(product) +
          "</div>" +
          '<p class="quote-product-slot__code">' +
          esc(product ? product.code || "—" : "—") +
          "</p>" +
          '<div class="quote-open-toggles" role="group" aria-label="' + qmsg("Açılım yönü", "اتجاه الفتح", "Opening direction") + '">' +
          '<label class="quote-open-toggle' +
          (slot.openRight ? " is-checked" : "") +
          '">' +
          '<input type="checkbox" class="quote-slot-open-right" data-slot-index="' +
          index +
          '"' +
          (slot.openRight ? " checked" : "") +
          " />" +
          "<span>" + qmsg("Sağa açılır", "يفتح لليمين", "Opens right") + "</span></label>" +
          '<label class="quote-open-toggle' +
          (slot.openLeft ? " is-checked" : "") +
          '">' +
          '<input type="checkbox" class="quote-slot-open-left" data-slot-index="' +
          index +
          '"' +
          (slot.openLeft ? " checked" : "") +
          " />" +
          "<span>" + qmsg("Sola açılır", "يفتح لليسار", "Opens left") + "</span></label>" +
          "</div></article>"
        );
      })
      .join("");

    var addBtn = $("quote-add-product");
    var removeBtn = $("quote-remove-product");
    if (addBtn) addBtn.disabled = state.slots.length >= MAX_SLOTS;
    if (removeBtn) removeBtn.disabled = state.slots.length <= 1;

    syncHiddenSummary(products);
  }

  function readSlotFromDom(index) {
    var slot = state.slots[index];
    if (!slot) return;
    var seriesEl = document.getElementById("quote-slot-series-" + index);
    var productEl = document.getElementById("quote-slot-product-" + index);
    var qtyEl = document.getElementById("quote-slot-qty-" + index);
    var rightEl = document.querySelector('.quote-slot-open-right[data-slot-index="' + index + '"]');
    var leftEl = document.querySelector('.quote-slot-open-left[data-slot-index="' + index + '"]');
    if (seriesEl) slot.seriesSlug = seriesEl.value;
    if (productEl) slot.productId = productEl.value;
    if (qtyEl) slot.qty = Math.max(1, Number(qtyEl.value) || 1);
    if (rightEl) slot.openRight = rightEl.checked;
    if (leftEl) slot.openLeft = leftEl.checked;
  }

  function setSlotFromProduct(products, index, product) {
    if (!product) return;
    state.slots[index] = state.slots[index] || emptySlot();
    state.slots[index].seriesSlug = product.seriesSlug || "";
    state.slots[index].productId = String(product.id);
    state.slots[index].qty = state.slots[index].qty || 1;
  }

  function syncAllSlotsFromDom() {
    state.slots.forEach(function (_, i) {
      readSlotFromDom(i);
    });
  }

  function addSlot() {
    if (state.slots.length >= MAX_SLOTS) return;
    syncAllSlotsFromDom();
    state.slots.push(emptySlot());
    renderProductSlots(state.products);
  }

  function removeSlot() {
    if (state.slots.length <= 1) return;
    syncAllSlotsFromDom();
    state.slots.pop();
    renderProductSlots(state.products);
  }

  function collectSlotLines(products) {
    return state.slots
      .map(function (slot, i) {
        var p = slotProduct(products, slot);
        if (!p) return "";
        var openTxt = "";
        if (slot.openRight || slot.openLeft) openTxt = " (" + openDirLabel(slot) + ")";
        return (
          qmsg("Ürün ", "منتج ", "Product ") +
          (i + 1) +
          ": " +
          (p.code || "") +
          " — " +
          seriesDisplayName(p.seriesSlug, p.seriesName || "") +
          ", " +
          qmsg("adet ", "الكمية ", "qty ") +
          (slot.qty || 1) +
          openTxt
        );
      })
      .filter(Boolean);
  }

  function countryLabel(country) {
    if (!isAr() || !country || !country.code) return country.name;
    try {
      if (!countryLabel._dn) {
        countryLabel._dn = new Intl.DisplayNames(["ar"], { type: "region" });
      }
      return countryLabel._dn.of(country.code) || country.name;
    } catch (e) {
      return country.name;
    }
  }

  function cityLabel(name) {
    if (!isAr()) return name;
    if (name === "Diğer") return "أخرى";
    return name;
  }

  function syncHiddenSummary(products) {
    var hidden = $("quote-hidden-summary");
    if (hidden) hidden.value = collectSlotLines(products).join("\n");
  }

  function populateCountries(locData) {
    var sel = $("quote-country");
    if (!sel || !locData || !locData.countries) return;
    state.locations = locData;
    sel.innerHTML = locData.countries
      .map(function (c) {
        return '<option value="' + esc(c.code) + '">' + esc(countryLabel(c)) + "</option>";
      })
      .join("");
    var initial = locData.defaultCountry || "TR";
    if (isAr() && locData.countries.some(function (c) { return c.code === "SA"; })) {
      initial = "SA";
    }
    sel.value = initial;
    toggleLocationMode(sel.value);
  }

  function populateTrProvinces(trData) {
    if (!trData || !trData.provinces) return;
    state.trIlIlce = trData;
    var sel = $("quote-province");
    if (!sel) return;
    sel.innerHTML =
      '<option value="">' + qmsg("İl seçin", "اختر المحافظة", "Select province") + "</option>" +
      trData.provinces
        .map(function (p) {
          return '<option value="' + esc(String(p.id)) + '">' + esc(p.name) + "</option>";
        })
        .join("");
  }

  function populateTrDistricts(provinceId) {
    var sel = $("quote-district");
    if (!sel || !state.trIlIlce) return;
    var list = (state.trIlIlce.districtsByProvinceId || {})[String(provinceId)] || [];
    sel.innerHTML =
      '<option value="">' + qmsg("İlçe seçin", "اختر المنطقة", "Select district") + "</option>" +
      list
        .map(function (name) {
          return '<option value="' + esc(name) + '">' + esc(name) + "</option>";
        })
        .join("");
  }

  function populateIntlCities(countryCode) {
    var citySel = $("quote-city");
    var otherWrap = $("quote-city-other-wrap");
    if (!citySel || !state.locations) return;
    var country = state.locations.countries.find(function (c) {
      return c.code === countryCode;
    });
    if (!country) {
      citySel.innerHTML = '<option value="">—</option>';
      return;
    }
    citySel.innerHTML =
      '<option value="">' + qmsg("Şehir seçin", "اختر المدينة", "Select city") + "</option>" +
      country.cities
        .map(function (city) {
          var val = city === "Diğer" ? "__other__" : city;
          return '<option value="' + esc(val) + '">' + esc(cityLabel(city)) + "</option>";
        })
        .join("");
    if (otherWrap) otherWrap.classList.remove("is-visible");
  }

  function toggleLocationMode(countryCode) {
    var tr = $("quote-location-tr");
    var intl = $("quote-location-intl");
    var isTr = countryCode === "TR";
    if (tr) tr.hidden = !isTr;
    if (intl) intl.hidden = isTr;
    if (isTr) {
      populateTrDistricts("");
    } else {
      populateIntlCities(countryCode);
    }
  }

  function onCityChange() {
    var citySel = $("quote-city");
    var otherWrap = $("quote-city-other-wrap");
    if (!citySel || !otherWrap) return;
    if (citySel.value === "__other__") otherWrap.classList.add("is-visible");
    else {
      otherWrap.classList.remove("is-visible");
      var other = $("quote-city-other");
      if (other) other.value = "";
    }
  }

  function resolvedCountryName() {
    var sel = $("quote-country");
    if (!sel || !state.locations) return "";
    var c = state.locations.countries.find(function (x) {
      return x.code === sel.value;
    });
    return c ? c.name : sel.value;
  }

  function resolvedLocationLabel() {
    var country = $("quote-country");
    if (country && country.value === "TR") {
      var il = $("quote-province");
      var ilce = $("quote-district");
      var ilName = il && il.selectedIndex > 0 ? il.options[il.selectedIndex].text : "";
      var ilceName = ilce && ilce.value ? ilce.value : "";
      if (ilName && ilceName) return ilName + " / " + ilceName;
      return ilName || ilceName;
    }
    var citySel = $("quote-city");
    if (!citySel || !citySel.value) return "";
    if (citySel.value === "__other__") {
      var o = $("quote-city-other");
      return o ? o.value.trim() : "";
    }
    return citySel.value;
  }

  function fieldVal(id) {
    var el = $(id);
    return el ? el.value.trim() : "";
  }

  function collectFormData(products) {
    return {
      slots: state.slots.map(function (slot, i) {
        var p = slotProduct(products, slot);
        return {
          index: i + 1,
          product: p,
          qty: slot.qty || 1,
          openRight: slot.openRight,
          openLeft: slot.openLeft,
          pdfImageDataUrl: slot.pdfImageDataUrl || "",
        };
      }),
      slotLines: collectSlotLines(products),
      name: fieldVal("quote-name"),
      phone: fieldVal("quote-phone"),
      email: fieldVal("quote-email"),
      company: fieldVal("quote-company"),
      country: resolvedCountryName(),
      location: resolvedLocationLabel(),
      message: fieldVal("quote-message"),
      color: fieldVal("quote-color"),
      pattern: fieldVal("quote-pattern"),
      size: fieldVal("quote-size"),
      frame: fieldVal("quote-frame"),
      panel: fieldVal("quote-panel"),
      handle: fieldVal("quote-handle"),
      lock: fieldVal("quote-lock"),
      peephole: fieldVal("quote-peephole"),
      hinge: fieldVal("quote-hinge"),
      fire: fieldVal("quote-fire"),
    };
  }

  function validateQuoteForm(products) {
    var form = $("quote-form");
    if (!form) return false;
    var d = collectFormData(products);
    var ok = true;
    var first = null;

    function fail(id, msg) {
      var el = $(id);
      if (!el) return;
      ok = false;
      if (!first) first = el;
      var wrap = el.closest(".form-field") || el.closest(".quote-products-toolbar");
      if (wrap) {
        wrap.classList.add("form-field--invalid");
        var err = wrap.querySelector(".form-field__error");
        if (!err) {
          err = document.createElement("span");
          err.className = "form-field__error";
          err.setAttribute("role", "alert");
          wrap.appendChild(err);
        }
        err.textContent = msg;
      }
      if (el.setAttribute) el.setAttribute("aria-invalid", "true");
    }

    form.querySelectorAll(".form-field--invalid").forEach(function (w) {
      w.classList.remove("form-field--invalid");
      var e = w.querySelector(".form-field__error");
      if (e) e.remove();
    });

    if (!d.name) fail("quote-name", qmsg("Ad soyad zorunludur.", "الاسم الكامل إلزامي.", "Full name is required."));
    if (!d.phone || d.phone.replace(/\D/g, "").length < 7) {
      fail("quote-phone", qmsg("Geçerli bir telefon numarası girin.", "يرجى إدخال رقم هاتف صالح.", "Enter a valid phone number."));
    }
    if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) {
      fail("quote-email", qmsg("Geçerli bir e-posta adresi girin.", "يرجى إدخال بريد إلكتروني صالح.", "Enter a valid email address."));
    }

    if (!d.slotLines.length) fail("quote-add-product", qmsg("En az bir ürün seçin.", "يرجى اختيار منتج واحد على الأقل.", "Select at least one product."));

    var countrySel = $("quote-country");
    if (!countrySel || !countrySel.value) fail("quote-country", qmsg("Ülke seçin.", "يرجى اختيار البلد.", "Select a country."));
    else if (countrySel.value === "TR") {
      if (!$("quote-province") || !$("quote-province").value) {
        fail("quote-province", qmsg("İl seçin.", "يرجى اختيار المحافظة.", "Select a province."));
      }
      if (!$("quote-district") || !$("quote-district").value) {
        fail("quote-district", qmsg("İlçe seçin.", "يرجى اختيار المنطقة.", "Select a district."));
      }
    } else {
      if (!resolvedLocationLabel()) {
        fail("quote-city", qmsg("Şehir seçin veya belirtin.", "يرجى اختيار المدينة أو كتابتها.", "Select or enter a city."));
      }
      if ($("quote-city").value === "__other__" && !fieldVal("quote-city-other")) {
        fail("quote-city-other", qmsg("Şehir adını yazın.", "يرجى كتابة اسم المدينة.", "Enter the city name."));
      }
    }

    var kvkk = $("quote-kvkk");
    if (!kvkk || !kvkk.checked) {
      ok = false;
      if (!first && kvkk) first = kvkk;
      var kvkkWrap = $("quote-kvkk-wrap");
      if (kvkkWrap && !kvkkWrap.querySelector(".form-field__error")) {
        var kerr = document.createElement("span");
        kerr.className = "form-field__error";
        kerr.setAttribute("role", "alert");
        kerr.textContent = qmsg("KVKK onayı zorunludur.", "يجب الموافقة على إشعار حماية البيانات.", "Privacy notice consent is required.");
        kvkkWrap.appendChild(kerr);
      }
    }

    if (first) first.focus();
    return ok;
  }

  /* ——— 5) PDF üretimi ——— */
  function ensurePdfLogoDataUrl() {
    if (state.pdfLogoDataUrl) return Promise.resolve(state.pdfLogoDataUrl);
    var svg = window.YCK_PDF_LOGO_SVG || "";
    if (!svg) return Promise.resolve("");
    var uri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    return new Promise(function (resolve) {
      var loader = new Image();
      loader.onload = function () {
        try {
          var w = 358;
          var h = Math.max(1, Math.round(w * PDF_LOGO_ASPECT));
          var canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          canvas.getContext("2d").drawImage(loader, 0, 0, w, h);
          state.pdfLogoDataUrl = canvas.toDataURL("image/png");
          resolve(state.pdfLogoDataUrl);
        } catch (e) {
          resolve("");
        }
      };
      loader.onerror = function () {
        resolve("");
      };
      loader.src = uri;
    });
  }

  function pdfLogoHtml(className) {
    var dataUrl = state.pdfLogoDataUrl || "";
    if (!dataUrl) {
      return '<span class="' + className + ' quote-pdf-doc__logo-fallback">Yiğit Çelik Kapı</span>';
    }
    return (
      '<div class="' +
      className +
      '" aria-hidden="true"><img class="quote-pdf-doc__logo-image" src="' +
      esc(dataUrl) +
      '" alt="" /></div>'
    );
  }

  function pdfBlock(title, bodyHtml) {
    return (
      '<section class="quote-pdf-block">' +
      '<div class="quote-pdf-block__head">' +
      esc(title) +
      "</div>" +
      '<div class="quote-pdf-block__body">' +
      bodyHtml +
      "</div></section>"
    );
  }

  function pdfField(label, value) {
    if (!value) return "";
    return (
      '<div class="quote-pdf-field">' +
      '<span class="quote-pdf-field__label">' +
      esc(label) +
      "</span>" +
      '<span class="quote-pdf-field__value">' +
      esc(value) +
      "</span></div>"
    );
  }

  function pdfMetaItem(label, value) {
    return (
      "<div class=\"quote-pdf-card__meta-row\"><dt>" +
      esc(label) +
      "</dt><dd>" +
      esc(value || "—") +
      "</dd></div>"
    );
  }

  function pdfProductCards(data) {
    var cards = [];
    data.slots.forEach(function (slot, index) {
      if (!slot.product) return;
      var p = slot.product;
      var imgSrc = slot.pdfImageDataUrl || (p.image ? absUrl(root() + p.image) : "");
      var openDir = openDirLabel(slot);
      var imgHtml = imgSrc
        ? '<img class="quote-pdf-card__img" data-slot-index="' +
          index +
          '" src="' +
          esc(imgSrc) +
          '" alt="" />'
        : '<div class="quote-pdf-card__img-placeholder">' + qmsg("Görsel yok", "لا توجد صورة", "No image") + "</div>";
      cards.push(
        '<article class="quote-pdf-card">' +
        '<div class="quote-pdf-card__badge">' +
        qmsg("Ürün ", "منتج ", "Product ") +
        (cards.length + 1) +
        "</div>" +
        '<div class="quote-pdf-card__media">' +
        imgHtml +
        "</div>" +
        '<div class="quote-pdf-card__body">' +
        '<p class="quote-pdf-card__code">' +
        esc(p.code || "—") +
        "</p>" +
        '<p class="quote-pdf-card__series">' +
        esc(seriesDisplayName(p.seriesSlug, p.seriesName || "")) +
        "</p>" +
        '<dl class="quote-pdf-card__meta">' +
        pdfMetaItem(qmsg("Adet", "الكمية", "Qty"), String(slot.qty || 1)) +
        pdfMetaItem(qmsg("Açılım", "اتجاه الفتح", "Opening"), openDir) +
        "</dl></div></article>"
      );
    });
    return cards.join("");
  }

  function pdfCustomFields(data) {
    return [
      [qmsg("Renk", "اللون", "Colour"), data.color],
      [qmsg("Desen", "النقش", "Pattern"), data.pattern],
      [qmsg("Ölçü", "المقاس", "Size"), data.size],
      [qmsg("Kasa tipi", "نوع الإطار", "Frame type"), data.frame],
      [qmsg("Panel tipi", "نوع اللوح", "Panel type"), data.panel],
      [qmsg("Kol", "المقبض", "Handle"), data.handle],
      [qmsg("Kilit", "القفل", "Lock"), data.lock],
      [qmsg("Dürbün", "العين السحرية", "Peephole"), data.peephole],
      [qmsg("Menteşe", "المفصلة", "Hinge"), data.hinge],
      [qmsg("Yangın dayanımı", "مقاومة الحريق", "Fire rating"), data.fire],
      [qmsg("Özel istekler", "طلبات خاصة", "Special requests"), data.message],
    ]
      .filter(function (row) {
        return row[1];
      })
      .map(function (row) {
        return pdfField(row[0], row[1]);
      })
      .join("");
  }

  function absUrl(url) {
    try {
      return new URL(url, window.location.href).href;
    } catch (e) {
      return url;
    }
  }

  function findFormImageBySrc(src) {
    var target = "";
    try {
      target = new URL(src, window.location.href).href;
    } catch (e) {
      target = src;
    }
    var imgs = document.querySelectorAll(".quote-product-slot__media img");
    for (var i = 0; i < imgs.length; i++) {
      try {
        if (new URL(imgs[i].src, window.location.href).href === target) return imgs[i];
      } catch (e2) {
        if (imgs[i].src === src) return imgs[i];
      }
    }
    return null;
  }

  function imageElementToDataUrl(imgEl) {
    if (!imgEl || !imgEl.complete || !imgEl.naturalWidth) return "";
    try {
      var w = imgEl.naturalWidth;
      var h = imgEl.naturalHeight;
      var max = 900;
      if (w > max || h > max) {
        if (w >= h) {
          h = Math.max(1, Math.round((h * max) / w));
          w = max;
        } else {
          w = Math.max(1, Math.round((w * max) / h));
          h = max;
        }
      }
      var canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(imgEl, 0, 0, w, h);
      return canvas.toDataURL("image/jpeg", 0.88);
    } catch (e) {
      return "";
    }
  }

  function xhrBlobToDataUrl(url) {
    return new Promise(function (resolve) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", absUrl(url), true);
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
          blobToDataUrl(xhr.response).then(resolve);
        } else {
          resolve("");
        }
      };
      xhr.onerror = function () {
        resolve("");
      };
      xhr.send();
    });
  }

  function waitForSlotImage(index) {
    return new Promise(function (resolve) {
      var slotImg = document.querySelector(
        '.quote-product-slot[data-slot-index="' + index + '"] .quote-product-slot__media img'
      );
      if (!slotImg) {
        resolve(null);
        return;
      }
      if (slotImg.complete) {
        resolve(slotImg.naturalWidth > 0 ? slotImg : null);
        return;
      }
      var done = false;
      function finish(img) {
        if (done) return;
        done = true;
        resolve(img);
      }
      slotImg.addEventListener(
        "load",
        function () {
          finish(slotImg.naturalWidth > 0 ? slotImg : null);
        },
        { once: true }
      );
      slotImg.addEventListener(
        "error",
        function () {
          finish(null);
        },
        { once: true }
      );
      setTimeout(function () {
        finish(slotImg.naturalWidth > 0 ? slotImg : null);
      }, 6000);
    });
  }

  function resolveSlotImageDataUrl(index, product) {
    return waitForSlotImage(index).then(function (slotImg) {
      var fromDom = imageElementToDataUrl(slotImg);
      if (fromDom) return fromDom;

      if (!product || !product.image) return "";

      if (window.location.protocol === "file:") {
        return "";
      }

      var url = absUrl(root() + product.image);
      return xhrBlobToDataUrl(url).then(function (dataUrl) {
        if (dataUrl) return dataUrl;
        return urlToDataUrl(url);
      });
    });
  }

  function resolveAllSlotImages(products) {
    return Promise.all(
      state.slots.map(function (slot, index) {
        var product = slotProduct(products, slot);
        if (!product) {
          slot.pdfImageDataUrl = "";
          return Promise.resolve();
        }
        return resolveSlotImageDataUrl(index, product).then(function (dataUrl) {
          slot.pdfImageDataUrl = dataUrl || "";
        });
      })
    );
  }

  function blobToDataUrl(blob) {
    return new Promise(function (resolve) {
      if (!blob) {
        resolve("");
        return;
      }
      var reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result || "");
      };
      reader.onerror = function () {
        resolve("");
      };
      reader.readAsDataURL(blob);
    });
  }

  function waitForOneImage(img) {
    if (!img) return Promise.resolve();
    if (img.complete) return Promise.resolve();
    return new Promise(function (resolve) {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
      setTimeout(resolve, 6000);
    });
  }

  function promiseWithTimeout(promise, ms, fallback) {
    return new Promise(function (resolve) {
      var settled = false;
      promise
        .then(function (value) {
          if (settled) return;
          settled = true;
          resolve(value);
        })
        .catch(function () {
          if (settled) return;
          settled = true;
          resolve(fallback);
        });
      setTimeout(function () {
        if (settled) return;
        settled = true;
        resolve(fallback);
      }, ms);
    });
  }

  function urlToDataUrl(url) {
    return new Promise(function (resolve) {
      if (!url || url.indexOf("data:") === 0) {
        resolve(url || "");
        return;
      }
      var loader = new Image();
      loader.onload = function () {
        resolve(imageElementToDataUrl(loader) || "");
      };
      loader.onerror = function () {
        resolve("");
      };
      loader.src = url;
    });
  }

  function replacePdfImageWithPlaceholder(img) {
    var wrap = img.closest(".quote-pdf-card__media");
    if (wrap) {
      wrap.innerHTML = '<div class="quote-pdf-card__img-placeholder">Görsel yüklenemedi</div>';
    }
  }

  function applyPdfImageDataUrl(img, dataUrl) {
    if (dataUrl) {
      img.setAttribute("src", dataUrl);
      img.src = dataUrl;
    }
    return waitForOneImage(img);
  }

  function inlinePdfImage(img) {
    var src = img.getAttribute("src") || img.src || "";
    if (!src) return Promise.resolve();
    if (src.indexOf("data:image/jpeg") === 0 || src.indexOf("data:image/png") === 0 || src.indexOf("data:image/webp") === 0) {
      return Promise.resolve();
    }
    if (src.indexOf("data:") === 0) {
      return urlToDataUrl(src).then(function (dataUrl) {
        return applyPdfImageDataUrl(img, dataUrl || "");
      });
    }

    var slotIdx = img.getAttribute("data-slot-index");
    if (slotIdx !== null && slotIdx !== "") {
      var slotImg = document.querySelector(
        '.quote-product-slot[data-slot-index="' + slotIdx + '"] .quote-product-slot__media img'
      );
      var slotDataUrl = imageElementToDataUrl(slotImg);
      if (slotDataUrl) return applyPdfImageDataUrl(img, slotDataUrl);
    }

    var formImg = findFormImageBySrc(src);
    var formDataUrl = imageElementToDataUrl(formImg);
    if (formDataUrl) return applyPdfImageDataUrl(img, formDataUrl);

    return urlToDataUrl(src)
      .then(function (dataUrl) {
        if (dataUrl) return applyPdfImageDataUrl(img, dataUrl);
        if (window.location.protocol === "file:") return applyPdfImageDataUrl(img, "");
        return fetch(src)
          .then(function (res) {
            return res.ok ? res.blob() : null;
          })
          .then(blobToDataUrl)
          .then(function (fetched) {
            return applyPdfImageDataUrl(img, fetched);
          });
      })
      .catch(function () {
        return applyPdfImageDataUrl(img, "");
      });
  }

  function preparePdfImages(container) {
    var imgs = container.querySelectorAll("img");
    if (!imgs.length) return Promise.resolve();
    return Promise.all(
      Array.prototype.map.call(imgs, function (img) {
        if (img.classList.contains("quote-pdf-doc__logo-image")) {
          return Promise.resolve();
        }
        var src = img.getAttribute("src") || img.src || "";
        if (src.indexOf("data:image/jpeg") === 0 || src.indexOf("data:image/png") === 0) {
          return Promise.resolve();
        }
        return inlinePdfImage(img).catch(function () {
          return waitForOneImage(img);
        });
      })
    );
  }

  function waitForImages(container) {
    var imgs = container.querySelectorAll("img");
    if (!imgs.length) return Promise.resolve();
    return Promise.all(
      Array.prototype.map.call(imgs, function (img) {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise(function (resolve) {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });
      })
    );
  }

  function canvasToPdf(pdf, canvas) {
    var margin = 8;
    var pageW = pdf.internal.pageSize.getWidth();
    var pageH = pdf.internal.pageSize.getHeight();
    var usableW = pageW - margin * 2;
    var usableH = pageH - margin * 2;
    var imgW = usableW;
    var imgH = (canvas.height * imgW) / canvas.width;
    var jpeg;
    try {
      jpeg = canvas.toDataURL("image/jpeg", 0.85);
    } catch (e) {
      jpeg = canvas.toDataURL("image/png");
    }
    var imgFormat = jpeg.indexOf("data:image/png") === 0 ? "PNG" : "JPEG";

    if (imgH <= usableH) {
      pdf.addImage(jpeg, imgFormat, margin, margin, imgW, imgH);
      return;
    }

    var sliceHeightPx = Math.max(1, Math.floor((usableH * canvas.width) / imgW));
    var srcY = 0;
    var pageIndex = 0;
    var guard = 0;
    while (srcY < canvas.height && guard < 20) {
      guard++;
      if (pageIndex > 0) pdf.addPage();
      var sliceH = Math.min(sliceHeightPx, canvas.height - srcY);
      var pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceH;
      var ctx = pageCanvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, sliceH);
      ctx.drawImage(canvas, 0, srcY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
      var sliceImgH = (sliceH * imgW) / canvas.width;
      var sliceData;
      try {
        sliceData = pageCanvas.toDataURL("image/jpeg", 0.85);
        pdf.addImage(sliceData, "JPEG", margin, margin, imgW, sliceImgH);
      } catch (e2) {
        sliceData = pageCanvas.toDataURL("image/png");
        pdf.addImage(sliceData, "PNG", margin, margin, imgW, sliceImgH);
      }
      srcY += sliceH;
      pageIndex++;
    }
  }

  function captureSheetToCanvas(sheet, h2c) {
    var target = sheet.querySelector(".quote-pdf-doc") || sheet;
    var baseOpts = {
      logging: false,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
    };
    return h2c(target, Object.assign({ scale: 1.25 }, baseOpts)).catch(function () {
      return h2c(target, Object.assign({ scale: 1 }, baseOpts));
    });
  }

  function buildPdfSheet(data) {
    var sheet = $("quote-pdf-sheet");
    if (!sheet) return null;

    var now = new Date();
    var dateStr =
      ("0" + now.getDate()).slice(-2) +
      "." +
      ("0" + (now.getMonth() + 1)).slice(-2) +
      "." +
      now.getFullYear();

    var productsHtml = pdfProductCards(data);
    if (!productsHtml) {
      productsHtml = '<p class="quote-pdf-empty">' + qmsg("Ürün seçilmedi", "لم يُختر منتج", "No product selected") + "</p>";
    }

    var contactHtml =
      pdfField(qmsg("Ad soyad", "الاسم الكامل", "Full name"), data.name) +
      pdfField(qmsg("Telefon", "الهاتف", "Phone"), data.phone) +
      pdfField(qmsg("E-posta", "البريد الإلكتروني", "Email"), data.email) +
      pdfField(qmsg("Firma", "الشركة", "Company"), data.company) +
      pdfField(qmsg("Ülke", "البلد", "Country"), data.country) +
      pdfField(qmsg("Konum", "الموقع", "Location"), data.location);

    var customHtml = pdfCustomFields(data);
    var customBlock = customHtml
      ? pdfBlock(qmsg("Kişiselleştirme", "التخصيص", "Customization"), '<div class="quote-pdf-fields quote-pdf-fields--custom">' + customHtml + "</div>")
      : "";

    sheet.innerHTML =
      '<div class="quote-pdf-doc">' +
      '<header class="quote-pdf-doc__header">' +
      pdfLogoHtml("quote-pdf-doc__logo") +
      '<div class="quote-pdf-doc__header-main">' +
      "<h1>" + qmsg("Fiyat Teklifi Talep Formu", "نموذج طلب عرض سعر", "Quote Request Form") + "</h1>" +
      '<p class="quote-pdf-doc__date">' + qmsg("Talep tarihi: ", "تاريخ الطلب: ", "Request date: ") +
      esc(dateStr) +
      "</p></div></header>" +
      pdfBlock(qmsg("Seçilen ürünler", "المنتجات المحددة", "Selected products"), '<div class="quote-pdf-products">' + productsHtml + "</div>") +
      pdfBlock(qmsg("İletişim bilgileri", "معلومات الاتصال", "Contact details"), '<div class="quote-pdf-fields">' + contactHtml + "</div>") +
      customBlock +
      '<footer class="quote-pdf-doc__footer">' +
      pdfLogoHtml("quote-pdf-doc__footer-logo") +
      "<p>www.yigitcelikkapi.com.tr · +90 352 311 55 41 · info@yigitcelikkapi.com.tr</p>" +
      '<p class="quote-pdf-doc__footnote">' +
      qmsg(
        "Bu belge müşteri talep formunun özetidir; bağlayıcı fiyat teklifi niteliği taşımaz.",
        "هذا المستند ملخص لنموذج طلب العميل ولا يُعد عرض سعر ملزماً.",
        "This document is a summary of the customer request form and is not a binding price quote."
      ) +
      "</p>" +
      "</footer></div>";
    return sheet;
  }

  /* ——— 6) E-posta HTML ——— */
  function siteBaseUrl() {
    if (window.location.protocol === "file:") return "https://www.yigitcelikkapi.com.tr";
    return window.location.origin.replace(/\/$/, "");
  }

  function assetAbsUrl(rel) {
    var path = String(rel || "")
      .replace(/^(\.\.\/)+/, "")
      .replace(/^\/+/, "");
    if (!path) return "";
    return siteBaseUrl() + "/" + path;
  }

  function emailProductImageSrc(slot, product) {
    if (product && product.image) return assetAbsUrl(root() + product.image);
    return "";
  }

  function emailSection(title, bodyHtml) {
    return (
      '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px;border:1px solid #e5e7eb;border-radius:8px;border-collapse:separate;overflow:hidden;background:#ffffff;">' +
      '<tr><td style="padding:8px 14px;background:#f3f4f6;border-bottom:1px solid #e5e7eb;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#374151;">' +
      esc(title) +
      "</td></tr>" +
      '<tr><td style="padding:14px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#111827;">' +
      bodyHtml +
      "</td></tr></table>"
    );
  }

  function emailFieldTable(fields) {
    var rows = fields
      .filter(function (row) {
        return row[1];
      })
      .map(function (row) {
        return (
          '<tr><td style="padding:6px 10px 6px 0;width:38%;vertical-align:top;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.04em;">' +
          esc(row[0]) +
          '</td><td style="padding:6px 0;vertical-align:top;font-size:13px;color:#111827;">' +
          esc(row[1]) +
          "</td></tr>"
        );
      })
      .join("");
    if (!rows) return '<p style="margin:0;color:#6b7280;">—</p>';
    return (
      '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">' +
      rows +
      "</table>"
    );
  }

  function emailProductCards(data) {
    var cards = [];
    data.slots.forEach(function (slot) {
      if (!slot.product) return;
      var p = slot.product;
      var imgSrc = emailProductImageSrc(slot, p);
      var openDir = slot.openRight ? "Sağa açılır" : slot.openLeft ? "Sola açılır" : "Belirtilmedi";
      var imgCell = imgSrc
        ? '<img src="' +
          esc(imgSrc) +
          '" alt="" width="120" style="display:block;width:120px;max-width:120px;height:auto;border-radius:6px;border:1px solid #e5e7eb;" />'
        : '<div style="width:120px;height:90px;border:1px dashed #d1d5db;border-radius:6px;background:#f9fafb;color:#9ca3af;font-size:11px;line-height:90px;text-align:center;">Görsel yok</div>';
      cards.push(
        '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 10px;border:1px solid #e5e7eb;border-radius:8px;border-collapse:separate;overflow:hidden;">' +
        '<tr><td colspan="2" style="padding:6px 12px;background:#fef2f2;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:#dc2626;">Ürün ' +
        (cards.length + 1) +
        "</td></tr>" +
        '<tr><td style="padding:12px;width:132px;vertical-align:top;background:#fff;">' +
        imgCell +
        '</td><td style="padding:12px;vertical-align:top;background:#fff;font-family:Arial,Helvetica,sans-serif;">' +
        '<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#111827;">' +
        esc(p.code || "—") +
        '</p><p style="margin:0 0 10px;font-size:12px;color:#6b7280;">' +
        esc(p.seriesName || "") +
        '</p><table role="presentation" cellspacing="0" cellpadding="0" style="font-size:12px;color:#374151;">' +
        '<tr><td style="padding:2px 12px 2px 0;color:#6b7280;">Adet</td><td style="padding:2px 0;font-weight:600;">' +
        esc(String(slot.qty || 1)) +
        '</td></tr><tr><td style="padding:2px 12px 2px 0;color:#6b7280;">Açılım</td><td style="padding:2px 0;font-weight:600;">' +
        esc(openDir) +
        "</td></tr></table></td></tr></table>"
      );
    });
    return cards.length ? cards.join("") : '<p style="margin:0;color:#6b7280;">Ürün seçilmedi</p>';
  }

  function buildQuoteEmailHtml(data) {
    var now = new Date();
    var dateStr =
      ("0" + now.getDate()).slice(-2) +
      "." +
      ("0" + (now.getMonth() + 1)).slice(-2) +
      "." +
      now.getFullYear();

    var logoSrc = assetAbsUrl("assets/img/yigit_logo.svg");
    var logoHtml =
      '<img src="' +
      esc(logoSrc) +
      '" alt="Yiğit Çelik Kapı" width="160" style="display:block;width:160px;max-width:160px;height:auto;" />';

    var contactHtml = emailFieldTable([
      ["Ad soyad", data.name],
      ["Telefon", data.phone],
      ["E-posta", data.email],
      ["Firma", data.company],
      ["Ülke", data.country],
      ["Konum", data.location],
    ]);

    var customHtml = emailFieldTable([
      ["Renk", data.color],
      ["Desen", data.pattern],
      ["Ölçü", data.size],
      ["Kasa tipi", data.frame],
      ["Panel tipi", data.panel],
      ["Kol", data.handle],
      ["Kilit", data.lock],
      ["Dürbün", data.peephole],
      ["Menteşe", data.hinge],
      ["Yangın dayanımı", data.fire],
      ["Özel istekler", data.message],
    ]);

    var customBlock = customHtml.indexOf("<tr>") !== -1 ? emailSection("Kişiselleştirme", customHtml) : "";

    return (
      '<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fiyat Teklifi Talep Formu</title></head>' +
      '<body style="margin:0;padding:0;background:#f3f4f6;">' +
      '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:24px 12px;">' +
      '<tr><td align="center">' +
      '<table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">' +
      '<tr><td style="padding:24px 28px 16px;border-bottom:2px solid #dc2626;font-family:Arial,Helvetica,sans-serif;">' +
      '<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>' +
      '<td style="width:170px;vertical-align:middle;">' +
      logoHtml +
      '</td><td style="vertical-align:middle;padding-left:16px;">' +
      '<h1 style="margin:0 0 4px;font-size:21px;line-height:1.25;color:#111827;">Fiyat Teklifi Talep Formu</h1>' +
      '<p style="margin:0;font-size:11px;color:#6b7280;">Talep tarihi: ' +
      esc(dateStr) +
      "</p></td></tr></table></td></tr>" +
      '<tr><td style="padding:20px 28px 8px;">' +
      emailSection("Seçilen ürünler", emailProductCards(data)) +
      emailSection("İletişim bilgileri", contactHtml) +
      customBlock +
      "</td></tr>" +
      '<tr><td style="padding:0 28px 24px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#6b7280;border-top:1px solid #e5e7eb;">' +
      '<p style="margin:16px 0 6px;"><strong style="color:#111827;">Yiğit Çelik Kapı</strong><br />www.yigitcelikkapi.com.tr · +90 352 311 55 41 · info@yigitcelikkapi.com.tr</p>' +
      '<p style="margin:0;font-size:10px;">Bu belge müşteri talep formunun özetidir; bağlayıcı fiyat teklifi niteliği taşımaz.</p>' +
      "</td></tr></table></td></tr></table></body></html>"
    );
  }

  /* ——— 7) API gönderimi ——— */
  function quoteApiUrl() {
    var form = $("quote-form");
    var custom = form && form.getAttribute("data-quote-api");
    if (custom) return apiEndpoint(custom);
    return apiEndpoint("/api/send-quote.php");
  }

  function apiEndpoint(path) {
    if (/^https?:\/\//i.test(path)) return path;
    if (isFilePreview()) {
      return siteBaseUrl() + (path.charAt(0) === "/" ? path : "/" + path);
    }
    return new URL(path.charAt(0) === "/" ? path : "/" + path, window.location.origin).href;
  }

  function parseApiJson(text) {
    var raw = String(text || "").trim();
    if (!raw) return null;
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
    try {
      return JSON.parse(raw);
    } catch (e1) {
      var start = raw.indexOf("{");
      var end = raw.lastIndexOf("}");
      if (start >= 0 && end > start) {
        try {
          return JSON.parse(raw.slice(start, end + 1));
        } catch (e2) {}
      }
    }
    return null;
  }

  function stripDataUrlsFromEmailHtml(html) {
    return String(html || "").replace(/src=(["'])data:[^"']+\1/gi, 'src=$1$1');
  }

  function serializeQuoteDataForApi(data) {
    return {
      slots: data.slots
        .filter(function (s) {
          return s.product;
        })
        .map(function (s) {
          var p = s.product;
          return {
            code: p.code || "",
            seriesName: p.seriesName || "",
            qty: s.qty || 1,
            openRight: !!s.openRight,
            openLeft: !!s.openLeft,
            imageUrl: p.image ? assetAbsUrl(root() + p.image) : "",
          };
        }),
      name: data.name,
      phone: data.phone,
      email: data.email,
      company: data.company,
      country: data.country,
      location: data.location,
      message: data.message,
      color: data.color,
      pattern: data.pattern,
      size: data.size,
      frame: data.frame,
      panel: data.panel,
      handle: data.handle,
      lock: data.lock,
      peephole: data.peephole,
      hinge: data.hinge,
      fire: data.fire,
    };
  }

  function setSubmitStatus(message, type) {
    var el = $("quote-submit-status");
    if (!el) return;
    el.hidden = !message;
    el.textContent = message || "";
    el.className = "quote-submit-status" + (type ? " quote-submit-status--" + type : "");
  }

  function setSubmitBusy(busy) {
    var btn = document.querySelector("#quote-form .btn-submit");
    if (!btn) return;
    btn.disabled = busy;
    if (busy) {
      if (!btn.getAttribute("data-label")) btn.setAttribute("data-label", btn.textContent);
      btn.textContent = qmsg("Gönderiliyor…", "جاري الإرسال…", "Sending…");
    } else if (btn.getAttribute("data-label")) {
      btn.textContent = btn.getAttribute("data-label");
    }
  }

  function isFilePreview() {
    return window.location.protocol === "file:";
  }

  function isLocalDev() {
    var h = window.location.hostname;
    return h === "localhost" || h === "127.0.0.1";
  }

  function finishQuotePreview(ctx, savedFile) {
    previewQuoteHtml(ctx.html, savedFile || "");
    setSubmitStatus(
      qmsg(
        "Yerel test: mail gönderilmedi. HTML önizleme açıldı.",
        "اختبار محلي: لم يُرسل البريد. فُتحت معاينة HTML.",
        isFilePreview()
          ? "File preview mode: email was not sent. Open the site via a local web server (python -m http.server 8080) to test form submission."
          : "Local test: email not sent. HTML preview opened."
      ),
      "success"
    );
    window.setTimeout(function () {
      window.location.assign(thanksHref());
    }, isFilePreview() ? 1500 : 2000);
  }

  function fetchWithTimeout(url, options, ms) {
    return Promise.race([
      fetch(url, options),
      new Promise(function (_, reject) {
        setTimeout(function () {
          reject(new TypeError("Sunucu zaman aşımı"));
        }, ms);
      }),
    ]);
  }

  function submitQuoteViaPhp(ctx) {
    var honeyEl = document.querySelector('#quote-form [name="_honey"]');
    return fetchWithTimeout(
      quoteApiUrl(),
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: ctx.data.name,
          email: ctx.data.email,
          phone: ctx.data.phone,
          data: serializeQuoteDataForApi(ctx.data),
          honey: honeyEl ? honeyEl.value : "",
        }),
      },
      45000
    ).then(function (res) {
      return res.text().then(function (text) {
        var body = parseApiJson(text);
        if (!body) {
          console.warn("send-quote raw response:", text.slice(0, 400));
          var err = new Error(
            qmsg(
              "Sunucu yanıtı okunamadı (HTTP " + res.status + "). api/send-quote.php güncel mi?",
              "تعذّر قراءة رد الخادم (HTTP " + res.status + "). هل api/send-quote.php محدّث؟"
            )
          );
          err.apiFailed = true;
          throw err;
        }
        if (!res.ok || !body.ok) {
          var failErr = new Error(
            (body && body.error) ||
              qmsg("Teklif gönderilemedi.", "تعذّر إرسال عرض السعر.", "Quote could not be sent.")
          );
          failErr.apiFailed = true;
          throw failErr;
        }
        return body;
      });
    });
  }

  function submitQuoteForm(products) {
    setSubmitBusy(true);
    setSubmitStatus(qmsg("Teklif hazırlanıyor…", "جاري تجهيز العرض…", "Preparing quote…"), "info");

    var ctx = { data: null, html: "", text: "" };

    return Promise.resolve()
      .then(function () {
        ctx.data = collectFormData(products);
        ctx.html = stripDataUrlsFromEmailHtml(buildQuoteEmailHtml(ctx.data));
        setSubmitStatus(qmsg("Gönderiliyor…", "جاري الإرسال…", "Sending…"), "info");
      })
      .then(function () {
        if (isFilePreview()) {
          finishQuotePreview(ctx, "");
          return { __filePreview: true };
        }
        return submitQuoteViaPhp(ctx);
      })
      .then(function (body) {
        if (body && body.__filePreview) return;
        if (isLocalDev()) {
          finishQuotePreview(ctx, body && body.saved ? body.saved : "");
          return;
        }

        setSubmitStatus(qmsg("Teklifiniz HTML formatında gönderildi.", "تم إرسال عرض السعر.", "Your quote was sent."), "success");

        window.setTimeout(function () {
          window.location.assign(thanksHref());
        }, 1500);
      })
      .catch(function (err) {
        if (err && err.__filePreview) return;
        console.error("Quote submit error:", err);
        var errMsg =
          (err && err.message) ||
          qmsg(
            "Teklif gönderilemedi. Lütfen +90 352 311 55 41 numarasından bizi arayın.",
            "تعذّر إرسال العرض. يرجى الاتصال على +90 352 311 55 41."
          );
        setSubmitStatus(errMsg, "error");
        window.alert(errMsg);
      })
      .finally(function () {
        setSubmitBusy(false);
      });
  }

  function previewQuoteHtml(html, savedFile) {
    if (savedFile && !isFilePreview()) {
      var fileUrl = "/api/outbox/" + encodeURIComponent(savedFile);
      window.open(fileUrl, "_blank", "noopener,noreferrer");
      return;
    }
    try {
      var blob = new Blob([html], { type: "text/html;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 120000);
    } catch (e) {}
  }

  function buildFallbackPdf(data, JsPDF) {
    var pdf = new JsPDF("p", "mm", "a4");
    var margin = 14;
    var y = margin;
    var lineH = 5.2;
    var maxW = pdf.internal.pageSize.getWidth() - margin * 2;
    var pageH = pdf.internal.pageSize.getHeight();

    function ensureSpace(h) {
      if (y + h > pageH - margin) {
        pdf.addPage();
        y = margin;
      }
    }

    function writeLines(text, size, bold) {
      pdf.setFontSize(size || 10);
      pdf.setFont(undefined, bold ? "bold" : "normal");
      var rows = pdf.splitTextToSize(String(text || ""), maxW);
      ensureSpace(rows.length * lineH + 2);
      pdf.text(rows, margin, y);
      y += rows.length * lineH + 2;
    }

    writeLines(qmsg("Yiğit Çelik Kapı — Fiyat Teklifi Talep Formu", "Yiğit Çelik Kapı — نموذج طلب عرض سعر", "Yiğit Çelik Kapı — Quote Request Form"), 15, true);
    writeLines(qmsg("Seçilen ürünler", "المنتجات المحددة", "Selected products"), 11, true);
    data.slots.forEach(function (slot, i) {
      if (!slot.product) return;
      var open = openDirLabel(slot);
      writeLines(
        qmsg("Ürün ", "منتج ", "Product ") +
          (i + 1) +
          ": " +
          (slot.product.code || "") +
          " — " +
          seriesDisplayName(slot.product.seriesSlug, slot.product.seriesName || "") +
          " | " +
          qmsg("Adet: ", "الكمية: ", "Qty: ") +
          (slot.qty || 1) +
          " | " +
          qmsg("Açılım: ", "اتجاه الفتح: ", "Opening: ") +
          open
      );
      var slotImg = document.querySelector(
        '.quote-product-slot[data-slot-index="' + i + '"] .quote-product-slot__media img'
      );
      var imgData = imageElementToDataUrl(slotImg);
      if (imgData) {
        ensureSpace(46);
        try {
          pdf.addImage(imgData, "JPEG", margin, y, 32, 40);
          y += 44;
        } catch (e) {}
      }
    });

    writeLines(qmsg("İletişim bilgileri", "معلومات الاتصال", "Contact details"), 11, true);
    writeLines(
      [
        qmsg("Ad soyad: ", "الاسم الكامل: ", "Full name: ") + data.name,
        qmsg("Telefon: ", "الهاتف: ", "Phone: ") + data.phone,
        qmsg("E-posta: ", "البريد الإلكتروني: ", "Email: ") + data.email,
        data.company ? qmsg("Firma: ", "الشركة: ", "Company: ") + data.company : "",
        qmsg("Ülke: ", "البلد: ", "Country: ") + data.country,
        qmsg("Konum: ", "الموقع: ", "Location: ") + data.location,
      ]
        .filter(Boolean)
        .join("\n")
    );

    var customText = [
      [qmsg("Renk", "اللون", "Colour"), data.color],
      [qmsg("Desen", "النقش", "Pattern"), data.pattern],
      [qmsg("Ölçü", "المقاس", "Size"), data.size],
      [qmsg("Kasa tipi", "نوع الإطار", "Frame type"), data.frame],
      [qmsg("Panel tipi", "نوع اللوح", "Panel type"), data.panel],
      [qmsg("Kol", "المقبض", "Handle"), data.handle],
      [qmsg("Kilit", "القفل", "Lock"), data.lock],
      [qmsg("Dürbün", "العين السحرية", "Peephole"), data.peephole],
      [qmsg("Menteşe", "المفصلة", "Hinge"), data.hinge],
      [qmsg("Yangın dayanımı", "مقاومة الحريق", "Fire rating"), data.fire],
      [qmsg("Özel istekler", "طلبات خاصة", "Special requests"), data.message],
    ]
      .filter(function (row) {
        return row[1];
      })
      .map(function (row) {
        return row[0] + ": " + row[1];
      })
      .join("\n");

    if (customText) {
      writeLines(qmsg("Kişiselleştirme", "التخصيص", "Customization"), 11, true);
      writeLines(customText);
    }

    pdf.save(isEn() ? "yigit-steel-door-quote-request.pdf" : "yigit-celik-kapi-teklif-talebi.pdf");
  }

  function downloadPdf(products) {
    state.slots.forEach(function (_, i) {
      readSlotFromDom(i);
    });
    if (!validateQuoteForm(products)) return;

    var btn = $("quote-pdf-btn");
    if (btn) btn.disabled = true;

    var h2c = window.html2canvas;
    var JsPDF = window.jspdf && (window.jspdf.jsPDF || window.jspdf.default);
    if (!h2c || !JsPDF) {
      alert(qmsg("PDF modülü yüklenemedi.", "تعذّر تحميل وحدة PDF.", "PDF module could not be loaded."));
      if (btn) btn.disabled = false;
      return;
    }

    var ctx = { sheet: null, data: null };

    resolveAllSlotImages(products)
      .then(function () {
        return ensurePdfLogoDataUrl();
      })
      .then(function () {
        ctx.data = collectFormData(products);
        ctx.sheet = buildPdfSheet(ctx.data);
        if (!ctx.sheet) throw new Error("missing sheet");

        ctx.sheet.classList.add("is-capturing");
        ctx.sheet.setAttribute("aria-hidden", "false");

        var captureReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
        return captureReady;
      })
      .then(function () {
        return preparePdfImages(ctx.sheet);
      })
      .then(function () {
        return waitForImages(ctx.sheet);
      })
      .then(function () {
        return new Promise(function (resolve) {
          requestAnimationFrame(function () {
            requestAnimationFrame(resolve);
          });
        });
      })
      .then(function () {
        return captureSheetToCanvas(ctx.sheet, h2c);
      })
      .then(function (canvas) {
        if (!canvas || !canvas.width || !canvas.height) {
          throw new Error("empty canvas");
        }
        var pdf = new JsPDF("p", "mm", "a4");
        canvasToPdf(pdf, canvas);
        pdf.save("yigit-celik-kapi-teklif-talebi.pdf");
      })
      .catch(function (err) {
        console.error("PDF error:", err);
        try {
          if (!ctx.data) {
            ctx.data = collectFormData(products);
          }
          buildFallbackPdf(ctx.data, JsPDF);
        } catch (fallbackErr) {
          console.error("PDF fallback error:", fallbackErr);
          alert(
            "PDF oluşturulamadı. Sayfayı dosyadan değil, bir web sunucusu üzerinden açmayı deneyin (ör. VS Code Live Server)."
          );
        }
      })
      .finally(function () {
        if (ctx.sheet) {
          ctx.sheet.classList.remove("is-capturing");
          ctx.sheet.setAttribute("aria-hidden", "true");
        }
        if (btn) btn.disabled = false;
      });
  }

  function applyUrlParams(products) {
    var params = new URLSearchParams(window.location.search);
    var urunId = params.get("urun");
    var compareIds = getCompareIds().slice(0, MAX_SLOTS);

    if (compareIds.length) {
      state.slots = compareIds.map(function () {
        return emptySlot();
      });
      compareIds.forEach(function (id, i) {
        var p = findProduct(products, id);
        if (p) setSlotFromProduct(products, i, p);
      });
    } else if (urunId) {
      var p = findProduct(products, urunId);
      if (p) setSlotFromProduct(products, 0, p);
    }

    renderProductSlots(products);

    if (compareIds.length) {
      var hint = $("quote-compare-hint");
      if (hint) {
        hint.hidden = false;
        hint.textContent = qmsg(
          compareIds.length +
            " karşılaştırma ürünü forma aktarıldı" +
            (compareIds.length >= MAX_SLOTS ? " (en fazla " + MAX_SLOTS + ")." : "."),
          "تم نقل " +
            compareIds.length +
            " منتج/منتجات من المقارنة إلى النموذج" +
            (compareIds.length >= MAX_SLOTS ? " (بحد أقصى " + MAX_SLOTS + ")." : "."),
          compareIds.length +
            " comparison product(s) added to the form" +
            (compareIds.length >= MAX_SLOTS ? " (max " + MAX_SLOTS + ")." : ".")
        );
      }
    }
  }

  /* ——— 8) Olay bağlama / init ——— */
  function bindEvents(products) {
    var slotsRoot = $("quote-products-slots");
    if (slotsRoot) {
      slotsRoot.addEventListener("change", function (e) {
        var t = e.target;
        var idx = Number(t.getAttribute("data-slot-index"));
        if (isNaN(idx)) return;
        readSlotFromDom(idx);

        if (t.classList.contains("quote-slot-series")) {
          state.slots[idx].productId = "";
          state.slots[idx].seriesSlug = t.value;
          renderProductSlots(products);
          return;
        }
        if (t.classList.contains("quote-slot-open-right") || t.classList.contains("quote-slot-open-left")) {
          var slot = state.slots[idx];
          if (t.classList.contains("quote-slot-open-right")) {
            slot.openRight = t.checked;
            if (t.checked) slot.openLeft = false;
          } else {
            slot.openLeft = t.checked;
            if (t.checked) slot.openRight = false;
          }
          renderProductSlots(products);
          return;
        }
        renderProductSlots(products);
      });
    }

    var addBtn = $("quote-add-product");
    if (addBtn) addBtn.addEventListener("click", addSlot);
    var removeBtn = $("quote-remove-product");
    if (removeBtn) removeBtn.addEventListener("click", removeSlot);

    var countrySel = $("quote-country");
    if (countrySel) {
      countrySel.addEventListener("change", function () {
        toggleLocationMode(countrySel.value);
      });
    }
    var provinceSel = $("quote-province");
    if (provinceSel) {
      provinceSel.addEventListener("change", function () {
        populateTrDistricts(provinceSel.value);
      });
    }
    var citySel = $("quote-city");
    if (citySel) citySel.addEventListener("change", onCityChange);

    var form = $("quote-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        state.slots.forEach(function (_, i) {
          readSlotFromDom(i);
        });
        if ($("quote-city") && $("quote-city").value === "__other__") {
          var other = $("quote-city-other");
          if (other && other.value.trim()) {
            $("quote-city").removeAttribute("name");
            other.setAttribute("name", "Sehir");
          }
        }
        syncHiddenSummary(products);
        if (!validateQuoteForm(products)) {
          setSubmitStatus(
            qmsg(
              "Eksik veya hatalı alan var. Lütfen kırmızı işaretli alanları doldurun.",
              "هناك حقول ناقصة أو غير صحيحة. يرجى تعبئة الحقول المميزة.",
              "Some fields are missing or invalid. Please complete the highlighted fields."
            ),
            "error"
          );
          return;
        }
        submitQuoteForm(products);
      });
    }

    var pdfBtn = $("quote-pdf-btn");
    if (pdfBtn) pdfBtn.addEventListener("click", function () {
      downloadPdf(products);
    });
  }

  function init() {
    Promise.all([loadProducts(), loadLocations(), loadTrIlIlce(), loadQuoteI18n()])
      .then(function (results) {
        state.products = results[0];
        populateCountries(
          results[1] ||
            window.YCK_LOCATIONS || {
              countries: [{ code: "TR", name: "Türkiye", cities: [] }],
              defaultCountry: "TR",
            }
        );
        populateTrProvinces(results[2]);
        applyUrlParams(results[0]);
        bindEvents(results[0]);
        if (window.yigitFormValidate) window.yigitFormValidate.init();
      })
      .catch(function () {
        var mount = $("quote-products-slots");
        if (mount) mount.innerHTML = '<p class="form-hint">' + qmsg("Ürün listesi yüklenemedi. Sayfayı yenileyin.", "تعذّر تحميل قائمة المنتجات. حدّث الصفحة.", "Product list could not be loaded. Please refresh the page.") + "</p>";
        bindEvents([]);
        if (window.yigitFormValidate) window.yigitFormValidate.init();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
