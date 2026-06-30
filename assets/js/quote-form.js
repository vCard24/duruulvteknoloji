/**
 * Teklif formu — ürün seçimi + POST /api/send-quote.php
 */
(function () {
  'use strict';

  var form = document.getElementById('quote-form');
  if (!form) return;

  var productsWrap = document.getElementById('quote-products');
  var catalog = { urunler: [], kategoriler: [] };
  var selectedSlugs = [];
  var categoryMap = {};

  function siteOrigin() {
    if (window.location.protocol === 'file:') {
      return 'https://www.duruulvteknoloji.com.tr';
    }
    return window.location.origin;
  }

  function sitePrefix() {
    var link = document.querySelector('link[href*="assets/"]');
    if (link) {
      var href = link.getAttribute('href') || '';
      var idx = href.indexOf('assets/');
      if (idx !== -1) return href.slice(0, idx);
    }
    return '../';
  }

  function dataUrl() {
    return sitePrefix() + 'assets/data/urunler.json';
  }

  function thanksUrl() {
    return new URL(sitePrefix() + 'tesekkurler/index.html', window.location.href).href;
  }

  function apiUrl() {
    var custom = form.getAttribute('data-quote-api');
    if (custom) {
      if (custom.indexOf('http') === 0) return custom;
      return new URL(custom, window.location.origin + '/').pathname;
    }
    return '/api/send-quote.php';
  }

  function resolveApiEndpoint() {
    if (window.location.protocol === 'file:') return null;
    var path = apiUrl();
    try {
      return new URL(path, window.location.href).href;
    } catch (e) {
      return siteOrigin() + path;
    }
  }

  function getSlugsFromUrl() {
    var raw = new URLSearchParams(window.location.search).get('products');
    if (!raw) return [];
    return raw.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function mergeCompareStorage() {
    try {
      var raw = localStorage.getItem('duru_compare_slugs') || sessionStorage.getItem('duru_compare_slugs');
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      parsed.forEach(function (slug) {
        if (selectedSlugs.indexOf(slug) === -1 && selectedSlugs.length < 4) {
          selectedSlugs.push(slug);
        }
      });
    } catch (e) {
      /* ignore */
    }
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function findProduct(slug) {
    for (var i = 0; i < catalog.urunler.length; i++) {
      if (catalog.urunler[i].slug === slug) return catalog.urunler[i];
    }
    return null;
  }

  function categoryLabel(slug) {
    return categoryMap[slug] || slug;
  }

  function productImageUrl(slug) {
    return siteOrigin() + '/assets/img/products/' + encodeURIComponent(slug) + '-01.webp';
  }

  function renderProducts() {
    if (!productsWrap) return;
    var products = selectedSlugs.map(findProduct).filter(Boolean);

    if (!products.length) {
      productsWrap.innerHTML =
        '<div style="font-size:0.875rem;color:rgba(43,46,51,0.65);border:1px dashed rgba(43,46,51,0.2);padding:1rem;background:var(--color-bg)">' +
        'Henüz ürün seçilmedi. Genel bilgi talebi gönderebilir veya <a href="' + esc(sitePrefix() + 'urunler/index.html') + '" style="color:var(--color-primary);font-weight:600">ürünleri keşfedin</a>.' +
        '</div>';
      return;
    }

    productsWrap.innerHTML = products.map(function (p) {
      var img = sitePrefix() + 'assets/img/products/' + p.slug + '-01.webp';
      return '<span class="product-tag product-tag--rich">' +
        '<img src="' + esc(img) + '" alt="" class="product-tag__img" width="40" height="32" loading="lazy">' +
        '<span class="product-tag__text">' + esc(p.ad_tr) + '</span>' +
        '<button type="button" data-remove-product="' + esc(p.slug) + '" aria-label="Kaldır">×</button></span>';
    }).join(' ');

    productsWrap.querySelectorAll('[data-remove-product]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectedSlugs = selectedSlugs.filter(function (s) { return s !== btn.getAttribute('data-remove-product'); });
        updateUrl();
        renderProducts();
      });
    });
  }

  function updateUrl() {
    var url = new URL(window.location.href);
    if (selectedSlugs.length) {
      url.searchParams.set('products', selectedSlugs.join(','));
    } else {
      url.searchParams.delete('products');
    }
    window.history.replaceState({}, '', url.pathname + url.search);
  }

  function showError(field, msg) {
    var el = form.querySelector('[name="' + field + '"]');
    var err = form.querySelector('[data-error="' + field + '"]');
    if (el) el.classList.add('is-error');
    if (err) err.textContent = msg;
  }

  function clearErrors() {
    form.querySelectorAll('.is-error').forEach(function (el) { el.classList.remove('is-error'); });
    form.querySelectorAll('[data-error]').forEach(function (el) { el.textContent = ''; });
  }

  function validate() {
    clearErrors();
    var ok = true;
    var name = form.full_name.value.trim();
    var phone = form.phone.value.trim();
    var email = form.email.value.trim();

    if (!name) { showError('full_name', 'Ad Soyad zorunludur.'); ok = false; }
    if (!phone) { showError('phone', 'Telefon zorunludur.'); ok = false; }
    if (!email) { showError('email', 'E-posta zorunludur.'); ok = false; }
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { showError('email', 'Geçerli bir e-posta giriniz.'); ok = false; }
    if (!form.kvkk_accepted.checked) { showError('kvkk_accepted', 'KVKK onayı zorunludur.'); ok = false; }
    return ok;
  }

  function serializeForApi() {
    var products = selectedSlugs.map(function (slug) {
      var p = findProduct(slug);
      if (!p) return null;
      var specs = (p.teknik_tablo || []).slice(0, 4).map(function (row) {
        return { label: row.ozellik, value: row.deger };
      });
      return {
        slug: p.slug,
        name: p.ad_tr,
        model: p.model_kodu,
        category: categoryLabel(p.kategori_slug),
        categorySlug: p.kategori_slug,
        imageUrl: productImageUrl(p.slug),
        specs: specs
      };
    }).filter(Boolean);

    return {
      name: form.full_name.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      company: form.company.value.trim(),
      city: form.city.value.trim(),
      message: form.message.value.trim(),
      kvkk: form.kvkk_accepted.checked,
      products: products
    };
  }

  function showFormError(msg) {
    var box = document.getElementById('quote-form-error');
    if (!box) {
      box = document.createElement('p');
      box.id = 'quote-form-error';
      box.style.cssText = 'margin:0 0 1rem;padding:0.75rem 1rem;background:#fdecea;color:#b42318;border-radius:4px;font-size:0.875rem;';
      form.insertBefore(box, form.firstChild);
    }
    box.textContent = msg;
    box.style.display = 'block';
  }

  function hideFormError() {
    var box = document.getElementById('quote-form-error');
    if (box) box.style.display = 'none';
  }

  function previewEmail() {
    var endpoint = resolveApiEndpoint();
    if (!endpoint) {
      showFormError('Önizleme için php -S 127.0.0.1:8080 ile siteyi açın.');
      return;
    }

    var previewUrl = endpoint.replace(/send-quote\.php$/i, 'preview-quote-email.php');
    var btn = document.getElementById('quote-email-preview-btn');
    var btnText = btn ? btn.textContent : '';

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Hazırlanıyor…';
    }
    hideFormError();

    fetch(previewUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: serializeForApi() })
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.ok || !json.html) {
          throw new Error(json.error || 'Önizleme oluşturulamadı.');
        }
        if (json.saved) {
          window.open(new URL('api/outbox/' + json.saved, window.location.origin + '/').href, '_blank');
        } else {
          var w = window.open('', '_blank');
          if (w) {
            w.document.open();
            w.document.write(json.html);
            w.document.close();
          }
        }
      })
      .catch(function (err) {
        showFormError(err.message || 'E-posta önizlemesi başarısız.');
      })
      .finally(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = btnText;
        }
      });
  }

  var previewBtn = document.getElementById('quote-email-preview-btn');
  if (previewBtn) {
    previewBtn.addEventListener('click', function (e) {
      e.preventDefault();
      previewEmail();
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideFormError();
    if (!validate()) return;

    var endpoint = resolveApiEndpoint();
    var btn = form.querySelector('[type="submit"]');
    var btnText = btn ? btn.textContent : '';

    if (!endpoint) {
      showFormError('Form gönderimi için php -S 127.0.0.1:8080 ile siteyi açın.');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Gönderiliyor…';
    }

    var honey = form.querySelector('[name="_honey"]');
    var payload = {
      name: form.full_name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      honey: honey ? honey.value : '',
      data: serializeForApi()
    };

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.text().then(function (text) {
          var json = null;
          try { json = JSON.parse(text); } catch (err) { /* */ }
          if (!json) {
            var hint = res.status === 501
              ? ' Bu sunucu PHP çalıştırmıyor. Python yerine şu komutu kullanın: php -S localhost:8080'
              : '';
            throw new Error('Sunucu yanıtı okunamadı (HTTP ' + res.status + ').' + hint);
          }
          if (!res.ok || !json.ok) {
            throw new Error(json.error || 'Gönderim başarısız.');
          }
          return json;
        });
      })
      .then(function (result) {
        if (result.dev && result.saved) {
          try {
            window.open(new URL('api/outbox/' + result.saved, window.location.origin + '/').href, '_blank');
          } catch (err) {
            /* outbox önizleme isteğe bağlı */
          }
        }
        window.location.href = thanksUrl();
      })
      .catch(function (err) {
        showFormError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        if (btn) {
          btn.disabled = false;
          btn.textContent = btnText;
        }
      });
  });

  selectedSlugs = getSlugsFromUrl();
  if (new URLSearchParams(window.location.search).get('kaynak') === 'karsilastir') {
    mergeCompareStorage();
    updateUrl();
  }

  fetch(dataUrl())
    .then(function (r) { return r.json(); })
    .then(function (data) {
      catalog = data;
      (data.kategoriler || []).forEach(function (cat) {
        categoryMap[cat.slug] = cat.kisa_ad || cat.ad_tr;
      });
      renderProducts();
    })
    .catch(function () {
      if (productsWrap) productsWrap.innerHTML = '<p>Ürün listesi yüklenemedi.</p>';
    });

  function getPdfPayload() {
    var products = selectedSlugs.map(function (slug) {
      var p = findProduct(slug);
      if (!p) return null;
      return {
        slug: p.slug,
        name: p.ad_tr,
        model: p.model_kodu,
        category: categoryLabel(p.kategori_slug),
        specs: (p.teknik_tablo || []).map(function (row) {
          return { label: row.ozellik, value: row.deger };
        })
      };
    }).filter(Boolean);

    return {
      name: form.full_name ? form.full_name.value.trim() : '',
      company: form.company ? form.company.value.trim() : '',
      city: form.city ? form.city.value.trim() : '',
      phone: form.phone ? form.phone.value.trim() : '',
      email: form.email ? form.email.value.trim() : '',
      message: form.message ? form.message.value.trim() : '',
      products: products
    };
  }

  window.DuruQuoteForm = {
    getPdfPayload: getPdfPayload,
    hasCatalog: function () { return catalog.urunler.length > 0; }
  };
})();
