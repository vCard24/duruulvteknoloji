/** İnce çizgili blog SVG ikonları (Emergent önizleme stili) */
const BASE = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

const PATHS = {
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',
  wind: '<path d="M17.7 7.7a2.5 2.5 0 1 1-4.5-1.5M9.6 4.6A2 2 0 1 1 8 8h8a2 2 0 1 1-1.2 3.8"/><path d="M5 15.5A2.5 2.5 0 1 0 7.5 18H12"/>',
  droplets: '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
  arrowUp: '<path d="m12 19-7-7h4V5h6v7h4l-7 7z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  sparkles: '<path d="M9.94 9.94 8 4l-1.94 5.94L0 12l6.06 2.06L8 20l1.94-5.94L16 12l-6.06-2.06z"/><path d="M20 3l-1 3-3 1 3 1 1 3 1-3 3-1-3-1-1-3z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkSquare: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 12 2 2 4-4"/>',
  engine: '<path d="M14 4h2a2 2 0 0 1 2 2v2M14 18h2a2 2 0 0 0 2-2v-2M10 4H8a2 2 0 0 0-2 2v2M10 18H8a2 2 0 0 1-2-2v-2"/><rect x="8" y="8" width="8" height="8" rx="1"/>',
  gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  battery: '<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2M6 11v2M10 11v2M14 11v2"/>',
  flask: '<path d="M10 2v6.76a6 6 0 1 0 4 0V2"/><path d="M8 2h8"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  mosquito: '<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="3"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
};

function blogIcon(name, className) {
  const path = PATHS[name];
  if (!path) return '';
  const cls = className ? ` class="${className}"` : '';
  return `<svg ${BASE}${cls}>${path}</svg>`;
}

module.exports = { blogIcon };
