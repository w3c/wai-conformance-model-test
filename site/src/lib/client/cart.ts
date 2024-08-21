import { persist, recall, type Store } from "./store";
import { museumBaseUrl } from "../constants";

/** Returns aggregated statistics about cart contents. */
export function computeTotals(cart: Store["cart"]) {
  let totalItems = 0;
  let totalCost = 0;
  for (const { quantity, price } of Object.values(cart)) {
    totalItems += quantity;
    totalCost += price * quantity;
  }
  return { totalCost, totalItems };
}

let isHandlingRemovals = false;
/**
 * Hooks up a document-level click listener for cart remove operations.
 * Controls are expected to be buttons beginning with a product slug and
 * ending with -remove.
 */
export function handleCartRemovals() {
  if (isHandlingRemovals) return; // Only hook up once per page

  document.addEventListener("click", (event) => {
    const buttonEl = event.target as HTMLButtonElement;
    if (buttonEl.tagName !== "BUTTON") return;
    const match = /^(.*)-remove$/.exec(buttonEl.id);
    if (!match || !match[1]) return;

    const cart = recall("cart");
    const cartProduct = cart[match[1]];
    if (cartProduct) {
      cartProduct.quantity -= 1;
      if (cartProduct.quantity < 1) delete cart[match[1]];
      persist("cart", cart);
    }
  });

  isHandlingRemovals = true;
}

/**
 * Renders the contents of the gift shop cart (client-side).
 * Intended for use by event handlers.
 */
export function renderCartInventory(
  cart: Store["cart"],
  tableId: string,
  includeRemove: boolean
) {
  const tbodyEl = document.getElementById(tableId) as HTMLTableSectionElement;
  if (!tbodyEl) throw new Error("table not found");
  tbodyEl.innerHTML = "";

  const entries = Object.entries(cart);
  for (const [slug, { name, quantity, price }] of entries) {
    const rowEl = document.createElement("tr");
    rowEl.innerHTML = `
      <td><a href="${museumBaseUrl}gift-shop/${slug}/">${name}</a></td>
      <td>$${price.toFixed(2)}</td>
      <td>${quantity}</td>
    `;

    if (includeRemove) {
      const removeCell = document.createElement("td");
      removeCell.innerHTML = `<button id="${slug}-remove" type="button">Remove</button>`;
      rowEl.appendChild(removeCell);
    }

    tbodyEl.appendChild(rowEl);
  }
}
