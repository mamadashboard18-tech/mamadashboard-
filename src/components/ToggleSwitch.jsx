export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="w-11 h-[26px] rounded-full shrink-0 relative transition-colors cursor-pointer"
      style={{ background: checked ? "var(--gradient-hero)" : "rgba(155,93,229,0.16)" }}
    >
      <span
        className="absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out"
        style={{ transform: checked ? "translateX(18px)" : "translateX(0)" }}
      />
    </button>
  );
}
