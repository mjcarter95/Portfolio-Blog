import { z, defineCollection } from 'astro:content';

const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Accept "2024-04-08" (string) and turn it into a Date
    date: z.coerce.date(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    type: z.string(),                    // e.g. "Journal Paper"
    title: z.string(),
    authors: z.array(z.string()).default([]),
    venue: z.string().optional(),
    // Same rule: always one `date`, parsed from "YYYY-MM-DD"
    date: z.coerce.date(),
    doi: z.string().optional(),
    url: z.string().optional(),
    pdf: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { writing, publications };
