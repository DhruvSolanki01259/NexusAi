import { Eye, EyeOff } from "lucide-react";

export function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  disabled,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  disabled?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[#c5cdcd]">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          autoComplete={autoComplete}
          className="h-11 w-full rounded-xl border border-[#303737] bg-[#101313] px-3.5 pr-11 text-sm text-[#edf5fc] outline-none transition-colors placeholder:text-[#596161] focus:border-[#23ce6b]/50 focus:ring-2 focus:ring-[#23ce6b]/10 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#697171] transition-colors hover:text-[#edf5fc] disabled:pointer-events-none disabled:opacity-40"
        >
          {visible ? (
            <EyeOff size={16} strokeWidth={1.8} />
          ) : (
            <Eye size={16} strokeWidth={1.8} />
          )}
        </button>
      </div>
    </div>
  );
}
