/**
 * Hero WebP'leri kaynak dosyadan bütçeli yeniden üretir.
 * Kaynak: sources/img/duru-hero-kaynak.webp (alfa #F3F4F5 üzerine düzleştirilir)
 * Çıktı: 480 / 720 / 960 (1200 üretilmez — kaynak 1000px)
 *
 * Kullanım: node scripts/optimize-hero-images.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const HERO_DIR = path.join(ROOT, 'assets', 'img', 'hero');
const SRC = path.join(ROOT, 'sources', 'img', 'duru-hero-kaynak.webp');
const FLATTEN_BG = '#F3F4F5';

const TARGETS = [
  { w: 480, maxKb: 45 },
  { w: 720, maxKb: 70 },
  { w: 960, maxKb: 100 },
];

const BADGE_SIZES = [120, 200];

function flattenSource() {
  // Alfa → opak zemin; sonrası lossy webp daha verimli
  return sharp(SRC)
    .rotate()
    .flatten({ background: FLATTEN_BG })
    .removeAlpha();
}

async function encodeBudgeted(pipelineFactory, outputPath, width, maxKb) {
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

  fs.writeFileSync(outputPath, best.data);
  const over = best.kb > maxKb;
  console.log(
    `  ✓ ${path.basename(outputPath)} ${best.width}x${best.height} — ${best.kb} KiB q=${best.quality}` +
      (over ? ` BÜTÇE AŞILDI (limit ${maxKb})` : ` (limit ${maxKb})`)
  );
  return { ...best, over, maxKb, file: path.basename(outputPath) };
}

async function writeBadge(inputPath, outputPath, width) {
  await sharp(inputPath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(outputPath);
  const stat = fs.statSync(outputPath);
  console.log(`  ✓ ${path.basename(outputPath)} (${width}w) — ${(stat.size / 1024).toFixed(1)} KiB`);
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error('Kaynak bulunamadı:', SRC);
    process.exit(1);
  }

  const srcMeta = await sharp(SRC).metadata();
  console.log(
    `Kaynak: sources/img/duru-hero-kaynak.webp ${srcMeta.width}x${srcMeta.height} ${(fs.statSync(SRC).size / 1024).toFixed(1)} KiB (${srcMeta.format}, alpha=${!!srcMeta.hasAlpha})`
  );
  console.log(`Düzleştirme: ${FLATTEN_BG} → opak WebP`);

  // Eski 1200w (upscale) kaldır
  const legacy1200 = path.join(HERO_DIR, 'duru-hero-1200.webp');
  if (fs.existsSync(legacy1200)) {
    fs.unlinkSync(legacy1200);
    console.log('  silindi: duru-hero-1200.webp');
  }
  const legacyPng = path.join(HERO_DIR, 'duru-hero.png');
  if (fs.existsSync(legacyPng)) {
    fs.unlinkSync(legacyPng);
    console.log('  silindi: assets/img/hero/duru-hero.png (deploy dışı bırakılmalı)');
  }

  console.log('Hero ana görsel…');
  const results = [];
  for (const t of TARGETS) {
    const out = path.join(HERO_DIR, `duru-hero-${t.w}.webp`);
    results.push(
      await encodeBudgeted(() => flattenSource(), out, t.w, t.maxKb)
    );
  }

  // Canonical fallback = 960w
  const largest = results[results.length - 1];
  fs.writeFileSync(path.join(HERO_DIR, 'duru-hero.webp'), largest.data);
  console.log('  ✓ duru-hero.webp (960w ile senkron)');

  const badgePng = path.join(HERO_DIR, '36-yillik-tecrube.png');
  if (fs.existsSync(badgePng)) {
    console.log('Tecrübe rozeti…');
    for (const w of BADGE_SIZES) {
      await writeBadge(badgePng, path.join(HERO_DIR, `36-yillik-tecrube-${w}.webp`), w);
    }
    await writeBadge(badgePng, path.join(HERO_DIR, '36-yillik-tecrube.webp'), 200);
  }

  const failed = results.filter((r) => r.over);
  if (failed.length) {
    console.log('\nBÜTÇE AŞILDI:');
    failed.forEach((r) => console.log(`  ${r.file} → ${r.kb} KB (limit ${r.maxKb}, q=${r.quality})`));
    process.exitCode = 2;
  } else {
    console.log('\nTüm hero varyantları bütçe içinde.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
