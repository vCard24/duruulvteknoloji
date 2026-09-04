/**
 * Ortak site header / footer — tüm sayfa üreticileri bu modülü kullanır.
 */
const fs = require('fs');
const path = require('path');
const { whatsappButton } = require('./whatsapp-button');

const ROOT = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/urunler.json'), 'utf8'));
const k = data.kurumsal_bilgiler;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function resolveProductsHref(prefix) {
  if (prefix === '../../../') return '../../index.html';
  if (prefix === '../../') return '../index.html';
  if (prefix === '../') return 'index.html';
  return `${prefix}urunler/index.html`;
}

const MOBILE_TOGGLE_SVG =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';

const ICON_INSTAGRAM =
  '<svg class="social-links__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>';

const ICON_FACEBOOK =
  '<svg class="social-links__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';

/** Footer marka kolonu + iletişim: Instagram / Facebook */
function socialLinksHtml(options = {}) {
  const mod = options.modifier ? ` social-links--${options.modifier}` : '';
  const sosyal = k.sosyal || {};
  const items = [];
  if (sosyal.instagram) {
    items.push(
      `<a class="social-links__link" href="${esc(sosyal.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Duru ULV Instagram">${ICON_INSTAGRAM}<span class="social-links__text">Instagram</span></a>`
    );
  }
  if (sosyal.facebook) {
    items.push(
      `<a class="social-links__link" href="${esc(sosyal.facebook)}" target="_blank" rel="noopener noreferrer" aria-label="Duru ULV Facebook">${ICON_FACEBOOK}<span class="social-links__text">Facebook</span></a>`
    );
  }
  if (!items.length) return '';
  return `<nav class="social-links${mod}" aria-label="Sosyal medya">${items.join('')}</nav>`;
}

function siteHeader(options = {}) {
  const prefix = options.prefix ?? '';
  const productsHref = options.productsHref ?? `${prefix}urunler/index.html`;
  const quoteHref = options.quoteHref ?? `${prefix}fiyat-teklifi/index.html`;
  const blogHref = options.blogHref ?? `${prefix}blog/index.html`;

  return `  <header class="site-header no-print">
    <div class="container site-header__inner">
      <a href="${prefix}index.html" class="site-logo">
        <img src="${prefix}assets/img/duru-hd-logo.svg" alt="Duru ULV Teknoloji Sistemleri" class="site-logo__img" width="298" height="161">
      </a>
      <nav class="site-nav" aria-label="Ana menü">
        <a href="${prefix}index.html" class="site-nav__link" data-nav-link>Anasayfa</a>
        <a href="${productsHref}" class="site-nav__link" data-nav-link>Ürünler</a>
        <a href="${prefix}katalog/index.html" class="site-nav__link" data-nav-link>Katalog</a>
        <a href="${blogHref}" class="site-nav__link" data-nav-link>Blog</a>
        <a href="${prefix}urun-karsilastirma/index.html" class="site-nav__link" data-nav-link data-compare-nav>Karşılaştır <span class="site-nav__badge" data-compare-count style="display:none">0</span></a>
        <a href="${prefix}hakkimizda/index.html" class="site-nav__link" data-nav-link>Hakkımızda</a>
        <a href="${prefix}iletisim/index.html" class="site-nav__link" data-nav-link>İletişim</a>
      </nav>
      <div class="header-actions">
        <button type="button" class="lang-switcher" aria-label="Dil seçici (yakında)" hidden disabled>TR ▾</button>
        <a href="${quoteHref}" class="btn btn--primary btn--sm header-cta">Teklif Al</a>
        <button type="button" class="mobile-toggle" data-mobile-toggle aria-expanded="false" aria-controls="site-mobile-menu" aria-label="Menüyü aç/kapat">${MOBILE_TOGGLE_SVG}</button>
      </div>
    </div>
    <div class="mobile-menu" id="site-mobile-menu" data-mobile-menu>
      <div class="container">
        <a href="${prefix}index.html" class="mobile-menu__link" data-nav-link>Anasayfa</a>
        <a href="${productsHref}" class="mobile-menu__link" data-nav-link>Ürünler</a>
        <a href="${prefix}katalog/index.html" class="mobile-menu__link" data-nav-link>Katalog</a>
        <a href="${blogHref}" class="mobile-menu__link" data-nav-link>Blog</a>
        <a href="${prefix}urun-karsilastirma/index.html" class="mobile-menu__link" data-compare-nav>Karşılaştır <span class="site-nav__badge" data-compare-count style="display:none">0</span></a>
        <a href="${prefix}hakkimizda/index.html" class="mobile-menu__link" data-nav-link>Hakkımızda</a>
        <a href="${prefix}iletisim/index.html" class="mobile-menu__link" data-nav-link>İletişim</a>
        <a href="${quoteHref}" class="btn btn--primary btn--block" style="margin-top:0.75rem">Teklif Al</a>
      </div>
    </div>
  </header>`;
}

