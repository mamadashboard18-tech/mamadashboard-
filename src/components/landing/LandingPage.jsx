import { useState } from "react";
import { pilares, secciones, partnerPoints } from "../../data/landingContent";

/* Design tokens — from design_handoff_landing/README.md (hifi, final values) */
const C = {
  bg: "#fdf6fa",
  ink: "#241d2b",
  paragraph: "#5c5266",
  muted: "#71667a",
  faint: "#857d93",
  veryFaint: "#a89fb0",
  hairline: "#c9c0d0",
  rose: "#ff6f9f",
  pink: "#e26fce",
  purple: "#9b5de5",
  purpleGrad: "#9b6ee0",
  peach: "#ff9a6a",
  border: "rgba(155,93,229,0.15)",
};

const gradientBrand = `linear-gradient(135deg,${C.rose} 0%,${C.pink} 55%,${C.purpleGrad} 100%)`;
const gradientBrandPanel = `linear-gradient(160deg,${C.rose} 0%,${C.pink} 55%,${C.purpleGrad} 100%)`;
const gradientText = `linear-gradient(120deg,${C.rose} 0%,${C.pink} 45%,${C.purpleGrad} 100%)`;
const gradientNumber = `linear-gradient(135deg,${C.rose},${C.purpleGrad})`;

const TOTAL_WEEKS = 40;

function Icon({ path, size = 24, stroke = C.pink, strokeWidth = 1.5, style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

function WeekCard({ week, setWeek }) {
  const trimester = week <= 13 ? "Primer trimestre" : week <= 27 ? "Segundo trimestre" : "Tercer trimestre";
  const restantes = TOTAL_WEEKS - week;
  const faltan = restantes === 0 ? "Última semana" : `Faltan ${restantes} semanas`;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: `1px solid ${C.border}`,
        borderRadius: 30,
        padding: "clamp(24px,3vw,32px)",
        boxShadow: "0 20px 50px rgba(155,93,229,0.14)",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 mb-[26px]">
        <div>
          <p
            className="uppercase"
            style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", color: C.veryFaint, margin: "0 0 6px" }}
          >
            Tu embarazo
          </p>
          <p
            className="font-heading whitespace-nowrap"
            style={{ fontSize: "clamp(26px,3vw,34px)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em", color: C.ink }}
          >
            Semana {week} <span style={{ color: C.veryFaint, fontWeight: 700 }}>de {TOTAL_WEEKS}</span>
          </p>
        </div>
        <span
          className="uppercase whitespace-nowrap"
          style={{ color: C.pink, fontSize: 13, fontWeight: 700, letterSpacing: "0.04em" }}
        >
          {trimester}
        </span>
      </div>

      <div className="flex items-end gap-[2px] h-[74px] mb-3">
        {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map((n) => {
          const active = n <= week;
          const isCurrent = n === week;
          const h = 22 + Math.round((n / TOTAL_WEEKS) * 46);
          const bg = isCurrent ? C.purple : active ? `linear-gradient(180deg,${C.rose},${C.pink})` : "rgba(155,93,229,0.16)";
          return (
            <button
              key={n}
              onClick={() => setWeek(n)}
              aria-label={`Semana ${n}`}
              className="cursor-pointer"
              style={{
                flex: 1,
                minWidth: 0,
                height: isCurrent ? 74 : h,
                border: "none",
                padding: 0,
                borderRadius: 999,
                background: bg,
                opacity: active ? 1 : 0.9,
                transition: "height .18s ease, background .18s ease",
              }}
            />
          );
        })}
      </div>
      <div className="flex justify-between" style={{ fontSize: 12, fontWeight: 600, color: C.veryFaint }}>
        <span>Semana 1</span>
        <span>20</span>
        <span>40</span>
      </div>
      <div
        className="flex items-center justify-between gap-3.5 mt-6 pt-[22px]"
        style={{ borderTop: `1px solid ${C.border}` }}
      >
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>Tocá cualquier semana de la línea.</p>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.purple }}>{faltan}</span>
      </div>
    </div>
  );
}

