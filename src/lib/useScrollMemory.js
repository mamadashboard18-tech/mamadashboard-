import { useEffect, useLayoutEffect, useRef } from "react";

// El scroll de la app no es el de la ventana sino el del <main> marcado con
// data-scroll-root (App y PartnerDashboard).
function getScroller() {
  return document.querySelector("[data-scroll-root]") || document.scrollingElement;
}

// Recuerda dónde estaba el scroll en cada vista de un panel. Al entrar a una
// subvista nueva arranca arriba; al volver (flecha atrás) restaura la posición
// que tenía esa vista, así queda a la vista el botón que se tocó.
export default function useScrollMemory(viewKey) {
  const stack = useRef([{ key: viewKey, y: 0 }]);

  useEffect(() => {
    const el = getScroller();
    if (!el) return;
    const target = el === document.scrollingElement ? window : el;
    const save = () => {
      stack.current[stack.current.length - 1].y = el.scrollTop;
    };
    target.addEventListener("scroll", save, { passive: true });
    // También al tocar, antes de que el cambio de vista recorte el scroll.
    document.addEventListener("click", save, true);
    return () => {
      target.removeEventListener("scroll", save);
      document.removeEventListener("click", save, true);
    };
  }, []);

  useLayoutEffect(() => {
    const s = stack.current;
    const top = s[s.length - 1];
    if (top.key === viewKey) return;

    const el = getScroller();
    if (!el) return;

    const idx = s.findIndex((entry) => entry.key === viewKey);
    if (idx === -1) {
      s.push({ key: viewKey, y: 0 });
      el.scrollTop = 0;
      return;
    }

    s.length = idx + 1;
    const y = s[idx].y;
    el.scrollTop = y;
    // Si la vista carga contenido async, puede no ser lo bastante alta todavía.
    let tries = 0;
    const retry = () => {
      if (Math.abs(el.scrollTop - y) < 2 || tries++ > 20) return;
      el.scrollTop = y;
      requestAnimationFrame(retry);
    };
    requestAnimationFrame(retry);
  }, [viewKey]);
}
