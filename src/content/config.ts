import { z, defineCollection } from 'astro:content';

const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string().optional(),
    year: z.number(),
    doi: z.string().optional(),
    url: z.string().optional(),
    pdf: z.string().optional()
  })
});

export const collections = { writing, publications };
