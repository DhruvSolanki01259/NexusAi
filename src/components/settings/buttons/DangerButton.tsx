import { Loader2 } from "lucide-react";

export function DangerButton({
  children,
  onClick,
  loading,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#b84d4d] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#c65a5a] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
    >
      {loading && (
        <Loader2 size={14} strokeWidth={2} className="animate-spin" />
      )}

      {loading ? "Deleting..." : children}
    </button>
  );
}
