import Header from "./Header";

export default function ComunidadPanel() {
  return (
    <div>
      <Header title="👥 Comunidad" subtitle="Conectá con otras mamás" />

      <div className="bg-white border border-rose-100 rounded-2xl p-8 shadow-sm text-center">
        <span className="text-4xl">🚧</span>
        <p className="text-lg font-semibold text-gray-900 mt-3">Próximamente</p>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          Estamos preparando grupos por semana de embarazo y un foro para que puedas
          acompañarte con otras mamás. ¡Vuelve pronto!
        </p>
      </div>
    </div>
  );
}
