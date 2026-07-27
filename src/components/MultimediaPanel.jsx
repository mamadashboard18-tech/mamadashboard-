import { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import { loadPerfil } from "../data/perfil";
import { loadBebe, diasConBebe } from "../data/bebe";
import {
  getContenidoSemana,
  getBibliotecaPorCategoria,
  categoriasOrdenadas,
  categoriaLabel,
  tipoIcono,
  tipoLabel,
  mamasReales,
} from "../data/multimedia";

const TABS = [
  { id: "semana", label: "Tu semana", icon: "🗓️" },
  { id: "biblioteca", label: "Biblioteca por tema", icon: "📚" },
  { id: "mamas", label: "Mamás como vos", icon: "💛" },
];

function semanaPostpartoDesde(fechaNacimiento) {
  const dias = diasConBebe(fechaNacimiento);
  return Math.min(12, Math.floor(dias / 7) + 1);
}

function ContenidoCard({ item }) {
  const icono = tipoIcono[item.tipo] || "✨";
  const esFrase = item.tipo === "frase";

  if (esFrase) {
    return (
      <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-4 text-sm text-rose-700 italic">
        “{item.titulo}”
      </div>
    );
  }

  return (
    <a
      href={item.link || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-white border border-rose-100 rounded-2xl p-4 shadow-sm transition-shadow ${
        item.link ? "hover:shadow-md hover:border-rose-200" : "cursor-default"
      }`}
      onClick={(e) => {
        if (!item.link) e.preventDefault();
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0">{icono}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-rose-500 uppercase tracking-wide">
              {tipoLabel[item.tipo] || item.tipo}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                item.gratis
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {item.gratis ? "Gratis" : "Pago"}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-800 mt-1">{item.titulo}</p>
          {item.autor && <p className="text-xs text-gray-400 mt-0.5">{item.autor}</p>}
          {item.descripcion && (
            <p className="text-xs text-gray-500 mt-1.5">{item.descripcion}</p>
          )}
        </div>
      </div>
    </a>
  );
}

export default function MultimediaPanel() {
  const [tab, setTab] = useState("semana");
  const [etapa, setEtapa] = useState("embarazo");
  const [semana, setSemana] = useState(1);
  const [categoria, setCategoria] = useState(categoriasOrdenadas[0]);

  useEffect(() => {
    const bebe = loadBebe();
    if (bebe.registrado) {
      setEtapa("postparto");
      setSemana(semanaPostpartoDesde(bebe.fechaNacimiento));
    } else {
      loadPerfil().then((p) => {
        setEtapa("embarazo");
        setSemana(p.semanaActual);
      });
    }
  }, []);

  const contenidoSemana = useMemo(() => getContenidoSemana(semana, etapa), [semana, etapa]);
  const contenidoBiblioteca = useMemo(() => getBibliotecaPorCategoria(categoria), [categoria]);

  return (
    <div>
      <Header
        title="🎧 Multimedia"
        subtitle="Contenido para tu semana, para lo que necesites resolver y para sentirte acompañada"
      />

      <div className="flex gap-2 mb-6 border-b border-rose-100">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? "border-rose-500 text-rose-600"
                : "border-transparent text-gray-500 hover:text-rose-500"
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "semana" && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {etapa === "embarazo"
              ? `Contenido pensado para tu semana ${semana} de embarazo`
              : `Contenido pensado para tu semana ${semana} de postparto`}
          </p>
          {contenidoSemana.length === 0 ? (
            <div className="bg-white border border-rose-100 rounded-2xl p-8 text-center shadow-sm">
              <span className="text-3xl">🎧</span>
              <p className="text-sm text-gray-500 mt-2">
                Todavía no hay contenido cargado para esta semana.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contenidoSemana.map((item, idx) => (
                <ContenidoCard key={`${item.titulo}-${idx}`} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "biblioteca" && (
        <div>
          <div className="flex flex-wrap gap-2 mb-5">
            {categoriasOrdenadas.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoria(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  categoria === cat
                    ? "bg-rose-500 border-rose-500 text-white"
                    : "bg-white border-rose-100 text-gray-600 hover:border-rose-300"
                }`}
              >
                {categoriaLabel[cat] || cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contenidoBiblioteca.map((item, idx) => (
              <ContenidoCard key={`${item.titulo}-${idx}`} item={item} />
            ))}
          </div>
        </div>
      )}

      {tab === "mamas" && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Historias reales de famosas e influencers contando cómo viven el embarazo y la
            maternidad, para que te sientas identificada y acompañada.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mamasReales.map((item) => (
              <ContenidoCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
