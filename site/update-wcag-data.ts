/** @fileoverview Updates src/lib/wcag*.json, used for validation in list of breaks. */

import { fromURL } from "cheerio";
import { writeFile } from "fs/promises";
import { join } from "path";

const get = (url: string) =>
  fetch(url).then((response) => {
    if (response.status >= 400)
      throw new Error(`HTTP error code received: ${response.status}`);
    return response;
  });

const wcag22 = await (
  await get("https://www.w3.org/WAI/WCAG22/wcag.json")
).json();
const wcag22Map: Record<string, string> = {};
for (const principle of wcag22.principles) {
  for (const guideline of principle.guidelines) {
    for (const criterion of guideline.successcriteria) {
      if (criterion.level) {
        wcag22Map[criterion.num] = criterion.handle;
      }
    }
  }
}

const $ = await fromURL("https://w3c.github.io/wcag3/guidelines/");
const wcag3Values: string[] = [];
$("#guidelines h4, #guidelines h5").each((_, el) => {
  const $el = $(el);
  $el.find("bdi, span").remove();
  wcag3Values.push($el.text().trim());
});

await writeFile(
  join("src", "lib", "wcag2.json"),
  JSON.stringify(wcag22Map, null, "  ") + "\n"
);

await writeFile(
  join("src", "lib", "wcag3.json"),
  JSON.stringify(wcag3Values, null, "  ") + "\n"
);
