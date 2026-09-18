import { useEffect, useState } from "react";
import Header from "./Header";
import BackButton from "./BackButton";
import ToggleSwitch from "./ToggleSwitch";
import { emptyPreferencias, loadPreferencias, savePreferencias } from "../data/preferenciasContenido";

const TIPOS = [
  { id: "podcast", label: "Podcast" },
  { id: "meditacion", label: "Meditación" },
  { id: "nutricion", label: "Nutrición" },
  { id: "ejercicio", label: "Ejercicio" },
];

const IDIOMAS = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
];

const FRECUENCIAS = [
  { value: "diaria", label: "Diaria" },
  { value: "semanal", label: "Semanal" },
  { value: "ninguna", label: "Sin notificaciones" },
];

export default function PreferenciasContenido({ onBack }) {
  const [prefs, setPrefs] = useState(emptyPreferencias);

  useEffect(() => {
    setPrefs(loadPreferencias());
  }, []);

  const persist = (next) => {
    setPrefs(next);
    savePreferencias(next);
  };

  const toggleTipo = (id) => {
    persist({ ...prefs, tipos: { ...prefs.tipos, [id]: !prefs.tipos[id] } });
  };

  return (
    <div>
      <BackButton onBack={onBack} label="Volver a Mi Perfil" className="mb-4" />

      <Header
        title="Preferencias de contenido"
        subtitle="Tipos favoritos, idioma y notificaciones"
      />

      <div className="bg-white rounded-[20px] border border-[var(--border-soft)] p-5 shadow-sm mb-6">
        <p className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-3">
          Tipos de contenido favoritos
        </p>
        <div className="divide-y divide-[var(--border-soft)]">
          {TIPOS.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2.5">
              <p className="text-sm text-ink">{t.label}</p>
              <ToggleSwitch
                checked={prefs.tipos[t.id]}
                onChange={() => toggleTipo(t.id)}
                label={t.label}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-[var(--border-soft)] p-5 shadow-sm mb-6">
        <p className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-3">Idioma</p>
        <div className="flex gap-2">
          {IDIOMAS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => persist({ ...prefs, idioma: opt.value })}
              className={`flex-1 text-sm font-medium py-2 rounded-xl border transition-colors ${
                prefs.idioma === opt.value
                  ? "bg-brand-pink text-white border-brand-pink"
                  : "bg-white text-ink-muted border-[var(--border-soft)] hover:border-brand-pink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-[var(--border-soft)] p-5 shadow-sm">
        <p className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-3">
          Frecuencia de notificaciones
        </p>
        <div className="space-y-1">
          {FRECUENCIAS.map((f) => (
            <label key={f.value} className="flex items-center gap-3 w-full py-2 cursor-pointer">
              <input
                type="radio"
                name="frecuencia"
                checked={prefs.frecuencia === f.value}
                onChange={() => persist({ ...prefs, frecuencia: f.value })}
                className="w-4 h-4 accent-[var(--brand-pink)] cursor-pointer"
              />
              <span className="text-sm text-ink">{f.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
