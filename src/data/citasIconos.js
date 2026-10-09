import { Stethoscope, ScanLine, Droplet, Backpack, Smile, Apple, MessageCircle, Baby, CalendarDays } from "lucide-react";

export const TIPO_PRIMERA_CONSULTA_POSTPARTO = "Primera consulta postparto";

const tipoIconos = {
  "Control obstétrico": Stethoscope,
  "Ecografía": ScanLine,
  "Análisis de sangre": Droplet,
  "Curso de preparto": Backpack,
  "Odontología": Smile,
  "Nutrición": Apple,
  "Psicología perinatal": MessageCircle,
  [TIPO_PRIMERA_CONSULTA_POSTPARTO]: Baby,
  Otro: CalendarDays,
};

export function tipoIcono(tipo) {
  return tipoIconos[tipo] || CalendarDays;
}
