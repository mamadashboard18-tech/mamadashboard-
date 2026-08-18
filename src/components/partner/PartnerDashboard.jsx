import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
import { fetchPartnerData, sendRsvp } from "../../data/partner";
import { logout } from "../../data/auth";
import PartnerAmbientBlobs from "./PartnerAmbientBlobs";
import PartnerSidebar from "./PartnerSidebar";
import PartnerBottomNav from "./PartnerBottomNav";
import PartnerInicio from "./PartnerInicio";
import PartnerCitas from "./PartnerCitas";
import PartnerMultimedia from "./PartnerMultimedia";
import PartnerProfile from "./PartnerProfile";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isDesktop;
}

export default function PartnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("inicio");
  const isDesktop = useIsDesktop();

  const load = () => {
    setLoading(true);
    if (new URLSearchParams(window.location.search).has("__dev_mock")) {
      const today = new Date();
      const iso = (d) => d.toISOString().slice(0, 10);
      const plus = (n) => {
        const d = new Date(today);
        d.setDate(d.getDate() + n);
        return d;
      };
      setLoading(false);
      setData({
        motherNombre: "Valentina",
        semanaActual: 28,
        citas: [
          { id: "c1", fecha: iso(plus(5)), hora: "10:30", tipo: "Ecografía morfológica", medico: "Dra. Laura Paz", lugar: "Sanatorio Mater", partner_rsvp: null },
          { id: "c2", fecha: iso(plus(11)), hora: "18:00", tipo: "Curso de preparto", medico: "", lugar: "Centro Materno", partner_rsvp: "puede" },
        ],
        sintomas: [
          {
            fecha: iso(today),
            sintomas: ["Náuseas matutinas", "Cansancio"],
          },
          {
            fecha: iso(plus(-1)),
            sintomas: ["Dolor de espalda"],
          },
        ],
        notas: [
          { id: "n1", texto: "Hoy me sentí mejor, gracias por acompañarme", created_at: new Date().toISOString() },
          { id: "n2", texto: "¿Podés pasar a buscar las vitaminas que me recetó la doctora?", created_at: iso(plus(-2)) },
        ],
      });
      return;
    }
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

  if (loading) return null;

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  const citasPendientesRsvp = data.citas.filter((c) => !c.partner_rsvp).length;
  const handleLogout = () => logout();

  return (
    <div className="relative flex h-dvh bg-white text-partner-ink overflow-x-hidden">
      <PartnerAmbientBlobs />

      <PartnerSidebar
        active={active}
        onSelect={setActive}
        onLogout={handleLogout}
        motherNombre={data.motherNombre}
        citasPendientesRsvp={citasPendientesRsvp}
      />

      <div className="relative z-10 flex-1 min-w-0 flex flex-col">
        <div className="sticky top-0 z-20 lg:hidden bg-white/70 backdrop-blur-md border-b border-partner-border px-[18px] py-3.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wide text-partner-violet uppercase">
              Acompañando a
            </p>
            <p className="font-heading text-base font-extrabold text-partner-ink mt-0.5">
              {data.motherNombre || "tu pareja"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActive("perfil")}
              aria-label="Tu perfil"
              title="Tu perfil"
              className="w-[38px] h-[38px] rounded-full bg-partner-violet/12 flex items-center justify-center text-partner-violet cursor-pointer"
            >
              <User className="w-4 h-4" strokeWidth={1.8} />
            </button>
            <button
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="w-[38px] h-[38px] rounded-full bg-partner-violet/12 flex items-center justify-center text-partner-violet cursor-pointer"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-[18px] py-5 pb-[110px] lg:px-10 lg:py-10 lg:pb-[60px]">
          <div className="lg:max-w-[680px] lg:mx-auto">
            {active === "perfil" ? (
              <PartnerProfile
                motherNombre={data.motherNombre}
                onBack={() => setActive("inicio")}
                onLogout={handleLogout}
              />
            ) : active === "citas" ? (
              <PartnerCitas data={data} onRsvp={handleRsvp} />
            ) : active === "multimedia" ? (
              <PartnerMultimedia />
            ) : (
              <PartnerInicio data={data} />
            )}
          </div>
        </main>
      </div>

      {!isDesktop && (
        <PartnerBottomNav
          active={active}
          onSelect={setActive}
          citasPendientesRsvp={citasPendientesRsvp}
        />
      )}
    </div>
  );
}
