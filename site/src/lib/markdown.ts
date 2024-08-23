import { createMarkdownProcessor } from "@astrojs/markdown-remark";

const processor = await createMarkdownProcessor();

/** Renders the first paragraph of an entry's markdown to HTML. */
export const generateExcerpt = (body: string) =>
  processor.render(body.split(/(\r?\n){2,}/)[0]);
