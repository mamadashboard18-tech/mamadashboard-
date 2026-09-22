import { useEffect, useState } from "react";
import { Pencil, Trash2, Phone, Star } from "lucide-react";
import Header from "./Header";
import BackButton from "./BackButton";
import { loadContactosEmergencia, saveContactosEmergencia } from "../data/contactosEmergencia";

const emptyForm = { nombre: "", relacion: "", telefono: "" };

const inputClass =
  "w-full border border-[var(--border-soft)] rounded-xl p-2 text-sm text-ink bg-white mb-3 focus:outline-none focus:border-brand-pink transition-colors";

const primaryButtonStyle = { background: "var(--gradient-hero)" };

export default function ContactosEmergencia({ onBack, embedded = false }) {
  const [contactos, setContactos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setContactos(loadContactosEmergencia());
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardar = () => {
    if (!form.nombre.trim()) return;
    let next;
    if (editingId) {
      next = contactos.map((c) => (c.id === editingId ? { ...form, id: editingId, principal: c.principal } : c));
    } else {
      next = [...contactos, { ...form, id: Date.now().toString(), principal: contactos.length === 0 }];
    }
    setContactos(next);
    saveContactosEmergencia(next);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEditar = (c) => {
    setForm({ nombre: c.nombre, relacion: c.relacion, telefono: c.telefono });
    setEditingId(c.id);
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEliminar = (id) => {
    const next = contactos.filter((c) => c.id !== id);
    setContactos(next);
    saveContactosEmergencia(next);
    if (editingId === id) cancelarEdicion();
  };

  const handleMarcarPrincipal = (id) => {
    const next = contactos.map((c) => ({ ...c, principal: c.id === id }));
    setContactos(next);
    saveContactosEmergencia(next);
  };

  return (
    <div>
      {!embedded && (
        <>
          <BackButton onBack={onBack} label="Volver a Mi Perfil" className="mb-4" />

          <Header
            title="Contactos de emergencia"
            subtitle="Familia y allegados, a un toque en caso de urgencia"
          />
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[20px] border border-[var(--border-soft)] p-5 shadow-sm">
          <p className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-3">
            {editingId ? "Editar contacto" : "Agregar contacto"}
          </p>

          <label className="text-xs text-ink-muted block mb-1">Nombre</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => updateField("nombre", e.target.value)}
            placeholder="Ej: Lucía Gómez"
            className={inputClass}
          />

          <label className="text-xs text-ink-muted block mb-1">Relación</label>
          <input
            type="text"
            value={form.relacion}
            onChange={(e) => updateField("relacion", e.target.value)}
            placeholder="Ej: Hermana, Mamá, Amigo"
            className={inputClass}
          />

          <label className="text-xs text-ink-muted block mb-1">Teléfono</label>
          <input
            type="tel"
            value={form.telefono}
            onChange={(e) => updateField("telefono", e.target.value)}
            placeholder="Ej: 11 5555 5555"
            className={inputClass}
          />

          <div className="flex items-center gap-3">
            <button
              onClick={handleGuardar}
              className="text-white text-sm font-medium px-4 py-2 rounded-full hover:brightness-105 transition-[filter]"
              style={primaryButtonStyle}
            >
              {editingId ? "Guardar cambios" : "+ Agregar"}
            </button>
            {editingId && (
              <button onClick={cancelarEdicion} className="text-sm text-ink-muted hover:text-brand-pink">
                Cancelar
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-[var(--border-soft)] p-5 shadow-sm">
          <p className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-3">
            Tus contactos
          </p>
          {contactos.length === 0 ? (
            <p className="text-sm text-ink-muted/70">Todavía no agregaste ningún contacto.</p>
          ) : (
            <ul className="space-y-2">
              {contactos.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between bg-brand-pink-light/30 border border-[var(--border-soft)] rounded-xl px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-ink flex items-center gap-1.5">
                      {c.nombre}
                      {c.principal && (
                        <span className="text-[10px] font-semibold text-brand-magenta bg-brand-pink-light rounded-full px-2 py-0.5">
                          Principal
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {c.relacion} {c.telefono && `· ${c.telefono}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {c.telefono && (
                      <a
                        href={`tel:${c.telefono.replace(/\s+/g, "")}`}
                        aria-label={`Llamar a ${c.nombre}`}
                        title="Llamar"
                        className="flex items-center justify-center w-7 h-7 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleMarcarPrincipal(c.id)}
                      aria-label="Marcar como principal"
                      title="Marcar como principal"
                      className={c.principal ? "text-brand-pink" : "text-ink-muted/60 hover:text-brand-pink"}
                    >
                      <Star className="w-3.5 h-3.5" fill={c.principal ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={() => handleEditar(c)}
                      aria-label="Editar"
                      title="Editar"
                      className="text-brand-pink"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleEliminar(c.id)}
                      aria-label="Eliminar"
                      title="Eliminar"
                      className="text-ink-muted/60 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
