import { museumBaseUrl } from "./constants";

export interface NavLink {
  href: string;
  headerClass?: string;
  footerClass?: string;
  name: string;
}

export const defaultNavLinks: NavLink[] = [
  { href: "collections/", name: "Collections" },
  { href: "tour/", name: "Take a Tour" },
  { href: "news/", name: "In the News", headerClass: "hidden-below-lg" },
  { href: "gift-shop/", name: "Gift Shop", headerClass: "hidden-below-lg", footerClass: "hidden-below-lg" },
  { href: "map/", name: "Museum Map" },
  { href: "volunteer/", name: "Volunteer" },
  { href: "about/", name: "About" },
].map(({href, ...rest}) => ({
  href: `${museumBaseUrl}${href}`,
  ...rest
}));
