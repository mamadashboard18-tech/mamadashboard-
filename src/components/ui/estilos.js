// Clases compartidas por las pantallas de Mi Perfil, alineadas con el resto de
// la app (campos tipo píldora, tarjetas redondeadas, degradado de marca).

export const inputClass =
  "w-full rounded-full border border-[rgba(155,93,229,0.18)] bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand-pink transition-colors box-border";

export const textareaClass =
  "w-full rounded-[20px] border border-[rgba(155,93,229,0.18)] bg-white p-4 text-[15px] text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand-pink transition-colors resize-none box-border";

export const labelClass = "text-xs text-ink-muted block mb-1.5 px-1";

export const cardShadow = { boxShadow: "0 2px 16px rgba(155,93,229,0.08)" };

export const gradientStyle = { background: "var(--gradient-hero)" };

export function opcionClass(activa) {
  return `flex-1 text-sm font-bold py-2.5 px-3 rounded-full border transition-colors cursor-pointer ${
    activa
      ? "text-white border-transparent"
      : "bg-white text-ink-muted border-[rgba(155,93,229,0.18)] hover:border-brand-pink hover:text-brand-pink"
  }`;
}

export function opcionStyle(activa) {
  return activa ? gradientStyle : undefined;
}
