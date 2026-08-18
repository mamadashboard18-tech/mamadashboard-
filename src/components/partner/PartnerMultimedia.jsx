import { Activity } from "lucide-react";
import { getBibliotecaPorCategoria, tipoIconoComponent } from "../../data/multimedia";

const contenido = getBibliotecaPorCategoria("pareja_acompanante");

export default function PartnerMultimedia() {
  return (
    <div>
      <h2 className="font-heading text-[26px] font-extrabold text-partner-ink">Multimedia</h2>
      <p className="text-[14.5px] text-partner-ink-muted mt-1.5 mb-[22px] leading-relaxed">
        Contenido pensado para acompañantes: cómo ayudar en el parto, el posparto y la crianza.
      </p>

      <div className="flex flex-col gap-3.5">
        {contenido.map((item, i) => {
          const Icon = tipoIconoComponent[item.tipo] || Activity;
          const card = (
            <div className="bg-white/72 backdrop-blur-md rounded-[22px] shadow-[0_6px_26px_rgba(91,33,182,0.10)] p-5">
              <div className="flex items-start gap-3.5">
                <span className="w-10 h-10 rounded-full bg-partner-violet/14 flex items-center justify-center text-partner-violet shrink-0">
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[15.5px] font-bold text-partner-ink leading-snug">{item.titulo}</p>
                  {item.gratis && (
                    <span className="inline-block bg-partner-green-bg text-partner-green-text text-[11px] font-bold px-2.5 py-[3px] rounded-full mt-1.5">
                      Gratis
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
          return item.link ? (
            <a key={i} href={item.link} target="_blank" rel="noreferrer" className="block hover:brightness-[0.98] transition-[filter]">
              {card}
            </a>
          ) : (
            <div key={i}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
