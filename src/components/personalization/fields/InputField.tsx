export function InputField({
  label,
  description,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="rounded-2xl border border-[#303737] bg-[#141818] p-4 transition-colors hover:border-[#414949] sm:p-5">
      <label className="block">
        <span className="text-sm font-medium text-[#edf5fc]">{label}</span>

        <span className="mt-1 block text-xs leading-5 text-[#697171]">
          {description}
        </span>

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="mt-3 h-10 w-full rounded-xl border border-[#303737] bg-[#0f1212] px-3 text-sm text-[#edf5fc] outline-none transition-all placeholder:text-[#5f6666] hover:border-[#414949] focus:border-[#23ce6b]/60 focus:ring-1 focus:ring-[#23ce6b]/15"
        />
      </label>
    </div>
  );
}
