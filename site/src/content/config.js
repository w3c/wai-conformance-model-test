import { defineCollection, reference, z } from "astro:content";

const collection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      image: z.object({
        src: image(),
        alt: z.string().optional(),
        vertical: z.boolean().default(false),
      }),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = {
  collection,
};
