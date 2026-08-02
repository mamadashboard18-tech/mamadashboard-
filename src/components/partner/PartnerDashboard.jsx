import { useEffect, useState } from "react";
import { fetchPartnerData, sendRsvp, marcarNotaLeida } from "../../data/partner";
import { logout } from "../../data/auth";
import PartnerSidebar from "./PartnerSidebar";
import PartnerInicio from "./PartnerInicio";
import PartnerCitas from "./PartnerCitas";
import PartnerMultimedia from "./PartnerMultimedia";

export default function PartnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("inicio");

  const load = () => {
    setLoading(true);
    fetchPartnerData().then((result) => {
      setLoading(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setData(result);
    });
  };

  useEffect(load, []);

  const handleRsvp = async (citaId, respuesta) => {
    setData((prev) => ({
      ...prev,
      citas: prev.citas.map((c) => (c.id === citaId ? { ...c, partner_rsvp: respuesta } : c)),
    }));
    await sendRsvp(citaId, respuesta);
  };

  const handleMarcarNotaLeida = async (notaId) => {
    setData((prev) => ({
      ...prev,
      notas: prev.notas.map((n) => (n.id === notaId ? { ...n, leida_at: new Date().toISOString() } : n)),
    }));
    await marcarNotaLeida(notaId);
  };

  if (loading) return null;

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  const citasPendientesRsvp = data.citas.filter((c) => !c.partner_rsvp).length;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      <PartnerSidebar
        active={active}
        onSelect={setActive}
        onLogout={() => logout()}
        motherNombre={data.motherNombre}
        citasPendientesRsvp={citasPendientesRsvp}
      />
      <main className="flex-1 p-8 max-w-3xl overflow-y-auto">
        {active === "citas" ? (
          <PartnerCitas data={data} onRsvp={handleRsvp} />
        ) : active === "multimedia" ? (
          <PartnerMultimedia />
        ) : (
          <PartnerInicio data={data} onMarcarNotaLeida={handleMarcarNotaLeida} />
        )}
      </main>
    </div>
  );
}
