import { Home } from "lucide-react";
import ChecklistPantalla from "./ui/ChecklistPantalla";
import { checklistRecomendado, loadChecklist, saveChecklist } from "../data/checklistNursery";

export default function ChecklistNursery({ onBack }) {
  return (
    <ChecklistPantalla
      onBack={onBack}
      icon={Home}
      title="Checklist de nursery"
      subtitle="Preparando el cuarto del bebé"
      categorias={checklistRecomendado}
      load={loadChecklist}
      save={saveChecklist}
      placeholder="Ej: humidificador, luz de noche..."
    />
  );
}
