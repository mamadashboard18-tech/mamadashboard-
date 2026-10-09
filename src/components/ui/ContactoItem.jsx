import { Phone, Pencil, Trash2 } from "lucide-react";
import { IconAction } from "./Perfil";

function iniciales(nombre) {
  return nombre
    .replace(/^(dra?\.?|lic\.?)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

export default function ContactoItem({ nombre, detalle, telefono, badge, nota, extra, editando, onEditar, onEliminar }) {
  return (
    <li
      className={`flex items-center gap-3 rounded-[18px] p-3 border transition-colors ${
        editando ? "border-brand-pink bg-brand-pink-light/40" : "border-[var(--border-soft)] bg-[var(--bg)]"
      }`}
    >
      <span
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
        style={{ background: "var(--gradient-hero)" }}
      >
        {iniciales(nombre) || "?"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-bold text-ink flex items-center gap-1.5 flex-wrap">
          <span className="truncate">{nombre}</span>
          {badge && (
            <span className="text-[10px] font-bold text-brand-magenta bg-brand-pink-light rounded-full px-2 py-0.5">
              {badge}
            </span>
          )}
        </p>
        {detalle && <p className="text-xs text-ink-muted mt-0.5 truncate">{detalle}</p>}
        {telefono && <p className="text-xs text-ink-muted whitespace-nowrap">{telefono}</p>}
        {nota}
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        {telefono && (
          <IconAction icon={Phone} label={`Llamar a ${nombre}`} href={`tel:${telefono.replace(/\s+/g, "")}`} tono="verde" />
        )}
        {extra}
        <IconAction icon={Pencil} label="Editar" onClick={onEditar} />
        <IconAction icon={Trash2} label="Eliminar" onClick={onEliminar} danger />
      </div>
    </li>
  );
}
