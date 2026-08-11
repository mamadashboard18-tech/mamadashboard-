import { useEffect, useMemo, useState } from "react";
import {
  User,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Plus,
  X,
  Phone,
  Check,
  Bell,
  Users,
  TestTube2,
  Stethoscope,
  ScanLine,
  Droplet,
  Backpack,
  Smile,
  Apple,
  MessageCircle,
  Baby,
} from "lucide-react";
import GuiaExamenes from "./GuiaExamenes";
import ToggleSwitch from "./ToggleSwitch";
import {
  loadCitas,
  saveCitas,
  tiposCita,
  toISODate,
  getMonthGrid,
  weekdayLabels,
  monthLabels,
} from "../data/citas";
import {
  preguntasSugeridas,
  loadPrimeraConsulta,
  savePrimeraConsulta,
} from "../data/primeraConsultaPostparto";
import {
  getGoogleCalendarStatus,
  connectGoogleCalendar,
  getGoogleCalendarEvents,
  getUpcomingGoogleCalendarEvents,
  createGoogleCalendarEvent,
} from "../data/googleCalendar";
import {
  syncCitaCompartida,
  deleteCitaCompartida,
  fetchCitasRsvp,
  getPartnerStatus,
} from "../data/partner";

const TIPO_PRIMERA_CONSULTA_POSTPARTO = "Primera consulta postparto";
const GOOGLE_PROMPT_KEY = "mama-dashboard:google-calendar-prompted";
const monthShortLabels = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const tipoIconos = {
  "Control obstétrico": Stethoscope,
  "Ecografía": ScanLine,
  "Análisis de sangre": Droplet,
  "Curso de preparto": Backpack,
  "Odontología": Smile,
  "Nutrición": Apple,
  "Psicología perinatal": MessageCircle,
  [TIPO_PRIMERA_CONSULTA_POSTPARTO]: Baby,
  Otro: CalendarDays,
};

function tipoIcono(tipo) {
  return tipoIconos[tipo] || CalendarDays;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatFechaLarga(iso) {
  const d = new Date(iso + "T00:00:00");
  return capitalizeFirst(d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }));
}

