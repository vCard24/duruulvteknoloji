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
      '<table class="pdf-compare-table"><thead><tr><th>Özellik</th>' + headCells +
      '</tr></thead><tbody>' + bodyRows + '</tbody></table>';

    var sheet = ensureSheet();
    sheet.innerHTML =
      '<div class="pdf-doc">' +
      U.pdfHeader('Ürün Karşılaştırması', products.length + ' model · ' + U.dateStr()) +
      U.pdfBlock('Teknik karşılaştırma tablosu', tableHtml) +
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
      message:
        'Karşılaştırma listesinden oluşturulmuş taslak talep belgesi. Resmi teklif için formu doldurup gönderin.',
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
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'PDF hazırlanıyor…';
    }
    return Promise.resolve()
      .then(work)
      .catch(function (err) {
        alert((err && err.message) || 'PDF oluşturulamadı.');
      })
      .finally(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = idleLabel;
        }
      });
  }

  function download(products, prefix) {
    var list = products || ctx.products;
    var pfx = prefix || ctx.prefix || (global.DuruPdfUtils && global.DuruPdfUtils.sitePrefix());
    if (!list || !list.length) {
      alert('PDF için en az bir ürün seçin.');
      return Promise.resolve();
    }
    if (!global.DuruPdfUtils) {
      alert('PDF kütüphaneleri yüklenemedi.');
      return Promise.resolve();
    }

    return withBusy('compare-pdf-btn', 'Karşılaştırma PDF', function () {
      var sheet = buildSheet(list, pfx);
      if (!sheet) throw new Error('PDF hazırlanamadı');
      return global.DuruPdfUtils.downloadSheet(sheet, 'duru-ulv-karsilastirma.pdf');
    });
  }

  function downloadQuote(products, prefix) {
    var list = products || ctx.products;
    if (!list || !list.length) {
      alert('Teklif PDF için en az bir ürün seçin.');
      return Promise.resolve();
    }
    if (!global.DuruQuotePdf || !global.DuruQuotePdf.downloadPayload) {
      alert('Teklif PDF modülü yüklenemedi. Sayfayı yenileyip tekrar deneyin.');
      return Promise.resolve();
    }

    return withBusy('compare-quote-pdf-btn', 'Teklif PDF', function () {
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
