# Blog post contract

A post is one file at `src/content/blog/YYYY-MM-DD-short-slug.md`. The filename becomes the URL, so never rename a published post.

| Field | Required | Rule |
|---|---|---|
| `title` | yes | 10–120 characters |
| `description` | yes | 50–200 characters, the search snippet |
| `pubDate` | yes | `YYYY-MM-DD` |
| `tags` | yes | 1–6 items |
| `updatedDate` | no | Set when revising; drives `lastmod` in the sitemap |
| `draft` | no | `true` keeps it off the site and out of the sitemap |

Body: plain markdown starting at `##`, no raw HTML. A `## Common questions` section with `**Question**` followed by an answer paragraph becomes FAQ schema automatically.

`src/content.config.ts` enforces the fields at build time. The content rules are enforced by the agent's `agent/check_post.py`.
