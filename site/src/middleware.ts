import type { MiddlewareHandler } from "astro";
import { sequence } from "astro:middleware";
import { load } from "cheerio";
import GithubSlugger from "github-slugger";

/**
 * Ensures all headings have IDs
 * (even *.astro pages, which can't be done via `markdown` config)
 */
const addHeadingIds: MiddlewareHandler = async (_, next) => {
  const response = await next();
  const $ = load(await response.text());
  const slugger = new GithubSlugger();

  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    if (!el.attribs.id) el.attribs.id = slugger.slug($(el).text());
  });

  return new Response($.html(), response);
};

export const onRequest = sequence(addHeadingIds);
