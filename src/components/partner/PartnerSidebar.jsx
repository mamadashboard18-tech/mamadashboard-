const sections = [
  { id: "inicio", label: "Inicio", icon: "🏠" },
  { id: "citas", label: "Citas", icon: "🗓️" },
  { id: "multimedia", label: "Multimedia", icon: "🎧" },
];

export default function PartnerSidebar({ active, onSelect, onLogout, motherNombre, citasPendientesRsvp }) {
  return (
    <aside className="no-print w-64 shrink-0 h-full bg-white border-r border-rose-100 flex flex-col">
      <div className="px-6 py-6 border-b border-rose-100">
        <p className="text-xs font-medium tracking-wide text-rose-400 uppercase">Acompañando a</p>
        <h1 className="text-lg font-semibold text-gray-900 mt-1">{motherNombre || "tu pareja"}</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {sections.map((s) => {
          const isActive = s.id === active;
          const showBadge = s.id === "citas" && citasPendientesRsvp > 0;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-rose-50 hover:text-rose-600"
              }`}
            >
              <span className="text-base">{s.icon}</span>
              <span className="flex-1 text-left">{s.label}</span>
              {showBadge && (
                <span
                  className={`text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center ${
                    isActive ? "bg-white text-rose-500" : "bg-rose-500 text-white"
                  }`}
                >
                  {citasPendientesRsvp}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-rose-100">
        <button onClick={onLogout} className="text-xs text-gray-400 hover:text-rose-500">
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
