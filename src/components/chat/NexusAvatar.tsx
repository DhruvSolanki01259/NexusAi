type NexusAvatarProps = {
  size?: "sm" | "md" | "lg";
};

export function NexusAvatar({ size = "md" }: NexusAvatarProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm",
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg bg-[#23ce6b] font-bold text-[#0b0d0d] shadow-[0_0_20px_rgba(35,206,107,0.08)] ${sizeClasses[size]}`}
    >
      N
    </div>
  );
}
