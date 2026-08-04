import { useEffect, useMemo, useState } from "react";
import { citaInfoPorTipo, citaInfoPorDefecto } from "../../data/partnerCitaInfo";
import { getMonthGrid, toISODate, weekdayLabels, monthLabels } from "../../data/citas";
import {
  getGoogleCalendarStatus,
  connectGoogleCalendar,
  disconnectGoogleCalendar,
  getGoogleCalendarEvents,
} from "../../data/googleCalendar";

function formatFecha(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
}

function CitaCard({ cita, onRsvp }) {
  const info = citaInfoPorTipo[cita.tipo] || citaInfoPorDefecto;
  return (
    <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm">
      <p className="text-sm font-semibold text-gray-900 capitalize">{formatFecha(cita.fecha)}</p>
      <p className="text-sm text-gray-700 mt-0.5">
        {cita.tipo}
        {cita.hora && ` · ${cita.hora}`}
        {cita.medico && ` · ${cita.medico}`}
        {cita.lugar && ` · ${cita.lugar}`}
      </p>

      <p className="text-xs text-gray-500 mt-3">
        <span className="font-medium text-gray-600">Qué se va a realizar: </span>
        {info.descripcion}
      </p>
      <p className="text-xs text-gray-500 mt-2 mb-3">
        <span className="font-medium text-gray-600">Preguntas que podrías hacer:</span>
      </p>
      <ul className="text-xs text-gray-500 list-disc list-inside mb-3 space-y-0.5">
        {info.preguntasPartner.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onRsvp(cita.id, "puede")}
          className={`text-sm font-medium px-3 py-1.5 rounded-xl border transition-colors ${
            cita.partner_rsvp === "puede"
              ? "bg-green-500 text-white border-green-500"
              : "border-rose-100 text-gray-600 hover:border-green-400"
          }`}
        >
          👍 Puedo ir
        </button>
        <button
          onClick={() => onRsvp(cita.id, "no_puede")}
          className={`text-sm font-medium px-3 py-1.5 rounded-xl border transition-colors ${
            cita.partner_rsvp === "no_puede"
              ? "bg-gray-500 text-white border-gray-500"
              : "border-rose-100 text-gray-600 hover:border-gray-400"
          }`}
        >
          👎 No puedo
        </button>
        {!cita.partner_rsvp && (
          <span className="text-xs text-amber-600 font-medium ml-1">Todavía no respondiste</span>
        )}
      </div>
    </div>
  );
}

export default function PartnerCitas({ data, onRsvp }) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState(toISODate(today));
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

  const todayISO = toISODate(today);
  const citasDelDiaSeleccionado = citasPorFecha[selectedDate] || [];

  return (
    <div>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Tu calendario</p>

      {googleMsg && (
        <div
          className={`mb-4 text-sm rounded-xl px-4 py-2 ${
            googleMsg === "success"
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-red-50 text-red-600 border border-red-100"
          }`}
        >
          {googleMsg === "success"
            ? "✓ Google Calendar conectado."
            : "No se pudo conectar tu Google Calendar. Intentá de nuevo."}
        </div>
      )}

      {!googleLoading && (
        <div className="flex items-center gap-3 mb-4 text-sm">
          {googleConnected ? (
            <>
              <span className="text-gray-600">📅 Tu Google Calendar está conectado</span>
              <button onClick={handleDesconectar} className="text-gray-400 hover:text-red-500 hover:underline">
                Desconectar
              </button>
            </>
          ) : (
            <button onClick={handleConectar} className="text-rose-500 hover:underline">
              📅 Conectar tu Google Calendar (para ver tus propios compromisos acá)
            </button>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm max-w-xl mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} className="text-gray-400 hover:text-rose-500 px-2">
            ←
          </button>
          <p className="text-sm font-medium text-gray-800">
            {monthLabels[cursor.month]} {cursor.year}
          </p>
          <button onClick={() => changeMonth(1)} className="text-gray-400 hover:text-rose-500 px-2">
            →
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
          {weekdayLabels.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.map((date, i) => {
            if (!date) return <div key={i} />;
            const iso = toISODate(date);
            const hasCita = citasPorFecha[iso]?.length > 0;
            const isToday = iso === todayISO;
            const isSelected = iso === selectedDate;
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(iso)}
                className={`relative aspect-square rounded-lg text-sm flex items-center justify-center transition-colors ${
                  isSelected
                    ? "bg-rose-500 text-white"
                    : isToday
                    ? "bg-rose-100 text-rose-600 font-semibold"
                    : "text-gray-700 hover:bg-rose-50"
                }`}
              >
                {date.getDate()}
                {hasCita && (
                  <span
                    className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-white" : "bg-rose-500"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-gray-600 mb-2 capitalize">{formatFecha(selectedDate)}</p>

          {citasDelDiaSeleccionado.length === 0 ? (
            <p className="text-xs text-gray-400">No hay citas compartidas ese día.</p>
          ) : (
            <ul className="space-y-1 mb-2">
              {citasDelDiaSeleccionado.map((c) => (
                <li key={c.id} className="text-xs text-gray-700">
                  {c.hora && `${c.hora} · `}
                  {c.tipo}
                </li>
              ))}
            </ul>
          )}

          {googleConnected && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mt-2">
              <p className="text-xs font-medium text-gray-600 mb-2">Tus propios compromisos ese día</p>
              {googleEvents.length === 0 ? (
                <p className="text-xs text-gray-400">No tenés nada agendado 🎉</p>
              ) : (
                <ul className="space-y-1">
                  {googleEvents.map((ev) => (
                    <li key={ev.id} className="text-xs text-gray-600">
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

      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Próximas citas</p>
      {data.citas.length === 0 ? (
        <p className="text-sm text-gray-400">No hay citas compartidas por ahora.</p>
      ) : (
        <div className="space-y-3">
          {data.citas.map((cita) => (
            <CitaCard key={cita.id} cita={cita} onRsvp={onRsvp} />
          ))}
        </div>
      )}
    </div>
  );
}
