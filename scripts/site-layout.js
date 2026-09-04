/**
 * Ortak site header / footer — tüm sayfa üreticileri bu modülü kullanır.
 */
const fs = require('fs');
const path = require('path');
const { whatsappButton } = require('./whatsapp-button');
const { alternatePath } = require('./seo-meta');
const { UI } = require('./i18n');

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

/** prefix + alternatePath → göreli index.html href */
function localePageHref(prefix, trPathRel, locale) {
  const p = alternatePath(trPathRel || 'index.html', locale);
  if (p === null || p === '') return `${prefix}index.html`;
  return `${prefix}${p}index.html`;
}

/** Locale-aware site path (TR: root, EN/AR: /en|/ar prefix) */
function localizedHref(prefix, locale, rel) {
  if (!locale || locale === 'tr') return `${prefix}${rel}`;
  return `${prefix}${locale}/${rel}`;
}

/** TR | EN | AR — aktif dil span, diğerleri link (SSG; alternatePath) */
function langSwitcherHtml(options = {}) {
  const prefix = options.prefix ?? '';
  const current = options.locale || 'tr';
  const trPathRel = options.trPathRel || 'index.html';
  const langs = [
    { code: 'tr', label: 'TR' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
  ];
  const parts = langs.map((L, i) => {
    const sep =
      i > 0 ? '<span class="lang-switcher__sep" aria-hidden="true">|</span>' : '';
    if (L.code === current) {
      return `${sep}<span class="lang-switcher__current" aria-current="true">${L.label}</span>`;
    }
    const href = localePageHref(prefix, trPathRel, L.code);
    return `${sep}<a class="lang-switcher__link" href="${esc(href)}" hreflang="${L.code}" lang="${L.code}">${L.label}</a>`;
  });
  return `<nav class="lang-switcher" aria-label="Language / Dil">${parts.join('')}</nav>`;
}

const MOBILE_TOGGLE_SVG =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';

const ICON_INSTAGRAM =
  '<svg class="social-links__icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>';

const ICON_FACEBOOK =
  '<svg class="social-links__icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';

/** Footer marka kolonu + iletişim: Instagram / Facebook */
function socialLinksHtml(options = {}) {
  const mod = options.modifier ? ` social-links--${options.modifier}` : '';
  const ui = UI[options.locale || 'tr'] || UI.tr;
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
  return `<nav class="social-links${mod}" aria-label="${esc(ui.socialAria)}">${items.join('')}</nav>`;
}

function siteHeader(options = {}) {
  const prefix = options.prefix ?? '';
  const locale = options.locale || 'tr';
  const ui = UI[locale] || UI.tr;
  const productsHref = options.productsHref ?? localizedHref(prefix, locale, locale === 'tr' ? 'urunler/index.html' : 'products/index.html');
  const quoteHref = options.quoteHref ?? localizedHref(prefix, locale, 'fiyat-teklifi/index.html');
  const homeHref = options.homeHref ?? localizedHref(prefix, locale, 'index.html');
  const catalogHref = options.catalogHref ?? localizedHref(prefix, locale, 'katalog/index.html');
  const blogHref = options.blogHref ?? localizedHref(prefix, locale, 'blog/index.html');
  const compareHref = options.compareHref ?? localizedHref(prefix, locale, 'urun-karsilastirma/index.html');
  const aboutHref = options.aboutHref ?? localizedHref(prefix, locale, 'hakkimizda/index.html');
  const contactHref = options.contactHref ?? localizedHref(prefix, locale, 'iletisim/index.html');
  const trPathRel = options.trPathRel || 'index.html';
  const switcher = langSwitcherHtml({ prefix, locale, trPathRel });

  return `  <header class="site-header no-print">
    <div class="container site-header__inner">
      <a href="${homeHref}" class="site-logo">
        <img src="${prefix}assets/img/duru-hd-logo.svg" alt="Duru ULV" class="site-logo__img" width="298" height="161">
      </a>
      <nav class="site-nav" aria-label="${esc(ui.navAria)}">
        <a href="${homeHref}" class="site-nav__link" data-nav-link>${esc(ui.home)}</a>
        <a href="${productsHref}" class="site-nav__link" data-nav-link>${esc(ui.products)}</a>
        <a href="${catalogHref}" class="site-nav__link" data-nav-link>${esc(ui.catalog)}</a>
        <a href="${blogHref}" class="site-nav__link" data-nav-link>${esc(ui.blog)}</a>
        <a href="${compareHref}" class="site-nav__link" data-nav-link data-compare-nav>${esc(ui.compare)} <span class="site-nav__badge" data-compare-count style="display:none">0</span></a>
        <a href="${aboutHref}" class="site-nav__link" data-nav-link>${esc(ui.about)}</a>
        <a href="${contactHref}" class="site-nav__link" data-nav-link>${esc(ui.contact)}</a>
      </nav>
      <div class="header-actions">
        ${switcher}
        <a href="${quoteHref}" class="btn btn--primary btn--sm header-cta">${esc(ui.quote)}</a>
        <button type="button" class="mobile-toggle" data-mobile-toggle aria-expanded="false" aria-controls="site-mobile-menu" aria-label="${esc(ui.menuToggle)}">${MOBILE_TOGGLE_SVG}</button>
      </div>
    </div>
    <div class="mobile-menu" id="site-mobile-menu" data-mobile-menu>
      <div class="container">
        <div class="mobile-menu__lang">${switcher}</div>
        <a href="${homeHref}" class="mobile-menu__link" data-nav-link>${esc(ui.home)}</a>
        <a href="${productsHref}" class="mobile-menu__link" data-nav-link>${esc(ui.products)}</a>
        <a href="${catalogHref}" class="mobile-menu__link" data-nav-link>${esc(ui.catalog)}</a>
        <a href="${blogHref}" class="mobile-menu__link" data-nav-link>${esc(ui.blog)}</a>
        <a href="${compareHref}" class="mobile-menu__link" data-compare-nav>${esc(ui.compare)} <span class="site-nav__badge" data-compare-count style="display:none">0</span></a>
        <a href="${aboutHref}" class="mobile-menu__link" data-nav-link>${esc(ui.about)}</a>
        <a href="${contactHref}" class="mobile-menu__link" data-nav-link>${esc(ui.contact)}</a>
        <a href="${quoteHref}" class="btn btn--primary btn--block" style="margin-top:0.75rem">${esc(ui.quote)}</a>
      </div>
    </div>
  </header>`;
}

function siteFooter(options = {}) {
  const prefix = options.prefix ?? '';
  const locale = options.locale || 'tr';
  const ui = UI[locale] || UI.tr;
  const homeHref = options.homeHref ?? localizedHref(prefix, locale, 'index.html');
  const productsHref =
    options.productsHref ??
    localizedHref(prefix, locale, locale === 'tr' ? 'urunler/index.html' : 'products/index.html');
  const catalogHref = options.catalogHref ?? localizedHref(prefix, locale, 'katalog/index.html');
  const blogHref = options.blogHref ?? localizedHref(prefix, locale, 'blog/index.html');
  const compareHref = options.compareHref ?? localizedHref(prefix, locale, 'urun-karsilastirma/index.html');
  const aboutHref = options.aboutHref ?? localizedHref(prefix, locale, 'hakkimizda/index.html');
  const qualityHref = options.qualityHref ?? localizedHref(prefix, locale, 'kalite-politikamiz/index.html');
  const contactHref = options.contactHref ?? localizedHref(prefix, locale, 'iletisim/index.html');
  const privacyHref = options.privacyHref ?? localizedHref(prefix, locale, 'gizlilik-politikasi/index.html');
  const kvkkHref = options.kvkkHref ?? localizedHref(prefix, locale, 'kvkk/index.html');
  const termsHref = options.termsHref ?? localizedHref(prefix, locale, 'kullanim-kosullari/index.html');
  const certBadges = k.sertifikalar
    .slice(0, 7)
    .map((c) => `<span class="cert-badge">${esc(c)}</span>`)
    .join('\n          ');

  return `  <footer class="site-footer no-print">
    <div class="container site-footer__inner">
      <div class="site-footer__grid">
        <div class="site-footer__brand">
          <a href="${homeHref}" class="site-logo">
            <img src="${prefix}assets/img/duru-hd-beyaz-logo.svg" alt="Duru ULV" class="site-logo__img site-logo__img--dark" width="298" height="161">
          </a>
          <p>${esc(ui.footerBlurb)}</p>
          ${socialLinksHtml({ modifier: 'footer', locale })}
        </div>
        <div>
          <h4 class="site-footer__heading">${esc(ui.siteNav)}</h4>
          <ul class="site-footer__links">
            <li><a href="${homeHref}">${esc(ui.home)}</a></li>
            <li><a href="${productsHref}">${esc(ui.products)}</a></li>
            <li><a href="${catalogHref}">${esc(ui.catalog)}</a></li>
            <li><a href="${blogHref}">${esc(ui.blog)}</a></li>
            <li><a href="${compareHref}" data-compare-nav>${esc(ui.compare)}</a></li>
            <li><a href="${aboutHref}">${esc(ui.about)}</a></li>
            <li><a href="${qualityHref}">${esc(ui.quality)}</a></li>
            <li><a href="${contactHref}">${esc(ui.contact)}</a></li>
          </ul>
        </div>
        <div>
          <h4 class="site-footer__heading">${esc(ui.contact)}</h4>
          <ul class="site-footer__contact">
            <li><a href="tel:+903523202086">${esc(k.telefon)}</a></li>
            <li><a href="https://wa.me/${k.whatsapp}" target="_blank" rel="noopener">WhatsApp: +90 532 065 91 17</a></li>
            <li><a href="mailto:${k.email}">${esc(k.email)}</a></li>
            <li>${esc(k.adres.satir1)}<br>${esc(k.adres.satir2)}</li>
          </ul>
        </div>
      </div>
      <div class="site-footer__certs">
        <h4 class="site-footer__heading">${esc(ui.certificates)}</h4>
        <div class="site-footer__cert-list">${certBadges}</div>
      </div>
      <div class="site-footer__bottom">
        <div>© ${new Date().getFullYear()} Duru ULV. ${esc(ui.rights)}</div>
        <div class="site-footer__legal">
          <a href="${privacyHref}">${esc(ui.privacy)}</a>
          <a href="${kvkkHref}">${esc(ui.kvkk)}</a>
          <a href="${termsHref}">${esc(ui.terms)}</a>
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
  langSwitcherHtml,
  localePageHref,
  localizedHref,
  resolveProductsHref,
  esc,
  kurumsal: k,
};
