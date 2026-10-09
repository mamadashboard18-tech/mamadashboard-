import { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import { PantallaTop, Card, Segmentado, Chip, CheckRow, ProgresoCard } from "./ui/Perfil";
import { paises, tramitesPorPais, loadDone, saveDone } from "../data/tramites";

const ETAPAS = [
  { value: "embarazo", label: "Embarazo" },
  { value: "postparto", label: "Postparto" },
];

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
      <PantallaTop
        onBack={onBack}
        icon={FolderOpen}
        title="Trámites"
        subtitle="Elegí tu país para ver la checklist correcta"
      />

      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {paises.map((p) => (
          <Chip key={p.id} activo={pais === p.id} onClick={() => setPais(p.id)}>
            {p.nombre}
          </Chip>
        ))}
      </div>

      <Segmentado opciones={ETAPAS} value={tab} onChange={setTab} className="mb-5" />

      <ProgresoCard hechos={items.filter((it) => done[it.id]).length} total={items.length} etiqueta="hechos" />

      {sinDatos && (
        <p className="text-sm text-ink-muted bg-brand-purple-light/50 rounded-[18px] px-4 py-3 mb-4 leading-relaxed">
          Estamos preparando esta checklist para {paisNombre}. Mientras tanto podés ver la de Argentina como referencia.
        </p>
      )}

      <Card className="py-3">
        <ul className="divide-y divide-[rgba(155,93,229,0.1)]">
          {items.map((it) => (
            <CheckRow key={it.id} checked={!!done[it.id]} onToggle={() => toggle(it.id)} detalle={it.desc}>
              <span className="font-bold">{it.titulo}</span>
            </CheckRow>
          ))}
        </ul>
      </Card>
    </div>
  );
}
