import { useEffect, useMemo, useState } from "react";
import {
  User,
  Flame,
  ChevronLeft,
  ChevronRight,
  Plus,
  Timer,
  Baby,
  NotebookPen,
  Headphones,
  Lightbulb,
  ShieldCheck,
  Stethoscope,
  ScanLine,
  Droplet,
  Backpack,
  Smile,
  Apple,
  MessageCircle,
  CalendarDays,
  Sprout,
} from "lucide-react";
import CircularProgress from "./CircularProgress";
import RegistroDiarioModal from "./RegistroDiarioModal";
import ContenidoDiarioModal from "./ContenidoDiarioModal";
import InicioPostparto from "./InicioPostparto";
import ContadorContracciones from "./ContadorContracciones";
import AmbientBlobs from "./AmbientBlobs";
import { getWeekData, totalWeeks } from "../data/seguimientoSemanal";
import { loadPerfil } from "../data/perfil";
import { loadCitas, toISODate as toISODateCita } from "../data/citas";
import { loadRegistros, calcularStreak } from "../data/registroDiario";
import { esSintomaDeAtencion } from "../data/sintomas";
import { loadBebe } from "../data/bebe";

const tipoCitaIconos = {
  "Control obstétrico": Stethoscope,
  "Ecografía": ScanLine,
  "Análisis de sangre": Droplet,
  "Curso de preparto": Backpack,
  "Odontología": Smile,
  "Nutrición": Apple,
  "Psicología perinatal": MessageCircle,
  "Otro": CalendarDays,
};

const weekdayLabels = ["L", "M", "X", "J", "V", "S", "D"];

const trimesterLabel = { 1: "1er trimestre", 2: "2do trimestre", 3: "3er trimestre" };

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatFechaLarga(iso) {
  const d = new Date(iso + "T00:00:00");
  return capitalizeFirst(d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }));
}

function formatFechaCorta(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "long" });
}

