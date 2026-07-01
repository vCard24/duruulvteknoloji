const fs = require('fs');
const path = require('path');
const { renderCategoryCard } = require('./category-icons');
const { siteHeader, siteFooter } = require('./site-layout');
const {
  renderSeoHead,
  DEFAULT_OG_IMAGE,
  organizationSchemaJson,
} = require('./seo-meta');
const { kvkkHtml, gizlilikHtml, kullanimKosullariHtml } = require('./legal-content');

const ROOT = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/urunler.json'), 'utf8'));
const P = '../';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonForScript(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

function shell(title, description, body, extraScripts, extraHead, pageOpts) {
  const opts = pageOpts || {};
  const fullTitle = opts.title || `${title} — Duru ULV`;
  const desc = opts.description || description;
  const canonicalRel = opts.canonical || `${title.toLowerCase().replace(/\s+/g, '-')}/index.html`;
  const seoBlock = renderSeoHead({
    title: fullTitle,
    description: desc,
    canonicalPathRel: canonicalRel,
    ogImage: opts.ogImage || DEFAULT_OG_IMAGE,
    ogImageAlt: opts.ogImageAlt || title,
    ogType: opts.ogType || 'website',
    robots: opts.robots,
    keywords: opts.keywords,
  });
  const schemaBlock = opts.schema ? `\n  <script type="application/ld+json">${opts.schema}</script>` : '';

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(desc)}">
  <title>${esc(fullTitle)}</title>
${seoBlock}${schemaBlock}
  <link rel="icon" href="${P}assets/img/duru-icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${P}assets/css/main.css">
  <link rel="stylesheet" href="${P}assets/css/components.css">
${extraHead || ''}
</head>
<body>

${header()}
${body}
${footer()}
  <script src="${P}assets/js/compare.js"></script>
  <script src="${P}assets/js/main.js"></script>
${extraScripts || ''}
</body>
</html>
`;
}

function header() {
  return siteHeader({ prefix: P });
}

function footer() {
  return siteFooter({ prefix: P });
}

function writePage(dir, html) {
  fs.mkdirSync(path.dirname(dir), { recursive: true });
  fs.writeFileSync(dir, html, 'utf8');
}

const CERTS = [
  { code: 'CE', label: 'Avrupa Uyum İşareti' },
  { code: 'TSE', label: 'Türk Standartları Enstitüsü' },
  { code: 'ISO 9001', label: 'Kalite Yönetim Sistemi' },
  { code: 'ISO 14001', label: 'Çevre Yönetim Sistemi' },
  { code: 'ISO 45001', label: 'İş Sağlığı & Güvenliği' },
  { code: 'Gıda Tarım', label: 'T.C. Gıda Tarım ve Hayvancılık Bakanlığı Onayı' },
  { code: 'Sanayi', label: 'T.C. Sanayi ve Teknoloji Bakanlığı Onayı' },
];

const certGrid = CERTS.map(
  (c) => `          <div class="cert-card">
            <div class="cert-card__code">${esc(c.code)}</div>
            <div class="cert-card__label">${esc(c.label)}</div>
          </div>`
).join('\n');

const categoryCatalogCards = data.kategoriler
  .map((cat) => {
    const count = data.urunler.filter((p) => p.kategori_slug === cat.slug).length;
    return renderCategoryCard(cat, { linkPrefix: `${P}urunler/`, headingTag: 'h3', count, esc });
  })
  .join('\n');

const pdfVendorScripts = `  <script src="${P}assets/js/vendor/html2canvas.min.js"></script>
  <script src="${P}assets/js/vendor/jspdf.umd.min.js"></script>
  <script src="${P}assets/js/pdf-utils.js"></script>`;

const pages = {
  'urun-karsilastirma/index.html': shell(
    'Ürün Karşılaştırma',
    'Duru ULV ürünlerini yan yana karşılaştırın. En fazla 4 model, paylaşılabilir URL.',
    `  <main>
    <section class="section bg-white border-y" style="padding-bottom:2rem">
      <div class="container">
        <div class="section-header-row">
          <div>
            <div class="eyebrow">Ürün Karşılaştırma</div>
            <h1 class="section-title">Seçili ürünlerinizi yan yana inceleyin.</h1>
            <p style="max-width:36rem;margin-top:1rem;color:rgba(43,46,51,0.7);line-height:1.65">En fazla 4 modeli aynı anda karşılaştırabilir, tek bir adımda hepsi için teklif talep edebilirsiniz. Karşılaştırma linki URL üzerinden paylaşılabilir.</p>
          </div>
          <div style="text-align:right">
            <span id="compare-count-display" style="font-family:var(--font-display);font-size:3rem;font-weight:700;color:var(--color-primary)">0</span>
            <span style="font-size:0.875rem;color:rgba(43,46,51,0.65);text-transform:uppercase;letter-spacing:0.16em"> / 4 seçili</span>
          </div>
        </div>
      </div>
    </section>
    <div id="compare-app"></div>
    <div id="compare-pdf-sheet" class="pdf-sheet" aria-hidden="true"></div>
    <script id="duru-urunler-embed" type="application/json">${jsonForScript({ urunler: data.urunler })}</script>
  </main>`,
    `${pdfVendorScripts}
  <script src="${P}assets/js/compare-pdf.js"></script>`,
    `  <link rel="stylesheet" href="${P}assets/css/pdf-export.css">
  <link rel="stylesheet" href="${P}assets/css/compare-print.css">
`,
    { canonical: 'urun-karsilastirma/index.html' }
  ),

  'fiyat-teklifi/index.html': shell(
    'Fiyat Teklifi',
    'Duru ULV ürünleri için özel teklif talep formu. Aynı iş günü dönüş.',
    `  <main>
    <section class="section bg-white border-y">
      <div class="container container--text">
        <div class="eyebrow">Fiyat Teklifi</div>
        <h1 class="section-title">Operasyonunuza özel teklif alın.</h1>
        <p style="margin-top:1rem;color:rgba(43,46,51,0.75);line-height:1.65">Formu doldurmanız yeterli. Satış mühendisimiz aynı iş günü içinde detaylı teknik teklif ve uygulanabilirlik bilgisi ile size geri dönecek.</p>
      </div>
    </section>
    <section class="section bg-muted">
      <div class="container container--text">
        <form id="quote-form" class="form-card" novalidate data-quote-api="/api/send-quote.php">
          <input type="text" name="_honey" value="" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0;height:0;width:0">
          <div style="margin-bottom:2rem">
            <div class="form-label">Seçili Ürünler</div>
            <div id="quote-products"></div>
          </div>
          <div class="form-grid">
            <div class="form-field form-field--full">
              <label class="form-label" for="full_name">Ad Soyad *</label>
              <input class="form-input" id="full_name" name="full_name" type="text" placeholder="Adınız Soyadınız" required>
              <p class="form-error" data-error="full_name"></p>
            </div>
            <div class="form-field">
              <label class="form-label" for="company">Firma / Kurum</label>
              <input class="form-input" id="company" name="company" type="text" placeholder="Belediye, kurum veya şirket adı">
            </div>
            <div class="form-field">
              <label class="form-label" for="city">İl / İlçe</label>
              <input class="form-input" id="city" name="city" type="text" placeholder="Örn. Kayseri / Melikgazi">
            </div>
            <div class="form-field">
              <label class="form-label" for="phone">Telefon *</label>
              <input class="form-input" id="phone" name="phone" type="tel" placeholder="+90 5XX XXX XX XX" required>
              <p class="form-error" data-error="phone"></p>
            </div>
            <div class="form-field">
              <label class="form-label" for="email">E-posta *</label>
              <input class="form-input" id="email" name="email" type="email" placeholder="ornek@firma.com" required>
              <p class="form-error" data-error="email"></p>
            </div>
            <div class="form-field form-field--full">
              <label class="form-label" for="message">Mesaj</label>
              <textarea class="form-textarea" id="message" name="message" rows="5" placeholder="Uygulama alanı, kapasite, miktar, ihale bilgisi gibi detayları paylaşabilirsiniz."></textarea>
            </div>
            <div class="form-field form-field--full">
              <label class="form-checkbox">
                <input type="checkbox" id="kvkk_accepted" name="kvkk_accepted">
                <span><a href="${P}kvkk/index.html" style="font-weight:600">KVKK aydınlatma metnini</a> okudum, iletişim amacıyla kişisel verilerimin işlenmesine onay veriyorum.</span>
              </label>
              <p class="form-error" data-error="kvkk_accepted"></p>
            </div>
          </div>
          <div style="margin-top:2rem;display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;align-items:center">
            <p style="font-size:0.75rem;color:rgba(43,46,51,0.6);margin:0">Talebiniz tarafımıza ulaştığında size dönüş yapılacaktır.</p>
            <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
              <button type="button" id="quote-email-preview-btn" class="btn btn--outline btn--sm">E-posta Önizle</button>
              <button type="button" id="quote-pdf-btn" class="btn btn--outline btn-pdf-export">PDF İndir</button>
              <button type="submit" class="btn btn--primary">Teklif Talebini Gönder →</button>
            </div>
          </div>
        </form>
        <div id="quote-pdf-sheet" class="pdf-sheet" aria-hidden="true"></div>
      </div>
    </section>
  </main>`,
    `${pdfVendorScripts}
  <script src="${P}assets/js/quote-form.js"></script>
  <script src="${P}assets/js/quote-pdf.js"></script>`,
    `  <link rel="stylesheet" href="${P}assets/css/pdf-export.css">
`,
    { canonical: 'fiyat-teklifi/index.html' }
  ),

  'tesekkurler/index.html': shell(
    'Teşekkürler',
    'Teklif talebiniz alındı. Duru ULV ekibi en kısa sürede size dönüş yapacak.',
    `  <main>
    <section class="section section--lg bg-muted">
      <div class="container container--narrow">
        <div class="empty-state">
          <div class="success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
          </div>
          <h1 class="section-title" style="margin-bottom:1rem">Teşekkürler!</h1>
          <p style="color:rgba(43,46,51,0.75);line-height:1.65;max-width:28rem;margin:0 auto 2rem">Teklif talebiniz tarafımıza ulaştı. Satış mühendisimiz aynı iş günü içinde size dönüş yapacak. Acil durumlar için WhatsApp veya telefon ile de ulaşabilirsiniz.</p>
          <div style="display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:center;margin-bottom:2rem">
            <a href="tel:+903523202086" class="btn btn--outline">+90 352 320 20 86</a>
            <a href="https://wa.me/${data.kurumsal_bilgiler.whatsapp}" class="btn btn--primary" style="background:#25D366;border-color:#25D366" target="_blank" rel="noopener">WhatsApp</a>
          </div>
          <a href="${P}index.html" class="link-arrow">Anasayfaya dön →</a>
        </div>
      </div>
    </section>
  </main>`,
    '',
    '',
    { canonical: 'tesekkurler/index.html', robots: 'noindex, nofollow' }
  ),

  'katalog/index.html': shell(
    'Ürün Kataloğu',
    'Duru ULV ürün kataloğu — 18 model, 4 kategori. PDF indir veya online incele.',
    `  <main>
    <section class="section section--lg bg-white border-y">
      <div class="container">
        <div class="hero__content" style="padding:0;grid-template-columns:1fr">
          <div style="display:grid;gap:2.5rem;align-items:center" class="grid-2">
            <div>
              <div class="eyebrow">Ürün Kataloğu</div>
              <h1 class="section-title">18 model, tek referans doküman.</h1>
              <p style="margin-top:1rem;color:rgba(43,46,51,0.75);line-height:1.65;max-width:32rem">Araç üzeri, sera tipi, sırt tipi ve el tipi ULV makinelerimizin teknik özelliklerini içeren <strong>2026 güncel kataloğumuzu</strong> indirebilir, tarayıcıda görüntüleyebilir veya online ürün sayfalarından inceleyebilirsiniz.</p>
              <div style="margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:0.75rem">
                <a href="${P}assets/docs/duru-ulv-katalog-2026.pdf" class="btn btn--primary" download="Duru-ULV-Katalog-2026.pdf">Kataloğu İndir (PDF)</a>
                <a href="${P}assets/docs/duru-ulv-katalog-2026.pdf" class="btn btn--outline" target="_blank" rel="noopener">PDF'i Görüntüle</a>
                <a href="${P}urunler/index.html" class="btn btn--outline">Online Katalog</a>
                <a href="${P}fiyat-teklifi/index.html" class="btn btn--outline">Teklif Al</a>
              </div>
              <p class="text-muted" style="margin-top:1rem;font-size:0.8125rem">Duru ULV Ürün Kataloğu · 2026 · PDF</p>
            </div>
            <div class="catalog-hero-card">
              <div class="catalog-preview">
                <iframe src="${P}assets/docs/duru-ulv-katalog-2026.pdf#view=FitH" title="Duru ULV Ürün Kataloğu 2026 önizleme" loading="lazy"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section bg-muted border-y">
      <div class="container">
        <div class="eyebrow">Kategoriler</div>
        <h2 class="section-title" style="margin-bottom:2rem">Katalogdaki ürün grupları</h2>
        <div class="category-grid">
${categoryCatalogCards}
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container container--narrow">
        <div class="cta-box">
          <div class="cta-box__grid">
            <div>
              <h2 class="section-title" style="font-size:clamp(1.5rem,3vw,1.875rem)">Katalogdan seçim yapıp teklif alın</h2>
              <p class="cta-box__text">Modelleri karşılaştırın, ihtiyacınıza uygun makineler için özel teklif isteyin.</p>
            </div>
            <div class="cta-box__actions">
              <a href="${P}urun-karsilastirma/index.html" class="btn btn--outline" data-compare-nav>Karşılaştır</a>
              <a href="${P}fiyat-teklifi/index.html" class="btn btn--primary">Teklif Al →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>`,
    '',
    '',
    { canonical: 'katalog/index.html' }
  ),

  'hakkimizda/index.html': shell(
    'Hakkımızda',
    '1990\'dan beri Kayseri\'de ULV ilaçlama makineleri üreten Duru ULV Teknoloji Sistemleri.',
    `  <main>
    <section class="section section--lg bg-white border-y">
      <div class="container">
        <div class="stats-band__grid">
          <div>
            <div class="eyebrow">Hakkımızda</div>
            <h1 class="section-title">1990'dan beri Türkiye'nin ULV mühendisliği.</h1>
            <div style="margin-top:1.5rem;display:flex;flex-direction:column;gap:1.25rem;color:rgba(43,46,51,0.8);line-height:1.65">
              <p>Duru ULV Teknoloji Sistemleri; 1990 yılında Kayseri'de kurulmuş, 36 yıllık üretim tecrübesi ile dezenfeksiyon, haşere kontrolü ve tarımsal ilaçlama için Ultra Low Volume (ULV) makineleri üreten bir mühendislik firmasıdır.</p>
              <p>Belediyelerin sivrisinek mücadelesinden büyük ölçekli serada biyolojik mücadeleye, hastanelerin dezenfeksiyonundan fabrikaların haşere kontrolüne kadar geniş bir kullanım yelpazesinde tercih edilen bir markayız.</p>
              <p>Üç kuşaktır süregelen üretim mirası, sahanın gerçek ihtiyaçlarına odaklanan bir mühendislik kültürü ve uzun ömürlü servis desteği — bunlar bizi rakiplerimizden ayıran üç temel ilkemizdir.</p>
            </div>
            <a href="${P}fiyat-teklifi/index.html" class="btn btn--primary" style="margin-top:2rem">Teklif Al →</a>
          </div>
          <div class="stats-grid">
            <div class="stats-grid__item" style="background:white;border:1px solid var(--border-color)">
              <div class="stats-grid__value" style="color:var(--color-primary)">36+</div>
              <div class="stats-grid__label" style="color:rgba(43,46,51,0.65)">yıl tecrübe</div>
            </div>
            <div class="stats-grid__item" style="background:white;border:1px solid var(--border-color)">
              <div class="stats-grid__value" style="color:var(--color-primary)">18</div>
              <div class="stats-grid__label" style="color:rgba(43,46,51,0.65)">aktif model</div>
            </div>
            <div class="stats-grid__item" style="background:white;border:1px solid var(--border-color)">
              <div class="stats-grid__value" style="color:var(--color-primary)">4</div>
              <div class="stats-grid__label" style="color:rgba(43,46,51,0.65)">ana kategori</div>
            </div>
            <div class="stats-grid__item" style="background:white;border:1px solid var(--border-color)">
              <div class="stats-grid__value" style="color:var(--color-primary)">7</div>
              <div class="stats-grid__label" style="color:rgba(43,46,51,0.65)">sertifika &amp; onay</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section bg-muted border-y">
      <div class="container">
        <div class="eyebrow">Değerlerimiz</div>
        <h2 class="section-title" style="margin-bottom:2rem">Neden Duru ULV?</h2>
        <div class="pillar-grid">
          <div class="pillar-card"><h3 class="pillar-card__title">Yerli üretim</h3><p class="pillar-card__text">Tüm makineler Kayseri'deki tesisimizde tasarlanır ve üretilir. Tedarik zinciri ağırlıklı olarak yerli, kritik komponentler Amerikan menşelidir.</p></div>
          <div class="pillar-card"><h3 class="pillar-card__title">Saha kanıtlı tasarım</h3><p class="pillar-card__text">Belediye sivrisinek mücadelelerinden hastane dezenfeksiyonuna, sera ilaçlamasından fabrika operasyonuna kadar gerçek saha geri bildirimleriyle olgunlaştırılmış ürünler.</p></div>
          <div class="pillar-card"><h3 class="pillar-card__title">Servis sürekliliği</h3><p class="pillar-card__text">36 yıllık üretim mirası, yedek parça temininde uzun ömürlü bir altyapı sağlar. Eski model makineler için bile servis ve parça desteği devam eder.</p></div>
          <div class="pillar-card"><h3 class="pillar-card__title">Mühendislik desteği</h3><p class="pillar-card__text">İhale teknik şartname hazırlığı, kapasite hesabı ve operasyon planlaması konusunda mühendis ekibimiz proje bazlı destek verir.</p></div>
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container">
        <div class="eyebrow">Sertifikalar</div>
        <h2 class="section-title" style="margin-bottom:2rem">Akredite onaylarımız</h2>
        <div class="cert-grid">${certGrid}</div>
        <p style="margin-top:2rem"><a href="${P}kalite-politikamiz/index.html" class="link-arrow">Kalite politikamız →</a></p>
      </div>
    </section>
  </main>`,
    '',
    '',
    { canonical: 'hakkimizda/index.html', schema: organizationSchemaJson(data.kurumsal_bilgiler) }
  ),

  'kalite-politikamiz/index.html': shell(
    'Kalite Politikamız',
    'Duru ULV kalite politikası, sertifikalar ve onaylar — CE, TSE, ISO 9001/14001/45001.',
    `  <main>
    <section class="section bg-white border-y">
      <div class="container container--text">
        <div class="eyebrow">Kalite Politikamız</div>
        <h1 class="section-title">Sertifikalar &amp; Onaylar</h1>
        <p style="margin-top:1rem;color:rgba(43,46,51,0.75);line-height:1.65">Duru ULV olarak üretim süreçlerimizde kalite, çevre ve iş güvenliği standartlarına tam uyum hedefliyoruz. Aşağıdaki sertifika ve bakanlık onayları ürünlerimizin güvenilirliğinin resmi kanıtıdır.</p>
      </div>
    </section>
    <section class="section bg-muted">
      <div class="container">
        <div class="cert-grid">${certGrid}</div>
        <div class="legal-content" style="margin-top:2rem">
          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:0 0 1rem">Kalite taahhüdümüz</h2>
          <!-- KALİTE POLİTİKASI METNİ: buraya gelecek -->
          <p style="margin:0">Müşteri memnuniyetini, sürekli iyileştirmeyi ve yasal mevzuata uyumu temel kalite politikamız olarak benimsiyoruz. Tasarımdan üretime, satış sonrası servise kadar tüm süreçlerimiz dokümante edilmiş kalite yönetim sistemimizle yönetilir.</p>
        </div>
      </div>
    </section>
  </main>`,
    '',
    '',
    { canonical: 'kalite-politikamiz/index.html' }
  ),

  'iletisim/index.html': shell(
    'İletişim',
    'Duru ULV ile iletişime geçin — telefon, WhatsApp, e-posta. Kayseri merkez ofis ve üretim tesisi.',
    `  <main>
    <section class="section bg-white border-y">
      <div class="container">
        <div class="eyebrow">İletişim</div>
        <h1 class="section-title">Bize ulaşın, projenizi konuşalım.</h1>
        <p style="margin-top:1rem;max-width:40rem;color:rgba(43,46,51,0.75);line-height:1.65">Belediye sivrisinek mücadelesinden ihale teknik şartname desteğine, sera ilaçlamasından hastane dezenfeksiyonuna kadar her ölçekteki ihtiyacınız için ekibimiz ulaşılabilir durumda.</p>
      </div>
    </section>
    <section class="section bg-muted">
      <div class="container">
        <div class="grid-2">
          <div class="contact-card">
            <h2 class="section-title" style="font-size:1.5rem;margin-bottom:1.5rem">Doğrudan iletişim</h2>
            <ul class="contact-list">
              <li><div><div class="contact-list__label">Telefon</div><div class="contact-list__value"><a href="tel:+903523202086">${esc(data.kurumsal_bilgiler.telefon)}</a></div></div></li>
              <li><div><div class="contact-list__label">WhatsApp</div><div class="contact-list__value"><a href="https://wa.me/${data.kurumsal_bilgiler.whatsapp}" target="_blank" rel="noopener">+90 532 065 91 17</a></div></div></li>
              <li><div><div class="contact-list__label">E-posta</div><div class="contact-list__value"><a href="mailto:${data.kurumsal_bilgiler.email}">${esc(data.kurumsal_bilgiler.email)}</a></div></div></li>
              <li><div><div class="contact-list__label">Adres</div><div class="contact-list__value" style="font-size:0.875rem;font-weight:400;color:rgba(43,46,51,0.8)">${esc(data.kurumsal_bilgiler.adres.satir1)}<br>${esc(data.kurumsal_bilgiler.adres.satir2)}</div></div></li>
              <li><div><div class="contact-list__label">Çalışma Saatleri</div><div class="contact-list__value" style="font-size:0.875rem;font-weight:400;color:rgba(43,46,51,0.8)">Pazartesi – Cumartesi: 08:30 – 18:00<br>Pazar: Kapalı</div></div></li>
            </ul>
            <div style="margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:0.75rem">
              <a href="${P}fiyat-teklifi/index.html" class="btn btn--primary">Teklif Al →</a>
              <a href="https://wa.me/${data.kurumsal_bilgiler.whatsapp}" class="btn btn--outline" target="_blank" rel="noopener">WhatsApp ile yaz</a>
            </div>
          </div>
          <div class="contact-card" style="padding:0;overflow:hidden">
            <div class="map-embed">
              <iframe title="Duru ULV konumu" src="https://www.google.com/maps?q=Osman+Kavuncu+Mah.+Emirhan+Cad.+No+4%2FC+Melikgazi+Kayseri&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <div style="padding:1.5rem;border-top:1px solid var(--border-color)">
              <div style="font-family:var(--font-display);font-weight:600;color:var(--color-primary)">Üretim Tesisi &amp; Merkez Ofis</div>
              <p style="font-size:0.875rem;color:rgba(43,46,51,0.7);margin:0.5rem 0 0;line-height:1.6">Kayseri Melikgazi'deki tesisimizde tasarım, üretim ve teknik servis bir arada yürütülmektedir.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>`,
    '',
    '',
    { canonical: 'iletisim/index.html' }
  ),
};

