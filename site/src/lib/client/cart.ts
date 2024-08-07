import { startCase } from "lodash-es";
import { persist, recall, type Store } from "./store";

/** Returns aggregated statistics about cart contents. */
export function computeTotals(cart: Store["cartPrototype"]) {
  let totalItems = 0;
  let totalCost = 0;
  for (const { quantity, unitPrice } of Object.values(cart)) {
    totalItems += quantity;
    totalCost += unitPrice * quantity;
  }
  return { totalCost, totalItems };
}

let isHandlingInteractions = false;
/**
 * Hooks up a document-level click listener for cart add/remove operations.
 * Controls are expected to be buttons beginning with a product ID and
 * ending with -add/-remove. Add controls should also define data-price.
 * (These expectations are likely to change upon developing full product pages.)
 */
export function handleCartInteractions() {
  if (isHandlingInteractions) return; // Only hook up once per page

  document.addEventListener("click", (event) => {
    const buttonEl = event.target as HTMLButtonElement;
    if (buttonEl.tagName !== "BUTTON") return;
    const match = /^(.*)-(add|remove)$/.exec(buttonEl.id);
    if (!match || !match[1]) return;

    const cart = recall("cartPrototype");
    const cartProduct = cart[match[1]];
    if (cartProduct) {
      cartProduct.quantity += match[2] === "add" ? 1 : -1;
      if (cartProduct.quantity < 1) delete cart[match[1]];
    } else if (match[2] === "add") {
      cart[match[1]] = { quantity: 1, unitPrice: +buttonEl.dataset.price! };
    }

    persist("cartPrototype", cart);
  });

  isHandlingInteractions = true;
}

/**
 * Renders the contents of the gift shop cart (client-side).
 * Intended for use by event handlers.
 */
export function renderCartInventory(
  cart: Store["cartPrototype"],
  tableId: string,
  includeRemove: boolean
) {
  const tbodyEl = document.getElementById(tableId) as HTMLTableSectionElement;
  if (!tbodyEl) throw new Error("table not found");
  tbodyEl.innerHTML = "";

  const entries = Object.entries(cart);
  for (const [id, { quantity, unitPrice }] of entries) {
    const rowEl = document.createElement("tr");
    rowEl.innerHTML = `
      <td>${startCase(id.replace(/-/g, " "))}</td>
      <td>$${unitPrice.toFixed(2)}</td>
      <td>${quantity}</td>
    `;

    if (includeRemove) {
      const removeCell = document.createElement("td");
      removeCell.innerHTML = `<button id="${id}-remove" type="button">Remove</button>`;
      rowEl.appendChild(removeCell);
    }

    tbodyEl.appendChild(rowEl);
  }
}
