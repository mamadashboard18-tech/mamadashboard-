import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";

const EDGE_ZONE_PX = 40;
const SWIPE_THRESHOLD_PX = 70;
const MAX_VERTICAL_DRIFT_PX = 60;

export default function BackButton({ onBack, label = "Volver", className = "" }) {
  useEffect(() => {
    if (!onBack) return undefined;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onTouchStart = (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      tracking = startX < EDGE_ZONE_PX;
    };

    const onTouchEnd = (e) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = Math.abs(t.clientY - startY);
      if (dx > SWIPE_THRESHOLD_PX && dy < MAX_VERTICAL_DRIFT_PX) onBack();
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [onBack]);

  if (!onBack) return null;

  return (
    <button
      type="button"
      onClick={onBack}
      aria-label={label}
      title={label}
      className={`w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-muted hover:text-brand-pink transition-colors cursor-pointer shrink-0 ${className}`}
    >
      <ChevronLeft className="w-4 h-4" strokeWidth={2} />
    </button>
  );
}
