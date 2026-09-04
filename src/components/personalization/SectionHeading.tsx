export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-[#edf5fc]">{title}</h2>

      <p className="mt-1 text-xs leading-5 text-[#697171]">{description}</p>
    </div>
  );
}
