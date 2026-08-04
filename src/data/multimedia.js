import semanal from "./multimediaSemanal.json";
import biblioteca from "./multimediaBiblioteca.json";

export const tipoIcono = {
  articulo: "📄",
  video: "🎬",
  frase: "💬",
  guia: "📘",
  libro: "📚",
  plantilla: "📝",
  podcast: "🎙️",
  canal: "📺",
};

export const tipoLabel = {
  articulo: "Artículo",
  video: "Video",
  frase: "Frase",
  guia: "Guía",
  libro: "Libro",
  plantilla: "Plantilla",
  podcast: "Podcast",
  canal: "Canal",
};

export const categoriaLabel = {
  tipos_de_parto: "Tipos de parto",
  preparacion_parto: "Preparación para el parto",
  lactancia: "Lactancia",
  recuperacion_fisica_postparto: "Recuperación física postparto",
  salud_mental_postparto: "Salud mental postparto",
  sueno: "Sueño",
  cuidados_recien_nacido: "Cuidados del recién nacido",
  pareja_acompanante: "Pareja y acompañante",
  nutricion: "Nutrición",
  ejercicio_postparto: "Ejercicio postparto",
};

export const categoriasOrdenadas = [
  "tipos_de_parto",
  "preparacion_parto",
  "nutricion",
  "sueno",
  "lactancia",
  "recuperacion_fisica_postparto",
  "ejercicio_postparto",
  "salud_mental_postparto",
  "cuidados_recien_nacido",
  "pareja_acompanante",
];

export function getContenidoSemana(semana, etapa) {
  return semanal.filter((item) => item.etapa === etapa && item.semana === semana);
}

export function getBibliotecaPorCategoria(categoria) {
  return biblioteca.filter((item) => item.categoria === categoria);
}

export { semanal, biblioteca };

