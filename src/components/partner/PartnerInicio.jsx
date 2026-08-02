import { iconoSintoma, consejoPartnerSintoma } from "../../data/sintomas";
import { getWeekData, totalWeeks } from "../../data/seguimientoSemanal";

function formatFecha(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
}

export default function PartnerInicio({ data }) {
  const info = data.semanaActual ? getWeekData(data.semanaActual) : null;

  return (
    <div>
      {data.semanaActual && (
        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm mb-6">
          <p className="text-sm font-semibold text-gray-900">
            Va por la semana {data.semanaActual} de {totalWeeks}
          </p>
          {info?.size && (
            <p className="text-sm text-gray-700 mt-1">
              {info.size.emoji} Esta semana el bebé tiene aproximadamente el tamaño de {info.size.name}.
            </p>
          )}
          {info?.milestone && <p className="text-xs text-gray-500 mt-2">{info.milestone}</p>}
        </div>
      )}

      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Síntomas recientes y cómo podés ayudar
      </p>
      {data.sintomas.length === 0 ? (
        <p className="text-sm text-gray-400 mb-6">Todavía no compartió síntomas.</p>
      ) : (
        <div className="space-y-3 mb-6">
          {data.sintomas.map((registro) => (
            <div key={registro.fecha} className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-500 capitalize mb-2">{formatFecha(registro.fecha)}</p>
              <ul className="space-y-3">
                {registro.sintomas.map((label) => (
                  <li key={label} className="text-sm text-gray-700">
                    <span className="mr-1.5">{iconoSintoma(label)}</span>
                    {label}
                    {consejoPartnerSintoma(label) && (
                      <div className="mt-1 ml-6 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 text-xs text-gray-600">
                        <span className="font-medium text-rose-500">Cómo podés ayudar: </span>
                        {consejoPartnerSintoma(label)}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Notas para vos</p>
      {data.notas.length === 0 ? (
        <p className="text-sm text-gray-400">Todavía no te mandó ninguna nota.</p>
      ) : (
        <div className="space-y-2">
          {data.notas.map((nota) => (
            <div key={nota.id} className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
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
    </div>
  );
}
