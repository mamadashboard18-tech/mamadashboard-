// Contenido de apoyo para el partner: qué se va a realizar en cada tipo de
// cita y qué preguntas podría hacer si la acompaña. Usado en PartnerDashboard
// y en el email de recordatorio (api/_lib/partnerEmails.js).

export const citaInfoPorTipo = {
  "Control obstétrico": {
    descripcion:
      "Control de rutina: toman peso, presión, miden la panza y escuchan los latidos del bebé.",
    preguntasPartner: [
      "¿Todo evoluciona según lo esperado para esta semana?",
      "¿Hay algo puntual que debamos vigilar hasta el próximo control?",
    ],
  },
  Ecografía: {
    descripcion: "Ecografía para ver cómo está creciendo el bebé y chequear su desarrollo.",
    preguntasPartner: [
      "¿Se ve todo bien en las medidas del bebé?",
      "¿Podemos ver/guardar alguna imagen?",
    ],
  },
  "Análisis de sangre": {
    descripcion: "Extracción de sangre para estudios de rutina del embarazo.",
    preguntasPartner: ["¿Cuándo van a estar los resultados?", "¿Hay que hacer algo especial mientras tanto?"],
  },
  "Curso de preparto": {
    descripcion: "Clase de preparación para el parto (respiración, posiciones, qué esperar el día D).",
    preguntasPartner: [
      "¿Qué rol puedo cumplir yo el día del parto?",
      "¿Qué deberíamos practicar en casa antes de la próxima clase?",
    ],
  },
  Odontología: {
    descripcion: "Control odontológico de rutina durante el embarazo.",
    preguntasPartner: ["¿Hay algo para tener en cuenta por el embarazo?"],
  },
  Nutrición: {
    descripcion: "Control con nutricionista para revisar alimentación y aumento de peso.",
    preguntasPartner: ["¿Hay cambios en la dieta que debamos hacer en casa?"],
  },
  "Psicología perinatal": {
    descripcion: "Espacio de acompañamiento emocional durante el embarazo.",
    preguntasPartner: ["¿Cómo puedo acompañarla mejor en esto?"],
  },
  "Primera consulta postparto": {
    descripcion: "Primer control después del nacimiento del bebé, revisan su recuperación.",
    preguntasPartner: [
      "¿Su recuperación viene bien?",
      "¿Hay señales de alerta que debamos vigilar en casa?",
    ],
  },
};

export const citaInfoPorDefecto = {
  descripcion: "Una cita médica relacionada con el embarazo.",
  preguntasPartner: ["¿Cómo salió todo?", "¿Hay algo que debamos hacer antes del próximo control?"],
};
