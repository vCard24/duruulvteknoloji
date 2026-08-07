/**
 * Duru ULV — Karşılaştırma PDF indirme
 */
(function (global) {
  'use strict';

  var sheetId = 'compare-pdf-sheet';

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
      if (rows[i].ozellik === key) return rows[i].deger;
    }
    return '—';
  }

  function buildSheet(products, prefix) {
    var U = global.DuruPdfUtils;
    if (!U) return null;

    var keys = [];
    var seen = {};
    products.forEach(function (p) {
      (p.teknik_tablo || []).forEach(function (row) {
        if (row && row.ozellik && !seen[row.ozellik]) {
          seen[row.ozellik] = true;
          keys.push(row.ozellik);
        }
      });
    });

    var headCells = products.map(function (p) {
      var img = prefix + 'assets/img/products/' + p.slug + '-01.webp';
      return '<th style="text-align:center;min-width:90px">' +
        '<img class="pdf-compare-table__product-img" src="' + U.esc(img) + '" alt="">' +
        '<div style="font-size:9px;opacity:0.85">' + U.esc(p.model_kodu) + '</div>' +
        '<div style="font-size:11px;font-weight:700">' + U.esc(p.ad_tr) + '</div></th>';
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

  function download(products, prefix) {
    if (!products || !products.length) {
      alert('PDF için en az bir ürün seçin.');
      return Promise.resolve();
    }
    var sheet = buildSheet(products, prefix || global.DuruPdfUtils.sitePrefix());
    if (!sheet) return Promise.reject(new Error('PDF hazırlanamadı'));

    var btn = document.getElementById('compare-pdf-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'PDF hazırlanıyor…';
    }

    return global.DuruPdfUtils.downloadSheet(sheet, 'duru-ulv-karsilastirma.pdf')
      .catch(function (err) {
        alert(err.message || 'PDF oluşturulamadı.');
      })
      .finally(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'PDF İndir';
        }
      });
  }

  function bind(products, prefix) {
    var btn = document.getElementById('compare-pdf-btn');
    if (!btn) return;
    var list = products;
    var pfx = prefix;
    btn.onclick = function () {
      download(list, pfx);
    };
  }

  global.DuruComparePdf = {
    download: download,
    bind: bind
  };
})(window);
