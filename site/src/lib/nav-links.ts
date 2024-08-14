import { museumBaseUrl } from "./constants";

export const navLinks = [
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
