import store from '../data/store.json';

export { store };

export const addressLine = `${store.address.street}, ${store.address.city}, ${store.address.region} ${store.address.postalCode}`;

export const telHref = `tel:${store.phoneE164}`;

export const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.mapQuery)}`;

export const mapEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(store.mapQuery)}&output=embed`;

export function whatsappHref(message = "Hi Kiddy Zone, I found you on your website.") {
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function storeSchema() {
  const a = store.address;
  return {
    '@context': 'https://schema.org',
    '@type': ['ClothingStore', 'ToyStore'],
    '@id': `${store.url}/#store`,
    name: store.legalName,
    alternateName: store.name,
    description: store.description,
    url: `${store.url}/`,
    image: `${store.url}/og.png`,
    logo: `${store.url}/icon-512.png`,
    telephone: store.phoneE164,
    email: store.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    areaServed: store.areas.map((name) => ({ '@type': 'City', name })),
    sameAs: [store.instagram],
    // Added only once the owner has confirmed exact hours.
    ...(store.hours ? { openingHours: store.hours } : {}),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${store.url}${t.path}`,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/** Reads the agent's "## Common questions" block (**Q** then an answer paragraph). */
export function faqsFromMarkdown(body: string) {
  const block = body.split(/^## Common questions\s*$/m)[1];
  if (!block) return [];
  const section = block.split(/^## /m)[0];
  return [...section.matchAll(/\*\*(.+?)\*\*\s*\n\s*\n(.+)/g)].map((m) => ({
    question: m[1].trim(),
    answer: m[2].trim(),
  }));
}
