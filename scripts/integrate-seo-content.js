/**
 * Duru ULV — SEO içerik entegrasyonu (urun_yazilari/ → site HTML)
 * Kullanım: node scripts/integrate-seo-content.js
 */
const fs = require('fs');
const path = require('path');
const { blogIcon } = require('./blog-icons');
const { buildRichLayout, applySectionIds, standardBlogCta } = require('./blog-rich-layout');
const {
  renderSeoHead,
  injectSeoHead,
  blogCoverOgImageUrl,
  productOgImageUrl,
  productSchemaJson,
  SITE_ORIGIN,
} = require('./seo-meta');

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'urun_yazilari');
const DATA_DIR = path.join(ROOT, 'assets/data');

const PRODUCT_FILES = [
  'urun-metinleri-1-parti.md',
  '01-arac-uzeri-kalan.md',
  '02-sera-tipi.md',
  '03-sirt-tipi.md',
  '04-el-tipi-kalan.md',
];

const BLOG_FILES = [
  '01-faz1-temel-egitici.md',
  '02-faz2-sorun-cozum.md',
  '03-faz3-kurumsal-otorite.md',
  '04-faz4-mevsimsel.md',
  '05-isbirligi-kayseri-sineklik.md',
  '06-sis-ufleme-makinesi-rehber.md',
];

const BLOG_SLUGS = {
  1: 'ulv-ilaclama-nedir',
  2: 'mist-blower-ulv-pulverizator-farki',
  3: 'belediye-ilaclama-ekipmani-secimi',
  4: 'belediye-ilaclama-neden-yetersiz',
  5: 'sera-zararlilari-ulv-karsilastirma',
  6: 'sivrisinek-ilaclama-mikron-capi',
  7: 'duru-ulv-hikayesi',
  8: 'ulv-cihazi-alirken-7-soru',
  9: 'kamu-alimlarinda-ce-iso-sertifikasi',
  10: 'yaz-oncesi-belediye-ilaclama-hazirlik',
  11: 'sonbahar-sera-hasere-kontrolu',
  12: 'sinekle-mucadele-pencere-sinekligi-yeterli-mi',
  13: 'sis-ufleme-makinesi-mist-blower-nedir-rehber',
};

const LEGACY_PRODUCT_SEO = {
  'duru-hd50': {
    seoTitle: 'Araç Üstü Sivrisinek İlaçlama Makinesi | Duru HD50',
    metaDescription:
      'Araç üstü sivrisinek ilaçlama makinesi Duru HD50 ile belediye ve açık alanlarda etkili ULV mücadelesi. 50 L tank, ayarlanabilir mikron. Teklif alın.',
    focusKeyword: 'araç üstü ilaçlama makinesi',
    additionalKeywords:
      'sivrisinek ilaçlama makinesi, belediye ilaçlama makinesi, soğuk sisleme cihazı, duru hd50',
    imageAlt: 'Araç üstü sivrisinek ilaçlama makinesi - Duru HD50',
  },
  'duru-hd5': {
    seoTitle: 'El Tipi Dezenfeksiyon ve Haşere İlaçlama Cihazı | Duru HD5',
    metaDescription:
      'El tipi dezenfeksiyon cihazı Duru HD5 ile hastane, otel ve kapalı alanlarda etkili ULV ilaçlama. 5 L tank, hafif tasarım. Teklif alın.',
    focusKeyword: 'el tipi dezenfeksiyon cihazı',
    additionalKeywords:
      'el tipi ilaçlama makinesi, elektrikli sisleme cihazı, hastane dezenfeksiyon cihazı, duru hd5',
    imageAlt: 'El tipi dezenfeksiyon cihazı - Duru HD5',
  },
  'duru-x20': {
    seoTitle: 'Çift Başlıklı El Tipi Dezenfeksiyon Makinesi | Duru X20',
    metaDescription:
      'Çift başlıklı el tipi dezenfeksiyon makinesi Duru X20 ile fabrika ve depo alanlarında yüksek kapasiteli ULV uygulama. 20 L tank. Teklif alın.',
    focusKeyword: 'el tipi dezenfeksiyon makinesi',
    additionalKeywords:
      'çift başlıklı sisleme cihazı, fabrika dezenfeksiyon cihazı, taşınabilir ilaçlama cihazı, duru x20',
    imageAlt: 'Çift başlıklı el tipi dezenfeksiyon makinesi - Duru X20',
  },
};

const BLOG_AUTHOR = 'Hacı DURUÖZ';
const BLOG_PUBLISHER = 'Duru U.L.V. Teknoloji Sistemleri';

const BLOG_AUTHOR_BY_SLUG = {
  'sinekle-mucadele-pencere-sinekligi-yeterli-mi': { name: 'Tarık AKCAN', email: 'takcan@gmail.com' },
  'ulv-cihazi-alirken-7-soru': { name: 'Tarık AKCAN', email: 'takcan@gmail.com' },
};

function getBlogAuthor(slug) {
  return BLOG_AUTHOR_BY_SLUG[slug] || { name: BLOG_AUTHOR };
}

const BLOG_DATE_BY_SLUG = {
  'ulv-ilaclama-nedir': '2026-06-03',
  'mist-blower-ulv-pulverizator-farki': '2026-06-05',
  'belediye-ilaclama-ekipmani-secimi': '2026-06-08',
  'belediye-ilaclama-neden-yetersiz': '2026-06-10',
  'sera-zararlilari-ulv-karsilastirma': '2026-06-12',
  'sivrisinek-ilaclama-mikron-capi': '2026-06-15',
  'duru-ulv-hikayesi': '2026-06-18',
  'ulv-cihazi-alirken-7-soru': '2026-06-20',
  'kamu-alimlarinda-ce-iso-sertifikasi': '2026-06-22',
  'yaz-oncesi-belediye-ilaclama-hazirlik': '2026-06-26',
  'sonbahar-sera-hasere-kontrolu': '2026-06-28',
  'sinekle-mucadele-pencere-sinekligi-yeterli-mi': '2026-06-30',
  'sis-ufleme-makinesi-mist-blower-nedir-rehber': '2026-07-02',
};

