const fs = require('fs');
const path = require('path');
const { renderCategoryCard } = require('./category-icons');
const { siteHeader, siteFooter } = require('./site-layout');
const { renderHeadAssets, renderBodyScripts } = require('./head-assets');
const { buildSiteCss } = require('./build-css');
const {
  renderSeoHead,
  productOgImageUrl,
  productSchemaJson,
  faqPageSchemaJson,
} = require('./seo-meta');

const ROOT = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/urunler.json'), 'utf8'));
const IMG_MANIFEST_PATH = path.join(ROOT, 'assets/data/product-images.json');
const ALTS_PATH = path.join(ROOT, 'assets/data/product-image-alts.json');
const imageManifest = fs.existsSync(IMG_MANIFEST_PATH)
  ? JSON.parse(fs.readFileSync(IMG_MANIFEST_PATH, 'utf8'))
  : {};
const imageAlts = fs.existsSync(ALTS_PATH) ? JSON.parse(fs.readFileSync(ALTS_PATH, 'utf8')) : {};
const PRODUCT_SEO_PATH = path.join(ROOT, 'assets/data/product-seo.json');
const productSeo = fs.existsSync(PRODUCT_SEO_PATH)
  ? JSON.parse(fs.readFileSync(PRODUCT_SEO_PATH, 'utf8'))
  : {};

function productImageAlt(slug, index) {
  const files = imageManifest[slug];
  const fileName = files && files[index - 1]
    ? files[index - 1]
    : `${slug}-${String(index).padStart(2, '0')}.webp`;
  return imageAlts[fileName] || '';
}

function productImageSrc(slug, index, prefix) {
  const files = imageManifest[slug];
  const fileName = files && files[index - 1]
    ? files[index - 1]
    : `${slug}-${String(index).padStart(2, '0')}.webp`;
  return `${prefix}assets/img/products/${fileName}`;
}

function productImageCount(slug) {
  return imageManifest[slug] ? imageManifest[slug].length : 0;
}

function hasProductImages(slug) {
  return productImageCount(slug) > 0;
}

const FAQS_FALLBACK = [
  { q: 'ULV nedir, Pulverizatörden farkı nedir?', a: 'ULV (Ultra Low Volume), çok düşük hacimde ilacın 0–50 mikron arası damlalara parçalanarak havaya dağıtılması esasına dayanır. Klasik pulverizatöre göre çok daha az ilaçla, çok daha geniş bir alanı kaplar.' },
  { q: 'Hangi solüsyonlarla uyumludur?', a: 'sc, ec ve wp formülasyonlu profesyonel pestisit ve dezenfektanlarla uyumludur.' },
  { q: 'Garanti süresi ve servis ağı nasıl?', a: 'Tüm makineler fabrikadan 2 yıl garantili çıkar. Türkiye genelinde yetkili servis ağımız mevcuttur.' },
  { q: 'İhalelerde teknik şartname desteği veriyor musunuz?', a: 'Evet, kamu ihalelerinde teknik şartname yazımına destek sağlıyoruz. İletişim formundan veya WhatsApp üzerinden ulaşmanız yeterlidir.' },
];

function getProductFaqs(slug) {
  const entry = productSeo[slug];
  if (entry && entry.faqs && entry.faqs.length) return entry.faqs;
  return FAQS_FALLBACK;
}

/* emergent ProductDetail — lucide ikonları (Building2, Hospital, Sprout, Factory, ShieldCheck, Cog) */
const USAGE_AREAS = [
  {
    label: 'Belediye',
    icon: '<svg class="sector-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
  },
  {
    label: 'Hastane',
    icon: '<svg class="sector-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 6v4"/><path d="M14 14h-4"/><path d="M12 14v4"/><path d="M10 2h4a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>',
  },
  {
    label: 'Sera',
    icon: '<svg class="sector-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1.1 1.6-2.6 1.9-4.6-2.8.3-4 1.2-4.9 2.3-.9 1.1-1.4 2.5-1.6 4.7z"/></svg>',
  },
  {
    label: 'Fabrika',
    icon: '<svg class="sector-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></svg>',
  },
  {
    label: 'Askeriye',
    icon: '<svg class="sector-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
  },
  {
    label: 'Çiftlik',
    icon: '<svg class="sector-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
  },
];

