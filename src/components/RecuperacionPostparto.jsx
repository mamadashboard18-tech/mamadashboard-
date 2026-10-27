import { useEffect, useState } from "react";
import { Save, Check, Sprout, HeartPulse, Flower2, Footprints } from "lucide-react";
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

  const guias = [
    { icon: HeartPulse, titulo: `Recuperación de ${tipoPartoLabel[tipoParto]}`, texto: getGuiaTipoParto(semana, tipoParto) },
    { icon: Flower2, titulo: "Suelo pélvico", texto: getGuiaSueloPelvico(semana) },
    { icon: Footprints, titulo: "Retomar ejercicio", texto: getGuiaEjercicio(semana, tipoParto) },
  ];

  return (
    <div className="max-w-[640px]">
      <BackButton onBack={onBack} label="Volver a Inicio" className="mb-4" />

      <Header icon={Sprout} title="Recuperación postparto" subtitle="Semana a semana, de la S.1 a la S.12" />

      <div
        className="relative overflow-hidden rounded-[28px] p-5 sm:p-6 mb-6"
        style={{ background: "var(--gradient-hero)", boxShadow: "0 16px 40px rgba(216,109,214,0.3)" }}
      >
        <div
          className="absolute -top-[70px] -right-[60px] w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)", filter: "blur(30px)" }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <p className="text-white text-[19px] font-bold">
              Semana {semana} de {totalSemanasPostparto}
            </p>
            <span className="bg-white/28 text-white text-[13px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
              Postparto · {Math.round((semana / totalSemanasPostparto) * 100)}%
            </span>
          </div>
          <div className="relative h-4 flex items-center">
            <input
              type="range"
              min={1}
              max={totalSemanasPostparto}
              value={semana}
              onChange={(e) => setSemana(Number(e.target.value))}
              className="range-hero w-full block"
              aria-label="Semana postparto"
            />
          </div>
          <div className="flex justify-between text-[15px] text-white/75 mt-1 mb-4">
            <span>S.1</span>
            <span>S.6</span>
            <span>S.12</span>
          </div>
          <div className="bg-white/20 rounded-[18px] px-4 py-3">
            <p className="text-[15px] text-white uppercase tracking-wide opacity-85 mb-1">Qué esperar esta semana</p>
            <p className="text-[18px] text-white leading-relaxed">{data.hito}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-8">
        {guias.map((g) => (
          <div key={g.titulo} className="bg-white border border-[var(--border-soft)] rounded-[20px] p-4 shadow-sm flex gap-3">
            <span className="w-10 h-10 rounded-full bg-brand-pink-light/60 flex items-center justify-center text-brand-pink shrink-0">
              <g.icon className="w-[18px] h-[18px]" strokeWidth={1.7} />
            </span>
            <div className="min-w-0">
              <p className="text-[17px] font-bold text-ink mb-1">{g.titulo}</p>
              <p className="text-[16px] text-ink-muted leading-relaxed">{g.texto}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm font-bold text-[#a89fb0] uppercase tracking-wide mb-3">¿Cómo te sentiste esta semana?</p>
      <div className="bg-white border border-[var(--border-soft)] rounded-[24px] p-5 shadow-sm">
        <p className="text-lg font-semibold text-ink mb-3">Estado de ánimo</p>
        <div className="flex justify-between gap-2 mb-[22px]">
          {animoOpciones.map((o) => {
            const sel = registro.animo === o.value;
            return (
              <button
                key={o.value}
                onClick={() => updateField("animo", o.value)}
                className={`text-[26px] w-[50px] h-[50px] shrink-0 rounded-full flex items-center justify-center cursor-pointer transition-transform box-border ${
                  sel
                    ? "text-white shadow-[0_4px_12px_rgba(216,109,214,0.35)] scale-[1.08]"
                    : "bg-[rgba(255,111,159,0.06)] border-[1.5px] border-dashed border-[rgba(226,111,206,0.45)] hover:bg-[rgba(255,111,159,0.14)]"
                }`}
                style={sel ? { background: "var(--gradient-hero)" } : undefined}
              >
                {o.emoji}
              </button>
            );
          })}
        </div>

        <p className="text-lg font-semibold text-ink mb-3">Síntomas esperados que tuviste</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] mb-5">
          {data.sintomas.map((s) => {
            const checked = registro.sintomas?.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSintoma(s)}
                className={`flex items-center gap-2 text-left px-4 py-3 rounded-[24px] text-[15px] font-semibold leading-snug cursor-pointer transition-colors ${
                  checked ? "text-white" : "bg-brand-pink-light/50 text-ink hover:bg-brand-pink-light/80"
                }`}
                style={checked ? { background: "var(--gradient-hero)" } : undefined}
              >
                {checked && <Check className="w-4 h-4 shrink-0" strokeWidth={2.6} />}
                {s}
              </button>
            );
          })}
        </div>

        <label className="text-lg font-semibold text-ink block mb-2">Notas de la semana</label>
        <textarea
          value={registro.nota || ""}
          onChange={(e) => updateField("nota", e.target.value)}
          placeholder="Ej: la cicatriz molesta menos que la semana pasada..."
          className="w-full border border-[var(--border-soft)] rounded-[18px] p-3.5 text-[16px] text-ink placeholder:text-[#a89fb0] focus:outline-none focus:border-brand-pink resize-none"
          rows={3}
        />

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleGuardar}
            className="flex items-center gap-2 text-white text-[17px] font-bold px-6 py-3 rounded-full cursor-pointer shadow-[0_8px_20px_rgba(216,109,214,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Save className="w-4 h-4" strokeWidth={2.2} />
            Guardar semana
          </button>
          {saved && (
            <span className="text-[15px] text-brand-pink font-semibold inline-flex items-center gap-1">
              <Check className="w-4 h-4" strokeWidth={2.4} />
              Guardado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
