import { useEffect, useState } from "react";
import { Heart, Star, Trash2 } from "lucide-react";
import { PantallaTop, Card, Segmentado, AgregarInput, IconAction, Vacio } from "./ui/Perfil";
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

  const filtrados = nombres
    .filter((n) => n.categoria === categoria)
    .sort((a, b) => Number(b.fav) - Number(a.fav));

  return (
    <div>
      <PantallaTop onBack={onBack} icon={Heart} title="Lista de nombres" subtitle="Tu shortlist, marcá tus favoritos" />

      <Card>
        <Segmentado opciones={CATEGORIA_OPTIONS} value={categoria} onChange={setCategoria} className="mb-4" />

        {filtrados.length === 0 ? (
          <Vacio icon={Heart}>Todavía no agregaste nombres acá. Sumá el primero abajo.</Vacio>
        ) : (
          <ul className="flex flex-col gap-2 mb-4">
            {filtrados.map((n) => (
              <li
                key={n.id}
                className={`flex items-center justify-between gap-2 rounded-[18px] pl-4 pr-2 py-2 border ${
                  n.fav
                    ? "bg-brand-pink-light/50 border-[rgba(226,111,206,0.3)]"
                    : "bg-[var(--bg)] border-[var(--border-soft)]"
                }`}
              >
                <span className="font-heading text-[17px] font-bold text-ink truncate">{n.nombre}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <IconAction
                    icon={Star}
                    label={n.fav ? "Quitar de favoritos" : "Marcar como favorito"}
                    onClick={() => toggleFav(n.id)}
                    tono={n.fav ? "rosa" : "neutro"}
                    filled={n.fav}
                  />
                  <IconAction icon={Trash2} label="Eliminar" onClick={() => eliminar(n.id)} danger />
                </div>
              </li>
            ))}
          </ul>
        )}

        <AgregarInput value={nuevoNombre} onChange={setNuevoNombre} onAdd={agregarNombre} placeholder="Nuevo nombre..." />
      </Card>
    </div>
  );
}
