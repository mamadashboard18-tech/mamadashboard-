import { useEffect, useState } from "react";
import { Save, Pencil, Phone, Users, Plus, UserPlus, Stethoscope } from "lucide-react";
import { PantallaTop, Card, SectionLabel, Select, ToggleRow, BotonPrimario, Vacio } from "./ui/Perfil";
import ContactoItem from "./ui/ContactoItem";
import { inputClass, labelClass } from "./ui/estilos";
import ToggleSwitch from "./ToggleSwitch";
import { loadContactos, saveContactos, rolesSugeridos } from "../data/contactosMedicos";
import { getPartnerStatus, syncContactosCompartidos } from "../data/partner";

const emptyForm = { nombre: "", rol: rolesSugeridos[0], telefono: "", compartirPartner: true };

export default function ContactosMedicos({ onBack, embedded = false }) {
  const [contactos, setContactos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [hasPartner, setHasPartner] = useState(false);

  useEffect(() => {
    const guardados = loadContactos();
    setContactos(guardados);
    getPartnerStatus().then((s) => {
      setHasPartner(s.hasPartner);
      if (s.hasPartner) syncContactosCompartidos(guardados);
    });
  }, []);

  const persistir = (next) => {
    setContactos(next);
    saveContactos(next);
    if (hasPartner) syncContactosCompartidos(next);
  };

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
    persistir(next);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEditar = (c) => {
    setForm({
      nombre: c.nombre,
      rol: c.rol,
      telefono: c.telefono,
      compartirPartner: c.compartirPartner ?? true,
    });
    setEditingId(c.id);
  };

  const handleEliminar = (id) => {
    persistir(contactos.filter((c) => c.id !== id));
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
        <PantallaTop
          onBack={onBack}
          icon={Phone}
          title="Contactos del equipo médico"
          subtitle="A mano para una emergencia"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="lg:order-2">
          <SectionLabel>Tus contactos</SectionLabel>
          {contactos.length === 0 ? (
            <Vacio icon={Stethoscope}>Todavía no agregaste ningún contacto de tu equipo médico.</Vacio>
          ) : (
            <ul className="flex flex-col gap-2">
              {contactos.map((c) => (
                <ContactoItem
                  key={c.id}
                  nombre={c.nombre}
                  detalle={c.rol}
                  telefono={c.telefono}
                  editando={editingId === c.id}
                  nota={
                    hasPartner && (c.compartirPartner ?? true) && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-brand-purple mt-1">
                        <Users className="w-3 h-3" strokeWidth={2} />
                        Compartido con tu acompañante
                      </span>
                    )
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
            placeholder="Ej: Dra. Pérez"
            className={`${inputClass} mb-3`}
          />

          <label className={labelClass}>Rol</label>
          <div className="mb-3">
            <Select value={form.rol} onChange={(e) => updateField("rol", e.target.value)}>
              {rolesSugeridos.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
          </div>

          <label className={labelClass}>Teléfono</label>
          <input
            type="tel"
            value={form.telefono}
            onChange={(e) => updateField("telefono", e.target.value)}
            placeholder="Ej: 11 5555 5555"
            className={`${inputClass} mb-3`}
          />

          {hasPartner && (
            <div className="bg-[var(--bg)] rounded-[20px] px-3.5 mb-4">
              <ToggleRow icon={Users} titulo="Compartir con mi acompañante" detalle="Va a poder verlo y llamar desde su cuenta">
                <ToggleSwitch
                  checked={form.compartirPartner}
                  onChange={() => updateField("compartirPartner", !form.compartirPartner)}
                  label="Compartir con mi acompañante"
                />
              </ToggleRow>
            </div>
          )}

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
