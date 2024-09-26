/** @fileoverview Functions complementing the Toast component in both broken and fixed states */

import type { ToastType } from "@/components/Toast.astro";
import { getMode } from "../mode";
import type { HTMLAttributes } from "astro/types";

interface ToastOptions {
  /**
   * If set, the toast will automatically dismiss after this number of milliseconds
   * (broken mode only)
   */
  duration?: number;
  /**
   * If specified, passes the given role attribute value
   * (broken mode only, since fixed uses a non-modal dialog instead)
   */
  role?: HTMLAttributes<"div">["role"];
  /** Type of toast; determines icon placed before the message */
  type: ToastType;
  /**
   * If set to false, the toast will not include a dismiss button
   * (broken mode only)
   */
  withDismiss?: boolean;
}

type ToastOptionsWithAction = ToastOptions & {
  actionLabel: string;
} & ({ actionCallback: () => void } | { actionHref: string });

let toastTimer: ReturnType<typeof setTimeout> | null = null;
let toastTransitionPromise: Promise<void> | null = null;

function createTransitionPromise(el: HTMLElement) {
  toastTransitionPromise = new Promise<void>((resolve) => {
    function handler() {
      el.removeEventListener("transitionend", handler);
      toastTransitionPromise = null;
      resolve();
    }
    el.addEventListener("transitionend", handler);
  });
  return toastTransitionPromise;
}

/**
 * Hides/closes the toast if it is currently open.
 * This is exposed for the Toast component; direct calls should be unnecessary.
 */
export async function hideToast() {
  // Wait for any existing transition to finish first
  if (toastTransitionPromise) await toastTransitionPromise;
  const toastEl = document.getElementById("toast")!;
  if (toastEl.classList.contains("showing")) {
    toastEl.classList.remove("showing");
    await createTransitionPromise(toastEl);
  }

  if (getMode() === "broken") toastEl.hidden = true;
  else (toastEl as HTMLDialogElement).close();
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
}

/**
 * Displays a message in a toast.
 * Note this does not support multiple concurrent toasts or queueing.
 */
export async function showToast(
  message: string,
  {
    duration,
    role,
    type,
    withDismiss = true,
    ...actionOptions
  }: ToastOptions | ToastOptionsWithAction
) {
  const isBroken = getMode() === "broken";
  const toastEl = document.getElementById("toast")!;
  const contentEl = document.getElementById("toast-content");
  const dismissEl = document.getElementById("toast-dismiss");
  if (!toastEl || !contentEl || !dismissEl)
    throw new Error("showToast used without <Toast /> component present");

  await hideToast();

  contentEl.textContent = message;

  if (isBroken) {
    dismissEl.hidden = !withDismiss;
    if (role) toastEl.setAttribute("role", role);
    else toastEl.removeAttribute("role");
  }

  const templateEl = document.getElementById(
    `toast-icon-${type}`
  ) as HTMLTemplateElement;
  if (!templateEl)
    throw new Error(`Template element not found for type ${type}`);
  contentEl.insertBefore(
    templateEl.content.cloneNode(true),
    contentEl.firstChild
  );

  if ("actionLabel" in actionOptions) {
    const isButton = "actionCallback" in actionOptions;
    const el = document.createElement(isButton ? "button" : "a");
    if (isButton) {
      el.addEventListener("click", async () => {
        await hideToast();
        actionOptions.actionCallback();
      });
    } else {
      (el as HTMLAnchorElement).href = actionOptions.actionHref;
    }

    el.textContent = actionOptions.actionLabel;
    contentEl.appendChild(el);
  }

  if (isBroken) toastEl.hidden = false;
  else (toastEl as HTMLDialogElement).show();

  // Give element a chance to paint before adding class, to apply transition
  setTimeout(() => toastEl.classList.add("showing"), 15);
  await createTransitionPromise(toastEl);

  if (isBroken && duration) toastTimer = setTimeout(hideToast, duration);
}
