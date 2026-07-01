/**
 * Hero görsellerini WebP + responsive boyutlara dönüştürür.
 * Kullanım: node scripts/optimize-hero-images.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const HERO_DIR = path.join(__dirname, '..', 'assets', 'img', 'hero');

const HERO_SIZES = [480, 720, 960, 1200];
const BADGE_SIZES = [120, 200];

async function writeWebp(inputPath, outputPath, width) {
  await sharp(inputPath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(outputPath);
  const stat = fs.statSync(outputPath);
  console.log(`  ✓ ${path.basename(outputPath)} (${width}w) — ${(stat.size / 1024).toFixed(1)} KiB`);
}

async function main() {
  const heroPng = path.join(HERO_DIR, 'duru-hero.png');
  const badgePng = path.join(HERO_DIR, '36-yillik-tecrube.png');

  if (!fs.existsSync(heroPng)) {
    console.error('duru-hero.png bulunamadı:', heroPng);
    process.exit(1);
  }

  console.log('Hero ana görsel…');
  for (const w of HERO_SIZES) {
    await writeWebp(heroPng, path.join(HERO_DIR, `duru-hero-${w}.webp`), w);
  }
  await writeWebp(heroPng, path.join(HERO_DIR, 'duru-hero.webp'), 1200);

  if (fs.existsSync(badgePng)) {
    console.log('Tecrübe rozeti…');
    for (const w of BADGE_SIZES) {
      await writeWebp(badgePng, path.join(HERO_DIR, `36-yillik-tecrube-${w}.webp`), w);
    }
    await writeWebp(badgePng, path.join(HERO_DIR, '36-yillik-tecrube.webp'), 200);
  }

  console.log('\nTamamlandı.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
