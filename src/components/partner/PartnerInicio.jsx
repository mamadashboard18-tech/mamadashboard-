import { Activity, ChevronRight, Quote } from "lucide-react";
import CircularProgress from "../CircularProgress";
import { consejoPartnerSintoma } from "../../data/sintomas";
import { getWeekData, totalWeeks } from "../../data/seguimientoSemanal";
import { getBibliotecaPorCategoria, getRecomendacionesHoy, tipoIconoComponent, tipoLabel } from "../../data/multimedia";

const trimesterLabel = { 1: "1er trimestre", 2: "2do trimestre", 3: "3er trimestre" };

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatFecha(iso) {
  const d = new Date(iso + "T00:00:00");
  return capitalizeFirst(d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }));
}

function EmptyCard({ children }) {
  return (
    <div className="bg-white/45 backdrop-blur-sm rounded-[22px] border border-dashed border-partner-dashed-border p-6 text-center">
      <p className="text-sm text-partner-ink-faint">{children}</p>
    </div>
  );
}

export default function PartnerInicio({ data }) {
  const info = data.semanaActual ? getWeekData(data.semanaActual) : null;
  const porcentaje = data.semanaActual ? Math.round((data.semanaActual / totalWeeks) * 100) : 0;
  const contenidoRecomendado = getBibliotecaPorCategoria("pareja_acompanante").slice(0, 2);

  return (
    <div>
      {data.semanaActual && info && (
        <div
          className="rounded-[24px] p-6 mb-[22px]"
          style={{ background: "var(--partner-gradient)", boxShadow: "0 12px 28px rgba(91,33,182,0.28)" }}
        >
          <div className="flex items-center justify-between mb-[18px]">
            <p className="text-white text-[17px] font-bold">
              Semana {data.semanaActual} de {totalWeeks}
            </p>
            <span className="bg-white/28 text-white text-[13px] font-bold px-3 py-[5px] rounded-full">
              {trimesterLabel[info.trimester]}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <CircularProgress value={porcentaje} size={74} stroke={10}>
              <span className="font-heading text-[19px] font-extrabold leading-none">{porcentaje}%</span>
            </CircularProgress>
            <div className="min-w-0">
              <p className="text-white text-sm opacity-90">Tu bebé es del tamaño de</p>
              <p className="text-white text-lg font-bold mt-0.5">
                {info.size.emoji} {info.size.name}
              </p>
              <p className="text-white text-[13px] opacity-85 mt-1">
                {info.weight ? `≈ ${info.weight} g` : "—"}
                {info.length ? ` · ≈ ${info.length} cm` : ""}
              </p>
            </div>
          </div>

          <div className="bg-white/20 rounded-[18px] px-4 py-3.5">
            <p className="text-white text-xs uppercase tracking-wide opacity-85 mb-1">Hito de esta semana</p>
            <p className="text-white text-[15px] leading-relaxed">{info.milestone}</p>
          </div>
        </div>
      )}

      {contenidoRecomendado.length > 0 && (
        <>
          <p className="text-[13px] font-bold tracking-wide text-partner-violet uppercase mb-3">
            Contenido recomendado para vos según la semana
          </p>
          <div className="flex flex-col gap-2.5 mb-[26px]">
            {contenidoRecomendado.map((item, i) => {
              const Icon = tipoIconoComponent[item.tipo] || Activity;
              const card = (
                <div className="flex items-center gap-3 bg-white/72 backdrop-blur-md rounded-[18px] px-4 py-3.5 shadow-[0_6px_20px_rgba(91,33,182,0.08)]">
                  <span className="w-[38px] h-[38px] rounded-full bg-partner-violet/14 flex items-center justify-center text-partner-violet shrink-0">
                    <Icon className="w-[17px] h-[17px]" strokeWidth={1.8} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10.5px] font-extrabold tracking-wide uppercase text-partner-ink-faint">
                      {tipoLabel[item.tipo]}
                    </p>
                    <p className="text-sm font-bold text-partner-ink mt-0.5 line-clamp-2">{item.titulo}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-partner-dashed-border shrink-0" strokeWidth={2} />
                </div>
              );
              return item.link ? (
                <a key={i} href={item.link} target="_blank" rel="noreferrer" className="block">
                  {card}
                </a>
              ) : (
                <div key={i}>{card}</div>
              );
            })}
          </div>
        </>
      )}

      <p className="text-[13px] font-bold tracking-wide text-partner-violet uppercase mb-3">
        Síntomas recientes y cómo podés ayudar
      </p>
      {data.sintomas.length === 0 ? (
        <div className="mb-[22px]">
          <EmptyCard>Todavía no compartió síntomas.</EmptyCard>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-[22px]">
          {data.sintomas.map((registro) => {
            const recomendacion = data.semanaActual
              ? getRecomendacionesHoy(data.semanaActual, registro.sintomas).porSintomas[0]?.titulo
              : null;
            return (
              <div
                key={registro.fecha}
                className="bg-white/72 backdrop-blur-md rounded-[22px] p-5 shadow-[0_6px_26px_rgba(91,33,182,0.10)]"
              >
                <span className="inline-block bg-partner-violet/12 text-partner-violet text-[11px] font-extrabold uppercase tracking-wide px-3 py-[5px] rounded-full mb-4">
                  {formatFecha(registro.fecha)}
                </span>
                <div className="flex flex-col gap-4">
                  {registro.sintomas.map((label) => (
                    <div key={label}>
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="w-8 h-8 rounded-full bg-partner-violet/14 flex items-center justify-center text-partner-violet shrink-0">
                          <Activity className="w-[15px] h-[15px]" strokeWidth={1.8} />
                        </span>
                        <p className="text-[14.5px] font-bold text-partner-ink">{label}</p>
                      </div>
                      {consejoPartnerSintoma(label) && (
                        <div className="ml-[42px] bg-partner-surface-tint rounded-[14px] px-3.5 py-2.5">
                          <span className="text-[12.5px] font-bold text-partner-violet-deep">Cómo podés ayudar: </span>
                          <span className="text-[13px] text-partner-ink-secondary">
                            {consejoPartnerSintoma(label)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {recomendacion && (
                  <div className="mt-3.5 pt-3.5 border-t border-partner-violet/10 flex items-center gap-2">
                    <Activity className="w-[15px] h-[15px] text-partner-violet shrink-0" strokeWidth={1.8} />
                    <p className="flex-1 min-w-0 text-[12.5px] font-semibold text-partner-violet-deep">
                      Contenido recomendado: {recomendacion}
                    </p>
                    <ChevronRight className="w-[13px] h-[13px] text-partner-dashed-border shrink-0" strokeWidth={2} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[13px] font-bold tracking-wide text-partner-violet uppercase mb-3">Notas para vos</p>
      {data.notas.length === 0 ? (
        <EmptyCard>Todavía no te mandó ninguna nota.</EmptyCard>
      ) : (
        <div className="flex flex-col gap-2.5">
          {data.notas.map((nota) => (
            <div
              key={nota.id}
              className="flex items-start gap-3 rounded-[22px] px-[18px] py-4"
              style={{ background: "var(--partner-gradient-note)" }}
            >
              <Quote className="w-5 h-5 text-partner-violet shrink-0 mt-0.5" strokeWidth={1.8} />
              <div className="flex-1 min-w-0">
                <p className="text-[14.5px] italic text-[#3d3646] leading-relaxed">{nota.texto}</p>
                <p className="text-xs text-[#9186a0] mt-2">
                  {new Date(nota.created_at).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
