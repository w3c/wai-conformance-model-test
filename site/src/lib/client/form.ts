/**
 * Runs client-side validation against specified form inputs.
 * Assumes all specified fields are text input elements,
 * testing values against regular expressions and applying error styles.
 */
export function validateInputs(form: HTMLFormElement, validations: Record<string, RegExp>) {
  let hasInvalidFields = false;
  for (const [name, pattern] of Object.entries(validations)) {
    const input = form.elements[name] as HTMLInputElement;
    const isValid = pattern.test(input.value);
    input.classList.toggle("error", !isValid);
    if (!isValid) hasInvalidFields = true;
  }
  return hasInvalidFields;
}
