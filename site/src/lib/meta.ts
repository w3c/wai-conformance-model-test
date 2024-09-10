/** Converts a path to a slug for section permalinks */
export const slugifyPath = (path: string) =>
  path.replace(/\//g, "-").replace(/^-/, "").replace(/-$/, "");
