import { useEffect, useState } from "react";
import { Bell, CalendarClock, Sparkles } from "lucide-react";
import { PantallaTop, Card, ToggleRow } from "./ui/Perfil";
import ToggleSwitch from "./ToggleSwitch";
import { emptyPreferencias, loadPreferencias, savePreferencias } from "../data/preferenciasContenido";

const NOTIFICACIONES = [
  {
    id: "citas",
    icon: CalendarClock,
    label: "Recordatorios de citas",
    desc: "Avisos antes de tus controles y turnos médicos",
  },
  {
    id: "resto",
    icon: Sparkles,
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
      <PantallaTop
        onBack={onBack}
        backLabel="Volver a Ajustes"
        icon={Bell}
        title="Notificaciones"
        subtitle="Elegí qué avisos querés recibir"
      />

      <Card className="py-1">
        <div className="divide-y divide-[rgba(155,93,229,0.1)]">
          {NOTIFICACIONES.map((n) => (
            <ToggleRow key={n.id} icon={n.icon} titulo={n.label} detalle={n.desc}>
              <ToggleSwitch
                checked={prefs.notificaciones[n.id]}
                onChange={() => toggle(n.id)}
                label={n.label}
              />
            </ToggleRow>
          ))}
        </div>
      </Card>
    </div>
  );
}
