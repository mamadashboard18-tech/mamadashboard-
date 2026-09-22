import { useEffect, useState } from "react";
import Header from "./Header";
import FeatureCard from "./FeatureCard";
import HistorialEmbarazo from "./HistorialEmbarazo";
import Contactos from "./Contactos";
import BackButton from "./BackButton";
import PlanParto from "./PlanParto";
import ChecklistHospital from "./ChecklistHospital";
import ListaCompras from "./ListaCompras";
import ListaNombres from "./ListaNombres";
import ChecklistNursery from "./ChecklistNursery";
import Tramites from "./Tramites";
import PreferenciasContenido from "./PreferenciasContenido";
import PartnerManagement from "./partner/PartnerManagement";
import PrivacidadPanel from "./PrivacidadPanel";
import { emptyPerfil, loadPerfil, savePerfil } from "../data/perfil";
import { totalWeeks } from "../data/seguimientoSemanal";
import { emptyBebe, loadBebe, saveBebe } from "../data/bebe";
import {
  Save,
  Pencil,
  BookOpen,
  NotebookPen,
  Backpack,
  Phone,
  ListChecks,
  Settings,
  LogOut,
  ShoppingBag,
  Heart,
  Home,
  FolderOpen,
  Users,
  Headphones,
  Lock,
} from "lucide-react";

const inputClass =
  "w-full border border-[var(--border-soft)] rounded-xl p-2.5 text-sm text-ink bg-white focus:outline-none focus:border-brand-pink transition-colors";

const primaryButtonStyle = { background: "var(--gradient-hero)" };

const hojas = {
  historial: {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Historial de mi embarazo",
    desc: "Todo lo que fuiste registrando, con exportación a PDF",
    Component: HistorialEmbarazo,
  },
  "plan-parto": {
    icon: <NotebookPen className="w-5 h-5" />,
    title: "Plan de parto interactivo",
    desc: "Generador personalizable, exportable en PDF para el equipo médico",
    Component: PlanParto,
  },
  "checklist-hospital": {
    icon: <Backpack className="w-5 h-5" />,
    title: "Checklist del hospital",
    desc: "Bolsa, documentos, personas de contacto",
    Component: ChecklistHospital,
  },
  "lista-compras": {
    icon: <ShoppingBag className="w-5 h-5" />,
    title: "Lista de compras",
    desc: "Por categoría, con sugerencias",
    Component: ListaCompras,
  },
  "lista-nombres": {
    icon: <Heart className="w-5 h-5" />,
    title: "Lista de nombres",
    desc: "Tu shortlist, marcá tus favoritos",
    Component: ListaNombres,
  },
  "checklist-nursery": {
    icon: <Home className="w-5 h-5" />,
    title: "Checklist de nursery",
    desc: "Progreso del cuarto del bebé",
    Component: ChecklistNursery,
  },
  tramites: {
    icon: <FolderOpen className="w-5 h-5" />,
    title: "Trámites",
    desc: "Por país, embarazo y postparto",
    Component: Tramites,
  },
  "preferencias-contenido": {
    icon: <Headphones className="w-5 h-5" />,
    title: "Preferencias de contenido",
    desc: "Tipos favoritos, idioma, notificaciones",
    Component: PreferenciasContenido,
  },
  privacidad: {
    icon: <Lock className="w-5 h-5" />,
    title: "Privacidad",
    desc: "Conectá o desconectá Google Calendar y controlá tus datos compartidos",
    Component: PrivacidadPanel,
  },
};

// Secciones del perfil. Las que tienen `items` abren un listado intermedio;
// las que tienen `Component` abren directo esa pantalla.
const grupos = {
  checklists: {
    icon: <ListChecks className="w-5 h-5" />,
    title: "Checklists",
    desc: "Bolso del hospital, compras, nombres y nursery",
    items: ["checklist-hospital", "lista-compras", "lista-nombres", "checklist-nursery"],
  },
  contactos: {
    icon: <Phone className="w-5 h-5" />,
    title: "Contactos",
    desc: "Equipo médico y contactos de emergencia",
    Component: Contactos,
  },
  partner: {
    icon: <Users className="w-5 h-5" />,
    title: "Tu partner",
    desc: "Invitalo para que vea tus citas, síntomas y reciba tus notas",
    Component: PartnerManagement,
  },
  tramites: {
    icon: <FolderOpen className="w-5 h-5" />,
    title: "Trámites y documentos",
    desc: "Trámites, plan de parto e historial del embarazo",
    items: ["tramites", "plan-parto", "historial"],
  },
};

const gruposOrden = ["checklists", "contactos", "partner", "tramites"];