function usageAreasHtml() {
  return USAGE_AREAS.map(
    (a) => `          <div class="sector-item">${a.icon}<span class="sector-item__label">${a.label}</span></div>`
  ).join('\n');
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getCategory(slug) {
  return data.kategoriler.find((k) => k.slug === slug);
}

function getRelated(product, limit = 3) {
  return data.urunler
    .filter((p) => p.kategori_slug === product.kategori_slug && p.slug !== product.slug)
    .slice(0, limit);
}

function header(prefix, quoteProducts) {
  const quoteHref = quoteProducts
    ? `${prefix}fiyat-teklifi/index.html?products=${encodeURIComponent(quoteProducts)}`
    : `${prefix}fiyat-teklifi/index.html`;
  let productsHref = `${prefix}urunler/index.html`;
  if (prefix === '../../../') productsHref = '../../index.html';
  else if (prefix === '../../') productsHref = '../index.html';
  else if (prefix === '../') productsHref = 'index.html';
  return siteHeader({ prefix, quoteHref, productsHref });
}

function footer(prefix) {
  return siteFooter({ prefix });
}

function productCard(p, linkPrefix, comparePage) {
  return `          <article class="product-card lift-card">
            <a href="${linkPrefix}${p.slug}/index.html" class="product-card__image img-placeholder">
              <img src="${linkPrefix.replace(/\.\.\//g, (m, o) => m)}" style="display:none" alt="${esc(p.ad_tr)}" loading="lazy">
            </a>
            <div class="product-card__body">
              <span class="product-card__model">${esc(p.model_kodu)}</span>
              <a href="${linkPrefix}${p.slug}/index.html" class="product-card__title">${esc(p.ad_tr)}</a>
              <p class="product-card__summary">${esc(p.kisa_aciklama_tr)}</p>
              <div class="product-card__actions">
                <a href="${linkPrefix}${p.slug}/index.html" class="btn btn--primary btn--sm">İncele</a>
                <button type="button" class="btn btn--outline btn--sm" data-compare-toggle="${p.slug}" data-compare-page="${comparePage}"><span data-compare-label>Karşılaştır</span></button>
              </div>
            </div>
          </article>`;
}

function productCardFixed(p, assetPrefix, pagePrefix, comparePage) {
  const img = productImageSrc(p.slug, 1, assetPrefix);
  const imageClass = hasProductImages(p.slug) ? 'product-card__image' : 'product-card__image img-placeholder';
  const imgTag = hasProductImages(p.slug)
    ? `<img src="${img}" alt="${esc(p.ad_tr)}" loading="lazy">`
    : `<img src="${img}" alt="${esc(p.ad_tr)}" loading="lazy" style="display:none">`;
  return `          <article class="product-card lift-card">
            <a href="${pagePrefix}${p.slug}/index.html" class="${imageClass}">
              ${imgTag}
            </a>
            <div class="product-card__body">
              <span class="product-card__model">${esc(p.model_kodu)}</span>
              <a href="${pagePrefix}${p.slug}/index.html" class="product-card__title">${esc(p.ad_tr)}</a>
              <p class="product-card__summary">${esc(p.kisa_aciklama_tr)}</p>
              <div class="product-card__actions">
                <a href="${pagePrefix}${p.slug}/index.html" class="btn btn--primary btn--sm">İncele</a>
                <button type="button" class="btn btn--outline btn--sm" data-compare-toggle="${p.slug}" data-compare-page="${comparePage}"><span data-compare-label>Karşılaştır</span></button>
              </div>
            </div>
          </article>`;
}

function generateProductPage(product) {
  const cat = getCategory(product.kategori_slug);
  const prefix = '../../../';
  const related = getRelated(product);
  const chips = product.teknik_tablo.slice(0, 4);
  const imageCount = productImageCount(product.slug) || 4;

  const specRows = product.teknik_tablo
    .map((row) => `              <tr><th scope="row">${esc(row.ozellik)}</th><td>${esc(row.deger)}</td></tr>`)
    .join('\n');

  const chipHtml = chips
    .map((row) => `<span class="chip"><span class="chip__key">${esc(row.ozellik)}:</span> ${esc(row.deger)}</span>`)
    .join('\n            ');

  const faqHtml = getProductFaqs(product.slug).map(
    (f) => `          <div class="accordion__item">
            <button type="button" class="accordion__trigger" aria-expanded="false">${esc(f.q)}<svg class="accordion__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>
            <div class="accordion__content">${esc(f.a)}</div>
          </div>`
  ).join('\n');

  const relatedHtml = related.length
    ? related
        .map((p) => {
          const relImg = productImageSrc(p.slug, 1, prefix);
          const relImageClass = hasProductImages(p.slug) ? 'product-card__image' : 'product-card__image img-placeholder';
          const relImgTag = hasProductImages(p.slug)
            ? `<img src="${relImg}" alt="${esc(p.ad_tr)}" loading="lazy">`
            : '';
          return `          <article class="product-card lift-card">
            <a href="../${p.slug}/index.html" class="${relImageClass}">${relImgTag}</a>
            <div class="product-card__body">
              <span class="product-card__model">${esc(p.model_kodu)}</span>
              <a href="../${p.slug}/index.html" class="product-card__title">${esc(p.ad_tr)}</a>
              <p class="product-card__summary">${esc(p.kisa_aciklama_tr)}</p>
              <div class="product-card__actions"><a href="../${p.slug}/index.html" class="btn btn--primary btn--sm">İncele</a></div>
            </div>
          </article>`;
        })
        .join('\n')
    : '';

  const thumbs = Array.from({ length: imageCount }, (_, i) => i + 1)
    .map((n, i) => {
      const src = productImageSrc(product.slug, n, prefix);
      const alt = productImageAlt(product.slug, n) || `${product.ad_tr} — görsel ${n}`;
      return `<button type="button" class="product-gallery__thumb${i === 0 ? ' is-active' : ''}" data-gallery-thumb data-src="${src}" data-alt="${esc(alt)}" aria-label="Görsel ${n}"><img src="${src}" alt="${esc(alt)}" loading="lazy"></button>`;
    })
    .join('\n            ');

  const mainImageClass = hasProductImages(product.slug) ? 'product-gallery__main' : 'product-gallery__main img-placeholder';
  const mainSrc = productImageSrc(product.slug, 1, prefix);
  const mainAlt = productImageAlt(product.slug, 1) || product.ad_tr;
  const canonicalRel = `urunler/${product.kategori_slug}/${product.slug}/index.html`;
  const pageTitle = `${product.ad_tr} — Duru ULV`;
  const pageDesc = `${product.ad_tr} — ${product.kisa_aciklama_tr}. Duru ULV ${cat.kisa_ad} ilaçlama makinesi.`;
  const seoBlock = renderSeoHead({
    title: pageTitle,
    description: pageDesc,
    canonicalPathRel: canonicalRel,
    ogType: 'product',
    ogImage: productOgImageUrl(product.slug, imageManifest),
    ogImageAlt: mainAlt,
  });
  const productSchema = productSchemaJson(
    product,
    { metaDescription: pageDesc, imageManifest },
    canonicalRel
  );
  const productFaqs = getProductFaqs(product.slug);
  const faqSchemaTag = productFaqs.length
    ? `\n  <script type="application/ld+json">${faqPageSchemaJson(productFaqs)}</script>`
    : '';

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(pageDesc)}">
  <title>${esc(pageTitle)}</title>
${seoBlock}
  <script type="application/ld+json">${productSchema}</script>${faqSchemaTag}
  <link rel="icon" href="${prefix}assets/img/duru-icon.svg" type="image/svg+xml">
${renderHeadAssets(prefix)}
</head>
<body>

${header(prefix, product.slug)}

  <div class="breadcrumb-bar">
    <div class="container">
      <ol class="breadcrumb">
        <li><a href="${prefix}index.html">Anasayfa</a> ›</li>
        <li><a href="../../index.html">Ürünler</a> ›</li>
        <li><a href="../index.html">${esc(cat.kisa_ad)}</a> ›</li>
        <li><span class="breadcrumb__current">${esc(product.ad_tr)}</span></li>
      </ol>
    </div>
  </div>

  <main>
    <section class="section bg-white" style="padding-top:2.5rem;padding-bottom:3.5rem">
      <div class="container product-detail__grid">
        <div data-product-gallery>
          <div class="${mainImageClass}">
            <img data-gallery-main src="${mainSrc}" alt="${esc(mainAlt)}">
          </div>
          <div class="product-gallery__thumbs">
            ${thumbs}
          </div>
        </div>

        <div class="product-info">
          <div class="eyebrow">${esc(cat.kisa_ad)} · Model ${esc(product.model_kodu)}</div>
          <h1 class="product-info__title">${esc(product.ad_tr)}</h1>
          <p class="product-info__summary">${esc(product.kisa_aciklama_tr)}</p>

          <div class="product-info__chips">
            ${chipHtml}
          </div>

          <div class="action-bar">
            <div class="action-bar__header">
              <div>
                <div class="eyebrow eyebrow--muted">Talep edin</div>
                <div style="font-family:var(--font-display);font-weight:600;color:var(--color-primary)">Özel teklif &amp; teknik bilgi</div>
              </div>
              <div class="action-bar__note">Aynı iş günü dönüş</div>
            </div>
            <div class="action-bar__actions">
              <a href="${prefix}fiyat-teklifi/index.html?products=${encodeURIComponent(product.slug)}" class="btn btn--primary">Teklif Al →</a>
              <button type="button" class="btn btn--outline" data-compare-toggle="${product.slug}" data-compare-page="${prefix}urun-karsilastirma/index.html"><span data-compare-label>Karşılaştır</span></button>
            </div>
            <a href="https://wa.me/${data.kurumsal_bilgiler.whatsapp}" class="action-bar__wa" target="_blank" rel="noopener">veya WhatsApp ile hızlıca yazın</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section bg-muted border-y">
      <div class="container container--narrow">
        <div class="eyebrow">Teknik Özellikler</div>
        <h2 class="section-title" style="margin-bottom:2rem">${esc(product.ad_tr)} — teknik tablo</h2>
        <div class="spec-table-wrap">
          <table class="spec-table">
            <tbody>
${specRows}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container container--text">
        <div class="eyebrow">Neden bu model</div>
        <h2 class="section-title" style="margin-bottom:1.5rem">Detaylı açıklama</h2>
        <!-- GENİŞ AÇIKLAMA: buraya gelecek -->
        <p style="color:rgba(43,46,51,0.8);line-height:1.65;margin-bottom:1.25rem">${esc(product.kisa_aciklama_tr)}. Duru ULV mühendislik birikimiyle tasarlanmış, sahada kanıtlanmış profesyonel bir modeldir.</p>
        <p style="color:rgba(43,46,51,0.8);line-height:1.65">Teknik detaylar ve özel teklif için formu doldurabilir veya doğrudan ekibimizle iletişime geçebilirsiniz.</p>
      </div>
    </section>

    <section class="section bg-muted border-y">
      <div class="container">
        <div class="eyebrow">Kullanım Alanları</div>
        <h2 class="section-title" style="margin-bottom:2rem">Bu model nerede tercih ediliyor?</h2>
        <div class="sector-grid">
${usageAreasHtml()}
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container container--text">
        <div class="eyebrow">Sıkça Sorulan Sorular</div>
        <h2 class="section-title" style="margin-bottom:2rem">Hızlı yanıtlar</h2>
        <div class="accordion" data-accordion>
${faqHtml}
        </div>
      </div>
    </section>

${
  relatedHtml
    ? `    <section class="section bg-muted border-y">
      <div class="container">
        <div class="eyebrow">İlgili Ürünler</div>
        <h2 class="section-title" style="margin-bottom:2rem">Aynı kategoride incelenebilecek modeller</h2>
        <div class="grid-3">
${relatedHtml}
        </div>
      </div>
    </section>`
    : ''
}
  </main>

${footer(prefix)}

${renderBodyScripts(prefix)}
</body>
</html>
`;
}

function generateCategoryPage(category) {
  const prefix = '../../';
  const products = data.urunler.filter((p) => p.kategori_slug === category.slug);
  const cards = products
    .map((p) => productCardFixed(p, prefix, '', `${prefix}urun-karsilastirma/index.html`))
    .join('\n');

  const catDesc = `${category.ad_tr} — Duru ULV ${products.length} model. ${category.aciklama_tr}`;
  const catTitle = `${category.kisa_ad} ULV Makineleri — Duru ULV`;
  const firstProduct = products[0];
  const catOg = firstProduct
    ? productOgImageUrl(firstProduct.slug, imageManifest)
    : undefined;
  const seoBlock = renderSeoHead({
    title: catTitle,
    description: catDesc,
    canonicalPathRel: `urunler/${category.slug}/index.html`,
    ogImage: catOg,
    ogImageAlt: category.ad_tr,
  });

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(catDesc)}">
  <title>${esc(catTitle)}</title>
${seoBlock}
  <link rel="icon" href="${prefix}assets/img/duru-icon.svg" type="image/svg+xml">
${renderHeadAssets(prefix)}
</head>
<body>

${header(prefix)}

  <div class="breadcrumb-bar">
    <div class="container">
      <ol class="breadcrumb">
        <li><a href="${prefix}index.html">Anasayfa</a> ›</li>
        <li><a href="../index.html">Ürünler</a> ›</li>
        <li><span class="breadcrumb__current">${esc(category.kisa_ad)}</span></li>
      </ol>
    </div>
  </div>

  <main>
    <section class="section section--lg bg-white">
      <div class="container">
        <div class="section-header-row">
          <div>
            <div class="eyebrow">Ürün Kategorisi</div>
            <h1 class="section-title">${esc(category.ad_tr)}</h1>
          </div>
          <p>${esc(category.aciklama_tr)}</p>
        </div>
        <p style="font-size:0.875rem;color:rgba(43,46,51,0.6);margin:-1.5rem 0 2rem">${products.length} model</p>
        <div class="grid-3">
${cards}
        </div>
      </div>
    </section>

    <section class="section bg-muted border-y">
      <div class="container container--narrow">
        <div class="cta-box">
          <div class="cta-box__grid">
            <div>
              <h2 class="section-title" style="font-size:clamp(1.5rem,3vw,1.875rem)">${esc(category.kisa_ad)} modelleri için teklif alın</h2>
              <p class="cta-box__text">Birden fazla modeli karşılaştırıp tek form ile özel teklif talep edebilirsiniz.</p>
            </div>
            <div class="cta-box__actions">
              <a href="${prefix}fiyat-teklifi/index.html" class="btn btn--primary">Teklif Al →</a>
              <a href="${prefix}iletisim/index.html" class="btn btn--outline">İletişim</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

${footer(prefix)}

${renderBodyScripts(prefix)}
</body>
</html>
`;
}

