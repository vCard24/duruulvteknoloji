/**
 * DURU ULV — Karşılaştırma (localStorage + URL, max 4 ürün)
 */
(function (global) {
  'use strict';

  var PARAM = 'compare';
  var MAX = 4;
  var STORAGE_KEY = 'duru_compare_slugs';
  var SESSION_KEY = 'duru_compare_slugs';

  function readStorage() {
    var sources = [
      function () {
        return localStorage.getItem(STORAGE_KEY);
      },
      function () {
        return sessionStorage.getItem(SESSION_KEY);
      }
    ];

    for (var i = 0; i < sources.length; i++) {
      try {
        var raw = sources[i]();
        if (!raw) continue;
        var parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) continue;
        var clean = parsed.map(function (s) { return String(s).trim(); }).filter(Boolean).slice(0, MAX);
        if (clean.length) return clean;
      } catch (e) {
        /* storage kapalı olabilir */
      }
    }

    return [];
  }

  function writeStorage(slugs) {
    var clean = slugs.slice(0, MAX);
    var json = JSON.stringify(clean);

    try {
      localStorage.setItem(STORAGE_KEY, json);
    } catch (e) {
      /* file:// veya gizli mod */
    }

    try {
      sessionStorage.setItem(SESSION_KEY, json);
    } catch (e) {
      /* yedek depolama */
    }

    updateCompareBadges(clean.length);
    return clean;
  }

  function parseSlugsFromUrl(search) {
    var params = new URLSearchParams(search || window.location.search);
    var multi = params.getAll(PARAM).map(function (s) { return s.trim(); }).filter(Boolean);

    if (multi.length > 1) return multi.slice(0, MAX);

    if (multi.length === 1) {
      if (multi[0].indexOf(',') !== -1) {
        return multi[0].split(',').map(function (s) { return s.trim(); }).filter(Boolean).slice(0, MAX);
      }
      return [multi[0]];
    }

    var raw = params.get(PARAM);
    if (!raw) return [];
    return raw.split(',').map(function (s) { return decodeURIComponent(s).trim(); }).filter(Boolean).slice(0, MAX);
  }

  function isComparePage() {
    return /\/urun-karsilastirma(\/index\.html)?\/?$/i.test(window.location.pathname) ||
      window.location.pathname.indexOf('urun-karsilastirma') !== -1;
  }

  function getSitePrefix() {
    var link = document.querySelector('link[href*="assets/"]');
    if (link) {
      var href = link.getAttribute('href') || '';
      var idx = href.indexOf('assets/');
      if (idx !== -1) return href.slice(0, idx);
    }

    var parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length && /\.html?$/i.test(parts[parts.length - 1])) {
      parts.pop();
    }
    return parts.length ? '../'.repeat(parts.length) : '';
  }

  function getEffectiveSlugs() {
    var stored = readStorage();
    var fromUrl = parseSlugsFromUrl();

    if (fromUrl.length && !stored.length) {
      return writeStorage(fromUrl);
    }

    if (fromUrl.length && stored.length) {
      var merged = stored.slice();
      fromUrl.forEach(function (slug) {
        if (merged.indexOf(slug) === -1 && merged.length < MAX) merged.push(slug);
      });
      if (merged.length !== stored.length) {
        return writeStorage(merged);
      }
    }

    if (stored.length) return stored;
    if (fromUrl.length) return writeStorage(fromUrl);
    return [];
  }

  function getSlugs() {
    return getEffectiveSlugs();
  }

  function resolveUrl(basePath) {
    var path = basePath || resolveComparePath();
    return new URL(path, window.location.href);
  }

  function buildUrl(slugs, basePath) {
    var url = resolveUrl(basePath);
    url.searchParams.delete(PARAM);
    slugs.slice(0, MAX).forEach(function (slug) {
      url.searchParams.append(PARAM, slug);
    });
    return url.href;
  }

  function syncCompareUrl(slugs) {
    if (!isComparePage()) return;
    var list = slugs && slugs.length ? slugs : readStorage();
    if (!list.length) return;

    var target = buildUrl(list, resolveComparePath());
    if (window.location.href.split('#')[0] !== target.split('#')[0]) {
      window.history.replaceState(null, '', target);
    }
  }

  function getCompareLinkBase(link) {
    var stored = link.getAttribute('data-compare-base');
    if (stored) return stored;

    var href = (link.getAttribute('href') || '').split('?')[0].split('#')[0];
    if (!href) {
      href = resolveComparePath();
    }
    link.setAttribute('data-compare-base', href);
    return href;
  }

  function addSlug(slug) {
    var slugs = readStorage();
    if (slugs.indexOf(slug) !== -1) return slugs;
    if (slugs.length >= MAX) {
      alert('Karşılaştırmaya en fazla 4 ürün eklenebilir.');
      return slugs;
    }
    return writeStorage(slugs.concat(slug));
  }

  function removeSlug(slug) {
    return writeStorage(readStorage().filter(function (s) { return s !== slug; }));
  }

  function navigateCompare(slugs, comparePagePath) {
    var list = slugs && slugs.length ? slugs : readStorage();
    window.location.href = buildUrl(list, comparePagePath || resolveComparePath());
  }

  function updateCompareBadges(count) {
    var n = typeof count === 'number' ? count : readStorage().length;
    document.querySelectorAll('[data-compare-count]').forEach(function (el) {
      el.textContent = String(n);
      el.style.display = n > 0 ? 'inline-flex' : 'none';
    });
  }

  function updateCompareNavLinks() {
    var slugs = readStorage();
    document.querySelectorAll('[data-compare-nav]').forEach(function (link) {
      link.setAttribute('href', buildUrl(slugs, getCompareLinkBase(link)));
    });
  }

  function resolveComparePath() {
    return getSitePrefix() + 'urun-karsilastirma/index.html';
  }

  function resolveDataUrl() {
    return getSitePrefix() + 'assets/data/urunler.json';
  }

  function loadProductCatalog() {
    var embed = document.getElementById('duru-urunler-embed');
    if (embed && embed.textContent) {
      try {
        return Promise.resolve(JSON.parse(embed.textContent));
      } catch (e) {
        /* gömülü veri bozuksa fetch dene */
      }
    }

    if (global.__DURU_URUNLER__) {
      return Promise.resolve(global.__DURU_URUNLER__);
    }

    return fetch(resolveDataUrl())
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
  }

  function findProduct(list, slug) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].slug === slug) return list[i];
    }
    return null;
  }

  function flashButton(btn) {
    btn.classList.add('compare-flash');
    window.setTimeout(function () {
      btn.classList.remove('compare-flash');
    }, 600);
  }

  function initCompareNavClicks() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('[data-compare-nav]');
      if (!link) return;
      e.preventDefault();
      e.stopPropagation();
      var slugs = readStorage();
      window.location.href = buildUrl(slugs, getCompareLinkBase(link));
    });
  }

  function initCompareButtons() {
    document.querySelectorAll('[data-compare-toggle]').forEach(function (btn) {
      var slug = btn.dataset.compareToggle;
      if (!slug) return;

      function syncState() {
        var slugs = readStorage();
        var active = slugs.indexOf(slug) !== -1;
        btn.classList.toggle('btn--accent-outline', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        var label = btn.querySelector('[data-compare-label]');
        if (label) {
          label.textContent = active ? 'Listede' : 'Karşılaştır';
        }
      }

      syncState();

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var slugs = readStorage();
        if (slugs.indexOf(slug) !== -1) {
          removeSlug(slug);
        } else {
          if (slugs.length >= MAX) {
            alert('Karşılaştırmaya en fazla 4 ürün eklenebilir.');
            return;
          }
          addSlug(slug);
        }

        syncState();
        updateCompareNavLinks();
        flashButton(btn);
      });
    });
  }

  function escHtml(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function applyCompareSlugs(slugList) {
    var list = slugList.slice(0, MAX);
    writeStorage(list);
    updateCompareNavLinks();
    if (isComparePage()) {
      window.history.replaceState(null, '', buildUrl(list, resolveComparePath()));
      renderComparePage();
    }
  }

  function initComparePageActions() {
    var root = document.getElementById('compare-app');
    if (!root || root._duruCompareActionsBound) return;
    root._duruCompareActionsBound = true;

    root.addEventListener('click', function (e) {
      if (!isComparePage()) return;

      var removeBtn = e.target.closest('[data-remove-slug]');
      if (removeBtn) {
        e.preventDefault();
        var slug = removeBtn.getAttribute('data-remove-slug');
        if (!slug) return;
        applyCompareSlugs(readStorage().filter(function (s) { return s !== slug; }));
        return;
      }

      if (e.target.closest('#compare-clear-all')) {
        e.preventDefault();
        applyCompareSlugs([]);
        return;
      }

      if (e.target.closest('#compare-print')) {
        e.preventDefault();
        window.print();
      }
    });
  }

  function showCompareError(root, message, slugs) {
    root.innerHTML =
      '<div class="container container--narrow" style="padding:2rem 0">' +
      '<p style="color:rgba(43,46,51,0.75);line-height:1.65;margin-bottom:1rem">' + escHtml(message) + '</p>' +
      (slugs && slugs.length
        ? '<p style="font-size:0.875rem;color:rgba(43,46,51,0.6)">Seçili slug: ' + escHtml(slugs.join(', ')) + '</p>'
        : '') +
      '<button type="button" class="btn btn--outline" id="compare-retry-clear" style="margin-top:1rem">Listeyi temizle</button>' +
      '</div>';

    var clearBtn = document.getElementById('compare-retry-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        applyCompareSlugs([]);
      });
    }
  }

  function renderComparePage() {
    var root = document.getElementById('compare-app');
    if (!root) return;

    var slugs = getEffectiveSlugs();
    syncCompareUrl(slugs);

    var countEl = document.getElementById('compare-count-display');
    if (countEl) countEl.textContent = String(slugs.length);

    if (!slugs.length) {
      root.innerHTML =
        '<section class="section bg-muted">' +
        '  <div class="container container--narrow">' +
        '    <div class="empty-state">' +
        '      <div class="empty-state__icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg></div>' +
        '      <h2 class="section-title" style="font-size:1.5rem;margin-bottom:0.75rem">Henüz ürün seçmediniz</h2>' +
        '      <p style="color:rgba(43,46,51,0.7);max-width:28rem;margin:0 auto 2rem;line-height:1.65">Ürün sayfalarındaki <strong>Karşılaştır</strong> butonu ile listeye ekleyin (en fazla 4), ardından menüden <strong>Karşılaştır</strong> linkine tıklayın.</p>' +
        '      <a href="' + escHtml(getSitePrefix() + 'urunler/index.html') + '" class="btn btn--primary">Ürünleri Keşfet →</a>' +
        '    </div>' +
        '  </div>' +
        '</section>';
      return;
    }

    var prefix = getSitePrefix();

    loadProductCatalog()
      .then(function (data) {
        if (!data || !Array.isArray(data.urunler)) {
          throw new Error('Ürün verisi geçersiz');
        }

        var products = [];
        slugs.forEach(function (slug) {
          var product = findProduct(data.urunler, slug);
          if (product) products.push(product);
        });

        if (!products.length) {
          showCompareError(root, 'Seçili ürünler bulunamadı. Listeyi temizleyip yeniden ekleyin.', slugs);
          return;
        }

        if (countEl) countEl.textContent = String(products.length);

        var keys = [];
        var seen = {};
        products.forEach(function (p) {
          var rows = p.teknik_tablo || [];
          rows.forEach(function (row) {
            if (row && row.ozellik && !seen[row.ozellik]) {
              seen[row.ozellik] = true;
              keys.push(row.ozellik);
            }
          });
        });

        function productUrl(p) {
          return prefix + 'urunler/' + p.kategori_slug + '/' + p.slug + '/index.html';
        }

        function imageUrl(slug) {
          return prefix + 'assets/img/products/' + slug + '-01.webp';
        }

        function getValue(product, key) {
          var rows = product.teknik_tablo || [];
          for (var i = 0; i < rows.length; i++) {
            if (rows[i].ozellik === key) return rows[i].deger;
          }
          return '—';
        }

        var headCells = products.map(function (p) {
          return '<th class="compare-table__head-cell">' +
            '<button type="button" class="compare-table__remove no-print" data-remove-slug="' + escHtml(p.slug) + '" aria-label="Listeden çıkar" title="Listeden çıkar">×</button>' +
            '<div class="compare-table__product-img"><img src="' + escHtml(imageUrl(p.slug)) + '" alt="' + escHtml(p.ad_tr) + '" loading="lazy"></div>' +
            '<div class="product-card__model">' + escHtml(p.model_kodu) + '</div>' +
            '<a href="' + escHtml(productUrl(p)) + '" style="font-family:var(--font-display);font-weight:600;color:var(--color-primary);text-decoration:none;display:block;margin-top:0.25rem">' + escHtml(p.ad_tr) + '</a>' +
            '</th>';
        }).join('');

        var bodyRows = keys.map(function (key) {
          var cells = products.map(function (p) {
            return '<td>' + escHtml(getValue(p, key)) + '</td>';
          }).join('');
          return '<tr><th scope="row">' + escHtml(key) + '</th>' + cells + '</tr>';
        }).join('');

        var actionRow = products.map(function (p) {
          return '<td class="compare-table__actions no-print">' +
            '<div class="compare-table__actions-inner">' +
            '<a href="' + escHtml(productUrl(p)) + '" class="btn btn--outline btn--sm">İncele</a>' +
            '<a href="' + escHtml(prefix + 'fiyat-teklifi/index.html?products=' + encodeURIComponent(p.slug)) + '" class="btn btn--primary btn--sm">Teklif Al</a>' +
            '<button type="button" class="btn btn--outline btn--sm compare-table__remove-btn" data-remove-slug="' + escHtml(p.slug) + '">Listeden çıkar</button>' +
            '</div></td>';
        }).join('');

        root.innerHTML =
          '<section class="section bg-muted">' +
          '  <div class="container">' +
          '    <div class="no-print" style="display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:space-between;align-items:center;margin-bottom:1.5rem">' +
          '      <div style="display:flex;flex-wrap:wrap;gap:0.75rem">' +
          '        <button type="button" class="btn btn--outline btn--sm" id="compare-clear-all">Tümünü temizle</button>' +
          '        <button type="button" class="btn btn--outline btn--sm" id="compare-print">Yazdır</button>' +
          '        <button type="button" class="btn btn--outline btn--sm btn-pdf-export" id="compare-pdf-btn">PDF İndir</button>' +
          '      </div>' +
          '      <a href="' + escHtml(prefix + 'fiyat-teklifi/index.html?products=' + encodeURIComponent(slugs.join(','))) + '" class="btn btn--primary">Seçili ürünler için teklif al →</a>' +
          '    </div>' +
          '    <div class="compare-table-wrap">' +
          '      <table class="compare-table">' +
          '        <thead><tr><th>Özellik</th>' + headCells + '</tr></thead>' +
          '        <tbody>' + bodyRows +
          '          <tr class="no-print"><th scope="row" style="background:var(--color-primary);color:white;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.16em">Aksiyon</th>' + actionRow + '</tr>' +
          '        </tbody>' +
          '      </table>' +
          '    </div>' +
          '  </div>' +
          '</section>';

        if (global.DuruComparePdf && global.DuruComparePdf.bind) {
          global.DuruComparePdf.bind(products, prefix);
        }
      })
      .catch(function () {
        showCompareError(
          root,
          'Ürün verisi yüklenemedi. Sayfayı yenileyin veya siteyi bir web sunucusu üzerinden açın (python -m http.server 8080).',
          slugs
        );
      });
  }

  function init() {
    var slugs = getEffectiveSlugs();
    syncCompareUrl(slugs);
    updateCompareBadges(slugs.length);
    updateCompareNavLinks();
    initCompareNavClicks();
    initCompareButtons();
    initComparePageActions();
    if (isComparePage()) {
      renderComparePage();
    }
  }

  global.DuruCompare = {
    PARAM: PARAM,
    MAX: MAX,
    getSlugs: getSlugs,
    readStorage: readStorage,
    setSlugs: writeStorage,
    parseSlugsFromUrl: parseSlugsFromUrl,
    buildUrl: buildUrl,
    addSlug: addSlug,
    removeSlug: removeSlug,
    applyCompareSlugs: applyCompareSlugs,
    navigateCompare: navigateCompare,
    initCompareButtons: initCompareButtons,
    resolveComparePath: resolveComparePath,
    resolveDataUrl: resolveDataUrl,
    updateCompareBadges: updateCompareBadges,
    updateCompareNavLinks: updateCompareNavLinks,
    renderComparePage: renderComparePage
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
