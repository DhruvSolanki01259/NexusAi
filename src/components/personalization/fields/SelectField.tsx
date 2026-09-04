import { useEffect, useRef } from "react";

import { Check, ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
  description: string;
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  open,
  onOpen,
  onClose,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open, onClose]);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl border bg-[#141818] p-4 transition-colors sm:p-5 ${
        open ? "border-[#23ce6b]/40" : "border-[#303737] hover:border-[#414949]"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#edf5fc]">{label}</p>

          <p className="mt-1 text-xs leading-5 text-[#697171]">
            {selectedOption.description}
          </p>
        </div>

        <div className="relative w-full shrink-0 sm:w-48">
          <button
            id={`${id}-trigger`}
            type="button"
            onClick={onOpen}
            aria-expanded={open}
            aria-haspopup="listbox"
            className={`flex h-10 w-full items-center justify-between rounded-xl border bg-[#0f1212] px-3.5 text-left text-sm font-medium transition-all duration-150 focus:outline-none ${
              open
                ? "border-[#23ce6b] ring-1 ring-[#23ce6b]/20"
                : "border-[#3a4242] hover:border-[#596262]"
            }`}
          >
            <span className="truncate text-[#edf5fc]">
              {selectedOption.label}
            </span>

            <ChevronDown
              size={15}
              strokeWidth={1.8}
              className={`ml-3 shrink-0 text-[#7d8787] transition-transform duration-200 ${
                open ? "rotate-180 text-[#23ce6b]" : ""
              }`}
            />
          </button>

          {open && (
            <div
              role="listbox"
              aria-labelledby={`${id}-trigger`}
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-100 overflow-hidden rounded-xl border border-[#394141] bg-[#111515] p-1.5 shadow-[0_18px_45px_rgba(0,0,0,0.55)]"
            >
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      onClose();
                    }}
                    className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      isSelected
                        ? "bg-[#183022] text-[#23ce6b]"
                        : "text-[#b4bcbc] hover:bg-[#1b2121] hover:text-[#edf5fc]"
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate text-sm">
                      {option.label}
                    </span>

                    {isSelected && (
                      <Check
                        size={15}
                        strokeWidth={2.2}
                        className="shrink-0 text-[#23ce6b]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