/** Makale içi görsel yerleşimi: bölüm indeksinden sonra (0 = ilk h2 sonrası) */
const BLOG_IMAGE_PLACEMENT = {
  'ulv-ilaclama-nedir': { cover: 0 },
  'mist-blower-ulv-pulverizator-farki': {
    cover: 0,
  },
  'belediye-ilaclama-ekipmani-secimi': { cover: 1 },
  'belediye-ilaclama-neden-yetersiz': { cover: 1 },
  'sera-zararlilari-ulv-karsilastirma': {
    cover: 0,
  },
  'sivrisinek-ilaclama-mikron-capi': { cover: 1 },
  'duru-ulv-hikayesi': { cover: 0 },
  'ulv-cihazi-alirken-7-soru': { cover: 1 },
  'kamu-alimlarinda-ce-iso-sertifikasi': { cover: 1 },
  'yaz-oncesi-belediye-ilaclama-hazirlik': { cover: 2 },
  'sonbahar-sera-hasere-kontrolu': { cover: 1 },
  'sinekle-mucadele-pencere-sinekligi-yeterli-mi': { cover: 1 },
};

/** RankMath odak kelime uyumlu kapak görseli alt metinleri (birebir kullanılır) */
const BLOG_IMAGE_ALT = {
  'belediye-ilaclama-ekipmani-secimi': 'Belediye ilaçlama makinesi ile araç üstü sivrisinek mücadelesi',
  'belediye-ilaclama-neden-yetersiz': 'Belediye ilaçlaması neden yetersiz kalıyor - sokak ilaçlaması ve saklanan haşereler',
  'duru-ulv-hikayesi': 'Duru ULV 36 yıllık üretim tecrübesi - 1990\'dan bugüne zaman çizelgesi',
  'kamu-alimlarinda-ce-iso-sertifikasi': 'CE sertifikalı ULV cihazı - kamu ihalesi sertifikasyon güvencesi',
  'mist-blower-ulv-pulverizator-farki': 'Mist blower nedir - mist blower ve ULV pulverizatör karşılaştırması',
  'sera-zararlilari-ulv-karsilastirma': 'Sera zararlıları - geleneksel ilaçlama ile ULV yöntemi karşılaştırması',
  'sinekle-mucadele-pencere-sinekligi-yeterli-mi': 'Sinekle mücadele - pencere sinekliği ve bahçe ULV ilaçlama karşılaştırması',
  'sivrisinek-ilaclama-mikron-capi': 'Sivrisinek ilaçlama mikron çapı ayarı - damlacık boyutu rehberi',
  'sonbahar-sera-hasere-kontrolu': 'Sera haşere kontrolü - sonbahar döneminde ULV ilaçlama uygulaması',
  'ulv-cihazi-alirken-7-soru': 'ULV cihazı alırken nelere dikkat edilmeli - 7 kritik soru rehberi',
  'ulv-ilaclama-nedir': 'ULV ilaçlama nedir - soğuk sisleme tekniği ile dış mekan uygulaması',
  'yaz-oncesi-belediye-ilaclama-hazirlik': 'Belediye ilaçlama ekipmanı yaz sezonu hazırlık ve bakım rehberi',
  'sis-ufleme-makinesi-mist-blower-nedir-rehber':
    'Mist blower nasıl çalışır - teknik inceleme, 35 mikron mikronizasyon ve hava akım kanalı şeması',
};

function getBlogCoverAlt(slug) {
  return BLOG_IMAGE_ALT[slug] || '';
}

const BLOG_CUSTOM_BODY = {
  'sis-ufleme-makinesi-mist-blower-nedir-rehber': require('./blog-bodies/sis-ufleme-makinesi'),
};

function blogAssetPath(slug, suffix) {
  const dir = path.join(ROOT, 'assets', 'img', 'blog');
  for (const ext of ['webp', 'png', 'jpg']) {
    const file = `${slug}-${suffix}.${ext}`;
    if (fs.existsSync(path.join(dir, file))) return file;
  }
  return `${slug}-${suffix}.webp`;
}

function blogCoverSchemaUrl(slug) {
  return `https://www.duruulvteknoloji.com.tr/assets/img/blog/${blogAssetPath(slug, 'cover')}`;
}

/** Makale sonu görselleri (sertifika bandı, karşılaştırma infografiği vb.) */
const BLOG_FOOTER_IMAGES = {
  'duru-ulv-hikayesi': {
    file: 'duru-ulv-hikayesi-sertifikalar.png',
    alt: 'Duru ULV sertifikaları - CE, TSE, ISO 45001, ISO 9001, ISO 14001 ve bakanlık onayları',
  },
  'mist-blower-ulv-pulverizator-farki': {
    file: 'mist-blower-ulv-pulverizator-farki-detail.webp',
    alt: 'Mist blower yoğun sisleme ile ULV pulverizatör ince damlacık karşılaştırması',
    full: true,
  },
  'sera-zararlilari-ulv-karsilastirma': {
    file: 'sera-zararlilari-ulv-karsilastirma-detail.webp',
    alt: 'Sera zararlıları mücadelesinde sırt tipi geleneksel ilaçlama uygulaması',
    full: true,
  },
};

function blogImageExists(slug, suffix) {
  return fs.existsSync(path.join(ROOT, 'assets', 'img', 'blog', `${slug}-${suffix}.webp`));
}

function formatDateTr(iso) {
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  ];
  const parts = iso.split('-').map(Number);
  return `${parts[2]} ${months[parts[1] - 1]} ${parts[0]}`;
}

