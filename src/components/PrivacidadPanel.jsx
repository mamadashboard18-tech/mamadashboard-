import { useEffect, useState } from "react";
import { CalendarCheck, CalendarDays, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { PantallaTop, Card, SectionLabel, BotonPrimario } from "./ui/Perfil";
import {
  getGoogleCalendarStatus,
  connectGoogleCalendar,
  disconnectGoogleCalendar,
} from "../data/googleCalendar";

export default function PrivacidadPanel({ onBack }) {
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(true);
  const [googleMsg, setGoogleMsg] = useState(null);

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

  const handleConectar = () => {
    connectGoogleCalendar();
  };

  const handleDesconectar = async () => {
    await disconnectGoogleCalendar();
    setGoogleConnected(false);
  };

  return (
    <div>
      <PantallaTop
        onBack={onBack}
        backLabel="Volver a Ajustes"
        icon={Lock}
        title="Privacidad"
        subtitle="Tus datos, bajo tu control"
      />

      {googleMsg && (
        <div
          className={`mb-4 text-sm font-medium rounded-[18px] px-4 py-3 flex items-center gap-2 ${
            googleMsg === "success" ? "bg-brand-purple-light/70 text-brand-purple" : "bg-red-50 text-red-600"
          }`}
        >
          {googleMsg === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={2} />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
          )}
          {googleMsg === "success"
            ? "Google Calendar conectado."
            : "No se pudo conectar tu Google Calendar. Intentá de nuevo."}
        </div>
      )}

      <Card>
        <SectionLabel icon={CalendarDays}>Google Calendar</SectionLabel>
        <p className="text-[15px] text-ink-muted mb-4 leading-relaxed">
          Conectá tu Google Calendar para ver cuándo estás ocupada y sincronizar tus citas
          automáticamente.
        </p>

        {!googleLoading &&
          (googleConnected ? (
            <div className="flex items-center justify-between gap-3 flex-wrap bg-[var(--bg)] rounded-[18px] px-4 py-3">
              <span className="text-[15px] font-bold text-ink inline-flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-brand-purple-light/80 text-brand-purple flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" strokeWidth={1.8} />
                </span>
                Conectado
              </span>
              <button
                onClick={handleDesconectar}
                className="text-sm font-bold text-ink-muted hover:text-red-500 cursor-pointer"
              >
                Desconectar
              </button>
            </div>
          ) : (
            <BotonPrimario icon={CalendarDays} onClick={handleConectar}>
              Conectar Google Calendar
            </BotonPrimario>
          ))}
      </Card>
    </div>
  );
}
