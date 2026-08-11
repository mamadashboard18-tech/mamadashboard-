import { useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  Plus,
  Pencil,
  User,
  Search,
  CalendarDays,
  Star,
  Trash2,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import EscribirEntradaModal from "./EscribirEntradaModal";
import BackButton from "./BackButton";
import CalendarioMensual from "./CalendarioMensual";
import DesbloqueoDiarioModal from "./DesbloqueoDiarioModal";
import { toISODate } from "../data/diarioLibre";
import { loadEntradas, toggleDestacado, eliminarEntrada } from "../data/diario";
import { loadPerfil } from "../data/perfil";
import { semanaEnFecha, trimesterOf } from "../data/seguimientoSemanal";
import { diarioDesbloqueado, descifrarConClave, bloquearDiario } from "../data/diarioSeguridad";

const trimestreLabel = { 1: "1er trimestre", 2: "2do trimestre", 3: "3er trimestre" };

function formatFechaLarga(iso) {
  const d = new Date(iso + "T00:00:00");
  const texto = d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function mesLabel(iso) {
  const d = new Date(iso + "T00:00:00");
  const texto = d.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function mesEtiquetaGrupo(iso, count) {
  const d = new Date(iso + "T00:00:00");
  const mes = d.toLocaleDateString("es-AR", { month: "long" });
  const entradaLabel = count === 1 ? "ENTRADA" : "ENTRADAS";
  return `${mes.toUpperCase()} DE ${d.getFullYear()} · ${count} ${entradaLabel}`;
}

function normalizar(s) {
  return (s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function fechaTextos(fechaISO) {
  const d = new Date(fechaISO + "T00:00:00");
  return [
    fechaISO,
    d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    d.toLocaleDateString("es-AR", { month: "long", year: "numeric" }),
    d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }),
  ].map(normalizar);
}

function trimestreDeQuery(qNorm) {
  if (!qNorm.includes("trimestre")) return null;
  if (/\b(1er|1ro|1|primer)\b/.test(qNorm)) return 1;
  if (/\b(2do|2ro|2|segundo)\b/.test(qNorm)) return 2;
  if (/\b(3er|3ro|3|tercer)\b/.test(qNorm)) return 3;
  return null;
}

function entradaCoincide(e, contenido, qNorm, trimestreQuery, semana) {
  if (!qNorm) return true;
  if (normalizar(contenido.titulo).includes(qNorm)) return true;
  if (normalizar(contenido.texto).includes(qNorm)) return true;
  if (normalizar(e.prompt).includes(qNorm)) return true;
  if (fechaTextos(e.fecha).some((t) => t.includes(qNorm))) return true;
  if (trimestreQuery && trimesterOf(semana) === trimestreQuery) return true;
  return false;
}

function parseContenidoCifrado(plano) {
  try {
    const obj = JSON.parse(plano);
    return { titulo: obj.titulo || "", texto: obj.texto || "" };
  } catch {
    return { titulo: "", texto: plano };
  }
}

export default function DiarioLibre({ onNavigate }) {
  const today = useMemo(() => new Date(), []);
  const todayISO = useMemo(() => toISODate(today), [today]);
  const [entradas, setEntradas] = useState({});
  const [modalFecha, setModalFecha] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [soloFavoritas, setSoloFavoritas] = useState(false);
  const [semanaActual, setSemanaActual] = useState(24);
  const [selectedFecha, setSelectedFecha] = useState(null);
  const [calendarioAbierto, setCalendarioAbierto] = useState(false);
  const [mesCalendario, setMesCalendario] = useState(today);
  const [desbloqueado, setDesbloqueado] = useState(diarioDesbloqueado());
  const [descifradas, setDescifradas] = useState({});
  const [revelado, setRevelado] = useState(() => new Set());
  const [mostrarDesbloqueo, setMostrarDesbloqueo] = useState(false);
  const [toast, setToast] = useState("");
  const cardRefs = useRef({});

  useEffect(() => {
    setEntradas(loadEntradas());
    loadPerfil().then((p) => setSemanaActual(p.semanaActual));
  }, []);

  useEffect(() => {
    if (!desbloqueado) return;
    const privadas = Object.values(entradas).filter((e) => e.privada && e.textoCifrado);
    if (privadas.length === 0) return;
    Promise.all(
      privadas.map(async (e) => {
        const plano = await descifrarConClave(e.textoCifrado);
        return [e.fecha, parseContenidoCifrado(plano)];
      })
    ).then((pares) => {
      setDescifradas((prev) => ({ ...prev, ...Object.fromEntries(pares) }));
    });
  }, [desbloqueado, entradas]);

  useEffect(() => {
    if (selectedFecha && cardRefs.current[selectedFecha]) {
      cardRefs.current[selectedFecha].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedFecha]);

  const entradaHoy = entradas[todayISO] || null;

  const semanaPorFecha = useMemo(() => {
    const mapa = new Map();
    Object.keys(entradas).forEach((fecha) => {
      mapa.set(fecha, semanaEnFecha(fecha, semanaActual, today));
    });
    return mapa;
  }, [entradas, semanaActual, today]);

  const contenidoVisible = (e) => {
    if (e.privada) {
      if (!desbloqueado) return { titulo: null, texto: null };
      return descifradas[e.fecha] || { titulo: null, texto: "" };
    }
    return { titulo: e.titulo || null, texto: e.texto };
  };

  const listaFiltrada = useMemo(() => {
    const qNorm = normalizar(busqueda);
    const trimestreQuery = trimestreDeQuery(qNorm);
    return Object.values(entradas)
      .filter((e) => !soloFavoritas || e.destacado)
      .filter((e) =>
        entradaCoincide(e, contenidoVisible(e), qNorm, trimestreQuery, semanaPorFecha.get(e.fecha))
      )
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entradas, busqueda, soloFavoritas, semanaPorFecha, desbloqueado, descifradas]);

  const grupos = useMemo(() => {
    const porMes = new Map();
    listaFiltrada.forEach((e) => {
      const mesKey = e.fecha.slice(0, 7);
      if (!porMes.has(mesKey)) porMes.set(mesKey, []);
      porMes.get(mesKey).push(e);
    });
    return Array.from(porMes.entries());
  }, [listaFiltrada]);

  const totalEntradas = Object.keys(entradas).length;

  const handleToggleDestacado = (fecha) => {
    setEntradas(toggleDestacado(fecha));
  };

  const handleEliminar = (fecha) => {
    if (!window.confirm("¿Eliminar esta entrada para siempre? No se puede deshacer.")) return;
    setEntradas(eliminarEntrada(fecha));
    if (selectedFecha === fecha) setSelectedFecha(null);
  };

  const toggleRevelado = (fecha) => {
    setRevelado((prev) => {
      const next = new Set(prev);
      if (next.has(fecha)) next.delete(fecha);
      else next.add(fecha);
      return next;
    });
  };

  const handleClickCard = (fecha) => {
    setSelectedFecha((prev) => (prev === fecha ? null : fecha));
  };

  const handleSeleccionarFechaCalendario = (fechaISO) => {
    setBusqueda("");
    setSoloFavoritas(false);
    setCalendarioAbierto(false);
    if (entradas[fechaISO]) {
      setSelectedFecha(fechaISO);
    } else {
      setModalFecha(fechaISO);
    }
  };

  const handleSeleccionarMesCalendario = (mesDate) => {
    setSoloFavoritas(false);
    setSelectedFecha(null);
    setBusqueda(mesLabel(toISODate(mesDate)));
    setCalendarioAbierto(false);
  };

  const handleCambiarMesCalendario = (delta) => {
    const nuevoMes = new Date(mesCalendario.getFullYear(), mesCalendario.getMonth() + delta, 1);
    setMesCalendario(nuevoMes);
    setSoloFavoritas(false);
    setSelectedFecha(null);
    setBusqueda(mesLabel(toISODate(nuevoMes)));
  };

  const handleBloquear = () => {
    bloquearDiario();
    setDesbloqueado(false);
    setDescifradas({});
  };

  return (
    <div className="max-w-[640px]">
      <div className="flex items-center justify-end mb-1.5">
        <button
          onClick={() => onNavigate?.("perfil")}
          className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-muted hover:bg-brand-pink-light/60 hover:text-brand-pink transition-colors cursor-pointer"
          aria-label="Mi perfil"
        >
          <User className="w-5 h-5" strokeWidth={1.7} />
        </button>
      </div>

      <BackButton
        onBack={() => onNavigate?.("inicio")}
        label="Volver a Inicio"
        className="lg:hidden mb-4"
      />

      <h2 className="font-heading text-[28px] font-extrabold text-ink leading-tight mb-2 flex items-center gap-2.5">
        <Heart className="w-6 h-6 text-brand-pink shrink-0" fill="#e26fce" strokeWidth={0} />
        Mi Bienestar
      </h2>
      <p className="text-[17px] text-ink-muted leading-relaxed mb-6">Sin filtro y sin juicio</p>

      <button
        onClick={() => setModalFecha(todayISO)}
        className="w-full text-left rounded-[24px] px-6 py-[22px] mb-6 hover:opacity-95 transition-opacity cursor-pointer"
        style={{ background: "var(--gradient-hero)", boxShadow: "0 12px 30px rgba(216,109,214,0.3)" }}
      >
        <p className="text-white text-base opacity-85 mb-1.5">
          {entradaHoy ? "Ya escribiste hoy" : "¿Qué tenés ganas de contar hoy?"}
        </p>
        <p className="text-white text-[20px] font-extrabold flex items-center gap-2">
          {entradaHoy ? (
            <Pencil className="w-[18px] h-[18px]" strokeWidth={2} />
          ) : (
            <Plus className="w-[18px] h-[18px]" strokeWidth={2.4} />
          )}
          {entradaHoy ? "Seguir escribiendo la entrada de hoy" : "Escribir en tu diario"}
        </p>
      </button>

      {totalEntradas === 0 && (
        <div className="bg-white rounded-[20px] border border-[var(--border-soft)] p-8 shadow-sm text-center">
          <Heart className="w-10 h-10 text-brand-pink mx-auto mb-3" strokeWidth={1.6} />
          <p className="text-base text-ink-muted leading-relaxed">
            Todavía no escribiste ninguna entrada. Este es tu espacio, sin filtro y sin juicio.
          </p>
        </div>
      )}

      {totalEntradas > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative flex-1 min-w-[180px]">
            <Search
              className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              strokeWidth={2}
            />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por texto, fecha o trimestre..."
              className="w-full border border-[var(--border-soft)] rounded-full pl-10 pr-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand-pink bg-white"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setCalendarioAbierto((v) => !v)}
              className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2.5 rounded-full border whitespace-nowrap transition-colors cursor-pointer ${
                calendarioAbierto
                  ? "text-white border-transparent"
                  : "bg-white border-[var(--border-soft)] text-ink-muted hover:border-brand-pink"
              }`}
              style={calendarioAbierto ? { background: "var(--gradient-hero)" } : undefined}
            >
              <CalendarDays className="w-4 h-4" strokeWidth={1.8} />
              Calendario
            </button>
            {calendarioAbierto && (
              <div className="absolute right-0 mt-2 z-20">
                <CalendarioMensual
                  mes={mesCalendario}
                  fechasConEntrada={new Set(Object.keys(entradas))}
                  seleccionada={selectedFecha}
                  onCambiarMes={handleCambiarMesCalendario}
                  onSelect={handleSeleccionarFechaCalendario}
                  onSelectMes={handleSeleccionarMesCalendario}
                />
              </div>
            )}
          </div>
          <button
            onClick={() => setSoloFavoritas((v) => !v)}
            className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2.5 rounded-full border whitespace-nowrap transition-colors cursor-pointer ${
              soloFavoritas
                ? "text-white border-transparent"
                : "bg-white border-[var(--border-soft)] text-ink-muted hover:border-brand-pink"
            }`}
            style={soloFavoritas ? { background: "var(--gradient-hero)" } : undefined}
          >
            <Star className="w-4 h-4" strokeWidth={1.8} fill={soloFavoritas ? "currentColor" : "none"} />
            Solo destacadas
          </button>
          {desbloqueado && (
            <button
              onClick={handleBloquear}
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2.5 rounded-full border border-[rgba(155,93,229,0.3)] bg-[rgba(155,93,229,0.08)] text-brand-purple whitespace-nowrap hover:border-brand-purple transition-colors cursor-pointer"
              title="Volver a ocultar el contenido de tus entradas privadas"
            >
              <Lock className="w-4 h-4" strokeWidth={1.8} />
              Bloquear privadas
            </button>
          )}
        </div>
      )}

      {selectedFecha && (
        <div className="flex items-center justify-between gap-3 bg-brand-pink-light/40 border border-[var(--border-soft)] rounded-2xl px-4 py-2.5 mb-4">
          <p className="text-sm text-brand-pink font-semibold truncate">
            {formatFechaLarga(selectedFecha)}
          </p>
          <button
            onClick={() => setSelectedFecha(null)}
            className="text-ink-muted hover:text-ink px-1 shrink-0 cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {totalEntradas > 0 && grupos.length === 0 && (
        <p className="text-sm text-ink-muted bg-white border border-[var(--border-soft)] rounded-[20px] p-6 text-center">
          No se encontraron entradas para tu búsqueda.
        </p>
      )}

      <div className="space-y-8">
        {grupos.map(([mesKey, entradasDelMes]) => (
          <div key={mesKey}>
            <p className="text-sm font-bold text-brand-pink uppercase tracking-[0.05em] mb-3">
              {mesEtiquetaGrupo(entradasDelMes[0].fecha, entradasDelMes.length)}
            </p>
            <div className="flex flex-col gap-3">
              {entradasDelMes.map((e) => {
                const bloqueada = e.privada && !desbloqueado;
                const revelada = revelado.has(e.fecha);
                const oculta = e.oculto && !revelada && !bloqueada;
                const contenido = contenidoVisible(e);

                return (
                  <div
                    key={e.fecha}
                    ref={(el) => (cardRefs.current[e.fecha] = el)}
                    onClick={() => handleClickCard(e.fecha)}
                    className={`bg-white border border-[rgba(155,93,229,0.15)] rounded-[20px] px-5 py-[18px] cursor-pointer transition-opacity duration-300 ${
                      selectedFecha && selectedFecha !== e.fecha ? "opacity-50" : "opacity-100"
                    }`}
                    style={{ boxShadow: "0 2px 14px rgba(155,93,229,0.1)" }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="min-w-0">
                        <p className="font-heading text-[18px] font-bold text-ink truncate">
                          {formatFechaLarga(e.fecha)}
                        </p>
                        <p className="text-sm text-[#a89fb0] mt-0.5">
                          Semana {semanaPorFecha.get(e.fecha)} ·{" "}
                          {trimestreLabel[trimesterOf(semanaPorFecha.get(e.fecha))]}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0" onClick={(ev) => ev.stopPropagation()}>
                        {e.privada && (
                          <span
                            className="w-[34px] h-[34px] flex items-center justify-center text-brand-purple"
                            title="Entrada privada"
                          >
                            <Lock className="w-4 h-4" strokeWidth={1.8} />
                          </span>
                        )}
                        {e.oculto && !bloqueada && (
                          <button
                            onClick={() => toggleRevelado(e.fecha)}
                            className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-ink-muted hover:bg-brand-pink-light/50 hover:text-brand-pink transition-colors cursor-pointer"
                            aria-label={revelada ? "Ocultar entrada" : "Mostrar entrada"}
                            title={revelada ? "Ocultar entrada" : "Mostrar entrada"}
                          >
                            {revelada ? (
                              <EyeOff className="w-4 h-4" strokeWidth={1.8} />
                            ) : (
                              <Eye className="w-4 h-4" strokeWidth={1.8} />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleDestacado(e.fecha)}
                          className={`w-[34px] h-[34px] rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                            e.destacado
                              ? "text-brand-pink hover:bg-brand-pink-light/50"
                              : "text-[#c7bfce] hover:bg-brand-pink-light/50 hover:text-brand-pink"
                          }`}
                          aria-label="Marcar como destacada"
                          title="Marcar como destacada"
                        >
                          <Star className="w-4 h-4" strokeWidth={1.8} fill={e.destacado ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={() => handleEliminar(e.fecha)}
                          className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[#c7bfce] hover:bg-red-50 hover:text-[#c81e3a] transition-colors cursor-pointer"
                          aria-label="Eliminar entrada"
                          title="Eliminar entrada"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.8} />
                        </button>
                      </div>
                    </div>

                    {bloqueada ? (
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setMostrarDesbloqueo(true);
                        }}
                        className="w-full text-left flex items-center gap-2 bg-[var(--bg)] border border-dashed border-[rgba(155,93,229,0.3)] rounded-2xl px-3.5 py-3 text-sm text-ink-muted hover:border-brand-purple transition-colors mt-1 cursor-pointer"
                      >
                        <Lock className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                        Entrada privada — tocá para desbloquear
                      </button>
                    ) : oculta ? (
                      <p className="text-sm text-ink-muted italic flex items-center gap-1.5 mt-1">
                        <EyeOff className="w-3.5 h-3.5" strokeWidth={1.8} />
                        Contenido oculto
                      </p>
                    ) : (
                      <>
                        {contenido.titulo && (
                          <p className="text-base font-bold text-ink mt-1">{contenido.titulo}</p>
                        )}
                        {e.prompt && (
                          <p className="text-sm text-brand-pink italic mt-1.5">"{e.prompt}"</p>
                        )}
                        {contenido.texto && (
                          <p className="text-base text-[#4b4152] leading-relaxed mt-1.5 line-clamp-3 whitespace-pre-wrap">
                            {contenido.texto}
                          </p>
                        )}

                        {e.archivos?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2.5">
                            {e.archivos.map((a) =>
                              a.tipo.startsWith("image/") ? (
                                <img
                                  key={a.id}
                                  src={a.dataUrl}
                                  alt={a.nombre}
                                  className="w-16 h-16 object-cover rounded-xl border border-[var(--border-soft)]"
                                />
                              ) : (
                                <a
                                  key={a.id}
                                  href={a.dataUrl}
                                  download={a.nombre}
                                  className="w-16 h-16 flex items-center justify-center bg-[var(--bg)] border border-[var(--border-soft)] rounded-xl text-xs text-ink-muted"
                                >
                                  📄
                                </a>
                              )
                            )}
                          </div>
                        )}
                      </>
                    )}

                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setModalFecha(e.fecha);
                      }}
                      aria-label="Editar entrada"
                      title="Editar entrada"
                      className="text-brand-pink hover:text-brand-magenta transition-colors mt-2 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {modalFecha && (
        <EscribirEntradaModal
          fecha={modalFecha}
          onClose={() => setModalFecha(null)}
          onSaved={() => {
            setEntradas(loadEntradas());
            setDesbloqueado(diarioDesbloqueado());
            setToast("Guardado en tu diario.");
            setTimeout(() => setToast(""), 2400);
          }}
        />
      )}

      {mostrarDesbloqueo && (
        <DesbloqueoDiarioModal
          modo="desbloquear"
          onClose={() => setMostrarDesbloqueo(false)}
          onSuccess={() => {
            setDesbloqueado(true);
            setMostrarDesbloqueo(false);
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 bg-ink text-white text-base px-5 py-3 rounded-2xl shadow-lg z-40 w-[min(90vw,320px)] text-center">
          {toast}
        </div>
      )}
    </div>
  );
}
