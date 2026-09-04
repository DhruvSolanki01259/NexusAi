import { X } from "lucide-react";

export function ModalHeader({
  icon: Icon,
  title,
  description,
  onClose,
  disabled,
  danger = false,
}: {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  title: string;
  description: string;
  onClose: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex items-start gap-3.5 border-b border-[#303737] p-5">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          danger ? "bg-[#2b1c1c] text-[#d87575]" : "bg-[#203329] text-[#23ce6b]"
        }`}
      >
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-[#edf5fc]">{title}</h3>

        <p className="mt-1.5 text-xs leading-5 text-[#697171]">{description}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        disabled={disabled}
        aria-label="Close dialog"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#697171] transition-colors hover:bg-[#202525] hover:text-[#edf5fc] disabled:pointer-events-none disabled:opacity-40"
      >
        <X size={15} strokeWidth={1.8} />
      </button>
    </div>
  );
}
