import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const diasSemana = ["L", "M", "X", "J", "V", "S", "D"];
const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function CalendarioMensual({
  mes,
  fechasConEntrada,
  onCambiarMes,
  onSelect,
  onSelectMes,
  seleccionada,
}) {
  const celdas = useMemo(() => {
    const primero = new Date(mes.getFullYear(), mes.getMonth(), 1);
    const diaSemanaInicio = (primero.getDay() + 6) % 7;
    const diasEnMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
    const lista = [];
    for (let i = 0; i < diaSemanaInicio; i++) lista.push(null);
    for (let d = 1; d <= diasEnMes; d++) lista.push(new Date(mes.getFullYear(), mes.getMonth(), d));
    return lista;
  }, [mes]);

  return (
    <div
      className="bg-white border border-[var(--border-soft)] rounded-2xl p-3 w-60"
      style={{ boxShadow: "0 8px 24px rgba(155,93,229,0.18)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => onCambiarMes(-1)}
          className="text-ink-muted hover:text-brand-pink px-1 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.2} />
        </button>
        <button
          type="button"
          onClick={() => onSelectMes(new Date(mes.getFullYear(), mes.getMonth(), 1))}
          className="text-xs font-bold text-ink hover:text-brand-pink capitalize transition-colors cursor-pointer"
          title="Ver todas las entradas de este mes"
        >
          {meses[mes.getMonth()]} {mes.getFullYear()}
        </button>
        <button
          type="button"
          onClick={() => onCambiarMes(1)}
          className="text-ink-muted hover:text-brand-pink px-1 cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.2} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[9px] text-ink-muted uppercase mb-1">
        {diasSemana.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {celdas.map((d, i) => {
          if (!d) return <span key={`vacio-${i}`} />;
          const iso = toISO(d);
          const esSeleccionada = iso === seleccionada;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelect(iso)}
              className={`aspect-square rounded-md text-[11px] flex items-center justify-center relative transition-colors cursor-pointer ${
                esSeleccionada ? "text-white font-bold" : "text-ink hover:bg-brand-pink-light/50"
              }`}
              style={esSeleccionada ? { background: "var(--gradient-hero)" } : undefined}
            >
              {d.getDate()}
              {fechasConEntrada.has(iso) && !esSeleccionada && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-brand-pink" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
