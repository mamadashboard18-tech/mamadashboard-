import { useEffect, useRef, useState } from "react";
import "./landing.css";
import { pilares, secciones, partnerPoints, heroWeek } from "../../data/landingContent";

/* ---------- Scroll-reveal primitive ---------- */

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

/* ---------- Kicker (small-caps label with accent mark) ---------- */

function Kicker({ children, tone = "ink" }) {
  return (
    <p
      className="flex items-center gap-2 text-xs tracking-[0.22em] uppercase font-medium"
      style={{ color: tone === "paper" ? "var(--paper-on-ink)" : "var(--ink-muted)", opacity: tone === "paper" ? 0.75 : 1 }}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
      {children}
    </p>
  );
}

/* ---------- Hero week ruler — a functional graphic, not decoration ---------- */

function WeekRuler({ current, total }) {
  const marks = [1, 10, 20, 30, 40];
  const pct = (w) => `${((w - 1) / (total - 1)) * 100}%`;

  return (
    <div className="mt-14 max-w-md">
      <p className="font-display italic text-sm mb-4" style={{ color: "var(--ink-muted)" }}>
        Semana {current} de {total}
      </p>
      <div className="relative h-px w-full" style={{ background: "var(--rule)" }}>
        {marks.map((w) => (
          <span
            key={w}
            aria-hidden="true"
            className="absolute top-1/2 h-2 w-px -translate-y-1/2"
            style={{ left: pct(w), background: "var(--ink-muted)" }}
          />
        ))}
        <span
          aria-hidden="true"
          className="absolute top-1/2 h-2.5 w-2.5 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{ left: pct(current), background: "var(--accent)" }}
        />
      </div>
      <div className="relative h-4 mt-2">
        {marks.map((w) => (
          <span
            key={w}
            className="absolute text-[11px]"
            style={{
              left: pct(w),
              transform: w === 1 ? "translateX(0)" : w === total ? "translateX(-100%)" : "translateX(-50%)",
              color: "var(--ink-muted)",
            }}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Bespoke section glyphs — hand-drawn, not an icon library ---------- */

function SectionGlyph({ type }) {
  const common = { width: 24, height: 24, viewBox: "0 0 28 28", fill: "none" };
  switch (type) {
    case "inicio":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="14" cy="14" r="10" stroke="var(--rule)" strokeWidth="1.6" />
          <path d="M14 4a10 10 0 0 1 8.5 15.3" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "embarazo":
      return (
        <svg {...common} aria-hidden="true">
          <line x1="3" y1="14" x2="25" y2="14" stroke="var(--rule)" strokeWidth="1.6" />
          <line x1="3" y1="10.5" x2="3" y2="17.5" stroke="var(--ink)" strokeWidth="1.6" />
          <line x1="25" y1="10.5" x2="25" y2="17.5" stroke="var(--ink)" strokeWidth="1.6" />
          <circle cx="16" cy="14" r="2.3" fill="var(--accent)" />
        </svg>
      );
    case "citas":
      return (
        <svg {...common} aria-hidden="true">
          {[6, 14, 22].flatMap((x) =>
            [6, 14, 22].map((y) => (
              <circle
                key={`${x}-${y}`}
                cx={x}
                cy={y}
                r={x === 14 && y === 14 ? 2.4 : 1.5}
                fill={x === 14 && y === 14 ? "var(--accent)" : "var(--rule)"}
              />
            ))
          )}
        </svg>
      );
    case "bienestar":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M2 16 Q7 7 11 16 T20 16 T27 11" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "multimedia":
      return (
        <svg {...common} aria-hidden="true">
          <line x1="5" y1="10" x2="5" y2="20" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
          <line x1="11" y1="5" x2="11" y2="23" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
          <line x1="17" y1="9" x2="17" y2="19" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
          <line x1="23" y1="12" x2="23" y2="16" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "comunidad":
      return (
        <svg {...common} aria-hidden="true">
          <line x1="9" y1="10" x2="19" y2="18" stroke="var(--rule)" strokeWidth="1.6" />
          <circle cx="9" cy="10" r="2.4" fill="var(--ink)" />
          <circle cx="19" cy="18" r="2.4" fill="var(--accent)" />
          <circle cx="21.5" cy="7" r="1.8" fill="var(--rule)" />
        </svg>
      );
    default:
      return null;
  }
}

/* ---------- Page ---------- */

export default function LandingPage({ onGoToAuth, onDevPreview }) {
  return (
    <div className="landing-editorial min-h-screen">
      <header className="max-w-6xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
        <span className="font-semibold text-lg">
          Mamá App<span style={{ color: "var(--accent)" }}>.</span>
        </span>
        <nav className="flex items-center gap-5">
          <button onClick={() => onGoToAuth("login")} className="link-muted text-sm hidden sm:inline cursor-pointer">
            Ya tengo cuenta
          </button>
          <button
            onClick={() => onGoToAuth("signup")}
            className="btn-primary inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-md cursor-pointer"
          >
            Crear cuenta <span className="arrow">→</span>
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 pt-8 pb-24 sm:pt-16 sm:pb-32">
        <Reveal>
          <Kicker>Mamá App — un diario para cada semana</Kicker>
        </Reveal>
        <Reveal delay={80}>
          <h1
            className="font-display text-balance text-[2.5rem] leading-[1.1] sm:text-6xl sm:leading-[1.06] md:text-7xl font-medium max-w-4xl mt-8"
            style={{ color: "var(--ink)" }}
          >
            No vas a recordar cada semana.{" "}
            <em className="italic" style={{ color: "var(--accent)" }}>
              Nosotras sí.
            </em>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 text-lg leading-relaxed max-w-[42ch]" style={{ color: "var(--ink-muted)" }}>
            Mamá App es tu diario de embarazo: seguimiento semana a semana, un espacio para tu
            bienestar emocional y todo organizado en un solo lugar — sin vueltas, sin apps de más.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button
              onClick={() => onGoToAuth("signup")}
              className="btn-primary inline-flex items-center gap-2 text-sm font-semibold px-6 py-3.5 rounded-md cursor-pointer"
            >
              Empezar mi diario <span className="arrow">→</span>
            </button>
            <p className="text-xs max-w-[24ch] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
              Gratis para empezar. No reemplaza a tu médico — te acompaña entre consulta y consulta.
            </p>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <WeekRuler current={heroWeek.current} total={heroWeek.total} />
        </Reveal>
      </section>

      {/* PULL QUOTE */}
      <section className="border-t" style={{ borderColor: "var(--rule)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
          <Reveal>
            <p
              className="font-display italic text-balance text-2xl sm:text-4xl md:text-[2.65rem] leading-[1.32] max-w-3xl"
              style={{ color: "var(--ink)" }}
            >
              No es una libreta más. Es el lugar donde vas a poner en palabras cada semana — la
              que fue linda y la que costó.
            </p>
          </Reveal>
        </div>
      </section>

      {/* POR QUÉ — numbered editorial list */}
      <section className="border-t" style={{ borderColor: "var(--rule)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
          <Reveal>
            <Kicker>Por qué Mamá App</Kicker>
          </Reveal>
          <div className="mt-14">
            {pilares.map((p, i) => (
              <Reveal key={p.number} delay={i * 90}>
                <div
                  className={`grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-3 sm:gap-10 items-baseline py-9 border-t ${
                    i % 2 === 1 ? "sm:pl-16" : ""
                  }`}
                  style={{ borderColor: "var(--rule)" }}
                >
                  <span className="font-display text-5xl sm:text-6xl" style={{ color: "var(--rule)" }}>
                    {p.number}
                  </span>
                  <div className="max-w-xl">
                    <h3 className="font-display text-xl sm:text-2xl font-medium mb-2.5" style={{ color: "var(--ink)" }}>
                      {p.title}
                    </h3>
                    <p className="leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div className="border-t" style={{ borderColor: "var(--rule)" }} />
          </div>
        </div>
      </section>

      {/* ADENTRO DE LA APP — editorial index */}
      <section className="border-t" style={{ borderColor: "var(--rule)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
          <Reveal>
            <Kicker>Adentro de la app</Kicker>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="font-display text-balance text-3xl sm:text-5xl font-medium mt-4 mb-14 max-w-2xl" style={{ color: "var(--ink)" }}>
              Seis lugares. Un solo espacio.
            </h2>
          </Reveal>
          <div>
            {secciones.map((s, i) => (
              <Reveal key={s.number} delay={i * 70}>
                <div className="py-8 border-t" style={{ borderColor: "var(--rule)" }}>
                  <div className="flex items-center gap-3 mb-2.5 flex-wrap">
                    <span className="font-display text-sm" style={{ color: "var(--ink-muted)" }}>
                      {s.number}
                    </span>
                    <SectionGlyph type={s.icon} />
                    <h3 className="font-display text-xl sm:text-2xl font-medium" style={{ color: "var(--ink)" }}>
                      {s.title}
                    </h3>
                    {s.comingSoon && (
                      <span
                        className="text-[10px] tracking-[0.15em] uppercase font-semibold px-2 py-0.5 rounded"
                        style={{ color: "var(--accent-deep)", background: "var(--paper-deep)" }}
                      >
                        Muy pronto
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed max-w-xl sm:pl-[52px]" style={{ color: "var(--ink-muted)" }}>
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
            <div className="border-t" style={{ borderColor: "var(--rule)" }} />
          </div>
        </div>
      </section>

      {/* MODO ACOMPAÑANTE — tonal inversion signals a different voice */}
      <section style={{ background: "var(--ink)", color: "var(--paper-on-ink)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
          <Reveal>
            <Kicker tone="paper">Modo acompañante</Kicker>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-10 sm:gap-16 mt-8">
            <Reveal delay={80}>
              <h2 className="font-display text-balance text-3xl sm:text-5xl font-medium leading-[1.12]">
                Tu pareja tampoco se queda afuera.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <div>
                <p className="leading-relaxed mb-7" style={{ opacity: 0.85 }}>
                  Invitá a tu pareja, a tu mamá o a quien vos quieras para que te acompañe desde
                  su propia app — liviana, simple, pensada para sumar sin invadir tu espacio.
                </p>
                <ul className="space-y-3">
                  {partnerPoints.map((point) => (
                    <li key={point} className="flex gap-3 leading-relaxed" style={{ opacity: 0.85 }}>
                      <span aria-hidden="true" style={{ color: "var(--accent)" }}>
                        —
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* NOTA — the medical disclaimer, framed as an editorial aside */}
      <section className="border-t" style={{ borderColor: "var(--rule)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-20 sm:py-24">
          <Reveal>
            <div className="border-l-2 pl-6 sm:pl-8 max-w-2xl" style={{ borderColor: "var(--accent)" }}>
              <p className="text-xs tracking-[0.22em] uppercase font-semibold mb-3" style={{ color: "var(--ink-muted)" }}>
                Nota
              </p>
              <p className="font-display italic text-lg sm:text-xl leading-relaxed" style={{ color: "var(--ink)" }}>
                Mamá App te ayuda a organizarte y a cuidar tu bienestar emocional durante el
                embarazo y el postparto. No reemplaza la consulta con tu médico, no da
                diagnósticos ni indica tratamientos — para eso siempre vas a tener a tu equipo de
                salud de confianza.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="border-t" style={{ borderColor: "var(--rule)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
          <Reveal>
            <h2 className="font-display text-balance text-4xl sm:text-6xl font-medium mb-6 max-w-2xl" style={{ color: "var(--ink)" }}>
              Empezá esta semana.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-lg mb-10 max-w-md leading-relaxed" style={{ color: "var(--ink-muted)" }}>
              Creá tu cuenta gratis. Vas a poder anotar tu semana en menos de un minuto.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <button
              onClick={() => onGoToAuth("signup")}
              className="btn-primary inline-flex items-center gap-2 text-sm font-semibold px-7 py-3.5 rounded-md cursor-pointer"
            >
              Crear mi cuenta gratis <span className="arrow">→</span>
            </button>
          </Reveal>
        </div>
      </section>

      <footer className="border-t" style={{ borderColor: "var(--rule)" }}>
        <div
          className="max-w-6xl mx-auto px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{ color: "var(--ink-muted)" }}
        >
          <span>Mamá App © 2026 · No sustituye la atención médica profesional.</span>
          {import.meta.env.DEV && (
            <button onClick={onDevPreview} className="link-muted cursor-pointer">
              Vista previa del dashboard (solo desarrollo)
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
