const STORAGE_KEY = "mama-dashboard:preferencias-contenido";

export const emptyPreferencias = {
  tipos: { podcast: true, meditacion: true, nutricion: false, ejercicio: true },
  idioma: "es",
  frecuencia: "diaria",
};

export function loadPreferencias() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...emptyPreferencias, ...saved } : { ...emptyPreferencias };
  } catch {
    return { ...emptyPreferencias };
  }
}

export function savePreferencias(prefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}
