import { Check, Plus, Save, Trash2, ChevronDown } from "lucide-react";
import BackButton from "../BackButton";
import Header from "../Header";
import { inputClass, cardShadow, gradientStyle } from "./estilos";

export function PantallaTop({ onBack, backLabel = "Volver a Mi Perfil", icon, title, subtitle, action, className = "" }) {
  return (
    <div className={className}>
      <BackButton onBack={onBack} label={backLabel} className="mb-4" />
      <div className="flex items-start justify-between gap-3">
        <Header icon={icon} title={title} subtitle={subtitle} />
        {action}
      </div>
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-[24px] border border-[var(--border-soft)] p-5 ${className}`}
      style={cardShadow}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ icon: Icon, children, className = "mb-3" }) {
  return (
    <p className={`text-xs font-bold text-ink-muted uppercase tracking-wide flex items-center gap-2 ${className}`}>
      {Icon && <Icon className="w-4 h-4 text-brand-pink" strokeWidth={1.9} />}
      {children}
    </p>
  );
}

export function ProgresoCard({ hechos, total, etiqueta = "listo" }) {
  const progreso = total === 0 ? 0 : Math.round((hechos / total) * 100);
  return (
    <div className="rounded-[24px] p-5 mb-5 text-white" style={{ ...gradientStyle, boxShadow: "0 8px 28px rgba(226,111,206,0.25)" }}>
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-white/80">Tu progreso</p>
          <p className="text-[15px] font-medium mt-1">
            {hechos} de {total} {etiqueta}
          </p>
        </div>
        <span className="font-heading text-[34px] font-extrabold leading-none">{progreso}%</span>
      </div>
      <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${progreso}%` }} />
      </div>
    </div>
  );
}

export function CheckCircle({ checked }) {
  return (
    <span
      className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 transition-colors ${
        checked ? "text-white" : "border-2 border-[rgba(226,111,206,0.35)] bg-white"
      }`}
      style={checked ? gradientStyle : undefined}
    >
      {checked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
    </span>
  );
}

export function CheckRow({ checked, onToggle, children, detalle, onDelete, tachar = true }) {
  return (
    <li className="flex items-center gap-2 py-1">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onToggle}
        className="flex items-start gap-3 flex-1 min-w-0 text-left py-1.5 cursor-pointer"
      >
        <CheckCircle checked={checked} />
        <span className="min-w-0">
          <span className={`block text-[15px] leading-snug ${checked && tachar ? "text-ink-muted/70 line-through" : "text-ink"}`}>
            {children}
          </span>
          {detalle && <span className="block text-xs text-ink-muted mt-0.5">{detalle}</span>}
        </span>
      </button>
      {onDelete && <IconAction icon={Trash2} label="Eliminar" onClick={onDelete} danger />}
    </li>
  );
}

export function AgregarInput({ value, onChange, onAdd, placeholder }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
        placeholder={placeholder}
        className={`${inputClass} flex-1 min-w-0`}
      />
      <button
        type="button"
        onClick={onAdd}
        disabled={!value.trim()}
        aria-label="Agregar"
        title="Agregar"
        className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 cursor-pointer transition-transform hover:scale-[1.04] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
        style={gradientStyle}
      >
        <Plus className="w-5 h-5" strokeWidth={2.2} />
      </button>
    </div>
  );
}

export function Segmentado({ opciones, value, onChange, className = "" }) {
  return (
    <div className={`flex bg-white border border-[var(--border-soft)] rounded-full p-1 ${className}`} style={cardShadow}>
      {opciones.map((opt) => {
        const activa = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 text-sm font-bold px-3 py-2 rounded-full transition-colors cursor-pointer ${
              activa ? "text-white" : "text-ink-muted hover:text-brand-pink"
            }`}
            style={activa ? gradientStyle : undefined}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Chip({ activo, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 text-sm font-bold px-4 py-2 rounded-full border whitespace-nowrap transition-colors cursor-pointer ${
        activo
          ? "text-white border-transparent"
          : "bg-white text-ink-muted border-[rgba(155,93,229,0.18)] hover:border-brand-pink hover:text-brand-pink"
      }`}
      style={activo ? gradientStyle : undefined}
    >
      {children}
    </button>
  );
}

export function IconAction({ icon: Icon, label, onClick, href, danger = false, tono = "neutro", filled = false }) {
  const tonos = {
    neutro: danger
      ? "text-ink-muted/70 hover:text-red-500 hover:bg-red-50"
      : "text-ink-muted hover:text-brand-pink hover:bg-brand-pink-light/50",
    rosa: "bg-brand-pink-light/60 text-brand-pink hover:bg-brand-pink-light",
    violeta: "bg-brand-purple-light/70 text-brand-purple hover:bg-brand-purple-light",
    verde: "bg-[#e3f5e6] text-[#3f9a52] hover:bg-[#d3eed8]",
  };
  const className = `w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${tonos[tono]}`;
  const icono = <Icon className="w-[15px] h-[15px]" strokeWidth={1.9} fill={filled ? "currentColor" : "none"} />;
  if (href) {
    return (
      <a href={href} aria-label={label} title={label} className={className}>
        {icono}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={className}>
      {icono}
    </button>
  );
}

export function BotonPrimario({ children, icon: Icon, className = "", ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center gap-2 text-white text-[15px] font-bold px-5 py-3 rounded-full cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${className}`}
      style={gradientStyle}
    >
      {Icon && <Icon className="w-4 h-4" strokeWidth={2} />}
      {children}
    </button>
  );
}

