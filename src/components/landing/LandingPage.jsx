import {
  Home,
  CalendarDays,
  Heart,
  Lock,
  Sprout,
  Headphones,
  Users,
  Check,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";
import AmbientBlobs from "../AmbientBlobs";
import { pilares, seccionesDetalle, stats, partnerHighlights } from "../../data/landingContent";

const icons = { Home, CalendarDays, Heart, Lock, Sprout, Headphones, Users };

export default function LandingPage({ onGoToAuth, onDevPreview }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 bg-[var(--bg)]/90 backdrop-blur border-b border-[var(--border-soft)] z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-brand-pink-light flex items-center justify-center">
              <Heart className="w-4 h-4 text-brand-pink" strokeWidth={2} fill="currentColor" />
            </span>
            <span className="font-heading font-extrabold text-ink">Mamá App</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onGoToAuth("login")}
              className="text-sm text-ink-muted hover:text-brand-pink cursor-pointer"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => onGoToAuth("signup")}
              className="text-white text-sm font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity cursor-pointer"
              style={{ background: "var(--gradient-hero)" }}
            >
              Crear cuenta
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="relative">
        <AmbientBlobs />
        <section className="max-w-4xl mx-auto px-6 text-center pt-16 pb-14 relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-brand-pink-light text-brand-magenta text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Heart className="w-3.5 h-3.5" fill="currentColor" />
            Tu compañera en cada semana de embarazo
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-ink leading-tight mb-6">
            Tu compañera de embarazo:
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              organizada, emocional
            </span>{" "}
            y siempre a mano
          </h1>
          <p className="text-ink-muted text-lg mb-9 max-w-xl mx-auto">
            La app que te acompaña desde el día que te enterás hasta los primeros meses con tu
            bebé — seguimiento semana a semana, bienestar emocional y una comunidad real, todo
            pensado para vos.
          </p>
          <button
            onClick={() => onGoToAuth("signup")}
            className="text-white text-sm font-bold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            style={{ background: "var(--gradient-hero)" }}
          >
            Crear mi cuenta gratis
          </button>
          <p className="text-xs text-ink-muted mt-3">
            Gratis para empezar · Te acompaña en el día a día, no reemplaza a tu médico.
          </p>
        </section>
      </div>

      {/* STATS */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-[var(--border-soft)] rounded-2xl p-6 text-center shadow-sm"
            >
              <p className="font-heading text-3xl font-extrabold text-brand-pink">{s.value}</p>
              <p className="text-sm text-ink-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QUÉ ES */}
      <section className="bg-white border-y border-[var(--border-soft)]">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold text-ink mb-5">Más que una libreta de embarazo</h2>
          <p className="text-ink-muted text-lg max-w-2xl mx-auto">
            La mayoría de las apps te tiran una ficha semanal y ya. Mamá App suma seguimiento
            semana a semana, tu bienestar emocional, contenido en audio y una comunidad real de
            mamás — todo en un solo lugar, para que no tengas que andar buscando en mil lados.
          </p>
        </div>
      </section>

      {/* PILARES */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-ink text-center mb-3">
          Pensada para acompañarte de verdad
        </h2>
        <p className="text-ink-muted text-center max-w-xl mx-auto mb-12">
          Organización, contención y privacidad — las tres cosas que más se necesitan y menos se
          encuentran juntas.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pilares.map((p) => {
            const Icon = icons[p.icon] || Heart;
            return (
              <div
                key={p.title}
                className="bg-white border border-[var(--border-soft)] rounded-2xl p-6 shadow-sm"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-pink-light">
                  <Icon className="w-5 h-5 text-brand-pink" strokeWidth={2} />
                </span>
                <p className="font-heading font-bold text-ink mt-4 mb-2">{p.title}</p>
                <p className="text-sm text-ink-muted leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* DETALLE DE SECCIONES */}
      <section className="bg-white border-y border-[var(--border-soft)]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink text-center mb-3">
            Todo lo que tenés dentro de la app
          </h2>
          <p className="text-ink-muted text-center max-w-xl mx-auto mb-14">
            Siete áreas integradas, pensadas para acompañarte en cada etapa del camino.
          </p>

          <div className="space-y-14">
            {seccionesDetalle.map((s, i) => {
              const Icon = icons[s.icon] || Heart;
              return (
                <div key={s.title} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className={i % 2 === 1 ? "md:order-2" : ""}>
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-pink-light mb-4">
                      <Icon className="w-6 h-6 text-brand-pink" strokeWidth={2} />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-brand-pink text-sm font-semibold">{s.tagline}</p>
                      {s.comingSoon && (
                        <span className="bg-brand-purple-light text-brand-purple text-[11px] font-semibold px-2 py-0.5 rounded-full">
                          Muy pronto
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-extrabold text-ink mb-3">{s.title}</h3>
                    <p className="text-ink-muted mb-4 leading-relaxed">{s.desc}</p>
                    <ul className="space-y-2">
                      {s.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-ink">
                          <Check className="w-4 h-4 text-brand-pink mt-0.5 shrink-0" strokeWidth={2.5} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className={`rounded-[28px] aspect-[4/3] flex items-center justify-center shadow-sm ${
                      i % 2 === 1 ? "md:order-1" : ""
                    }`}
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MODO ACOMPAÑANTE (PAPÁ / PAREJA) */}
      <section
        className="border-y border-[var(--partner-border)]"
        style={{ background: "var(--partner-surface-tint)" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-white text-[var(--partner-violet)] text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-[var(--partner-border)]">
                <HeartHandshake className="w-3.5 h-3.5" strokeWidth={2} />
                Modo acompañante
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mb-4">
                Tampoco tu pareja se queda afuera
              </h2>
              <p className="text-ink-muted mb-6 leading-relaxed">
                Invitá a tu pareja, a tu mamá o a quien vos elijas para que te acompañe desde su
                propia app — liviana, simple, y pensada para sumar sin invadir tu espacio.
              </p>
              <ul className="space-y-2.5">
                {partnerHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink">
                    <Check
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: "var(--partner-violet)" }}
                      strokeWidth={2.5}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="rounded-[28px] aspect-[4/3] flex items-center justify-center shadow-sm"
              style={{ background: "var(--partner-gradient)" }}
            >
              <Users className="w-16 h-16 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </section>

      {/* ACLARACIÓN: NO REEMPLAZA AL MÉDICO */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-pink-light mb-5">
          <ShieldCheck className="w-6 h-6 text-brand-pink" strokeWidth={2} />
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mb-4">
          Un espacio que te acompaña, no un consultorio
        </h2>
        <p className="text-ink-muted leading-relaxed max-w-xl mx-auto">
          Mamá App te ayuda a organizarte y a cuidar tu bienestar emocional durante el embarazo y
          el postparto. No reemplaza la consulta con tu médico, no da diagnósticos ni indica
          tratamientos — para eso siempre vas a tener a tu equipo de salud de confianza. Nosotras
          nos encargamos de que no llegues perdida a ninguna semana.
        </p>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-ink mb-5">
          Empezá a acompañarte hoy
        </h2>
        <p className="text-ink-muted text-lg mb-9">
          Creá tu cuenta gratis y empezá tu seguimiento personalizado, semana a semana.
        </p>
        <button
          onClick={() => onGoToAuth("signup")}
          className="text-white text-sm font-bold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          style={{ background: "var(--gradient-hero)" }}
        >
          Crear mi cuenta gratis
        </button>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-[var(--border-soft)] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-muted">
        <span>© 2026 Mamá App · No sustituye la atención médica profesional.</span>
        {import.meta.env.DEV && (
          <button onClick={onDevPreview} className="hover:text-brand-pink cursor-pointer">
            Vista previa del dashboard (solo desarrollo)
          </button>
        )}
      </footer>
    </div>
  );
}