function getBlogDate(slug) {
  return BLOG_DATE_BY_SLUG[slug] || '2026-06-30';
}

const catalog = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'urunler.json'), 'utf8'));
const k = catalog.kurumsal_bilgiler;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeKey(s) {
  return s
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function buildProductLookup(products) {
  const map = {};
  products.forEach((p) => {
    map[p.slug] = p;
    const variants = [
      p.ad_tr,
      p.ad_tr.replace(/\s*\([^)]*\)/g, '').trim(),
      p.model_kodu,
      p.slug.replace(/-/g, ' '),
    ];
    variants.forEach((v) => {
      if (!v) return;
      map[v.toLowerCase()] = p;
      map[normalizeKey(v)] = p;
    });
  });
  return map;
}

const productLookup = buildProductLookup(catalog.urunler);

function findProductByModel(modelName) {
  if (!modelName) return null;
  const key = modelName.trim();
  if (productLookup[key.toLowerCase()]) return productLookup[key.toLowerCase()];
  if (productLookup[normalizeKey(key)]) return productLookup[normalizeKey(key)];

  const slugGuess = normalizeKey(key).replace(/\s+/g, '-');
  if (productLookup[slugGuess]) return productLookup[slugGuess];

  for (const p of catalog.urunler) {
    if (p.ad_tr.toLowerCase().includes(key.toLowerCase())) return p;
    if (key.toLowerCase().includes(p.slug.replace(/-/g, ' '))) return p;
  }
  return null;
}

function parseMetaBlock(text) {
  const meta = {};
  const block = text.match(/```(?:\r?\n)([\s\S]*?)```/);
  if (!block) return meta;
  block[1].split(/\r?\n/).forEach((line) => {
    line = line.replace(/\r$/, '').trim();
    if (!line) return;
    const m = line.match(/^([^:]+):\s*(.+)$/);
    if (!m) return;
    const key = m[1].trim().toLowerCase();
    const val = m[2].trim();
    if (key.includes('seo') && key.includes('başlık')) meta.seoTitle = val;
    else if (key.includes('meta') && key.includes('açıklama')) meta.metaDescription = val;
    else if (key.includes('odak')) meta.focusKeyword = val;
    else if (key.includes('ek anahtar')) meta.additionalKeywords = val;
    else if (key.includes('görsel')) meta.imageAlt = val;
  });
  return meta;
}

function parseKeywordsLine(text) {
  const m = text.match(/\*\*Hedef anahtar kelimeler:\*\*\s*(.+)/i);
  if (!m) return {};
  const parts = m[1].split(',').map((s) => s.trim()).filter(Boolean);
  return {
    focusKeyword: parts[0] || '',
    additionalKeywords: parts.slice(1).join(', '),
  };
}

