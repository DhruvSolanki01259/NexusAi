export function SecurityRow({
  icon: Icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#242929] text-[#23ce6b]">
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#edf5fc]">{title}</p>

        <p className="mt-1 text-xs leading-5 text-[#697171]">{description}</p>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="h-9 shrink-0 rounded-lg border border-[#3a4242] px-3.5 text-xs font-medium text-[#c5cdcd] transition-all hover:border-[#596262] hover:bg-[#1b2020] hover:text-[#edf5fc] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/20"
      >
        {action}
      </button>
    </div>
  );
}
