import { useEffect, useState } from "react";
import { Users, Link2, Check, Send, HeartHandshake } from "lucide-react";
import { PantallaTop, SectionLabel } from "../ui/Perfil";
import { cardShadow, textareaClass } from "../ui/estilos";
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
    <div>
      <PantallaTop
        onBack={onBack}
        icon={Users}
        title="Tu partner"
        subtitle="Compartí citas, síntomas y notas con quien te acompaña."
      />

      {status.hasPartner ? (
        <div className="bg-white rounded-[24px] border border-[var(--border-soft)] p-5 mb-5" style={cardShadow}>
          <SectionLabel icon={HeartHandshake} className="mb-4">Partner vinculado</SectionLabel>
          <div className="flex items-center justify-between flex-wrap gap-3.5">
            <div className="flex items-center gap-3">
              <span
                className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ background: "var(--gradient-hero)" }}
              >
                {(status.nombre || "?").trim().charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-base font-bold text-ink">{status.nombre}</p>
                <p className="text-[13px] text-ink-muted mt-0.5">{status.email}</p>
              </div>
            </div>
            <button
              onClick={handleQuitarPartner}
              className="text-sm font-semibold text-ink-muted hover:text-brand-pink cursor-pointer"
            >
              Quitar partner
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] border border-[var(--border-soft)] p-5 mb-5" style={cardShadow}>
          <SectionLabel icon={Link2}>
            {status.pendingInvite ? "Invitación pendiente" : "Invitar a tu partner"}
          </SectionLabel>

          {status.pendingInvite ? (
            <div>
              <p className="text-sm text-ink-muted mb-3.5">
                Mandale este link para que se una (válido por unos días):
              </p>
              <div className="flex items-center gap-2 mb-3.5 flex-wrap">
                <input
                  readOnly
                  value={status.pendingInvite.url}
                  className="flex-1 min-w-0 rounded-full border border-[rgba(155,93,229,0.18)] bg-[var(--bg)] px-4 py-2.5 text-xs text-ink-muted"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  onClick={handleCopiar}
                  className="text-white text-sm font-bold px-[18px] py-2.5 rounded-full transition-opacity hover:opacity-90 whitespace-nowrap cursor-pointer"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  {copied ? <>Copiado<Check className="w-3.5 h-3.5 inline -mt-0.5 ml-1" strokeWidth={2.4} /></> : "Copiar"}
                </button>
              </div>
              <button
                onClick={handleRevocar}
                className="text-sm font-semibold text-ink-muted hover:text-brand-pink cursor-pointer"
              >
                Revocar este link
              </button>
              {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
            </div>
          ) : (
            <div>
              <p className="text-sm text-ink-muted mb-[18px] leading-relaxed">
                Generá un link único y mandaselo por WhatsApp o como prefieras. Solo con ese link
                puede crear su cuenta de partner.
              </p>
              <button
                onClick={handleGenerarLink}
                disabled={creating}
                className="inline-flex items-center gap-2 text-white text-[15px] font-bold px-[22px] py-3 rounded-full transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
                style={{ background: "var(--gradient-hero)" }}
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
        <div className="bg-white rounded-[24px] border border-[var(--border-soft)] p-5" style={cardShadow}>
          <SectionLabel icon={Send}>Mandarle una nota</SectionLabel>
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej: hoy me sentí mejor, gracias por acompañarme"
            className={`${textareaClass} min-h-[90px] mb-3`}
            rows={3}
          />
          <button
            onClick={handleEnviarNota}
            disabled={enviando || !nota.trim()}
            className="text-white text-sm font-bold px-5 py-2.5 rounded-full transition-opacity hover:opacity-90 disabled:opacity-60 mb-5 cursor-pointer"
            style={{ background: "var(--gradient-hero)" }}
          >
            {enviando ? "Enviando…" : "Enviar nota"}
          </button>

          {notas.length > 0 && (
            <div>
              <p className="text-xs text-ink-muted mb-2.5">Notas enviadas</p>
              <div className="flex flex-col gap-2">
                {notas.map((n) => (
                  <div
                    key={n.id}
                    className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-[18px] px-3.5 py-2.5 flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-ink">{n.texto}</span>
                    <span
                      className={`text-xs whitespace-nowrap ${
                        n.leida_at ? "font-semibold text-ink-muted" : "font-bold text-brand-pink"
                      }`}
                    >
                      {n.leida_at ? <>Leída<Check className="w-3.5 h-3.5 inline -mt-0.5 ml-1" strokeWidth={2.4} /></> : "No leída"}
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
