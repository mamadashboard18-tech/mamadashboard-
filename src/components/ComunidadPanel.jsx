import { Users, User, CalendarHeart, MessagesSquare, Clock } from "lucide-react";

const proximamente = [
  {
    icon: CalendarHeart,
    titulo: "Grupos por semana",
    descripcion: "Compartí el camino con mamás que están en tu misma semana de embarazo.",
  },
  {
    icon: MessagesSquare,
    titulo: "Foro de preguntas",
    descripcion: "Preguntá, contá tu experiencia y leé lo que vivieron otras mamás.",
  },
];

export default function ComunidadPanel({ onNavigate }) {
  return (
    <div className="max-w-[680px]">
      <div className="flex items-center justify-end mb-1.5">
        <button
          onClick={() => onNavigate?.("perfil")}
          className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-muted hover:bg-brand-pink-light/60 hover:text-brand-pink transition-colors cursor-pointer"
          aria-label="Mi perfil"
        >
          <User className="w-5 h-5" strokeWidth={1.7} />
        </button>
      </div>

      <h2 className="font-heading text-[28px] font-extrabold text-ink leading-tight flex items-center gap-2.5 mb-2">
        <Users className="w-[26px] h-[26px] text-brand-pink shrink-0" strokeWidth={1.7} />
        Comunidad
      </h2>
      <p className="text-[17px] text-ink-muted leading-relaxed mb-6 max-w-[520px]">
        Conectá con otras mamás
      </p>

      <div
        className="relative overflow-hidden rounded-[28px] p-6 mb-6 text-center"
        style={{ background: "var(--gradient-hero-card)", boxShadow: "0 16px 40px rgba(255,138,92,0.25)" }}
      >
        <div
          className="absolute -top-[70px] -right-[60px] w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)", filter: "blur(30px)" }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 bg-white/28 text-white text-[13px] font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
            <Clock className="w-3.5 h-3.5" strokeWidth={2.2} />
            Próximamente
          </span>
          <div className="w-[84px] h-[84px] rounded-full bg-white/24 flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-white" strokeWidth={1.6} />
          </div>
          <p className="font-heading text-white text-[24px] font-extrabold leading-tight">
            Estamos armando tu comunidad
          </p>
          <p className="text-white/90 text-[16px] leading-relaxed mt-2 max-w-[440px]">
            Muy pronto vas a poder acompañarte con otras mamás que están viviendo lo mismo que vos.
          </p>
        </div>
      </div>

      <p className="text-[13px] font-bold tracking-wide text-brand-pink uppercase mb-3">Lo que viene</p>
      <div className="flex flex-col gap-3">
        {proximamente.map(({ icon: Icon, titulo, descripcion }) => (
          <div
            key={titulo}
            className="flex items-start gap-3.5 bg-white border border-[rgba(155,93,229,0.14)] rounded-[22px] p-4"
            style={{ boxShadow: "0 2px 14px rgba(155,93,229,0.08)" }}
          >
            <span className="w-11 h-11 rounded-full bg-brand-pink-light/60 flex items-center justify-center text-brand-pink shrink-0">
              <Icon className="w-5 h-5" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="text-[16px] font-bold text-ink">{titulo}</p>
              <p className="text-[14.5px] text-ink-muted leading-relaxed mt-0.5">{descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
