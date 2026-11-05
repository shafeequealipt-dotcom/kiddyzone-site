import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Blog collection.
 *
 * The blog agent writes markdown files into src/content/blog/ and commits them.
 * This schema is the contract: a post with bad frontmatter fails the build, so
 * it never reaches the live site. See BLOG-AGENT-SPEC.md.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(10).max(120),
    description: z.string().min(50).max(200),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Kiddy Zone'),
    tags: z.array(z.string()).min(1).max(6),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
