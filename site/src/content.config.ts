import { glob } from "astro/loaders";
import {
  defineCollection,
  reference,
  z,
} from "astro:content";

/** Fields in common between our schemas that use Astro's image() */
const baseImageSchema = z.object({
  title: z.string().min(1),
  imageDescription: z.string().min(1),
  imagePosition: z.string().optional(),
  skipAlt: z.boolean().optional(),
});

export const collections = {
  blog: defineCollection({
    loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/blog" }),
    schema: ({ image }) => baseImageSchema.extend({
      brokenUrl: z.boolean().default(false),
      category: z.union([z.literal("Events"), z.literal("In the News")]),
      date: z.date().or(z.literal("now")),
      image: image(),
      video: z.string().optional(),
      videoCover: z.string().optional(),
    }),
  }),

  exhibits: defineCollection({
    loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/exhibits" }),
    schema: ({ image }) => baseImageSchema.extend({
      image: image(),
    })
  }),

  "exhibit-categories": defineCollection({
    loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/exhibit-categories" }),
    schema: z.object({
      dangerous: z.boolean().default(false),
      topDescription: z.string().optional(),
      topImageItem: reference("exhibits").optional(),
      title: z.string().min(1),
    }),
  }),

  products: defineCollection({
    loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/products" }),
    schema: ({ image }) => baseImageSchema.extend({
      image: image(),
      price: z.number().positive(),
    }),
  }),
};
