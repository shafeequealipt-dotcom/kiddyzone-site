// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';

// The production domain lives in one place: src/data/store.json. Canonicals,
// Open Graph URLs, robots.txt, llms.txt and sitemap.xml all derive from it.
const store = JSON.parse(readFileSync(new URL('./src/data/store.json', import.meta.url), 'utf8'));

export default defineConfig({
  site: store.url,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
