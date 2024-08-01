export const navLinks = [
  { href: "collections/", name: "Collections" },
  { href: "tour/", name: "Take a Tour" },
  { href: "news/", name: "In the News" },
  { href: "gift-shop/", name: "Gift Shop" },
  { href: "map/", name: "Museum Map" },
  { href: "volunteer/", name: "Volunteer" },
  { href: "about/", name: "About" },
].map(({href, name}) => ({
  href: `${import.meta.env.BASE_URL}${href}`,
  name
}));
