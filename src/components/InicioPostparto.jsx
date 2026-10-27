import { useEffect, useMemo, useState } from "react";
import useScrollMemory from "../lib/useScrollMemory";
import { Flame, NotebookPen, Lightbulb, ShieldCheck, User, Baby, Sprout, ChevronRight, Plus } from "lucide-react";
import AmbientBlobs from "./AmbientBlobs";
import RegistroDiarioModal from "./RegistroDiarioModal";
import { tipoIcono } from "../data/citasIconos";
import RecuperacionPostparto from "./RecuperacionPostparto";
import { diasConBebe } from "../data/bebe";
import { getSemanaPostpartoData, semanaPostpartoDesde, totalSemanasPostparto } from "../data/recuperacionPostparto";
import { loadCitas, toISODate } from "../data/citas";
import { loadRegistros, calcularStreak } from "../data/registroDiario";
import {
  catalogoSintomasPostparto,
  iconoSintomaPostparto,
  esSintomaDeAtencionPostparto,
} from "../data/sintomasPostparto";

const mesesCortos = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatFechaCorta(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${mesesCortos[d.getMonth()]}`;
}

export default function InicioPostparto({ nombre, bebe, onNavigate }) {
  const today = useMemo(() => new Date(), []);
  const todayISO = toISODate(today);

  const [citas, setCitas] = useState([]);
  const [registros, setRegistros] = useState({});
  const [modalAbierto, setModalAbierto] = useState(false);
  const [view, setView] = useState("list");
  useScrollMemory(view);

  useEffect(() => {
    setCitas(loadCitas());
    setRegistros(loadRegistros());
  }, []);

  const dias = diasConBebe(bebe.fechaNacimiento);
  const semana = semanaPostpartoDesde(bebe.fechaNacimiento);
  const dataSemana = getSemanaPostpartoData(semana);

  const proximaCita = useMemo(() => {
    return [...citas]
      .filter((c) => c.fecha >= todayISO)
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))[0];
  }, [citas, todayISO]);
  const CitaIcono = tipoIcono(proximaCita?.tipo);

  const streak = useMemo(() => calcularStreak(registros, todayISO), [registros, todayISO]);

  const registroHoy = registros[todayISO] || null;

  const sintomasAtencionHoy = useMemo(() => {
    return (registroHoy?.sintomas || []).filter(esSintomaDeAtencionPostparto);
  }, [registroHoy]);

  if (view === "recuperacion-postparto") {
    return <RecuperacionPostparto onBack={() => setView("list")} />;
  }

  return (
    <div className="relative">
      <AmbientBlobs />
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <h2 className="font-heading text-[28px] font-bold text-ink truncate">Hola, {nombre || "mamá"}</h2>
        <div className="flex items-center gap-2 shrink-0">
          {streak > 0 && (
            <span className="flex items-center gap-1 bg-brand-pink-light/60 text-brand-pink text-[15px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
              <Flame className="w-3.5 h-3.5" strokeWidth={2.4} fill="currentColor" />
              {streak} {streak === 1 ? "día" : "días"}
            </span>
          )}
          <button
            onClick={() => onNavigate?.("perfil")}
            className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-muted hover:bg-brand-pink-light/60 hover:text-brand-pink transition-colors cursor-pointer"
            aria-label="Mi perfil"
          >
            <User className="w-5 h-5" strokeWidth={1.7} />
          </button>
        </div>
      </div>
      <p className="text-[17px] text-ink-muted mb-5 flex items-center gap-2">
        Día {dias} con {bebe.nombre || "tu bebé"}
        <span className="bg-brand-purple-light/70 text-brand-purple text-[13px] font-bold px-2.5 py-0.5 rounded-full">
          Cuarto trimestre
        </span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4 mb-6">
        {/* Tarjeta del bebé: lo más importante, mismo lenguaje que la del embarazo */}
        <div
          className="relative overflow-hidden rounded-[28px] p-5 sm:p-6"
          style={{ background: "var(--gradient-hero-card)", boxShadow: "0 16px 40px rgba(255,138,92,0.25)" }}
        >
          <div
            className="absolute -top-[70px] -right-[60px] w-[300px] h-[300px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)", filter: "blur(30px)" }}
            aria-hidden="true"
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-4">
              <p className="text-white text-[17px] sm:text-[19px] font-bold truncate">
                {bebe.nombre || "Tu bebé"}
              </p>
              <span className="bg-white/28 text-white text-[13px] sm:text-[15px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                Semana {semana} postparto
              </span>
            </div>

            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-[96px] h-[96px] rounded-full bg-white/24 flex items-center justify-center mb-3">
                <Baby className="w-11 h-11 text-white" strokeWidth={1.5} />
              </div>
              <p className="text-white/85 text-[16px]">Ya pasaron</p>
              <p className="font-heading text-white text-[34px] font-extrabold leading-tight">
                {dias} {dias === 1 ? "día" : "días"} juntos
              </p>
            </div>

            {(bebe.peso || bebe.proximoControl) && (
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {bebe.peso && (
                  <div className="bg-white/20 rounded-[18px] px-3 py-2.5 text-center">
                    <p className="text-[13px] text-white/80 uppercase tracking-wide">Peso al nacer</p>
                    <p className="font-heading text-white text-[22px] font-extrabold">
                      {bebe.peso} <span className="text-[15px] font-semibold">g</span>
                    </p>
                  </div>
                )}
                {bebe.proximoControl && (
                  <div className="bg-white/20 rounded-[18px] px-3 py-2.5 text-center">
                    <p className="text-[13px] text-white/80 uppercase tracking-wide whitespace-nowrap">Próx. control</p>
                    <p className="font-heading text-white text-[22px] font-extrabold">
                      {formatFechaCorta(bebe.proximoControl)}
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => onNavigate?.("perfil")}
              className="w-full bg-white text-brand-pink text-[17px] font-bold px-5 py-3 rounded-full cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Ver ficha del bebé
            </button>
          </div>
        </div>

        {/* Recuperación de mamá */}
        <button
          onClick={() => setView("recuperacion-postparto")}
          className="text-left bg-white border border-[var(--border-soft)] rounded-[24px] p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="w-10 h-10 rounded-full bg-brand-pink-light/60 flex items-center justify-center text-brand-pink shrink-0">
              <Sprout className="w-[18px] h-[18px]" strokeWidth={1.7} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-brand-pink uppercase tracking-wide">Tu recuperación</p>
              <p className="font-heading text-[21px] font-extrabold text-ink leading-tight">
                Semana {semana} de {totalSemanasPostparto}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-brand-pink shrink-0" strokeWidth={2} />
          </div>
          <div className="h-2 rounded-full bg-brand-purple-light/70 overflow-hidden mb-3">
            <div
              className="h-full rounded-full"
              style={{ width: `${(semana / totalSemanasPostparto) * 100}%`, background: "var(--gradient-hero)" }}
            />
          </div>
          <p className="text-[16px] text-ink-muted leading-relaxed">{dataSemana.hito}</p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
        <div className="min-w-0">
          <p className="text-[21px] font-bold text-ink mb-3.5">¿Cómo estás hoy?</p>
          <button
            onClick={() => setModalAbierto(true)}
            className={`w-full text-left rounded-[20px] flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors ${
              registroHoy ? "bg-white border border-[var(--border-soft)] shadow-sm hover:shadow-md" : "bg-brand-pink-light/50 hover:bg-brand-pink-light/80"
            }`}
          >
            <span className="w-[38px] h-[38px] rounded-full bg-white flex items-center justify-center text-brand-pink shrink-0">
              <NotebookPen className="w-4 h-4" strokeWidth={1.6} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[18px] font-bold text-ink truncate">
                {registroHoy ? "Registro de hoy" : "Registrar mi día"}
              </p>
              <p className="text-[15px] text-ink-muted truncate">
                {registroHoy
                  ? registroHoy.nota?.slice(0, 60) || "Ánimo y síntomas registrados"
                  : "Ánimo, sueño, lactancia, cicatriz"}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0 text-brand-pink" strokeWidth={2} />
          </button>
        </div>

        <div className="bg-[#fdf9fb] rounded-2xl p-3.5">
          <p className="text-[15px] font-bold text-[#a89fb0] uppercase tracking-wide mb-3 px-1.5">Próxima cita</p>
          {proximaCita ? (
            <button
              onClick={() => onNavigate?.("citas")}
              className="w-full text-left flex items-center gap-3 hover:bg-white/70 rounded-xl transition-colors cursor-pointer p-1.5"
            >
              <span className="w-[38px] h-[38px] rounded-full bg-brand-purple-light/70 flex items-center justify-center text-ink-muted shrink-0">
                <CitaIcono className="w-[17px] h-[17px]" strokeWidth={1.6} />
              </span>
              <div className="min-w-0">
                <p className="text-[21px] font-bold text-ink truncate">
                  {formatFechaCorta(proximaCita.fecha)}
                  {proximaCita.hora && ` · ${proximaCita.hora}`}
                </p>
                <p className="text-[17px] text-ink-muted truncate mt-0.5">{proximaCita.tipo}</p>
              </div>
            </button>
          ) : (
            <button
              onClick={() => onNavigate?.("citas")}
              className="w-full text-left hover:bg-white/70 rounded-xl transition-colors cursor-pointer p-1.5"
            >
              <p className="text-lg text-ink">No tenés citas agendadas</p>
              <p className="text-[15px] text-brand-pink mt-1 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" strokeWidth={2.4} /> Agendar una cita
              </p>
            </button>
          )}
        </div>
      </div>

      {sintomasAtencionHoy.length > 0 ? (
        <div className="bg-brand-purple-light/40 rounded-2xl p-4 text-brand-magenta text-[17px] mt-6 mb-6 pr-16 lg:pr-4">
          <p className="font-medium mb-1 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 shrink-0" strokeWidth={2} />
            Vale la pena comentarlo con tu médico
          </p>
          <p>
            Hoy registraste: {sintomasAtencionHoy.join(", ")}. Esto no es un diagnóstico, es
            solo una sugerencia basada en lo que registraste vos misma.
          </p>
        </div>
      ) : (
        <p className="flex items-center gap-1.5 text-sm text-ink-muted mt-6 mb-6 pr-16 lg:pr-0">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} />
          Sin alertas activas. Todo en orden hoy.
        </p>
      )}

      <button
        onClick={() => setModalAbierto(true)}
        className="no-print fixed bottom-24 right-5 lg:bottom-8 lg:right-8 w-14 h-14 flex items-center justify-center text-white rounded-full shadow-xl shadow-brand-pink/30 hover:scale-105 active:scale-100 transition-transform cursor-pointer z-20"
        style={{ background: "var(--gradient-hero)" }}
        aria-label="Registrar mi día"
        title="Registrar mi día"
      >
        <Plus className="w-6 h-6" strokeWidth={2.6} />
      </button>

      {modalAbierto && (
        <RegistroDiarioModal
          fecha={todayISO}
          sintomasSemana={dataSemana.sintomas}
          catalogo={catalogoSintomasPostparto}
          iconoSintoma={iconoSintomaPostparto}
          onClose={() => setModalAbierto(false)}
          onSaved={() => setRegistros(loadRegistros())}
        />
      )}
    </div>
  );
}
