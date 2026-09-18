const STORAGE_KEY = "mama-dashboard:contactos-emergencia";

export function loadContactosEmergencia() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveContactosEmergencia(contactos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contactos));
}
