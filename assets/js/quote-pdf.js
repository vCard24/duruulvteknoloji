/**
 * Duru ULV — Teklif formu PDF indirme
 */
(function (global) {
  'use strict';

  var sheetId = 'quote-pdf-sheet';

  function ensureSheet(preferredId) {
    var id = preferredId || sheetId;
    var sheet = document.getElementById(id);
    if (!sheet) {
      sheet = document.createElement('div');
      sheet.id = id;
      sheet.className = 'pdf-sheet';
      sheet.setAttribute('aria-hidden', 'true');
      document.body.appendChild(sheet);
    }
    return sheet;
  }

  function readFormDataFromDom() {
    var form = document.getElementById('quote-form');
    if (!form) return null;

    var products = [];
    form.querySelectorAll('#quote-products .product-tag').forEach(function (tag) {
      var btn = tag.querySelector('[data-remove-product]');
      var slug = btn ? btn.getAttribute('data-remove-product') : '';
      var nameEl = tag.querySelector('.product-tag__text');
      var name = nameEl ? nameEl.textContent.trim() : tag.textContent.replace('×', '').trim();
      products.push({ slug: slug, name: name, specs: [] });
    });

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

  function readFormData() {
    if (global.DuruQuoteForm && global.DuruQuoteForm.getPdfPayload) {
      return global.DuruQuoteForm.getPdfPayload();
    }
    return readFormDataFromDom();
  }

  function buildSpecsTable(specs, U) {
    if (!specs || !specs.length) {
      return '<p class="pdf-product-card__no-specs">Teknik özellik bilgisi yok.</p>';
    }

    var rows = specs.map(function (spec) {
      var label = spec.label || spec.ozellik || '';
      var value = spec.value || spec.deger || '';
      if (!label && !value) return '';
      return '<tr><th scope="row">' + U.esc(label) + '</th><td>' + U.esc(value) + '</td></tr>';
    }).join('');

    if (!rows) {
      return '<p class="pdf-product-card__no-specs">Teknik özellik bilgisi yok.</p>';
    }

    return '<table class="pdf-product-specs-table"><tbody>' + rows + '</tbody></table>';
  }

  function buildProductCard(p, index, prefix, U) {
    var imgHtml = p.slug
      ? '<img class="pdf-product-card__img" src="' + U.esc(prefix + 'assets/img/products/' + p.slug + '-01.webp') + '" alt="">'
      : '<div class="pdf-product-card__img-placeholder">Ürün ' + (index + 1) + '</div>';

    var categoryHtml = p.category
      ? '<p class="pdf-product-card__meta">' + U.esc(p.category) + '</p>'
      : '';

    return '<article class="pdf-product-card pdf-product-card--detail">' +
      '<div class="pdf-product-card__head">Ürün ' + (index + 1) +
      (p.model ? ' · ' + U.esc(p.model) : '') +
      '</div>' +
      '<div class="pdf-product-card__summary">' +
      '<div class="pdf-product-card__media">' + imgHtml + '</div>' +
      '<div class="pdf-product-card__intro">' +
      '<p class="pdf-product-card__title">' + U.esc(p.name || 'Ürün ' + (index + 1)) + '</p>' +
      categoryHtml +
      '</div></div>' +
      buildSpecsTable(p.specs, U) +
      '</article>';
  }

  function buildSheet(data, preferredSheetId) {
    var U = global.DuruPdfUtils;
    var sheet = ensureSheet(preferredSheetId);
    if (!U || !sheet) return null;

    var products = data.products || [];
    var productsHtml = '';
    if (products.length) {
      var prefix = global.DuruPdfUtils.sitePrefix();
      productsHtml = '<div class="pdf-products-list">' + products.map(function (p, i) {
        return buildProductCard(p, i, prefix, U);
      }).join('') + '</div>';
    } else {
      productsHtml = '<p style="margin:0;color:rgba(43,46,51,0.6)">Genel bilgi talebi (ürün seçilmedi)</p>';
    }

    var hasContact = !!(data.name || data.phone || data.email || data.company || data.city);
    var contactHtml =
      '<div class="pdf-fields">' +
      '<div><span class="pdf-field__label">Ad Soyad</span><span class="pdf-field__value">' + U.esc(data.name || '—') + '</span></div>' +
      '<div><span class="pdf-field__label">Telefon</span><span class="pdf-field__value">' + U.esc(data.phone || '—') + '</span></div>' +
      '<div><span class="pdf-field__label">E-posta</span><span class="pdf-field__value">' + U.esc(data.email || '—') + '</span></div>' +
      '<div><span class="pdf-field__label">Firma</span><span class="pdf-field__value">' + U.esc(data.company || '—') + '</span></div>' +
      '<div><span class="pdf-field__label">İl / İlçe</span><span class="pdf-field__value">' + U.esc(data.city || '—') + '</span></div>' +
      '</div>';

    var messageBlock = data.message
      ? U.pdfBlock('Mesaj', '<p style="margin:0;line-height:1.6">' + U.esc(data.message) + '</p>')
      : '';

    var draftBlock = !hasContact
      ? U.pdfBlock(
          'Not',
          '<p style="margin:0;line-height:1.6">Bu belge taslak talep özetidir; bağlayıcı fiyat teklifi değildir. Resmi dönüş için sitedeki teklif formunu doldurup gönderin.</p>'
        )
      : '';

    sheet.innerHTML =
      '<div class="pdf-doc">' +
      U.pdfHeader('Fiyat Teklifi Talep Formu', 'Talep tarihi: ' + U.dateStr()) +
      U.pdfBlock('Seçilen ürünler', productsHtml) +
      U.pdfBlock('İletişim bilgileri', contactHtml) +
      messageBlock +
      draftBlock +
      U.pdfFooter() +
      '</div>';
    return sheet;
  }

  function downloadPayload(data, opts) {
    opts = opts || {};
    if (!data) return Promise.reject(new Error('PDF verisi yok'));
    if (!global.DuruPdfUtils) {
      return Promise.reject(new Error('PDF kütüphaneleri yüklenemedi.'));
    }

    var btn = opts.buttonId ? document.getElementById(opts.buttonId) : null;
    var idleLabel = opts.idleLabel || 'PDF İndir';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'PDF hazırlanıyor…';
    }

    return global.DuruPdfUtils.ensureAssets()
      .then(function () {
        var sheet = buildSheet(data, opts.sheetId);
        if (!sheet) throw new Error('PDF hazırlanamadı');
        return global.DuruPdfUtils.downloadSheet(
          sheet,
          opts.fileName || 'duru-ulv-teklif-talebi.pdf'
        );
      })
      .finally(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = idleLabel;
        }
      });
  }

  function download() {
    var data = readFormData();
    if (!data) return;

    if (global.DuruQuoteForm && !global.DuruQuoteForm.hasCatalog()) {
      alert('Ürün verisi henüz yüklenmedi. Lütfen birkaç saniye bekleyip tekrar deneyin.');
      return;
    }

    downloadPayload(data, {
      buttonId: 'quote-pdf-btn',
      idleLabel: 'PDF İndir',
      fileName: 'duru-ulv-teklif-talebi.pdf'
    }).catch(function (err) {
      alert(err.message || 'PDF oluşturulamadı.');
    });
  }

  function init() {
    var btn = document.getElementById('quote-pdf-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      download();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.DuruQuotePdf = {
    download: download,
    downloadPayload: downloadPayload
  };
})(window);
