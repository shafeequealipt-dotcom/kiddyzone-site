import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { store, addressLine } from '../lib/store';
import catalog from '../data/catalog.json';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', (p) => !p.data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  const list = (cats: { name: string; blurb: string }[]) => cats.map((c) => `- ${c.name}`).join('\n');
  const body = `# ${store.legalName}

> ${store.description}

- Address: ${addressLine}
- Phone and WhatsApp: ${store.phone}
- Email: ${store.email}
- Instagram: ${store.instagram}
- Buying: in the shop. The website is a showcase with no online checkout. Ask the shop for current stock, sizes and prices.

## Kids' wear

${list(catalog.wear)}

## Toys and gifts

${list(catalog.toys)}

## Pages

- [Kids' wear](${store.url}/kids-wear)
- [Toys and gifts](${store.url}/toys)
- [About](${store.url}/about)
- [Visit](${store.url}/visit)
- [Notes for parents](${store.url}/blog)

## Notes for parents

${posts.map((p) => `- [${p.data.title}](${store.url}/blog/${p.id}): ${p.data.description}`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
