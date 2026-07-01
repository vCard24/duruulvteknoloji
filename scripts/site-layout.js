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
        <button type="button" class="lang-switcher" aria-label="Dil seçici (yakında)">TR ▾</button>
        <a href="${quoteHref}" class="btn btn--primary btn--sm header-cta">Teklif Al</a>
        <button type="button" class="mobile-toggle" data-mobile-toggle aria-expanded="false" aria-label="Menüyü aç/kapat">${MOBILE_TOGGLE_SVG}</button>
      </div>
    </div>
    <div class="mobile-menu" data-mobile-menu>
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
  resolveProductsHref,
  esc,
  kurumsal: k,
};
