import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import Header from "./Header";
import BackButton from "./BackButton";
import { PasswordInput, PasswordChecklist, PASSWORD_RULES } from "./auth/PasswordInput";
import {
  getCuenta,
  updateCuenta,
  changePassword,
  requestEmailChange,
  confirmEmailChange,
} from "../data/auth";

const inputClass =
  "w-full border border-[var(--border-soft)] rounded-xl p-2.5 text-sm text-ink bg-white focus:outline-none focus:border-brand-pink transition-colors";

const primaryButtonStyle = { background: "var(--gradient-hero)" };

const cardClass = "bg-white rounded-[20px] border border-[var(--border-soft)] p-6 shadow-sm mb-6";

const sectionTitleClass = "text-sm font-semibold text-ink-muted uppercase tracking-wide mb-4";

function Feedback({ status }) {
  if (!status) return null;
  return (
    <span className={`text-sm ${status.ok ? "text-green-600" : "text-red-500"}`}>{status.msg}</span>
  );
}

function PrimaryButton({ children, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="text-white text-sm font-medium px-4 py-2 rounded-full hover:brightness-105 transition-[filter] disabled:opacity-50 whitespace-nowrap"
      style={primaryButtonStyle}
    >
      {children}
    </button>
  );
}

function DatosCuenta({ cuenta, onSaved }) {
  const [form, setForm] = useState({
    nombre: cuenta.nombre,
    apellido: cuenta.apellido,
    fechaNacimiento: cuenta.fechaNacimiento,
    celular: cuenta.celular,
  });
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setStatus(null);
  };

  const handleGuardar = async () => {
    setSaving(true);
    const result = await updateCuenta(form);
    setSaving(false);
    if (!result.ok) {
      setStatus({ ok: false, msg: result.error });
      return;
    }
    onSaved(result.user);
    setStatus({ ok: true, msg: "Guardado ✓" });
  };

  return (
    <div className={cardClass}>
      <p className={sectionTitleClass}>Datos de la cuenta</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-ink-muted block mb-1">Nombre</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => update("nombre", e.target.value)}
            autoComplete="given-name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-ink-muted block mb-1">Apellido</label>
          <input
            type="text"
            value={form.apellido}
            onChange={(e) => update("apellido", e.target.value)}
            autoComplete="family-name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-ink-muted block mb-1">Fecha de nacimiento</label>
          <input
            type="date"
            value={form.fechaNacimiento}
            onChange={(e) => update("fechaNacimiento", e.target.value)}
            autoComplete="bday"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-ink-muted block mb-1">Celular</label>
          <input
            type="tel"
            value={form.celular}
            onChange={(e) => update("celular", e.target.value)}
            placeholder="Ej: 11 5555 5555"
            autoComplete="tel"
            className={inputClass}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleGuardar}
          disabled={saving}
          aria-label="Guardar datos"
          title="Guardar datos"
          className="flex items-center justify-center w-10 h-10 text-white rounded-full hover:brightness-105 transition-[filter] disabled:opacity-50"
          style={primaryButtonStyle}
        >
          <Save className="w-4 h-4" />
        </button>
        <Feedback status={status} />
      </div>
    </div>
  );
}

function EmailCuenta({ cuenta, onSaved }) {
  const [paso, setPaso] = useState("ver"); // ver | nuevo | codigo
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const esGoogle = cuenta.proveedor === "google";

  const reset = () => {
    setPaso("ver");
    setNuevoEmail("");
    setCodigo("");
    setStatus(null);
  };

  const handleEnviarCodigo = async () => {
    if (nuevoEmail.trim().toLowerCase() === cuenta.email?.toLowerCase()) {
      setStatus({ ok: false, msg: "Ese ya es tu email actual." });
      return;
    }
    setLoading(true);
    const result = await requestEmailChange({ email: nuevoEmail });
    setLoading(false);
    if (!result.ok) {
      setStatus({ ok: false, msg: result.error });
      return;
    }
    setStatus(null);
    setPaso("codigo");
  };

  const handleConfirmar = async () => {
    setLoading(true);
    const result = await confirmEmailChange({ email: nuevoEmail, code: codigo });
    setLoading(false);
    if (!result.ok) {
      setStatus({ ok: false, msg: result.error });
      return;
    }
    if (result.user) onSaved(result.user);
    reset();
    setStatus({ ok: true, msg: "Email actualizado ✓" });
  };

  return (
    <div className={cardClass}>
      <p className={sectionTitleClass}>Email</p>

      {paso === "ver" && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-ink">{cuenta.email}</p>
            {esGoogle && (
              <p className="text-sm text-ink-muted mt-1">
                Entrás con Google, así que tu email se maneja desde tu cuenta de Google.
              </p>
            )}
            {status && (
              <div className="mt-1">
                <Feedback status={status} />
              </div>
            )}
          </div>
          {!esGoogle && (
            <button
              type="button"
              onClick={() => {
                setStatus(null);
                setPaso("nuevo");
              }}
              className="text-sm font-medium text-brand-pink hover:underline"
            >
              Cambiar email
            </button>
          )}
        </div>
      )}

      {paso === "nuevo" && (
        <div>
          <label className="text-xs text-ink-muted block mb-1">Nuevo email</label>
          <input
            type="email"
            value={nuevoEmail}
            onChange={(e) => {
              setNuevoEmail(e.target.value);
              setStatus(null);
            }}
            placeholder="tu@email.com"
            autoComplete="email"
            className={`${inputClass} mb-2`}
          />
          <p className="text-xs text-ink-muted/70 mb-4">
            Te vamos a mandar un código a ese email para confirmar que es tuyo.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <PrimaryButton onClick={handleEnviarCodigo} disabled={loading || !nuevoEmail.trim()}>
              Enviar código
            </PrimaryButton>
            <button type="button" onClick={reset} className="text-sm text-ink-muted hover:text-brand-pink">
              Cancelar
            </button>
            <Feedback status={status} />
          </div>
        </div>
      )}

      {paso === "codigo" && (
        <div>
          <p className="text-sm text-ink-muted mb-3">
            Ingresá el código de 6 dígitos que mandamos a{" "}
            <span className="font-medium text-ink">{nuevoEmail}</span>
          </p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value.replace(/\D/g, ""));
              setStatus(null);
            }}
            placeholder="000000"
            autoComplete="one-time-code"
            className={`${inputClass} mb-4 tracking-[0.4em] text-center max-w-[180px]`}
          />
          <div className="flex items-center gap-3 flex-wrap">
            <PrimaryButton onClick={handleConfirmar} disabled={loading || codigo.length !== 6}>
              Confirmar
            </PrimaryButton>
            <button type="button" onClick={reset} className="text-sm text-ink-muted hover:text-brand-pink">
              Cancelar
            </button>
            <Feedback status={status} />
          </div>
        </div>
      )}
    </div>
  );
}

