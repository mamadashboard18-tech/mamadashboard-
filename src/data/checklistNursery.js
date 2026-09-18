const STORAGE_KEY = "mama-dashboard:checklist-nursery";

export const checklistRecomendado = [
  {
    categoria: "Muebles",
    items: ["Cuna", "Cambiador", "Placard o cómoda"],
  },
  {
    categoria: "Decoración",
    items: ["Cortinas blackout", "Móvil para la cuna"],
  },
  {
    categoria: "Seguridad",
    items: ["Monitor de bebé", "Protectores de enchufe", "Detector de humo en el cuarto"],
  },
  {
    categoria: "Ropa de cama",
    items: ["Sábanas ajustables (x3)", "Saquito de dormir"],
  },
];

export function loadChecklist() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { marcados: [], propios: [] };
  } catch {
    return { marcados: [], propios: [] };
  }
}

export function saveChecklist(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
