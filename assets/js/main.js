/**
 * DURU ULV — Genel site etkileşimleri
 */
(function () {
  'use strict';

  /* Mobil menü */
  var toggle = document.querySelector('[data-mobile-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('mobile-nav-open', open);
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-nav-open');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-nav-open');
      }
    });
  }

  /* FAQ akordeon */
  document.querySelectorAll('[data-accordion]').forEach(function (accordion) {
    accordion.querySelectorAll('.accordion__trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('.accordion__item');
        var wasOpen = item.classList.contains('is-open');
        accordion.querySelectorAll('.accordion__item').forEach(function (el) {
          el.classList.remove('is-open');
          el.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });

  /* Ürün galerisi — hover önizleme + lightbox */
  (function initProductGalleries() {
    var lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'gallery-lightbox';
      lightbox.className = 'gallery-lightbox';
      lightbox.hidden = true;
      lightbox.innerHTML =
        '<div class="gallery-lightbox__backdrop" data-gallery-close></div>' +
        '<div class="gallery-lightbox__dialog" role="dialog" aria-modal="true" aria-label="Ürün görseli">' +
        '<button type="button" class="gallery-lightbox__close" data-gallery-close aria-label="Kapat">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
        '<button type="button" class="gallery-lightbox__nav gallery-lightbox__nav--prev" data-gallery-prev aria-label="Önceki görsel">' +
        '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>' +
        '</button>' +
        '<figure class="gallery-lightbox__figure">' +
        '<img class="gallery-lightbox__img" src="" alt="">' +
        '<figcaption class="gallery-lightbox__caption"></figcaption>' +
        '</figure>' +
        '<button type="button" class="gallery-lightbox__nav gallery-lightbox__nav--next" data-gallery-next aria-label="Sonraki görsel">' +
        '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>' +
        '</button>' +
        '<p class="gallery-lightbox__counter" aria-live="polite"></p>' +
        '</div>';
      document.body.appendChild(lightbox);
    }

    var lbImg = lightbox.querySelector('.gallery-lightbox__img');
    var lbCaption = lightbox.querySelector('.gallery-lightbox__caption');
    var lbCounter = lightbox.querySelector('.gallery-lightbox__counter');
    var lbItems = [];
    var lbIndex = 0;
    var lbGallery = null;

    function renderLightbox() {
      if (!lbItems.length) return;
      var item = lbItems[lbIndex];
      lbImg.src = item.src;
      lbImg.alt = item.alt;
      lbCaption.textContent = item.alt;
      lbCounter.textContent = lbIndex + 1 + ' / ' + lbItems.length;
      lightbox.querySelector('[data-gallery-prev]').disabled = lbItems.length <= 1;
      lightbox.querySelector('[data-gallery-next]').disabled = lbItems.length <= 1;
    }

    function openLightbox(gallery, index) {
      lbGallery = gallery;
      lbItems = Array.from(gallery.querySelectorAll('[data-gallery-thumb]')).map(function (t) {
        return { src: t.dataset.src || '', alt: t.dataset.alt || '' };
      }).filter(function (i) { return i.src; });
      if (!lbItems.length) return;
      lbIndex = Math.max(0, Math.min(index, lbItems.length - 1));
      renderLightbox();
      lightbox.hidden = false;
      document.body.classList.add('gallery-lightbox-open');
      lightbox.querySelector('.gallery-lightbox__close').focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.classList.remove('gallery-lightbox-open');
      lbImg.removeAttribute('src');
      if (lbGallery) {
        var trigger = lbGallery.querySelector('[data-gallery-open], .product-gallery__main');
        if (trigger) trigger.focus();
      }
      lbGallery = null;
    }

    function stepLightbox(delta) {
      if (!lbItems.length) return;
      lbIndex = (lbIndex + delta + lbItems.length) % lbItems.length;
      renderLightbox();
      if (lbGallery) {
        var thumbs = lbGallery.querySelectorAll('[data-gallery-thumb]');
        var mainImg = lbGallery.querySelector('[data-gallery-main]');
        thumbs.forEach(function (t, i) {
          t.classList.toggle('is-active', i === lbIndex);
        });
        if (mainImg && lbItems[lbIndex]) {
          mainImg.src = lbItems[lbIndex].src;
          mainImg.alt = lbItems[lbIndex].alt;
        }
        lbGallery.dataset.galleryIndex = String(lbIndex);
      }
    }

    lightbox.querySelector('[data-gallery-prev]').addEventListener('click', function () {
      stepLightbox(-1);
    });
    lightbox.querySelector('[data-gallery-next]').addEventListener('click', function () {
      stepLightbox(1);
    });
    lightbox.querySelectorAll('[data-gallery-close]').forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });

    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    });

    document.querySelectorAll('[data-product-gallery]').forEach(function (gallery) {
      var mainImg = gallery.querySelector('[data-gallery-main]');
      var mainArea = gallery.querySelector('.product-gallery__main');
      var thumbsWrap = gallery.querySelector('.product-gallery__thumbs');
      var thumbs = gallery.querySelectorAll('[data-gallery-thumb]');
      if (!mainImg || !thumbs.length) return;

      var activeIndex = 0;
      thumbs.forEach(function (t, i) {
        if (t.classList.contains('is-active')) activeIndex = i;
      });
      gallery.dataset.galleryIndex = String(activeIndex);

      function applyIndex(index) {
        var thumb = thumbs[index];
        if (!thumb || !mainImg) return;
        mainImg.src = thumb.dataset.src || mainImg.src;
        mainImg.alt = thumb.dataset.alt || mainImg.alt;
        gallery.dataset.galleryIndex = String(index);
      }

      function setActive(index) {
        activeIndex = index;
        thumbs.forEach(function (t, i) {
          t.classList.toggle('is-active', i === index);
        });
        applyIndex(index);
      }

      thumbs.forEach(function (thumb, index) {
        thumb.addEventListener('mouseenter', function () {
          applyIndex(index);
        });
        thumb.addEventListener('focus', function () {
          applyIndex(index);
        });
        thumb.addEventListener('click', function () {
          setActive(index);
        });
      });

      if (thumbsWrap) {
        thumbsWrap.addEventListener('mouseleave', function () {
          applyIndex(activeIndex);
        });
      }

      function openFromGallery() {
        var idx = parseInt(gallery.dataset.galleryIndex || '0', 10);
        if (Number.isNaN(idx)) idx = activeIndex;
        openLightbox(gallery, idx);
      }

      if (mainArea) {
        mainArea.setAttribute('role', 'button');
        mainArea.setAttribute('tabindex', '0');
        mainArea.setAttribute('aria-label', 'Görseli büyüt');
        mainArea.addEventListener('click', openFromGallery);
        mainArea.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFromGallery();
          }
        });
      }
    });
  })();

  /* Karşılaştırma rozeti — compare.js günceller; yedek senkron */
  if (window.DuruCompare && window.DuruCompare.updateCompareBadges) {
    window.DuruCompare.updateCompareBadges();
  }

  /* Aktif nav linki */
  var path = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
  document.querySelectorAll('[data-nav-link]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var linkPath = href.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
    if (path === linkPath || (linkPath !== '/' && path.endsWith(linkPath))) {
      link.classList.add('is-active');
    }
  });
})();
