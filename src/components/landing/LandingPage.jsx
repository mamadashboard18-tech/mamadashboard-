import { useCallback, useEffect, useRef, useState } from "react";
import { pilares, secciones } from "../../data/landingContent";
import fotoEmbarazada from "../../assets/landing/embarazada-telefono.jpg";
import fotoVentana from "../../assets/landing/gallery/photo-8359692.jpg";
import fotoPareja from "../../assets/landing/gallery/photo-5427264.jpg";
import fotoPanza from "../../assets/landing/gallery/photo-7485075.jpg";
import fotoSillon from "../../assets/landing/gallery/photo-7156578.jpg";
import fotoSonrisa from "../../assets/landing/gallery/photo-7484481.jpg";
import fotoRenata from "../../assets/landing/renata-kastika.jpg";

/* Design tokens, from design_handoff_landing/README.md (hifi, final values) */
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
  deepPlum: "#3a2159",
  border: "rgba(155,93,229,0.15)",
};

const gradientBrand = `linear-gradient(135deg,${C.rose} 0%,${C.pink} 55%,${C.purpleGrad} 100%)`;
const gradientBrandPanel = `linear-gradient(160deg,${C.rose} 0%,${C.pink} 55%,${C.purpleGrad} 100%)`;
const gradientNumber = `linear-gradient(135deg,${C.rose},${C.purpleGrad})`;
/* Solid brand purple, reserved for the "Crear cuenta" CTAs — flat instead of
   a gradient so they pop against the softer gradients used everywhere else,
   while staying inside the pink/purple palette (no off-palette accent color). */
const ctaSolid = C.purple;
const ctaShadow = "0 10px 24px rgba(155,93,229,0.4)";

function Icon({ path, size = 24, stroke = C.pink, strokeWidth = 1.5, style, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ width: size, height: size, flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

/* Phone bezel showing a real, live screen of the app (via the unauthenticated
   /?app_preview=<panel> route in App.jsx) scaled to fit — not a screenshot,
   so it never drifts from the actual product UI. */
function PhoneFrame({ src, title, width, height, screenHeight, rotate = 0, z = 1, dim = false, pos, onClick, loadDelay = 0 }) {
  const bezel = 9;
  const notchClearance = 26;
  const screenWidth = width - bezel * 2;
  const scale = screenWidth / 390;
  const wrapRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad || !wrapRef.current) return;
    let timer;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          // Staggering the hero's side phones (loadDelay > 0) keeps them from
          // fighting the center phone for bandwidth/CPU on first paint — each
          // iframe boots the whole app bundle, so loading 3 at once is the
          // main thing slowing down the first screen.
          if (loadDelay > 0) {
            timer = setTimeout(() => setShouldLoad(true), loadDelay);
          } else {
            setShouldLoad(true);
          }
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(wrapRef.current);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [shouldLoad, loadDelay]);

  return (
    <div
      ref={wrapRef}
      onClick={onClick}
      className="phone-frame"
      style={{
        position: "absolute",
        width,
        height,
        borderRadius: 42,
        background: "#15111a",
        padding: bezel,
        boxShadow: dim ? "0 20px 44px rgba(36,29,43,0.28)" : "0 30px 60px rgba(155,93,229,0.32), 0 10px 26px rgba(226,111,206,0.22)",
        transform: `rotate(${rotate}deg)`,
        zIndex: z,
        cursor: onClick ? "pointer" : undefined,
        ...pos,
      }}
    >
      <div
        style={{
          width: screenWidth,
          height: screenHeight,
          borderRadius: 32,
          overflow: "hidden",
          background: "#fdf6fa",
          filter: dim ? "brightness(0.74) saturate(0.92)" : "none",
          transition: "filter 0.4s ease",
        }}
      >
        {/* Status-bar spacer so the dynamic island never sits on top of the app's own header text */}
        <div style={{ height: notchClearance, background: "#fdf6fa" }} />
        {shouldLoad ? (
          <iframe
            src={src}
            title={title}
            tabIndex={-1}
            scrolling="no"
            style={{
              width: 390,
              height: 844,
              border: 0,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              pointerEvents: "none",
            }}
          />
        ) : (
          <div
            className="phone-frame-skeleton"
            style={{ width: screenWidth, height: screenHeight - notchClearance }}
            aria-hidden="true"
          />
        )}
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: bezel + 7,
          left: "50%",
          transform: "translateX(-50%)",
          width: screenWidth * 0.3,
          height: 16,
          borderRadius: 999,
          background: "#15111a",
        }}
      />
    </div>
  );
}

function FloatingBadge({ iconPath, text, pos }) {
  return (
    <div
      className="hidden sm:flex items-center"
      style={{
        position: "absolute",
        gap: 9,
        background: "#fff",
        borderRadius: 999,
        padding: "7px 16px 7px 7px",
        boxShadow: "0 14px 30px rgba(36,29,43,0.18)",
        whiteSpace: "nowrap",
        zIndex: 4,
        ...pos,
      }}
    >
      <span className="flex items-center justify-center shrink-0" style={{ width: 26, height: 26, borderRadius: "50%", background: gradientNumber }}>
        <Icon path={iconPath} size={13} stroke="#fff" strokeWidth={2.2} />
      </span>
      <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{text}</span>
    </div>
  );
}

/* Illustrative chat mockup for the "notas y aliento" partner feature — a
   custom static mock rather than another live iframe, kept light on purpose. */
