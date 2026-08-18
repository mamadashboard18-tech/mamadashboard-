import { Home, CalendarDays, Headphones, User } from "lucide-react";

const sections = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "citas", label: "Citas", icon: CalendarDays },
  { id: "multimedia", label: "Multimedia", icon: Headphones },
];

export default function PartnerSidebar({ active, onSelect, onLogout, motherNombre, citasPendientesRsvp }) {
  return (
    <aside className="no-print relative z-10 w-[264px] shrink-0 hidden lg:flex flex-col bg-white/75 backdrop-blur-md border-r border-partner-border">
      <div className="px-6 pt-6 pb-5 border-b border-partner-border">
        <p className="text-[13px] font-bold tracking-wide text-partner-violet uppercase mb-1">
          Acompañando a
        </p>
        <h1 className="font-heading text-xl font-extrabold text-partner-ink">
          {motherNombre || "tu pareja"}
        </h1>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {sections.map((s) => {
          const Icon = s.icon;
          const isActive = s.id === active;
          const showBadge = s.id === "citas" && citasPendientesRsvp > 0;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-base font-semibold transition-colors cursor-pointer ${
                isActive
                  ? "text-white"
                  : "text-[#71667a] hover:bg-partner-surface-tint hover:text-partner-violet"
              }`}
              style={isActive ? { background: "var(--partner-gradient)" } : undefined}
            >
              <Icon className="w-[17px] h-[17px] shrink-0" strokeWidth={1.6} />
              <span className="flex-1 text-left">{s.label}</span>
              {showBadge && (
                <span
                  className={`text-[11px] font-bold rounded-full w-[19px] h-[19px] flex items-center justify-center shrink-0 ${
                    isActive ? "bg-white text-partner-violet" : "bg-partner-violet-deep text-white"
                  }`}
                >
                  {citasPendientesRsvp}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-partner-border flex flex-col gap-2">
        <button
          onClick={() => onSelect("perfil")}
          className="flex items-center gap-2 text-sm text-partner-ink-muted hover:text-partner-violet transition-colors cursor-pointer text-left"
        >
          <User className="w-3.5 h-3.5" strokeWidth={1.8} />
          Tu perfil
        </button>
        <button
          onClick={onLogout}
          className="text-sm text-partner-ink-muted hover:text-partner-violet transition-colors cursor-pointer text-left"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
