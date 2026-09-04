import { Check } from "lucide-react";

export function SuccessMessage({
  message,
  danger = false,
}: {
  message: string;
  danger?: boolean;
}) {
  return (
    <div
      role="status"
      className={`mt-4 flex items-start gap-2 rounded-xl border px-3.5 py-3 text-xs leading-5 ${
        danger
          ? "border-[#543232] bg-[#241818] text-[#d87575]"
          : "border-[#294b39] bg-[#16251d] text-[#7be0a4]"
      }`}
    >
      <Check size={14} strokeWidth={2} className="mt-0.5 shrink-0" />

      <span>{message}</span>
    </div>
  );
}
