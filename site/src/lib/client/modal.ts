/** @fileoverview Functions complementing the Modal component in both broken and fixed states */

const isDialog = (el: HTMLElement): el is HTMLDialogElement =>
  el.tagName === "DIALOG";

export function showModal(id: string) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`showModal: id ${id} not found`);

  if (isDialog(el)) el.showModal();
  else el.hidden = false;
}

export function hideModal(id: string) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`showModal: id ${id} not found`);

  if (isDialog(el)) el.close();
  else el.hidden = true;
}
