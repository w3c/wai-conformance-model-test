/** @fileoverview Common types useful across components */

import type { ComponentProps, HTMLTag, Polymorphic } from "astro/types";

type AstroComponent = (args: any) => any;

export type TagOrComponent = HTMLTag | AstroComponent;

/**
 * Extension to Astro's Polymorphic type to support either a native element or component.
 */
export type PolymorphicProps<Tag extends TagOrComponent> =
  Tag extends HTMLTag
    ? Polymorphic<{ as: Tag }>
    : Tag extends AstroComponent
      ? // This second ternary is required to pass type checking but the `never` will never occur
        ComponentProps<Tag> & {
          as: Tag;
        }
      : never;
