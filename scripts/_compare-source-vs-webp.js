/**
 * Compare png/jpg sources under assets/img with matching -01.webp (or same-stem .webp).
 * Lists cases where the non-webp original has larger pixel dimensions.
 *
 * node scripts/_compare-source-vs-webp.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'assets', 'img');

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

async function meta(file) {
  const m = await sharp(file).metadata();
  const st = fs.statSync(file);
  return {
    w: m.width || 0,
    h: m.height || 0,
    px: (m.width || 0) * (m.height || 0),
    fmt: m.format,
    kb: +(st.size / 1024).toFixed(1),
  };
}

function rel(p) {
  return path.relative(path.join(__dirname, '..'), p).replace(/\\/g, '/');
}

function isWidthOrThumbVariant(name) {
  return /-\d{2}-(?:\d+|thumb)\.webp$/i.test(name);
}

async function main() {
  const all = walk(ROOT);
  const pngJpg = all.filter((f) => /\.(png|jpe?g)$/i.test(f));
  const larger = [];

  // --- products: pair slug-NN.png/jpg with slug-NN.webp ---
  const prodDir = path.join(ROOT, 'products');
  const prodFiles = fs.existsSync(prodDir) ? fs.readdirSync(prodDir) : [];

  for (const name of prodFiles) {
    if (!/\.(png|jpe?g)$/i.test(name)) continue;
    const m = name.match(/^([a-z0-9-]+)-(\d{2})\.(png|jpe?g)$/i);
    if (!m) {
      // stem.png vs stem-01.webp
      const stem = name.replace(/\.(png|jpe?g)$/i, '');
      const candidates = [`${stem}-01.webp`, `${stem}.webp`].filter((c) =>
        fs.existsSync(path.join(prodDir, c))
      );
      for (const c of candidates) {
        const srcM = await meta(path.join(prodDir, name));
        const webpM = await meta(path.join(prodDir, c));
        if (srcM.w > webpM.w || srcM.h > webpM.h || srcM.px > webpM.px) {
          larger.push({
            area: 'products',
            slug: stem,
            src: rel(path.join(prodDir, name)),
            srcDim: `${srcM.w}x${srcM.h}`,
            srcKb: srcM.kb,
            webp: c,
            webpDim: `${webpM.w}x${webpM.h}`,
            webpKb: webpM.kb,
            dW: srcM.w - webpM.w,
            dH: srcM.h - webpM.h,
          });
        }
      }
      continue;
    }
    const [, slug, nn] = m;
    const webpName = `${slug}-${nn}.webp`;
    const webpPath = path.join(prodDir, webpName);
    if (!fs.existsSync(webpPath)) continue;
    const srcM = await meta(path.join(prodDir, name));
    const webpM = await meta(webpPath);
    if (srcM.w > webpM.w || srcM.h > webpM.h || srcM.px > webpM.px) {
      larger.push({
        area: 'products',
        slug,
        src: rel(path.join(prodDir, name)),
        srcDim: `${srcM.w}x${srcM.h}`,
        srcKb: srcM.kb,
        webp: webpName,
        webpDim: `${webpM.w}x${webpM.h}`,
        webpKb: webpM.kb,
        dW: srcM.w - webpM.w,
        dH: srcM.h - webpM.h,
      });
    }
  }

  // Per-slug: also compare ANY larger png/jpg in products that maps to slug-01.webp
  // (already covered by NN pairing)

  // --- other areas under assets/img ---
  for (const file of pngJpg) {
    if (file.includes(`${path.sep}products${path.sep}`)) continue;
    const dir = path.dirname(file);
    const name = path.basename(file);
    const stem = name.replace(/\.(png|jpe?g)$/i, '');
    const area = path.relative(ROOT, dir).replace(/\\/g, '/') || '.';

    const candidates = [];
    const sameStem = path.join(dir, `${stem}.webp`);
    if (fs.existsSync(sameStem)) candidates.push(`${stem}.webp`);

    // Prefer -01.webp if present
    const dash01 = path.join(dir, `${stem}-01.webp`);
    if (fs.existsSync(dash01)) candidates.push(`${stem}-01.webp`);

    // Hero / cover width variants: pick largest existing *-N.webp for same stem
    const siblings = fs.readdirSync(dir).filter((f) => {
      if (isWidthOrThumbVariant(f) && f.startsWith(`${stem}-`)) return true;
      const mm = f.match(new RegExp(`^${stem.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}-(\\d+)\\.webp$`, 'i'));
      return !!mm;
    });
    const widthVars = siblings
      .map((f) => {
        const mm = f.match(/-(\d+)\.webp$/i);
        return mm ? { f, w: +mm[1] } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.w - a.w);
    if (widthVars[0] && !candidates.includes(widthVars[0].f)) {
      candidates.push(widthVars[0].f);
    }

    if (!candidates.length) continue;

    const srcM = await meta(file);
    // Compare against the best (usually same-stem or largest) — report if src bigger than ANY listed counterpart intended as delivery webp
    // User asked vs mevcut -01.webp; for non-product use same-stem / largest delivery webp
    const preferred =
      candidates.find((c) => c.endsWith('-01.webp')) ||
      candidates.find((c) => c === `${stem}.webp`) ||
      candidates[0];

    const webpM = await meta(path.join(dir, preferred));
    if (srcM.w > webpM.w || srcM.h > webpM.h || srcM.px > webpM.px) {
      larger.push({
        area,
        slug: stem,
        src: rel(file),
        srcDim: `${srcM.w}x${srcM.h}`,
        srcKb: srcM.kb,
        webp: preferred,
        webpDim: `${webpM.w}x${webpM.h}`,
        webpKb: webpM.kb,
        dW: srcM.w - webpM.w,
        dH: srcM.h - webpM.h,
      });
    }
  }

  // Dedupe
  const seen = new Set();
  const uniq = larger
    .filter((r) => {
      const k = `${r.src}|${r.webp}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => b.dW - a.dW || b.dH - a.dH || a.slug.localeCompare(b.slug));

  console.log('png/jpg under assets/img:', pngJpg.length);
  pngJpg.forEach((f) => console.log('  SRC', rel(f)));
  console.log('');
  console.log('larger-than-webp originals:', uniq.length);
  if (!uniq.length) {
    console.log('NONE');
  } else {
    console.log(
      ['area', 'slug', 'src', 'src_px', 'src_kb', 'webp', 'webp_px', 'webp_kb', 'Δw', 'Δh'].join('\t')
    );
    for (const r of uniq) {
      console.log(
        [r.area, r.slug, r.src, r.srcDim, r.srcKb, r.webp, r.webpDim, r.webpKb, r.dW, r.dH].join('\t')
      );
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
