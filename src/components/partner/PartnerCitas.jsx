import { citaInfoPorTipo, citaInfoPorDefecto } from "../../data/partnerCitaInfo";

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
  return (
    <div>
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
