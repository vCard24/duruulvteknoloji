/**
 * Hero WebP'leri kaynak dosyadan bütçeli + içerik-hash'li yeniden üretir.
 * Kaynak: sources/img/duru-hero-kaynak.webp (alfa #F3F4F5 üzerine düzleştirilir)
 * Rozet: sources/img/36-yillik-tecrube.png → 36-yillik-tecrube-<w>.<hash8>.webp
 * Çıktı: duru-hero-<w>.<hash8>.webp (1200 / unhashed alias üretilmez)
 *
 * Kullanım: node scripts/optimize-hero-images.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const {
  loadManifest,
  writeHashedVariant,
  syncAllImageRefs,
} = require('./image-variants');

const ROOT = path.join(__dirname, '..');
const HERO_DIR = path.join(ROOT, 'assets', 'img', 'hero');
const SRC = path.join(ROOT, 'sources', 'img', 'duru-hero-kaynak.webp');
const BADGE_SRC = path.join(ROOT, 'sources', 'img', '36-yillik-tecrube.png');
const FLATTEN_BG = '#F3F4F5';

const TARGETS = [
  { w: 480, maxKb: 45 },
  { w: 720, maxKb: 70 },
  { w: 960, maxKb: 100 },
];

const BADGE_SIZES = [120, 200];

function flattenSource() {
  return sharp(SRC).rotate().flatten({ background: FLATTEN_BG }).removeAlpha();
}

async function encodeBudgeted(pipelineFactory, width, maxKb) {
  const qualities = [82, 77, 72, 67, 65];
  let best = null;

  for (const quality of qualities) {
    const { data, info } = await pipelineFactory()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toBuffer({ resolveWithObject: true });

    const kb = +(info.size / 1024).toFixed(1);
    best = { data, kb, quality, width: info.width, height: info.height };
    if (kb <= maxKb) break;
  }

  const over = best.kb > maxKb;
  return { ...best, over, maxKb };
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error('Kaynak bulunamadı:', SRC);
    process.exit(1);
  }

  const manifest = loadManifest();
  const srcMeta = await sharp(SRC).metadata();
  console.log(
    `Kaynak: sources/img/duru-hero-kaynak.webp ${srcMeta.width}x${srcMeta.height} ${(fs.statSync(SRC).size / 1024).toFixed(1)} KiB (${srcMeta.format}, alpha=${!!srcMeta.hasAlpha})`
  );
  console.log(`Düzleştirme: ${FLATTEN_BG} → opak WebP`);

  for (const legacy of [
    'duru-hero-1200.webp',
    'duru-hero.png',
    'duru-hero.webp',
    '36-yillik-tecrube.webp',
    '36-yillik-tecrube.png',
  ]) {
    const p = path.join(HERO_DIR, legacy);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log(`  silindi: ${legacy}`);
    }
  }

  console.log('Hero ana görsel…');
  const results = [];
  const allRemoved = [];
  for (const t of TARGETS) {
    const encoded = await encodeBudgeted(() => flattenSource(), t.w, t.maxKb);
    const logical = `duru-hero-${t.w}`;
    const written = writeHashedVariant(HERO_DIR, logical, encoded.data, manifest);
    allRemoved.push(...written.removed);
    console.log(
      `  ✓ ${written.fileName} ${encoded.width}x${encoded.height} — ${encoded.kb} KiB q=${encoded.quality}` +
        (encoded.over ? ` BÜTÇE AŞILDI (limit ${t.maxKb})` : ` (limit ${t.maxKb})`)
    );
    results.push({ ...encoded, fileName: written.fileName });
  }

  if (fs.existsSync(BADGE_SRC)) {
    console.log('Tecrübe rozeti…');
    for (const w of BADGE_SIZES) {
      const { data, info } = await sharp(BADGE_SRC)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toBuffer({ resolveWithObject: true });
      const logical = `36-yillik-tecrube-${w}`;
      const written = writeHashedVariant(HERO_DIR, logical, data, manifest);
      allRemoved.push(...written.removed);
      console.log(`  ✓ ${written.fileName} (${w}w) — ${(info.size / 1024).toFixed(1)} KiB`);
    }
  } else {
    console.warn('Rozet kaynağı yok:', BADGE_SRC);
  }

  console.log(`\nSilinen eski varyantlar: ${allRemoved.length}`);
  if (allRemoved.length) allRemoved.forEach((f) => console.log(`  - ${f}`));
  else console.log('  (yok)');

  const failed = results.filter((r) => r.over);
  if (failed.length) {
    console.log('\nBÜTÇE AŞILDI:');
    failed.forEach((r) =>
      console.log(`  ${r.fileName} → ${r.kb} KB (limit ${r.maxKb}, q=${r.quality})`)
    );
    process.exitCode = 2;
  } else {
    console.log('\nTüm hero varyantları bütçe içinde.');
  }

  syncAllImageRefs(manifest);

  console.log('\nDoğrulama…');
  const { spawnSync } = require('child_process');
  const v = spawnSync('node', ['scripts/validate-image-variants.js'], {
    cwd: ROOT,
    shell: true,
    stdio: 'inherit',
  });
  if (v.status !== 0) process.exitCode = v.status || 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