function parseSections(text) {
  text = text.replace(/\r\n/g, '\n');
  const parts = text.split(/###\s*Sıkça Sorulan Sorular/i);
  const main = parts[0];
  const faqPart = parts[1] || '';

  const sections = [];
  const re = /###\s+([^\n]+)\n+([\s\S]*?)(?=\n###\s+|\n---\s*$|$)/g;
  let match;
  while ((match = re.exec(main)) !== null) {
    const heading = match[1].trim();
    if (/sıkça sorulan/i.test(heading)) continue;
    if (/hedef anahtar/i.test(heading)) continue;
    const body = match[2].trim();
    if (!body || body.startsWith('```')) continue;
    sections.push({ heading, body });
  }

  const faqs = [];
  const faqRe = /\*\*([^*]+)\*\*\s*([\s\S]*?)(?=\n\n\*\*|\n---\s*$|$)/g;
  while ((match = faqRe.exec(faqPart)) !== null) {
    faqs.push({
      q: match[1].trim(),
      a: match[2].trim().replace(/\s+/g, ' '),
    });
  }

  return { sections, faqs };
}

function convertInternalLink(href, linkPrefix) {
  if (/^https?:\/\//i.test(href)) return href;
  let p = href.replace(/^\//, '');
  if (p.endsWith('/')) p += 'index.html';
  else if (!/\.html$/i.test(p)) p += '/index.html';
  return linkPrefix + p;
}

function inlineMarkdown(text, linkPrefix) {
  const parts = [];
  const tokenRe = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/g;
  let lastIndex = 0;
  let match;
  while ((match = tokenRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(esc(text.slice(lastIndex, match.index)));
    }
    if (match[2]) {
      const href = match[3];
      const external = /^https?:\/\//i.test(href);
      const url = external ? href : convertInternalLink(href, linkPrefix);
      const attrs = external ? ' target="_blank" rel="noopener"' : '';
      parts.push(
        `<a href="${esc(url)}"${attrs} style="color:var(--color-primary);font-weight:600">${esc(match[2])}</a>`
      );
    } else if (match[4]) {
      parts.push(`<strong>${esc(match[4])}</strong>`);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(esc(text.slice(lastIndex)));
  return parts.join('');
}

function bodyToHtml(body, linkPrefix) {
  body = body.replace(/^>\s*📅[\s\S]*?(?=\n\n)/gm, '');
  body = body.replace(/^>\s*.*yayın zamanlaması.*$/gim, '');

  const blocks = body.split(/\n\n+/).filter((b) => b.trim());
  let html = '';

  blocks.forEach((block) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    if (/^\d+\.\s+/.test(trimmed)) {
      const items = trimmed.split(/\n(?=\d+\.\s+)/);
      html += '<ol class="content-list">';
      items.forEach((item) => {
        const content = item.replace(/^\d+\.\s+/, '').trim();
        html += `<li>${inlineMarkdown(content, linkPrefix)}</li>`;
      });
      html += '</ol>';
      return;
    }

    html +=
      '<p style="color:rgba(43,46,51,0.8);line-height:1.65;margin-bottom:1.25rem">' +
      inlineMarkdown(trimmed.replace(/\n/g, ' '), linkPrefix) +
      '</p>';
  });

  return html;
}

function sectionsToHtml(sections, linkPrefix, isBlog, imageOpts) {
  const { slug, prefix, imageAlt } = imageOpts || {};
  const placement = slug ? (BLOG_IMAGE_PLACEMENT[slug] || { cover: 1 }) : {};

  return sections
    .map((sec, i) => {
      const h2Style = isBlog
        ? ''
        : ` style="font-size:clamp(1.125rem,2vw,1.375rem);margin-top:${i === 0 ? '0' : '2rem'};margin-bottom:0.75rem"`;
      const h2Class = isBlog ? '' : ' class="section-title"';
      const h2Id = isBlog && sec.id ? ` id="${esc(sec.id)}"` : '';
      let html =
        `<h2${h2Id}${h2Class}${h2Style}>${esc(sec.heading)}</h2>\n` +
        bodyToHtml(sec.body, linkPrefix);

      if (isBlog && slug && prefix) {
        if (placement.cover === i && blogImageExists(slug, 'cover')) {
          html += `\n${blogFigureHtml(slug, 'cover', prefix, imageAlt, 'featured')}`;
        }
        if (placement.detail === i && blogImageExists(slug, 'detail')) {
          const detailAlt = placement.detailCaption || `${sec.heading} — görsel`;
          html += `\n${blogFigureHtml(slug, 'detail', prefix, detailAlt, 'detail')}`;
        }
      }

      return html;
    })
    .join('\n');
}

function faqsToAccordion(faqs, linkPrefix) {
  const prefix = linkPrefix || '../../';
  return faqs
    .map(
      (f) =>
        `          <div class="accordion__item">
            <button type="button" class="accordion__trigger" aria-expanded="false">${esc(f.q)}<svg class="accordion__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>
            <div class="accordion__content">${inlineMarkdown(f.a, prefix)}</div>
          </div>`
    )
    .join('\n');
}

function splitArticles(md, isBlog) {
  const articles = [];
  const chunks = md.split(/\n---\n/);
  chunks.forEach((chunk) => {
    const re = /^##\s+(\d+)\.\s+(.+)$/gm;
    let match;
    let lastIndex = 0;
    let lastMeta = null;
    while ((match = re.exec(chunk)) !== null) {
      if (lastMeta) {
        articles.push({
          ...lastMeta,
          content: chunk.slice(lastIndex, match.index).trim(),
        });
      }
      const num = parseInt(match[1], 10);
      const title = match[2].trim();
      const modelMatch = title.match(/\(([^)]+)\)\s*$/);
      lastMeta = {
        num,
        title,
        modelName: modelMatch ? modelMatch[1].trim() : null,
        slug: isBlog ? BLOG_SLUGS[num] : null,
      };
      lastIndex = match.index + match[0].length;
    }
    if (lastMeta) {
      articles.push({
        ...lastMeta,
        content: chunk.slice(lastIndex).trim(),
      });
    }
  });
  return articles;
}

function parseProductArticle(article) {
  const meta = { ...parseMetaBlock(article.content), ...parseKeywordsLine(article.content) };
  const { sections, faqs } = parseSections(article.content);
  const product = findProductByModel(article.modelName);
  if (!product) return null;

  if (!meta.seoTitle && LEGACY_PRODUCT_SEO[product.slug]) {
    Object.assign(meta, LEGACY_PRODUCT_SEO[product.slug]);
  }
  if (!meta.seoTitle) {
    meta.seoTitle = `${product.ad_tr.replace(/\s*\([^)]*\)/, '')} | Duru ULV`;
  }
  if (!meta.metaDescription) {
    meta.metaDescription = `${product.kisa_aciklama_tr}. Duru ULV ${product.ad_tr} için teklif alın.`;
  }
  if (!meta.imageAlt) {
    meta.imageAlt = `${product.kisa_aciklama_tr} - ${product.ad_tr.replace(/\s*\([^)]*\)/, '')}`;
  }

  return { product, meta, sections, faqs };
}

function parseBlogArticle(article) {
  const meta = parseMetaBlock(article.content);
  const { sections, faqs } = parseSections(article.content);
  if (!meta.seoTitle) meta.seoTitle = article.title;
  if (!meta.metaDescription) {
    const first = sections[0];
    meta.metaDescription = first
      ? first.body.replace(/\s+/g, ' ').slice(0, 156)
      : article.title;
  }
  return {
    slug: article.slug || BLOG_SLUGS[article.num],
    title: article.title.replace(/^\d+\.\s*/, ''),
    meta,
    sections,
    faqs,
    num: article.num,
  };
}

function updateProductPage(product, data) {
  const pagePath = path.join(
    ROOT,
    'urunler',
    product.kategori_slug,
    product.slug,
    'index.html'
  );
  if (!fs.existsSync(pagePath)) {
    console.warn('  ⚠ Sayfa yok:', pagePath);
    return false;
  }

  let html = fs.readFileSync(pagePath, 'utf8');
  const linkPrefix = '../../../';
  const title = data.meta.seoTitle.includes('Duru')
    ? data.meta.seoTitle
    : `${data.meta.seoTitle} — Duru ULV`;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${esc(data.meta.metaDescription)}">`
  );

  const keywords = [data.meta.focusKeyword, data.meta.additionalKeywords]
    .filter(Boolean)
    .join(', ');
  if (keywords) {
    if (html.includes('name="keywords"')) {
      html = html.replace(
        /<meta name="keywords" content="[^"]*">/,
        `<meta name="keywords" content="${esc(keywords)}">`
      );
    } else {
      html = html.replace(
        /<meta name="description"[^>]*>/,
        `$&\n  <meta name="keywords" content="${esc(keywords)}">`
      );
    }
  }

  const contentHtml = sectionsToHtml(data.sections, linkPrefix, false);
  html = html.replace(
    /<!-- GENİŞ AÇIKLAMA: buraya gelecek -->[\s\S]*?(?=\s*<\/div>\s*<\/section>\s*<section class="section bg-muted border-y">)/,
    contentHtml.trimEnd()
  );

  if (data.faqs.length) {
    html = html.replace(
      /(<div class="eyebrow">Sıkça Sorulan Sorular<\/div>[\s\S]*?<div class="accordion" data-accordion>)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/,
      `$1\n${faqsToAccordion(data.faqs)}\n        $2`
    );
  }

  const alt = esc(data.meta.imageAlt);
  html = html.replace(/(<img data-gallery-main[^>]*alt=")[^"]*(")/, `$1${alt}$2`);
  html = html.replace(/(data-gallery-thumb[^>]*data-alt=")[^"]*(")/g, `$1${alt}$2`);

  const canonicalRel = `urunler/${product.kategori_slug}/${product.slug}/index.html`;
  const imageManifest = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'product-images.json'), 'utf8')
  );
  const seoBlock = renderSeoHead({
    title,
    description: data.meta.metaDescription,
    canonicalPathRel: canonicalRel,
    ogType: 'product',
    ogImage: productOgImageUrl(product.slug, imageManifest),
    ogImageAlt: data.meta.imageAlt || product.ad_tr,
    keywords: keywords || undefined,
  });
  html = injectSeoHead(html, seoBlock);

  const productSchema = productSchemaJson(
    product,
    { metaDescription: data.meta.metaDescription, imageManifest },
    canonicalRel
  );
  if (html.includes('application/ld+json') && html.includes('"@type":"Product"')) {
    html = html.replace(
      /<script type="application\/ld\+json">\{[^<]*"@type":"Product"[^<]*\}<\/script>/,
      `<script type="application/ld+json">${productSchema}</script>`
    );
  } else if (!html.includes('"@type":"Product"')) {
    html = html.replace(
      /<\/head>/,
      `  <script type="application/ld+json">${productSchema}</script>\n</head>`
    );
  }

  fs.writeFileSync(pagePath, html, 'utf8');
  return true;
}

function navDepthFromRel(rel) {
  const dir = path.dirname(rel.replace(/\\/g, '/'));
  if (dir === '.') return 0;
  return dir.split('/').filter(Boolean).length;
}

function prefixFromDepth(depth) {
  return depth === 0 ? '' : '../'.repeat(depth);
}

function blogListHref(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return 'blog/index.html';
  if (rel === 'blog/index.html') return 'index.html';
  const depth = navDepthFromRel(rel);
  return `${prefixFromDepth(depth)}blog/index.html`;
}

function blogCoverHtml(slug, prefix, alt) {
  const base = `${prefix}assets/img/blog/${slug}-cover`;
  return `<div class="blog-cover" data-blog-cover>
          <img src="${base}.webp" alt="${esc(alt)}" class="blog-cover__img" width="1200" height="675" loading="eager"
            onerror="this.onerror=null;this.src='${base}.jpg';this.onerror=function(){this.parentElement.classList.add('is-empty');}">
          <div class="blog-cover__placeholder">
            <span class="blog-cover__hint">Kapak görseli: assets/img/blog/${slug}-cover.webp veya .jpg</span>
          </div>
        </div>`;
}

function blogFigureHtml(slug, suffix, prefix, alt, variant) {
  const src = `${prefix}assets/img/blog/${slug}-${suffix}.webp`;
  const mod = variant === 'detail' ? 'detail' : 'featured';
  return `<figure class="blog-figure blog-figure--${mod}">
          <div class="blog-figure__frame">
            <img src="${src}" alt="${esc(alt)}" class="blog-figure__img" width="960" height="540" loading="lazy">
          </div>
          <figcaption class="blog-figure__caption">${esc(alt)}</figcaption>
        </figure>`;
}

function blogFooterImageHtml(slug, prefix) {
  const cfg = BLOG_FOOTER_IMAGES[slug];
  if (!cfg) return '';
  const src = `${prefix}assets/img/blog/${cfg.file}`;
  if (!fs.existsSync(path.join(ROOT, 'assets', 'img', 'blog', cfg.file))) return '';
  const mod = cfg.full ? ' blog-trust-banner--full' : '';
  const caption = cfg.caption
    ? `\n          <figcaption class="blog-trust-banner__caption">${esc(cfg.caption)}</figcaption>`
    : '';
  return `
        <figure class="blog-trust-banner${mod}">
          <img src="${src}" alt="${esc(cfg.alt)}" class="blog-trust-banner__img" loading="lazy">${caption}
        </figure>`;
}

function blogCardMediaHtml(slug, prefix, postHref, alt) {
  const file = blogAssetPath(slug, 'cover');
  const src = `${prefix}assets/img/blog/${file}`;
  const base = `${prefix}assets/img/blog/${slug}-cover`;
  return `            <a href="${postHref}" class="blog-card__media" tabindex="-1" aria-hidden="true">
              <img src="${src}" alt="${esc(alt)}" class="blog-card__img" width="640" height="360" loading="lazy"
                onerror="this.onerror=null;this.src='${base}.jpg';this.onerror=function(){this.parentElement.classList.add('is-empty');}">
              <div class="blog-card__placeholder">
                <span>assets/img/blog/${slug}-cover.webp</span>
              </div>
            </a>`;
}

function blogHeader(prefix, blogHref) {
  return `  <header class="site-header no-print">
    <div class="container site-header__inner">
      <a href="${prefix}index.html" class="site-logo">
        <img src="${prefix}assets/img/duru-hd-logo.svg" alt="Duru ULV Teknoloji Sistemleri" class="site-logo__img" width="298" height="161">
      </a>
      <nav class="site-nav" aria-label="Ana menü">
        <a href="${prefix}index.html" class="site-nav__link" data-nav-link>Anasayfa</a>
        <a href="${prefix}urunler/index.html" class="site-nav__link" data-nav-link>Ürünler</a>
        <a href="${prefix}katalog/index.html" class="site-nav__link" data-nav-link>Katalog</a>
        <a href="${blogHref}" class="site-nav__link" data-nav-link>Blog</a>
        <a href="${prefix}urun-karsilastirma/index.html" class="site-nav__link" data-nav-link data-compare-nav>Karşılaştır <span class="site-nav__badge" data-compare-count style="display:none">0</span></a>
        <a href="${prefix}hakkimizda/index.html" class="site-nav__link" data-nav-link>Hakkımızda</a>
        <a href="${prefix}iletisim/index.html" class="site-nav__link" data-nav-link>İletişim</a>
      </nav>
      <div class="header-actions">
        <button type="button" class="lang-switcher">TR ▾</button>
        <a href="${prefix}fiyat-teklifi/index.html" class="btn btn--primary btn--sm header-cta">Teklif Al</a>
        <button type="button" class="mobile-toggle" data-mobile-toggle aria-expanded="false" aria-label="Menü"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
      </div>
    </div>
    <div class="mobile-menu" data-mobile-menu>
      <div class="container">
        <a href="${prefix}index.html" class="mobile-menu__link">Anasayfa</a>
        <a href="${prefix}urunler/index.html" class="mobile-menu__link">Ürünler</a>
        <a href="${prefix}katalog/index.html" class="mobile-menu__link">Katalog</a>
        <a href="${blogHref}" class="mobile-menu__link">Blog</a>
        <a href="${prefix}urun-karsilastirma/index.html" class="mobile-menu__link" data-compare-nav>Karşılaştır <span class="site-nav__badge" data-compare-count style="display:none">0</span></a>
        <a href="${prefix}fiyat-teklifi/index.html" class="btn btn--primary btn--block" style="margin-top:0.75rem">Teklif Al</a>
      </div>
    </div>
  </header>`;
}

function blogFooter(prefix, blogHref) {
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
            <li><a href="${blogHref}">Blog</a></li>
            <li><a href="${prefix}katalog/index.html">Katalog</a></li>
            <li><a href="${prefix}urun-karsilastirma/index.html" data-compare-nav>Karşılaştır</a></li>
            <li><a href="${prefix}hakkimizda/index.html">Hakkımızda</a></li>
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

  <a href="https://wa.me/${k.whatsapp}?text=Merhaba%2C%20Duru%20ULV%20%C3%BCr%C3%BCnleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum." class="whatsapp-btn wa-pulse no-print" target="_blank" rel="noopener" aria-label="WhatsApp ile iletişime geç"><span class="whatsapp-btn__inner"><img src="${prefix}assets/img/whatsapp-icon.svg" alt="" width="28" height="28" class="whatsapp-btn__icon"></span></a>`;
}

function blogBylineHtml(post, prefix) {
  const dateLabel = formatDateTr(getBlogDate(post.slug));
  const author = getBlogAuthor(post.slug);
  const authorLine = author.email
    ? `Yazar: ${esc(author.name)} · <a href="mailto:${author.email}">${esc(author.email)}</a>`
    : `Yazar: ${esc(author.name)}`;

  return `<div class="blog-brand">
          <img src="${prefix}assets/img/duru-icon.svg" alt="" class="blog-brand__logo" width="48" height="48">
          <div class="blog-brand__text">
            <strong>${esc(BLOG_PUBLISHER)}</strong>
            <span class="blog-brand__author">${authorLine}</span>
            <span class="blog-brand__date">${esc(dateLabel)}</span>
          </div>
        </div>`;
}

function blogRichBreadcrumb(prefix, blogHref, title) {
  return `  <div class="breadcrumb-bar">
    <div class="container">
      <ol class="breadcrumb">
        <li><a href="${prefix}index.html">Anasayfa</a></li>
        <li><a href="${blogHref}">Blog</a></li>
        <li><span class="breadcrumb__current">${esc(title)}</span></li>
      </ol>
    </div>
  </div>`;
}

function blogRichHero(post, prefix, displayTitle, layout) {
  const dateLabel = formatDateTr(getBlogDate(post.slug));
  const author = getBlogAuthor(post.slug);
  const authorName = esc(author.name);

  return `    <section class="blog-hero blog-hero--rich">
      <div class="container blog-hero__inner">
        <span class="blog-hero__tag">${esc(layout.tag)}</span>
        <h1>${esc(displayTitle)}</h1>
        <p class="blog-hero__lead">${esc(layout.lead)}</p>
        <div class="blog-hero__meta">
          <span class="blog-hero__meta-item">${blogIcon('calendar', 'blog-icon blog-icon--meta')} ${esc(dateLabel)}</span>
          <span class="blog-hero__meta-item">${blogIcon('clock', 'blog-icon blog-icon--meta')} ${layout.readMinutes} dk okuma</span>
          <span class="blog-hero__meta-item">${blogIcon('user', 'blog-icon blog-icon--meta')} ${authorName}</span>
        </div>
      </div>
    </section>`;
}

function blogRichSidebar(layout) {
  const tocItems = layout.toc
    .map(
      (item) =>
        `            <li><a href="#${esc(item.id)}" class="blog-toc__link">${esc(item.label)}</a></li>`
    )
    .join('\n');
  const tagItems = layout.tags
    .map((tag) => {
      const label = typeof tag === 'string' ? tag : tag.label;
      const href = typeof tag === 'string' ? '../index.html' : tag.href;
      return `          <a href="../../${href}" class="blog-tag">${esc(label)}</a>`;
    })
    .join('\n');

  return `        <aside class="blog-sidebar" aria-label="İçindekiler">
          <div class="blog-sidebar__panel">
            <h2 class="blog-sidebar__heading">İçindekiler</h2>
            <ol class="blog-toc">
${tocItems}
            </ol>
          </div>
          <div class="blog-sidebar__panel">
            <h2 class="blog-sidebar__heading">İlgili Etiketler</h2>
            <div class="blog-tags">
${tagItems}
            </div>
          </div>
        </aside>`;
}

function generateBlogPost(post) {
  const prefix = '../../';
  const linkPrefix = '../../';
  const blogHref = '../index.html';
  const displayTitle = post.title.replace(/\s*\([^)]*\)\s*$/, '').replace(/^\d+\.\s*/, '');
  const pageTitle = post.meta.seoTitle.includes('Duru')
    ? post.meta.seoTitle
    : `${post.meta.seoTitle} — Duru ULV`;
  const dateIso = getBlogDate(post.slug);
  const author = getBlogAuthor(post.slug);
  const byline = blogBylineHtml(post, prefix);
  const imageAlt = getBlogCoverAlt(post.slug) || post.meta.imageAlt || displayTitle;

  const richLayout = buildRichLayout(post);
  const sectionsWithIds = applySectionIds(post.sections, richLayout);

  let bodyHtml = BLOG_CUSTOM_BODY[post.slug]
    ? BLOG_CUSTOM_BODY[post.slug](prefix, esc)
    : sectionsToHtml(sectionsWithIds, linkPrefix, true, {
        slug: post.slug,
        prefix,
        imageAlt,
      });

  if (!BLOG_CUSTOM_BODY[post.slug]) {
    bodyHtml += `\n${standardBlogCta(prefix)}`;
  }
  const faqSection = post.faqs.length
    ? `
    <section class="section bg-muted border-y">
      <div class="container container--text">
        <div class="eyebrow">Sıkça Sorulan Sorular</div>
        <h2 class="section-title" style="margin-bottom:2rem">Hızlı yanıtlar</h2>
        <div class="accordion" data-accordion>
${faqsToAccordion(post.faqs, prefix)}
        </div>
      </div>
    </section>`
    : '';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: displayTitle,
    description: post.meta.metaDescription,
    datePublished: dateIso,
    dateModified: dateIso,
    url: `${SITE_ORIGIN}/blog/${post.slug}/`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_ORIGIN}/blog/${post.slug}/`,
    },
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.email ? { email: author.email } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: BLOG_PUBLISHER,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}/assets/img/duru-hd-logo.svg`,
      },
    },
    image: blogCoverSchemaUrl(post.slug),
  };

  const seoBlock = renderSeoHead({
    title: pageTitle,
    description: post.meta.metaDescription,
    canonicalPathRel: `blog/${post.slug}/index.html`,
    ogType: 'article',
    ogImage: blogCoverOgImageUrl(post.slug, ROOT),
    ogImageAlt: imageAlt,
  });

  const articleInner = `${bodyHtml}${blogFooterImageHtml(post.slug, prefix)}`;

  const mainContent = `${blogRichBreadcrumb(prefix, blogHref, displayTitle)}
${blogRichHero(post, prefix, displayTitle, richLayout)}

    <section class="section bg-white blog-section--rich">
      <div class="container blog-layout">
${blogRichSidebar(richLayout)}
        <div class="blog-main">
          <article class="blog-article blog-article--rich">
${articleInner}
          </article>
          <p class="blog-back"><a href="${blogHref}">← Tüm blog yazıları</a></p>
        </div>
      </div>
    </section>`;

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(post.meta.metaDescription)}">
  <title>${esc(pageTitle)}</title>
${seoBlock}
  <link rel="icon" href="${prefix}assets/img/duru-icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${prefix}assets/css/main.css">
  <link rel="stylesheet" href="${prefix}assets/css/components.css">
  <link rel="stylesheet" href="${prefix}assets/css/blog.css">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>

${blogHeader(prefix, blogHref)}

  <main>
${mainContent}
${faqSection}
  </main>

${blogFooter(prefix, blogHref)}

  <script src="${prefix}assets/js/compare.js"></script>
  <script src="${prefix}assets/js/main.js"></script>
</body>
</html>
`;
}