export default function LandingPage({ onGoToAuth, onDevPreview }) {
  const [week, setWeek] = useState(24);

  return (
    <div style={{ background: C.bg, fontFamily: "Inter, system-ui, sans-serif", color: C.ink, overflowX: "hidden" }}>
      <style>{`html{scroll-behavior:smooth}`}</style>

      <header
        className="sticky top-0 z-20"
        style={{
          background: "rgba(253,246,250,0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div className="max-w-[1120px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <span className="font-heading cursor-default" style={{ fontSize: 20, fontWeight: 800, color: C.ink, letterSpacing: "-0.01em" }}>
            Mamá App
          </span>
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => onGoToAuth("login")}
              className="cursor-pointer transition-colors hover:text-[#e26fce]"
              style={{ fontSize: 15, fontWeight: 600, color: C.muted }}
            >
              Ya tengo cuenta
            </button>
            <a
              href="#crear"
              className="cursor-pointer transition-[filter] hover:brightness-105 whitespace-nowrap"
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                textDecoration: "none",
                padding: "11px 20px",
                borderRadius: 999,
                background: gradientBrand,
                boxShadow: "0 8px 20px rgba(226,111,206,0.3)",
              }}
            >
              Crear cuenta
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full" style={{ top: -140, left: -90, width: 420, height: 420, background: C.rose, opacity: 0.22, filter: "blur(90px)" }} />
          <div className="absolute rounded-full" style={{ top: -60, right: -120, width: 460, height: 460, background: C.purple, opacity: 0.18, filter: "blur(100px)" }} />
          <div className="absolute rounded-full" style={{ bottom: -160, left: "35%", width: 380, height: 380, background: C.peach, opacity: 0.16, filter: "blur(100px)" }} />
        </div>
        <div
          className="relative z-[1] max-w-[1120px] mx-auto grid items-center [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
          style={{ padding: "clamp(56px,9vw,110px) 24px clamp(48px,7vw,86px)", gap: "clamp(36px,5vw,64px)" }}
        >
          <div>
            <p className="uppercase" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: C.pink, margin: "0 0 20px" }}>
              Mamá App — un diario para cada semana
            </p>
            <h1
              className="font-heading text-pretty"
              style={{ fontSize: "clamp(38px,5.4vw,64px)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.03em", margin: "0 0 22px" }}
            >
              No vas a recordar cada semana.
              <br />
              <span
                style={{
                  background: gradientText,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Nosotras sí.
              </span>
            </h1>
            <p className="text-pretty" style={{ fontSize: "clamp(17px,1.6vw,20px)", lineHeight: 1.6, color: C.paragraph, margin: "0 0 30px", maxWidth: "32em" }}>
              Mamá App es tu diario de embarazo: seguimiento semana a semana, un espacio para tu
              bienestar emocional y todo organizado en un solo lugar — sin vueltas, sin apps de
              más.
            </p>
            <div className="flex flex-wrap items-center gap-[18px]">
              <a
                href="#crear"
                className="cursor-pointer transition-[filter] hover:brightness-105"
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#fff",
                  textDecoration: "none",
                  padding: "16px 30px",
                  borderRadius: 999,
                  background: gradientBrand,
                  boxShadow: "0 14px 32px rgba(226,111,206,0.34)",
                }}
              >
                Empezar mi diario
              </a>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: C.faint, margin: 0, maxWidth: "24em" }}>
                Gratis para empezar. No reemplaza a tu médico — te acompaña entre consulta y
                consulta.
              </p>
            </div>
          </div>

          <WeekCard week={week} setWeek={setWeek} />
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="relative overflow-hidden" style={{ background: gradientBrandPanel }}>
        <div aria-hidden="true" className="absolute rounded-full" style={{ top: -120, right: -80, width: 420, height: 420, background: "radial-gradient(circle,rgba(255,255,255,0.3) 0%,rgba(255,255,255,0) 70%)", filter: "blur(40px)" }} />
        <div aria-hidden="true" className="absolute rounded-full" style={{ bottom: -160, left: -100, width: 460, height: 460, background: "radial-gradient(circle,rgba(255,154,106,0.4) 0%,rgba(255,154,106,0) 70%)", filter: "blur(50px)" }} />
        <div className="relative z-[1] max-w-[980px] mx-auto" style={{ padding: "clamp(72px,12vw,140px) 24px" }}>
          <p className="font-heading text-pretty" style={{ fontWeight: 700, fontSize: "clamp(26px,3.6vw,46px)", lineHeight: 1.26, letterSpacing: "-0.02em", color: "#fff", margin: 0 }}>
            “No es una libreta más. Es el lugar donde vas a poner en palabras cada semana — la
            que fue linda y la que costó.”
          </p>
        </div>
      </section>

      {/* POR QUÉ MAMÁ APP */}
      <section className="max-w-[1120px] mx-auto" style={{ padding: "clamp(64px,9vw,110px) 24px" }}>
        <p className="uppercase" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: C.pink, margin: "0 0 44px" }}>
          Por qué Mamá App
        </p>
        <div className="flex flex-col">
          {pilares.map((p, i) => (
            <div
              key={p.number}
              className="grid [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
              style={{
                gap: "clamp(12px,3vw,48px)",
                paddingTop: i === 0 ? 0 : 34,
                paddingBottom: i === pilares.length - 1 ? 0 : 34,
                borderBottom: i === pilares.length - 1 ? "none" : `1px solid ${C.border}`,
              }}
            >
              <div className="flex items-baseline gap-[18px]">
                <span
                  className="font-heading"
                  style={{
                    fontSize: "clamp(30px,3.4vw,40px)",
                    fontWeight: 800,
                    lineHeight: 1,
                    background: gradientNumber,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {p.number}
                </span>
                <h3 className="font-heading text-pretty" style={{ fontSize: "clamp(21px,2.2vw,27px)", fontWeight: 800, lineHeight: 1.24, letterSpacing: "-0.02em", margin: 0 }}>
                  {p.title}
                </h3>
              </div>
              <p className="text-pretty self-center" style={{ fontSize: 17, lineHeight: 1.65, color: C.paragraph, margin: 0 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ADENTRO DE LA APP */}
      <section className="bg-white" style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-[1120px] mx-auto" style={{ padding: "clamp(64px,9vw,110px) 24px" }}>
          <div className="flex items-end justify-between gap-5 flex-wrap mb-10">
            <h2 className="font-heading" style={{ fontSize: "clamp(28px,3.4vw,42px)", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>
              Adentro de la app
            </h2>
            <p style={{ fontSize: 15, color: C.faint, margin: 0 }}>6 áreas, todo en un solo lugar</p>
          </div>
          <div className="flex flex-col">
            {secciones.map((s, i) =>
              s.comingSoon ? (
                <div
                  key={s.title}
                  className="grid items-start grid-cols-[34px_1fr] sm:[grid-template-columns:34px_minmax(150px,1fr)_minmax(240px,1.6fr)]"
                  style={{
                    gap: "clamp(12px,2vw,28px)",
                    padding: "26px 4px",
                    borderTop: `1px solid ${C.border}`,
                    borderBottom: i === secciones.length - 1 ? `1px solid ${C.border}` : "none",
                  }}
                >
                  <Icon path={s.iconPath} stroke={C.hairline} style={{ marginTop: 2 }} />
                  <span className="flex flex-col gap-1">
                    <span className="font-heading" style={{ fontSize: "clamp(19px,2vw,23px)", fontWeight: 800, letterSpacing: "-0.02em", color: C.veryFaint }}>
                      {s.title}
                    </span>
                    <span className="uppercase" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.purple }}>
                      Muy pronto
                    </span>
                  </span>
                  <span className="text-pretty col-span-2 sm:col-span-1" style={{ fontSize: 16, lineHeight: 1.6, color: C.faint }}>
                    {s.desc}
                  </span>
                </div>
              ) : (
                <a
                  key={s.title}
                  href="#crear"
                  className="group grid items-start grid-cols-[34px_1fr] sm:[grid-template-columns:34px_minmax(150px,1fr)_minmax(240px,1.6fr)] no-underline"
                  style={{ gap: "clamp(12px,2vw,28px)", padding: "26px 4px", borderTop: `1px solid ${C.border}`, color: C.ink }}
                >
                  <Icon path={s.iconPath} style={{ marginTop: 2 }} />
                  <span
                    className="font-heading transition-colors group-hover:text-[#e26fce]"
                    style={{ fontSize: "clamp(19px,2vw,23px)", fontWeight: 800, letterSpacing: "-0.02em" }}
                  >
                    {s.title}
                  </span>
                  <span className="text-pretty col-span-2 sm:col-span-1" style={{ fontSize: 16, lineHeight: 1.6, color: C.paragraph }}>
                    {s.desc}
                  </span>
                </a>
              )
            )}
          </div>
        </div>
      </section>

      {/* MODO ACOMPAÑANTE */}
      <section className="relative overflow-hidden" style={{ background: "var(--partner-gradient)" }}>
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full" style={{ top: -140, left: -90, width: 420, height: 420, background: "radial-gradient(circle,rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 70%)", filter: "blur(50px)" }} />
          <div className="absolute rounded-full" style={{ bottom: -160, right: -70, width: 440, height: 440, background: "radial-gradient(circle,rgba(201,182,242,0.55) 0%,rgba(201,182,242,0) 70%)", filter: "blur(60px)" }} />
        </div>
        <div
          className="relative z-[1] max-w-[1120px] mx-auto grid items-start [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
          style={{ padding: "clamp(64px,9vw,110px) 24px", gap: "clamp(36px,5vw,64px)" }}
        >
          <div>
            <p className="uppercase" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "#fff", opacity: 0.9, margin: "0 0 22px" }}>
              Modo acompañante
            </p>
            <h2 className="font-heading text-pretty" style={{ fontSize: "clamp(30px,3.8vw,48px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.03em", color: "#fff", margin: "0 0 20px" }}>
              Tu pareja tampoco se queda afuera.
            </h2>
            <p className="text-pretty" style={{ fontSize: "clamp(16px,1.5vw,19px)", lineHeight: 1.65, color: "rgba(255,255,255,0.92)", margin: 0, maxWidth: "32em" }}>
              Invitá a tu pareja, a tu mamá o a quien vos quieras para que te acompañe desde su
              propia app — liviana, simple, pensada para sumar sin invadir tu espacio.
            </p>
          </div>
          <div className="flex flex-col">
            {partnerPoints.map((point, i) => (
              <div
                key={point.text}
                className="flex items-start gap-4"
                style={{
                  padding: "20px 0",
                  borderTop: "1px solid rgba(255,255,255,0.3)",
                  borderBottom: i === partnerPoints.length - 1 ? "1px solid rgba(255,255,255,0.3)" : "none",
                }}
              >
                <Icon path={point.iconPath} size={22} stroke="#fff" strokeWidth={1.6} style={{ marginTop: 2, opacity: 0.9 }} />
                <p className="text-pretty" style={{ fontSize: 17, lineHeight: 1.55, color: "#fff", margin: 0 }}>
                  {point.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOTA */}
      <section className="max-w-[880px] mx-auto" style={{ padding: "clamp(56px,7vw,84px) 24px 0" }}>
        <p className="text-pretty" style={{ fontSize: 15.5, lineHeight: 1.75, color: C.muted, margin: 0 }}>
          Mamá App te ayuda a organizarte y a cuidar tu bienestar emocional durante el embarazo y
          el postparto. No reemplaza la consulta con tu médico, no da diagnósticos ni indica
          tratamientos — para eso siempre vas a tener a tu equipo de salud de confianza.
        </p>
      </section>

      {/* CTA FINAL */}
      <section id="crear" className="max-w-[1120px] mx-auto" style={{ padding: "clamp(48px,7vw,90px) 24px clamp(64px,9vw,110px)" }}>
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: 34, background: gradientBrandPanel, boxShadow: "0 24px 60px rgba(226,111,206,0.3)", padding: "clamp(40px,6vw,76px) clamp(26px,5vw,64px)" }}
        >
          <div aria-hidden="true" className="absolute rounded-full" style={{ top: -90, right: -70, width: 320, height: 320, background: "radial-gradient(circle,rgba(255,255,255,0.32) 0%,rgba(255,255,255,0) 70%)", filter: "blur(30px)" }} />
          <div aria-hidden="true" className="absolute rounded-full" style={{ bottom: -110, left: -60, width: 300, height: 300, background: "radial-gradient(circle,rgba(255,154,106,0.4) 0%,rgba(255,154,106,0) 70%)", filter: "blur(40px)" }} />
          <div
            className="relative z-[1] grid items-center [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
            style={{ gap: "clamp(26px,4vw,48px)" }}
          >
            <div>
              <h2 className="font-heading" style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.06, color: "#fff", margin: "0 0 14px" }}>
                Empezá esta semana.
              </h2>
              <p className="text-pretty" style={{ fontSize: "clamp(16px,1.5vw,19px)", lineHeight: 1.6, color: "rgba(255,255,255,0.86)", margin: 0, maxWidth: "26em" }}>
                Creá tu cuenta gratis. Vas a poder anotar tu semana en menos de un minuto.
              </p>
            </div>
            <div className="flex justify-start">
              <button
                onClick={() => onGoToAuth("signup")}
                className="cursor-pointer transition-colors hover:text-[#9b5de5] whitespace-nowrap"
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: C.pink,
                  background: "#fff",
                  padding: "17px 32px",
                  borderRadius: 999,
                  boxShadow: "0 12px 30px rgba(36,29,43,0.18)",
                }}
              >
                Crear mi cuenta gratis
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-[1120px] mx-auto flex flex-wrap items-center justify-between gap-2.5" style={{ padding: "28px 24px 40px" }}>
          <p style={{ fontSize: 14, color: C.faint, margin: 0 }}>Mamá App © 2026 · No sustituye la atención médica profesional.</p>
          {import.meta.env.DEV ? (
            <button onClick={onDevPreview} className="cursor-pointer hover:underline font-heading" style={{ fontSize: 15, fontWeight: 800, color: C.hairline }}>
              Vista previa del dashboard (solo desarrollo)
            </button>
          ) : (
            <span className="font-heading" style={{ fontSize: 15, fontWeight: 800, color: C.hairline }}>
              Mamá App
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}
