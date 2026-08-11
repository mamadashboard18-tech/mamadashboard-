import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import AttachButtons from "./AttachButtons";
import {
  animoOpciones,
  escalaOpciones,
  loadRegistroDelDia,
  guardarRegistroDelDia,
} from "../data/registroDiario";
import { prompts, nuevoPromptAleatorio } from "../data/diarioLibre";
import { catalogoSintomas as catalogoSintomasEmbarazo, iconoSintoma as iconoSintomaEmbarazo } from "../data/sintomas";
import { getPartnerStatus, syncSintomasCompartidos } from "../data/partner";

const EMPHASIS_LABEL = "Disminución de los movimientos del bebé";

function formatFechaLarga(iso) {
  const d = new Date(iso + "T00:00:00");
  const texto = d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function circuloClasses(selected) {
  return selected
    ? "text-white border-none shadow-[0_4px_12px_rgba(216,109,214,0.35)]"
    : "bg-[rgba(255,111,159,0.06)] border-[1.5px] border-dashed border-[rgba(226,111,206,0.45)] text-ink hover:bg-[rgba(255,111,159,0.14)]";
}

function chipClasses(atencion, selected, emphasis) {
  if (atencion) {
    if (selected) return "bg-[#b45309] text-white border-transparent";
    return `${emphasis ? "bg-[#fef3c7]" : "bg-white"} text-[#8a6400] border-[1.5px] border-solid border-[rgba(234,179,8,0.7)]`;
  }
  return selected
    ? "text-white border-transparent"
    : "bg-[rgba(255,111,159,0.14)] text-ink border-transparent hover:brightness-95";
}

export default function RegistroDiarioModal({
  fecha,
  sintomasSemana = [],
  catalogo = catalogoSintomasEmbarazo,
  iconoSintoma = iconoSintomaEmbarazo,
  onClose,
  onSaved,
}) {
  const existente = loadRegistroDelDia(fecha);

  const [animo, setAnimo] = useState(existente?.animo ?? null);
  const [energia, setEnergia] = useState(existente?.energia ?? null);
  const [sueno, setSueno] = useState(existente?.sueno ?? null);
  const [sintomas, setSintomas] = useState(existente?.sintomas ?? []);
  const [nota, setNota] = useState(existente?.nota ?? "");
  const [mostrarConsigna, setMostrarConsigna] = useState(false);
  const [prompt, setPrompt] = useState(existente?.prompt ?? null);
  const [archivos, setArchivos] = useState(existente?.archivos ?? []);
  const [mostrarMasSintomas, setMostrarMasSintomas] = useState(false);
  const [sintomaPropio, setSintomaPropio] = useState("");
  const [hasPartner, setHasPartner] = useState(false);
  const [compartirPartner, setCompartirPartner] = useState(existente?.compartirPartner ?? true);

  useEffect(() => {
    getPartnerStatus().then((status) => setHasPartner(status.hasPartner));
  }, []);

  const toggleSintoma = (s) => {
    setSintomas((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const agregarSintomaPropio = () => {
    const valor = sintomaPropio.trim();
    if (!valor) return;
    if (!sintomas.includes(valor)) setSintomas((prev) => [...prev, valor]);
    setSintomaPropio("");
  };

  const catalogoRestante = catalogo.filter((s) => !sintomasSemana.includes(s.label));
  const sintomasPropios = sintomas.filter(
    (s) => !sintomasSemana.includes(s) && !catalogo.some((c) => c.label === s)
  );

  const toggleConsigna = () => {
    if (!mostrarConsigna) setPrompt((p) => p || prompts[Math.floor(Math.random() * prompts.length)]);
    setMostrarConsigna((v) => !v);
  };

  const handleArchivos = (fileList) => {
    const files = Array.from(fileList);
    const maxSize = 4 * 1024 * 1024;
    const validos = files.filter((f) => f.size <= maxSize);
    const muyGrandes = files.length - validos.length;

    Promise.all(
      validos.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: `${Date.now()}-${file.name}`,
                nombre: file.name,
                tipo: file.type,
                dataUrl: reader.result,
              });
            reader.readAsDataURL(file);
          })
      )
    ).then((nuevos) => {
      setArchivos((prev) => [...prev, ...nuevos]);
      if (muyGrandes > 0) alert(`${muyGrandes} archivo(s) no se adjuntaron por superar los 4MB.`);
    });
  };

  const eliminarArchivo = (id) => {
    setArchivos((prev) => prev.filter((a) => a.id !== id));
  };

  const handleGuardar = () => {
    guardarRegistroDelDia(fecha, {
      animo,
      energia,
      sueno,
      sintomas,
      nota: nota.trim(),
      prompt: mostrarConsigna ? prompt : null,
      archivos,
      compartirPartner,
    });
    if (hasPartner) {
      syncSintomasCompartidos(fecha, compartirPartner ? sintomas : []);
    }
    onSaved?.();
    onClose();
  };

  const renderChip = (s) => {
    const selected = sintomas.includes(s.label);
    const emphasis = s.label === EMPHASIS_LABEL;
    return (
      <button
        key={s.label}
        type="button"
        onClick={() => toggleSintoma(s.label)}
        className={`flex items-center gap-2 text-left px-4 py-3 rounded-[24px] text-[15px] font-semibold leading-snug cursor-pointer transition-colors box-border w-full ${chipClasses(
          s.atencion,
          selected,
          emphasis
        )}`}
        style={selected && !s.atencion ? { background: "var(--gradient-hero)" } : undefined}
      >
        <span className="text-lg shrink-0">{s.icon || iconoSintoma(s.label)}</span>
        <span>{s.label}</span>
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-[rgba(36,29,43,0.45)] backdrop-blur-sm flex items-end justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sheet-up bg-white rounded-t-[28px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-[0_-8px_40px_rgba(0,0,0,0.18)] box-border"
        style={{ padding: "24px 22px calc(24px + env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-heading text-[24px] font-extrabold text-ink">Registro del día</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-10 h-10 rounded-full bg-[rgba(155,93,229,0.15)] flex items-center justify-center text-ink-muted hover:bg-brand-pink-light/60 hover:text-brand-pink transition-colors cursor-pointer shrink-0"
          >
            <X className="w-[15px] h-[15px]" strokeWidth={2} />
          </button>
        </div>
        <p className="text-[15px] text-[#8a7f92] mb-5">{formatFechaLarga(fecha)}</p>

        <p className="text-lg font-semibold text-ink mb-3">Estado de ánimo</p>
        <div className="flex justify-between gap-2 mb-[22px]">
          {animoOpciones.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setAnimo(o.value)}
              className={`text-[28px] w-[52px] h-[52px] shrink-0 rounded-full flex items-center justify-center cursor-pointer transition-transform box-border ${circuloClasses(
                animo === o.value
              )} ${animo === o.value ? "scale-[1.08]" : ""}`}
              style={animo === o.value ? { background: "var(--gradient-hero)" } : undefined}
            >
              {o.emoji}
            </button>
          ))}
        </div>

        <p className="text-lg font-semibold text-ink mb-3">Energía (1-5)</p>
        <div className="flex justify-between gap-2 mb-[22px]">
          {escalaOpciones.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setEnergia(n)}
              className={`text-lg font-bold w-12 h-12 shrink-0 rounded-full flex items-center justify-center cursor-pointer box-border ${circuloClasses(
                energia === n
              )}`}
              style={energia === n ? { background: "var(--gradient-hero)" } : undefined}
            >
              {n}
            </button>
          ))}
        </div>

        <p className="text-lg font-semibold text-ink mb-3">Sueño (1-5)</p>
        <div className="flex justify-between gap-2 mb-[22px]">
          {escalaOpciones.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSueno(n)}
              className={`text-lg font-bold w-12 h-12 shrink-0 rounded-full flex items-center justify-center cursor-pointer box-border ${circuloClasses(
                sueno === n
              )}`}
              style={sueno === n ? { background: "var(--gradient-hero)" } : undefined}
            >
              {n}
            </button>
          ))}
        </div>

        <p className="text-lg font-semibold text-ink mb-3">Síntomas que tuviste</p>
        <div className="grid grid-cols-2 gap-[10px] mb-3">
          {sintomasSemana.map((label) =>
            renderChip({ label, icon: iconoSintoma(label), atencion: catalogo.find((c) => c.label === label)?.atencion })
          )}
          {sintomasPropios.map((label) => renderChip({ label, icon: "📝", atencion: false }))}
        </div>

        {hasPartner && (
          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={compartirPartner}
              onChange={(e) => setCompartirPartner(e.target.checked)}
              className="accent-brand-pink w-4 h-4"
            />
            <span className="text-sm text-ink-muted">Compartir estos síntomas con tu partner 👥</span>
          </label>
        )}

        <button
          type="button"
          onClick={() => setMostrarMasSintomas((v) => !v)}
          className="border-[1.5px] border-dashed border-[rgba(226,111,206,0.5)] bg-transparent text-brand-pink text-[15px] font-bold cursor-pointer px-[18px] py-[11px] rounded-full mb-2.5 hover:bg-brand-pink-light/30 transition-colors"
        >
          {mostrarMasSintomas ? "− Ver menos síntomas" : "+ Más síntomas"}
        </button>

        {mostrarMasSintomas && (
          <div className="mb-2">
            <div className="grid grid-cols-2 gap-[10px] mb-3">
              {catalogoRestante.map((s) => renderChip(s))}
            </div>
            <p className="text-sm text-[#92400e] bg-[rgba(234,179,8,0.14)] rounded-[14px] px-3.5 py-3 mb-3.5 leading-relaxed">
              🟡 Los síntomas en amarillo pueden valer la pena comentarlos con tu médico — no es un
              diagnóstico, solo una sugerencia.
            </p>

            <p className="text-[15px] text-[#6b5f78] mb-2">¿No está en la lista? Escribilo vos</p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={sintomaPropio}
                onChange={(e) => setSintomaPropio(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    agregarSintomaPropio();
                  }
                }}
                placeholder="Ej: hormigueo en las manos"
                className="flex-1 min-w-0 rounded-full border border-[rgba(155,93,229,0.2)] bg-[var(--bg)] px-4 py-3 text-[15px] text-ink focus:outline-none focus:border-brand-purple box-border"
              />
              <button
                type="button"
                onClick={agregarSintomaPropio}
                className="shrink-0 text-white text-[15px] font-bold px-5 py-3 rounded-full cursor-pointer hover:brightness-105 active:brightness-95"
                style={{ background: "var(--gradient-hero)" }}
              >
                Agregar
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={toggleConsigna}
          className={`flex items-center gap-2 text-[15px] font-bold cursor-pointer px-[18px] py-3 rounded-full mb-[22px] transition-colors ${
            mostrarConsigna
              ? "text-white"
              : "bg-[rgba(255,111,159,0.14)] text-brand-pink hover:bg-[rgba(255,111,159,0.24)]"
          }`}
          style={mostrarConsigna ? { background: "var(--gradient-hero)" } : undefined}
        >
          💭 {mostrarConsigna ? "Usando una consigna" : "Usar una consigna"}
        </button>

        {mostrarConsigna && (
          <div className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-2xl p-3.5 mb-[22px] flex items-center justify-between gap-3">
            <p className="text-[15px] text-ink italic">"{prompt}"</p>
            <button
              type="button"
              onClick={() => setPrompt(nuevoPromptAleatorio(prompt))}
              className="text-sm text-brand-pink hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              Cambiar
            </button>
          </div>
        )}

        <p className="text-lg font-semibold text-ink mb-3">Notas del día (opcional)</p>
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Escribí lo que quieras, esto es solo para vos..."
          className="w-full min-h-[90px] rounded-2xl border border-[var(--border-soft)] bg-[var(--bg)] p-3.5 text-base text-ink focus:outline-none focus:border-brand-purple resize-none box-border mb-4"
          rows={4}
        />

        <AttachButtons onFiles={handleArchivos} className="mb-[22px]" />

        {archivos.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {archivos.map((a) => (
              <div key={a.id} className="relative">
                {a.tipo.startsWith("image/") ? (
                  <img
                    src={a.dataUrl}
                    alt={a.nombre}
                    className="w-16 h-16 object-cover rounded-xl border border-[var(--border-soft)]"
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-[var(--bg)] border border-[var(--border-soft)] rounded-xl text-xs text-ink-muted text-center px-1">
                    📄
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => eliminarArchivo(a.id)}
                  className="absolute -top-1.5 -right-1.5 bg-white border border-[var(--border-soft)] rounded-full w-5 h-5 flex items-center justify-center text-xs text-ink-muted hover:text-red-500 cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="text-base text-[#8a7f92] flex items-center gap-1.5">🔒 Privado, solo vos podés verlo</p>
          <button
            type="button"
            onClick={handleGuardar}
            aria-label="Guardar"
            title="Guardar"
            className="shrink-0 w-[52px] h-[52px] flex items-center justify-center text-white rounded-full cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Save className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
