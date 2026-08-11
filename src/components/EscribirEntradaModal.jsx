import { useEffect, useState } from "react";
import { X, BookOpen, Star, MessageCircle, EyeOff, Lock, Save, Trash2, Pencil } from "lucide-react";
import AttachButtons from "./AttachButtons";
import { loadEntradaDelDia, guardarEntradaDelDia, eliminarEntrada } from "../data/diario";
import { prompts, nuevoPromptAleatorio, toISODate } from "../data/diarioLibre";
import {
  diarioDesbloqueado,
  descifrarConClave,
  cifrarConClave,
  tienePassword,
} from "../data/diarioSeguridad";
import { semanaEnFecha, trimesterOf } from "../data/seguimientoSemanal";
import { loadPerfil } from "../data/perfil";
import DesbloqueoDiarioModal from "./DesbloqueoDiarioModal";
import ToggleSwitch from "./ToggleSwitch";

const trimestreLabel = { 1: "1er trimestre", 2: "2do trimestre", 3: "3er trimestre" };

function formatFechaLarga(iso) {
  const d = new Date(iso + "T00:00:00");
  const texto = d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function parseContenidoCifrado(plano) {
  try {
    const obj = JSON.parse(plano);
    return { titulo: obj.titulo || "", texto: obj.texto || "" };
  } catch {
    return { titulo: "", texto: plano };
  }
}

export default function EscribirEntradaModal({ fecha, onClose, onSaved }) {
  const existente = loadEntradaDelDia(fecha);
  const eraPrivada = Boolean(existente?.privada);
  const esHoy = fecha === toISODate(new Date());

  const [bloqueado, setBloqueado] = useState(eraPrivada && !diarioDesbloqueado());
  const [cargando, setCargando] = useState(eraPrivada && diarioDesbloqueado());
  const [titulo, setTitulo] = useState(eraPrivada ? "" : existente?.titulo ?? "");
  const [texto, setTexto] = useState(eraPrivada ? "" : existente?.texto ?? "");
  const [mostrarConsigna, setMostrarConsigna] = useState(Boolean(existente?.prompt));
  const [prompt, setPrompt] = useState(existente?.prompt ?? null);
  const [archivos, setArchivos] = useState(existente?.archivos ?? []);
  const [destacado, setDestacado] = useState(existente?.destacado ?? false);
  const [oculto, setOculto] = useState(existente?.oculto ?? false);
  const [privada, setPrivada] = useState(eraPrivada);
  const [mostrarDesbloqueo, setMostrarDesbloqueo] = useState(null);
  const [semanaActual, setSemanaActual] = useState(24);

  useEffect(() => {
    loadPerfil().then((p) => setSemanaActual(p.semanaActual));
  }, []);

  useEffect(() => {
    if (!eraPrivada || !diarioDesbloqueado()) return;
    descifrarConClave(existente.textoCifrado).then((plano) => {
      const { titulo: t, texto: x } = parseContenidoCifrado(plano);
      setTitulo(t);
      setTexto(x);
      setCargando(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const semana = semanaEnFecha(fecha, semanaActual, new Date());

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

  const handleTogglePrivada = () => {
    if (privada) {
      setPrivada(false);
      return;
    }
    if (!tienePassword()) {
      setMostrarDesbloqueo("crear");
      return;
    }
    if (!diarioDesbloqueado()) {
      setMostrarDesbloqueo("desbloquear");
      return;
    }
    setPrivada(true);
  };

  const handleGuardar = async () => {
    const payload = {
      prompt: mostrarConsigna ? prompt : null,
      archivos,
      destacado,
      oculto,
      privada,
    };

    if (privada) {
      if (!diarioDesbloqueado()) {
        setMostrarDesbloqueo("desbloquear");
        return;
      }
      payload.textoCifrado = await cifrarConClave(
        JSON.stringify({ titulo: titulo.trim(), texto: texto.trim() })
      );
      payload.texto = null;
      payload.titulo = null;
    } else {
      payload.texto = texto.trim();
      payload.titulo = titulo.trim() || null;
      payload.textoCifrado = null;
    }

    guardarEntradaDelDia(fecha, payload);
    onSaved?.();
    onClose();
  };

  const handleEliminar = () => {
    if (!window.confirm("¿Eliminar esta entrada para siempre? No se puede deshacer.")) return;
    eliminarEntrada(fecha);
    onSaved?.();
    onClose();
  };

  if (bloqueado) {
    return (
      <div
        className="fixed inset-0 bg-[rgba(36,29,43,0.45)] backdrop-blur-sm flex items-center justify-center px-4 z-50"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[28px] shadow-lg w-full max-w-sm p-7 text-center"
        >
          <span className="w-14 h-14 rounded-full bg-[rgba(155,93,229,0.12)] text-brand-purple flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" strokeWidth={1.8} />
          </span>
          <p className="text-base text-ink mb-5 leading-relaxed">
            Esta entrada es privada. Ingresá tu PIN para verla o editarla.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="text-sm text-ink-muted hover:text-ink px-4 py-2.5 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => setMostrarDesbloqueo("desbloquear")}
              className="text-white text-sm font-bold px-5 py-2.5 rounded-full cursor-pointer hover:brightness-105 transition"
              style={{ background: "var(--gradient-hero)" }}
            >
              Ingresar PIN
            </button>
          </div>
        </div>

        {mostrarDesbloqueo && (
          <DesbloqueoDiarioModal
            modo={mostrarDesbloqueo}
            onClose={() => setMostrarDesbloqueo(null)}
            onSuccess={async () => {
              setMostrarDesbloqueo(null);
              setBloqueado(false);
              setCargando(true);
              const plano = await descifrarConClave(existente.textoCifrado);
              const { titulo: t, texto: x } = parseContenidoCifrado(plano);
              setTitulo(t);
              setTexto(x);
              setCargando(false);
            }}
          />
        )}
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="fixed inset-0 bg-[rgba(36,29,43,0.45)] backdrop-blur-sm flex items-center justify-center px-4 z-50">
        <div className="bg-white rounded-[28px] shadow-lg w-full max-w-sm p-7 text-center text-base text-ink-muted">
          Desbloqueando...
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-[rgba(36,29,43,0.45)] backdrop-blur-sm flex items-end justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sheet-up bg-white rounded-t-[28px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-[0_-8px_40px_rgba(0,0,0,0.18)] box-border"
        style={{ padding: "18px 22px calc(24px + env(safe-area-inset-bottom))" }}
      >
        <div className="w-10 h-1 rounded-full bg-[rgba(155,93,229,0.18)] mx-auto mb-4" />

        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-[46px] h-[46px] rounded-full flex items-center justify-center text-white shrink-0"
              style={{ background: "var(--gradient-hero)" }}
            >
              <BookOpen className="w-5 h-5" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-ink-muted truncate flex items-center gap-1.5">
                {!esHoy && <Pencil className="w-3.5 h-3.5 shrink-0" />}
                {esHoy ? "Tu página de hoy" : "Editar entrada"}
              </p>
              <h3 className="font-heading text-[22px] font-extrabold text-ink truncate leading-tight mt-0.5 mb-1.5">
                {formatFechaLarga(fecha)}
              </h3>
              <span className="inline-block text-xs font-bold text-brand-purple bg-[rgba(155,93,229,0.12)] rounded-full px-2.5 py-1">
                Semana {semana} · {trimestreLabel[trimesterOf(semana)]}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setDestacado((v) => !v)}
              className={`w-9 h-9 flex items-center justify-center transition-colors cursor-pointer ${
                destacado ? "text-brand-pink" : "text-ink-muted hover:text-brand-pink"
              }`}
              aria-label="Marcar como destacada"
              title="Marcar como destacada"
            >
              <Star className="w-5 h-5" strokeWidth={1.8} fill={destacado ? "currentColor" : "none"} />
            </button>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="w-9 h-9 rounded-full bg-[rgba(155,93,229,0.15)] flex items-center justify-center text-ink-muted hover:bg-brand-pink-light/60 hover:text-brand-pink transition-colors cursor-pointer shrink-0"
            >
              <X className="w-[15px] h-[15px]" strokeWidth={2} />
            </button>
          </div>
        </div>

        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título (opcional)"
          className="w-full rounded-full border border-[rgba(155,93,229,0.18)] bg-white px-4 py-3 text-base font-bold text-ink placeholder:font-normal placeholder:text-ink-muted focus:outline-none focus:border-brand-pink mb-3"
        />

        <div className="relative mb-3">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribí lo que quieras, sin filtro y sin juicio. Esto es solo para vos..."
            className="w-full min-h-[260px] rounded-[22px] border border-[rgba(226,111,206,0.2)] bg-white p-5 pb-14 text-base text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand-pink resize-none box-border"
            style={{ boxShadow: "0 2px 16px rgba(155,93,229,0.08)" }}
            rows={9}
            autoFocus
          />
          <button
            type="button"
            onClick={toggleConsigna}
            className="absolute left-4 bottom-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-pink border border-dashed border-[rgba(226,111,206,0.5)] rounded-full px-3 py-1.5 bg-white/90 hover:bg-brand-pink-light/40 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" strokeWidth={2} />
            {mostrarConsigna ? "Usando una consigna" : "Usar una consigna"}
          </button>
        </div>

        {mostrarConsigna && (
          <div className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-2xl p-3.5 mb-3 flex items-center justify-between gap-3">
            <p className="text-sm text-ink italic">"{prompt}"</p>
            <button
              type="button"
              onClick={() => setPrompt(nuevoPromptAleatorio(prompt))}
              className="text-xs text-brand-pink hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              Cambiar
            </button>
          </div>
        )}

        <AttachButtons onFiles={handleArchivos} className="mb-3" />

        {archivos.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
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

        <div className="bg-[var(--bg)] rounded-[20px] px-1 mb-4">
          <div className="flex items-center gap-3 px-3.5 py-3.5">
            <span className="w-9 h-9 rounded-full bg-[rgba(155,93,229,0.12)] text-brand-purple flex items-center justify-center shrink-0">
              <EyeOff className="w-4 h-4" strokeWidth={1.8} />
            </span>
            <p className="text-base font-bold text-ink flex-1">Ocultar</p>
            <ToggleSwitch checked={oculto} onChange={() => setOculto((v) => !v)} label="Ocultar" />
          </div>
          <div className="h-px bg-[rgba(155,93,229,0.1)] mx-3.5" />
          <div className="flex items-center gap-3 px-3.5 py-3.5">
            <span className="w-9 h-9 rounded-full bg-[rgba(155,93,229,0.12)] text-brand-purple flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" strokeWidth={1.8} />
            </span>
            <p className="text-base font-bold text-ink flex-1">Bloquear</p>
            <ToggleSwitch checked={privada} onChange={handleTogglePrivada} label="Bloquear" />
          </div>
        </div>

        <p className="text-sm text-[#8a7f92] flex items-center gap-1.5 mb-3">
          <Lock className="w-3.5 h-3.5" strokeWidth={2} />
          Privado, solo vos podés verlo
        </p>

        <div className="flex items-center gap-3">
          {existente && (
            <button
              type="button"
              onClick={handleEliminar}
              aria-label="Eliminar"
              title="Eliminar"
              className="shrink-0 w-[52px] h-[52px] flex items-center justify-center text-brand-pink rounded-full border-[1.5px] border-brand-pink cursor-pointer hover:bg-brand-pink-light/40 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleGuardar}
            disabled={!texto.trim() && archivos.length === 0}
            aria-label="Guardar"
            title="Guardar"
            className="shrink-0 ml-auto w-[52px] h-[52px] flex items-center justify-center text-white rounded-full cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Save className="w-5 h-5" />
          </button>
        </div>
      </div>

      {mostrarDesbloqueo && (
        <DesbloqueoDiarioModal
          modo={mostrarDesbloqueo}
          onClose={() => setMostrarDesbloqueo(null)}
          onSuccess={() => {
            setPrivada(true);
            setMostrarDesbloqueo(null);
          }}
        />
      )}
    </div>
  );
}
