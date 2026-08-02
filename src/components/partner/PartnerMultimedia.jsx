import { getBibliotecaPorCategoria, tipoIcono, tipoLabel } from "../../data/multimedia";

const contenido = getBibliotecaPorCategoria("pareja_acompanante");

export default function PartnerMultimedia() {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
        Recomendado para vos como pareja
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Contenido pensado para acompañantes: cómo ayudar en el parto, el posparto y la crianza.
      </p>

      <div className="space-y-3">
        {contenido.map((item, i) => {
          const card = (
            <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-xl leading-none">{tipoIcono[item.tipo]}</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-0.5">{tipoLabel[item.tipo]}</p>
                  <p className="text-sm font-semibold text-gray-900">{item.titulo}</p>
                  {item.autor && <p className="text-xs text-gray-500 mt-0.5">{item.autor}</p>}
                  <p className="text-sm text-gray-600 mt-2">{item.descripcion}</p>
                </div>
              </div>
            </div>
          );
          return item.link ? (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="block hover:border-rose-300 transition-colors"
            >
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