const ajustesItems = ["preferencias-contenido", "privacidad"];

const CANTIDAD_OPTIONS = [
  { value: 1, label: "1 bebé" },
  { value: 2, label: "Mellizos" },
  { value: 3, label: "3 o más" },
];

const SEXO_OPTIONS = [
  { value: "nena", label: "Nena" },
  { value: "nene", label: "Nene" },
  { value: "mixto", label: "Uno de cada uno" },
  { value: "no-se", label: "Todavía no sé" },
];

function toggleOptionClass(active) {
  return `flex-1 text-sm font-medium py-2 rounded-xl border transition-colors ${
    active
      ? "bg-brand-pink text-white border-brand-pink"
      : "bg-white text-ink-muted border-[var(--border-soft)] hover:border-brand-pink"
  }`;
}

export default function PerfilPanel({ onLogout }) {
  const [grupo, setGrupo] = useState(null);
  const [view, setView] = useState(null);
  const [perfil, setPerfil] = useState(emptyPerfil);
  const [saved, setSaved] = useState(false);
  const [bebe, setBebe] = useState(emptyBebe);
  const [editandoBebe, setEditandoBebe] = useState(false);
  const [bebeSaved, setBebeSaved] = useState(false);

  useEffect(() => {
    loadPerfil().then(setPerfil);
    setBebe(loadBebe());
  }, []);

  const openGrupo = (id) => {
    setGrupo(id);
    setView(null);
  };
  const backToPerfil = () => {
    setGrupo(null);
    setView(null);
  };

  if (view) {
    const { Component } = hojas[view];
    return <Component onBack={() => setView(null)} />;
  }

  if (grupo === "ajustes") {
    return (
      <HubList
        title="Ajustes"
        subtitle="Tu contenido, tu privacidad y tu cuenta"
        items={ajustesItems}
        onBack={backToPerfil}
        onOpen={setView}
      >
        <button
          onClick={onLogout}
          className="mt-6 flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </HubList>
    );
  }

  if (grupo) {
    const g = grupos[grupo];
    if (g.Component) return <g.Component onBack={backToPerfil} />;
    return (
      <HubList title={g.title} subtitle={g.desc} items={g.items} onBack={backToPerfil} onOpen={setView} />
    );
  }

  const update = (field, value) => {
    setPerfil((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleGuardar = async () => {
    await savePerfil(perfil);
    setSaved(true);
  };

  const updateBebe = (field, value) => {
    setBebe((prev) => ({ ...prev, [field]: value }));
    setBebeSaved(false);
  };

  const handleGuardarBebe = () => {
    if (!bebe.fechaNacimiento) return;
    const next = { ...bebe, registrado: true };
    setBebe(next);
    saveBebe(next);
    setBebeSaved(true);
    setEditandoBebe(false);
  };

  const handleVolverAEmbarazo = () => {
    if (!window.confirm("Esto borra los datos del nacimiento y te vuelve a la vista de embarazo. ¿Continuar?")) {
      return;
    }
    const next = { ...emptyBebe };
    setBebe(next);
    saveBebe(next);
    setEditandoBebe(false);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <Header title="Mi Perfil" subtitle="Tus datos y los de tu bebé" />
        <button
          type="button"
          onClick={() => openGrupo("ajustes")}
          aria-label="Ajustes"
          title="Ajustes"
          className="w-10 h-10 rounded-full bg-white border border-[var(--border-soft)] shadow-sm flex items-center justify-center text-ink-muted hover:text-brand-pink hover:border-brand-pink transition-colors shrink-0"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-[20px] border border-[var(--border-soft)] p-6 shadow-sm mb-6">
        <p className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-4">
          Datos personales
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-ink-muted block mb-1">
              Semana actual de embarazo
            </label>
            <input
              type="number"
              min={1}
              max={totalWeeks}
              value={perfil.semanaActual}
              onChange={(e) => update("semanaActual", Number(e.target.value))}
              className={inputClass}
            />
            <p className="text-xs text-ink-muted/70 mt-1">
              Esto actualiza el Inicio y el seguimiento en toda la app
            </p>
          </div>

          <div>
            <label className="text-xs text-ink-muted block mb-1">Fecha probable de parto</label>
            <input
              type="date"
              value={perfil.fpp}
              onChange={(e) => update("fpp", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs text-ink-muted block mb-1">Médico / obstetra</label>
            <input
              type="text"
              value={perfil.medico}
              onChange={(e) => update("medico", e.target.value)}
              placeholder="Ej: Dra. Pérez"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs text-ink-muted block mb-1">Hospital / clínica</label>
            <input
              type="text"
              value={perfil.hospital}
              onChange={(e) => update("hospital", e.target.value)}
              placeholder="Ej: Clínica del Sol"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-ink-muted block mb-2">¿Cuántos bebés esperás?</label>
          <div className="flex gap-2">
            {CANTIDAD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("cantidadBebes", opt.value)}
                className={toggleOptionClass(perfil.cantidadBebes === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-ink-muted block mb-2">¿Sabés el sexo?</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SEXO_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("sexo", opt.value)}
                className={toggleOptionClass(perfil.sexo === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGuardar}
            aria-label="Guardar datos"
            title="Guardar datos"
            className="flex items-center justify-center w-10 h-10 text-white rounded-full hover:brightness-105 transition-[filter]"
            style={primaryButtonStyle}
          >
            <Save className="w-4 h-4" />
          </button>
          {saved && <span className="text-sm text-green-600">Guardado ✓</span>}
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-[var(--border-soft)] p-6 shadow-sm mb-6">
        <p className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-4">
          Tu bebé
        </p>

        {!bebe.registrado && !editandoBebe && (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium text-ink">¿Ya nació tu bebé?</p>
              <p className="text-sm text-ink-muted mt-1">
                Registrá el nacimiento para activar tu cuarto trimestre en Inicio
              </p>
            </div>
            <button
              onClick={() => setEditandoBebe(true)}
              className="text-white text-sm font-medium px-4 py-2 rounded-full hover:brightness-105 transition-[filter] whitespace-nowrap"
              style={primaryButtonStyle}
            >
              Registrar nacimiento
            </button>
          </div>
        )}

        {bebe.registrado && !editandoBebe && (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium text-ink">{bebe.nombre || "Tu bebé"}</p>
              <p className="text-sm text-ink-muted mt-1">
                Nació el {bebe.fechaNacimiento}
                {bebe.peso ? ` · ${bebe.peso} g` : ""}
                {bebe.proximoControl ? ` · próximo control ${bebe.proximoControl}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-4 whitespace-nowrap">
              <button
                onClick={() => setEditandoBebe(true)}
                aria-label="Editar"
                title="Editar"
                className="text-brand-pink"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleVolverAEmbarazo}
                className="text-sm text-ink-muted hover:text-brand-pink hover:underline"
              >
                Volver a modo embarazo
              </button>
            </div>
          </div>
        )}

        {editandoBebe && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-ink-muted block mb-1">Fecha de nacimiento</label>
                <input
                  type="date"
                  value={bebe.fechaNacimiento}
                  onChange={(e) => updateBebe("fechaNacimiento", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-ink-muted block mb-1">Nombre (opcional)</label>
                <input
                  type="text"
                  value={bebe.nombre}
                  onChange={(e) => updateBebe("nombre", e.target.value)}
                  placeholder="Ej: Sofía"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-ink-muted block mb-1">Peso (g)</label>
                <input
                  type="number"
                  min={0}
                  value={bebe.peso}
                  onChange={(e) => updateBebe("peso", e.target.value)}
                  placeholder="Ej: 3400"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-ink-muted block mb-1">Próximo control</label>
                <input
                  type="date"
                  value={bebe.proximoControl}
                  onChange={(e) => updateBebe("proximoControl", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleGuardarBebe}
                disabled={!bebe.fechaNacimiento}
                aria-label="Guardar"
                title="Guardar"
                className="flex items-center justify-center w-10 h-10 text-white rounded-full hover:brightness-105 transition-[filter] disabled:opacity-50"
                style={primaryButtonStyle}
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditandoBebe(false)}
                className="text-sm text-ink-muted hover:text-brand-pink"
              >
                Cancelar
              </button>
              {bebeSaved && <span className="text-sm text-green-600">Guardado ✓</span>}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {gruposOrden.map((id, i) => {
          const g = grupos[id];
          return (
            <FeatureCard
              key={id}
              icon={g.icon}
              title={g.title}
              desc={g.desc}
              tint={i % 2 === 0 ? "pink" : "purple"}
              onClick={() => openGrupo(id)}
            />
          );
        })}
      </div>
    </div>
  );
}

function HubList({ title, subtitle, items, onBack, onOpen, children }) {
  return (
    <div>
      <BackButton onBack={onBack} label="Volver a Mi Perfil" className="mb-4" />
      <Header title={title} subtitle={subtitle} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((id, i) => {
          const h = hojas[id];
          return (
            <FeatureCard
              key={id}
              icon={h.icon}
              title={h.title}
              desc={h.desc}
              tint={i % 2 === 0 ? "pink" : "purple"}
              onClick={() => onOpen(id)}
            />
          );
        })}
      </div>
      {children}
    </div>
  );
}
