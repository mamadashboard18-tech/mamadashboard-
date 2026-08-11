import { useEffect, useState } from "react";
import { User, Timer } from "lucide-react";
import BackButton from "./BackButton";
import { loadContracciones, guardarContraccion, limpiarContracciones } from "../data/contracciones";
import { regla511 } from "../data/estoyDeParto";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatMMSS(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${pad2(s)}`;
}

export default function ContadorContracciones({ onBack, onNavigate }) {
  const [contracciones, setContracciones] = useState([]);
  const [enCurso, setEnCurso] = useState(false);
  const [inicio, setInicio] = useState(null);
  const [ahora, setAhora] = useState(Date.now());

  useEffect(() => {
    setContracciones(loadContracciones());
  }, []);

  useEffect(() => {
    if (!enCurso) return;
    const interval = setInterval(() => setAhora(Date.now()), 250);
    return () => clearInterval(interval);
  }, [enCurso]);

  const iniciarContraccion = () => {
    const start = Date.now();
    setInicio(start);
    setAhora(start);
    setEnCurso(true);
  };

  const finalizarContraccion = () => {
    const fin = Date.now();
    const anterior = contracciones[0];
    const nueva = {
      id: fin.toString(),
      hora: new Date(inicio).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }),
      inicio,
      duracionSeg: Math.floor((fin - inicio) / 1000),
      intervaloSeg: anterior ? Math.round((inicio - anterior.inicio) / 1000) : null,
    };
    setContracciones(guardarContraccion(nueva));
    setEnCurso(false);
    setInicio(null);
  };

  const handleReiniciar = () => {
    setContracciones(limpiarContracciones());
  };

  const liveElapsed = enCurso ? formatMMSS(ahora - inicio) : "0:00";

  return (
    <div className="max-w-[640px]">
      <div className="flex items-center justify-end mb-1.5">
        <button
          onClick={() => onNavigate?.("perfil")}
          className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-muted hover:bg-brand-pink-light/60 hover:text-brand-pink transition-colors cursor-pointer"
          aria-label="Mi perfil"
        >
          <User className="w-5 h-5" strokeWidth={1.7} />
        </button>
      </div>

      <BackButton onBack={onBack} label="Volver a Inicio" className="mb-4" />

      <h2 className="font-heading text-[26px] font-extrabold text-ink leading-tight mb-2.5">
        ⏱️ Contador de contracciones
      </h2>
      <p className="text-[17px] text-ink-muted leading-relaxed mb-[22px]">Cronometrá cada contracción</p>

      <div className="bg-white/60 border border-[rgba(226,111,206,0.25)] rounded-[20px] px-5 py-[18px] mb-5">
        <p className="text-[17px] font-bold text-ink mb-2">{regla511.titulo}</p>
        <p className="text-base text-[#6b5f78] leading-relaxed">{regla511.desc}</p>
      </div>

      <div
        className="relative overflow-hidden rounded-[28px] px-6 py-8 mb-6 text-center"
        style={{ background: "var(--gradient-hero)", boxShadow: "0 16px 40px rgba(216,109,214,0.3)" }}
      >
        {enCurso ? (
          <>
            <p className="text-white/85 text-base mb-1.5">Contracción en curso</p>
            <p className="font-heading text-white text-[44px] font-extrabold tracking-wide mb-[22px]">
              {liveElapsed}
            </p>
          </>
        ) : (
          <p className="text-white text-[17px] leading-relaxed mb-[22px]">
            Tocá el botón apenas empiece la contracción.
          </p>
        )}
        <button
          onClick={enCurso ? finalizarContraccion : iniciarContraccion}
          className={`bg-white px-8 py-3.5 rounded-full text-[17px] font-bold cursor-pointer transition-transform hover:scale-[1.03] active:scale-[0.97] ${
            enCurso ? "text-[#c81e3a]" : "text-brand-pink"
          }`}
        >
          {enCurso ? "Finalizar contracción" : "Iniciar contracción"}
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-[#a89fb0] uppercase tracking-wide">Registro de hoy</p>
        {contracciones.length > 0 && (
          <button
            onClick={handleReiniciar}
            className="text-sm text-ink-muted hover:text-brand-pink transition-colors cursor-pointer"
          >
            Reiniciar registro
          </button>
        )}
      </div>

      {contracciones.length === 0 ? (
        <p className="text-base text-ink-muted bg-white border border-[var(--border-soft)] rounded-[20px] p-[18px] shadow-sm">
          Todavía no registraste ninguna contracción.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {contracciones.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-[var(--border-soft)] rounded-[20px] px-4 py-3.5 shadow-sm flex items-center gap-3"
            >
              <span className="w-[38px] h-[38px] rounded-full bg-brand-pink-light/60 flex items-center justify-center text-brand-pink shrink-0">
                <Timer className="w-[17px] h-[17px]" strokeWidth={1.6} />
              </span>
              <span className="flex-1 min-w-0">
                <p className="text-[17px] font-bold text-brand-pink">Duración {formatMMSS(c.duracionSeg * 1000)}</p>
                <p className="text-sm text-ink-muted mt-0.5">
                  {c.intervaloSeg != null
                    ? `Intervalo desde la anterior: ${formatMMSS(c.intervaloSeg * 1000)}`
                    : "Primera contracción registrada hoy"}
                </p>
              </span>
              <span className="text-sm text-ink-muted shrink-0">{c.hora}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
