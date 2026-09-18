import { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import Header from "./Header";
import BackButton from "./BackButton";
import { loadNombres, saveNombres } from "../data/listaNombres";

const CATEGORIA_OPTIONS = [
  { value: "nena", label: "Nena" },
  { value: "nene", label: "Nene" },
  { value: "neutro", label: "Neutro" },
];

export default function ListaNombres({ onBack }) {
  const [nombres, setNombres] = useState([]);
  const [categoria, setCategoria] = useState("nena");
  const [nuevoNombre, setNuevoNombre] = useState("");

  useEffect(() => {
    setNombres(loadNombres());
  }, []);

  const persist = (next) => {
    setNombres(next);
    saveNombres(next);
  };

  const agregarNombre = () => {
    const texto = nuevoNombre.trim();
    if (!texto) return;
    persist([...nombres, { id: Date.now().toString(), categoria, nombre: texto, fav: false }]);
    setNuevoNombre("");
  };

  const toggleFav = (id) => {
    persist(nombres.map((n) => (n.id === id ? { ...n, fav: !n.fav } : n)));
  };

  const eliminar = (id) => {
    persist(nombres.filter((n) => n.id !== id));
  };

  const filtrados = nombres.filter((n) => n.categoria === categoria);

  return (
    <div>
      <BackButton onBack={onBack} label="Volver a Mi Perfil" className="mb-4" />

      <Header
        title="Lista de nombres"
        subtitle="Tu shortlist, marcá tus favoritos"
      />

      <div className="bg-white rounded-[20px] border border-[var(--border-soft)] p-5 shadow-sm">
        <div className="flex gap-2 mb-4">
          {CATEGORIA_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setCategoria(opt.value)}
              className={`flex-1 text-sm font-medium py-2 rounded-xl border transition-colors ${
                categoria === opt.value
                  ? "bg-brand-pink text-white border-brand-pink"
                  : "bg-white text-ink-muted border-[var(--border-soft)] hover:border-brand-pink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {filtrados.length === 0 ? (
          <p className="text-sm text-ink-muted/70 text-center py-6">
            Todavía no agregaste nombres acá
          </p>
        ) : (
          <ul className="space-y-2 mb-4">
            {filtrados.map((n) => (
              <li
                key={n.id}
                className="flex items-center justify-between gap-2 bg-brand-pink-light/30 border border-[var(--border-soft)] rounded-xl px-3 py-2.5"
              >
                <span className="text-sm font-medium text-ink">{n.nombre}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleFav(n.id)}
                    aria-label="Marcar como favorito"
                    title="Favorito"
                    className={n.fav ? "text-brand-pink" : "text-ink-muted/60 hover:text-brand-pink"}
                  >
                    <Star className="w-4 h-4" fill={n.fav ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => eliminar(n.id)}
                    aria-label="Eliminar"
                    title="Eliminar"
                    className="text-ink-muted/60 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && agregarNombre()}
            placeholder="Nuevo nombre..."
            className="flex-1 border border-[var(--border-soft)] rounded-xl p-2 text-sm text-ink bg-white focus:outline-none focus:border-brand-pink transition-colors"
          />
          <button
            onClick={agregarNombre}
            className="text-white text-sm font-medium px-4 py-2 rounded-full hover:brightness-105 transition-[filter] whitespace-nowrap"
            style={{ background: "var(--gradient-hero)" }}
          >
            + Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
