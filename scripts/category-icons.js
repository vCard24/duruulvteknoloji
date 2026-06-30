/**
 * Kategori ikonları — emergent referansı (Truck, Flower2, Backpack, Wrench)
 */
const ICONS = {
  'arac-uzeri-ilaclama': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11"/><path d="M15 18H3"/><path d="M15 18v-2"/><path d="M19 18v-4"/><path d="M19 18h2"/><path d="M19 14V8l-3-3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  'sera-tipi-ulv-ilaclama': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1"/><path d="M9 8a3 3 0 1 0-3 3"/><path d="M15 8a3 3 0 1 1 3 3"/><path d="M12 13v8"/></svg>',
  'sirt-tipi-ulv-ilaclama': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M8 10h8"/><path d="M8 18h8"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>',
  'el-tipi-ulv-ilaclama': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
};

function categoryIconWrap(slug) {
  return `<div class="category-card__icon">${ICONS[slug] || ''}</div>`;
}

function renderCategoryCard(cat, opts) {
  const linkPrefix = opts.linkPrefix || '';
  const headingTag = opts.headingTag || 'h2';
  const count = opts.count;
  const countHtml =
    count !== undefined
      ? `<div class="category-card__footer">
              <span style="color:rgba(43,46,51,0.55);font-weight:500">${count} model</span>
              <span style="color:var(--color-primary);font-weight:600">Keşfet →</span>
            </div>`
      : `<div class="category-card__footer">
              <span style="color:var(--color-primary);font-weight:600">İncele →</span>
            </div>`;

  return `          <a href="${linkPrefix}${cat.slug}/index.html" class="category-card">
            ${categoryIconWrap(cat.slug)}
            <${headingTag} class="category-card__title">${opts.esc(cat.kisa_ad)}</${headingTag}>
            <p class="category-card__desc">${opts.esc(cat.aciklama_tr)}</p>
            ${countHtml}
          </a>`;
}

module.exports = { ICONS, categoryIconWrap, renderCategoryCard };
