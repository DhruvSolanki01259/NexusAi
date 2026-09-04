interface MessageActionProps {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  label: string;
  onClick?: () => void;
}

export function MessageAction({
  icon: Icon,
  label,
  onClick,
}: MessageActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5f6666] transition-colors hover:bg-[#161a1a] hover:text-[#aeb7ba]"
    >
      <Icon size={15} strokeWidth={1.8} />
    </button>
  );
}
