import { useEffect, useMemo, useState } from "react";
import {
  Headphones,
  User,
  CalendarDays,
  BookOpen,
  Heart,
  FileText,
  Clapperboard,
  Quote,
  NotebookText,
  ClipboardList,
  Mic,
  Tv,
  Sparkles,
} from "lucide-react";
import { loadPerfil } from "../data/perfil";
import { loadBebe, diasConBebe } from "../data/bebe";
import {
  getContenidoSemana,
  getBibliotecaPorCategoria,
  categoriasOrdenadas,
  categoriaLabel,
  tipoLabel,
  mamasReales,
} from "../data/multimedia";

const TABS = [
  { id: "semana", label: "Tu semana", icon: CalendarDays },
  { id: "biblioteca", label: "Biblioteca por tema", icon: BookOpen },
  { id: "mamas", label: "Mamás como vos", icon: Heart },
];

const tipoIconoLucide = {
  articulo: FileText,
  video: Clapperboard,
  frase: Quote,
  guia: NotebookText,
  libro: BookOpen,
  plantilla: ClipboardList,
  podcast: Mic,
  canal: Tv,
};

function semanaPostpartoDesde(fechaNacimiento) {
  const dias = diasConBebe(fechaNacimiento);
  return Math.min(12, Math.floor(dias / 7) + 1);
}

function ContenidoCard({ item }) {
  const Icono = tipoIconoLucide[item.tipo] || Sparkles;
  const esFrase = item.tipo === "frase";

  if (esFrase) {
    return (
      <div
        className="rounded-[22px] p-5 flex items-start gap-3 border border-[var(--border-soft)]"
        style={{
          background:
            "linear-gradient(135deg, rgba(226,111,206,0.10) 0%, rgba(155,93,229,0.10) 100%)",
        }}
      >
        <Quote className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" strokeWidth={1.8} />
        <p className="text-[15px] text-ink font-semibold italic leading-relaxed">
          “{item.titulo}”
        </p>
      </div>
    );
  }

  return (
    <a
      href={item.link || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-white border border-[rgba(155,93,229,0.14)] rounded-[22px] p-4 transition-shadow ${
        item.link ? "hover:shadow-md cursor-pointer" : "cursor-default"
      }`}
      style={{ boxShadow: "0 2px 14px rgba(155,93,229,0.08)" }}
      onClick={(e) => {
        if (!item.link) e.preventDefault();
      }}
    >
      <div className="flex items-start gap-3">
        <span className="w-9 h-9 rounded-full bg-brand-pink-light/50 flex items-center justify-center shrink-0">
          <Icono className="w-4 h-4 text-brand-pink" strokeWidth={1.8} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-bold text-brand-pink uppercase tracking-wide">
              {tipoLabel[item.tipo] || item.tipo}
            </span>
            <span
              className={`text-[11px] px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                item.gratis
                  ? "bg-brand-purple-light text-brand-purple"
                  : "bg-brand-pink-light text-brand-magenta"
              }`}
            >
              {item.gratis ? "Gratis" : "Pago"}
            </span>
          </div>
          <p className="text-[15px] font-bold text-ink mt-1 leading-snug">{item.titulo}</p>
          {item.autor && <p className="text-[13px] text-ink-muted mt-0.5">{item.autor}</p>}
          {item.descripcion && (
            <p className="text-[13px] text-ink-muted mt-1.5 leading-relaxed">
              {item.descripcion}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}

export default function MultimediaPanel({ onNavigate }) {
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
  const contenidoBiblioteca = useMemo(
    () => getBibliotecaPorCategoria(categoria),
    [categoria]
  );

  return (
    <div className="max-w-[680px]">
      <div className="flex items-center justify-end mb-1.5">
        <button
          onClick={() => onNavigate?.("perfil")}
          className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-muted hover:bg-brand-pink-light/60 hover:text-brand-pink transition-colors cursor-pointer"
          aria-label="Mi perfil"
        >
          <User className="w-5 h-5" strokeWidth={1.7} />
        </button>
      </div>

      <h2 className="font-heading text-[28px] font-extrabold text-ink leading-tight flex items-center gap-2.5 mb-2">
        <Headphones className="w-[26px] h-[26px] text-brand-pink shrink-0" strokeWidth={1.7} />
        Multimedia
      </h2>
      <p className="text-[17px] text-ink-muted leading-relaxed mb-6 max-w-[520px]">
        Contenido para tu semana
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => {
          const Icon = t.icon;
          const activo = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 text-[15px] font-semibold px-4 py-2.5 rounded-full border transition-colors cursor-pointer ${
                activo
                  ? "text-white border-transparent"
                  : "bg-white border-[var(--border-soft)] text-ink-muted hover:border-brand-pink"
              }`}
              style={activo ? { background: "var(--gradient-hero)" } : undefined}
            >
              <Icon className="w-4 h-4" strokeWidth={1.8} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "semana" && (
        <div>
          <p className="text-[15px] text-ink-muted mb-4">
            {etapa === "embarazo"
              ? `Contenido pensado para tu semana ${semana} de embarazo`
              : `Contenido pensado para tu semana ${semana} de postparto`}
          </p>
          {contenidoSemana.length === 0 ? (
            <div className="bg-white rounded-[20px] border border-[var(--border-soft)] p-8 text-center shadow-sm">
              <Headphones className="w-10 h-10 text-brand-pink mx-auto mb-3" strokeWidth={1.6} />
              <p className="text-base text-ink-muted leading-relaxed">
                Todavía no hay contenido cargado para esta semana.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            {categoriasOrdenadas.map((cat) => {
              const activo = categoria === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoria(cat)}
                  className={`text-[13px] font-semibold px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
                    activo
                      ? "text-white border-transparent"
                      : "bg-white border-[var(--border-soft)] text-ink-muted hover:border-brand-pink"
                  }`}
                  style={activo ? { background: "var(--gradient-hero)" } : undefined}
                >
                  {categoriaLabel[cat] || cat}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contenidoBiblioteca.map((item, idx) => (
              <ContenidoCard key={`${item.titulo}-${idx}`} item={item} />
            ))}
          </div>
        </div>
      )}

      {tab === "mamas" && (
        <div>
          <p className="text-[15px] text-ink-muted mb-4">
            Historias reales de famosas e influencers contando cómo viven el embarazo y la
            maternidad, para que te sientas identificada y acompañada.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mamasReales.map((item) => (
              <ContenidoCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
