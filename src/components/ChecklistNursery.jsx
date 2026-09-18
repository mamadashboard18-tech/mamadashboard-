import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import Header from "./Header";
import BackButton from "./BackButton";
import {
  checklistRecomendado,
  loadChecklist,
  saveChecklist,
} from "../data/checklistNursery";

const checkboxClass = "w-5 h-5 rounded border-[var(--border-soft)] accent-[var(--brand-pink)] cursor-pointer";

export default function ChecklistNursery({ onBack }) {
  const [marcados, setMarcados] = useState([]);
  const [propios, setPropios] = useState([]);
  const [nuevoItem, setNuevoItem] = useState("");

  useEffect(() => {
    const data = loadChecklist();
    setMarcados(data.marcados);
    setPropios(data.propios);
  }, []);

  useEffect(() => {
    saveChecklist({ marcados, propios });
  }, [marcados, propios]);

  const toggle = (item) => {
    setMarcados((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const agregarPropio = () => {
    const texto = nuevoItem.trim();
    if (!texto) return;
    setPropios((prev) => [...prev, { id: Date.now().toString(), texto }]);
    setNuevoItem("");
  };

  const eliminarPropio = (id) => {
    setPropios((prev) => prev.filter((p) => p.id !== id));
    setMarcados((prev) => prev.filter((x) => x !== id));
  };

  const totalItems = useMemo(
    () => checklistRecomendado.reduce((acc, c) => acc + c.items.length, 0) + propios.length,
    [propios]
  );
  const totalMarcados = marcados.length;
  const progreso = totalItems === 0 ? 0 : Math.round((totalMarcados / totalItems) * 100);

  return (
    <div>
      <BackButton onBack={onBack} label="Volver a Mi Perfil" className="mb-4" />

      <Header
        title="Checklist de nursery"
        subtitle="Preparando el cuarto del bebé"
      />

      <div className="bg-white rounded-[20px] border border-[var(--border-soft)] p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-ink">
            {totalMarcados} de {totalItems} listo
          </p>
          <span className="text-sm font-semibold text-brand-pink">{progreso}%</span>
        </div>
        <div className="w-full h-2 bg-brand-pink-light/50 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progreso}%`, background: "var(--gradient-hero)" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {checklistRecomendado.map((cat) => (
          <div key={cat.categoria} className="bg-white rounded-[20px] border border-[var(--border-soft)] p-5 shadow-sm">
            <p className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-3">
              {cat.categoria}
            </p>
            <ul className="space-y-2">
              {cat.items.map((item) => {
                const checked = marcados.includes(item);
                return (
                  <li key={item}>
                    <label className="flex items-center gap-2 w-full text-left text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(item)}
                        className={checkboxClass}
                      />
                      <span className={checked ? "text-ink-muted/60 line-through" : "text-ink"}>
                        {item}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="bg-white rounded-[20px] border border-[var(--border-soft)] p-5 shadow-sm sm:col-span-2">
          <p className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-3">
            Tus propios ítems
          </p>

          {propios.length > 0 && (
            <ul className="space-y-2 mb-4">
              {propios.map((p) => {
                const checked = marcados.includes(p.id);
                return (
                  <li key={p.id} className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-left text-sm flex-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(p.id)}
                        className={checkboxClass}
                      />
                      <span className={checked ? "text-ink-muted/60 line-through" : "text-ink"}>
                        {p.texto}
                      </span>
                    </label>
                    <button
                      onClick={() => eliminarPropio(p.id)}
                      aria-label="Eliminar"
                      title="Eliminar"
                      className="text-ink-muted/60 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={nuevoItem}
              onChange={(e) => setNuevoItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && agregarPropio()}
              placeholder="Ej: humidificador, luz de noche..."
              className="flex-1 border border-[var(--border-soft)] rounded-xl p-2 text-sm text-ink bg-white focus:outline-none focus:border-brand-pink transition-colors"
            />
            <button
              onClick={agregarPropio}
              className="text-white text-sm font-medium px-4 py-2 rounded-full hover:brightness-105 transition-[filter] whitespace-nowrap"
              style={{ background: "var(--gradient-hero)" }}
            >
              + Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
