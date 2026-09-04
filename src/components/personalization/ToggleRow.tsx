export function ToggleRow({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3.5 p-4 sm:gap-4 sm:p-5">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
          enabled
            ? "bg-[#203329] text-[#23ce6b]"
            : "bg-[#242929] text-[#697171]"
        }`}
      >
        <Icon size={17} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#edf5fc]">{title}</p>

        <p className="mt-1 text-xs leading-5 text-[#697171]">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`${title}: ${enabled ? "On" : "Off"}`}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full p-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/25 ${
          enabled ? "bg-[#23ce6b]" : "bg-[#343b3b] hover:bg-[#414949]"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-[#f0f6f6] shadow-[0_1px_4px_rgba(0,0,0,0.35)] transition-transform duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
