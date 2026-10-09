import { useState } from "react";
import { Phone, ShieldAlert } from "lucide-react";
import { PantallaTop } from "./ui/Perfil";
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
      <PantallaTop
        onBack={onBack}
        icon={Phone}
        title="Contactos"
        subtitle="Tu equipo médico y tus personas de confianza, a un toque"
      />

      <div className="flex bg-white border border-[var(--border-soft)] rounded-full p-1 mb-5" style={{ boxShadow: "0 2px 16px rgba(155,93,229,0.08)" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-full transition-colors cursor-pointer ${
              tab === id ? "text-white" : "text-ink-muted hover:text-brand-pink"
            }`}
            style={tab === id ? { background: "var(--gradient-hero)" } : undefined}
          >
            <Icon className="w-4 h-4" strokeWidth={1.9} />
            {label}
          </button>
        ))}
      </div>

      {tab === "medicos" ? <ContactosMedicos embedded /> : <ContactosEmergencia embedded />}
    </div>
  );
}
