const STORAGE_KEY = "mama-dashboard:tramites";

export const paises = [
  { id: "AR", nombre: "Argentina" },
  { id: "MX", nombre: "México" },
  { id: "ES", nombre: "España" },
  { id: "CL", nombre: "Chile" },
  { id: "CO", nombre: "Colombia" },
];

export const tramitesPorPais = {
  AR: {
    embarazo: [
      { id: "ar-e1", titulo: "Inscribir el embarazo en la obra social", desc: "Presentar certificado médico dentro de los primeros 3 meses" },
      { id: "ar-e2", titulo: "Certificado médico con fecha probable de parto", desc: "Lo vas a necesitar para varios trámites administrativos" },
      { id: "ar-e3", titulo: "Actualizar el DNI si hace falta", desc: "Verificar vigencia antes del parto" },
    ],
    postparto: [
      { id: "ar-p1", titulo: "Inscripción de nacimiento (Registro Civil)", desc: "Dentro de los 40 días corridos" },
      { id: "ar-p2", titulo: "DNI del bebé", desc: "Se tramita junto con la inscripción" },
      { id: "ar-p3", titulo: "Alta en la obra social del bebé", desc: "Dentro de los primeros 30 días" },
    ],
  },
};

export function loadDone() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveDone(done) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
}
