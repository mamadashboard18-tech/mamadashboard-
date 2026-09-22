const STORAGE_KEY = "mama-dashboard:preferencias-contenido";

export const emptyPreferencias = {
  notificaciones: { citas: true, resto: true },
};

export function loadPreferencias() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.notificaciones
      ? { notificaciones: { ...emptyPreferencias.notificaciones, ...saved.notificaciones } }
      : { notificaciones: { ...emptyPreferencias.notificaciones } };
  } catch {
    return { notificaciones: { ...emptyPreferencias.notificaciones } };
  }
}

export function savePreferencias(prefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}
