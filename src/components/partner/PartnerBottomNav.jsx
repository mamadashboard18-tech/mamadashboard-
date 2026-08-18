import { Home, CalendarDays, Headphones } from "lucide-react";

export default function PartnerBottomNav({ active, onSelect, citasPendientesRsvp }) {
  return (
    <nav
      className="no-print safe-bottom fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/70 backdrop-blur-md border-t border-partner-border"
      aria-label="Navegación de partner"
    >
      <div className="grid grid-cols-3">
        <button
          onClick={() => onSelect("citas")}
          className="relative flex flex-col items-center gap-0.5 py-2.5 pb-2 cursor-pointer"
          aria-current={active === "citas" ? "page" : undefined}
        >
          <CalendarDays
            className="w-5 h-5"
            strokeWidth={active === "citas" ? 2.2 : 1.7}
            color={active === "citas" ? "var(--partner-violet)" : "#9c93a3"}
          />
          <span
            className={`text-[11.5px] ${
              active === "citas" ? "font-bold text-partner-violet" : "font-semibold text-[#9c93a3]"
            }`}
          >
            Citas
          </span>
          {citasPendientesRsvp > 0 && (
            <span className="absolute top-0.5 right-[calc(50%-20px)] bg-partner-violet-deep text-white text-[10px] font-bold rounded-full w-[15px] h-[15px] flex items-center justify-center">
              {citasPendientesRsvp}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelect("inicio")}
          className="relative flex flex-col items-center justify-end cursor-pointer"
          aria-current={active === "inicio" ? "page" : undefined}
        >
          <span
            className="w-[52px] h-[52px] rounded-full flex items-center justify-center -mt-[26px] transition-[background,box-shadow] duration-200"
            style={
              active === "inicio"
                ? {
                    background: "var(--partner-gradient)",
                    boxShadow: "0 10px 20px rgba(91,33,182,0.4), 0 0 0 7px rgba(124,58,237,0.12)",
                  }
                : {
                    background: "var(--partner-violet-fill-soft)",
                    boxShadow: "0 4px 10px rgba(91,33,182,0.15)",
                  }
            }
          >
            <Home
              className={`w-[22px] h-[22px] ${active === "inicio" ? "text-white" : "text-partner-violet"}`}
              strokeWidth={2}
            />
          </span>
          <span
            className={`text-[11.5px] mt-1 mb-2 ${
              active === "inicio" ? "font-bold text-partner-violet" : "font-semibold text-[#9c93a3]"
            }`}
          >
            Inicio
          </span>
        </button>

        <button
          onClick={() => onSelect("multimedia")}
          className="flex flex-col items-center gap-0.5 py-2.5 pb-2 cursor-pointer"
          aria-current={active === "multimedia" ? "page" : undefined}
        >
          <Headphones
            className="w-5 h-5"
            strokeWidth={active === "multimedia" ? 2.2 : 1.7}
            color={active === "multimedia" ? "var(--partner-violet)" : "#9c93a3"}
          />
          <span
            className={`text-[11.5px] ${
              active === "multimedia" ? "font-bold text-partner-violet" : "font-semibold text-[#9c93a3]"
            }`}
          >
            Multimedia
          </span>
        </button>
      </div>
    </nav>
  );
}
