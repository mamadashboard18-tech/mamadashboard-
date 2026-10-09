import { useEffect, useState } from "react";
import { Pencil, Star, Save, Plus, UserPlus, ShieldAlert } from "lucide-react";
import { PantallaTop, Card, SectionLabel, BotonPrimario, IconAction, Vacio } from "./ui/Perfil";
import ContactoItem from "./ui/ContactoItem";
import { inputClass, labelClass } from "./ui/estilos";
import { loadContactosEmergencia, saveContactosEmergencia } from "../data/contactosEmergencia";

const emptyForm = { nombre: "", relacion: "", telefono: "" };


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
        <PantallaTop
          onBack={onBack}
          icon={ShieldAlert}
          title="Contactos de emergencia"
          subtitle="Familia y allegados, a un toque en caso de urgencia"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="lg:order-2">
          <SectionLabel>Tus contactos</SectionLabel>
          {contactos.length === 0 ? (
            <Vacio icon={ShieldAlert}>Todavía no agregaste ningún contacto de emergencia.</Vacio>
          ) : (
            <ul className="flex flex-col gap-2">
              {contactos.map((c) => (
                <ContactoItem
                  key={c.id}
                  nombre={c.nombre}
                  detalle={c.relacion}
                  telefono={c.telefono}
                  editando={editingId === c.id}
                  badge={c.principal ? "Principal" : null}
                  extra={
                    <IconAction
                      icon={Star}
                      label="Marcar como principal"
                      onClick={() => handleMarcarPrincipal(c.id)}
                      tono={c.principal ? "rosa" : "neutro"}
                      filled={c.principal}
                    />
                  }
                  onEditar={() => handleEditar(c)}
                  onEliminar={() => handleEliminar(c.id)}
                />
              ))}
            </ul>
          )}
        </Card>

        <Card className="lg:order-1">
          <SectionLabel icon={editingId ? Pencil : UserPlus}>
            {editingId ? "Editar contacto" : "Agregar contacto"}
          </SectionLabel>

          <label className={labelClass}>Nombre</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => updateField("nombre", e.target.value)}
            placeholder="Ej: Lucía Gómez"
            className={`${inputClass} mb-3`}
          />

          <label className={labelClass}>Relación</label>
          <input
            type="text"
            value={form.relacion}
            onChange={(e) => updateField("relacion", e.target.value)}
            placeholder="Ej: Hermana, Mamá, Amigo"
            className={`${inputClass} mb-3`}
          />

          <label className={labelClass}>Teléfono</label>
          <input
            type="tel"
            value={form.telefono}
            onChange={(e) => updateField("telefono", e.target.value)}
            placeholder="Ej: 11 5555 5555"
            className={`${inputClass} mb-4`}
          />

          <div className="flex items-center gap-3">
            <BotonPrimario icon={editingId ? Save : Plus} onClick={handleGuardar} disabled={!form.nombre.trim()}>
              {editingId ? "Guardar cambios" : "Agregar"}
            </BotonPrimario>
            {editingId && (
              <button onClick={cancelarEdicion} className="text-sm font-bold text-ink-muted hover:text-brand-pink cursor-pointer">
                Cancelar
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
