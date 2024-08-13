import type { APIRoute } from "astro";
import glob from "fast-glob";
import { readFile } from "fs/promises";
import { join } from "path";
import { museumBaseUrl } from "@/lib/constants";

export interface SearchResult {
  title: string;
  url: string;
}

export const GET: APIRoute = async () => {
  const cwd = join("src", "pages", "museum");
  const pages = await glob("**/*.astro", { cwd });
  const pageResults: SearchResult[] = [];

  for (const filename of pages) {
    if (/\[.+\]/.test(filename)) continue; // Skip dynamic routes
    const relativePath = filename
      .replace(/index\.astro$/, "")
      .replace(/\.astro$/, "/");
    if (/.+\/.+/.test(relativePath)) continue; // Skip nested routes

    const content = await readFile(join(cwd, filename), "utf8");
    const title = /<Layout[^>]* title="([^"]+)"/.exec(content)?.[1];
    if (title)
      pageResults.push({
        title,
        url: museumBaseUrl + relativePath,
      });
  }

  return new Response(JSON.stringify(pageResults));
};
