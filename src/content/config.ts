import { defineCollection, z } from "astro:content";

const writing = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const publications = defineCollection({
  type: "content",
  schema: z.object({
    type: z.string(),
    title: z.string(),
    authors: z.array(z.string()).default([]),
    venue: z.string().optional(),
    date: z.coerce.date(),
    doi: z.string().optional(),
    url: z.string().optional(),
    pdf: z.string().optional(),
    description: z.string().optional(),
  }),
});

const caseStudies = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    repoUrl: z.string().url().optional(),
    projectUrl: z.string().url().optional(),
    readingTime: z.string().optional(), // e.g., "6 min"
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  writing,
  publications,
  "case-studies": caseStudies, // <-- folder must be src/content/case-studies/
};
