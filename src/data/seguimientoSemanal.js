// img: ilustración propia (generada en Canva) en public/bebe; si falta o no carga se usa el emoji.
const sizes = [
  { emoji: "🔬", name: "Todavía no hay embarazo", sinTamano: true }, // 1
  { emoji: "🔬", name: "Se acerca la ovulación", sinTamano: true }, // 2
  { emoji: "🔬", name: "Fecundación reciente", sinTamano: true }, // 3
  { emoji: "🌱", name: "una semilla de amapola" }, // 4
  { emoji: "🌱", name: "una semilla de sésamo" }, // 5
  { emoji: "🫘", name: "una lenteja" }, // 6
  { emoji: "🫐", name: "un arándano" }, // 7
  { emoji: "🍓", name: "una frambuesa" }, // 8
  { emoji: "🍇", name: "una uva" }, // 9
  { emoji: "🍊", name: "un quinoto" }, // 10
  { emoji: "🟣", name: "un higo" }, // 11
  { emoji: "🍋", name: "una lima" }, // 12
  { emoji: "🫛", name: "una vaina de arvejas" }, // 13
  { emoji: "🍋", name: "un limón" }, // 14
  { emoji: "🍎", name: "una manzana" }, // 15
  { img: "/bebe/semana-16.png", emoji: "🥑", name: "una palta" }, // 16
  { emoji: "🥔", name: "un nabo" }, // 17
  { emoji: "🫑", name: "un morrón" }, // 18
  { emoji: "🍅", name: "un tomate" }, // 19
  { emoji: "🍌", name: "una banana" }, // 20
  { emoji: "🥕", name: "una zanahoria" }, // 21
  { emoji: "🎃", name: "un zapallo espagueti" }, // 22
  { emoji: "🍊", name: "un pomelo" }, // 23
  { emoji: "🌽", name: "un choclo" }, // 24
  { emoji: "🥔", name: "un nabo sueco" }, // 25
  { emoji: "🥒", name: "un pepino grande" }, // 26
  { emoji: "🥦", name: "una coliflor" }, // 27
  { emoji: "🍆", name: "una berenjena" }, // 28
  { emoji: "🎃", name: "un zapallo anco" }, // 29
  { emoji: "🥬", name: "un repollo" }, // 30
  { emoji: "🥥", name: "un coco" }, // 31
  { emoji: "🍍", name: "un ananá chico" }, // 32
  { emoji: "🍍", name: "un ananá" }, // 33
  { emoji: "🍈", name: "un melón" }, // 34
  { emoji: "🍈", name: "un melón rocío de miel" }, // 35
  { emoji: "🥬", name: "una lechuga romana" }, // 36
  { emoji: "🥬", name: "un atado de acelga" }, // 37
  { emoji: "🥬", name: "un puerro" }, // 38
  { emoji: "🍉", name: "una sandía chica" }, // 39
  { emoji: "🎃", name: "un zapallo" }, // 40
];

// Promedios de referencia (tablas de crecimiento fetal tipo OMS/Hadlock). Hasta la semana 19
// la longitud es cabeza-nalgas; desde la 20, cabeza-talón (por eso el salto entre 19 y 20).
const lengths = [
  null, null, null, null, null, null,
  1.3, 1.6, 2.3, 3.1, 4.1, 5.4, 7.4, 8.7, 10.1, 11.6, 13, 14.2, 15.3, 25.6,
  26.7, 27.8, 28.9, 30, 34.6, 35.6, 36.6, 37.6, 38.6, 39.9, 41.1, 42.4,
  43.7, 45, 46.2, 47.4, 48.6, 49.8, 50.7, 51.2,
];

const weights = [
  null, null, null, null, null, null,
  null, 1, 2, 4, 7, 14, 23, 43, 70, 100, 140, 190, 240, 300,
  360, 430, 501, 600, 660, 760, 875, 1005, 1153, 1319, 1502, 1702,
  1918, 2146, 2383, 2622, 2859, 3083, 3288, 3462,
];

