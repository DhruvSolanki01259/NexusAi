export function StatCard({
  icon: Icon,
  label,
  value,
  indicator,
}: {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  label: string;
  value: string;
  indicator?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#414949] bg-[#161a1a] p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#303737] text-[#23ce6b]">
          <Icon size={17} strokeWidth={1.8} />
        </div>

        {indicator !== undefined && (
          <span
            className={`flex items-center gap-1.5 text-xs ${
              indicator ? "text-[#23ce6b]" : "text-[#697171]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                indicator ? "bg-[#23ce6b]" : "bg-[#697171]"
              }`}
            />

            {indicator ? "Active" : "Off"}
          </span>
        )}
      </div>

      <p className="mt-5 text-2xl font-semibold tracking-tight text-[#edf5fc]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#697171]">{label}</p>
    </div>
  );
}
