import { z } from "astro/zod";

const storageKey = "fixable-museum";
const storage = localStorage;

/**
 * Schema for validating and populating defaults for local store.
 * Every property should include .default for upgrade-friendliness.
 */
const storeSchema = z.object({
  isLoggedIn: z.boolean().default(false),
});
type Store = z.infer<typeof storeSchema>;

function initStore() {
  try {
    const json = storage.getItem(storageKey);
    return storeSchema.parse(json ? JSON.parse(json) : {});
  } catch (error) {
    // Reset store upon error in parsing JSON or validating schema (e.g. due to upgrades)
    storage.removeItem(storageKey);
    return storeSchema.parse({});
  }
}
const store = initStore();

/** Recalls a single client-side-stored value. */
export const recall = (key: keyof Store) => store[key];

/** Persists a single client-side-stored value. */
export function persist<K extends keyof Store>(key: K, value: Store[K]) {
  store[key] = value;
  storage.setItem(storageKey, JSON.stringify(store));
}
