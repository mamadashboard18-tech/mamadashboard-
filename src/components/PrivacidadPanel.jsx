import { useEffect, useState } from "react";
import Header from "./Header";
import BackButton from "./BackButton";
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
      <BackButton onBack={onBack} label="Volver" className="mb-4" />

      <Header
        title="🔒 Privacidad"
        subtitle="Tus datos, bajo tu control"
      />

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

      <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Google Calendar
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Conectá tu Google Calendar para ver cuándo estás ocupada y sincronizar tus citas
          automáticamente.
        </p>

        {!googleLoading && (
          <div className="flex items-center gap-3 text-sm">
            {googleConnected ? (
              <>
                <span className="text-gray-600">📅 Google Calendar conectado</span>
                <button
                  onClick={handleDesconectar}
                  className="text-gray-400 hover:text-red-500 hover:underline"
                >
                  Desconectar
                </button>
              </>
            ) : (
              <button
                onClick={handleConectar}
                className="bg-rose-500 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-rose-600 transition-colors"
              >
                📅 Conectar Google Calendar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
