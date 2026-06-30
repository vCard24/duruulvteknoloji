/**
 * Duru ULV — PDF yardımcıları (html2canvas + jsPDF)
 */
(function (global) {
  'use strict';

  var LOGO_ASPECT = 160.72 / 297.97;
  var LOGO_DISPLAY_W = 104;
  var LOGO_DISPLAY_H = Math.round(LOGO_DISPLAY_W * LOGO_ASPECT);
  var logoDataUrl = '';

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
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

  function logoUrl() {
    return new URL(sitePrefix() + 'assets/img/duru-hd-logo.svg', window.location.href).href;
  }

  function getHtml2Canvas() {
    return global.html2canvas || null;
  }

  function getJsPDF() {
    var lib = global.jspdf;
    if (!lib) return null;
    return lib.jsPDF || lib.default || null;
  }

  function dateStr() {
    var now = new Date();
    return ('0' + now.getDate()).slice(-2) + '.' +
      ('0' + (now.getMonth() + 1)).slice(-2) + '.' +
      now.getFullYear();
  }

  function logoSrc() {
    return logoDataUrl || logoUrl();
  }

  function pdfHeader(title, subtitle) {
    return '<header class="pdf-doc__header">' +
      '<div class="pdf-doc__logo">' +
      '<img class="pdf-doc__logo-img" src="' + esc(logoSrc()) + '" alt="Duru ULV" width="' + LOGO_DISPLAY_W + '" height="' + LOGO_DISPLAY_H + '">' +
      '</div>' +
      '<div class="pdf-doc__header-main">' +
      '<h1>' + esc(title) + '</h1>' +
      '<p class="pdf-doc__date">' + esc(subtitle || ('Tarih: ' + dateStr())) + '</p>' +
      '</div></header>';
  }

  function pdfFooter() {
    return '<footer class="pdf-doc__footer">' +
      '<p><strong>Duru ULV Teknoloji Sistemleri</strong><br>' +
      '+90 352 320 20 86 · info@entosis.com.tr · www.duruulvteknoloji.com.tr</p>' +
      '<p style="margin-top:6px">Bu belge bilgilendirme amaçlıdır; bağlayıcı teklif niteliği taşımaz.</p>' +
      '</footer>';
  }

  function pdfBlock(title, bodyHtml) {
    return '<div class="pdf-block"><div class="pdf-block__head">' + esc(title) +
      '</div><div class="pdf-block__body">' + bodyHtml + '</div></div>';
  }

  function rasterizeToDataUrl(imgEl, maxDim, format) {
    if (!imgEl || !imgEl.naturalWidth) return '';
    try {
      var w = imgEl.naturalWidth;
      var h = imgEl.naturalHeight;
      var max = maxDim || 320;
      if (w > max || h > max) {
        if (w >= h) {
          h = Math.max(1, Math.round((h * max) / w));
          w = max;
        } else {
          w = Math.max(1, Math.round((w * max) / h));
          h = max;
        }
      }
      var canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(imgEl, 0, 0, w, h);
      return canvas.toDataURL(format || 'image/jpeg', 0.9);
    } catch (e) {
      return '';
    }
  }

  function loadImage(url) {
    return new Promise(function (resolve) {
      if (!url) {
        resolve(null);
        return;
      }
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = url;
    });
  }

  function blobToDataUrl(blob) {
    return new Promise(function (resolve) {
      if (!blob) {
        resolve('');
        return;
      }
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result || ''); };
      reader.onerror = function () { resolve(''); };
      reader.readAsDataURL(blob);
    });
  }

  function ensureLogoDataUrl() {
    if (logoDataUrl) return Promise.resolve(logoDataUrl);

    return fetch(logoUrl())
      .then(function (r) { return r.ok ? r.blob() : null; })
      .then(function (blob) {
        if (!blob) return loadImage(logoUrl());
        var objUrl = URL.createObjectURL(blob);
        return loadImage(objUrl).then(function (img) {
          URL.revokeObjectURL(objUrl);
          return img;
        });
      })
      .then(function (img) {
        if (!img) return '';
        var rasterW = LOGO_DISPLAY_W * 2;
        var rasterH = Math.round(rasterW * LOGO_ASPECT);
        var canvas = document.createElement('canvas');
        canvas.width = rasterW;
        canvas.height = rasterH;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rasterW, rasterH);
        ctx.drawImage(img, 0, 0, rasterW, rasterH);
        logoDataUrl = canvas.toDataURL('image/png');
        return logoDataUrl;
      })
      .catch(function () { return ''; });
  }

  function waitForOneImage(img) {
    return new Promise(function (resolve) {
      if (img.complete && img.naturalWidth > 0) {
        resolve();
        return;
      }
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    });
  }

  function waitForImages(sheet) {
    var imgs = sheet.querySelectorAll('img');
    if (!imgs.length) return Promise.resolve();
    return Promise.all(Array.prototype.map.call(imgs, waitForOneImage));
  }

  function inlineImages(sheet) {
    var imgs = sheet.querySelectorAll('img');
    var tasks = [];
    imgs.forEach(function (img) {
      if (img.classList.contains('pdf-doc__logo-img') && logoDataUrl) {
        img.src = logoDataUrl;
        return;
      }
      var src = img.getAttribute('src') || img.src || '';
      if (!src || src.indexOf('data:') === 0) return;
      tasks.push(
        fetch(src)
          .then(function (r) { return r.ok ? r.blob() : null; })
          .then(blobToDataUrl)
          .then(function (dataUrl) {
            if (dataUrl) img.src = dataUrl;
          })
          .catch(function () { /* görsel yüklenemezse devam */ })
      );
    });
    return Promise.all(tasks);
  }

  function applyRasterizedImage(img, dataUrl, displayW, displayH) {
    if (!dataUrl) return waitForOneImage(img);
    img.src = dataUrl;
    img.setAttribute('src', dataUrl);
    if (displayW && displayH) {
      img.style.width = displayW + 'px';
      img.style.height = displayH + 'px';
      img.setAttribute('width', String(displayW));
      img.setAttribute('height', String(displayH));
    } else {
      img.style.width = 'auto';
      img.style.height = 'auto';
      img.removeAttribute('width');
      img.removeAttribute('height');
    }
    return waitForOneImage(img);
  }

  function prepareImagesForCapture(sheet) {
    var imgs = sheet.querySelectorAll('img');
    if (!imgs.length) return Promise.resolve();

    return Promise.all(Array.prototype.map.call(imgs, function (img) {
      if (img.classList.contains('pdf-doc__logo-img')) {
        if (logoDataUrl) {
          return applyRasterizedImage(img, logoDataUrl, LOGO_DISPLAY_W, LOGO_DISPLAY_H);
        }
        return waitForOneImage(img);
      }

      var src = img.getAttribute('src') || img.src || '';
      if (!src) return Promise.resolve();

      if (src.indexOf('data:image/jpeg') === 0 || src.indexOf('data:image/png') === 0) {
        return waitForOneImage(img);
      }

      return loadImage(src).then(function (loaded) {
        if (!loaded) return waitForOneImage(img);

        var isProduct = img.classList.contains('pdf-product-card__img');
        var isCompare = img.classList.contains('pdf-compare-table__product-img');
        var maxDim = isCompare ? 180 : 280;
        var dataUrl = rasterizeToDataUrl(loaded, maxDim, 'image/jpeg');
        if (!dataUrl) return waitForOneImage(img);

        if (isProduct) {
          var ratio = loaded.naturalWidth / Math.max(1, loaded.naturalHeight);
          var boxH = 88;
          var boxW = Math.min(120, Math.round(boxH * ratio));
          if (boxW > 120) {
            boxW = 120;
            boxH = Math.round(boxW / ratio);
          }
          return applyRasterizedImage(img, dataUrl, boxW, boxH);
        }

        if (isCompare) {
          var cRatio = loaded.naturalWidth / Math.max(1, loaded.naturalHeight);
          var cH = 48;
          var cW = Math.min(72, Math.round(cH * cRatio));
          if (cW > 72) {
            cW = 72;
            cH = Math.round(cW / cRatio);
          }
          return applyRasterizedImage(img, dataUrl, cW, cH);
        }

        return applyRasterizedImage(img, dataUrl);
      });
    }));
  }

  function patchLogoImages(sheet) {
    if (!logoDataUrl) return;
    sheet.querySelectorAll('.pdf-doc__logo-img').forEach(function (img) {
      img.src = logoDataUrl;
      img.setAttribute('width', String(LOGO_DISPLAY_W));
      img.setAttribute('height', String(LOGO_DISPLAY_H));
      img.style.width = LOGO_DISPLAY_W + 'px';
      img.style.height = LOGO_DISPLAY_H + 'px';
    });
  }

  function captureToCanvas(sheet, h2c) {
    var target = sheet.querySelector('.pdf-doc') || sheet;
    var sheetW = sheet.offsetWidth || 794;
    var baseOpts = {
      logging: false,
      backgroundColor: '#ffffff',
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: sheetW,
      width: sheetW
    };
    return h2c(target, Object.assign({ scale: 1.5 }, baseOpts)).catch(function () {
      return h2c(target, Object.assign({ scale: 1.25 }, baseOpts));
    }).catch(function () {
      return h2c(target, Object.assign({ scale: 1 }, baseOpts));
    });
  }

  function canvasToPdf(canvas, fileName) {
    var JsPDF = getJsPDF();
    if (!JsPDF) throw new Error('jsPDF yüklenemedi');

    var pdf = new JsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    var pageW = pdf.internal.pageSize.getWidth();
    var pageH = pdf.internal.pageSize.getHeight();
    var margin = 8;
    var imgW = pageW - margin * 2;
    var imgH = (canvas.height * imgW) / canvas.width;
    var usableH = pageH - margin * 2;

    var jpeg;
    try {
      jpeg = canvas.toDataURL('image/jpeg', 0.92);
    } catch (e) {
      jpeg = canvas.toDataURL('image/png');
    }
    var imgFormat = jpeg.indexOf('data:image/png') === 0 ? 'PNG' : 'JPEG';

    if (imgH <= usableH) {
      pdf.addImage(jpeg, imgFormat, margin, margin, imgW, imgH);
    } else {
      var sliceH = Math.max(1, Math.floor((usableH * canvas.width) / imgW));
      var srcY = 0;
      var pageIndex = 0;
      var guard = 0;
      while (srcY < canvas.height && guard < 24) {
        guard++;
        if (pageIndex > 0) pdf.addPage();
        var h = Math.min(sliceH, canvas.height - srcY);
        var pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = h;
        var ctx = pageCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, h);
        ctx.drawImage(canvas, 0, srcY, canvas.width, h, 0, 0, canvas.width, h);
        var sliceImgH = (h * imgW) / canvas.width;
        var sliceData;
        try {
          sliceData = pageCanvas.toDataURL('image/jpeg', 0.92);
          pdf.addImage(sliceData, 'JPEG', margin, margin, imgW, sliceImgH);
        } catch (e2) {
          sliceData = pageCanvas.toDataURL('image/png');
          pdf.addImage(sliceData, 'PNG', margin, margin, imgW, sliceImgH);
        }
        srcY += h;
        pageIndex++;
      }
    }

    pdf.save(fileName);
  }

  function ensureAssets() {
    return ensureLogoDataUrl();
  }

  function downloadSheet(sheet, fileName) {
    var h2c = getHtml2Canvas();
    var JsPDF = getJsPDF();
    if (!h2c || !JsPDF) {
      return Promise.reject(new Error('PDF kütüphaneleri yüklenemedi.'));
    }

    sheet.classList.add('is-capturing');
    var fontReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();

    return ensureAssets()
      .then(function () {
        patchLogoImages(sheet);
        return fontReady;
      })
      .then(function () { return inlineImages(sheet); })
      .then(function () { return prepareImagesForCapture(sheet); })
      .then(function () { return waitForImages(sheet); })
      .then(function () {
        return new Promise(function (resolve) {
          requestAnimationFrame(function () {
            requestAnimationFrame(resolve);
          });
        });
      })
      .then(function () { return captureToCanvas(sheet, h2c); })
      .then(function (canvas) {
        if (!canvas || !canvas.width || !canvas.height) {
          throw new Error('PDF oluşturulamadı (boş çıktı).');
        }
        canvasToPdf(canvas, fileName);
      })
      .finally(function () {
        sheet.classList.remove('is-capturing');
      });
  }

  global.DuruPdfUtils = {
    esc: esc,
    sitePrefix: sitePrefix,
    logoUrl: logoUrl,
    dateStr: dateStr,
    pdfHeader: pdfHeader,
    pdfFooter: pdfFooter,
    pdfBlock: pdfBlock,
    ensureAssets: ensureAssets,
    downloadSheet: downloadSheet
  };
})(window);
