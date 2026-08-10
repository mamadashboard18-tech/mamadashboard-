export default function AmbientBlobs() {
  return (
    <div className="absolute inset-x-0 top-0 h-[520px] -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute -top-24 -right-16 w-72 h-72 rounded-full blur-3xl opacity-40"
        style={{ background: "var(--brand-pink)" }}
      />
      <div
        className="absolute top-24 -left-20 w-80 h-80 rounded-full blur-3xl opacity-35"
        style={{ background: "var(--brand-purple)" }}
      />
      <div
        className="absolute top-52 right-10 w-64 h-64 rounded-full blur-3xl opacity-25"
        style={{ background: "var(--brand-purple)" }}
      />
    </div>
  );
}
