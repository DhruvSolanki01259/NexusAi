export function ModalShell({
  children,
  onClose,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  disabled?: boolean;
  title: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-5 backdrop-blur-sm sm:px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !disabled) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="my-auto w-full max-w-md overflow-hidden rounded-2xl border border-[#303737] bg-[#141818] shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
