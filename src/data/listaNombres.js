const STORAGE_KEY = "mama-dashboard:lista-nombres";

export function loadNombres() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveNombres(nombres) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nombres));
}
