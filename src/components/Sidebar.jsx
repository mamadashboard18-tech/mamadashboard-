import { sections } from "../data/sections";

import { Home, CalendarDays, Sparkles, Headphones, Users } from "lucide-react";

const icons = {
  inicio: Home,
  citas: CalendarDays,
  bienestar: Sparkles,
  multimedia: Headphones,
  comunidad: Users,
};

export default function Sidebar({ active, onSelect, onLogout }) {
  return (
    <aside className="no-print hidden lg:flex w-64 shrink-0 h-full bg-white border-r border-[var(--border-soft)] flex-col">
      <div className="px-6 py-6 border-b border-[var(--border-soft)]">
        <p className="text-xs font-medium tracking-wide text-brand-pink uppercase">Tu compañera de embarazo</p>
        <h1 className="font-heading text-lg font-bold text-ink mt-1">Mamá App</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {sections.map((s) => {
          const Icon = icons[s.id] || Home;
          const isActive = s.id === active;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "text-white shadow-sm"
                  : "text-ink-muted hover:bg-brand-pink-light/40 hover:text-brand-pink"
              }`}
              style={isActive ? { background: "var(--gradient-hero)" } : undefined}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
              {s.label}
            </button>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-[var(--border-soft)]">
        <button
          onClick={onLogout}
          className="text-xs text-ink-muted hover:text-brand-pink cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
