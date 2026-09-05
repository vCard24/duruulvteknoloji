/**
 * Duru ULV — Karşılaştırma PDF + teklif PDF indirme
 */
(function (global) {
  'use strict';

  var sheetId = 'compare-pdf-sheet';
  var ctx = { products: [], prefix: '' };

  var SPEC_CANONICAL = {
    Tank: 'İlaç Tank Kapasitesi',
    'Nem Çıkış Debisi': 'İlaç Çıkış Debisi',
    'Nem Damla Çapı': 'İlaç Damla Çapı',
    'Damla Çapı': 'İlaç Damla Çapı'
  };

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
      feature: 'Özellik',
      title: 'Ürün Karşılaştırması',
      modelsSuffix: ' model · ',
      tableBlock: 'Teknik karşılaştırma tablosu',
      draftMessage:
        'Karşılaştırma listesinden oluşturulmuş taslak talep belgesi. Resmi teklif için formu doldurup gönderin.',
      preparing: 'PDF hazırlanıyor…',
      fail: 'PDF oluşturulamadı.',
      needProduct: 'PDF için en az bir ürün seçin.',
      libMissing: 'PDF kütüphaneleri yüklenemedi.',
      comparePdf: 'Karşılaştırma PDF',
      notReady: 'PDF hazırlanamadı',
      needQuoteProduct: 'Teklif PDF için en az bir ürün seçin.',
      quoteModuleMissing: 'Teklif PDF modülü yüklenemedi. Sayfayı yenileyip tekrar deneyin.',
      quotePdf: 'Teklif PDF'
    },
    en: {
      feature: 'Feature',
      title: 'Product Comparison',
      modelsSuffix: ' models · ',
      tableBlock: 'Technical comparison table',
      draftMessage:
        'Draft request document generated from the comparison list. Please complete the form for an official quotation.',
      preparing: 'Preparing PDF…',
      fail: 'Could not create PDF.',
      needProduct: 'Select at least one product for the PDF.',
      libMissing: 'PDF libraries failed to load.',
      comparePdf: 'Comparison PDF',
      notReady: 'Could not prepare PDF',
      needQuoteProduct: 'Select at least one product for the quote PDF.',
      quoteModuleMissing: 'Quote PDF module failed to load. Refresh the page and try again.',
      quotePdf: 'Quote PDF'
    },
    ar: {
      feature: 'الميزة',
      title: 'مقارنة المنتجات',
      modelsSuffix: ' طراز · ',
      tableBlock: 'جدول المقارنة الفنية',
      draftMessage:
        'وثيقة طلب مسودة أُنشئت من قائمة المقارنة. يرجى تعبئة النموذج للحصول على عرض رسمي.',
      preparing: 'جارٍ إعداد PDF…',
      fail: 'تعذر إنشاء PDF.',
      needProduct: 'اختر منتجاً واحداً على الأقل لملف PDF.',
      libMissing: 'تعذر تحميل مكتبات PDF.',
      comparePdf: 'PDF المقارنة',
      notReady: 'تعذر إعداد PDF',
      needQuoteProduct: 'اختر منتجاً واحداً على الأقل لـ PDF العرض.',
      quoteModuleMissing: 'تعذر تحميل وحدة PDF العرض. حدّث الصفحة وحاول مجدداً.',
      quotePdf: 'PDF العرض'
    }
  };

  function t(key) {
    var loc = getLocale();
    return (UI[loc] && UI[loc][key]) || UI.tr[key] || key;
  }

  function canonSpec(key) {
    return SPEC_CANONICAL[key] || key;
  }

  function ensureSheet() {
    var sheet = document.getElementById(sheetId);
    if (!sheet) {
      sheet = document.createElement('div');
      sheet.id = sheetId;
      sheet.className = 'pdf-sheet';
      sheet.setAttribute('aria-hidden', 'true');
      document.body.appendChild(sheet);
    }
    return sheet;
  }

  function getValue(product, key) {
    var rows = product.teknik_tablo || [];
    for (var i = 0; i < rows.length; i++) {
      if (canonSpec(rows[i].ozellik) === key) return rows[i].deger;
    }
    return '—';
  }

  function displayName(p) {
    var lang = ((document.documentElement.getAttribute('lang') || '') + '').toLowerCase();
    if (lang.indexOf('en') === 0 && p.ad_en) return p.ad_en;
    if (lang.indexOf('ar') === 0 && p.ad_ar) return p.ad_ar;
    return p.ad_tr || p.ad_en || p.ad_ar || p.slug;
  }

  function buildSheet(products, prefix) {
    var U = global.DuruPdfUtils;
    if (!U) return null;

    var keys = [];
    var seen = {};
    products.forEach(function (p) {
      (p.teknik_tablo || []).forEach(function (row) {
        if (!row || !row.ozellik) return;
        var key = canonSpec(row.ozellik);
        if (!seen[key]) {
          seen[key] = true;
          keys.push(key);
        }
      });
    });

    var headCells = products.map(function (p) {
      var img = prefix + 'assets/img/products/' + p.slug + '-01.webp';
      return '<th style="text-align:center;min-width:90px">' +
        '<img class="pdf-compare-table__product-img" src="' + U.esc(img) + '" alt="">' +
        '<div style="font-size:9px;opacity:0.85">' + U.esc(p.model_kodu) + '</div>' +
        '<div style="font-size:11px;font-weight:700">' + U.esc(displayName(p)) + '</div></th>';
    }).join('');

    var bodyRows = keys.map(function (key) {
      var cells = products.map(function (p) {
        return '<td>' + U.esc(getValue(p, key)) + '</td>';
      }).join('');
      return '<tr><th>' + U.esc(key) + '</th>' + cells + '</tr>';
    }).join('');

    var tableHtml =
      '<table class="pdf-compare-table"><thead><tr><th>' + t('feature') + '</th>' + headCells +
      '</tr></thead><tbody>' + bodyRows + '</tbody></table>';

    var sheet = ensureSheet();
    sheet.innerHTML =
      '<div class="pdf-doc">' +
      U.pdfHeader(t('title'), products.length + t('modelsSuffix') + U.dateStr()) +
      U.pdfBlock(t('tableBlock'), tableHtml) +
      U.pdfFooter() +
      '</div>';
    return sheet;
  }

  function mapToQuotePayload(products) {
    return {
      name: '',
      company: '',
      city: '',
      phone: '',
      email: '',
      message: t('draftMessage'),
      products: (products || []).map(function (p) {
        return {
          slug: p.slug,
          name: displayName(p),
          model: p.model_kodu,
          category: p.kategori_slug || '',
          specs: (p.teknik_tablo || []).map(function (row) {
            return { label: row.ozellik, value: row.deger };
          })
        };
      })
    };
  }

  function withBusy(btnId, idleLabel, work) {
    var btn = document.getElementById(btnId);
    var restore = idleLabel;
    if (btn) {
      if (!restore) restore = btn.textContent;
      btn.disabled = true;
      btn.textContent = t('preparing');
    }
    return Promise.resolve()
      .then(work)
      .catch(function (err) {
        alert((err && err.message) || t('fail'));
      })
      .finally(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = restore || t('comparePdf');
        }
      });
  }

  function download(products, prefix) {
    var list = products || ctx.products;
    var pfx = prefix || ctx.prefix || (global.DuruPdfUtils && global.DuruPdfUtils.sitePrefix());
    if (!list || !list.length) {
      alert(t('needProduct'));
      return Promise.resolve();
    }
    if (!global.DuruPdfUtils) {
      alert(t('libMissing'));
      return Promise.resolve();
    }

    var btn = document.getElementById('compare-pdf-btn');
    return withBusy('compare-pdf-btn', (btn && btn.textContent) || t('comparePdf'), function () {
      var sheet = buildSheet(list, pfx);
      if (!sheet) throw new Error(t('notReady'));
      return global.DuruPdfUtils.downloadSheet(sheet, 'duru-ulv-karsilastirma.pdf');
    });
  }

  function downloadQuote(products, prefix) {
    var list = products || ctx.products;
    if (!list || !list.length) {
      alert(t('needQuoteProduct'));
      return Promise.resolve();
    }
    if (!global.DuruQuotePdf || !global.DuruQuotePdf.downloadPayload) {
      alert(t('quoteModuleMissing'));
      return Promise.resolve();
    }

    var btn = document.getElementById('compare-quote-pdf-btn');
    return withBusy('compare-quote-pdf-btn', (btn && btn.textContent) || t('quotePdf'), function () {
      return global.DuruQuotePdf.downloadPayload(mapToQuotePayload(list), {
        buttonId: null,
        fileName: 'duru-ulv-teklif-taslak.pdf'
      });
    });
  }

  function setContext(products, prefix) {
    ctx.products = products || [];
    ctx.prefix = prefix || '';
  }

  function bind(products, prefix) {
    setContext(products, prefix);
    var compareBtn = document.getElementById('compare-pdf-btn');
    var quoteBtn = document.getElementById('compare-quote-pdf-btn');
    if (compareBtn) {
      compareBtn.onclick = function (e) {
        if (e) e.preventDefault();
        download(ctx.products, ctx.prefix);
      };
    }
    if (quoteBtn) {
      quoteBtn.onclick = function (e) {
        if (e) e.preventDefault();
        downloadQuote(ctx.products, ctx.prefix);
      };
    }
  }

  global.DuruComparePdf = {
    download: download,
    downloadQuote: downloadQuote,
    bind: bind,
    setContext: setContext
  };
})(window);