export function BotonSecundario({ children, icon: Icon, className = "", ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center gap-2 text-brand-pink text-[15px] font-bold px-5 py-3 rounded-full border-[1.5px] border-brand-pink bg-white cursor-pointer hover:bg-brand-pink-light/40 transition-colors whitespace-nowrap ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" strokeWidth={2} />}
      {children}
    </button>
  );
}

export function BotonGuardar({ className = "", label = "Guardar", ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={`shrink-0 w-[52px] h-[52px] flex items-center justify-center text-white rounded-full cursor-pointer transition-transform hover:scale-[1.04] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{ ...gradientStyle, boxShadow: "0 6px 20px rgba(226,111,206,0.3)" }}
    >
      <Save className="w-5 h-5" />
    </button>
  );
}

export function Guardado({ visible }) {
  if (!visible) return null;
  return (
    <span className="text-sm font-bold text-brand-purple inline-flex items-center gap-1.5">
      <span className="w-5 h-5 rounded-full bg-brand-purple-light flex items-center justify-center">
        <Check className="w-3 h-3" strokeWidth={3} />
      </span>
      Guardado
    </span>
  );
}

export function Vacio({ icon: Icon, children }) {
  return (
    <div className="flex flex-col items-center text-center py-6 px-4">
      {Icon && (
        <span className="w-12 h-12 rounded-full bg-brand-pink-light/60 text-brand-pink flex items-center justify-center mb-3">
          <Icon className="w-5 h-5" strokeWidth={1.8} />
        </span>
      )}
      <p className="text-sm text-ink-muted leading-relaxed max-w-[280px]">{children}</p>
    </div>
  );
}

export function Select({ value, onChange, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`${inputClass} appearance-none pr-10 cursor-pointer`}
      >
        {children}
      </select>
      <ChevronDown className="w-4 h-4 text-ink-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

export function ToggleRow({ icon: Icon, titulo, detalle, children }) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      {Icon && (
        <span className="w-9 h-9 rounded-full bg-[rgba(155,93,229,0.12)] text-brand-purple flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" strokeWidth={1.8} />
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-bold text-ink">{titulo}</p>
        {detalle && <p className="text-xs text-ink-muted mt-0.5">{detalle}</p>}
      </div>
      {children}
    </div>
  );
}
