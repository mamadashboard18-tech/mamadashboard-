import { Home, CalendarDays, Sparkles, Headphones, Users } from "lucide-react";
import { sections } from "../data/sections";

const icons = {
  inicio: Home,
  citas: CalendarDays,
  bienestar: Sparkles,
  multimedia: Headphones,
  comunidad: Users,
};

const displayOrder = ["citas", "bienestar", "inicio", "multimedia", "comunidad"];
const orderedSections = displayOrder
  .map((id) => sections.find((s) => s.id === id))
  .filter(Boolean);

export default function BottomNav({ active, onSelect }) {
  return (
    <nav
      className="no-print safe-bottom fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/96 backdrop-blur-md border-t border-[var(--border-soft)]"
      aria-label="Navegación principal"
    >
      <div className="grid grid-cols-5">
        {orderedSections.map((s) => {
          const Icon = icons[s.id] || Home;
          const isActive = s.id === active;
          const label = s.label === "Mi Bienestar" ? "Bienestar" : s.label;

          if (s.id === "inicio") {
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className="relative flex flex-col items-center justify-end cursor-pointer"
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className="w-14 h-14 rounded-full flex items-center justify-center -mt-[30px]"
                  style={{
                    background: "var(--gradient-hero)",
                    boxShadow: "0 10px 22px rgba(216,109,214,0.45), 0 0 0 8px rgba(226,111,206,0.12)",
                  }}
                >
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                </span>
                <span className="text-[12px] font-bold text-brand-pink mt-0.5 mb-2">{label}</span>
              </button>
            );
          }

          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className="relative flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] cursor-pointer"
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className="w-[22px] h-[22px] transition-colors"
                strokeWidth={isActive ? 2.4 : 1.6}
                color={isActive ? "var(--brand-pink)" : "#9c93a3"}
              />
              <span
                className={`text-[12px] leading-none transition-colors ${
                  isActive ? "text-brand-pink font-semibold" : "text-[#9c93a3] font-medium"
                }`}
              >
                {label}
              </span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-brand-pink" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
