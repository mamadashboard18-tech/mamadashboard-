export const catalogoSintomas = [
  { label: "Náuseas matutinas", icon: "🤢", consejoPartner: "Tené a mano algo suave para comer (galletas, jengibre) y evitá olores fuertes cerca suyo." },
  { label: "Fatiga intensa", icon: "😴", consejoPartner: "Sumá tareas de la casa sin que tenga que pedirlo y dale espacio para descansar." },
  { label: "Sensibilidad en los pechos", icon: "💗", consejoPartner: "Evitá abrazos fuertes en esa zona, preguntale qué le resulta cómodo." },
  { label: "Cambios de humor", icon: "🎭", consejoPartner: "Es hormonal, no personal — paciencia y preguntale qué necesita en el momento." },
  { label: "Aumento de la micción", icon: "🚻", consejoPartner: "Planeá las salidas sabiendo que va a necesitar baños cerca." },
  { label: "Aversión a ciertos olores", icon: "👃", consejoPartner: "Evitá perfumes fuertes o comidas con olor intenso cerca suyo." },
  { label: "Antojos", icon: "🍫", consejoPartner: "Ayudala a conseguir lo que se le antoja, dentro de lo razonable." },
  { label: "Mareos leves", icon: "💫", consejoPartner: "Ayudala a sentarse despacio y a tomar agua; evitá que se levante bruscamente." },
  { label: "Hinchazón abdominal", icon: "🎈", consejoPartner: "Ropa cómoda y comidas más livianas pueden ayudar." },
  { label: "Más energía", icon: "⚡", consejoPartner: "Buen momento para planear juntos alguna actividad." },
  { label: "Aparece la línea morena", icon: "〰️", consejoPartner: "Es normal en el embarazo, no requiere ninguna acción de tu parte." },
  { label: "Dolor en el ligamento redondo", icon: "🤕", consejoPartner: "Un cambio de postura suave o apoyar calor local puede aliviar." },
  { label: "Congestión nasal", icon: "🤧", consejoPartner: "Es común en el embarazo; un humidificador puede ayudar." },
  { label: "Encías sensibles", icon: "🦷", consejoPartner: "Recordale que use un cepillo suave, sin necesidad de otra acción tuya." },
  { label: "Primeros movimientos del bebé", icon: "👶", consejoPartner: "Preguntale si podés sentirlos vos también, es un lindo momento para compartir." },
  { label: "Aumento del apetito", icon: "🍽️", consejoPartner: "Tené snacks saludables a mano en casa." },
  { label: "Calambres en las piernas", icon: "🦵", consejoPartner: "Un masaje suave en la pantorrilla suele aliviar." },
  { label: "Piel más luminosa", icon: "✨", consejoPartner: "Nada que hacer, solo decile lo bien que se la ve." },
  { label: "Dolor de espalda", icon: "🦴", consejoPartner: "Un masaje o ayudarla a cargar cosas pesadas puede aliviar mucho." },
  { label: "Hinchazón en pies y manos", icon: "🦶", consejoPartner: "Ayudala a mantener los pies en alto un rato al día." },
  { label: "Falta de aire", icon: "😮‍💨", consejoPartner: "Es común por la panza empujando el diafragma; evitá que suba escaleras apurada." },
  { label: "Contracciones de Braxton-Hicks", icon: "💥", consejoPartner: "Son normales y no dolorosas; ayudala a cambiar de posición y tomar agua." },
  { label: "Insomnio", icon: "🌙", consejoPartner: "Una almohada extra para acomodar la panza puede ayudar a dormir mejor." },
  { label: "Acidez estomacal", icon: "🔥", consejoPartner: "Comidas más chicas y frecuentes, evitar acostarse justo después de comer." },
  { label: "Mayor frecuencia urinaria", icon: "🚽", consejoPartner: "Planeá las salidas sabiendo que va a necesitar baños cerca." },
  { label: "Pesadez pélvica", icon: "🏋️", consejoPartner: "Ayudala a descansar con los pies en alto cuando pueda." },
  { label: "Dificultad para dormir cómoda", icon: "🛏️", consejoPartner: "Almohadas extra entre las piernas o bajo la panza pueden ayudar." },
  { label: "Dolor de cabeza", icon: "🤯", consejoPartner: "Un ambiente tranquilo y oscuro, y ofrecerle agua, suele ayudar." },
  { label: "Estreñimiento", icon: "🚿", consejoPartner: "Ayudala a tomar más agua y sumar fibra a las comidas del día." },
  { label: "Venas varicosas", icon: "🦵", consejoPartner: "Ayudala a mantener las piernas en alto cuando esté sentada." },

  // Señales para comentar con el médico (no son un diagnóstico, solo una sugerencia)
  { label: "Sangrado vaginal", icon: "🩸", atencion: true, consejoPartner: "Acompañala a contactar a su médico o a la guardia sin demora." },
  { label: "Fiebre", icon: "🌡️", atencion: true, consejoPartner: "Ayudala a controlar la temperatura y a contactar a su médico." },
  { label: "Dolor de cabeza fuerte o que no pasa", icon: "🤕", atencion: true, consejoPartner: "Sugerile llamar a su médico, sobre todo si no mejora con reposo." },
  { label: "Hinchazón repentina en cara o manos", icon: "😳", atencion: true, consejoPartner: "Puede ser una señal a chequear con el médico cuanto antes." },
  { label: "Disminución de los movimientos del bebé", icon: "👶", atencion: true, consejoPartner: "Acompañala a contactar a su médico para chequear cómo está el bebé." },
  { label: "Pérdida de líquido", icon: "💧", atencion: true, consejoPartner: "Contactá a su médico o vayan a la guardia sin demora." },
  { label: "Dolor abdominal intenso", icon: "😣", atencion: true, consejoPartner: "Sugerile contactar a su médico o ir a la guardia." },
  { label: "Visión borrosa", icon: "👁️", atencion: true, consejoPartner: "Puede ser una señal a chequear con el médico cuanto antes." },
];

const ICONO_DEFECTO = "📝";

export function iconoSintoma(label) {
  return catalogoSintomas.find((s) => s.label === label)?.icon || ICONO_DEFECTO;
}

export function esSintomaDeAtencion(label) {
  return catalogoSintomas.some((s) => s.label === label && s.atencion);
}

export function consejoPartnerSintoma(label) {
  return catalogoSintomas.find((s) => s.label === label)?.consejoPartner || null;
}
