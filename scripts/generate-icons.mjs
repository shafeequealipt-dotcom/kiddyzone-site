#!/usr/bin/env node
// Renders the favicon, app icons and share image into public/. Run with
// `npm run icons` after a brand change; the output files are committed.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const pub = (f) => fileURLToPath(new URL(`../public/${f}`, import.meta.url));

const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="#2a1a3e"/><rect x="24" y="66" width="32" height="32" rx="5" fill="#0fa3a3"/><rect x="64" y="66" width="32" height="32" rx="5" fill="#f0483e"/><rect x="44" y="24" width="32" height="32" rx="5" fill="#ffc22e"/></svg>`;

const scallops = Array.from({ length: 25 }, (_, i) => {
  const x = i * 48 + 24;
  return `<rect x="${x - 24}" y="0" width="48" height="26" fill="${i % 2 ? '#fff' : '#f0483e'}"/><circle cx="${x}" cy="26" r="24" fill="${i % 2 ? '#fff' : '#f0483e'}"/>`;
}).join('');

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#fff6e4"/>${scallops}
<text x="80" y="290" font-family="Arial Rounded MT Bold, Arial, sans-serif" font-size="128" font-weight="800" fill="#2a1a3e">Kiddy Zone</text>
<text x="84" y="370" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="#0a6d6d">The Complete Kids Shoppe</text>
<text x="84" y="470" font-family="Arial, sans-serif" font-size="38" fill="#5b4b70">Kids' wear, toys and gifts in Wandoor, Kerala</text>
<g transform="translate(930 330)"><rect width="84" height="84" rx="10" fill="#0fa3a3"/><rect x="100" y="0" width="84" height="84" rx="10" fill="#f0483e"/><rect x="50" y="-100" width="84" height="84" rx="10" fill="#ffc22e"/></g>
</svg>`;

await writeFile(pub('favicon.svg'), mark);
await sharp(Buffer.from(mark)).resize(192, 192).png().toFile(pub('icon-192.png'));
await sharp(Buffer.from(mark)).resize(512, 512).png().toFile(pub('icon-512.png'));
await sharp(Buffer.from(og)).png().toFile(pub('og.png'));
console.log('icons written');
