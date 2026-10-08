// Protagonista de la tarjeta de semana: a qué se parece el bebé, con longitud y peso.
// Pensado para ir sobre un fondo de gradiente (texto blanco).
export default function TamanoBebe({ size, length, weight, label = "Tu bebé es del tamaño de" }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-[132px] h-[132px] rounded-full bg-white/24 flex items-center justify-center shadow-[inset_0_0_0_6px_rgba(255,255,255,0.14)]">
        <span className="text-[76px] leading-none select-none" aria-hidden="true">
          {size.emoji}
        </span>
      </div>
      <p className="text-white text-[15px] opacity-90 mt-3">{label}</p>
      <p className="font-heading text-white text-[28px] font-extrabold leading-tight first-letter:uppercase">
        {size.name}
      </p>

      <div className="grid grid-cols-2 gap-2.5 w-full mt-4">
        <div className="bg-white/20 rounded-[16px] py-2.5">
          <p className="text-white text-[12px] uppercase tracking-wide opacity-85">Longitud</p>
          <p className="text-white text-[22px] font-bold leading-tight">
            {length ? `${length}` : "—"}
            {length && <span className="text-[14px] font-semibold opacity-85"> cm</span>}
          </p>
        </div>
        <div className="bg-white/20 rounded-[16px] py-2.5">
          <p className="text-white text-[12px] uppercase tracking-wide opacity-85">Peso</p>
          <p className="text-white text-[22px] font-bold leading-tight">
            {weight ? `${weight}` : "—"}
            {weight && <span className="text-[14px] font-semibold opacity-85"> g</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
