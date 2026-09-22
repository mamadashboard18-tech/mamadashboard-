import { useState } from "react";
import { Phone, ShieldAlert } from "lucide-react";
import Header from "./Header";
import BackButton from "./BackButton";
import ContactosMedicos from "./ContactosMedicos";
import ContactosEmergencia from "./ContactosEmergencia";

const TABS = [
  { id: "medicos", label: "Equipo médico", icon: Phone },
  { id: "emergencia", label: "Emergencia", icon: ShieldAlert },
];

export default function Contactos({ onBack }) {
  const [tab, setTab] = useState("medicos");

  return (
    <div>
      <BackButton onBack={onBack} label="Volver a Mi Perfil" className="mb-4" />

      <Header title="Contactos" subtitle="Tu equipo médico y tus personas de confianza, a un toque" />

      <div className="inline-flex bg-white border border-[var(--border-soft)] rounded-full p-1 mb-6 shadow-sm">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
              tab === id ? "bg-brand-pink text-white" : "text-ink-muted hover:text-brand-pink"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {tab === "medicos" ? <ContactosMedicos embedded /> : <ContactosEmergencia embedded />}
    </div>
  );
}
