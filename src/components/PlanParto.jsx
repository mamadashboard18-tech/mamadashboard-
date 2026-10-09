import { useEffect, useState } from "react";
import { Trash2, Paperclip, FileText, NotebookPen, Printer } from "lucide-react";
import { PantallaTop, CheckRow, Select, BotonGuardar, BotonSecundario, Guardado, IconAction } from "./ui/Perfil";
import { inputClass, textareaClass, labelClass, cardShadow } from "./ui/estilos";
import { loadPlan, savePlan, emptyPlan } from "../data/planParto";

const tipoPartoOpciones = [
  { value: "natural", label: "Parto natural / vaginal" },
  { value: "epidural", label: "Vaginal con epidural" },
  { value: "cesarea", label: "Cesárea programada" },
  { value: "abierta", label: "Abierta a indicación médica" },
];

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}


export default function PlanParto({ onBack }) {
  const [plan, setPlan] = useState(emptyPlan);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPlan(loadPlan());
  }, []);

  const update = (field, value) => {
    setPlan((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleArchivos = (fileList) => {
    const files = Array.from(fileList);
    const maxSize = 4 * 1024 * 1024; // 4MB por archivo, límite razonable para localStorage
    const validos = files.filter((f) => f.size <= maxSize);
    const muyGrandes = files.length - validos.length;

    Promise.all(
      validos.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: `${Date.now()}-${file.name}`,
                nombre: file.name,
                tipo: file.type,
                tamano: file.size,
                dataUrl: reader.result,
              });
            reader.readAsDataURL(file);
          })
      )
    ).then((nuevos) => {
      setPlan((prev) => ({ ...prev, archivos: [...prev.archivos, ...nuevos] }));
      setSaved(false);
      if (muyGrandes > 0) {
        alert(`${muyGrandes} archivo(s) no se adjuntaron por superar los 4MB.`);
      }
    });
  };

  const eliminarArchivo = (id) => {
    setPlan((prev) => ({ ...prev, archivos: prev.archivos.filter((a) => a.id !== id) }));
    setSaved(false);
  };

  const handleGuardar = () => {
    savePlan(plan);
    setSaved(true);
  };

  const handleExportar = () => {
    savePlan(plan);
    window.print();
  };

  return (
    <div>
      <div className="no-print">
        <PantallaTop
          onBack={onBack}
          icon={NotebookPen}
          title="Plan de parto"
          subtitle="Tus preferencias para el equipo médico, exportable en PDF"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-[24px] border border-[var(--border-soft)] p-5" style={cardShadow}>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-3">
              Datos generales
            </p>
            <Field label="Tu nombre">
              <input
                type="text"
                value={plan.nombre}
                onChange={(e) => update("nombre", e.target.value)}
                className={inputClass}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
              <Field label="Fecha probable de parto">
                <input
                  type="date"
                  value={plan.fpp}
                  onChange={(e) => update("fpp", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Médico / obstetra">
                <input
                  type="text"
                  value={plan.medico}
                  onChange={(e) => update("medico", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Hospital / clínica">
              <input
                type="text"
                value={plan.hospital}
                onChange={(e) => update("hospital", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Acompañantes deseados durante el parto">
              <input
                type="text"
                value={plan.acompanantes}
                onChange={(e) => update("acompanantes", e.target.value)}
                placeholder="Ej: mi pareja y mi madre"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="bg-white rounded-[24px] border border-[var(--border-soft)] p-5" style={cardShadow}>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-3">
              Preferencias de parto
            </p>
            <Field label="Tipo de parto deseado">
              <Select
                value={plan.tipoPartoDeseado}
                onChange={(e) => update("tipoPartoDeseado", e.target.value)}
              >
                {tipoPartoOpciones.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Manejo del dolor">
              <input
                type="text"
                value={plan.manejoDolor}
                onChange={(e) => update("manejoDolor", e.target.value)}
                placeholder="Ej: epidural, técnicas de respiración, pelota de pilates"
                className={inputClass}
              />
            </Field>
            <Field label="Ambiente preferido">
              <input
                type="text"
                value={plan.ambiente}
                onChange={(e) => update("ambiente", e.target.value)}
                placeholder="Ej: luz tenue, música, silencio"
                className={inputClass}
              />
            </Field>
            <Field label="Posiciones que querés probar">
              <input
                type="text"
                value={plan.posiciones}
                onChange={(e) => update("posiciones", e.target.value)}
                placeholder="Ej: en cuclillas, en pelota, caminando"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="bg-white rounded-[24px] border border-[var(--border-soft)] p-5" style={cardShadow}>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-3">
              Intervenciones médicas
            </p>
            <Field label="Episiotomía">
              <input
                type="text"
                value={plan.episiotomia}
                onChange={(e) => update("episiotomia", e.target.value)}
                placeholder="Ej: solo si es estrictamente necesaria"
                className={inputClass}
              />
            </Field>
            <Field label="Monitoreo fetal">
              <input
                type="text"
                value={plan.monitoreoFetal}
                onChange={(e) => update("monitoreoFetal", e.target.value)}
                placeholder="Ej: continuo / intermitente"
                className={inputClass}
              />
            </Field>
            <Field label="Si la situación requiere cesárea">
              <input
                type="text"
                value={plan.siCesarea}
                onChange={(e) => update("siCesarea", e.target.value)}
                placeholder="Ej: quiero contacto piel a piel en quirófano si es posible"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="bg-white rounded-[24px] border border-[var(--border-soft)] p-5" style={cardShadow}>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-3">
              Después del nacimiento
            </p>
            <ul className="mb-3">
              {[
                ["contactoPielAPiel", "Contacto piel a piel inmediato"],
                ["cordonRetrasado", "Clampeo retrasado del cordón umbilical"],
                ["lactanciaInmediata", "Lactancia en la primera hora"],
              ].map(([campo, texto]) => (
                <CheckRow key={campo} checked={!!plan[campo]} onToggle={() => update(campo, !plan[campo])} tachar={false}>
                  {texto}
                </CheckRow>
              ))}
            </ul>
            <Field label="¿Quién corta el cordón?">
              <input
                type="text"
                value={plan.personaCorteCordon}
                onChange={(e) => update("personaCorteCordon", e.target.value)}
                placeholder="Ej: mi pareja"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="lg:col-span-2 bg-white rounded-[24px] border border-[var(--border-soft)] p-5" style={cardShadow}>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-3">
              Notas para el equipo médico
            </p>
            <textarea
              value={plan.notasEquipoMedico}
              onChange={(e) => update("notasEquipoMedico", e.target.value)}
              placeholder="Cualquier otra preferencia, alergia o información relevante"
              className={textareaClass}
              rows={3}
            />
          </div>

          <div className="lg:col-span-2 bg-white rounded-[24px] border border-[var(--border-soft)] p-5" style={cardShadow}>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-3">
              Archivos adjuntos
            </p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Subí estudios, ecografías o documentos para llevar junto al plan (máx. 4MB por archivo)
            </p>

            <label className="inline-flex items-center gap-2 bg-brand-pink-light/60 text-brand-pink text-sm font-bold px-4 py-2.5 rounded-full cursor-pointer hover:bg-brand-pink-light transition-colors">
              <Paperclip className="w-4 h-4" strokeWidth={1.9} />
              Subir archivo
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files.length) handleArchivos(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </label>

            {plan.archivos.length > 0 && (
              <ul className="mt-4 flex flex-col gap-2">
                {plan.archivos.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 bg-[var(--bg)] border border-[var(--border-soft)] rounded-[18px] pl-3 pr-2 py-2"
                  >
                    <span className="w-9 h-9 rounded-full bg-brand-purple-light/70 text-brand-purple flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" strokeWidth={1.8} />
                    </span>
                    <a
                      href={a.dataUrl}
                      download={a.nombre}
                      className="flex-1 min-w-0 text-sm font-medium text-ink hover:text-brand-pink truncate"
                    >
                      {a.nombre}
                      <span className="block text-xs text-ink-muted font-normal">
                        {Math.round(a.tamano / 1024)} KB
                      </span>
                    </a>
                    <IconAction icon={Trash2} label="Eliminar" onClick={() => eliminarArchivo(a.id)} danger />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <BotonGuardar label="Guardar plan" onClick={handleGuardar} />
          <BotonSecundario icon={Printer} onClick={handleExportar} className="text-sm px-4 py-2.5">
            Exportar PDF
          </BotonSecundario>
          <Guardado visible={saved} />
        </div>
      </div>

      <PlanPreview plan={plan} />
    </div>
  );
}

function PlanPreview({ plan }) {
  const tipoLabel =
    tipoPartoOpciones.find((o) => o.value === plan.tipoPartoDeseado)?.label || "";

  return (
    <div className="print-only text-gray-900 text-sm leading-relaxed">
      <h1 className="text-2xl font-semibold mb-1">Plan de Parto</h1>
      <p className="text-gray-500 mb-6">{plan.nombre || "—"}</p>

      <h2 className="font-semibold mt-4 mb-1">Datos generales</h2>
      <p>Fecha probable de parto: {plan.fpp || "—"}</p>
      <p>Médico / obstetra: {plan.medico || "—"}</p>
      <p>Hospital / clínica: {plan.hospital || "—"}</p>
      <p>Acompañantes: {plan.acompanantes || "—"}</p>

      <h2 className="font-semibold mt-4 mb-1">Preferencias de parto</h2>
      <p>Tipo de parto deseado: {tipoLabel}</p>
      <p>Manejo del dolor: {plan.manejoDolor || "—"}</p>
      <p>Ambiente preferido: {plan.ambiente || "—"}</p>
      <p>Posiciones a probar: {plan.posiciones || "—"}</p>

      <h2 className="font-semibold mt-4 mb-1">Intervenciones médicas</h2>
      <p>Episiotomía: {plan.episiotomia || "—"}</p>
      <p>Monitoreo fetal: {plan.monitoreoFetal || "—"}</p>
      <p>En caso de cesárea: {plan.siCesarea || "—"}</p>

      <h2 className="font-semibold mt-4 mb-1">Después del nacimiento</h2>
      <p>Contacto piel a piel inmediato: {plan.contactoPielAPiel ? "Sí" : "No"}</p>
      <p>Clampeo retrasado del cordón: {plan.cordonRetrasado ? "Sí" : "No"}</p>
      <p>Lactancia en la primera hora: {plan.lactanciaInmediata ? "Sí" : "No"}</p>
      <p>Quién corta el cordón: {plan.personaCorteCordon || "—"}</p>

      <h2 className="font-semibold mt-4 mb-1">Notas para el equipo médico</h2>
      <p>{plan.notasEquipoMedico || "—"}</p>

      <h2 className="font-semibold mt-4 mb-1">Archivos adjuntos</h2>
      {plan.archivos.length === 0 ? (
        <p>—</p>
      ) : (
        <ul>
          {plan.archivos.map((a) => (
            <li key={a.id}>{a.nombre}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