function formatFechaCorta(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${monthShortLabels[d.getMonth()]}`;
}

function etiquetaRelativa(iso, todayISO) {
  const diff = Math.round((new Date(iso + "T00:00:00") - new Date(todayISO + "T00:00:00")) / 86400000);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Mañana";
  if (diff > 1) return `En ${diff} días`;
  return null;
}

const emptyDraft = {
  tipo: tiposCita[0],
  hora: "",
  lugar: "",
  medico: "",
  preguntas: "",
  notas: "",
  compartirPartner: true,
  reminder: true,
};

export default function ControlCitas({ onNavigate }) {
  const today = useMemo(() => new Date(), []);
  const todayISO = toISODate(today);

  const [view, setView] = useState("list");
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [citas, setCitas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(todayISO);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draftIso, setDraftIso] = useState(todayISO);
  const [draft, setDraft] = useState(emptyDraft);

  const [marcadas, setMarcadas] = useState([]);
  const [propias, setPropias] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState("");

  const [hasPartner, setHasPartner] = useState(false);
  const [rsvpMap, setRsvpMap] = useState({});

  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleEvents, setGoogleEvents] = useState([]);
  const [googleUpcoming, setGoogleUpcoming] = useState([]);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    setCitas(loadCitas());
    const data = loadPrimeraConsulta();
    setMarcadas(data.marcadas);
    setPropias(data.propias);
    getPartnerStatus().then((s) => setHasPartner(s.hasPartner));

    getGoogleCalendarStatus().then((s) => {
      setGoogleConnected(s.connected);
      if (!s.connected && !localStorage.getItem(GOOGLE_PROMPT_KEY)) {
        localStorage.setItem(GOOGLE_PROMPT_KEY, "1");
        setShowGoogleModal(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!googleConnected) {
      setGoogleEvents([]);
      return;
    }
    getGoogleCalendarEvents(selectedDate).then((r) => setGoogleEvents(r.events || []));
  }, [googleConnected, selectedDate]);

  useEffect(() => {
    if (!googleConnected) {
      setGoogleUpcoming([]);
      return;
    }
    getUpcomingGoogleCalendarEvents().then((r) => setGoogleUpcoming(r.events || []));
  }, [googleConnected]);

  useEffect(() => {
    savePrimeraConsulta({ marcadas, propias });
  }, [marcadas, propias]);

  useEffect(() => {
    const ids = citas.filter((c) => c.compartirPartner).map((c) => c.id);
    if (ids.length === 0) {
      setRsvpMap({});
      return;
    }
    fetchCitasRsvp(ids).then(setRsvpMap);
  }, [citas]);

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 2400);
  };

  const togglePregunta = (item) => {
    setMarcadas((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));
  };

  const agregarPreguntaPropia = () => {
    const texto = nuevaPregunta.trim();
    if (!texto) return;
    setPropias((prev) => [...prev, { id: Date.now().toString(), texto }]);
    setNuevaPregunta("");
  };

  const eliminarPreguntaPropia = (id) => {
    setPropias((prev) => prev.filter((p) => p.id !== id));
    setMarcadas((prev) => prev.filter((x) => x !== id));
  };

  const grid = useMemo(() => getMonthGrid(cursor.year, cursor.month), [cursor]);

  const citasPorFecha = useMemo(() => {
    const map = {};
    citas.forEach((c) => {
      map[c.fecha] = map[c.fecha] || [];
      map[c.fecha].push(c);
    });
    return map;
  }, [citas]);

  const agenda = useMemo(() => {
    const appItems = citas
      .filter((c) => c.fecha >= todayISO)
      .map((c) => ({ id: `app-${c.id}`, source: "app", dateISO: c.fecha, timeStr: c.hora || "", cita: c }));
    const googleItems = googleUpcoming
      .map((ev) => {
        const start = new Date(ev.start);
        const dateISO = ev.allDay ? ev.start.slice(0, 10) : toISODate(start);
        const timeStr = ev.allDay
          ? ""
          : `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`;
        return { id: `google-${ev.id}`, source: "google", dateISO, timeStr, title: ev.title };
      })
      .filter((ev) => ev.dateISO >= todayISO);
    return [...appItems, ...googleItems].sort((a, b) =>
      (a.dateISO + (a.timeStr || "00:00")).localeCompare(b.dateISO + (b.timeStr || "00:00"))
    );
  }, [citas, googleUpcoming, todayISO]);

  const agendaDelDia = useMemo(
    () => agenda.filter((item) => item.dateISO === selectedDate),
    [agenda, selectedDate]
  );

  const proximas = useMemo(
    () => agenda.filter((item) => item.dateISO !== selectedDate).slice(0, 5),
    [agenda, selectedDate]
  );

  const abrirNuevo = (iso) => {
    setEditingId(null);
    setDraftIso(iso || selectedDate);
    setDraft(emptyDraft);
    setShowModal(true);
  };

  const abrirEditar = (cita) => {
    setEditingId(cita.id);
    setDraftIso(cita.fecha);
    setDraft({
      tipo: cita.tipo,
      hora: cita.hora || "",
      lugar: cita.lugar || "",
      medico: cita.medico || "",
      preguntas: cita.preguntas || "",
      notas: cita.notas || "",
      compartirPartner: cita.compartirPartner ?? true,
      reminder: cita.reminder ?? true,
    });
    setShowModal(true);
  };

  const cerrarModal = () => setShowModal(false);

  const updateDraft = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

  const handleDayClick = (date) => {
    if (!date) return;
    setSelectedDate(toISODate(date));
  };

  const handleGuardar = () => {
    if (!draft.hora || !draft.lugar.trim()) {
      showToast("Completá al menos la hora y el lugar.", "error");
      return;
    }

    const payload = { ...draft, fecha: draftIso };
    let next;
    let guardada;
    if (editingId) {
      guardada = { ...payload, id: editingId };
      next = citas.map((c) => (c.id === editingId ? guardada : c));
    } else {
      guardada = { ...payload, id: Date.now().toString() };
      next = [...citas, guardada];
    }
    setCitas(next);
    saveCitas(next);
    syncCitaCompartida(guardada);
    if (googleConnected) {
      createGoogleCalendarEvent(guardada).then((r) => {
        if (!r.created && (r.reason === "reauth_required" || r.reason === "not_connected")) {
          setGoogleConnected(false);
          setShowGoogleModal(true);
        } else if (r.created) {
          getUpcomingGoogleCalendarEvents().then((res) => setGoogleUpcoming(res.events || []));
        }
      });
    }
    setSelectedDate(draftIso);
    setShowModal(false);
    showToast("Cita guardada.");
  };

  const handleEliminar = () => {
    if (!editingId) return;
    const next = citas.filter((c) => c.id !== editingId);
    setCitas(next);
    saveCitas(next);
    deleteCitaCompartida(editingId);
    setShowModal(false);
  };

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

  if (view === "examenes") {
    return (
      <GuiaExamenes
        onBack={() => {
          setCitas(loadCitas());
          setView("list");
        }}
      />
    );
  }

  const renderCitaCard = (item) => {
    if (item.source === "google") {
      return (
        <div
          key={item.id}
          className="w-full flex items-center gap-3 bg-white border border-[var(--border-soft)] rounded-[18px] px-4 py-3.5 mb-2.5"
        >
          <span className="w-11 h-11 rounded-full bg-[rgba(59,130,246,0.12)] flex items-center justify-center text-blue-500 shrink-0">
            <CalendarDays className="w-[18px] h-[18px]" strokeWidth={1.6} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-blue-600 truncate">{item.title}</p>
            <p className="text-xs text-ink-muted mt-0.5">Google Calendar</p>
          </div>
          {item.timeStr && <span className="text-sm text-ink-muted shrink-0">{item.timeStr}</span>}
        </div>
      );
    }

    const Icon = tipoIcono(item.cita.tipo);
    const rsvp = item.cita.compartirPartner ? rsvpMap[item.cita.id] : null;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => abrirEditar(item.cita)}
        className="w-full text-left flex items-center gap-3 bg-[var(--bg)] rounded-[18px] px-4 py-3.5 mb-2.5 hover:brightness-95 transition-colors cursor-pointer"
      >
        <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-brand-pink shrink-0">
          <Icon className="w-[18px] h-[18px]" strokeWidth={1.6} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-bold text-brand-pink truncate">{item.cita.tipo}</p>
          {item.cita.lugar && <p className="text-sm text-ink-muted truncate mt-0.5">{item.cita.lugar}</p>}
          {rsvp === "puede" && (
            <span className="inline-block mt-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
              👍 Tu partner va a poder ir
            </span>
          )}
          {rsvp === "no_puede" && (
            <span className="inline-block mt-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
              👎 Tu partner no va a poder ir
            </span>
          )}
        </div>
        {item.cita.hora && <span className="text-sm text-ink-muted shrink-0">{item.cita.hora}</span>}
      </button>
    );
  };

  const esHoySeleccionado = selectedDate === todayISO;

  return (
    <div className="max-w-[920px]">
      <div className="flex items-center justify-end mb-1.5">
        <button
          onClick={() => onNavigate?.("perfil")}
          className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-muted hover:bg-brand-pink-light/60 hover:text-brand-pink transition-colors cursor-pointer"
          aria-label="Mi perfil"
        >
          <User className="w-5 h-5" strokeWidth={1.7} />
        </button>
      </div>

      <button
        onClick={() => onNavigate?.("inicio")}
        className="lg:hidden inline-flex items-center gap-1.5 text-base text-ink-muted hover:text-brand-pink transition-colors cursor-pointer mb-4"
      >
        <ChevronLeft className="w-[15px] h-[15px]" strokeWidth={2.2} />
        Volver a Inicio
      </button>

      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
        <h2 className="font-heading text-[28px] font-extrabold text-ink leading-tight flex items-center gap-2.5">
          <CalendarDays className="w-[26px] h-[26px] text-brand-pink shrink-0" strokeWidth={1.8} />
          Control de citas
        </h2>
        <button
          onClick={() => abrirNuevo(selectedDate)}
          className="inline-flex items-center gap-1.5 text-white text-sm font-bold px-4 py-2.5 rounded-full whitespace-nowrap cursor-pointer hover:brightness-105 transition shrink-0"
          style={{ background: "var(--gradient-hero)" }}
        >
          <Plus className="w-4 h-4" strokeWidth={2.6} />
          Agregar cita
        </button>
      </div>

      <p className="text-[17px] text-ink-muted leading-relaxed mb-5">
        Agenda, recordatorios y preguntas para el médico — todo en un calendario
      </p>

      <div className="lg:grid lg:grid-cols-[360px_1fr] lg:gap-8 lg:items-start">
        <div className="lg:sticky lg:top-6">
          <div className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-[22px] p-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="text-ink-muted hover:text-brand-pink px-2 py-1 cursor-pointer"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2.2} />
              </button>
              <p className="font-heading text-sm font-extrabold text-ink capitalize">
                {monthLabels[cursor.month]} de {cursor.year}
              </p>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="text-ink-muted hover:text-brand-pink px-2 py-1 cursor-pointer"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={2.2} />
              </button>
            </div>

            <div className="grid grid-cols-7 bg-white rounded-full px-1 py-1.5 mb-2">
              {weekdayLabels.map((d) => (
                <span key={d} className="text-center text-[9px] font-bold text-brand-purple uppercase">
                  {d[0]}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {grid.map((date, i) => {
                if (!date) return <div key={i} />;
                const iso = toISODate(date);
                const hasCita = citasPorFecha[iso]?.length > 0;
                const isToday = iso === todayISO;
                const isSelected = iso === selectedDate;

                let cls =
                  "relative w-10 h-10 mx-auto rounded-full text-[15px] flex items-center justify-center transition-colors cursor-pointer";
                let style;
                if (isSelected) {
                  cls += " text-white font-bold";
                  style = { background: "var(--gradient-hero)" };
                } else if (hasCita) {
                  cls += " bg-[rgba(255,111,159,0.16)] text-brand-pink font-semibold";
                  if (isToday) cls += " border-[1.5px] border-brand-pink";
                } else if (isToday) {
                  cls += " border-[1.5px] border-brand-pink text-brand-pink font-semibold";
                } else {
                  cls += " text-ink hover:bg-white";
                }

                return (
                  <button key={i} type="button" onClick={() => handleDayClick(date)} className={cls} style={style}>
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-ink-muted mt-3 px-1">Tocá un día para ver o agregar una cita.</p>
          </div>

          {googleConnected && (
            <div className="mt-4 bg-white border border-[var(--border-soft)] rounded-[16px] px-3.5 py-3">
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-2">
                Tu Google Calendar el {formatFechaCorta(selectedDate)}
              </p>
              {googleEvents.length === 0 ? (
                <p className="text-sm text-ink-muted">No estás ocupada ese día 🎉</p>
              ) : (
                <ul className="space-y-1">
                  {googleEvents.map((ev) => (
                    <li key={ev.id} className="text-sm text-ink-muted">
                      {ev.allDay
                        ? "Todo el día"
                        : new Date(ev.start).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}{" "}
                      · {ev.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 lg:mt-0">
          <p className="font-heading text-[18px] font-bold text-ink mb-3">
            {esHoySeleccionado ? "Hoy" : formatFechaLarga(selectedDate)}
          </p>

          {agendaDelDia.length === 0 ? (
            <p className="text-base text-ink-muted mb-6">
              No tenés nada agendado para {esHoySeleccionado ? "hoy" : "este día"}.{" "}
              <button
                type="button"
                onClick={() => abrirNuevo(selectedDate)}
                className="text-brand-pink font-bold hover:underline cursor-pointer"
              >
                Agregar cita
              </button>
            </p>
          ) : (
            <div className="mb-6">{agendaDelDia.map(renderCitaCard)}</div>
          )}

          <p className="font-heading text-[18px] font-bold text-ink mb-3">Próximas citas</p>
          {proximas.length === 0 ? (
            <p className="text-base text-ink-muted mb-6">No tenés más citas ni eventos agendados.</p>
          ) : (
            <ul className="mb-6">
              {proximas.map((item, idx) => (
                <li key={item.id} className="flex gap-3">
                  <div className="w-[52px] shrink-0 flex flex-col items-end pt-1 text-right">
                    <span className="text-sm font-bold text-ink">{formatFechaCorta(item.dateISO)}</span>
                    <span className="text-xs text-brand-pink font-semibold">{etiquetaRelativa(item.dateISO, todayISO)}</span>
                  </div>
                  <div className="flex flex-col items-center pt-1.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-brand-pink shrink-0" />
                    {idx < proximas.length - 1 && (
                      <span className="w-px flex-1 border-l border-dashed border-[rgba(226,111,206,0.4)] mt-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pb-3">{renderCitaCard(item)}</div>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={() => setView("examenes")}
            className="w-full text-left flex items-center gap-3.5 bg-[rgba(255,111,159,0.14)] rounded-[20px] px-5 py-4 hover:brightness-95 transition-colors cursor-pointer"
          >
            <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-brand-pink shrink-0">
              <TestTube2 className="w-5 h-5" strokeWidth={1.7} />
            </span>
            <div className="min-w-0">
              <p className="text-[17px] font-bold text-ink">Guía de exámenes por semana</p>
              <p className="text-sm text-[#6b5f78] mt-0.5">Qué estudios suelen pedirse en cada trimestre</p>
            </div>
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-[rgba(36,29,43,0.45)] backdrop-blur-sm flex items-end justify-center z-50"
          onClick={cerrarModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="sheet-up bg-white rounded-t-[28px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-[0_-8px_40px_rgba(0,0,0,0.18)] box-border"
            style={{ padding: "18px 22px calc(24px + env(safe-area-inset-bottom))" }}
          >
            <div className="w-10 h-1 rounded-full bg-[rgba(155,93,229,0.18)] mx-auto mb-4" />

            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <CalendarDays className="w-5 h-5" strokeWidth={1.8} />
                </span>
                <h3 className="font-heading text-[20px] font-extrabold text-ink truncate">
                  {editingId ? "Editar cita" : "Nueva cita"}
                </h3>
              </div>
              <button
                onClick={cerrarModal}
                aria-label="Cerrar"
                className="w-9 h-9 rounded-full bg-[rgba(155,93,229,0.15)] flex items-center justify-center text-ink-muted hover:bg-brand-pink-light/60 hover:text-brand-pink transition-colors cursor-pointer shrink-0"
              >
                <X className="w-[15px] h-[15px]" strokeWidth={2} />
              </button>
            </div>
            <p className="text-[15px] text-[#8a7f92] mb-5">{formatFechaLarga(draftIso)}</p>

            <p className="text-sm font-bold text-ink-muted uppercase tracking-wide mb-2">Tipo de cita</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {tiposCita.map((t) => {
                const selected = draft.tipo === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateDraft("tipo", t)}
                    className={`text-sm font-semibold px-4 py-2.5 rounded-full transition-colors cursor-pointer ${
                      selected
                        ? "text-white"
                        : "border-[1.5px] border-dashed border-[rgba(226,111,206,0.45)] bg-[rgba(255,111,159,0.06)] text-ink hover:bg-[rgba(255,111,159,0.12)]"
                    }`}
                    style={selected ? { background: "var(--gradient-hero)" } : undefined}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-ink-muted block mb-1 px-1">Hora</label>
                <input
                  type="time"
                  value={draft.hora}
                  onChange={(e) => updateDraft("hora", e.target.value)}
                  className="w-full rounded-full border border-[rgba(155,93,229,0.2)] bg-white px-4 py-3 text-[15px] text-ink focus:outline-none focus:border-brand-pink box-border"
                />
              </div>
              <div>
                <label className="text-xs text-ink-muted block mb-1 px-1">Lugar</label>
                <input
                  type="text"
                  value={draft.lugar}
                  onChange={(e) => updateDraft("lugar", e.target.value)}
                  placeholder="Ej: Sanatorio Mater"
                  className="w-full rounded-full border border-[rgba(155,93,229,0.2)] bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand-pink box-border"
                />
              </div>
            </div>

            <label className="text-xs text-ink-muted block mb-1 px-1">Médico / profesional (opcional)</label>
            <input
              type="text"
              value={draft.medico}
              onChange={(e) => updateDraft("medico", e.target.value)}
              placeholder="Ej: Dra. Pérez"
              className="w-full rounded-full border border-[rgba(155,93,229,0.2)] bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand-pink box-border mb-4"
            />

            {draft.tipo === TIPO_PRIMERA_CONSULTA_POSTPARTO ? (
              <div className="mb-4">
                <p className="text-sm font-bold text-ink-muted uppercase tracking-wide mb-2">
                  Preguntas sugeridas para tu primera consulta postparto
                </p>
                <ul className="space-y-2 mb-3">
                  {preguntasSugeridas.map((p) => {
                    const checked = marcadas.includes(p);
                    return (
                      <li key={p}>
                        <button
                          type="button"
                          onClick={() => togglePregunta(p)}
                          className="flex items-center gap-2.5 w-full text-left text-[15px] cursor-pointer"
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                              checked ? "text-white" : "border-[1.5px] border-[rgba(155,93,229,0.3)]"
                            }`}
                            style={checked ? { background: "var(--gradient-hero)" } : undefined}
                          >
                            {checked && <Check className="w-3 h-3" strokeWidth={3} />}
                          </span>
                          <span className={checked ? "text-ink-muted line-through" : "text-ink"}>{p}</span>
                        </button>
                      </li>
                    );
                  })}
                  {propias.map((p) => {
                    const checked = marcadas.includes(p.id);
                    return (
                      <li key={p.id} className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => togglePregunta(p.id)}
                          className="flex items-center gap-2.5 text-left text-[15px] flex-1 cursor-pointer"
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                              checked ? "text-white" : "border-[1.5px] border-[rgba(155,93,229,0.3)]"
                            }`}
                            style={checked ? { background: "var(--gradient-hero)" } : undefined}
                          >
                            {checked && <Check className="w-3 h-3" strokeWidth={3} />}
                          </span>
                          <span className={checked ? "text-ink-muted line-through" : "text-ink"}>{p.texto}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => eliminarPreguntaPropia(p.id)}
                          className="text-xs text-ink-muted hover:text-red-500 cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nuevaPregunta}
                    onChange={(e) => setNuevaPregunta(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && agregarPreguntaPropia()}
                    placeholder="Ej: ¿es normal esta molestia en...?"
                    className="flex-1 min-w-0 rounded-full border border-[rgba(155,93,229,0.2)] bg-[var(--bg)] px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-brand-purple box-border"
                  />
                  <button
                    type="button"
                    onClick={agregarPreguntaPropia}
                    className="shrink-0 text-white text-sm font-bold px-4 py-2.5 rounded-full cursor-pointer hover:brightness-105"
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    + Agregar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <label className="text-xs text-ink-muted block mb-1 px-1">Preguntas para el médico (opcional)</label>
                <textarea
                  value={draft.preguntas}
                  onChange={(e) => updateDraft("preguntas", e.target.value)}
                  placeholder="Ej: ¿es normal sentir...?"
                  className="w-full min-h-[90px] rounded-[16px] bg-[var(--bg)] p-3.5 text-[15px] text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand-purple border border-transparent focus:border-brand-purple resize-none box-border mb-4"
                  rows={3}
                />
              </>
            )}

            <label className="text-xs text-ink-muted block mb-1 px-1">Notas adicionales (opcional)</label>
            <textarea
              value={draft.notas}
              onChange={(e) => updateDraft("notas", e.target.value)}
              placeholder="Ej: llevar estudios anteriores"
              className="w-full min-h-[70px] rounded-[16px] bg-[var(--bg)] p-3.5 text-[15px] text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand-purple border border-transparent resize-none box-border mb-4"
              rows={2}
            />

            {hasPartner && (
              <div className="bg-[var(--bg)] rounded-[18px] px-4 py-3.5 flex items-center gap-3 mb-3">
                <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-brand-purple shrink-0">
                  <Users className="w-4 h-4" strokeWidth={1.8} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-ink">Compartir con mi partner</p>
                  <p className="text-xs text-[#8a7f92] mt-0.5">Va a poder confirmar si puede ir</p>
                </div>
                <ToggleSwitch
                  checked={draft.compartirPartner}
                  onChange={() => updateDraft("compartirPartner", !draft.compartirPartner)}
                  label="Compartir con mi partner"
                />
              </div>
            )}

            <div className="bg-[var(--bg)] rounded-[18px] px-4 py-3.5 flex items-center gap-3 mb-5">
              <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-brand-purple shrink-0">
                <Bell className="w-4 h-4" strokeWidth={1.8} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-ink">Recordatorio</p>
                <p className="text-xs text-[#8a7f92] mt-0.5">Te avisamos un día antes</p>
              </div>
              <ToggleSwitch
                checked={draft.reminder}
                onChange={() => updateDraft("reminder", !draft.reminder)}
                label="Recordatorio"
              />
            </div>

            <button
              type="button"
              onClick={handleGuardar}
              className="w-full text-white text-[17px] font-bold py-3.5 rounded-full cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: "var(--gradient-hero)" }}
            >
              Guardar cita
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleEliminar}
                className="w-full text-center text-sm text-ink-muted hover:text-red-500 mt-3 cursor-pointer"
              >
                Eliminar cita
              </button>
            )}
          </div>
        </div>
      )}

      {showGoogleModal && (
        <div
          className="fixed inset-0 bg-[rgba(36,29,43,0.45)] backdrop-blur-sm flex items-center justify-center px-4 z-[60]"
          onClick={() => setShowGoogleModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[28px] shadow-lg w-full max-w-sm p-7 text-center"
          >
            <span
              className="w-14 h-14 rounded-full flex items-center justify-center text-white mx-auto mb-4"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Phone className="w-6 h-6" strokeWidth={1.8} />
            </span>
            <h3 className="font-heading text-[19px] font-extrabold text-ink mb-2">Conectá tu calendario</h3>
            <p className="text-[15px] text-ink-muted mb-6 leading-relaxed">
              Iniciá sesión con Google para conectar con el calendario de tu teléfono y sincronizar tus citas automáticamente.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-sm text-ink-muted hover:text-brand-pink cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowGoogleModal(false);
                  connectGoogleCalendar();
                }}
                className="text-white text-sm font-bold px-5 py-2.5 rounded-full cursor-pointer hover:brightness-105 transition"
                style={{ background: "var(--gradient-hero)" }}
              >
                Permitir
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 text-white text-base px-5 py-3 rounded-2xl shadow-lg z-[70] w-[min(90vw,340px)] text-center ${
            toast.type === "error" ? "bg-[#c81e3a]" : "bg-ink"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}
