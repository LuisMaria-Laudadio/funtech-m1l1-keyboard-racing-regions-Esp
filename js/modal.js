export function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("hidden-init");
}

export function hideModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("hidden-init");
}
