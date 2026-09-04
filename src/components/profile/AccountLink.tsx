import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function AccountLink({
  href,
  icon: Icon,
  title,
  description,
  value,
}: {
  href: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  title: string;
  description: string;
  value?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 p-5 transition-colors hover:bg-[#303737] focus:bg-[#303737] focus:outline-none"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#303737] text-[#23ce6b] transition-colors group-hover:bg-[#26342d]">
        <Icon size={17} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#edf5fc]">{title}</p>

        <p className="mt-1 max-w-xl text-xs leading-5 text-[#697171]">
          {description}
        </p>
      </div>

      {value && (
        <span className="hidden shrink-0 text-xs text-[#23ce6b] sm:block">
          {value}
        </span>
      )}

      <ChevronRight
        size={16}
        strokeWidth={1.8}
        className="shrink-0 text-[#5f6666] transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-[#8b9494]"
      />
    </Link>
  );
}
