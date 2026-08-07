/**
 * Ortak <head> kaynakları — preconnect, hash'li CSS, engellemeyen Google Fonts.
 */
const { assetHref, loadManifest } = require('./static-asset-hashes');

const FONTS_CSS =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap';

function renderHeadAssets(prefix, options = {}) {
  const p = prefix || '';
  const manifest = options.manifest || loadManifest();
  const siteCss = assetHref('assets/css/site.css', manifest);
  const lines = [
    `  <link rel="preconnect" href="https://fonts.googleapis.com">`,
    `  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
    `  <link rel="stylesheet" href="${p}${siteCss}">`,
    `  <link rel="preload" as="style" href="${FONTS_CSS}" onload="this.onload=null;this.rel='stylesheet'">`,
    `  <noscript><link rel="stylesheet" href="${FONTS_CSS}"></noscript>`,
  ];

  (options.extraStylesheets || []).forEach((href) => {
    const resolved = assetHref(href, manifest);
    lines.push(`  <link rel="stylesheet" href="${p}${resolved}">`);
  });

  if (options.extraHead) {
    lines.push(options.extraHead);
  }

  return lines.join('\n');
}

function renderBodyScripts(prefix, options = {}) {
  const p = prefix || '';
  const manifest = options.manifest || loadManifest();
  const deferAttr = options.defer === false ? '' : ' defer';
  const parts = [];
  if (options.includeCompare !== false) {
    parts.push(
      `  <script src="${p}${assetHref('assets/js/compare.js', manifest)}"${deferAttr}></script>`
    );
  }
  parts.push(
    `  <script src="${p}${assetHref('assets/js/main.js', manifest)}"${deferAttr}></script>`
  );
  if (options.extraScripts) {
    parts.push(options.extraScripts);
  }
  return parts.join('\n');
}

/** extraHead / extraScripts içinde mantıksal yolları hash'liye çevir */
function withHashedAssetPaths(htmlFragment, manifest) {
  const m = manifest || loadManifest();
  return String(htmlFragment || '').replace(
    /(assets\/(?:css|js)\/[a-z0-9_-]+)(?:\.[a-f0-9]{8})?(\.(?:css|js))/gi,
    (full, stem, ext) => {
      const logical = `${stem}${ext}`.replace(/\\/g, '/');
      // stem may already exclude hash; rebuild logical
      const base = stem.split('/').pop();
      const dir = stem.slice(0, stem.length - base.length);
      const logicalKey = `${dir}${base}${ext}`;
      return assetHref(logicalKey, m);
    }
  );
}

module.exports = {
  renderHeadAssets,
  renderBodyScripts,
  withHashedAssetPaths,
  FONTS_CSS,
};
