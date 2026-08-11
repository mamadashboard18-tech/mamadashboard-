import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import Header from "./Header";
import BackButton from "./BackButton";
import {
  getSemanaPostpartoData,
  totalSemanasPostparto,
  loadRegistroPostparto,
  saveRegistroPostparto,
  getGuiaTipoParto,
  getGuiaSueloPelvico,
  getGuiaEjercicio,
  semanaPostpartoDesde,
} from "../data/recuperacionPostparto";
import { loadPlan } from "../data/planParto";
import { loadBebe } from "../data/bebe";

const tipoPartoLabel = {
  natural: "parto vaginal",
  epidural: "parto vaginal con epidural",
  cesarea: "cesárea",
  abierta: "tu tipo de parto",
};

const animoOpciones = [
  { value: 1, emoji: "😢" },
  { value: 2, emoji: "😕" },
  { value: 3, emoji: "😐" },
  { value: 4, emoji: "🙂" },
  { value: 5, emoji: "😄" },
];

export default function RecuperacionPostparto({ onBack }) {
  const [semana, setSemana] = useState(1);
  const [registro, setRegistro] = useState({});
  const [saved, setSaved] = useState(false);
  const [tipoParto, setTipoParto] = useState("abierta");

  const data = getSemanaPostpartoData(semana);

  useEffect(() => {
    const plan = loadPlan();
    setTipoParto(plan.tipoPartoDeseado || "abierta");

    const bebe = loadBebe();
    if (bebe.registrado) setSemana(semanaPostpartoDesde(bebe.fechaNacimiento));
  }, []);

  useEffect(() => {
    const all = loadRegistroPostparto();
    setRegistro(all[semana] || { sintomas: [], nota: "", animo: null });
    setSaved(false);
  }, [semana]);

  const toggleSintoma = (s) => {
    setRegistro((prev) => {
      const sintomas = prev.sintomas.includes(s)
        ? prev.sintomas.filter((x) => x !== s)
        : [...prev.sintomas, s];
      return { ...prev, sintomas };
    });
    setSaved(false);
  };

  const updateField = (field, value) => {
    setRegistro((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleGuardar = () => {
    const all = loadRegistroPostparto();
    all[semana] = registro;
    saveRegistroPostparto(all);
    setSaved(true);
  };

  return (
    <div>
      <BackButton onBack={onBack} label="Volver a Inicio" className="mb-4" />

      <Header
        title="🌱 Recuperación postparto"
        subtitle="Semana a semana, S.1 a S.12"
      />

      <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Semana {semana} de {totalSemanasPostparto} postparto
        </p>
        <input
          type="range"
          min={1}
          max={totalSemanasPostparto}
          value={semana}
          onChange={(e) => setSemana(Number(e.target.value))}
          className="w-full accent-rose-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>S.1</span>
          <span>S.6</span>
          <span>S.12</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 mb-6">
        <p className="text-sm text-gray-500 mb-2">Qué esperar esta semana</p>
        <p className="text-sm text-gray-800 leading-relaxed">{data.hito}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100">
          <p className="text-xs text-gray-500 mb-2">
            Recuperación de {tipoPartoLabel[tipoParto]}
          </p>
          <p className="text-sm text-gray-800 leading-relaxed">
            {getGuiaTipoParto(semana, tipoParto)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100">
          <p className="text-xs text-gray-500 mb-2">Suelo pélvico</p>
          <p className="text-sm text-gray-800 leading-relaxed">
            {getGuiaSueloPelvico(semana)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100">
          <p className="text-xs text-gray-500 mb-2">Retomar ejercicio</p>
          <p className="text-sm text-gray-800 leading-relaxed">
            {getGuiaEjercicio(semana, tipoParto)}
          </p>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        ¿Cómo te sentiste tú esta semana?
      </h3>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
        <div className="mb-5">
          <p className="text-xs text-gray-500 mb-2">Estado de ánimo</p>
          <div className="flex gap-2">
            {animoOpciones.map((o) => (
              <button
                key={o.value}
                onClick={() => updateField("animo", o.value)}
                className={`text-xl w-9 h-9 flex items-center justify-center rounded-full border transition-colors ${
                  registro.animo === o.value
                    ? "bg-rose-500 border-rose-500"
                    : "bg-rose-50 border-rose-100 hover:border-rose-300"
                }`}
              >
                {o.emoji}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-2">Síntomas esperados que tuviste</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {data.sintomas.map((s) => {
            const checked = registro.sintomas?.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSintoma(s)}
                className={`text-sm text-left rounded-xl px-3 py-2 border transition-colors ${
                  checked
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-rose-50 text-gray-700 border-rose-100 hover:border-rose-300"
                }`}
              >
                {checked ? "✓ " : ""}{s}
              </button>
            );
          })}
        </div>

        <label className="text-sm text-gray-500 block mb-1">Notas de la semana (opcional)</label>
        <textarea
          value={registro.nota || ""}
          onChange={(e) => updateField("nota", e.target.value)}
          placeholder="Ej: la cicatriz molesta menos que la semana pasada..."
          className="w-full border border-rose-100 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:border-rose-300 resize-none"
          rows={3}
        />

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleGuardar}
            aria-label="Guardar registro de la semana"
            title="Guardar registro de la semana"
            className="flex items-center justify-center w-10 h-10 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
          >
            <Save className="w-4 h-4" />
          </button>
          {saved && <span className="text-sm text-green-600">Guardado ✓</span>}
        </div>
      </div>
    </div>
  );
}
