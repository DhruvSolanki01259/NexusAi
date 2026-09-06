"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteDialogProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function DeleteDialog({
  onClose,
  onConfirm,
  loading = false,
}: DeleteDialogProps) {
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canDelete = confirmation.trim().toUpperCase() === "DELETE" && !loading;

  const handleAccountDeletion = async () => {
    if (!canDelete) {
      return;
    }

    setError(null);

    try {
      await onConfirm();
    } catch (error) {
      console.error("Account deletion failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete your account. Please try again.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#414949] bg-[#161a1a] p-6 shadow-2xl">
        {/* Icon */}
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d95c5c]/8 text-[#d95c5c]">
          <Trash2 size={19} strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h2 className="mt-5 text-lg font-semibold text-[#edf5fc]">
          Delete your account?
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm leading-6 text-[#697171]">
          This permanently removes your NEXUS account and associated data. This
          action cannot be undone.
        </p>

        {/* Confirmation input */}
        <div className="mt-5">
          <label
            htmlFor="delete-confirmation"
            className="text-xs font-medium text-[#aeb7ba]"
          >
            Type <span className="font-semibold text-[#edf5fc]">DELETE</span> to
            confirm
          </label>

          <input
            id="delete-confirmation"
            type="text"
            value={confirmation}
            onChange={(event) => {
              setConfirmation(event.target.value);
              setError(null);
            }}
            disabled={loading}
            autoComplete="off"
            placeholder="DELETE"
            className="mt-2 h-10 w-full rounded-xl border border-[#414949] bg-[#0f1212] px-3 text-sm text-[#edf5fc] outline-none transition-colors placeholder:text-[#4f5757] focus:border-[#d95c5c]/60 focus:ring-2 focus:ring-[#d95c5c]/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 rounded-xl border border-[#d95c5c]/20 bg-[#d95c5c]/5 px-3 py-2.5">
            <p className="text-xs leading-5 text-[#e8a0a0]">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-10 rounded-xl border border-[#414949] bg-[#0f1212] px-4 text-sm font-medium text-[#aeb7ba] transition-colors hover:bg-[#303737] hover:text-[#edf5fc] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAccountDeletion}
            disabled={!canDelete}
            className="h-10 rounded-xl bg-[#d95c5c] px-4 text-sm font-medium text-[#0b0d0d] transition-colors hover:bg-[#e8a0a0] focus:outline-none focus:ring-2 focus:ring-[#d95c5c]/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </div>
    </div>
  );
}
