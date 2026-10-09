import { ShoppingBag } from "lucide-react";
import ChecklistPantalla from "./ui/ChecklistPantalla";
import { listaRecomendada, loadListaCompras, saveListaCompras } from "../data/listaCompras";

export default function ListaCompras({ onBack }) {
  return (
    <ChecklistPantalla
      onBack={onBack}
      icon={ShoppingBag}
      title="Lista de compras"
      subtitle="Sugerida para tu semana, editable a tu gusto"
      categorias={listaRecomendada}
      load={loadListaCompras}
      save={saveListaCompras}
      etiquetaProgreso="comprado"
      placeholder="Ej: almohada de lactancia, sacaleches..."
    />
  );
}
