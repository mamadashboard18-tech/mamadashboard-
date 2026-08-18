import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Stethoscope, ThumbsUp, ThumbsDown } from "lucide-react";
import { citaInfoPorTipo, citaInfoPorDefecto } from "../../data/partnerCitaInfo";
import { getMonthGrid, toISODate, weekdayLabels, monthLabels } from "../../data/citas";
import {
  getGoogleCalendarStatus,
  connectGoogleCalendar,
  disconnectGoogleCalendar,
  getGoogleCalendarEvents,
} from "../../data/googleCalendar";

const mesesCortos = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatFecha(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
}

function formatDiaCorto(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${mesesCortos[d.getMonth()]}`;
}

function formatRelativo(iso, todayISO) {
  const diff = Math.round((new Date(iso + "T00:00:00") - new Date(todayISO + "T00:00:00")) / 86400000);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Mañana";
  return `En ${diff} días`;
}

function RsvpButton({ active, activeClass, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-2 rounded-full border transition-colors cursor-pointer ${
        active ? `${activeClass} text-white border-transparent` : "bg-white border-partner-dashed-border text-partner-ink-secondary"
      }`}
    >
      <Icon className="w-[13px] h-[13px]" strokeWidth={1.9} />
      {children}
    </button>
  );
}

function CitaCard({ cita, diaCorto, relativo, onRsvp }) {
  const info = citaInfoPorTipo[cita.tipo] || citaInfoPorDefecto;
  return (
    <div className="flex gap-2.5 items-start">
      <div className="w-[52px] shrink-0 text-center pt-[18px]">
        <p className="text-[12.5px] font-bold text-partner-ink m-0">{diaCorto}</p>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-partner-violet my-1.5" />
        <p className="text-[11px] font-bold text-partner-violet m-0 leading-tight">{relativo}</p>
      </div>
      <div className="flex-1 min-w-0 bg-white/72 backdrop-blur-md rounded-[22px] shadow-[0_6px_26px_rgba(91,33,182,0.10)] p-[18px]">
        <div className="flex items-center gap-3 mb-3.5">
          <span className="w-[42px] h-[42px] rounded-full bg-partner-violet/14 flex items-center justify-center text-partner-violet shrink-0">
            <Stethoscope className="w-[19px] h-[19px]" strokeWidth={1.8} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-extrabold text-partner-violet truncate">{cita.tipo}</p>
            <p className="text-[12.5px] text-partner-ink-muted truncate mt-0.5">
              {cita.lugar || cita.medico || ""}
            </p>
          </div>
          {cita.hora && <p className="text-[13px] font-bold text-partner-ink whitespace-nowrap">{cita.hora}</p>}
        </div>

        <p className="text-[12.5px] text-partner-ink-faint mb-1">
          <span className="font-bold text-partner-ink-muted">Qué se va a realizar: </span>
          {info.descripcion}
        </p>
        <p className="text-[12.5px] text-partner-ink-muted font-bold mt-2 mb-1">Preguntas que podrías hacer:</p>
        <ul className="list-disc list-inside mb-3.5 space-y-0.5">
          {info.preguntasPartner.map((p) => (
            <li key={p} className="text-[12.5px] text-partner-ink-muted">
              {p}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 flex-wrap">
          <RsvpButton
            active={cita.partner_rsvp === "puede"}
            activeClass="bg-partner-gold"
            icon={ThumbsUp}
            onClick={() => onRsvp(cita.id, "puede")}
          >
            Puedo ir
          </RsvpButton>
          <RsvpButton
            active={cita.partner_rsvp === "no_puede"}
            activeClass="bg-partner-ink-muted"
            icon={ThumbsDown}
            onClick={() => onRsvp(cita.id, "no_puede")}
          >
            No puedo
          </RsvpButton>
          {!cita.partner_rsvp && (
            <span className="text-xs font-bold text-partner-violet-deep">Todavía no respondiste</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PartnerCitas({ data, onRsvp }) {
  const today = useMemo(() => new Date(), []);
  const todayISO = toISODate(today);
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(true);
  const [googleMsg, setGoogleMsg] = useState(null);
  const [googleEvents, setGoogleEvents] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleParam = params.get("google_calendar");
    if (googleParam) {
      setGoogleMsg(googleParam === "connected" ? "success" : "error");
      params.delete("google_calendar");
      const query = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (query ? `?${query}` : ""));
    }

    getGoogleCalendarStatus()
      .then((s) => setGoogleConnected(s.connected))
      .finally(() => setGoogleLoading(false));
  }, []);

  useEffect(() => {
    if (!googleConnected) {
      setGoogleEvents([]);
      return;
    }
    getGoogleCalendarEvents(selectedDate).then((r) => setGoogleEvents(r.events || []));
  }, [googleConnected, selectedDate]);

  const handleConectar = () => connectGoogleCalendar();

  const handleDesconectar = async () => {
    await disconnectGoogleCalendar();
    setGoogleConnected(false);
  };

  const grid = useMemo(() => getMonthGrid(cursor.year, cursor.month), [cursor]);

  const citasPorFecha = useMemo(() => {
    const map = {};
    data.citas.forEach((c) => {
      map[c.fecha] = map[c.fecha] || [];
      map[c.fecha].push(c);
    });
    return map;
  }, [data.citas]);

  const changeMonth = (delta) => {
    setCursor((prev) => {
      let month = prev.month + delta;
      let year = prev.year;
      if (month < 0) {
        month = 11;
        year -= 1;
      }
      if (month > 11) {
        month = 0;
        year += 1;
      }
      return { year, month };
    });
  };

  const citasDelDiaSeleccionado = citasPorFecha[selectedDate] || [];

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-[18px] flex-wrap">
        <span className="w-9 h-9 rounded-full bg-partner-violet/14 flex items-center justify-center text-partner-violet shrink-0">
          <CalendarDays className="w-4 h-4" strokeWidth={1.7} />
        </span>
        {!googleLoading &&
          (googleConnected ? (
            <>
              <span className="text-sm text-partner-ink-secondary">Tu Google Calendar está conectado</span>
              <button
                onClick={handleDesconectar}
                className="text-[13.5px] font-semibold text-partner-ink-muted hover:text-partner-violet-deep cursor-pointer"
              >
                Desconectar
              </button>
            </>
          ) : (
            <button
              onClick={handleConectar}
              className="text-sm font-semibold text-partner-violet hover:text-partner-violet-deep cursor-pointer text-left"
            >
              Conectar tu Google Calendar (para ver tus propios compromisos acá)
            </button>
          ))}
      </div>

      {googleMsg && (
        <div
          className={`mb-4 text-sm rounded-xl px-4 py-2 ${
            googleMsg === "success"
              ? "bg-partner-green-bg text-partner-green-text"
              : "bg-red-50 text-red-600 border border-red-100"
          }`}
        >
          {googleMsg === "success"
            ? "Google Calendar conectado."
            : "No se pudo conectar tu Google Calendar. Intentá de nuevo."}
        </div>
      )}

      <div className="bg-white/72 backdrop-blur-md rounded-[24px] border border-[var(--partner-violet-border)] shadow-[0_6px_26px_rgba(91,33,182,0.10)] p-5 max-w-[400px] mb-[26px]">
        <div className="flex items-center justify-between mb-3.5">
          <button
            onClick={() => changeMonth(-1)}
            className="text-partner-ink-faint hover:text-partner-violet p-1 cursor-pointer"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-[15px] h-[15px]" strokeWidth={2} />
          </button>
          <p className="text-sm font-bold text-partner-ink">
            {monthLabels[cursor.month]} {cursor.year}
          </p>
          <button
            onClick={() => changeMonth(1)}
            className="text-partner-ink-faint hover:text-partner-violet p-1 cursor-pointer"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-[15px] h-[15px]" strokeWidth={2} />
          </button>
        </div>

        <div className="grid grid-cols-7 text-center bg-partner-violet/[0.07] rounded-full py-2 mb-2.5">
          {weekdayLabels.map((d) => (
            <span key={d} className="text-[11px] font-extrabold text-partner-violet uppercase">
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {grid.map((date, i) => {
            if (!date) return <div key={i} />;
            const iso = toISODate(date);
            const hasCita = citasPorFecha[iso]?.length > 0;
            const isToday = iso === todayISO;
            const isSelected = iso === selectedDate;
            return (
              <div key={i} className="flex flex-col items-center">
                <button
                  onClick={() => setSelectedDate(iso)}
                  className={`w-8 h-8 rounded-full text-[13px] flex items-center justify-center cursor-pointer ${
                    hasCita || isToday ? "font-bold" : "font-medium"
                  } ${isToday ? "text-white" : hasCita ? "bg-partner-violet/14 text-partner-violet" : "text-partner-ink-secondary hover:bg-partner-violet/10"}`}
                  style={{
                    background: isToday ? "var(--partner-gradient)" : undefined,
                    boxShadow: isToday
                      ? "0 3px 10px rgba(91,33,182,0.35)"
                      : isSelected
                      ? "0 0 0 2px var(--partner-violet-deep)"
                      : undefined,
                  }}
                >
                  {date.getDate()}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-[12.5px] text-partner-ink-faint mt-3.5">Los días marcados tienen una cita compartida.</p>

        <div className="mt-4 pt-4 border-t border-partner-border">
          <p className="text-xs font-semibold text-partner-ink-muted mb-2 capitalize">{formatFecha(selectedDate)}</p>

          {citasDelDiaSeleccionado.length === 0 ? (
            <p className="text-xs text-partner-ink-faint">No hay citas compartidas ese día.</p>
          ) : (
            <ul className="space-y-1 mb-2">
              {citasDelDiaSeleccionado.map((c) => (
                <li key={c.id} className="text-xs text-partner-ink-secondary">
                  {c.hora && `${c.hora} · `}
                  {c.tipo}
                </li>
              ))}
            </ul>
          )}

          {googleConnected && (
            <div className="bg-partner-surface-tint rounded-xl p-3 mt-2">
              <p className="text-xs font-semibold text-partner-ink-muted mb-2">Tus propios compromisos ese día</p>
              {googleEvents.length === 0 ? (
                <p className="text-xs text-partner-ink-faint">No tenés nada agendado.</p>
              ) : (
                <ul className="space-y-1">
                  {googleEvents.map((ev) => (
                    <li key={ev.id} className="text-xs text-partner-ink-secondary">
                      {ev.allDay
                        ? "Todo el día"
                        : new Date(ev.start).toLocaleTimeString("es-AR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                      · {ev.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="text-[13px] font-bold tracking-wide text-partner-violet uppercase mb-3">Próximas citas</p>
      {data.citas.length === 0 ? (
        <p className="text-sm text-partner-ink-faint">No hay citas compartidas por ahora.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {data.citas.map((cita) => (
            <CitaCard
              key={cita.id}
              cita={cita}
              diaCorto={formatDiaCorto(cita.fecha)}
              relativo={formatRelativo(cita.fecha, todayISO)}
              onRsvp={onRsvp}
            />
          ))}
        </div>
      )}
    </div>
  );
}
