import { useEffect, useState } from "react";
import { ChevronLeft, Users, Link2 } from "lucide-react";
import PartnerAmbientBlobs from "./PartnerAmbientBlobs";
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

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(status.pendingInvite.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("No se pudo copiar el link. Seleccionalo y copialo manualmente.");
    }
  };

  const handleRevocar = async () => {
    await revokeInvite(status.pendingInvite.token);
    refresh();
  };

  const handleQuitarPartner = async () => {
    if (!window.confirm(`¿Quitar a ${status.nombre} como partner? Va a dejar de ver tus citas, síntomas y notas.`)) {
      return;
    }
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
    <div className="relative">
      <PartnerAmbientBlobs />
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Volver"
          title="Volver"
          className="w-10 h-10 rounded-full bg-partner-violet/12 flex items-center justify-center text-partner-violet mb-5 hover:bg-partner-violet/20 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-[17px] h-[17px]" strokeWidth={1.8} />
        </button>
      )}

      <div className="flex items-center gap-2.5 mb-1.5">
        <Users className="w-6 h-6 text-partner-violet shrink-0" strokeWidth={1.7} />
        <h2 className="font-heading text-[26px] font-extrabold text-partner-ink">Tu partner</h2>
      </div>
      <p className="text-[15px] text-partner-ink-muted mb-6">
        Compartí citas, síntomas y notas con quien te acompaña.
      </p>

      {status.hasPartner ? (
        <div className="bg-white/72 backdrop-blur-md rounded-[22px] shadow-[0_6px_26px_rgba(91,33,182,0.10)] p-[22px] mb-5">
          <p className="text-[13px] font-bold tracking-wide text-partner-violet uppercase mb-3.5">
            Partner vinculado
          </p>
          <div className="flex items-center justify-between flex-wrap gap-3.5">
            <div className="flex items-center gap-3">
              <span className="w-[42px] h-[42px] rounded-full bg-partner-violet/14 flex items-center justify-center text-partner-violet shrink-0">
                <Users className="w-[19px] h-[19px]" strokeWidth={1.8} />
              </span>
              <div>
                <p className="text-base font-bold text-partner-ink">{status.nombre}</p>
                <p className="text-[13px] text-partner-ink-muted mt-0.5">{status.email}</p>
              </div>
            </div>
            <button
              onClick={handleQuitarPartner}
              className="text-sm font-semibold text-partner-ink-muted hover:text-partner-violet-deep cursor-pointer"
            >
              Quitar partner
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white/72 backdrop-blur-md rounded-[22px] shadow-[0_6px_26px_rgba(91,33,182,0.10)] p-[22px] mb-5">
          <p className="text-[13px] font-bold tracking-wide text-partner-violet uppercase mb-3">
            {status.pendingInvite ? "Invitación pendiente" : "Invitar a tu partner"}
          </p>

          {status.pendingInvite ? (
            <div>
              <p className="text-sm text-partner-ink-secondary mb-3.5">
                Mandale este link para que se una (válido por unos días):
              </p>
              <div className="flex items-center gap-2 mb-3.5 flex-wrap">
                <input
                  readOnly
                  value={status.pendingInvite.url}
                  className="flex-1 min-w-0 border border-partner-dashed-border rounded-xl bg-partner-surface-tint p-2.5 text-xs text-partner-ink-secondary"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  onClick={handleCopiar}
                  className="text-white text-sm font-bold px-[18px] py-2.5 rounded-full transition-opacity hover:opacity-90 whitespace-nowrap cursor-pointer"
                  style={{ background: "var(--partner-gradient)" }}
                >
                  {copied ? "Copiado ✓" : "Copiar"}
                </button>
              </div>
              <button
                onClick={handleRevocar}
                className="text-sm font-semibold text-partner-ink-muted hover:text-partner-violet-deep cursor-pointer"
              >
                Revocar este link
              </button>
              {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
            </div>
          ) : (
            <div>
              <p className="text-sm text-partner-ink-secondary mb-[18px] leading-relaxed">
                Generá un link único y mandaselo por WhatsApp o como prefieras. Solo con ese link
                puede crear su cuenta de partner.
              </p>
              <button
                onClick={handleGenerarLink}
                disabled={creating}
                className="inline-flex items-center gap-2 text-white text-[15px] font-bold px-[22px] py-3 rounded-full transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
                style={{ background: "var(--partner-gradient)" }}
              >
                <Link2 className="w-4 h-4" strokeWidth={1.8} />
                {creating ? "Generando…" : "Generar link de invitación"}
              </button>
              {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
            </div>
          )}
        </div>
      )}

      {status.hasPartner && (
        <div className="bg-white/72 backdrop-blur-md rounded-[22px] shadow-[0_6px_26px_rgba(91,33,182,0.10)] p-[22px]">
          <p className="text-[13px] font-bold tracking-wide text-partner-violet uppercase mb-3.5">
            Mandarle una nota
          </p>
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej: hoy me sentí mejor, gracias por acompañarme"
            className="w-full min-h-[78px] rounded-2xl border border-partner-dashed-border bg-partner-surface-tint p-3.5 text-sm text-partner-ink focus:outline-none focus:border-partner-violet focus:bg-white resize-none mb-3"
            rows={3}
          />
          <button
            onClick={handleEnviarNota}
            disabled={enviando || !nota.trim()}
            className="text-white text-sm font-bold px-5 py-2.5 rounded-full transition-opacity hover:opacity-90 disabled:opacity-60 mb-5 cursor-pointer"
            style={{ background: "var(--partner-gradient)" }}
          >
            {enviando ? "Enviando…" : "Enviar nota"}
          </button>

          {notas.length > 0 && (
            <div>
              <p className="text-xs text-partner-ink-faint mb-2.5">Notas enviadas</p>
              <div className="flex flex-col gap-2">
                {notas.map((n) => (
                  <div
                    key={n.id}
                    className="bg-partner-surface-tint rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-[#3d3646]">{n.texto}</span>
                    <span
                      className={`text-xs whitespace-nowrap ${
                        n.leida_at ? "font-semibold text-partner-ink-muted" : "font-bold text-partner-violet-deep"
                      }`}
                    >
                      {n.leida_at ? "Leída ✓" : "No leída"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
