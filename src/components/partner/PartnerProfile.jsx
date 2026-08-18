import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import {
  getPartnerProfile,
  updatePartnerProfile,
  updatePartnerPassword,
} from "../../data/partner";
import { PasswordInput, PASSWORD_RULES } from "../auth/PasswordInput";

const inputClass =
  "w-full border border-partner-dashed-border rounded-xl p-2.5 text-sm text-partner-ink focus:outline-none focus:border-partner-violet";

export default function PartnerProfile({ motherNombre, onBack, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [nombre, setNombre] = useState("");
  const [nombreSaved, setNombreSaved] = useState(false);
  const [nombreError, setNombreError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [notifSaving, setNotifSaving] = useState(false);

  useEffect(() => {
    getPartnerProfile().then((result) => {
      if (!result.ok) return;
      setProfile(result);
      setNombre(result.nombre);
    });
  }, []);

  if (!profile) return null;

  const handleGuardarNombre = async () => {
    setNombreError("");
    if (!nombre.trim()) {
      setNombreError("El nombre no puede estar vacío.");
      return;
    }
    const result = await updatePartnerProfile({ nombre });
    if (!result.ok) {
      setNombreError(result.error || "No se pudo guardar.");
      return;
    }
    setProfile((prev) => ({ ...prev, nombre: nombre.trim() }));
    setNombreSaved(true);
    setTimeout(() => setNombreSaved(false), 2000);
  };

  const handleGuardarPassword = async () => {
    setPasswordError("");
    if (!PASSWORD_RULES.every((rule) => rule.test(password))) {
      setPasswordError("La contraseña no cumple con todos los requisitos.");
      return;
    }
    setPasswordSaving(true);
    const result = await updatePartnerPassword(password);
    setPasswordSaving(false);
    if (!result.ok) {
      setPasswordError(result.error);
      return;
    }
    setPassword("");
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  const handleToggleNotif = async (field) => {
    const next = !profile[field];
    setProfile((prev) => ({ ...prev, [field]: next }));
    setNotifSaving(true);
    await updatePartnerProfile({ [field]: next });
    setNotifSaving(false);
  };

  return (
    <div>
      {onBack && (
        <button
          onClick={onBack}
          className="lg:hidden inline-flex items-center gap-1.5 text-[15px] text-partner-ink-muted hover:text-partner-violet transition-colors cursor-pointer mb-4"
        >
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.8} />
          Volver
        </button>
      )}

      <h2 className="font-heading text-[26px] font-extrabold text-partner-ink">Tu perfil</h2>
      <p className="text-[14.5px] text-partner-ink-muted mt-1 mb-[22px]">Tu cuenta como acompañante</p>

      <p className="text-[13px] font-bold tracking-wide text-partner-violet uppercase mb-3">Tu cuenta</p>
      <div className="bg-white/72 backdrop-blur-md rounded-[22px] shadow-[0_6px_26px_rgba(91,33,182,0.10)] p-[22px] mb-[18px]">
        <label className="text-[13px] text-partner-ink-muted block mb-2">Tu nombre</label>
        <div className="flex items-center gap-2.5 mb-[18px] flex-wrap">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={`${inputClass} flex-1 min-w-[180px]`}
          />
          <button
            onClick={handleGuardarNombre}
            className="text-white text-sm font-bold px-5 py-2.5 rounded-full transition-opacity hover:opacity-90 whitespace-nowrap cursor-pointer"
            style={{ background: "var(--partner-gradient)" }}
          >
            {nombreSaved ? "Guardado ✓" : "Guardar"}
          </button>
        </div>
        {nombreError && <p className="text-sm text-red-500 -mt-3 mb-3">{nombreError}</p>}

        <label className="text-[13px] text-partner-ink-muted block mb-1.5">Email</label>
        <p className="text-[15px] text-partner-ink">{profile.email}</p>
      </div>

      <p className="text-[13px] font-bold tracking-wide text-partner-violet uppercase mb-3">Contraseña</p>
      <div className="bg-white/72 backdrop-blur-md rounded-[22px] shadow-[0_6px_26px_rgba(91,33,182,0.10)] p-[22px] mb-[18px]">
        <label className="text-[13px] text-partner-ink-muted block mb-2">Nueva contraseña</label>
        <div className="mb-4">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            name="partner-new-password"
            variant="violet"
          />
        </div>
        {passwordError && <p className="text-sm text-red-500 mb-3 -mt-2">{passwordError}</p>}
        <button
          onClick={handleGuardarPassword}
          disabled={passwordSaving || !password}
          className="text-white text-sm font-bold px-5 py-2.5 rounded-full transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
          style={{ background: "var(--partner-gradient)" }}
        >
          {passwordSaving ? "Guardando…" : "Actualizar contraseña"}
        </button>
        {passwordSaved && <span className="text-sm text-partner-green-text ml-3">Actualizada ✓</span>}
      </div>

      <p className="text-[13px] font-bold tracking-wide text-partner-violet uppercase mb-3">Notificaciones</p>
      <div className="bg-white/72 backdrop-blur-md rounded-[22px] shadow-[0_6px_26px_rgba(91,33,182,0.10)] p-[22px] mb-[26px]">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.notifNotaEmail}
            onChange={() => handleToggleNotif("notifNotaEmail")}
            disabled={notifSaving}
            className="w-[19px] h-[19px] accent-[#7c3aed] shrink-0 cursor-pointer"
          />
          <span className="text-[15px] text-partner-ink">
            Recibir un aviso por email cuando {motherNombre || "tu pareja"} te mande una nota
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer mt-3.5">
          <input
            type="checkbox"
            checked={profile.notifRecordatoriosEmail}
            onChange={() => handleToggleNotif("notifRecordatoriosEmail")}
            disabled={notifSaving}
            className="w-[19px] h-[19px] accent-[#7c3aed] shrink-0 cursor-pointer"
          />
          <span className="text-[15px] text-partner-ink">Recordatorios de citas compartidas por email</span>
        </label>
      </div>

      <button
        onClick={onLogout}
        className="text-[14.5px] font-semibold text-partner-ink-muted hover:text-partner-violet-deep transition-colors cursor-pointer"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