function siteFooter(options = {}) {
  const prefix = options.prefix ?? '';
  const blogHref = options.blogHref ?? `${prefix}blog/index.html`;
  const certBadges = k.sertifikalar
    .slice(0, 7)
    .map((c) => `<span class="cert-badge">${esc(c)}</span>`)
    .join('\n          ');

  return `  <footer class="site-footer no-print">
    <div class="container site-footer__inner">
      <div class="site-footer__grid">
        <div class="site-footer__brand">
          <a href="${prefix}index.html" class="site-logo">
            <img src="${prefix}assets/img/duru-hd-beyaz-logo.svg" alt="Duru ULV Teknoloji Sistemleri" class="site-logo__img site-logo__img--dark" width="298" height="161">
          </a>
          <p>1990'dan beri dezenfeksiyon, haşere kontrolü ve tarımsal ilaçlama için Ultra Low Volume (ULV) makineleri üreten Türkiye merkezli kurumsal bir mühendislik firmasıyız.</p>
          ${socialLinksHtml({ modifier: 'footer' })}
        </div>
        <div>
          <h4 class="site-footer__heading">Site</h4>
          <ul class="site-footer__links">
            <li><a href="${prefix}index.html">Anasayfa</a></li>
            <li><a href="${prefix}urunler/index.html">Ürünler</a></li>
            <li><a href="${prefix}katalog/index.html">Katalog</a></li>
            <li><a href="${blogHref}">Blog</a></li>
            <li><a href="${prefix}urun-karsilastirma/index.html" data-compare-nav>Karşılaştır</a></li>
            <li><a href="${prefix}hakkimizda/index.html">Hakkımızda</a></li>
            <li><a href="${prefix}kalite-politikamiz/index.html">Kalite Politikamız</a></li>
            <li><a href="${prefix}iletisim/index.html">İletişim</a></li>
          </ul>
        </div>
        <div>
          <h4 class="site-footer__heading">İletişim</h4>
          <ul class="site-footer__contact">
            <li><a href="tel:+903523202086">${esc(k.telefon)}</a></li>
            <li><a href="https://wa.me/${k.whatsapp}" target="_blank" rel="noopener">WhatsApp: +90 532 065 91 17</a></li>
            <li><a href="mailto:${k.email}">${esc(k.email)}</a></li>
            <li>${esc(k.adres.satir1)}<br>${esc(k.adres.satir2)}</li>
          </ul>
        </div>
      </div>
      <div class="site-footer__certs">
        <h4 class="site-footer__heading">Sertifikalar &amp; Onaylar</h4>
        <div class="site-footer__cert-list">${certBadges}</div>
      </div>
      <div class="site-footer__bottom">
        <div>© ${new Date().getFullYear()} Duru ULV Teknoloji Sistemleri. Tüm hakları saklıdır.</div>
        <div class="site-footer__legal">
          <a href="${prefix}gizlilik-politikasi/index.html">Gizlilik</a>
          <a href="${prefix}kvkk/index.html">KVKK</a>
          <a href="${prefix}kullanim-kosullari/index.html">Kullanım Koşulları</a>
        </div>
      </div>
    </div>
  </footer>

${whatsappButton(prefix, k.whatsapp)}`;
}

module.exports = {
  siteHeader,
  siteFooter,
  socialLinksHtml,
  resolveProductsHref,
  esc,
  kurumsal: k,
};
