import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import {
  getPartnerProfile,
  updatePartnerProfile,
  updatePartnerPassword,
} from "../../data/partner";
import { PasswordInput, PASSWORD_RULES } from "../auth/PasswordInput";
import PartnerPasswordChecklist from "./PartnerPasswordChecklist";

const inputClass =
  "w-full border border-partner-dashed-border rounded-xl p-2.5 text-sm text-partner-ink focus:outline-none focus:border-partner-violet";

export default function PartnerProfile({ onLogout }) {
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

  const handleToggleNotif = async () => {
    const next = !profile.notifRecordatoriosEmail;
    setProfile((prev) => ({ ...prev, notifRecordatoriosEmail: next }));
    setNotifSaving(true);
    await updatePartnerProfile({ notifRecordatoriosEmail: next });
    setNotifSaving(false);
  };

  return (
    <div>
      <h2 className="font-heading text-[26px] font-extrabold text-partner-ink mb-5">Tu perfil</h2>

      <div className="bg-white/72 backdrop-blur-md rounded-[22px] shadow-[0_6px_26px_rgba(91,33,182,0.10)] p-[22px] mb-5">
        <p className="text-[13px] font-bold tracking-wide text-partner-violet uppercase mb-4">Tu cuenta</p>

        <div className="mb-4">
          <label className="text-xs text-partner-ink-muted block mb-1">Tu nombre</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={inputClass}
            />
            <button
              onClick={handleGuardarNombre}
              className="text-white text-sm font-bold px-4 py-2.5 rounded-full transition-opacity hover:opacity-90 whitespace-nowrap cursor-pointer"
              style={{ background: "var(--partner-gradient)" }}
            >
              Guardar
            </button>
          </div>
          {nombreSaved && <p className="text-sm text-partner-green-text mt-1.5">Guardado ✓</p>}
          {nombreError && <p className="text-sm text-red-500 mt-1.5">{nombreError}</p>}
        </div>

        <div>
          <label className="text-xs text-partner-ink-muted block mb-1">Email</label>
          <p className="text-sm text-partner-ink-secondary">{profile.email}</p>
        </div>
      </div>

      <div className="bg-white/72 backdrop-blur-md rounded-[22px] shadow-[0_6px_26px_rgba(91,33,182,0.10)] p-[22px] mb-5">
        <p className="text-[13px] font-bold tracking-wide text-partner-violet uppercase mb-4">Contraseña</p>
        <label className="text-xs text-partner-ink-muted block mb-1">Nueva contraseña</label>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          name="partner-new-password"
          variant="violet"
        />
        {password && <PartnerPasswordChecklist password={password} />}
        {passwordError && <p className="text-sm text-red-500 mt-2">{passwordError}</p>}
        <button
          onClick={handleGuardarPassword}
          disabled={passwordSaving || !password}
          className="mt-3.5 text-white text-sm font-bold px-4 py-2.5 rounded-full transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
          style={{ background: "var(--partner-gradient)" }}
        >
          {passwordSaving ? "Guardando…" : "Actualizar contraseña"}
        </button>
        {passwordSaved && <span className="text-sm text-partner-green-text ml-3">Actualizada ✓</span>}
      </div>

      <div className="bg-white/72 backdrop-blur-md rounded-[22px] shadow-[0_6px_26px_rgba(91,33,182,0.10)] p-[22px] mb-5">
        <p className="text-[13px] font-bold tracking-wide text-partner-violet uppercase mb-4">Notificaciones</p>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.notifRecordatoriosEmail}
            onChange={handleToggleNotif}
            disabled={notifSaving}
            className="w-4 h-4 accent-[#7c3aed]"
          />
          <span className="text-sm text-partner-ink-secondary">Recibir recordatorios de citas por email</span>
        </label>
      </div>

      <button
        onClick={onLogout}
        className="inline-flex items-center gap-1.5 text-sm text-partner-violet hover:text-partner-violet-deep font-semibold cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" strokeWidth={1.8} />
        Cerrar sesión
      </button>
    </div>
  );
}
