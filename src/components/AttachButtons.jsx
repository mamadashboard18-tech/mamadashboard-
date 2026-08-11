import { Image as ImageIcon, Camera, Paperclip } from "lucide-react";

const btnClass =
  "w-10 h-10 flex items-center justify-center bg-[rgba(255,111,159,0.14)] text-brand-pink rounded-full cursor-pointer hover:bg-[rgba(255,111,159,0.24)] transition-colors";

export default function AttachButtons({ onFiles, className = "" }) {
  const handleChange = (e) => {
    if (e.target.files.length) onFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className={btnClass} aria-label="Adjuntar imagen" title="Adjuntar imagen">
        <ImageIcon className="w-[18px] h-[18px]" strokeWidth={1.8} />
        <input type="file" multiple accept="image/*" onChange={handleChange} className="hidden" />
      </label>
      <label className={btnClass} aria-label="Tomar foto" title="Tomar foto">
        <Camera className="w-[18px] h-[18px]" strokeWidth={1.8} />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          className="hidden"
        />
      </label>
      <label className={btnClass} aria-label="Adjuntar archivo" title="Adjuntar archivo">
        <Paperclip className="w-[18px] h-[18px]" strokeWidth={1.8} />
        <input
          type="file"
          multiple
          accept="application/pdf,.doc,.docx"
          onChange={handleChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
