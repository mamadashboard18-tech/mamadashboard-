export default function PartnerAmbientBlobs() {
  return (
    <div className="absolute inset-x-0 top-0 h-[520px] -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute -top-[70px] -left-[50px] w-[360px] h-[360px] rounded-full opacity-60"
        style={{ background: "var(--partner-blob-peach)", filter: "blur(75px)" }}
      />
      <div
        className="absolute -top-10 -right-[70px] w-[400px] h-[400px] rounded-full opacity-55"
        style={{ background: "var(--partner-blob-lavender)", filter: "blur(85px)" }}
      />
      <div
        className="absolute top-[140px] left-[38%] w-80 h-80 rounded-full opacity-[0.18]"
        style={{ background: "var(--partner-blob-violet)", filter: "blur(95px)" }}
      />
    </div>
  );
}