function ChatMock() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-start">
        <div style={{ background: "var(--partner-gradient)", borderRadius: "4px 16px 16px 16px", padding: "10px 14px", maxWidth: "78%" }}>
          <p style={{ fontSize: 13, color: "#fff", margin: 0, lineHeight: 1.45 }}>
            ¿Cómo te sentís hoy? Vi que anotaste que estabas cansada.
          </p>
        </div>
      </div>
      <div className="flex items-start justify-end">
        <div style={{ background: `linear-gradient(135deg,${C.rose},${C.pink})`, borderRadius: "16px 4px 16px 16px", padding: "10px 14px", maxWidth: "78%" }}>
          <p style={{ fontSize: 13, color: "#fff", margin: 0, lineHeight: 1.45 }}>
            Un poco, pero mejor. Gracias por preguntar 💜
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ s, className = "" }) {
  const isComingSoon = s.comingSoon;

  const body = (
    <>
      <span
        className="flex items-center justify-center shrink-0 mb-3"
        style={{ width: 38, height: 38, borderRadius: 12, background: isComingSoon ? "rgba(155,93,229,0.1)" : gradientNumber }}
      >
        <Icon path={s.iconPath} size={19} stroke={isComingSoon ? C.hairline : "#fff"} />
      </span>
      <span
        className="font-heading block"
        style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em", color: isComingSoon ? C.veryFaint : C.ink, marginBottom: 4 }}
      >
        {s.title}
      </span>
      <span
        className="block"
        style={{
          fontSize: 13.5,
          lineHeight: 1.45,
          color: isComingSoon ? C.faint : C.paragraph,
        }}
      >
        {s.desc}
      </span>
      {isComingSoon && (
        <span className="uppercase mt-3" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", color: C.purple }}>
          Muy pronto
        </span>
      )}
    </>
  );

  const baseProps = {
    className: `section-card ${className} flex flex-col items-start`,
    style: { background: "rgba(155,93,229,0.05)", borderRadius: 20, padding: "18px 18px", color: "inherit" },
  };

  if (isComingSoon) {
    return <div {...baseProps}>{body}</div>;
  }
  return (
    <a href="#crear" {...baseProps} className={`${baseProps.className} no-underline`}>
      {body}
    </a>
  );
}

/* Tap/click to flip and reveal a short second-person "experience" phrase on
   the back — same honest, non-invented-testimonial voice as the rest of the
   copy, just framed as a reveal instead of a static line. */
function FlipCard({ className = "", frontClassName = "", frontStyle, backStyle, backText, children }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped((f) => !f);

  return (
    <div
      className={`flip-card experience-card ${className}`}
      onClick={toggle}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label="Tocá para ver más"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <div className={`flip-card-inner${flipped ? " is-flipped" : ""}`}>
        <div className={`flip-card-face ${frontClassName}`} style={{ borderRadius: 24, ...frontStyle }}>
          {children}
        </div>
        <div className="flip-card-face flip-card-back flex items-center" style={{ borderRadius: 24, background: gradientBrandPanel, padding: "24px", ...backStyle }}>
          <div>
            <span aria-hidden="true" style={{ fontSize: 28, lineHeight: 1, color: "rgba(255,255,255,0.55)", display: "block", marginBottom: 4 }}>
              “
            </span>
            <p className="font-heading text-pretty" style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4, color: "#fff", margin: 0 }}>
              {backText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Floating "back to top" arrow — appears once the hero has scrolled past. */
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Volver arriba"
      className="cursor-pointer transition-[opacity,transform] hover:brightness-105"
      style={{
        position: "fixed",
        right: "clamp(16px,4vw,28px)",
        bottom: "clamp(16px,4vw,28px)",
        zIndex: 40,
        width: 46,
        height: 46,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: gradientNumber,
        boxShadow: "0 12px 26px rgba(155,93,229,0.4)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      <Icon path="M12 19V5 M5 12l7-7 7 7" size={20} stroke="#fff" strokeWidth={2.2} />
    </button>
  );
}

/* Fires once, the first time the watched element enters the viewport —
   drives the "En números" section's reveal + count-up animation. Returns a
   callback ref (not a plain useRef) because that section is itself mounted
   late by LazySection: a plain ref's `.current` would flip from null to the
   real node without ever re-running this effect, since React only re-runs
   effects when a *ref object* identity changes, not when `.current` does —
   leaving the reveal permanently stuck at "not in view". A callback ref
   fires again whenever the node it's attached to actually changes. */
function useInView() {
  const [node, setNode] = useState(null);
  const [inView, setInView] = useState(false);
  const ref = useCallback((el) => setNode(el), []);

  useEffect(() => {
    if (!node || inView) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, inView]);

  return [ref, inView];
}

/* Mounts its children only once the section is getting close to the
   viewport (large rootMargin = mounted well before it's actually visible,
   so scrolling in never shows a blank gap) instead of on first page load.
   A section anchor-linked from elsewhere on the page (#adentro,
   #acompanante, #crear) must stay eagerly mounted — deferring those would
   make the target missing from the DOM until scrolled near, breaking the
   jump. Everything else defers, so the first screen only pays for the hero. */
function LazySection({ children, minHeight = 420, rootMargin = "700px" }) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  return (
    <div ref={ref} className={mounted ? "lazy-section-in" : undefined} style={mounted ? undefined : { minHeight }}>
      {mounted ? children : null}
    </div>
  );
}

/* Animates 0 → target once `active` flips true. Same real number every
   time — the count-up is just presentation, not a different value. */
function useCountUp(active, target, duration = 1100) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

const TRIMESTER_SEGMENTS = [
  { weeks: 13, color: C.rose, label: "1er trimestre", range: "Semanas 1 a 13" },
  { weeks: 14, color: C.pink, label: "2do trimestre", range: "Semanas 14 a 27" },
  { weeks: 13, color: C.purpleGrad, label: "3er trimestre", range: "Semanas 28 a 40" },
];

