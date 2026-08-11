import { useEffect, useMemo, useState } from "react";
import { User, ChevronLeft, TestTube2, CalendarPlus, Paperclip, Check, X, Pencil, Save } from "lucide-react";
import {
  examenesPorTrimestre,
  loadRegistroExamenes,
  saveRegistroExamenes,
} from "../data/examenesSemanales";
import { getWeekData } from "../data/seguimientoSemanal";
import { loadPerfil } from "../data/perfil";
import { loadCitas, saveCitas } from "../data/citas";

export default function GuiaExamenes({ onBack, onNavigate }) {
  const [trimestreActual, setTrimestreActual] = useState(null);
  const [registro, setRegistro] = useState({});
  const [citas, setCitas] = useState([]);
  const [agendandoId, setAgendandoId] = useState(null);
  const [agendaForm, setAgendaForm] = useState({ fecha: "", hora: "", lugar: "" });

  useEffect(() => {
    loadPerfil().then((p) => setTrimestreActual(getWeekData(p.semanaActual).trimester));
    setRegistro(loadRegistroExamenes());
    setCitas(loadCitas());
  }, []);

  const bloquesVisibles = examenesPorTrimestre;

  const { totalHechos, totalExamenes } = useMemo(() => {
    const todos = bloquesVisibles.flatMap((b) => b.examenes);
    return {
      totalExamenes: todos.length,
      totalHechos: todos.filter((ex) => registro[ex.id]?.hecho).length,
    };
  }, [bloquesVisibles, registro]);

  const donePct = totalExamenes === 0 ? 0 : Math.round((totalHechos / totalExamenes) * 100);

  const actualizarExamen = (id, campo, valor) => {
    setRegistro((prev) => {
      const next = { ...prev, [id]: { ...prev[id], [campo]: valor } };
      saveRegistroExamenes(next);
      return next;
    });
  };

  const handleArchivo = (id, fileList) => {
    const file = fileList[0];
    if (!file) return;
    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("El archivo supera los 4MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      actualizarExamen(id, "archivo", {
        id: `${Date.now()}-${file.name}`,
        nombre: file.name,
        tipo: file.type,
        dataUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const eliminarArchivo = (id) => {
    actualizarExamen(id, "archivo", null);
  };

  const abrirAgenda = (ex, citaExistente) => {
    setAgendandoId(ex.id);
    setAgendaForm({
      fecha: citaExistente?.fecha || "",
      hora: citaExistente?.hora || "",
      lugar: citaExistente?.lugar || "",
    });
  };

  const cancelarAgenda = () => setAgendandoId(null);

  const guardarAgenda = (ex) => {
    if (!agendaForm.fecha) return;
    const datos = registro[ex.id] || {};
    const citaExistente = datos.citaId ? citas.find((c) => c.id === datos.citaId) : null;

    let nextCitas;
    if (citaExistente) {
      nextCitas = citas.map((c) => (c.id === citaExistente.id ? { ...c, ...agendaForm } : c));
    } else {
      const nuevaCita = {
        id: `examen-${ex.id}-${Date.now()}`,
        fecha: agendaForm.fecha,
        hora: agendaForm.hora,
        lugar: agendaForm.lugar,
        tipo: ex.nombre,
        medico: "",
        preguntas: "",
        notas: ex.desc,
        compartirPartner: false,
        examenId: ex.id,
      };
      nextCitas = [...citas, nuevaCita];
      actualizarExamen(ex.id, "citaId", nuevaCita.id);
    }
    setCitas(nextCitas);
    saveCitas(nextCitas);
    setAgendandoId(null);
  };

  const quitarAgenda = (ex, citaId) => {
    const nextCitas = citas.filter((c) => c.id !== citaId);
    setCitas(nextCitas);
    saveCitas(nextCitas);
    actualizarExamen(ex.id, "citaId", null);
  };

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

      {onBack && (
        <button
          onClick={onBack}
          aria-label="Volver a Citas"
          className="lg:hidden w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-muted hover:text-brand-pink transition-colors mb-4 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2} />
        </button>
      )}

      <h2 className="font-heading text-[28px] font-extrabold text-ink leading-tight flex items-center gap-2.5 mb-2">
        <TestTube2 className="w-[26px] h-[26px] text-brand-pink shrink-0" strokeWidth={1.7} />
        Guía de exámenes por semana
      </h2>
      <p className="text-[17px] text-ink-muted leading-relaxed mb-5 max-w-[520px]">
        Marcá los que ya te hiciste, guardá el resultado y adjuntá el estudio
      </p>

      <div className="bg-[var(--bg)] border border-[rgba(155,93,229,0.12)] rounded-[22px] px-[22px] py-5 mb-7 shadow-[0_6px_16px_rgba(155,93,229,0.08)]">
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-[17px] font-bold text-ink">
            {totalHechos} de {totalExamenes} listo
          </p>
          <p className="font-heading text-[22px] font-extrabold text-brand-pink">{donePct}%</p>
        </div>
        <div className="h-2 rounded-full bg-[rgba(155,93,229,0.14)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${donePct}%`, background: "var(--gradient-hero)" }}
          />
        </div>
      </div>

      <div className="space-y-[30px]">
        {bloquesVisibles.map((bloque) => {
          const esActual = bloque.trimestre === trimestreActual;
          return (
            <div key={bloque.trimestre}>
              <div className="flex items-center gap-2.5 flex-wrap mb-3.5">
                <p className="font-heading text-[19px] font-extrabold text-ink">
                  {bloque.trimestre === 1 ? "1er" : bloque.trimestre === 2 ? "2do" : "3er"} trimestre
                </p>
                <span className="text-sm text-[#a89fb0]">{bloque.rango}</span>
                {esActual && (
                  <span className="text-[13px] font-bold text-brand-pink bg-[rgba(255,111,159,0.14)] px-3 py-1 rounded-full">
                    Tu trimestre actual
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {bloque.examenes.map((ex) => {
                  const datos = registro[ex.id] || {};
                  const citaVinculada = datos.citaId
                    ? citas.find((c) => c.id === datos.citaId)
                    : null;
                  const hecho = Boolean(datos.hecho);
                  return (
                    <div
                      key={ex.id}
                      className={`bg-white border rounded-[22px] px-5 py-[18px] transition-colors ${
                        hecho
                          ? "border-[rgba(226,111,206,0.3)] bg-[rgba(255,111,159,0.05)]"
                          : "border-[rgba(155,93,229,0.14)]"
                      }`}
                    >
                      <div className="flex items-start gap-3 justify-between flex-wrap">
                        <div className="flex items-start gap-3 flex-1 min-w-[220px]">
                          <button
                            onClick={() => actualizarExamen(ex.id, "hecho", !hecho)}
                            aria-label="Marcar como hecho"
                            className={`w-6 h-6 mt-0.5 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                              hecho
                                ? "border-none"
                                : "border-[1.5px] border-[rgba(226,111,206,0.4)] bg-transparent"
                            }`}
                            style={hecho ? { background: "var(--gradient-hero)" } : undefined}
                          >
                            {hecho && <Check className="w-[13px] h-[13px] text-white" strokeWidth={3} />}
                          </button>
                          <div className="min-w-0">
                            <p
                              className={`text-[17px] font-bold ${
                                hecho ? "text-[#a89fb0] line-through" : "text-ink"
                              }`}
                            >
                              {ex.nombre}
                            </p>
                            <p className="text-[15px] text-ink-muted mt-1.5 leading-relaxed">{ex.desc}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-brand-pink whitespace-nowrap shrink-0">
                          {ex.cuando}
                        </span>
                      </div>

                      <div className="ml-9 mt-3.5">
                        {citaVinculada ? (
                          <div className="flex items-center gap-2 flex-wrap text-sm mb-3">
                            <span className="inline-flex items-center gap-1 bg-[rgba(155,93,229,0.1)] text-brand-purple px-2.5 py-1 rounded-full">
                              Agendada {citaVinculada.fecha}
                              {citaVinculada.hora && ` · ${citaVinculada.hora}`}
                            </span>
                            <button
                              onClick={() => abrirAgenda(ex, citaVinculada)}
                              className="inline-flex items-center gap-1 text-brand-pink font-semibold hover:underline cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Editar
                            </button>
                            <button
                              onClick={() => quitarAgenda(ex, citaVinculada.id)}
                              className="text-[#a89fb0] hover:text-red-500 hover:underline cursor-pointer"
                            >
                              Quitar
                            </button>
                          </div>
                        ) : (
                          !hecho && (
                            <button
                              onClick={() => abrirAgenda(ex, null)}
                              className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand-pink hover:text-brand-purple transition-colors mb-3 cursor-pointer"
                            >
                              <CalendarPlus className="w-4 h-4 shrink-0" strokeWidth={1.7} />
                              Agregar al calendario
                            </button>
                          )
                        )}

                        {agendandoId === ex.id && (
                          <div className="mb-3.5 p-3.5 bg-[var(--bg)] border border-[rgba(155,93,229,0.14)] rounded-2xl space-y-2.5">
                            <div className="grid grid-cols-2 gap-2.5">
                              <input
                                type="date"
                                value={agendaForm.fecha}
                                onChange={(e) =>
                                  setAgendaForm((prev) => ({ ...prev, fecha: e.target.value }))
                                }
                                className="w-full rounded-full border border-[rgba(155,93,229,0.18)] bg-white px-3.5 py-2 text-sm text-ink focus:outline-none focus:border-brand-pink"
                              />
                              <input
                                type="time"
                                value={agendaForm.hora}
                                onChange={(e) =>
                                  setAgendaForm((prev) => ({ ...prev, hora: e.target.value }))
                                }
                                className="w-full rounded-full border border-[rgba(155,93,229,0.18)] bg-white px-3.5 py-2 text-sm text-ink focus:outline-none focus:border-brand-pink"
                              />
                            </div>
                            <input
                              type="text"
                              value={agendaForm.lugar}
                              onChange={(e) =>
                                setAgendaForm((prev) => ({ ...prev, lugar: e.target.value }))
                              }
                              placeholder="Lugar (opcional)"
                              className="w-full rounded-full border border-[rgba(155,93,229,0.18)] bg-white px-3.5 py-2 text-sm text-ink focus:outline-none focus:border-brand-pink"
                            />
                            <div className="flex items-center gap-4 px-1">
                              <button
                                onClick={() => guardarAgenda(ex)}
                                className="inline-flex items-center gap-1.5 text-white text-sm font-bold px-4 py-1.5 rounded-full hover:brightness-95 transition-all cursor-pointer"
                                style={{ background: "var(--gradient-hero)" }}
                              >
                                <Save className="w-3.5 h-3.5" />
                                Guardar
                              </button>
                              <button
                                onClick={cancelarAgenda}
                                className="text-sm text-ink-muted hover:text-brand-pink cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}

                        <input
                          type="text"
                          value={datos.resultado || ""}
                          onChange={(e) => actualizarExamen(ex.id, "resultado", e.target.value)}
                          placeholder="Resultado / lo que te dio (opcional)"
                          className="w-full rounded-2xl border border-[rgba(155,93,229,0.18)] bg-white px-4 py-3 text-[15px] text-ink placeholder:text-[#a89fb0] focus:outline-none focus:border-brand-pink mb-3"
                        />

                        {datos.archivo ? (
                          <div className="inline-flex items-center gap-2 bg-[rgba(155,93,229,0.1)] rounded-full px-3.5 py-2">
                            <Paperclip className="w-3.5 h-3.5 text-brand-purple shrink-0" strokeWidth={1.7} />
                            <a
                              href={datos.archivo.dataUrl}
                              download={datos.archivo.nombre}
                              className="text-sm text-ink hover:text-brand-pink max-w-[180px] truncate"
                            >
                              {datos.archivo.nombre}
                            </a>
                            <button
                              onClick={() => eliminarArchivo(ex.id)}
                              aria-label="Quitar archivo"
                              className="text-[#a89fb0] hover:text-brand-pink cursor-pointer flex"
                            >
                              <X className="w-3 h-3" strokeWidth={2} />
                            </button>
                          </div>
                        ) : (
                          <label className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand-pink hover:text-brand-purple transition-colors cursor-pointer">
                            <Paperclip className="w-4 h-4 shrink-0" strokeWidth={1.7} />
                            Adjuntar estudio
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={(e) => handleArchivo(ex.id, e.target.files)}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
