export function MessageContent({ content }: { content: string }) {
  const paragraphs = content.split("\n\n");

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => {
        if (paragraph.startsWith("- ")) {
          const items = paragraph
            .split("\n")
            .filter(Boolean)
            .map((item) => item.replace(/^-\s*/, ""));

          return (
            <ul key={index} className="list-disc space-y-1.5 pl-5">
              {items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInlineFormatting(item)}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{renderInlineFormatting(paragraph)}</p>;
      })}
    </div>
  );
}

function renderInlineFormatting(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-[#edf5fc]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={index}>{part}</span>;
  });
}