// Contenido curado de influencers y famosas hablando de maternidad, embarazo y
// crianza en primera persona: para que las mamás se sientan representadas
// con historias reales, no solo con contenido clínico.
export const mamasReales = [
  {
    id: "criemos-libres",
    tipo: "canal",
    titulo: "Criemos Libres",
    autor: "Mai Pistiner y Benjamín Vicuña",
    link: "https://www.youtube.com/channel/UCEGEYOBU1Waca7DUvq9DG3Q",
    descripcion:
      "Streaming y canal de YouTube sobre crianza sin juicio, con entrevistas a famosas y especialistas sobre maternidad, paternidad y crianza respetuosa.",
    gratis: true,
  },
  {
    id: "oriana-sabatini-embarazo",
    tipo: "video",
    titulo: "Oriana Sabatini habló de su embarazo",
    autor: "Oriana Sabatini",
    link: "https://www.youtube.com/shorts/xLoMNaARrtU",
    descripcion:
      "La cantante y actriz cuenta cómo vivió su embarazo, sin filtros, incluyendo el dolor físico que no se suele mostrar.",
    gratis: true,
  },
  {
    id: "oriana-sabatini-pubalgia",
    tipo: "articulo",
    titulo: "Oriana Sabatini contó cómo transitó el embarazo: \"Tuve pubalgia desde el quinto mes\"",
    autor: "LA NACION",
    link: "https://www.lanacion.com.ar/espectaculos/oriana-sabatini-conto-como-transito-el-embarazo-tuve-pubalgia-desde-el-quinto-mes-nid30042026/",
    descripcion:
      "Oriana se sinceró sobre el lado más difícil del embarazo y cómo la maternidad la transformó, cuestionando la presión de mostrar solo el lado lindo.",
    gratis: true,
  },
  {
    id: "la-joaqui-mtv",
    tipo: "articulo",
    titulo: "La Joaqui habló de lo que significa ser madre de dos hijas: \"Lloro abajo de la ducha\"",
    autor: "La Joaqui · MTV \"El Lado B\"",
    link: "https://www.infobae.com/teleshow/2026/07/09/la-joaqui-hablo-lo-que-significa-ser-madre-de-dos-hijas-y-los-sacrificios-que-hace-lloro-abajo-de-la-ducha/",
    descripcion:
      "En el podcast de MTV conducido por Belu Drugueri, la cantante habla de los sacrificios de la maternidad y de sostenerse fuerte para sus hijas sin dejar de sentir.",
    gratis: true,
  },
  {
    id: "stephanie-demner-maternidad-rosa",
    tipo: "video",
    titulo: "Stephanie Demner: derribó prejuicios de la \"maternidad rosa\"",
    autor: "Stephanie Demner",
    link: "https://www.youtube.com/watch?v=HuOdEO1uPEo",
    descripcion:
      "La modelo cuenta por qué dejó de mostrar solo el lado idílico de la maternidad y se convirtió en referente de otras mamás por su honestidad.",
    gratis: true,
  },
  {
    id: "stephanie-demner-cesarea",
    tipo: "articulo",
    titulo: "Stephanie Demner: \"Si preferís la cesárea sos un demonio, está muy mal visto. Yo tuve una cesárea\"",
    autor: "Stephanie Demner · Infobae",
    link: "https://www.infobae.com/reportajes/2024/03/10/stephanie-demner-con-maria-laura-santillan-si-preferis-la-cesarea-sos-un-demonio-esta-muy-mal-visto-yo-tuve-una-cesarea/",
    descripcion:
      "Una charla íntima con María Laura Santillán sobre elegir el tipo de parto sin culpa, lejos de los juicios sobre qué es \"lo natural\".",
    gratis: true,
  },
  {
    id: "barbie-velez-crianza",
    tipo: "articulo",
    titulo: "Barbie Vélez, entre la exigente rutina de crianza de su hijo: \"Ser madre me hizo entender muchas cosas de mi mamá\"",
    autor: "Barbie Vélez · GENTE",
    link: "https://www.revistagente.com/entretenimiento/barbie-velez-entre-la-maternidad-y-el-teatro-en-carlos-paz-ser-madre-me-hizo-entender-muchas-cosas-de-mi-mama/",
    descripcion:
      "La actriz cuenta cómo es criar a Salvador siendo mamá joven, y cómo la maternidad cambió su relación con su propia mamá.",
    gratis: true,
  },
  {
    id: "noelia-marzol-depresion-preparto",
    tipo: "articulo",
    titulo: "Noelia Marzol: \"Tuve un período de depresión preparto, me sentía muy mal con el embarazo\"",
    autor: "Noelia Marzol · Infobae",
    link: "https://www.infobae.com/reportajes/2025/04/06/noelia-marzol-tuve-un-periodo-de-depresion-preparto-me-sentia-muy-mal-con-el-embarazo/",
    descripcion:
      "Habla sin filtro de lo distinto que fue cada uno de sus embarazos: uno hermoso, el otro atravesado por una depresión que no se anima a callar.",
    gratis: true,
  },
  {
    id: "noelia-marzol-desde-adentro",
    tipo: "video",
    titulo: "#DesdeAdentro | Noelia Marzol: maternidad, el día que salvó a su hijo y sus proyectos",
    autor: "Noelia Marzol",
    link: "https://www.youtube.com/watch?v=DdR-uJJ3Mxk",
    descripcion: "Entrevista extendida sobre su maternidad, sin la edición de la tele.",
    gratis: true,
  },
  {
    id: "jimena-baron-puerperio",
    tipo: "articulo",
    titulo: "Jimena Barón contó intimidades de los primeros días con su bebé: el parto que eligió sin anestesia y el puerperio",
    autor: "Jimena Barón · Infobae",
    link: "https://www.infobae.com/teleshow/2025/06/29/jimena-baron-conto-intimidades-de-los-primeros-dias-con-su-bebe-el-parto-que-eligio-sin-anestesia-y-el-puerperio/",
    descripcion: "Sin eufemismos: cómo vivió el parto, la lactancia, la rutina con el bebé y la recuperación física y emocional.",
    gratis: true,
  },
  {
    id: "jimena-baron-embarazo",
    tipo: "video",
    titulo: "Jimena Barón habló sobre su embarazo: \"Este año me voy a dedicar a la maternidad\"",
    autor: "Jimena Barón",
    link: "https://www.youtube.com/watch?v=BeicxQ91h9U",
    descripcion: "La cantante y actriz habla de cómo decidió priorizar la maternidad en esta etapa de su vida.",
    gratis: true,
  },
  {
    id: "sol-perez-no-romantizar",
    tipo: "articulo",
    titulo: "Sol Pérez mostró una foto íntima con su hijo Marco y se sinceró sobre la maternidad: \"No voy a romantizar\"",
    autor: "Sol Pérez · Infobae",
    link: "https://www.infobae.com/teleshow/2025/04/27/sol-perez-mostro-una-foto-intima-con-su-hijo-marco-y-se-sincero-sobre-la-maternidad-no-voy-a-romantizar/",
    descripcion: "Sobre por qué eligió no idealizar la maternidad y mostrar también el cansancio y las dudas.",
    gratis: true,
  },
  {
    id: "zaira-nara-trabajo-maternidad",
    tipo: "articulo",
    titulo: "Zaira Nara se sinceró sobre la maternidad y el trabajo: \"Me iba llorando cuando Malaika se quedaba en casa\"",
    autor: "Zaira Nara · Revista Para Ti",
    link: "https://www.parati.com.ar/news/zaira-nara-se-sincero-sobre-la-maternidad-y-el-trabajo-me-iba-llorando-cuando-malaika-se-quedaba-en-casa/",
    descripcion: "Sobre la culpa de trabajar siendo mamá y cómo fue encontrando su propio equilibrio.",
    gratis: true,
  },
  {
    id: "paula-chaves-cuerpo",
    tipo: "articulo",
    titulo: "La reflexión de Paula Chaves sobre la maternidad: \"Hay días que no doy más... siento que mi cuerpo no me pertenece\"",
    autor: "Paula Chaves · Infobae",
    link: "https://www.infobae.com/teleshow/infoshow/2020/12/23/la-reflexion-de-paula-chaves-sobre-la-maternidad-y-el-cuerpo-hay-dias-que-no-doy-mas-que-siento-que-mi-cuerpo-es-mio-y-no-me-pertenece/",
    descripcion: "Con tres hijos, habla del cansancio real de la crianza y de recuperar el vínculo con su propio cuerpo.",
    gratis: true,
  },
  {
    id: "mica-viciconte-sinceridad",
    tipo: "articulo",
    titulo: "Mica Viciconte habló con total sinceridad de la maternidad: \"Estoy en una etapa que me encanta\"",
    autor: "Mica Viciconte · Pronto",
    link: "https://www.pronto.com.ar/espectaculos/2025/5/13/mica-viciconte-hablo-con-total-sinceridad-de-la-maternidad-revelo-si-tendria-otro-hijo-estoy-en-una-etapa-que-me-encanta-256795.html",
    descripcion: "Cuenta cómo vive esta etapa de su maternidad con Luca, entre la exigencia y el disfrute.",
    gratis: true,
  },
  {
    id: "cinthia-fernandez-no-doy-mas",
    tipo: "articulo",
    titulo: "El desgarrador posteo de Cinthia Fernández sobre su maternidad: \"No doy más\"",
    autor: "Cinthia Fernández · Infobae",
    link: "https://www.infobae.com/teleshow/2024/01/12/el-desgarrador-posteo-de-cinthia-fernandez-sobre-su-maternidad-no-doy-mas/",
    descripcion: "Cría a sus tres hijas prácticamente sola y se sinceró sobre el cansancio extremo de la crianza sin red.",
    gratis: true,
  },
  {
    id: "agustina-cherri-maternidad-por-cuatro",
    tipo: "articulo",
    titulo: "Agustina Cherri, íntima: el éxito profesional, su nuevo proyecto teatral y la maternidad por cuatro",
    autor: "Agustina Cherri · Infobae",
    link: "https://www.infobae.com/teleshow/2023/04/06/agustina-cherri-intima-el-exito-profesional-su-nuevo-proyecto-teatral-y-la-maternidad-por-cuatro/",
    descripcion: "Cómo combina trabajo y la crianza de cuatro hijos de edades muy distintas, cada uno con necesidades propias.",
    gratis: true,
  },
  {
    id: "nicole-neumann-maternar-varon",
    tipo: "articulo",
    titulo: "Nicole Neumann revela la razón por la que aún no muestra el rostro de su hijo Cruz y cuenta la diferencia que vive al maternar a un varón",
    autor: "Nicole Neumann · GENTE",
    link: "https://www.revistagente.com/entretenimiento/celebrities/nicole-neumann-revela-la-razon-por-la-que-aun-no-muestra-el-rostro-de-su-hijo-cruz-y-cuenta-la-diferencia-que-vive-al-maternar-a-un-varon/",
    descripcion: "Sobre criar a su cuarto hijo después de tres hijas, y los desafíos de sumar un bebé a una familia ensamblada.",
    gratis: true,
  },
  {
    id: "georgina-rodriguez-perdida",
    tipo: "articulo",
    titulo: "Georgina Rodríguez se sincera como nunca: del miedo que sintió durante el embarazo a sus tres abortos",
    autor: "Georgina Rodríguez · Divinity",
    link: "https://www.divinity.es/madres/20230322/georgina-rodriguez-sincera-embarazo-tres-abortos_18_09023770.html",
    descripcion:
      "Habla del pánico que vivió en el embarazo de mellizos y de la pérdida de uno de sus bebés, algo de lo que casi nunca se habla en voz alta.",
    gratis: true,
  },
];