function PasswordCuenta({ cuenta }) {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [repetir, setRepetir] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  if (cuenta.proveedor === "google") {
    return (
      <div className={cardClass}>
        <p className={sectionTitleClass}>Contraseña</p>
        <p className="text-sm text-ink-muted">
          Entrás con Google, así que no tenés una contraseña de Acuna App. Tu acceso se maneja desde tu cuenta de
          Google.
        </p>
      </div>
    );
  }

  const cumpleReglas = PASSWORD_RULES.every((r) => r.test(nueva));
  const coinciden = nueva === repetir;
  const puedeGuardar = actual && cumpleReglas && coinciden && !loading;

  const handleCambiar = async () => {
    setLoading(true);
    const result = await changePassword({ email: cuenta.email, actual, nueva });
    setLoading(false);
    if (!result.ok) {
      setStatus({ ok: false, msg: result.error });
      return;
    }
    setActual("");
    setNueva("");
    setRepetir("");
    setStatus({ ok: true, msg: "Contraseña actualizada ✓" });
  };

  const onChange = (setter) => (e) => {
    setter(e.target.value);
    setStatus(null);
  };

  return (
    <div className={cardClass}>
      <p className={sectionTitleClass}>Contraseña</p>
      <div className="space-y-4 max-w-md mb-4">
        <div>
          <label className="text-xs text-ink-muted block mb-1">Contraseña actual</label>
          <PasswordInput value={actual} onChange={onChange(setActual)} autoComplete="current-password" />
        </div>
        <div>
          <label className="text-xs text-ink-muted block mb-1">Nueva contraseña</label>
          <PasswordInput value={nueva} onChange={onChange(setNueva)} autoComplete="new-password" />
          {nueva && <PasswordChecklist password={nueva} />}
        </div>
        <div>
          <label className="text-xs text-ink-muted block mb-1">Repetí la nueva contraseña</label>
          <PasswordInput value={repetir} onChange={onChange(setRepetir)} autoComplete="new-password" />
          {repetir && !coinciden && <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <PrimaryButton onClick={handleCambiar} disabled={!puedeGuardar}>
          Cambiar contraseña
        </PrimaryButton>
        <Feedback status={status} />
      </div>
    </div>
  );
}

export default function CuentaPanel({ onBack }) {
  const [cuenta, setCuenta] = useState(null);
  const [estado, setEstado] = useState("cargando"); // cargando | listo | sin-sesion

  useEffect(() => {
    getCuenta()
      .then((c) => {
        setCuenta(c);
        setEstado(c ? "listo" : "sin-sesion");
      })
      .catch(() => setEstado("sin-sesion"));
  }, []);

  return (
    <div>
      <BackButton onBack={onBack} label="Volver a Ajustes" className="mb-4" />
      <Header title="Mi cuenta" subtitle="Tus datos de acceso e información personal" />

      {estado === "cargando" && <p className="text-sm text-ink-muted">Cargando…</p>}

      {estado === "sin-sesion" && (
        <div className={cardClass}>
          <p className="text-sm text-ink-muted">
            No pudimos cargar los datos de tu cuenta. Cerrá sesión y volvé a entrar para editarlos.
          </p>
        </div>
      )}

      {estado === "listo" && cuenta && (
        <>
          <DatosCuenta cuenta={cuenta} onSaved={setCuenta} />
          <EmailCuenta cuenta={cuenta} onSaved={setCuenta} />
          <PasswordCuenta cuenta={cuenta} />
        </>
      )}
    </div>
  );
}
