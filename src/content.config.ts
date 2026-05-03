import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdoc}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.string(),
    excerpt: z.string().optional().default(''),
    readTime: z.string().optional().default(''),
    tags: z.array(z.string()).optional().default([]),
    category: z.string(),
    author: z.string(),
    authorBio: z.string(),
  }),
});

export const collections = {
  'blog': blogCollection,
};
