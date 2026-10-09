import { useMemo } from "react";
import { BookOpen, Printer } from "lucide-react";
import { PantallaTop, Card, Vacio, BotonSecundario } from "./ui/Perfil";
import { loadRegistros, animoOpciones } from "../data/registroDiario";
import { iconoSintoma } from "../data/sintomas";

function emojiAnimo(valor) {
  return animoOpciones.find((o) => o.value === valor)?.emoji || null;
}

export default function HistorialEmbarazo({ onBack }) {
  const entradas = useMemo(() => {
    const registros = loadRegistros();
    return Object.values(registros).sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, []);

  const handleExportar = () => {
    window.print();
  };

  return (
    <div>
      <div className="no-print">
        <PantallaTop
          onBack={onBack}
          icon={BookOpen}
          title="Historial de mi embarazo"
          subtitle="Todo lo que fuiste registrando"
        />

        <BotonSecundario icon={Printer} onClick={handleExportar} className="mb-5 text-sm px-4 py-2.5">
          Exportar / Imprimir PDF
        </BotonSecundario>

        {entradas.length === 0 ? (
          <Card>
            <Vacio icon={BookOpen}>
              Todavía no registraste ningún día. Hacelo desde el botón + en Inicio.
            </Vacio>
          </Card>
        ) : (
          <ul className="flex flex-col gap-3">
            {entradas.map((r) => (
              <li key={r.fecha}>
                <Card className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="font-heading text-[15px] font-extrabold text-ink">{formatFecha(r.fecha)}</p>
                    {emojiAnimo(r.animo) && (
                      <span className="w-9 h-9 rounded-full bg-brand-pink-light/60 flex items-center justify-center text-lg">
                        {emojiAnimo(r.animo)}
                      </span>
                    )}
                  </div>
                  {r.sintomas?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {r.sintomas.map((s) => (
                        <span
                          key={s}
                          className="text-xs font-medium bg-[rgba(155,93,229,0.1)] text-brand-purple px-2.5 py-1 rounded-full"
                        >
                          {iconoSintoma(s)} {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {r.nota && <p className="text-sm text-ink-muted leading-relaxed">{r.nota}</p>}
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>

      <HistorialPreview entradas={entradas} />
    </div>
  );
}

function formatFecha(iso) {
  const d = new Date(iso + "T00:00:00");
  const texto = d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function HistorialPreview({ entradas }) {
  return (
    <div className="print-only text-gray-900 text-sm leading-relaxed">
      <h1 className="text-2xl font-semibold mb-1">Historial de embarazo</h1>
      <p className="text-gray-500 mb-6">
        Exportado el {new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <h2 className="font-semibold mt-4 mb-1">Registro diario</h2>
      {entradas.length === 0 ? (
        <p>—</p>
      ) : (
        <ul>
          {entradas.map((r) => (
            <li key={r.fecha} className="mb-2">
              <strong>{r.fecha}</strong>
              {r.sintomas?.length > 0 ? ` — ${r.sintomas.join(", ")}` : ""}
              {r.nota ? ` (${r.nota})` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
