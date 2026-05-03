import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    excerpt: z.string(),
    readTime: z.string(),
    tags: z.array(z.string()),
    category: z.string(),
    author: z.string(),
    authorBio: z.string(),
  }),
});

export const collections = {
  'blog': blogCollection,
};