function generateProductsIndex() {
  const prefix = '../';
  const categoryCards = data.kategoriler
    .map((cat) => {
      const count = data.urunler.filter((p) => p.kategori_slug === cat.slug).length;
      return renderCategoryCard(cat, { linkPrefix: '', count, headingTag: 'h2', esc });
    })
    .join('\n');

  const allCards = data.urunler
    .map((p) => {
      const cat = getCategory(p.kategori_slug);
      const img = productImageSrc(p.slug, 1, prefix);
      const imageClass = hasProductImages(p.slug) ? 'product-card__image' : 'product-card__image img-placeholder';
      const imgTag = hasProductImages(p.slug)
        ? `<img src="${img}" alt="${esc(p.ad_tr)}" loading="lazy">`
        : `<img src="${img}" alt="${esc(p.ad_tr)}" loading="lazy" style="display:none">`;
      return `          <article class="product-card lift-card">
            <a href="${p.kategori_slug}/${p.slug}/index.html" class="${imageClass}">
              ${imgTag}
            </a>
            <div class="product-card__body">
              <span class="product-card__model">${esc(p.model_kodu)} · ${esc(cat.kisa_ad)}</span>
              <a href="${p.kategori_slug}/${p.slug}/index.html" class="product-card__title">${esc(p.ad_tr)}</a>
              <p class="product-card__summary">${esc(p.kisa_aciklama_tr)}</p>
              <div class="product-card__actions">
                <a href="${p.kategori_slug}/${p.slug}/index.html" class="btn btn--primary btn--sm">İncele</a>
                <button type="button" class="btn btn--outline btn--sm" data-compare-toggle="${p.slug}" data-compare-page="${prefix}urun-karsilastirma/index.html"><span data-compare-label>Karşılaştır</span></button>
              </div>
            </div>
          </article>`;
    })
    .join('\n');

  const listDesc =
    'Duru ULV ürün kataloğu — 18 model, 4 kategori: araç üzeri, sera tipi, sırt tipi ve el tipi ULV ilaçlama makineleri.';
  const listTitle = 'Ürünler — Duru ULV';
  const seoBlock = renderSeoHead({
    title: listTitle,
    description: listDesc,
    canonicalPathRel: 'urunler/index.html',
    ogImage: productOgImageUrl('duru-hd50', imageManifest),
    ogImageAlt: 'Duru ULV ürün kataloğu',
  });

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(listDesc)}">
  <title>${esc(listTitle)}</title>
