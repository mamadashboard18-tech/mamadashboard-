import { useEffect, useState } from "react";
import Header from "../Header";
import {
  getPartnerStatus,
  createInvite,
  revokeInvite,
  removePartner,
  sendPartnerNote,
  listPartnerNotes,
} from "../../data/partner";

export default function PartnerManagement({ onBack }) {
  const [status, setStatus] = useState(null);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [nota, setNota] = useState("");
  const [notas, setNotas] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const refresh = () => {
    getPartnerStatus().then(setStatus);
  };

  useEffect(refresh, []);

  useEffect(() => {
    if (status?.hasPartner) {
      listPartnerNotes().then(setNotas);
    }
  }, [status?.hasPartner]);

  const handleGenerarLink = async () => {
    setError("");
    setCreating(true);
    const result = await createInvite();
    setCreating(false);
    if (result.ok) {
      refresh();
    } else {
      setError(result.error || "No se pudo generar el link.");
    }
  };

  const handleCopiar = () => {
    navigator.clipboard.writeText(status.pendingInvite.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevocar = async () => {
    await revokeInvite(status.pendingInvite.token);
    refresh();
  };

  const handleQuitarPartner = async () => {
    await removePartner();
    refresh();
  };

  const handleEnviarNota = async () => {
    if (!nota.trim()) return;
    setEnviando(true);
    const result = await sendPartnerNote(nota);
    setEnviando(false);
    if (result.ok) {
      setNota("");
      listPartnerNotes().then(setNotas);
    }
  };

  if (!status) return null;

  return (
    <div>
      {onBack && (
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-rose-500 mb-4 flex items-center gap-1"
        >
          ← Volver
        </button>
      )}

      <Header
        title="👥 Tu partner"
        subtitle="Invitá a tu acompañante para que vea tus citas, síntomas y reciba tus notas"
      />

      {status.hasPartner ? (
        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm mb-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Partner vinculado
          </p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{status.nombre}</p>
              <p className="text-xs text-gray-500">{status.email}</p>
            </div>
            <button
              onClick={handleQuitarPartner}
              className="text-sm text-gray-400 hover:text-red-500 hover:underline"
            >
              Quitar partner
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm mb-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Invitar a tu partner
          </p>

          {status.pendingInvite ? (
            <div>
              <p className="text-sm text-gray-700 mb-2">
                Mandale este link para que se una (válido por unos días):
              </p>
              <div className="flex items-center gap-2 mb-3">
                <input
                  readOnly
                  value={status.pendingInvite.url}
                  className="flex-1 border border-rose-100 rounded-xl p-2.5 text-xs text-gray-600 bg-rose-50/50"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  onClick={handleCopiar}
                  className="bg-rose-500 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-rose-600 transition-colors whitespace-nowrap"
                >
                  {copied ? "Copiado ✓" : "Copiar"}
                </button>
              </div>
              <button
                onClick={handleRevocar}
                className="text-sm text-gray-400 hover:text-red-500 hover:underline"
              >
                Revocar este link
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Generá un link único y mandaselo por WhatsApp o como prefieras. Solo con ese link
                puede crear su cuenta de partner.
              </p>
              <button
                onClick={handleGenerarLink}
                disabled={creating}
                className="bg-rose-500 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-60"
              >
                {creating ? "Generando…" : "Generar link de invitación"}
              </button>
              {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
            </div>
          )}
        </div>
      )}

      {status.hasPartner && (
        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Mandarle una nota
          </p>
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej: hoy me sentí mejor, gracias por acompañarme"
            className="w-full border border-rose-100 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:border-rose-300 resize-none mb-3"
            rows={3}
          />
          <button
            onClick={handleEnviarNota}
            disabled={enviando || !nota.trim()}
            className="bg-rose-500 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-60 mb-5"
          >
            {enviando ? "Enviando…" : "Enviar nota"}
          </button>

          {notas.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2">Notas enviadas</p>
              <ul className="space-y-2">
                {notas.map((n) => (
                  <li
                    key={n.id}
                    className="bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 text-sm text-gray-700"
                  >
                    {n.texto}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
