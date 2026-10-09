import { ChevronRight } from "lucide-react";

export default function FeatureCard({ icon, title, desc, onClick, tint = "pink" }) {
  const Tag = onClick ? "button" : "div";
  const badgeClass =
    tint === "purple"
      ? "bg-brand-purple-light/70 text-brand-purple"
      : "bg-brand-pink-light/70 text-brand-pink";

  return (
    <Tag
      onClick={onClick}
      className={`group bg-white border border-[var(--border-soft)] rounded-[22px] p-4 w-full text-left transition-all ${
        onClick ? "cursor-pointer hover:border-brand-pink hover:-translate-y-0.5" : ""
      }`}
      style={{ boxShadow: "0 2px 16px rgba(155,93,229,0.08)" }}
    >
      <div className="flex items-center gap-3.5">
        <span className={`flex items-center justify-center w-11 h-11 rounded-full shrink-0 ${badgeClass}`}>
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-ink text-[15px]">{title}</p>
          <p className="text-[13px] text-ink-muted mt-0.5 leading-snug">{desc}</p>
        </div>
        {onClick && (
          <ChevronRight className="w-4 h-4 text-ink-muted/60 shrink-0 group-hover:text-brand-pink transition-colors" />
        )}
      </div>
    </Tag>
  );
}
