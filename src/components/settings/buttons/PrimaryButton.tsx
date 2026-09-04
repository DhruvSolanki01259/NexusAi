import { Loader2 } from "lucide-react";

export function PrimaryButton({
  children,
  onClick,
  loading,
}: {
  children: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#23ce6b] px-4 text-xs font-semibold text-[#07100b] transition-colors hover:bg-[#2ddd78] disabled:pointer-events-none disabled:opacity-50"
    >
      {loading && (
        <Loader2 size={14} strokeWidth={2} className="animate-spin" />
      )}

      {loading ? "Processing..." : children}
    </button>
  );
}
