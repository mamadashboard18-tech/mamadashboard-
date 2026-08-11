import { useState } from "react";
import { login, signup, verifySignupCode, resendSignupCode } from "../../data/auth";
import { PasswordInput, PasswordChecklist, PASSWORD_RULES } from "./PasswordInput";
import BackButton from "../BackButton";

const inputClass =
  "w-full border border-rose-100 rounded-xl p-2.5 text-sm text-gray-700 focus:outline-none focus:border-rose-300";

function VerifyCodeStep({ nombre, email, password, onVerified, onBack }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMsg("");
    setLoading(true);
    const result = await verifySignupCode({ nombre, email, password, code });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onVerified(result.user);
  };

  const handleResend = async () => {
    setError("");
    setInfoMsg("");
    setResending(true);
    const result = await resendSignupCode({ email });
    setResending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setInfoMsg("Te reenviamos el código.");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <BackButton onBack={onBack} label="Volver" className="mb-6" />

        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl">🤰</span>
          <span className="font-semibold text-gray-900">Mamá App</span>
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-7">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Verificá tu email</h2>
          <p className="text-xs text-gray-500 mb-5">
            Te enviamos un código de 6 dígitos a <span className="font-medium">{email}</span>.
          </p>

          <form onSubmit={handleVerify}>
            <div className="mb-3">
              <label className="text-xs text-gray-500 block mb-1">Código</label>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className={`${inputClass} text-center tracking-widest text-base`}
                maxLength={6}
              />
            </div>

            {infoMsg && <p className="text-xs text-green-600 mb-3">{infoMsg}</p>}
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-500 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-60"
            >
              {loading ? "Verificando…" : "Verificar"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="w-full text-xs text-gray-500 hover:text-rose-500 mt-4 disabled:opacity-60"
            >
              {resending ? "Reenviando…" : "Reenviar código"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage({ initialTab = "login", onSuccess, onBack }) {
  const [tab, setTab] = useState(initialTab);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");
  const [pendingEmail, setPendingEmail] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMsg("");

    if (tab === "signup") {
      if (!PASSWORD_RULES.every((rule) => rule.test(password))) {
        setError("La contraseña no cumple con todos los requisitos.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
    }

    setLoading(true);
    const result =
      tab === "login"
        ? await login({ email, password })
        : await signup({ nombre, email, password });
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (result.needsVerification) {
      setPendingEmail(result.email);
      return;
    }
    onSuccess(result.user);
  };

  if (pendingEmail) {
    return (
      <VerifyCodeStep
        nombre={nombre}
        email={pendingEmail}
        password={password}
        onVerified={onSuccess}
        onBack={() => {
          setPendingEmail(null);
          setTab("login");
          setPassword("");
          setConfirmPassword("");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <BackButton onBack={onBack} label="Volver" className="mb-6" />

        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl">🤰</span>
          <span className="font-semibold text-gray-900">Mamá App</span>
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-7">
          <div className="flex bg-rose-50 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setTab("login"); setError(""); setInfoMsg(""); }}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${
                tab === "login" ? "bg-white text-rose-600 shadow-sm" : "text-gray-500"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => { setTab("signup"); setError(""); setInfoMsg(""); }}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${
                tab === "signup" ? "bg-white text-rose-600 shadow-sm" : "text-gray-500"
              }`}
            >
              Crear cuenta
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {infoMsg && <p className="text-xs text-green-600 mb-3">{infoMsg}</p>}
            {tab === "signup" && (
              <div className="mb-3">
                <label className="text-xs text-gray-500 block mb-1">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className={inputClass}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="text-xs text-gray-500 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className={inputClass}
              />
            </div>

            <div className="mb-2">
              <label className="text-xs text-gray-500 block mb-1">Contraseña</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              {tab === "signup" && password && <PasswordChecklist password={password} />}
            </div>

            {tab === "signup" && (
              <div className="mb-2 mt-3">
                <label className="text-xs text-gray-500 block mb-1">Repetir contraseña</label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden.</p>
                )}
              </div>
            )}

            {error && <p className="text-xs text-red-500 mb-3 mt-3">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-500 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-rose-600 transition-colors mt-3 disabled:opacity-60"
            >
              {loading ? "Un momento…" : tab === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          </form>
        </div>

        <p className="text-xs text-gray-400 text-center mt-5">
          Tus datos se guardan de forma segura en tu cuenta
        </p>
      </div>
    </div>
  );
}