/* Donut chart of the 40 weeks split across 3 trimesters — real proportions
   (13/14/13 weeks), just drawn as a ring instead of a flat stat tile. */
function TrimesterRing({ active }) {
  const size = 180;
  const radius = 74;
  const strokeWidth = 16;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const weeksValue = useCountUp(active, 40);
  let cumulative = 0;

  return (
    <div
      className="relative mx-auto shrink-0"
      style={{
        width: size,
        height: size,
        transform: active ? "scale(1)" : "scale(0.85)",
        opacity: active ? 1 : 0,
        transition: "transform 0.7s var(--ease-out), opacity 0.6s ease",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(155,93,229,0.12)" strokeWidth={strokeWidth} />
        <g transform={`rotate(-90 ${center} ${center})`}>
          {TRIMESTER_SEGMENTS.map((s, i) => {
            // A visual gap between segments, filled by their rounded caps,
            // instead of butting them edge-to-edge — touching segments are
            // prone to a hairline overlap/seam artifact from floating-point
            // rounding in the cumulative offset. Each round cap extends
            // strokeWidth/2 past its own endpoint, so the gap has to clear
            // both caps (strokeWidth) plus some breathing room, or the caps
            // themselves would overlap into the next segment.
            const gap = strokeWidth + 6;
            const len = (s.weeks / 40) * (circumference - gap * TRIMESTER_SEGMENTS.length);
            const dashoffset = -cumulative;
            cumulative += len + gap;
            return (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${len} ${circumference - len}`}
                strokeDashoffset={dashoffset}
              />
            );
          })}
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading" style={{ fontSize: 40, fontWeight: 800, color: C.ink, lineHeight: 1 }}>
          {weeksValue}
        </span>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: C.faint, marginTop: 2 }}>semanas</span>
      </div>
    </div>
  );
}

function FactRow({ fact, active }) {
  const value = useCountUp(active, fact.n);
  return (
    <div className="flex items-center gap-3.5" style={{ background: "rgba(155,93,229,0.05)", borderRadius: 20, padding: "18px 20px" }}>
      <span className="flex items-center justify-center shrink-0" style={{ width: 42, height: 42, borderRadius: 13, background: gradientNumber }}>
        <Icon path={fact.iconPath} size={20} stroke="#fff" strokeWidth={1.8} />
      </span>
      <div>
        <p className="font-heading" style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", margin: 0, color: C.ink, lineHeight: 1.1 }}>
          {value}
        </p>
        <p style={{ fontSize: 13.5, lineHeight: 1.4, color: C.paragraph, margin: 0 }}>{fact.label}</p>
      </div>
    </div>
  );
}

/* One photo in the intro mosaic — a short brand phrase over a gradient
   scrim, never quotation marks or a name, so it never reads as an invented
   customer testimonial. */
function MosaicPhoto({ src, alt, phrase, className = "" }) {
  return (
    <div className={`mosaic-photo relative overflow-hidden ${className}`} style={{ borderRadius: 24 }}>
      <img src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0"
        style={{ height: "62%", background: "linear-gradient(180deg,rgba(36,29,43,0) 0%,rgba(36,29,43,0.68) 100%)" }}
      />
      <p
        className="font-heading text-pretty absolute left-0 right-0"
        style={{ bottom: 16, padding: "0 18px", fontSize: 15.5, fontWeight: 700, lineHeight: 1.35, color: "#fff", margin: 0 }}
      >
        {phrase}
      </p>
    </div>
  );
}

const SHOWCASE_PANELS = {
  multimedia: { src: "/?app_preview=multimedia", title: "Vista previa: Multimedia" },
  inicio: { src: "/?app_preview=inicio", title: "Vista previa: Inicio" },
  bienestar: { src: "/?app_preview=bienestar", title: "Vista previa: Mi Bienestar" },
};

/* Which panel sits center decides the other two's sides — clicking a side
   phone swaps it to center instead of reshuffling all three. */
const SHOWCASE_ROLES_BY_CENTER = {
  inicio: { left: "multimedia", center: "inicio", right: "bienestar" },
  multimedia: { left: "inicio", center: "multimedia", right: "bienestar" },
  bienestar: { left: "multimedia", center: "bienestar", right: "inicio" },
};

const SHOWCASE_ROLE_STYLE = {
  left: { width: 186, height: 372, screenHeight: 354, rotate: -9, z: 1, dim: true, pos: { left: 0, top: 58 }, loadDelay: 450 },
  right: { width: 186, height: 372, screenHeight: 354, rotate: 8, z: 2, dim: false, pos: { right: 0, top: 74 }, loadDelay: 650 },
  center: { width: 216, height: 452, screenHeight: 434, rotate: 0, z: 3, dim: false, pos: { left: "50%", top: 0, marginLeft: -108 } },
};

const SHOWCASE_DESIGN_WIDTH = 520;
const SHOWCASE_DESIGN_HEIGHT = 560;

/* The phone trio + badges are laid out in fixed design-size pixels (they need
   to overlap and rotate precisely). On narrow screens we scale the whole
   design down to fit instead of letting it overflow/clip — measured against
   the actual rendered width so it works at any viewport, not just fixed
   breakpoints. */
function AppShowcase() {
  const [centerId, setCenterId] = useState("inicio");
  const roles = SHOWCASE_ROLES_BY_CENTER[centerId];
  const outerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.offsetWidth / SHOWCASE_DESIGN_WIDTH));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={outerRef}
      className="relative mx-auto"
      style={{ width: "100%", maxWidth: SHOWCASE_DESIGN_WIDTH, height: SHOWCASE_DESIGN_HEIGHT * scale }}
    >
      <div
        className="absolute top-0 left-0"
        style={{ width: SHOWCASE_DESIGN_WIDTH, height: SHOWCASE_DESIGN_HEIGHT, transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {Object.keys(SHOWCASE_PANELS).map((id) => {
          const role = id === roles.left ? "left" : id === roles.right ? "right" : "center";
          return (
            <PhoneFrame
              key={id}
              src={SHOWCASE_PANELS[id].src}
              title={SHOWCASE_PANELS[id].title}
              onClick={role === "center" ? undefined : () => setCenterId(id)}
              {...SHOWCASE_ROLE_STYLE[role]}
            />
          );
        })}

        <FloatingBadge
          iconPath="M4 9 H20 M8 3 V7 M16 3 V7 M4 5 H20 V20 H4 Z"
          text="Seguimiento semana a semana"
          pos={{ left: -20, top: 34 }}
        />
        <FloatingBadge
          iconPath="M12 20.5C12 20.5 4.5 16.2 4.5 10.6A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 3C19.5 16.2 12 20.5 12 20.5Z"
          text="Sin filtro y sin juicio"
          pos={{ right: -20, top: 34 }}
        />
        <FloatingBadge iconPath="M4 5h16v11H8l-4 4V5Z" text="Contenido para tu semana" pos={{ left: -30, top: 262 }} />
        <FloatingBadge
          iconPath="M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M17 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z M2 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5 M15 20c0-2.4-1.6-4.4-3.8-5.1c.6-.3 1.2-.4 1.8-.4c2.8 0 5 2.2 5 5"
          text="Invitá a tu acompañante"
          pos={{ right: -30, top: 282 }}
        />
        <FloatingBadge
          iconPath="M12 3 L13.2 8.8 L19 10 L13.2 11.2 L12 17 L10.8 11.2 L5 10 L10.8 8.8 Z"
          text="Check-in emocional diario"
          pos={{ left: "50%", bottom: -6, marginLeft: -120 }}
        />
      </div>
    </div>
  );
}

export default function LandingPage({ onGoToAuth, onDevPreview }) {
  const [numbersRef, numbersInView] = useInView();

  return (
    <div style={{ background: C.bg, fontFamily: "Inter, system-ui, sans-serif", color: C.ink, overflowX: "hidden" }}>
      <style>{`html{scroll-behavior:smooth}`}</style>

      {/* HEADER + HERO share one gradient backdrop so the nav reads as part of the same scene */}
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full" style={{ top: -140, left: -90, width: 420, height: 420, background: C.rose, opacity: 0.22, filter: "blur(90px)" }} />
          <div className="absolute rounded-full" style={{ top: -60, right: -120, width: 460, height: 460, background: C.purple, opacity: 0.18, filter: "blur(100px)" }} />
          <div className="absolute rounded-full" style={{ bottom: -160, left: "35%", width: 380, height: 380, background: C.peach, opacity: 0.16, filter: "blur(100px)" }} />
        </div>

        <header className="relative z-[1]">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
            <span
              className="font-heading cursor-default whitespace-nowrap shrink-0"
              style={{ fontSize: "clamp(16px,4.5vw,20px)", fontWeight: 800, color: C.ink, letterSpacing: "-0.01em" }}
            >
              Acuna App
            </span>
            <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
              <button
                onClick={() => onGoToAuth("login")}
                className="cursor-pointer transition-colors hover:text-[#e26fce] whitespace-nowrap"
                style={{ fontSize: "clamp(12px,3vw,15px)", fontWeight: 600, color: C.muted }}
              >
                Ya tengo cuenta
              </button>
              <button
                onClick={() => onGoToAuth("signup")}
                className="btn-lift cursor-pointer transition-[filter] hover:brightness-105 whitespace-nowrap shrink-0"
                style={{
                  fontSize: "clamp(12.5px,3vw,15px)",
                  fontWeight: 700,
                  color: "#fff",
                  padding: "clamp(8px,2vw,11px) clamp(13px,3.5vw,20px)",
                  borderRadius: 999,
                  background: ctaSolid,
                  boxShadow: ctaShadow,
                }}
              >
                Crear cuenta
              </button>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section
          className="relative z-[1] max-w-[1120px] mx-auto grid items-center [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]"
          style={{ padding: "clamp(40px,7vw,90px) 24px clamp(48px,7vw,86px)", gap: "clamp(36px,5vw,64px)" }}
        >
          <div>
            <p className="uppercase text-balance" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: C.pink, margin: "0 0 20px" }}>
              Acuna App, tu acompañamiento en el embarazo
            </p>
            <h1
              className="font-heading text-pretty"
              style={{ fontSize: "clamp(38px,5.4vw,64px)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.03em", margin: "0 0 22px" }}
            >
              Todo tu embarazo.
              <br />
              Acompañada, siempre.
            </h1>
            <p className="text-pretty" style={{ fontSize: "clamp(17px,1.6vw,20px)", lineHeight: 1.6, color: C.paragraph, margin: "0 0 30px", maxWidth: "32em" }}>
              Acuna App es tu acompañamiento en el embarazo: todo lo que necesitás en un solo
              lugar, desde el seguimiento semana a semana hasta tu bienestar emocional, sin apps
              de más.
            </p>
            <div className="flex flex-wrap items-center gap-[18px]">
              <a
                href="#crear"
                className="btn-lift cursor-pointer transition-[filter] hover:brightness-105"
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
                Gratis para empezar. No reemplaza a tu médico, te acompaña entre consulta y
                consulta.
              </p>
            </div>
          </div>

          <AppShowcase />
        </section>
      </div>

      {/* INTRO MOSAIC — real photos for context; captions are brand phrases,
          not invented customer quotes (see FlipCard/MosaicPhoto comments) */}
      <LazySection minHeight={480}>
        <section className="max-w-[1120px] mx-auto" style={{ padding: "clamp(40px,6vw,64px) 24px 0" }}>
          <div className="photo-mosaic">
            <MosaicPhoto className="mosaic-big" src={fotoVentana} alt="Mujer embarazada mirando su teléfono junto a una ventana" phrase="Un lugar tranquilo para volver, cuando lo necesites." />
            <MosaicPhoto className="mosaic-a" src={fotoPareja} alt="Pareja embarazada compartiendo el teléfono en casa" phrase="Para vivirlo acompañada, no solo de guardia." />
            <MosaicPhoto className="mosaic-b" src={fotoPanza} alt="Mujer embarazada usando el teléfono de pie" phrase="Tu semana, siempre a mano." />
            <MosaicPhoto className="mosaic-c" src={fotoSillon} alt="Mujer embarazada recostada revisando el teléfono" phrase="Para esas pausas que también cuentan." />
            <MosaicPhoto className="mosaic-d" src={fotoSonrisa} alt="Mujer embarazada sonriendo con el teléfono en la mano" phrase="Cada check-in, una sonrisa menos sola." />
          </div>
        </section>
      </LazySection>

      {/* PULL QUOTE */}
      <LazySection minHeight={260}>
        <section className="relative overflow-hidden max-w-[900px] mx-auto" style={{ padding: "clamp(48px,7vw,84px) 24px" }}>
          <div aria-hidden="true" className="absolute rounded-full pointer-events-none" style={{ top: -40, left: -60, width: 300, height: 300, background: C.rose, opacity: 0.14, filter: "blur(90px)" }} />
          <div aria-hidden="true" className="absolute rounded-full pointer-events-none" style={{ bottom: -60, right: -40, width: 320, height: 320, background: C.purple, opacity: 0.14, filter: "blur(90px)" }} />
          <span
            aria-hidden="true"
            className="font-heading block relative z-[1]"
            style={{ fontSize: "clamp(48px,6vw,66px)", lineHeight: 1, color: C.pink, opacity: 0.28, marginBottom: -6 }}
          >
            “
          </span>
          <p
            className="font-heading text-pretty relative z-[1]"
            style={{
              fontWeight: 700,
              fontSize: "clamp(22px,2.8vw,34px)",
              lineHeight: 1.34,
              letterSpacing: "-0.02em",
              margin: 0,
              maxWidth: "20em",
              background: gradientBrand,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Cada semana de tu embarazo es distinta. Merecés estar acompañada en todas, no solo en
            las más lindas.
          </p>
        </section>
      </LazySection>

      {/* POR QUÉ ACUNA APP */}
      <LazySection minHeight={500}>
        <section className="max-w-[1120px] mx-auto" style={{ padding: "clamp(64px,9vw,110px) 24px" }}>
          <p className="uppercase" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: C.pink, margin: "0 0 44px" }}>
            Por qué Acuna App
          </p>
          <div className="flex flex-col">
            {pilares.map((p, i) => (
            <div
              key={p.number}
              className="grid [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]"
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
      </LazySection>

      {/* ADENTRO DE LA APP */}
      <section id="adentro" className="bg-white" style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-[1120px] mx-auto" style={{ padding: "clamp(64px,9vw,110px) 24px" }}>
          <div className="flex items-end justify-between gap-5 flex-wrap mb-10">
            <h2 className="font-heading" style={{ fontSize: "clamp(28px,3.4vw,42px)", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>
              Adentro de la app
            </h2>
            <p style={{ fontSize: 15, color: C.faint, margin: 0 }}>6 áreas, todo en un solo lugar</p>
          </div>
          <div className="inside-app-grid">
            <div className="cell-group">
              <SectionCard s={secciones[0]} />
              <SectionCard s={secciones[1]} />
              <SectionCard s={secciones[2]} className="span-2" />
            </div>

            <div
              className="cell-phone flex justify-center"
              style={{ background: "var(--brand-purple-light)", borderRadius: 28, paddingTop: 16, width: 270, height: 390, overflow: "hidden" }}
            >
              <PhoneFrame
                src="/?app_preview=citas"
                title="Vista previa: Citas"
                width={240}
                height={600}
                screenHeight={582}
                rotate={0}
                z={1}
                pos={{ position: "relative" }}
              />
            </div>

            <div className="cell-group">
              <SectionCard s={secciones[3]} />
              <SectionCard s={secciones[4]} />
              <SectionCard s={secciones[5]} className="span-2" />
            </div>
          </div>
        </div>
      </section>

      {/* EN NÚMEROS — real product facts (weeks/trimesters/areas), never invented user stats.
          Same numbers as before, just drawn as a donut chart with a scroll-triggered
          reveal + count-up so the section pulls the eye without inventing any data. */}
      <LazySection minHeight={520}>
        <section ref={numbersRef} className="max-w-[1120px] mx-auto" style={{ padding: "clamp(56px,8vw,100px) 24px" }}>
          <p className="uppercase" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: C.pink, margin: "0 0 14px" }}>
            Tu embarazo, de punta a punta
          </p>
          <h2 className="font-heading text-pretty" style={{ fontSize: "clamp(26px,3.2vw,38px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, margin: "0 0 40px", maxWidth: "26em" }}>
            Contenido pensado semana a semana, no un calendario genérico.
          </h2>

          <div className="grid items-center" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: "clamp(32px,5vw,64px)" }}>
            <div className="flex flex-col items-center">
              <div role="img" aria-label="Gráfico circular: 40 semanas de embarazo divididas en 3 trimestres">
                <TrimesterRing active={numbersInView} />
              </div>
              <div className="flex flex-wrap justify-center" style={{ gap: "6px 18px", marginTop: 22 }} aria-hidden="true">
                {TRIMESTER_SEGMENTS.map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="shrink-0 rounded-full" style={{ width: 10, height: 10, background: s.color }} />
                    <span style={{ fontSize: 13, color: C.paragraph }}>
                      <strong style={{ color: C.ink, fontWeight: 700 }}>{s.label}</strong> · {s.range}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              {[
                { n: 3, label: "Trimestres, cada uno con su guía", iconPath: "M4 20h16 M8 20V10 M12 20V4 M16 20V13" },
                { n: 6, label: "Áreas en un solo lugar", iconPath: "M12 20.5C12 20.5 4.5 16.2 4.5 10.6A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 3C19.5 16.2 12 20.5 12 20.5Z" },
                { n: 1, label: "Una sola app para todo el embarazo", iconPath: "M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M17 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z M2 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5 M15 20c0-2.4-1.6-4.4-3.8-5.1c.6-.3 1.2-.4 1.8-.4c2.8 0 5 2.2 5 5" },
              ].map((f) => (
                <FactRow key={f.label} fact={f} active={numbersInView} />
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* MODO ACOMPAÑANTE */}
      <section id="acompanante" className="bg-white" style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-[1120px] mx-auto" style={{ padding: "clamp(64px,9vw,110px) 24px" }}>
          <div className="max-w-[640px] mb-10">
            <p className="uppercase" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: C.purple, margin: "0 0 14px" }}>
              Modo acompañante
            </p>
            <h2 className="font-heading text-pretty" style={{ fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 14px" }}>
              Tu acompañante tampoco se queda afuera.
            </h2>
            <p className="text-pretty" style={{ fontSize: 17, lineHeight: 1.6, color: C.paragraph, margin: 0 }}>
              Invitá a tu pareja, a tu mamá o a quien quieras para que lo viva con vos, desde su
              propia app.
            </p>
          </div>

          <div className="partner-bento">
            <div className="partner-cell" style={{ background: "var(--partner-surface-tint)", borderRadius: 28, padding: 26 }}>
              <p className="font-heading" style={{ fontSize: 21, fontWeight: 800, color: C.ink, margin: "0 0 8px" }}>
                Se entera de todo, sin que tengas que repetirlo
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: C.paragraph, margin: "0 0 20px" }}>
                Ve tu semana, tus síntomas recientes y qué puede hacer para ayudarte, todo
                actualizado solo.
              </p>
              <div className="flex justify-center" style={{ background: "var(--partner-gradient)", borderRadius: 24, height: 360, overflow: "hidden" }}>
                <PhoneFrame
                  src="/?app_preview=partner-inicio&__dev_mock=1"
                  title="Vista previa: Inicio del acompañante"
                  width={230}
                  height={560}
                  screenHeight={542}
                  rotate={0}
                  z={1}
                  pos={{ position: "relative", top: 18 }}
                />
              </div>
            </div>

            <div className="partner-cell flex flex-col" style={{ background: "var(--partner-surface-tint)", borderRadius: 28, padding: 26 }}>
              <div className="flex-1 flex items-center" style={{ marginBottom: 20 }}>
                <ChatMock />
              </div>
              <p className="font-heading" style={{ fontSize: 19, fontWeight: 800, color: C.ink, margin: "0 0 8px" }}>
                Te manda notas y aliento
              </p>
              <p style={{ fontSize: 14.5, lineHeight: 1.5, color: C.paragraph, margin: 0 }}>
                Palabras que te llegan directo, cuando más las necesitás.
              </p>
            </div>

            <div className="partner-cell" style={{ background: "var(--partner-surface-tint)", borderRadius: 28, padding: 26 }}>
              <p className="font-heading" style={{ fontSize: 19, fontWeight: 800, color: C.ink, margin: "0 0 8px" }}>
                Ve las citas compartidas
              </p>
              <p style={{ fontSize: 14.5, lineHeight: 1.5, color: C.paragraph, margin: "0 0 20px" }}>
                Sabe cuándo son tus controles y puede confirmar si te acompaña.
              </p>
              <div className="flex justify-center" style={{ background: "var(--partner-gradient)", borderRadius: 24, height: 300, overflow: "hidden" }}>
                <PhoneFrame
                  src="/?app_preview=partner-citas&__dev_mock=1"
                  title="Vista previa: Citas del acompañante"
                  width={190}
                  height={460}
                  screenHeight={442}
                  rotate={0}
                  z={1}
                  pos={{ position: "relative", top: 14 }}
                />
              </div>
            </div>

            <div className="partner-cell flex flex-col justify-center" style={{ background: "var(--partner-gradient)", borderRadius: 28, padding: 26 }}>
              <span
                className="flex items-center justify-center shrink-0 mb-4"
                style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.2)" }}
              >
                <Icon
                  path="M12 3 4 7v5c0 4.4 3.4 8.3 8 9 4.6-.7 8-4.6 8-9V7l-8-4Z M9.5 12l2 2 3.5-3.5"
                  size={22}
                  stroke="#fff"
                  strokeWidth={1.8}
                />
              </span>
              <p className="font-heading" style={{ fontSize: 19, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>
                Vos decidís qué comparte
              </p>
              <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "rgba(255,255,255,0.9)", margin: 0 }}>
                Entra con una invitación simple, y solo ve lo que vos elegís mostrarle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NOTA */}
      <LazySection minHeight={140}>
        <section className="max-w-[880px] mx-auto" style={{ padding: "clamp(56px,7vw,84px) 24px 0" }}>
          <p className="text-pretty" style={{ fontSize: 15.5, lineHeight: 1.75, color: C.muted, margin: 0 }}>
            Acuna App te ayuda a organizarte y a cuidar tu bienestar emocional durante el embarazo
            y el postparto. No reemplaza la consulta con tu médico, no da diagnósticos ni indica
            tratamientos. Para eso siempre vas a tener a tu equipo de salud de confianza.
          </p>
        </section>
      </LazySection>

      {/* CTA FINAL */}
      <section id="crear" className="max-w-[1120px] mx-auto" style={{ padding: "clamp(48px,7vw,90px) 24px clamp(64px,9vw,110px)" }}>
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: 34, background: gradientBrandPanel, boxShadow: "0 24px 60px rgba(226,111,206,0.3)", padding: "clamp(40px,6vw,76px) clamp(26px,5vw,64px)" }}
        >
          <div aria-hidden="true" className="absolute rounded-full" style={{ top: -90, right: -70, width: 320, height: 320, background: "radial-gradient(circle,rgba(255,255,255,0.32) 0%,rgba(255,255,255,0) 70%)", filter: "blur(30px)" }} />
          <div aria-hidden="true" className="absolute rounded-full" style={{ bottom: -110, left: -60, width: 300, height: 300, background: "radial-gradient(circle,rgba(255,154,106,0.4) 0%,rgba(255,154,106,0) 70%)", filter: "blur(40px)" }} />
          <div
            className="relative z-[1] grid items-center [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]"
            style={{ gap: "clamp(26px,4vw,48px)" }}
          >
            <div>
              <h2 className="font-heading" style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.06, color: "#fff", margin: "0 0 14px" }}>
                Empezá esta semana.
              </h2>
              <p className="text-pretty" style={{ fontSize: "clamp(16px,1.5vw,19px)", lineHeight: 1.6, color: "rgba(255,255,255,0.86)", margin: 0, maxWidth: "26em" }}>
                Creá tu cuenta. Vas a poder anotar tu semana en menos de un minuto.
              </p>
            </div>
            <div className="flex justify-start">
              <button
                onClick={() => onGoToAuth("signup")}
                className="btn-lift cursor-pointer transition-colors hover:text-[#9b5de5] whitespace-nowrap"
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
                Crear mi cuenta
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ASÍ SE SIENTE — beneficios reales, no testimonios inventados */}
      <LazySection minHeight={760}>
        <section className="max-w-[1120px] mx-auto" style={{ padding: "0 24px clamp(64px,9vw,110px)" }}>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <div>
            <p className="uppercase" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: C.pink, margin: "0 0 14px" }}>
              Así se siente
            </p>
            <h2 className="font-heading text-pretty" style={{ fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, margin: 0, maxWidth: "14em" }}>
              Beneficios que vas a notar desde la primera semana.
            </h2>
          </div>
          <a
            href="#crear"
            className="btn-lift cursor-pointer transition-[filter] hover:brightness-105 whitespace-nowrap"
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              padding: "14px 26px",
              borderRadius: 999,
              background: ctaSolid,
              boxShadow: ctaShadow,
            }}
          >
            Crear cuenta
          </a>
        </div>

        <div className="experience-grid">
          <FlipCard
            className="area-big"
            frontClassName="flex flex-col"
            frontStyle={{ background: "rgba(155,93,229,0.05)", padding: "26px 24px" }}
            backText="Vas a mirar atrás y vas a poder ver cada semana, cada síntoma, cada momento. Nada se pierde."
          >
            <p className="uppercase" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", color: C.purple, margin: "0 0 14px" }}>
              Semana a semana
            </p>
            <p className="font-heading text-pretty" style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.35, color: C.ink, margin: 0 }}>
              Vas a poder ver cómo crece tu bebé, guardar cómo te sentís y no perderte ningún
              control, todo en el mismo lugar.
            </p>
          </FlipCard>

          <div className="area-photo experience-card relative overflow-hidden" style={{ borderRadius: 24, minHeight: 200 }}>
            <img
              src={fotoEmbarazada}
              alt="Mujer embarazada usando su teléfono junto a una ventana"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <FlipCard
            className="area-statA"
            frontClassName="flex flex-col justify-center"
            frontStyle={{ background: "rgba(155,93,229,0.05)", padding: "24px" }}
            backText="Cada semana con su propio contenido. Nunca vas a sentir que te falta información."
          >
            <p className="font-heading" style={{ fontSize: "clamp(36px,4vw,46px)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 8px", color: C.ink }}>
              40
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.5, color: C.paragraph, margin: 0 }}>
              Semanas de contenido curado, pensado para cada etapa de tu embarazo.
            </p>
          </FlipCard>

          <FlipCard
            className="area-gradA"
            frontStyle={{ background: gradientBrandPanel, padding: "24px", color: "#fff" }}
            backStyle={{ background: C.deepPlum }}
            backText="Tu acompañante se entera de todo sin que tengas que repetirlo dos veces."
          >
            <p className="font-heading" style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.01em", margin: "0 0 8px" }}>
              Modo acompañante
            </p>
            <p style={{ fontSize: 14.5, lineHeight: 1.5, margin: 0, opacity: 0.92 }}>
              Invitá a tu pareja o a quien vos quieras para que lo viva con vos.
            </p>
          </FlipCard>

          <a
            href="#adentro"
            className="area-nav experience-card group flex items-center gap-3 no-underline"
            style={{ background: "rgba(155,93,229,0.05)", borderRadius: 24, padding: "22px 24px", color: C.ink }}
          >
            <span
              className="flex items-center justify-center shrink-0"
              style={{ width: 40, height: 40, borderRadius: 12, background: gradientNumber }}
            >
              <Icon path="M9 6l6 6-6 6" size={18} strokeWidth={2.2} stroke="#fff" />
            </span>
            <span className="font-heading transition-colors group-hover:text-[#e26fce]" style={{ fontSize: 16, fontWeight: 800 }}>
              Descubrí todo lo que incluye
            </span>
          </a>

          <FlipCard
            className="area-statB"
            frontClassName="flex flex-col justify-center"
            frontStyle={{ background: "rgba(155,93,229,0.05)", padding: "24px" }}
            backText="Del seguimiento al bienestar emocional, todo conectado. Sin cambiar de app."
          >
            <p className="font-heading" style={{ fontSize: "clamp(36px,4vw,46px)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 8px", color: C.ink }}>
              6
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.5, color: C.paragraph, margin: 0 }}>
              Áreas en un solo lugar: desde el seguimiento hasta tu bienestar emocional.
            </p>
          </FlipCard>

          <FlipCard
            className="area-dark"
            frontClassName="flex items-center"
            frontStyle={{ background: C.deepPlum, padding: "26px 28px" }}
            backText="Es tu diario. Podés volver a leerlo cuando quieras, para siempre."
          >
            <p className="text-pretty" style={{ fontSize: 18, lineHeight: 1.5, color: "#fff", margin: 0, fontWeight: 600 }}>
              Tu historial es tuyo. Podés exportarlo cuando quieras, y nadie más lo ve si vos no
              querés.
            </p>
          </FlipCard>
        </div>
        </section>
      </LazySection>

      {/* QUIÉN SOY */}
      <LazySection minHeight={480}>
        <section className="relative overflow-hidden bg-white" style={{ borderTop: `1px solid ${C.border}` }}>
        <div aria-hidden="true" className="absolute rounded-full pointer-events-none" style={{ top: -80, left: -80, width: 320, height: 320, background: C.rose, opacity: 0.1, filter: "blur(100px)" }} />
        <div aria-hidden="true" className="absolute rounded-full pointer-events-none" style={{ bottom: -100, right: -60, width: 300, height: 300, background: C.purple, opacity: 0.1, filter: "blur(100px)" }} />

        <div
          className="relative z-[1] max-w-[1120px] mx-auto grid items-center [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]"
          style={{ padding: "clamp(56px,8vw,100px) 24px", gap: "clamp(40px,5vw,64px)" }}
        >
          <div className="flex justify-center sm:justify-start">
            {/* Polaroid — white card frame, tilted, a little washi-tape strip pinning it down */}
            <div className="relative" style={{ transform: "rotate(-4deg)" }}>
              <div
                aria-hidden="true"
                className="absolute"
                style={{
                  top: -16,
                  left: "50%",
                  width: 90,
                  height: 30,
                  marginLeft: -45,
                  transform: "rotate(3deg)",
                  background: "rgba(255,111,159,0.35)",
                  boxShadow: "0 4px 10px rgba(36,29,43,0.12)",
                }}
              />
              <div style={{ background: "#fff", padding: "14px 14px 20px", borderRadius: 6, boxShadow: "0 26px 50px rgba(36,29,43,0.22), 0 4px 14px rgba(36,29,43,0.1)" }}>
                <div style={{ width: 230, height: 270, overflow: "hidden" }}>
                  <img src={fotoRenata} alt="Renata Kastika" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
                <p className="text-center" style={{ fontFamily: "var(--font-script)", fontSize: 28, fontWeight: 700, color: C.ink, margin: "10px 0 0" }}>
                  Renata Kastika
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="uppercase" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: C.pink, margin: "0 0 14px" }}>
              Quién soy
            </p>
            <h2 className="font-heading text-pretty" style={{ fontSize: "clamp(26px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, margin: "0 0 18px" }}>
              Hola, soy Renata Kastika.
            </h2>
            <p className="text-pretty" style={{ fontSize: 16.5, lineHeight: 1.7, color: C.paragraph, margin: 0, maxWidth: "42em" }}>
              Tengo 21 años y estoy en mi último cuatrimestre de la carrera de Diseño en
              Comunicación Visual, Gráfica y Digital. Este proyecto surgió pensando en mi tesis
              final de carrera, lo que me llevó a uno de mis mayores intereses, inspiraciones y
              admiraciones en la vida: la maternidad y el cuerpo de la mujer. Desde ese interés
              personal por el tema, y como comunicadora, busqué cubrir un espacio que estaba
              faltando: un espacio de fácil acceso, que sirva y acompañe de forma integral a{" "}
              <span style={{ fontFamily: "var(--font-script)", fontSize: "1.5em", fontWeight: 700, color: C.pink }}>
                las madres
              </span>
              , las inspiraciones de mi vida.
            </p>
          </div>
        </div>
        </section>
      </LazySection>

      <footer style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-[1120px] mx-auto flex flex-wrap items-center justify-between gap-2.5" style={{ padding: "28px 24px 40px" }}>
          <p style={{ fontSize: 14, color: C.faint, margin: 0 }}>Acuna App © 2026 · No sustituye la atención médica profesional.</p>
          {import.meta.env.DEV ? (
            <button onClick={onDevPreview} className="cursor-pointer hover:underline font-heading" style={{ fontSize: 15, fontWeight: 800, color: C.hairline }}>
              Vista previa del dashboard (solo desarrollo)
            </button>
          ) : (
            <span className="font-heading" style={{ fontSize: 15, fontWeight: 800, color: C.hairline }}>
              Acuna App
            </span>
          )}
        </div>
      </footer>

      <ScrollToTopButton />
    </div>
  );
}
