import { X } from "lucide-react";
import { tipoIcono, getRecomendacionesHoy } from "../data/multimedia";

function ContentCard({ item, tint }) {
  const isLink = Boolean(item.link);
  const Wrapper = isLink ? "a" : "div";
  const wrapperProps = isLink ? { href: item.link, target: "_blank", rel: "noreferrer" } : {};
  const tintClass =
    tint === "purple"
      ? "bg-brand-purple-light/50 hover:bg-brand-purple-light"
      : "bg-brand-pink-light/40 hover:bg-brand-pink-light/70";

  return (
    <Wrapper
      {...wrapperProps}
      className={`flex items-start gap-3 rounded-2xl p-3.5 transition-colors ${tintClass} ${isLink ? "cursor-pointer" : ""}`}
    >
      <span className="text-xl shrink-0 leading-none mt-0.5" aria-hidden="true">
        {tipoIcono[item.tipo] || "📄"}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink leading-snug">{item.titulo}</p>
        {item.autor && <p className="text-xs text-ink-muted mt-1">{item.autor}</p>}
      </div>
    </Wrapper>
  );
}

export default function ContenidoDiarioModal({ semana, sintomas = [], onClose }) {
  const { semanal, porSintomas } = getRecomendacionesHoy(semana, sintomas);
  const sinContenido = semanal.length === 0 && porSintomas.length === 0;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-lg w-full max-w-md max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading text-lg font-bold text-ink">Contenido diario</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-ink-muted hover:bg-brand-pink-light/40 hover:text-brand-pink transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
        <p className="text-sm text-ink-muted mb-5">
          Elegido para tu semana {semana}
          {porSintomas.length > 0 ? " y lo que registraste últimamente" : ""}.
        </p>

        {semanal.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-brand-pink uppercase tracking-wide mb-2">Para tu semana</p>
            <div className="flex flex-col gap-2">
              {semanal.map((item, i) => (
                <ContentCard key={i} item={item} tint="pink" />
              ))}
            </div>
          </div>
        )}

        {porSintomas.length > 0 && (
          <div>
            <p className="text-xs font-bold text-brand-purple uppercase tracking-wide mb-2">
              Según lo que registraste
            </p>
            <div className="flex flex-col gap-2">
              {porSintomas.map((item, i) => (
                <ContentCard key={i} item={item} tint="purple" />
              ))}
            </div>
          </div>
        )}

        {sinContenido && (
          <p className="text-sm text-ink-muted">Todavía no tenemos contenido para esta semana.</p>
        )}
      </div>
    </div>
  );
}
