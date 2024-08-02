// Note: dev focus is on broken state first.
// This enables us to code both broken and fixed states when we have the forethought to.
// Precise details of broken/fixed toggle mechanics are TBD; use an env var for now.

export type Mode = "broken" | "fixed";

/** Gets broken or fixed mode, both at build time and client-side */
export function getMode(): Mode {
  return import.meta.env.PUBLIC_FIXED ? "fixed" : "broken";
};

