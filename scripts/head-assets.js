/**
 * Ortak <head> kaynakları — preconnect, tek CSS, engellemeyen Google Fonts.
 */
const FONTS_CSS =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap';

function renderHeadAssets(prefix, options = {}) {
  const p = prefix || '';
  const lines = [
    `  <link rel="preconnect" href="https://fonts.googleapis.com">`,
    `  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
    `  <link rel="stylesheet" href="${p}assets/css/site.css">`,
    `  <link rel="preload" as="style" href="${FONTS_CSS}" onload="this.onload=null;this.rel='stylesheet'">`,
    `  <noscript><link rel="stylesheet" href="${FONTS_CSS}"></noscript>`,
  ];

  (options.extraStylesheets || []).forEach((href) => {
    lines.push(`  <link rel="stylesheet" href="${p}${href}">`);
  });

  if (options.extraHead) {
    lines.push(options.extraHead);
  }

  return lines.join('\n');
}

function renderBodyScripts(prefix, options = {}) {
  const p = prefix || '';
  const deferAttr = options.defer === false ? '' : ' defer';
  const parts = [];
  if (options.includeCompare !== false) {
    parts.push(`  <script src="${p}assets/js/compare.js"${deferAttr}></script>`);
  }
  parts.push(`  <script src="${p}assets/js/main.js"${deferAttr}></script>`);
  if (options.extraScripts) {
    parts.push(options.extraScripts);
  }
  return parts.join('\n');
}

module.exports = { renderHeadAssets, renderBodyScripts, FONTS_CSS };
