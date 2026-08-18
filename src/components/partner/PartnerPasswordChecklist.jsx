import { Check } from "lucide-react";
import { PASSWORD_RULES } from "../auth/PasswordInput";

export default function PartnerPasswordChecklist({ password }) {
  return (
    <div className="flex flex-col gap-1.5 mt-2.5">
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(password);
        return (
          <div key={rule.key} className="flex items-center gap-1.5">
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                ok ? "bg-partner-green-text text-white" : "bg-partner-violet/16 text-transparent"
              }`}
            >
              <Check className="w-[11px] h-[11px]" strokeWidth={2.4} />
            </span>
            <span className={`text-[12.5px] ${ok ? "text-partner-ink-secondary" : "text-partner-ink-faint"}`}>
              {rule.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
