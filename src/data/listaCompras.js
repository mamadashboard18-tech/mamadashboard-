const STORAGE_KEY = "mama-dashboard:lista-compras";

export const listaRecomendada = [
  {
    categoria: "Ropa",
    items: [
      "Bodies talle recién nacido (x6)",
      "Mamelucos",
      "Gorritos y escarpines",
      "Campera de abrigo",
    ],
  },
  {
    categoria: "Higiene",
    items: [
      "Pañales talla recién nacido",
      "Toallitas húmedas",
      "Crema para pañal",
      "Jabón y shampoo neutro",
    ],
  },
  {
    categoria: "Cuarto",
    items: [
      "Moisés o cuna",
      "Sábanas y protector de colchón",
      "Cambiador",
    ],
  },
  {
    categoria: "Transporte",
    items: [
      "Butaca para auto",
      "Cochecito",
    ],
  },
];

export function loadListaCompras() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { marcados: [], propios: [] };
  } catch {
    return { marcados: [], propios: [] };
  }
}

export function saveListaCompras(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
