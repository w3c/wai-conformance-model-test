import { defineCollection, reference, z } from "astro:content";

export const collections = {
  exhibits: defineCollection({
    type: "content",
    schema: ({ image }) =>
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        image: image(),
        imagePosition: z.string().optional(),
        skipAlt: z.boolean().optional(),
      }),
  }),

  "exhibit-categories": defineCollection({
    type: "content",
    schema: z.object({
      topDescription: z.string().optional(),
      topImageItem: reference("exhibits").optional(),
      title: z.string().min(1),
    }),
  }),
};
