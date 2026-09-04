export function SecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-10 rounded-lg border border-[#303737] px-4 text-xs font-medium text-[#9ba4a4] transition-colors hover:bg-[#1b2020] hover:text-[#edf5fc] disabled:pointer-events-none disabled:opacity-50"
    >
      {children}
    </button>
  );
}