function generateBlogIndex(posts) {
  const prefix = '../';
  const blogHref = 'index.html';
  const cards = posts
    .sort((a, b) => a.num - b.num)
    .map((post) => {
      const excerpt = post.meta.metaDescription.slice(0, 140);
      const title = post.title.replace(/^\d+\.\s*/, '');
      const dateLabel = formatDateTr(getBlogDate(post.slug));
      const postHref = `${post.slug}/index.html`;
      const cardAuthor = getBlogAuthor(post.slug).name;
      const cardAlt = getBlogCoverAlt(post.slug) || title;
      return `          <article class="blog-card lift-card">
${blogCardMediaHtml(post.slug, prefix, postHref, cardAlt)}
            <div class="blog-card__body">
              <p class="blog-card__meta">${esc(dateLabel)} · ${esc(cardAuthor)}</p>
              <h2 class="blog-card__title"><a href="${postHref}">${esc(title)}</a></h2>
              <p class="blog-card__excerpt">${esc(excerpt)}</p>
              <a href="${postHref}" class="blog-card__link">Yazıyı oku →</a>
            </div>
          </article>`;
    })
    .join('\n');

  const indexSeo = renderSeoHead({
    title: 'Blog — Duru ULV',
    description:
      'ULV ilaçlama, belediye mücadelesi, sera zararlıları ve ekipman seçimi hakkında uzman blog yazıları — Duru ULV.',
    canonicalPathRel: 'blog/index.html',
    ogImage: blogCoverOgImageUrl('ulv-ilaclama-nedir', ROOT),
    ogImageAlt: 'Duru ULV blog',
  });

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="ULV ilaçlama, belediye mücadelesi, sera zararlıları ve ekipman seçimi hakkında uzman blog yazıları — Duru ULV.">
  <title>Blog — Duru ULV</title>
${indexSeo}
  <link rel="icon" href="${prefix}assets/img/duru-icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${prefix}assets/css/main.css">
  <link rel="stylesheet" href="${prefix}assets/css/components.css">
  <link rel="stylesheet" href="${prefix}assets/css/blog.css">
</head>
<body>

${blogHeader(prefix, blogHref)}

  <main>
    <section class="blog-hero">
      <div class="container">
        <div class="eyebrow">Blog</div>
        <h1>ULV ilaçlama bilgi merkezi</h1>
        <p>ULV teknolojisi, belediye mücadelesi, sera zararlıları ve ekipman seçimi hakkında uzman içerikler.</p>
      </div>
    </section>
    <section class="section bg-muted border-y">
      <div class="container">
        <div class="blog-grid">
${cards}
        </div>
      </div>
    </section>
  </main>

${blogFooter(prefix, blogHref)}

  <script src="${prefix}assets/js/compare.js"></script>
  <script src="${prefix}assets/js/main.js"></script>
</body>
</html>
`;
}

function patchNavInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  const blogHref = blogListHref(filePath);
  const hadBlog = /blog\/index\.html/.test(html);

  if (!hadBlog) {
    const depth = navDepthFromRel(path.relative(ROOT, filePath).replace(/\\/g, '/'));
    const prefix = prefixFromDepth(depth);
    const blogLink = `<a href="${blogHref}" class="site-nav__link" data-nav-link>Blog</a>`;

    html = html.replace(
      /(<a href="[^"]*katalog\/index\.html" class="site-nav__link"[^>]*>Katalog<\/a>)/,
      `$1\n        ${blogLink}`
    );
    html = html.replace(
      /(<a href="[^"]*katalog\/index\.html" class="mobile-menu__link">Katalog<\/a>)/,
      `$1\n        <a href="${blogHref}" class="mobile-menu__link">Blog</a>`
    );
    html = html.replace(
      /(<li><a href="[^"]*katalog\/index\.html">Katalog<\/a><\/li>)/,
      `$1\n            <li><a href="${blogHref}">Blog</a></li>`
    );
  } else {
    html = html.replace(/href="(?:\.\.\/)*blog\/index\.html"/g, `href="${blogHref}"`);
  }

  if (path.relative(ROOT, filePath).replace(/\\/g, '/') === 'index.html' && !html.includes('mobile-menu__link">Blog')) {
    html = html.replace(
      /(<a href="katalog\/index\.html" class="mobile-menu__link"[^>]*>Katalog<\/a>)/,
      `$1\n        <a href="blog/index.html" class="mobile-menu__link" data-nav-link>Blog</a>`
    );
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

function walkHtml(dir, depth, fn) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'yigitornek' && entry.name !== 'emergent' && entry.name !== 'node_modules') {
      walkHtml(full, depth + 1, fn);
    } else if (entry.isFile() && entry.name === 'index.html') {
      fn(full, depth);
    }
  });
}

// --- Main ---
console.log('SEO içerik entegrasyonu başlıyor...\n');

const productSeoData = {};
let productUpdated = 0;
const productMissing = [];

PRODUCT_FILES.forEach((file) => {
  const md = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
  splitArticles(md, false).forEach((article) => {
    const parsed = parseProductArticle(article);
    if (!parsed) {
      console.warn(`  ⚠ Ürün eşleşmedi: ${article.title}`);
      return;
    }
    const { product } = parsed;
    if (productSeoData[product.slug]) return;
    productSeoData[product.slug] = parsed;

    if (updateProductPage(product, parsed)) {
      productUpdated++;
      console.log(`  ✓ Ürün: ${product.slug}`);
    }
  });
});

catalog.urunler.forEach((p) => {
  if (!productSeoData[p.slug]) {
    productMissing.push(p.slug);
  }
});

fs.writeFileSync(
  path.join(DATA_DIR, 'product-seo.json'),
  JSON.stringify(productSeoData, null, 2),
  'utf8'
);

const blogPosts = [];
BLOG_FILES.forEach((file) => {
  const md = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
  splitArticles(md, true).forEach((article) => {
    const parsed = parseBlogArticle(article);
    if (!parsed.slug) {
      console.warn(`  ⚠ Blog slug yok: ${article.title}`);
      return;
    }
    blogPosts.push(parsed);
    const dir = path.join(ROOT, 'blog', parsed.slug, 'index.html');
    fs.mkdirSync(path.dirname(dir), { recursive: true });
    fs.writeFileSync(dir, generateBlogPost(parsed), 'utf8');
    console.log(`  ✓ Blog: ${parsed.slug}`);
  });
});

fs.writeFileSync(
  path.join(DATA_DIR, 'blog-posts.json'),
  JSON.stringify(blogPosts, null, 2),
  'utf8'
);

const blogIndexPath = path.join(ROOT, 'blog', 'index.html');
fs.writeFileSync(blogIndexPath, generateBlogIndex(blogPosts), 'utf8');
console.log('  ✓ Blog liste: blog/index.html');

let navPatched = 0;
walkHtml(ROOT, 0, (filePath) => {
  if (filePath.includes('yigitornek') || filePath.includes(`${path.sep}blog${path.sep}`)) return;
  const before = fs.readFileSync(filePath, 'utf8');
  patchNavInFile(filePath);
  const after = fs.readFileSync(filePath, 'utf8');
  if (before !== after) navPatched++;
});

console.log(`\nÖzet:`);
console.log(`  Ürün güncellendi: ${productUpdated}/18`);
if (productMissing.length) {
  console.log(`  İçerik eksik ürünler: ${productMissing.join(', ')}`);
}
console.log(`  Blog yazısı: ${blogPosts.length}`);
console.log(`  Nav güncellenen sayfa: ${navPatched}`);

require('./generate-sitemap');
