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
    function galleryLang() {
      var lang = ((document.documentElement.getAttribute('lang') || document.documentElement.lang || 'tr') + '').toLowerCase();
      if (lang.indexOf('en') === 0) return 'en';
      if (lang.indexOf('ar') === 0) return 'ar';
      return 'tr';
    }

    var ARIA = {
      tr: {
        image: 'Ürün görseli',
        close: 'Kapat',
        prev: 'Önceki görsel',
        next: 'Sonraki görsel',
        zoom: 'Görseli büyüt',
        play: 'Videoyu oynat'
      },
      en: {
        image: 'Product image',
        close: 'Close',
        prev: 'Previous image',
        next: 'Next image',
        zoom: 'Enlarge image',
        play: 'Play video'
      },
      ar: {
        image: 'صورة المنتج',
        close: 'إغلاق',
        prev: 'الصورة السابقة',
        next: 'الصورة التالية',
        zoom: 'تكبير الصورة',
        play: 'تشغيل الفيديو'
      }
    };

    var aria = ARIA[galleryLang()] || ARIA.tr;

    var lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'gallery-lightbox';
      lightbox.className = 'gallery-lightbox';
      lightbox.hidden = true;
      lightbox.innerHTML =
        '<div class="gallery-lightbox__backdrop" data-gallery-close></div>' +
        '<div class="gallery-lightbox__dialog" role="dialog" aria-modal="true" aria-label="' + aria.image + '">' +
        '<button type="button" class="gallery-lightbox__close" data-gallery-close aria-label="' + aria.close + '">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
        '<button type="button" class="gallery-lightbox__nav gallery-lightbox__nav--prev" data-gallery-prev aria-label="' + aria.prev + '">' +
        '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>' +
        '</button>' +
        '<figure class="gallery-lightbox__figure">' +
        '<img class="gallery-lightbox__img" src="" alt="">' +
        '<figcaption class="gallery-lightbox__caption"></figcaption>' +
        '</figure>' +
        '<button type="button" class="gallery-lightbox__nav gallery-lightbox__nav--next" data-gallery-next aria-label="' + aria.next + '">' +
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
      lbItems = Array.from(gallery.querySelectorAll('[data-gallery-thumb]:not([data-gallery-video])')).map(function (t) {
        return { src: t.dataset.src || '', alt: t.dataset.alt || '', srcset: t.dataset.srcset || '' };
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
        var imageThumbs = Array.from(lbGallery.querySelectorAll('[data-gallery-thumb]:not([data-gallery-video])'));
        var allThumbs = lbGallery.querySelectorAll('[data-gallery-thumb]');
        var mainImg = lbGallery.querySelector('[data-gallery-main]');
        var activeThumb = imageThumbs[lbIndex];
        allThumbs.forEach(function (t) {
          t.classList.toggle('is-active', t === activeThumb);
        });
        if (mainImg && lbItems[lbIndex]) {
          mainImg.hidden = false;
          mainImg.src = lbItems[lbIndex].src;
          mainImg.alt = lbItems[lbIndex].alt;
          if (lbItems[lbIndex].srcset) {
            mainImg.srcset = lbItems[lbIndex].srcset;
          } else {
            mainImg.removeAttribute('srcset');
          }
          var videoHost = lbGallery.querySelector('[data-gallery-video-host]');
          if (videoHost) {
            videoHost.hidden = true;
            videoHost.innerHTML = '';
          }
          var videoCue = lbGallery.querySelector('[data-gallery-video-cue]');
          if (videoCue) videoCue.hidden = true;
          var mainArea = lbGallery.querySelector('.product-gallery__main');
          if (mainArea) {
            mainArea.classList.remove('is-video', 'is-playing');
            mainArea.setAttribute('aria-label', aria.zoom);
          }
        }
        if (activeThumb) {
          var galleryIndex = Array.prototype.indexOf.call(allThumbs, activeThumb);
          if (galleryIndex >= 0) lbGallery.dataset.galleryIndex = String(galleryIndex);
        }
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
      var videoHost = gallery.querySelector('[data-gallery-video-host]');
      var videoCue = gallery.querySelector('[data-gallery-video-cue]');
      var thumbsWrap = gallery.querySelector('.product-gallery__thumbs');
      var thumbs = gallery.querySelectorAll('[data-gallery-thumb]');
      if (!mainImg || !thumbs.length) return;

      var activeIndex = 0;
      thumbs.forEach(function (t, i) {
        if (t.classList.contains('is-active')) activeIndex = i;
      });
      gallery.dataset.galleryIndex = String(activeIndex);

      function setVideoCue(show) {
        if (!videoCue) return;
        videoCue.hidden = !show;
        if (show) {
          var label = videoCue.querySelector('.product-gallery__video-cue-label');
          if (label) label.textContent = aria.play;
        }
      }

      function clearVideo() {
        if (videoHost) {
          videoHost.hidden = true;
          videoHost.innerHTML = '';
        }
        if (mainArea) {
          mainArea.classList.remove('is-video', 'is-playing');
        }
        setVideoCue(false);
        mainImg.hidden = false;
      }

      function playVideo(thumb) {
        var id = thumb && thumb.dataset.galleryVideo;
        if (!id || !videoHost || !mainArea) return;
        /* file:// açılışında YouTube embed Error 153 verir; geçerli HTTP(S) origin gerekir */
        if (window.location.protocol === 'file:') {
          window.open('https://www.youtube.com/watch?v=' + encodeURIComponent(id), '_blank', 'noopener,noreferrer');
          return;
        }
        clearVideo();
        mainImg.src = thumb.dataset.src || mainImg.src;
        if (thumb.dataset.srcset) {
          mainImg.srcset = thumb.dataset.srcset;
        } else {
          mainImg.removeAttribute('srcset');
        }
        mainImg.alt = thumb.dataset.alt || mainImg.alt;
        mainImg.hidden = true;
        mainArea.classList.add('is-video', 'is-playing');
        mainArea.setAttribute('aria-label', aria.play);
        videoHost.hidden = false;
        var params = 'autoplay=1&rel=0&playsinline=1';
        if (/^https?:$/i.test(window.location.protocol) && window.location.origin) {
          params += '&origin=' + encodeURIComponent(window.location.origin);
        }
        videoHost.innerHTML =
          '<iframe src="https://www.youtube.com/embed/' +
          encodeURIComponent(id) +
          '?' +
          params +
          '" title="' +
          (thumb.dataset.alt || aria.play).replace(/"/g, '&quot;') +
          '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      }

      function applyIndex(index) {
        var thumb = thumbs[index];
        if (!thumb || !mainImg) return;
        clearVideo();
        mainImg.src = thumb.dataset.src || mainImg.src;
        if (thumb.dataset.srcset) {
          mainImg.srcset = thumb.dataset.srcset;
        } else {
          mainImg.removeAttribute('srcset');
        }
        mainImg.alt = thumb.dataset.alt || mainImg.alt;
        gallery.dataset.galleryIndex = String(index);
        if (mainArea) {
          if (thumb.dataset.galleryVideo) {
            mainArea.classList.add('is-video');
            mainArea.setAttribute('aria-label', aria.play);
            setVideoCue(true);
          } else {
            mainArea.setAttribute('aria-label', aria.zoom);
            setVideoCue(false);
          }
        }
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
        var thumb = thumbs[idx];
        if (thumb && thumb.dataset.galleryVideo) {
          if (mainArea && mainArea.classList.contains('is-playing')) return;
          playVideo(thumb);
          return;
        }
        var imageThumbs = Array.prototype.filter.call(thumbs, function (t) {
          return !t.dataset.galleryVideo;
        });
        var imageIdx = imageThumbs.indexOf(thumb);
        openLightbox(gallery, imageIdx >= 0 ? imageIdx : 0);
      }

      if (mainArea) {
        mainArea.setAttribute('role', 'button');
        mainArea.setAttribute('tabindex', '0');
        mainArea.setAttribute('aria-label', aria.zoom);
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