const milestones = [
  "Tu ciclo comienza a contarse desde el primer día de tu última menstruación.",
  "Se produce la ovulación, el momento clave para la fecundación.",
  "La fecundación ocurre y comienza la división celular.",
  "El óvulo fecundado se implanta en el útero.",
  "Comienza a formarse el tubo neural.",
  "El corazón de tu bebé empieza a latir.",
  "Se forman los brazos y piernas como pequeños brotes.",
  "Todos los órganos principales comenzaron a desarrollarse.",
  "Los dedos de manos y pies empiezan a definirse.",
  "Los huesos y cartílagos se están formando.",
  "Ya hace pequeños movimientos, aunque todavía no los sientas.",
  "Ya se formaron sus órganos principales; ahora van a crecer y madurar.",
  "Termina el primer trimestre. ¡Vas muy bien!",
  "Tu bebé puede hacer muecas y fruncir el ceño.",
  "Puede percibir la luz a través de los párpados cerrados.",
  "El sistema circulatorio y las vías urinarias ya funcionan.",
  "Comienza a acumular grasa corporal.",
  "Sus oídos están en posición final: puede empezar a escuchar.",
  "Se forma la vérnix caseosa que protege su piel.",
  "¡Mitad del camino! Es el momento típico de la ecografía morfológica.",
  "Sus movimientos son cada vez más fuertes y coordinados.",
  "Sus cejas y pestañas ya son visibles.",
  "Sus pulmones desarrollan los vasos sanguíneos para respirar.",
  "Alcanza un hito de viabilidad con cuidados médicos intensivos.",
  "Su piel comienza a volverse menos transparente.",
  "Sus ojos empiezan a abrirse.",
  "Responde a los sonidos y puede empezar a reconocer tu voz.",
  "Empieza el tercer trimestre. Puede parpadear y entrar en fase de sueño REM.",
  "Sus músculos y pulmones siguen madurando.",
  "Su cerebro se desarrolla muy rápidamente.",
  "Puede girar la cabeza y sus huesos se endurecen, salvo el cráneo.",
  "Practica la respiración usando líquido amniótico.",
  "Los huesos de su cráneo permanecen blandos para facilitar el parto.",
  "Su sistema nervioso central sigue madurando.",
  "Sus riñones están completamente desarrollados.",
  "Sigue ganando peso rápidamente de cara al parto.",
  "Se considera oficialmente 'a término temprano'.",
  "Sus órganos están listos para la vida fuera del útero.",
  "Se considera a término completo.",
  "¡Fecha probable de parto! Tu bebé está listo para nacer.",
];

const symptomSets = {
  1: [
    ["Náuseas matutinas", "Fatiga intensa", "Sensibilidad en los pechos"],
    ["Cambios de humor", "Aumento de la micción", "Aversión a ciertos olores"],
    ["Antojos", "Mareos leves", "Hinchazón abdominal"],
  ],
  2: [
    ["Más energía", "Aparece la línea morena", "Dolor en el ligamento redondo"],
    ["Congestión nasal", "Encías sensibles", "Primeros movimientos del bebé"],
    ["Aumento del apetito", "Calambres en las piernas", "Piel más luminosa"],
  ],
  3: [
    ["Dolor de espalda", "Hinchazón en pies y manos", "Falta de aire"],
    ["Contracciones de Braxton-Hicks", "Insomnio", "Acidez estomacal"],
    ["Mayor frecuencia urinaria", "Pesadez pélvica", "Dificultad para dormir cómoda"],
  ],
};

export function trimesterOf(week) {
  // ACOG: 1er trimestre hasta 13+6, 2do de 14+0 a 27+6, 3ro desde 28+0
  if (week <= 13) return 1;
  if (week <= 27) return 2;
  return 3;
}

function mondayOf(date) {
  const day = date.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function semanaEnFecha(fechaISO, semanaActual, hoy = new Date()) {
  const fecha = new Date(fechaISO + "T00:00:00");
  const diffMs = mondayOf(fecha).getTime() - mondayOf(hoy).getTime();
  const delta = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
  return Math.min(semanaActual, Math.max(1, semanaActual + delta));
}

export const totalWeeks = 40;

export function getWeekData(week) {
  const idx = week - 1;
  const trimester = trimesterOf(week);
  const variants = symptomSets[trimester];
  const symptoms = variants[idx % variants.length];

  return {
    week,
    trimester,
    size: sizes[idx],
    length: lengths[idx],
    weight: weights[idx],
    milestone: milestones[idx],
    symptoms,
  };
}
