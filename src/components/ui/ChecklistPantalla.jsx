import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { PantallaTop, Card, SectionLabel, ProgresoCard, CheckRow, AgregarInput } from "./Perfil";

// Pantalla común para las checklists de Mi Perfil (hospital, compras, nursery):
// progreso, categorías recomendadas e ítems propios.
export default function ChecklistPantalla({
  onBack,
  icon,
  title,
  subtitle,
  categorias,
  load,
  save,
  etiquetaProgreso = "listo",
  placeholder,
}) {
  const [marcados, setMarcados] = useState([]);
  const [propios, setPropios] = useState([]);
  const [nuevoItem, setNuevoItem] = useState("");
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    const data = load();
    setMarcados(data.marcados);
    setPropios(data.propios);
    setCargado(true);
  }, [load]);

  useEffect(() => {
    if (cargado) save({ marcados, propios });
  }, [cargado, marcados, propios, save]);

  const toggle = (item) => {
    setMarcados((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));
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
    () => categorias.reduce((acc, c) => acc + c.items.length, 0) + propios.length,
    [categorias, propios]
  );

  return (
    <div>
      <PantallaTop onBack={onBack} icon={icon} title={title} subtitle={subtitle} />

      <ProgresoCard hechos={marcados.length} total={totalItems} etiqueta={etiquetaProgreso} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categorias.map((cat) => {
          const hechos = cat.items.filter((i) => marcados.includes(i)).length;
          return (
            <Card key={cat.categoria}>
              <div className="flex items-center justify-between mb-1">
                <SectionLabel className="">{cat.categoria}</SectionLabel>
                <span className="text-xs font-bold text-brand-purple bg-[rgba(155,93,229,0.12)] rounded-full px-2.5 py-1">
                  {hechos}/{cat.items.length}
                </span>
              </div>
              <ul>
                {cat.items.map((item) => (
                  <CheckRow key={item} checked={marcados.includes(item)} onToggle={() => toggle(item)}>
                    {item}
                  </CheckRow>
                ))}
              </ul>
            </Card>
          );
        })}

        <Card className="sm:col-span-2">
          <SectionLabel icon={Sparkles}>Tus propios ítems</SectionLabel>
          {propios.length > 0 && (
            <ul className="mb-3">
              {propios.map((p) => (
                <CheckRow
                  key={p.id}
                  checked={marcados.includes(p.id)}
                  onToggle={() => toggle(p.id)}
                  onDelete={() => eliminarPropio(p.id)}
                >
                  {p.texto}
                </CheckRow>
              ))}
            </ul>
          )}
          <AgregarInput value={nuevoItem} onChange={setNuevoItem} onAdd={agregarPropio} placeholder={placeholder} />
        </Card>
      </div>
    </div>
  );
}
