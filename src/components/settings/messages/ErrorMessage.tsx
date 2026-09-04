export function ErrorMessage({
  message,
  danger = false,
}: {
  message: string;
  danger?: boolean;
}) {
  return (
    <div
      role="alert"
      className={`mt-4 rounded-xl border px-3.5 py-3 text-xs leading-5 ${
        danger
          ? "border-[#543232] bg-[#241818] text-[#d87575]"
          : "border-[#543232] bg-[#211818] text-[#d87575]"
      }`}
    >
      {message}
    </div>
  );
}
