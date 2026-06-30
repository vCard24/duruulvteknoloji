/**
 * Karşılaştırma sayfası — compare.js içindeki renderComparePage kullanılır.
 * Bu dosya geriye dönük uyumluluk için compare.js'i yükledikten sonra çalışır.
 */
(function () {
  'use strict';
  if (window.DuruCompare && window.DuruCompare.renderComparePage) {
    window.DuruCompare.renderComparePage();
  }
})();
