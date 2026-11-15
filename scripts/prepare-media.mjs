#!/usr/bin/env node
// Turns the shop's original photos, logo and reels (kept outside the repo in
// ../kiddyzone-media) into web-sized files under public/. Run with
// `node scripts/prepare-media.mjs` after adding or replacing originals.
import { mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const src = (f) => fileURLToPath(new URL(`../../kiddyzone-media/${f}`, import.meta.url));
const pub = (f) => fileURLToPath(new URL(`../public/${f}`, import.meta.url));
await mkdir(pub('images'), { recursive: true });
await mkdir(pub('media'), { recursive: true });

// name -> [source, crop {left, top, width, height} | null, output widths]
const photos = {
  'shop-front-day': ['photos/8.jpg', { left: 0, top: 120, width: 1340, height: 840 }, [1340, 800]],
  'shop-night': ['photos/4.jpg', { left: 0, top: 430, width: 1600, height: 570 }, [1600, 800]],
  'shop-window-day': ['photos/3.jpg', { left: 0, top: 250, width: 1200, height: 1350 }, [900, 480]],
  'shop-window-night': ['photos/6.jpg', { left: 0, top: 450, width: 916, height: 1030 }, [900, 480]],
  'shop-evening': ['photos/5.jpg', { left: 0, top: 480, width: 1086, height: 1120 }, [900, 480]],
  'look-lemon': ['photos/9.jpg', null, [720, 400]],
  'look-white-lace': ['photos/10.jpg', null, [720, 400]],
  'look-pink': ['photos/11.jpg', null, [720, 400]],
  'look-white-eyelet': ['photos/12.jpg', null, [720, 400]],
  'look-olive': ['photos/13.jpg', null, [720, 400]],
  'look-plaid': ['photos/14.jpg', null, [720, 400]],
};

for (const [name, [file, crop, widths]] of Object.entries(photos)) {
  for (const w of widths) {
    let img = sharp(src(file)).rotate();
    if (crop) img = img.extract(crop);
    await img.resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(pub(`images/${name}-${w}.webp`));
  }
}

// Logo: make the white page around the artwork transparent (flood fill from the
// edges, so the white letters inside the coloured tiles stay white).
{
  const { data, info } = await sharp(src('logo-000.jpg')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const white = (i) => data[i] > 236 && data[i + 1] > 236 && data[i + 2] > 236;
  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const p = stack.pop();
    if (seen[p] || !white(p * 4)) continue;
    seen[p] = 1;
    data[p * 4 + 3] = 0;
    const x = p % w;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (p >= w) stack.push(p - w);
    if (p < w * (h - 1)) stack.push(p + w);
  }
  const logo = sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim();
  await logo.clone().webp({ quality: 92, alphaQuality: 100 }).toFile(pub('images/logo.webp'));
  await logo.clone().png().toFile(pub('images/logo.png'));
}

// Reels: strip metadata, make them start fast, and grab a poster frame.
for (let i = 1; i <= 5; i++) {
  const input = src(`videos/reel-${i}.mp4`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', input, '-an', '-map_metadata', '-1', '-c:v', 'libx264', '-crf', '25', '-preset', 'slow',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', pub(`media/reel-${i}.mp4`)]);
  const frame = execFileSync('ffmpeg', ['-v', 'error', '-ss', '1', '-i', input, '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-']);
  await sharp(frame).webp({ quality: 78 }).toFile(pub(`media/reel-${i}.webp`));
}

// Share image: the shopfront with the logo on a white chip.
{
  const logo = await sharp(pub('images/logo.png')).resize({ width: 420 }).toBuffer();
  const meta = await sharp(logo).metadata();
  const chip = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width + 64}" height="${meta.height + 48}"><rect width="100%" height="100%" rx="26" fill="#fff"/></svg>`);
  await sharp(src('photos/8.jpg')).extract({ left: 0, top: 230, width: 1340, height: 704 }).resize(1200, 630)
    .composite([{ input: chip, left: 44, top: 630 - meta.height - 48 - 40 }, { input: logo, left: 76, top: 630 - meta.height - 24 - 40 }])
    .png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(pub('og.png'));
}

// Favicon and app icons: a pink tile with a white k, like the first tile of the logo.
{
  const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect x="6" y="6" width="108" height="108" rx="22" fill="#ec3f97" transform="rotate(-3 60 60)"/><path d="M44 30v60M44 66l30-26M56 58l22 32" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const { writeFile } = await import('node:fs/promises');
  await writeFile(pub('favicon.svg'), mark);
  await sharp(Buffer.from(mark)).resize(192, 192).png().toFile(pub('icon-192.png'));
  await sharp(Buffer.from(mark)).resize(512, 512).png().toFile(pub('icon-512.png'));
}
console.log('media written');
