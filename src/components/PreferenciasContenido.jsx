import { useEffect, useState } from "react";
import Header from "./Header";
import BackButton from "./BackButton";
import ToggleSwitch from "./ToggleSwitch";
import { emptyPreferencias, loadPreferencias, savePreferencias } from "../data/preferenciasContenido";

const NOTIFICACIONES = [
  {
    id: "citas",
    label: "Recordatorios de citas",
    desc: "Avisos antes de tus controles y turnos médicos",
  },
  {
    id: "resto",
    label: "Otras notificaciones",
    desc: "Novedades de tu semana, contenido nuevo y recordatorios del diario",
  },
];

export default function PreferenciasContenido({ onBack }) {
  const [prefs, setPrefs] = useState(emptyPreferencias);

  useEffect(() => {
    setPrefs(loadPreferencias());
  }, []);

  const toggle = (id) => {
    const next = {
      ...prefs,
      notificaciones: { ...prefs.notificaciones, [id]: !prefs.notificaciones[id] },
    };
    setPrefs(next);
    savePreferencias(next);
  };

  return (
    <div>
      <BackButton onBack={onBack} label="Volver a Ajustes" className="mb-4" />

      <Header title="Notificaciones" subtitle="Elegí qué avisos querés recibir" />

      <div className="bg-white rounded-[20px] border border-[var(--border-soft)] p-5 shadow-sm">
        <div className="divide-y divide-[var(--border-soft)]">
          {NOTIFICACIONES.map((n) => (
            <div key={n.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm text-ink">{n.label}</p>
                <p className="text-xs text-ink-muted mt-0.5">{n.desc}</p>
              </div>
              <ToggleSwitch
                checked={prefs.notificaciones[n.id]}
                onChange={() => toggle(n.id)}
                label={n.label}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
