import { Trash2 } from "lucide-react";

export function DeleteDialog({ onClose }: { onClose: () => void }) {
  const handleAccountDeletion = async () => {
    console.log("Deleting Account");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#414949] bg-[#161a1a] p-6 shadow-2xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d95c5c]/8 text-[#d95c5c]">
          <Trash2 size={19} strokeWidth={1.8} />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-[#edf5fc]">
          Delete your account?
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#697171]">
          This permanently removes your NEXUS account and associated data. This
          action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-[#414949] bg-[#0f1212] px-4 text-sm font-medium text-[#aeb7ba] transition-colors hover:bg-[#303737] hover:text-[#edf5fc] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/20"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAccountDeletion}
            className="h-10 rounded-xl bg-[#d95c5c] px-4 text-sm font-medium text-[#0b0d0d] transition-colors hover:bg-[#e8a0a0] focus:outline-none focus:ring-2 focus:ring-[#d95c5c]/20"
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}
