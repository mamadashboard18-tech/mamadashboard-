export default function Header({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-6 min-w-0">
      <h2 className="font-heading text-[28px] font-extrabold text-ink leading-tight flex items-start gap-2.5">
        {Icon && <Icon className="w-[26px] h-[26px] text-brand-pink shrink-0 mt-[3px]" strokeWidth={1.8} />}
        {title}
      </h2>
      {subtitle && <p className="text-[15px] text-ink-muted mt-1.5 leading-relaxed">{subtitle}</p>}
    </div>
  );
}
