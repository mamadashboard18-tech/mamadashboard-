import { useState } from "react";
import {
  login,
  loginWithGoogle,
  signup,
  verifySignupCode,
  resendSignupCode,
} from "../../data/auth";
import { PasswordInput, PasswordChecklist, PASSWORD_RULES } from "./PasswordInput";
import { totalWeeks } from "../../data/seguimientoSemanal";
import BackButton from "../BackButton";

const inputClass =
  "w-full border border-rose-100 rounded-xl p-2.5 text-sm text-gray-700 focus:outline-none focus:border-rose-300";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C33.5 5.1 29 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.3-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C33.5 5.1 29 3 24 3c-7.5 0-14 4.2-17.7 10.4z"
      />
      <path
        fill="#4CAF50"
        d="M24 45c5 0 9.5-1.9 12.8-5.1l-6.3-5.3c-2 1.5-4.6 2.4-6.5 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.9 40.7 16.4 45 24 45z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.6l6.3 5.3C41.5 35.9 45 30.5 45 24c0-1.2-.1-2.4-.3-3.5z"
      />
    </svg>
  );
}

function GoogleButton({ label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 border border-rose-100 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-rose-50 transition-colors disabled:opacity-60"
    >
      <GoogleIcon />
      {label}
    </button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-rose-100" />
      <span className="text-xs text-gray-400">o</span>
      <div className="flex-1 h-px bg-rose-100" />
    </div>
  );
}

function VerifyCodeStep({ signupData, onVerified, onBack }) {
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
    const result = await verifySignupCode({ ...signupData, code });
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
    const result = await resendSignupCode({ email: signupData.email });
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
            Te enviamos un código de 6 dígitos a{" "}
            <span className="font-medium">{signupData.email}</span>.
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

  // Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  // Signup
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [semanaEmbarazo, setSemanaEmbarazo] = useState("");
  const [celular, setCelular] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");
  const [pendingSignup, setPendingSignup] = useState(null);

  const switchTab = (nextTab) => {
    setTab(nextTab);
    setError("");
    setInfoMsg("");
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    const result = await loginWithGoogle({ remember: tab === "login" ? remember : true });
    setGoogleLoading(false);
    if (!result.ok) {
      setError(result.error);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMsg("");
    setLoading(true);
    const result = await login({ email, password, remember });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSuccess(result.user);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMsg("");

    if (!PASSWORD_RULES.every((rule) => rule.test(signupPassword))) {
      setError("La contraseña no cumple con todos los requisitos.");
      return;
    }
    if (signupPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const data = {
      nombre,
      apellido,
      fechaNacimiento,
      semanaEmbarazo,
      celular,
      email: signupEmail,
      password: signupPassword,
    };

    setLoading(true);
    const result = await signup(data);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPendingSignup(data);
  };

  if (pendingSignup) {
    return (
      <VerifyCodeStep
        signupData={pendingSignup}
        onVerified={onSuccess}
        onBack={() => {
          setPendingSignup(null);
          setSignupPassword("");
          setConfirmPassword("");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <BackButton onBack={onBack} label="Volver" className="mb-6" />

        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl">🤰</span>
          <span className="font-semibold text-gray-900">Mamá App</span>
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-7">
          <div className="flex bg-rose-50 rounded-xl p-1 mb-6">
            <button
              onClick={() => switchTab("login")}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${
                tab === "login" ? "bg-white text-rose-600 shadow-sm" : "text-gray-500"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => switchTab("signup")}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${
                tab === "signup" ? "bg-white text-rose-600 shadow-sm" : "text-gray-500"
              }`}
            >
              Crear cuenta
            </button>
          </div>

          {infoMsg && <p className="text-xs text-green-600 mb-3">{infoMsg}</p>}

          {tab === "login" ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label className="text-xs text-gray-500 block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              <div className="mb-2">
                <label className="text-xs text-gray-500 block mb-1">Contraseña</label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <label className="flex items-center gap-2 mt-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-rose-200 text-rose-500 focus:ring-rose-300"
                />
                <span className="text-xs text-gray-500">Recordarme en este dispositivo</span>
              </label>

              {error && <p className="text-xs text-red-500 mb-3 mt-3">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-rose-600 transition-colors mt-4 disabled:opacity-60"
              >
                {loading ? "Un momento…" : "Iniciar sesión"}
              </button>

              <Divider />

              <GoogleButton
                label={googleLoading ? "Conectando…" : "Continuar con Google"}
                onClick={handleGoogle}
                disabled={googleLoading}
              />
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Apellido</label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Tu apellido"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Semana de embarazo</label>
                  <input
                    type="number"
                    min={1}
                    max={totalWeeks}
                    value={semanaEmbarazo}
                    onChange={(e) => setSemanaEmbarazo(e.target.value)}
                    placeholder="Ej: 24"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="text-xs text-gray-500 block mb-1">Celular</label>
                <input
                  type="tel"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  placeholder="+54 9 11 1234 5678"
                  className={inputClass}
                />
              </div>

              <div className="mb-3">
                <label className="text-xs text-gray-500 block mb-1">Email</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              <div className="mb-2">
                <label className="text-xs text-gray-500 block mb-1">Contraseña</label>
                <PasswordInput
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                {signupPassword && <PasswordChecklist password={signupPassword} />}
              </div>

              <div className="mb-2 mt-3">
                <label className="text-xs text-gray-500 block mb-1">Repetir contraseña</label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                {confirmPassword && confirmPassword !== signupPassword && (
                  <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden.</p>
                )}
              </div>

              {error && <p className="text-xs text-red-500 mb-3 mt-3">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-rose-600 transition-colors mt-3 disabled:opacity-60"
              >
                {loading ? "Un momento…" : "Crear cuenta"}
              </button>

              <Divider />

              <GoogleButton
                label={googleLoading ? "Conectando…" : "Registrarte con Google"}
                onClick={handleGoogle}
                disabled={googleLoading}
              />
            </form>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center mt-5">
          Tus datos se guardan de forma segura en tu cuenta
        </p>
      </div>
    </div>
  );
}
