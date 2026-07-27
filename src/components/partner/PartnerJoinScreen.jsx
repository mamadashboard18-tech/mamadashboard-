import { useState } from "react";
import { acceptInvite } from "../../data/partner";

const inputClass =
  "w-full border border-rose-100 rounded-xl p-2.5 text-sm text-gray-700 focus:outline-none focus:border-rose-300";

export default function PartnerJoinScreen({ token, onJoined }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl">👥</span>
          <span className="font-semibold text-gray-900">Mamá App · Partner</span>
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-7">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Te invitaron a acompañar</h2>
          <p className="text-xs text-gray-500 mb-5">
            Vas a poder ver las citas médicas que comparta con vos, sus síntomas recientes y las
            notas que te quiera mandar.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="text-xs text-gray-500 block mb-1">Tu nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className={inputClass}
              />
            </div>

            <div className="mb-3">
              <label className="text-xs text-gray-500 block mb-1">Tu email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">Acá te van a llegar los avisos y recordatorios.</p>
            </div>

            <div className="mb-3">
              <label className="text-xs text-gray-500 block mb-1">Elegí una contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">Al menos 6 caracteres.</p>
            </div>

            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-500 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-60"
            >
              {loading ? "Un momento…" : "Aceptar invitación"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
