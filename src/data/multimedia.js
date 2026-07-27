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
];
