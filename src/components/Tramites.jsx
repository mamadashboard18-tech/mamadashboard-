import { useEffect, useState } from "react";
import Header from "./Header";
import BackButton from "./BackButton";
import { paises, tramitesPorPais, loadDone, saveDone } from "../data/tramites";

export default function Tramites({ onBack }) {
  const [pais, setPais] = useState("AR");
  const [tab, setTab] = useState("embarazo");
  const [done, setDone] = useState({});

  useEffect(() => {
    setDone(loadDone());
  }, []);

  const toggle = (id) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    saveDone(next);
  };

  const sinDatos = !tramitesPorPais[pais];
  const items = (tramitesPorPais[pais] && tramitesPorPais[pais][tab]) || tramitesPorPais.AR[tab] || [];
  const paisNombre = paises.find((p) => p.id === pais)?.nombre || pais;

  return (
    <div>
      <BackButton onBack={onBack} label="Volver a Mi Perfil" className="mb-4" />

      <Header
        title="Trámites y documentos"
        subtitle="Elegí tu país para ver la checklist correcta"
      />

      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        {paises.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPais(p.id)}
            className={`flex-shrink-0 text-sm font-medium px-4 py-2 rounded-full border transition-colors whitespace-nowrap ${
              pais === p.id
                ? "bg-brand-pink text-white border-brand-pink"
                : "bg-white text-ink-muted border-[var(--border-soft)] hover:border-brand-pink"
            }`}
          >
            {p.nombre}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-5">
        {[
          { value: "embarazo", label: "Durante el embarazo" },
          { value: "postparto", label: "Postparto" },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTab(opt.value)}
            className={`flex-1 text-sm font-medium py-2 rounded-xl border transition-colors ${
              tab === opt.value
                ? "bg-brand-pink text-white border-brand-pink"
                : "bg-white text-ink-muted border-[var(--border-soft)] hover:border-brand-pink"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {sinDatos && (
        <p className="text-sm text-ink-muted/70 text-center py-4 mb-2">
          Estamos preparando esta checklist para {paisNombre}. Mientras tanto podés ver la de Argentina como referencia.
        </p>
      )}

      <div className="space-y-3">
        {items.map((it) => {
          const checked = !!done[it.id];
          return (
            <div key={it.id} className="bg-white rounded-[20px] border border-[var(--border-soft)] p-4 shadow-sm">
              <label className="flex items-start gap-3 w-full text-left cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(it.id)}
                  className="w-5 h-5 mt-0.5 rounded border-[var(--border-soft)] accent-[var(--brand-pink)] cursor-pointer flex-shrink-0"
                />
                <span>
                  <p className={`text-sm font-medium ${checked ? "text-ink-muted/60 line-through" : "text-ink"}`}>
                    {it.titulo}
                  </p>
                  <p className="text-xs text-ink-muted mt-0.5">{it.desc}</p>
                </span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
