"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let cancelled = false;

    const renderDiagram = async () => {
      try {
        setError(false);

        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          securityLevel: "strict",

          themeVariables: {
            background: "#0b0d0d",
            primaryColor: "#161a1a",
            primaryTextColor: "#edf5fc",
            primaryBorderColor: "#23ce6b",
            lineColor: "#23ce6b",
            secondaryColor: "#303737",
            tertiaryColor: "#272d2d",
            textColor: "#edf5fc",
            nodeTextColor: "#edf5fc",
            edgeLabelBackground: "#161a1a",
          },
        });

        const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;

        const { svg } = await mermaid.render(id, chart);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      }
    };

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-7 rounded-xl border border-[#d95c5c]/30 bg-[#d95c5c]/6 p-5">
        <p className="text-sm font-medium text-[#e8a0a0]">
          Unable to render this diagram.
        </p>

        <pre className="mt-3 overflow-x-auto text-xs leading-5 text-[#aeb7ba]">
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-[#414949] bg-[#0b0d0d] p-5 sm:p-8">
      <div
        ref={containerRef}
        className="flex min-h-45 items-center justify-center [&_svg]:h-auto [&_svg]:max-w-full"
      />
    </div>
  );
}