${seoBlock}
  <link rel="icon" href="${prefix}assets/img/duru-icon.svg" type="image/svg+xml">
${renderHeadAssets(prefix)}
</head>
<body>

${header(prefix)}

  <div class="breadcrumb-bar">
    <div class="container">
      <ol class="breadcrumb">
        <li><a href="${prefix}index.html">Anasayfa</a> ›</li>
        <li><span class="breadcrumb__current">Ürünler</span></li>
      </ol>
    </div>
  </div>

  <main>
    <section class="section section--lg bg-white">
      <div class="container">
        <div style="margin-bottom:3rem">
          <div class="eyebrow">Ürün Kataloğu</div>
          <h1 class="section-title">18 model · 4 kategori</h1>
          <p style="max-width:36rem;margin-top:1rem;color:rgba(43,46,51,0.75);line-height:1.65">Belediye, kamu, tarım ve sanayi uygulamaları için profesyonel ULV ilaçlama makineleri. Fiyat yerine teklif alın — karşılaştırma yapın.</p>
        </div>

        <h2 class="section-title" style="font-size:1.5rem;margin-bottom:1.5rem">Kategoriler</h2>
        <div class="category-grid" style="margin-bottom:4rem">
${categoryCards}
        </div>

        <h2 class="section-title" style="font-size:1.5rem;margin-bottom:1.5rem">Tüm modeller</h2>
        <div class="grid-3">
${allCards}
        </div>
      </div>
    </section>
  </main>

${footer(prefix)}

${renderBodyScripts(prefix)}
</body>
</html>
`;
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

let productCount = 0;
for (const product of data.urunler) {
  const dir = path.join(ROOT, 'urunler', product.kategori_slug, product.slug, 'index.html');
  writeFile(dir, generateProductPage(product));
  productCount++;
}

for (const category of data.kategoriler) {
  const dir = path.join(ROOT, 'urunler', category.slug, 'index.html');
  writeFile(dir, generateCategoryPage(category));
}

writeFile(path.join(ROOT, 'urunler', 'index.html'), generateProductsIndex());

buildSiteCss();

console.log(`Generated ${productCount} product pages`);
console.log(`Generated ${data.kategoriler.length} category pages`);
console.log('Generated urunler/index.html');