function legalPage(title, intro, canonicalRel, bodyHtml) {
  return shell(
    title,
    intro,
    `  <main>
    <section class="section bg-white border-y">
      <div class="container container--text">
        <div class="eyebrow">Yasal</div>
        <h1 class="section-title">${esc(title)}</h1>
        <p style="margin-top:1rem;color:rgba(43,46,51,0.75);line-height:1.65">${esc(intro)}</p>
      </div>
    </section>
    <section class="section bg-muted">
      <div class="container container--text">
        <div class="legal-content">
${bodyHtml}
        </div>
      </div>
    </section>
  </main>`,
    '',
    '',
    { canonical: canonicalRel || `${title.toLowerCase().replace(/\s+/g, '-')}/index.html` }
  );
}

const k = data.kurumsal_bilgiler;
pages['gizlilik-politikasi/index.html'] = legalPage(
  'Gizlilik Politikası',
  'Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğuna ilişkin politika metni.',
  'gizlilik-politikasi/index.html',
  gizlilikHtml(k)
);
pages['kvkk/index.html'] = legalPage(
  'KVKK Aydınlatma Metni',
  '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu aydınlatma metni.',
  'kvkk/index.html',
  kvkkHtml(k)
);
pages['kullanim-kosullari/index.html'] = legalPage(
  'Kullanım Koşulları',
  'duruulvteknoloji.com.tr web sitesinin kullanımına ilişkin şartlar ve sorumluluk sınırları.',
  'kullanim-kosullari/index.html',
  kullanimKosullariHtml(k)
);

Object.entries(pages).forEach(([rel, html]) => {
  writePage(path.join(ROOT, rel), html);
});

fs.mkdirSync(path.join(ROOT, 'assets/docs'), { recursive: true });
const pdfNote = path.join(ROOT, 'assets/docs/README.txt');
fs.writeFileSync(pdfNote, 'Katalog PDF: duru-ulv-katalog-2026.pdf (Duru ULV Ürün Kataloğu 2026)\n', 'utf8');

console.log('Generated', Object.keys(pages).length, 'site pages');
