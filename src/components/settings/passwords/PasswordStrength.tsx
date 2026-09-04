import { Check } from "lucide-react";

export function PasswordStrength({ password }: { password: string }) {
  const lengthValid = password.length >= 8;
  const mediumValid = password.length >= 12;

  const strongValid =
    /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);

  const score = Number(lengthValid) + Number(mediumValid) + Number(strongValid);

  const label =
    score === 1
      ? "Weak"
      : score === 2
        ? "Good"
        : score === 3
          ? "Strong"
          : "Too short";

  return (
    <div className="mt-4 rounded-xl border border-[#303737] bg-[#101313] p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#697171]">Password strength</span>

        <span
          className={`text-[11px] font-medium ${
            score >= 3
              ? "text-[#23ce6b]"
              : score >= 2
                ? "text-[#b8c579]"
                : "text-[#697171]"
          }`}
        >
          {label}
        </span>
      </div>

      <div className="mt-2 flex gap-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full ${
              score >= level ? "bg-[#23ce6b]" : "bg-[#303737]"
            }`}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        <Requirement valid={lengthValid}>8+ characters</Requirement>

        <Requirement valid={mediumValid}>12+ characters</Requirement>

        <Requirement valid={strongValid}>
          Uppercase, lowercase & number
        </Requirement>
      </div>
    </div>
  );
}

function Requirement({
  valid,
  children,
}: {
  valid: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] ${
        valid ? "text-[#23ce6b]" : "text-[#596161]"
      }`}
    >
      <Check size={10} strokeWidth={2} />
      {children}
    </span>
  );
}
