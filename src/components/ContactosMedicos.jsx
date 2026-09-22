import { useEffect, useState } from "react";
import { Save, Pencil, Trash2, Phone } from "lucide-react";
import Header from "./Header";
import BackButton from "./BackButton";
import { loadContactos, saveContactos, rolesSugeridos } from "../data/contactosMedicos";

const emptyForm = { nombre: "", rol: rolesSugeridos[0], telefono: "" };
const inputClass =
  "w-full border border-[var(--border-soft)] rounded-xl p-2 text-sm text-ink bg-white mb-3 focus:outline-none focus:border-brand-pink transition-colors";
const primaryButtonStyle = { background: "var(--gradient-hero)" };

export default function ContactosMedicos({ onBack, embedded = false }) {
  const [contactos, setContactos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setContactos(loadContactos());
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardar = () => {
    if (!form.nombre.trim()) return;
    let next;
    if (editingId) {
      next = contactos.map((c) => (c.id === editingId ? { ...form, id: editingId } : c));
    } else {
      next = [...contactos, { ...form, id: Date.now().toString() }];
    }
    setContactos(next);
    saveContactos(next);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEditar = (c) => {
    setForm({ nombre: c.nombre, rol: c.rol, telefono: c.telefono });
    setEditingId(c.id);
  };

  const handleEliminar = (id) => {
    const next = contactos.filter((c) => c.id !== id);
    setContactos(next);
    saveContactos(next);
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div>
      {!embedded && (
        <>
          <BackButton onBack={onBack} label="Volver a Mi Perfil" className="mb-4" />

          <Header
            title="Contactos del equipo médico"
            subtitle="A mano para una emergencia"
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
            placeholder="Ej: Dra. Pérez"
            className={inputClass}
          />

          <label className="text-xs text-ink-muted block mb-1">Rol</label>
          <select
            value={form.rol}
            onChange={(e) => updateField("rol", e.target.value)}
            className={inputClass}
          >
            {rolesSugeridos.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

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
              aria-label={editingId ? "Guardar cambios" : "Agregar"}
              title={editingId ? "Guardar cambios" : "Agregar"}
              className={
                editingId
                  ? "flex items-center justify-center w-10 h-10 text-white rounded-full hover:brightness-105 transition-[filter]"
                  : "text-white text-sm font-medium px-4 py-2 rounded-full hover:brightness-105 transition-[filter]"
              }
              style={primaryButtonStyle}
            >
              {editingId ? <Save className="w-4 h-4" /> : "+ Agregar"}
            </button>
            {editingId && (
              <button
                onClick={cancelarEdicion}
                className="text-sm text-ink-muted hover:text-brand-pink"
              >
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
                    <p className="text-sm font-medium text-ink">{c.nombre}</p>
                    <p className="text-xs text-ink-muted">
                      {c.rol} {c.telefono && `· ${c.telefono}`}
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
