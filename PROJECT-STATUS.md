# Kiddy Zone website: where things stand

**Last updated:** 1 November 2026

The website and blog agent are built and tested on this computer. **Nothing is live yet:** there's no domain, server, GitHub repo or daily schedule.

## What's built

- **Website:** home, kids' wear, toys, about, visit, notes for parents, privacy and a not-found page. Works on phones, with Call / WhatsApp / Directions always on screen. Customers contact the shop; there's no cart or payment.
- **SEO:** page titles and descriptions, canonical URLs, share image, store and FAQ schema, `sitemap.xml`, `robots.txt`, `llms.txt`.
- **Blog agent:** writes a post a day from a queue of 30 topics, checks it, and publishes it. See `../kiddyzone-agent/README.md`.

## Please confirm with the shop owner

| Question | Why it matters |
|---|---|
| Opening hours, and whether it opens on Sundays | Hours are left off for now. Add them to `hours` in `src/data/store.json` |
| Is 99477 30300 on WhatsApp? | All the WhatsApp buttons use it |
| Is there a second branch in Edavanna? | A Facebook page mentions it. It isn't on the site |
| Are these categories right: frocks, party wear, baby sets, soft toys? | Instagram confirms clothing, western wear, accessories, imported and educational toys and gifts. These four are my reasonable guesses |
| Is the About page wording acceptable? | It describes how the shop works, and only the owner can confirm that |
| Are the review quotes OK to show? | Three short lines from Google reviews are on the home page |
| Can you send the logo file and real photos? | The site uses a text logo and illustrations until then |

## Adding real products

Edit `src/data/catalog.json`. The instructions are at the top of that file. Photos go in `public/images/`.
