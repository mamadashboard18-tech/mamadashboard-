import { useState } from "react";
import { X, Lock } from "lucide-react";
import { configurarPassword, desbloquearDiario } from "../data/diarioSeguridad";

function soloDigitos(valor) {
  return valor.replace(/\D/g, "").slice(0, 4);
}

export default function DesbloqueoDiarioModal({ modo, onClose, onSuccess }) {
  const [pin, setPin] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (modo === "crear") {
      if (pin.length !== 4) {
        setError("El PIN debe tener 4 números.");
        return;
      }
      if (pin !== confirmar) {
        setError("Los PIN no coinciden.");
        return;
      }
      setCargando(true);
      await configurarPassword(pin);
      await desbloquearDiario(pin);
      setCargando(false);
      onSuccess();
      return;
    }

    setCargando(true);
    const ok = await desbloquearDiario(pin);
    setCargando(false);
    if (!ok) {
      setError("PIN incorrecto.");
      return;
    }
    onSuccess();
  };

  const inputClass =
    "w-full border border-[rgba(155,93,229,0.2)] bg-white rounded-2xl p-3 text-center text-lg tracking-[0.3em] mb-3 text-ink focus:outline-none focus:border-brand-pink";

  return (
    <div
      className="fixed inset-0 bg-[rgba(36,29,43,0.45)] backdrop-blur-sm flex items-center justify-center px-4 z-[60]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[28px] shadow-lg w-full max-w-sm p-7"
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-heading text-[19px] font-extrabold text-ink flex items-center gap-2">
            {modo !== "crear" && <Lock className="w-[18px] h-[18px] text-brand-purple" strokeWidth={2} />}
            {modo === "crear" ? "Creá tu PIN" : "Entradas privadas"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[rgba(155,93,229,0.15)] flex items-center justify-center text-ink-muted hover:bg-brand-pink-light/60 hover:text-brand-pink transition-colors cursor-pointer shrink-0"
          >
            <X className="w-[13px] h-[13px]" strokeWidth={2.2} />
          </button>
        </div>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          {modo === "crear"
            ? "Elegí un PIN de 4 números para proteger el texto de las entradas que marques como privadas. Recordalo bien: si lo olvidás, no vas a poder recuperar ese texto."
            : "Ingresá tu PIN de 4 números para ver el contenido de tus entradas privadas."}
        </p>

        {modo === "crear" && <p className="text-xs text-ink-muted mb-1">PIN</p>}
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(soloDigitos(e.target.value))}
          placeholder="••••"
          className={inputClass}
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && modo !== "crear" && handleSubmit()}
        />
        {modo === "crear" && (
          <>
            <p className="text-xs text-ink-muted mb-1">Repetí el PIN</p>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={confirmar}
              onChange={(e) => setConfirmar(soloDigitos(e.target.value))}
              placeholder="••••"
              className={inputClass}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </>
        )}
        {error && <p className="text-xs text-[#c81e3a] mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={cargando}
          className="w-full text-white text-base font-bold px-4 py-3 rounded-full hover:brightness-105 transition disabled:opacity-50 cursor-pointer"
          style={{ background: "var(--gradient-hero)" }}
        >
          {cargando ? "Un momento..." : modo === "crear" ? "Crear y continuar" : "Desbloquear"}
        </button>
      </div>
    </div>
  );
}
