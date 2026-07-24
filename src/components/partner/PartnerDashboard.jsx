import { useEffect, useState } from "react";
import { fetchPartnerData, sendRsvp } from "../../data/partner";
import { citaInfoPorTipo, citaInfoPorDefecto } from "../../data/partnerCitaInfo";
import { iconoSintoma, consejoPartnerSintoma } from "../../data/sintomas";
import { logout } from "../../data/auth";

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
      </div>
    </div>
  );
}

export default function PartnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchPartnerData().then((result) => {
      setLoading(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setData(result);
    });
  };

  useEffect(load, []);

  const handleRsvp = async (citaId, respuesta) => {
    setData((prev) => ({
      ...prev,
      citas: prev.citas.map((c) => (c.id === citaId ? { ...c, partner_rsvp: respuesta } : c)),
    }));
    await sendRsvp(citaId, respuesta);
  };

  if (loading) return null;

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="flex items-center justify-between px-6 h-14 border-b border-rose-100 bg-white">
        <div className="flex items-center gap-2">
          <span className="text-lg">👥</span>
          <span className="font-semibold text-gray-900 text-sm">
            Acompañando a {data.motherNombre || "tu pareja"}
          </span>
        </div>
        <button onClick={() => logout()} className="text-xs text-gray-400 hover:text-rose-500">
          Cerrar sesión
        </button>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Próximas citas
        </p>
        {data.citas.length === 0 ? (
          <p className="text-sm text-gray-400 mb-6">No hay citas compartidas por ahora.</p>
        ) : (
          <div className="space-y-3 mb-6">
            {data.citas.map((cita) => (
              <CitaCard key={cita.id} cita={cita} onRsvp={handleRsvp} />
            ))}
          </div>
        )}

        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Síntomas recientes
        </p>
        {data.sintomas.length === 0 ? (
          <p className="text-sm text-gray-400 mb-6">Todavía no compartió síntomas.</p>
        ) : (
          <div className="space-y-3 mb-6">
            {data.sintomas.map((registro) => (
              <div
                key={registro.fecha}
                className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm"
              >
                <p className="text-xs font-medium text-gray-500 capitalize mb-2">
                  {formatFecha(registro.fecha)}
                </p>
                <ul className="space-y-2">
                  {registro.sintomas.map((label) => (
                    <li key={label} className="text-sm text-gray-700">
                      <span className="mr-1.5">{iconoSintoma(label)}</span>
                      {label}
                      {consejoPartnerSintoma(label) && (
                        <span className="block text-xs text-gray-400 mt-0.5 ml-6">
                          💡 {consejoPartnerSintoma(label)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Notas para vos
        </p>
        {data.notas.length === 0 ? (
          <p className="text-sm text-gray-400">Todavía no te mandó ninguna nota.</p>
        ) : (
          <div className="space-y-2">
            {data.notas.map((nota) => (
              <div
                key={nota.id}
                className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3"
              >
                <p className="text-sm text-gray-800">{nota.texto}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(nota.created_at).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