function mondayOf(date) {
  const day = date.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function weeksBetween(a, b) {
  const diffMs = mondayOf(a).getTime() - mondayOf(b).getTime();
  return Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
}

function getWeekDates(refDate) {
  const monday = mondayOf(refDate);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function InicioPanel({ nombre, onNavigate }) {
  const today = useMemo(() => new Date(), []);
  const todayISO = toISODateCita(today);

  const [view, setView] = useState("list");
  const [refDate, setRefDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const diasSemana = useMemo(() => getWeekDates(refDate), [refDate]);

  const [semanaActual, setSemanaActual] = useState(24);
  const [citas, setCitas] = useState([]);
  const [registros, setRegistros] = useState({});
  const [modalAbierto, setModalAbierto] = useState(false);
  const [contenidoModalAbierto, setContenidoModalAbierto] = useState(false);
  const [bebe, setBebe] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    loadPerfil().then((p) => setSemanaActual(p.semanaActual));
    setCitas(loadCitas());
    setRegistros(loadRegistros());
    setBebe(loadBebe());
  }, []);

  const semanaMostrada = useMemo(() => {
    const delta = weeksBetween(refDate, today);
    return Math.min(semanaActual, Math.max(1, semanaActual + delta));
  }, [refDate, today, semanaActual]);

  const data = useMemo(() => getWeekData(semanaMostrada), [semanaMostrada]);
  const porcentaje = Math.round((semanaMostrada / totalWeeks) * 100);

  const handleSliderChange = (nuevaSemana) => {
    const delta = Math.min(semanaActual, nuevaSemana) - semanaMostrada;
    setRefDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + delta * 7);
      return next;
    });
  };

  const proximaCita = useMemo(() => {
    return [...citas]
      .filter((c) => c.fecha >= todayISO)
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))[0];
  }, [citas, todayISO]);

  const streak = useMemo(() => calcularStreak(registros, todayISO), [registros, todayISO]);

  const sintomasAtencionHoy = useMemo(() => {
    const registroHoy = registros[todayISO];
    return (registroHoy?.sintomas || []).filter(esSintomaDeAtencion);
  }, [registros, todayISO]);

  const volverAHoy = () => {
    setRefDate(today);
    setSelectedDate(todayISO);
  };

  const cambiarSemana = (delta) => {
    setRefDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + delta * 7);
      if (weeksBetween(next, today) > 0) return prev;
      return next;
    });
  };

  const enSemanaActual = semanaMostrada >= semanaActual;

  const esHoy = selectedDate === todayISO;
  const esFuturo = selectedDate > todayISO;

  const citasDelDia = citas.filter((c) => c.fecha === selectedDate);
  const registroDelDia = registros[selectedDate] || null;

  const itemsRegistrados = useMemo(() => {
    const deCitas = citasDelDia.map((c) => ({
      id: `cita-${c.id}`,
      hora: c.hora || "",
      icon: tipoCitaIconos[c.tipo] || CalendarDays,
      title: c.tipo,
      onClick: () => onNavigate?.("citas"),
    }));
    const deRegistro = registroDelDia
      ? [
          {
            id: "registro-dia",
            hora: "",
            icon: NotebookPen,
            title: "Registro del día",
            onClick: () => setModalAbierto(true),
          },
        ]
      : [];
    return [...deCitas, ...deRegistro].sort((a, b) => a.hora.localeCompare(b.hora));
  }, [citasDelDia, registroDelDia, onNavigate]);

  const sugerencias = useMemo(() => {
    if (!esHoy) return [];
    return [
      {
        id: "sugerido-contenido",
        icon: Headphones,
        title: "Contenido diario",
        onClick: () => setContenidoModalAbierto(true),
        tint: "pink",
      },
    ];
  }, [esHoy]);

  if (bebe?.registrado) {
    return <InicioPostparto nombre={nombre} bebe={bebe} onNavigate={onNavigate} />;
  }

  if (view === "contracciones") {
    return <ContadorContracciones onBack={() => setView("list")} onNavigate={onNavigate} />;
  }

  return (
    <div className="relative">
      <AmbientBlobs />
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-[28px] font-bold text-ink">Hola, {nombre || "mamá"}</h2>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <span className="flex items-center gap-1 bg-brand-pink-light/60 text-brand-pink text-[15px] font-semibold px-3 py-1.5 rounded-full">
              <Flame className="w-3.5 h-3.5" strokeWidth={2.4} fill="currentColor" />
              {streak} {streak === 1 ? "día seguido" : "días seguidos"}
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

      <p className="text-lg font-semibold text-ink mb-3">
        {capitalizeFirst(diasSemana[0].toLocaleDateString("es-AR", { month: "long", year: "numeric" }))}
      </p>

      <div className="flex items-center gap-0.5 mb-6">
        <button
          onClick={() => cambiarSemana(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full text-[#c9c0d0] hover:text-brand-pink hover:bg-brand-purple-light/40 transition-colors cursor-pointer shrink-0"
          aria-label="Semana anterior"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2} />
        </button>
        <div className="grid grid-cols-7 gap-1 flex-1">
          {diasSemana.map((d, i) => {
            const iso = toISODateCita(d);
            const isToday = iso === todayISO;
            const isSelected = iso === selectedDate;
            const tieneAlgo = citas.some((c) => c.fecha === iso) || Boolean(registros[iso]);
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(iso)}
                className="flex flex-col items-center gap-0.5 py-3 px-0.5 rounded-2xl cursor-pointer w-full box-border"
                style={isSelected ? { background: "var(--gradient-hero)", boxShadow: "0 4px 12px rgba(216,109,214,0.35)" } : undefined}
              >
                <span
                  className={`text-[21px] leading-none ${
                    isSelected
                      ? "font-bold text-white"
                      : isToday
                      ? "font-bold text-brand-pink"
                      : "font-semibold text-ink"
                  }`}
                >
                  {d.getDate()}
                </span>
                <span
                  className={`text-[15px] uppercase tracking-wide ${
                    isSelected ? "font-bold text-white/85" : "font-semibold text-[#a89fb0]"
                  }`}
                >
                  {weekdayLabels[i]}
                </span>
                {tieneAlgo && (
                  <span
                    className="w-1 h-1 rounded-full mt-0.5"
                    style={{ background: isSelected ? "rgba(255,255,255,0.85)" : "var(--brand-pink)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => cambiarSemana(1)}
          disabled={enSemanaActual}
          className="w-10 h-10 flex items-center justify-center rounded-full text-[#c9c0d0] hover:text-brand-pink hover:bg-brand-purple-light/40 transition-colors cursor-pointer shrink-0 disabled:opacity-30 disabled:hover:text-[#c9c0d0] disabled:hover:bg-transparent disabled:cursor-not-allowed"
          aria-label="Semana siguiente"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      {/* Tarjeta de embarazo: lo más importante, justo debajo de los días */}
      <div
        className="relative overflow-hidden rounded-[28px] p-5 sm:p-6 mb-6"
        style={{ background: "var(--gradient-hero-card)", boxShadow: "0 16px 40px rgba(255,138,92,0.25)" }}
      >
        <div
          className="absolute -top-[70px] -right-[60px] w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)", filter: "blur(30px)" }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-[90px] -left-[60px] w-[260px] h-[260px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 70%)", filter: "blur(30px)" }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white text-[19px] font-bold">
              Semana {semanaMostrada} de {totalWeeks}
            </p>
            <span className="bg-white/28 text-white text-[15px] font-bold px-3 py-1 rounded-full">
              {trimesterLabel[data.trimester]}
            </span>
          </div>

          <div className="relative h-4 flex items-center">
            <input
              type="range"
              min={1}
              max={semanaActual}
              value={semanaMostrada}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="range-hero w-full block"
            />
            {!enSemanaActual && (
              <button
                onClick={volverAHoy}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/70 hover:bg-white/90 transition-colors cursor-pointer pointer-events-auto"
                aria-label="Volver a hoy"
                title="Volver a hoy"
              />
            )}
          </div>
          <div className="flex justify-between text-[15px] text-white/75 mt-1 mb-4">
            <span>S.1</span>
            <span>S.{Math.round(semanaActual / 2)}</span>
            <span>S.{semanaActual}</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <CircularProgress value={porcentaje} size={120} stroke={8}>
              <span className="font-heading text-[33px] font-bold leading-none">{porcentaje}%</span>
              <span className="text-[15px] uppercase tracking-wide opacity-85 mt-1">Semana {semanaMostrada}</span>
            </CircularProgress>

            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-[52px] h-[52px] rounded-full bg-white/24 flex items-center justify-center shrink-0">
                <Sprout className="w-6 h-6 text-white" strokeWidth={1.75} />
              </div>
              <div className="text-left min-w-0">
                <p className="text-white text-[17px] opacity-90 leading-tight">Tu bebé es del tamaño de</p>
                <p className="text-white text-[19px] font-bold leading-tight mt-0.5">{data.size.name}</p>
                <p className="text-white text-[17px] opacity-90 leading-tight mt-0.5">
                  {data.weight ? `≈ ${data.weight} g` : "—"}
                  {data.length ? ` · ≈ ${data.length} cm` : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 rounded-[18px] px-4 py-3">
            <p className="text-[15px] text-white uppercase tracking-wide opacity-85 mb-1">Hito de esta semana</p>
            <p className="text-[18px] text-white leading-relaxed">{data.milestone}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
        {/* Columna principal: agenda */}
        <div className="min-w-0">
          <p className="text-[21px] font-bold text-ink mb-3.5 capitalize">
            {esHoy ? "Hoy" : formatFechaLarga(selectedDate)}
          </p>

          {itemsRegistrados.length === 0 && sugerencias.length === 0 && (
            <p className="text-[17px] text-ink-muted bg-white border border-[var(--border-soft)] rounded-[20px] p-[18px] shadow-sm">
              {esFuturo ? "Todavía no tenés nada agendado este día." : "No registraste nada este día."}
            </p>
          )}

          {itemsRegistrados.length > 0 && (
            <ul>
              {itemsRegistrados.map((item, idx) => (
                <li key={item.id} className="flex gap-2.5 items-stretch mb-2.5">
                  <div className="w-2 shrink-0 flex flex-col items-center pt-[18px]">
                    <span className="w-2 h-2 rounded-full bg-brand-pink shrink-0" />
                    {idx < itemsRegistrados.length - 1 && (
                      <span className="w-px flex-1 bg-[var(--border-soft)] mt-1" />
                    )}
                  </div>
                  <button
                    onClick={item.onClick}
                    className="flex-1 min-w-0 bg-white border border-[var(--border-soft)] rounded-[20px] px-4 py-3.5 shadow-sm flex items-center gap-3 text-left hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <span className="w-[38px] h-[38px] rounded-full bg-brand-pink-light/60 flex items-center justify-center text-brand-pink shrink-0">
                      <item.icon className="w-[17px] h-[17px]" strokeWidth={1.6} />
                    </span>
                    <p className="flex-1 min-w-0 text-[18px] font-bold text-brand-pink truncate">{item.title}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {sugerencias.length > 0 && (
            <>
              <p className="text-[15px] font-bold text-brand-pink uppercase tracking-wide mt-4 mb-2.5">
                Sugerencias para hoy
              </p>
              <div className="flex flex-col gap-2.5">
                {sugerencias.map((item) => {
                  const isPink = item.tint !== "purple";
                  return (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className={`w-full text-left rounded-[20px] flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors ${
                        isPink ? "bg-brand-pink-light/50 hover:bg-brand-pink-light/80" : "bg-brand-purple-light/60 hover:bg-brand-purple-light"
                      }`}
                    >
                      <span
                        className={`w-[38px] h-[38px] rounded-full bg-white flex items-center justify-center shrink-0 ${
                          isPink ? "text-brand-pink" : "text-brand-purple"
                        }`}
                      >
                        <item.icon className="w-4 h-4" strokeWidth={1.6} />
                      </span>
                      <p className="flex-1 min-w-0 text-[18px] font-bold text-ink truncate">{item.title}</p>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${isPink ? "text-brand-pink" : "text-brand-purple"}`}
                        strokeWidth={2}
                      />
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Columna lateral: próxima cita y alertas */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#fdf9fb] rounded-2xl p-3.5">
            <p className="text-[15px] font-bold text-[#a89fb0] uppercase tracking-wide mb-3 px-1.5">
              Próxima cita
            </p>
            {proximaCita ? (
              <button
                onClick={() => onNavigate?.("citas")}
                className="w-full text-left flex items-center gap-3 hover:bg-white/70 rounded-xl transition-colors cursor-pointer p-1.5"
              >
                <span className="w-[38px] h-[38px] rounded-full bg-brand-purple-light/70 flex items-center justify-center text-ink-muted shrink-0">
                  {(() => {
                    const Icon = tipoCitaIconos[proximaCita.tipo] || CalendarDays;
                    return <Icon className="w-[17px] h-[17px]" strokeWidth={1.6} />;
                  })()}
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
      </div>

      {data.trimester === 3 && (
        <div className="bg-white border border-[var(--border-soft)] rounded-[20px] divide-y divide-[var(--border-soft)] mt-6 overflow-hidden shadow-sm">
          <button
            onClick={() => setView("contracciones")}
            className="w-full text-left py-3.5 px-4 hover:bg-[var(--bg)] transition-colors flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-brand-pink-light/60 flex items-center justify-center text-brand-pink shrink-0">
              <Timer className="w-[18px] h-[18px]" strokeWidth={1.6} />
            </div>
            <p className="text-[18px] font-semibold text-ink truncate">Contador de contracciones</p>
          </button>

          {!bebe?.registrado && (
            <button
              onClick={() => onNavigate?.("perfil")}
              className="w-full text-left py-3.5 px-4 hover:bg-[var(--bg)] transition-colors flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-brand-purple-light/60 flex items-center justify-center text-brand-purple shrink-0">
                <Baby className="w-[18px] h-[18px]" strokeWidth={1.6} />
              </div>
              <p className="text-[18px] font-semibold text-ink truncate">¿Ya nació tu bebé?</p>
            </button>
          )}
        </div>
      )}

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
          Sin alertas activas. Todo en orden esta semana.
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
          fecha={selectedDate}
          sintomasSemana={data.symptoms}
          onClose={() => setModalAbierto(false)}
          onSaved={() => {
            setRegistros(loadRegistros());
            setToast("¡Registrado! Gracias por contarnos cómo estás.");
            setTimeout(() => setToast(""), 2600);
          }}
        />
      )}

      {contenidoModalAbierto && (
        <ContenidoDiarioModal
          semana={semanaActual}
          sintomas={registros[todayISO]?.sintomas || []}
          onClose={() => setContenidoModalAbierto(false)}
        />
      )}

      {toast && (
        <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 bg-ink text-white text-base px-5 py-3 rounded-2xl shadow-lg z-40 w-[min(90vw,320px)] text-center">
          {toast}
        </div>
      )}
    </div>
  );
}
