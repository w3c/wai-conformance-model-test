import {
  defineCollection,
  reference,
  z,
} from "astro:content";

/** Fields in common between our schemas that use Astro's image() */
const baseImageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imagePosition: z.string().optional(),
  skipAlt: z.boolean().optional(),
});

export const collections = {
  exhibits: defineCollection({
    type: "content",
    schema: ({ image }) => baseImageSchema.extend({
      image: image(),
    })
  }),

  "exhibit-categories": defineCollection({
    type: "content",
    schema: z.object({
      topDescription: z.string().optional(),
      topImageItem: reference("exhibits").optional(),
      title: z.string().min(1),
    }),
  }),

  products: defineCollection({
    type: "content",
    schema: ({ image }) => baseImageSchema.extend({
      image: image(),
      price: z.number().positive(),
    }),
  }),
};
