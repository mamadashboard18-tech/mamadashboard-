import { Backpack } from "lucide-react";
import ChecklistPantalla from "./ui/ChecklistPantalla";
import { checklistRecomendado, loadChecklist, saveChecklist } from "../data/checklistHospital";

export default function ChecklistHospital({ onBack }) {
  return (
    <ChecklistPantalla
      onBack={onBack}
      icon={Backpack}
      title="Checklist del hospital"
      subtitle="Bolsa, documentos y contactos"
      categorias={checklistRecomendado}
      load={loadChecklist}
      save={saveChecklist}
      placeholder="Ej: cámara de fotos, almohada de lactancia..."
    />
  );
}
