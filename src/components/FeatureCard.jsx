export default function FeatureCard({ icon, title, desc, onClick, tint = "pink" }) {
  const Tag = onClick ? "button" : "div";
  const badgeClass =
    tint === "purple"
      ? "bg-brand-purple-light/60 text-brand-purple"
      : "bg-brand-pink-light/60 text-brand-pink";

  return (
    <Tag
      onClick={onClick}
      className={`bg-white border border-[var(--border-soft)] rounded-[20px] p-4 shadow-sm hover:shadow-md transition-shadow w-full text-left ${
        onClick ? "cursor-pointer hover:border-brand-pink" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${badgeClass}`}>
          {icon}
        </span>
        <div>
          <p className="font-medium text-ink text-sm">{title}</p>
          <p className="text-sm text-ink-muted mt-1">{desc}</p>
        </div>
      </div>
    </Tag>
  );
}
