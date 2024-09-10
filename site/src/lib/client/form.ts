import type { ZodObject, ZodRawShape } from "astro/zod";

/** Utility function for failure cases that disables all inputs/buttons in a form. */
export function disableInputs(form: HTMLFormElement) {
  const inputSelectors = ["input", "select", "button"] as const;
  inputSelectors.forEach((selector) =>
    form.querySelectorAll(selector).forEach((el) => (el.disabled = true))
  );
}

/**
 * Runs client-side validation against specified form inputs,
 * automatically marking fields with invalid values.
 * Assumes all specified fields are text input elements.
 */
export function validateInputs<T extends ZodRawShape>(
  form: HTMLFormElement,
  schema: ZodObject<T>
) {
  const entryMap: Record<string, string> = {};
  const formData = new FormData(form);
  for (const [name, value] of formData.entries()) {
    entryMap[name] = value as string;
    // Initially clear error states; fields with errors after validation will be re-flagged
    (form.elements[name] as HTMLInputElement).classList.remove("error");
  }

  const result = schema.safeParse(entryMap);
  if (!result.success) {
    for (const { path } of result.error.issues)
      (form.elements[path.join(".")] as HTMLInputElement).classList.add("error");
  }
  return result;
}
