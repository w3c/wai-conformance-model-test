import { museumBaseUrl } from "./constants";

export interface NavLink {
  href: string;
  headerClass?: string;
  footerClass?: string;
  name: string;
}

interface NavParent {
  children: NavLink[];
  name: string;
}

export type NavTree = Array<NavLink | NavParent>;

export const defaultNavLinks: NavTree = [
  {
    name: "Collections",
    children: [
      { href: "collections/dishes/", name: "Dishes" },
      { href: "collections/music/", name: "Music" },
      { href: "collections/sports/", name: "Sports" },
      { href: "collections/technology/", name: "Technology" },
      { href: "collections/", name: "All Collections" },
    ],
  },
  { href: "blog/", name: "Blog", headerClass: "hidden-below-lg" },
  {
    href: "gift-shop/",
    name: "Gift Shop",
    headerClass: "hidden-below-lg",
    footerClass: "hidden-below-lg",
  },
  {
    name: "Visit",
    children: [
      { href: "map/", name: "Museum Map" },
      { href: "tour/", name: "Take a Tour" },
    ],
  },
  { href: "volunteer/", name: "Volunteer" },
  { href: "about/", name: "About" },
  { href: "help/", name: "Help" }, 
];

function prependHref(navLink: NavLink) {
  navLink.href = `${museumBaseUrl}${navLink.href}`;
}

for (const entry of defaultNavLinks) {
  if ("children" in entry) entry.children.forEach(prependHref);
  else prependHref(entry);
}

/** Utility function to distinguish NavLink from NavParent and inform typings */
export const checkIsNavLink = (entry: NavLink | NavParent): entry is NavLink =>
  "href" in entry;

/** Utility function to recursively filter links (not parents) in a NavTree structure. */
export const filterNavTreeLinks = (
  navTree: NavTree,
  fn: (entry: NavLink) => boolean
) =>
  navTree
    .filter((entry) => ("children" in entry ? true : fn(entry)))
    .map((entry) =>
      "children" in entry
        ? {
            ...entry,
            children: entry.children.filter(fn),
          }
        : entry
    );
