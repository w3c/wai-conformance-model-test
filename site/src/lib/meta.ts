export const slugifyPath = (path: string) =>
  path.replace(/\//g, "-").replace(/^-/, "").replace(/-$/, "");
