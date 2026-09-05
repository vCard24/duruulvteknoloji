/**
 * Duru ULV — Teklif formu PDF indirme
 */
(function (global) {
  'use strict';

  var sheetId = 'quote-pdf-sheet';

  function getLocale() {
    if (global.DuruPdfUtils && global.DuruPdfUtils.getLocale) {
      return global.DuruPdfUtils.getLocale();
    }
    var lang = ((document.documentElement.getAttribute('lang') || '') + '').toLowerCase();
    if (lang.indexOf('en') === 0) return 'en';
    if (lang.indexOf('ar') === 0) return 'ar';
    return 'tr';
  }

  var UI = {
    tr: {
      noSpecs: 'Teknik özellik bilgisi yok.',
      productN: 'Ürün',
      noProducts: 'Genel bilgi talebi (ürün seçilmedi)',
      fullName: 'Ad Soyad',
      phone: 'Telefon',
      email: 'E-posta',
      company: 'Firma',
      city: 'İl / İlçe',
      message: 'Mesaj',
      note: 'Not',
      draftNote:
        'Bu belge taslak talep özetidir; bağlayıcı fiyat teklifi değildir. Resmi dönüş için sitedeki teklif formunu doldurup gönderin.',
      title: 'Fiyat Teklifi Talep Formu',
      requestDate: 'Talep tarihi: ',
      selectedProducts: 'Seçilen ürünler',
      contact: 'İletişim bilgileri',
      noData: 'PDF verisi yok',
      libMissing: 'PDF kütüphaneleri yüklenemedi.',
      preparing: 'PDF hazırlanıyor…',
      download: 'PDF İndir',
      notReady: 'PDF hazırlanamadı',
      catalogWait: 'Ürün verisi henüz yüklenmedi. Lütfen birkaç saniye bekleyip tekrar deneyin.',
      fail: 'PDF oluşturulamadı.'
    },
    en: {
      noSpecs: 'No technical specifications available.',
      productN: 'Product',
      noProducts: 'General inquiry (no products selected)',
      fullName: 'Full name',
      phone: 'Phone',
      email: 'Email',
      company: 'Company',
      city: 'City / District',
      message: 'Message',
      note: 'Note',
      draftNote:
        'This is a draft request summary and not a binding quotation. Please complete and submit the quote form on the site for an official reply.',
      title: 'Price Quote Request Form',
      requestDate: 'Request date: ',
      selectedProducts: 'Selected products',
      contact: 'Contact details',
      noData: 'No PDF data',
      libMissing: 'PDF libraries failed to load.',
      preparing: 'Preparing PDF…',
      download: 'Download PDF',
      notReady: 'Could not prepare PDF',
      catalogWait: 'Product data is still loading. Please wait a few seconds and try again.',
      fail: 'Could not create PDF.'
    },
    ar: {
      noSpecs: 'لا تتوفر مواصفات فنية.',
      productN: 'منتج',
      noProducts: 'استفسار عام (لم يتم اختيار منتجات)',
      fullName: 'الاسم الكامل',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      company: 'الشركة',
      city: 'المدينة / المنطقة',
      message: 'الرسالة',
      note: 'ملاحظة',
      draftNote:
        'هذه وثيقة مسودة لطلب وليست عرض سعر ملزماً. للحصول على رد رسمي يرجى تعبئة نموذج العرض على الموقع وإرساله.',
      title: 'نموذج طلب عرض السعر',
      requestDate: 'تاريخ الطلب: ',
      selectedProducts: 'المنتجات المختارة',
      contact: 'بيانات الاتصال',
      noData: 'لا توجد بيانات PDF',
      libMissing: 'تعذر تحميل مكتبات PDF.',
      preparing: 'جارٍ إعداد PDF…',
      download: 'تحميل PDF',
      notReady: 'تعذر إعداد PDF',
      catalogWait: 'بيانات المنتجات لم تُحمَّل بعد. يرجى الانتظار بضع ثوانٍ ثم المحاولة مجدداً.',
      fail: 'تعذر إنشاء PDF.'
    }
  };

  function t(key) {
    var loc = getLocale();
    return (UI[loc] && UI[loc][key]) || UI.tr[key] || key;
  }

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
      return '<p class="pdf-product-card__no-specs">' + t('noSpecs') + '</p>';
    }

    var rows = specs.map(function (spec) {
      var label = spec.label || spec.ozellik || '';
      var value = spec.value || spec.deger || '';
      if (!label && !value) return '';
      return '<tr><th scope="row">' + U.esc(label) + '</th><td>' + U.esc(value) + '</td></tr>';
    }).join('');

    if (!rows) {
      return '<p class="pdf-product-card__no-specs">' + t('noSpecs') + '</p>';
    }

    return '<table class="pdf-product-specs-table"><tbody>' + rows + '</tbody></table>';
  }

  function buildProductCard(p, index, prefix, U) {
    var productLabel = t('productN') + ' ' + (index + 1);
    var imgHtml = p.slug
      ? '<img class="pdf-product-card__img" src="' + U.esc(prefix + 'assets/img/products/' + p.slug + '-01.webp') + '" alt="">'
      : '<div class="pdf-product-card__img-placeholder">' + productLabel + '</div>';

    var categoryHtml = p.category
      ? '<p class="pdf-product-card__meta">' + U.esc(p.category) + '</p>'
      : '';

    return '<article class="pdf-product-card pdf-product-card--detail">' +
      '<div class="pdf-product-card__head">' + productLabel +
      (p.model ? ' · ' + U.esc(p.model) : '') +
      '</div>' +
      '<div class="pdf-product-card__summary">' +
      '<div class="pdf-product-card__media">' + imgHtml + '</div>' +
      '<div class="pdf-product-card__intro">' +
      '<p class="pdf-product-card__title">' + U.esc(p.name || productLabel) + '</p>' +
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
      productsHtml = '<p style="margin:0;color:rgba(43,46,51,0.6)">' + t('noProducts') + '</p>';
    }

    var hasContact = !!(data.name || data.phone || data.email || data.company || data.city);
    var contactHtml =
      '<div class="pdf-fields">' +
      '<div><span class="pdf-field__label">' + t('fullName') + '</span><span class="pdf-field__value">' + U.esc(data.name || '—') + '</span></div>' +
      '<div><span class="pdf-field__label">' + t('phone') + '</span><span class="pdf-field__value">' + U.esc(data.phone || '—') + '</span></div>' +
      '<div><span class="pdf-field__label">' + t('email') + '</span><span class="pdf-field__value">' + U.esc(data.email || '—') + '</span></div>' +
      '<div><span class="pdf-field__label">' + t('company') + '</span><span class="pdf-field__value">' + U.esc(data.company || '—') + '</span></div>' +
      '<div><span class="pdf-field__label">' + t('city') + '</span><span class="pdf-field__value">' + U.esc(data.city || '—') + '</span></div>' +
      '</div>';

    var messageBlock = data.message
      ? U.pdfBlock(t('message'), '<p style="margin:0;line-height:1.6">' + U.esc(data.message) + '</p>')
      : '';

    var draftBlock = !hasContact
      ? U.pdfBlock(
          t('note'),
          '<p style="margin:0;line-height:1.6">' + t('draftNote') + '</p>'
        )
      : '';

    sheet.innerHTML =
      '<div class="pdf-doc">' +
      U.pdfHeader(t('title'), t('requestDate') + U.dateStr()) +
      U.pdfBlock(t('selectedProducts'), productsHtml) +
      U.pdfBlock(t('contact'), contactHtml) +
      messageBlock +
      draftBlock +
      U.pdfFooter() +
      '</div>';
    return sheet;
  }

  function downloadPayload(data, opts) {
    opts = opts || {};
    if (!data) return Promise.reject(new Error(t('noData')));
    if (!global.DuruPdfUtils) {
      return Promise.reject(new Error(t('libMissing')));
    }

    var btn = opts.buttonId ? document.getElementById(opts.buttonId) : null;
    var idleLabel = opts.idleLabel || (btn && btn.textContent) || t('download');
    if (btn) {
      btn.disabled = true;
      btn.textContent = t('preparing');
    }

    return global.DuruPdfUtils.ensureAssets()
      .then(function () {
        var sheet = buildSheet(data, opts.sheetId);
        if (!sheet) throw new Error(t('notReady'));
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
      alert(t('catalogWait'));
      return;
    }

    var btn = document.getElementById('quote-pdf-btn');
    downloadPayload(data, {
      buttonId: 'quote-pdf-btn',
      idleLabel: (btn && btn.textContent) || t('download'),
      fileName: 'duru-ulv-teklif-talebi.pdf'
    }).catch(function (err) {
      alert(err.message || t('fail'));
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
