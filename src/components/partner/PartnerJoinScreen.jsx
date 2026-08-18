import { useState } from "react";
import { Users } from "lucide-react";
import { acceptInvite } from "../../data/partner";
import { PasswordInput, PASSWORD_RULES } from "../auth/PasswordInput";
import PartnerPasswordChecklist from "./PartnerPasswordChecklist";

const inputClass =
  "w-full border border-partner-dashed-border rounded-xl p-3 text-[15px] text-partner-ink focus:outline-none focus:border-partner-violet";

export default function PartnerJoinScreen({ token, onJoined }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!PASSWORD_RULES.every((rule) => rule.test(password))) {
      setError("La contraseña no cumple con todos los requisitos.");
      return;
    }

    setLoading(true);
    const result = await acceptInvite({ token, nombre, email, password });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onJoined();
  };

  return (
    <div
      className="min-h-dvh flex items-center justify-center px-5 py-8 box-border"
      style={{ background: "var(--partner-gradient-page)" }}
    >
      <div className="w-full max-w-[400px]">
        <div className="flex items-center justify-center gap-2.5 mb-[22px]">
          <span className="w-[34px] h-[34px] rounded-full bg-partner-violet/16 flex items-center justify-center text-partner-violet shrink-0">
            <Users className="w-4 h-4" strokeWidth={1.8} />
          </span>
          <span className="font-heading text-[17px] font-extrabold text-partner-ink">Mamá App · Partner</span>
        </div>

        <div className="bg-white rounded-[22px] shadow-[0_12px_32px_rgba(46,42,53,0.1)] p-[30px_26px]">
          <h2 className="font-heading text-[21px] font-extrabold text-partner-ink mb-1.5">
            Te invitaron a acompañar
          </h2>
          <p className="text-[13.5px] text-partner-ink-muted mb-[22px] leading-relaxed">
            Vas a poder ver las citas médicas que comparta con vos, sus síntomas recientes y las
            notas que te quiera mandar.
          </p>

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-4">
              <label className="text-[12.5px] font-semibold text-partner-ink-muted block mb-1.5">Tu nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className={inputClass}
                autoComplete="off"
                name="partner-nombre"
              />
            </div>

            <div className="mb-4">
              <label className="text-[12.5px] font-semibold text-partner-ink-muted block mb-1.5">Tu email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className={inputClass}
                autoComplete="off"
                name="partner-email"
              />
              <p className="text-xs text-partner-ink-faint mt-1.5">Acá te van a llegar los avisos y recordatorios.</p>
            </div>

            <div className="mb-4">
              <label className="text-[12.5px] font-semibold text-partner-ink-muted block mb-1.5">
                Elegí una contraseña
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                name="partner-password"
                variant="violet"
              />
              {password && <PartnerPasswordChecklist password={password} />}
            </div>

            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white text-[15.5px] font-bold py-3.5 rounded-full transition-opacity hover:opacity-90 disabled:opacity-60 mt-1.5 cursor-pointer"
              style={{ background: "var(--partner-gradient)" }}
            >
              {loading ? "Un momento…" : "Aceptar invitación"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
