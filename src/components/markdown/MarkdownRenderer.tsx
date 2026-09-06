"use client";

import Image from "next/image";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import Mermaid from "./Mermaid";

interface MarkdownRendererProps {
  content: string;
}

function normalizeMarkdown(content: string): string {
  return content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")

    .replace(/<br\s*\/?>/gi, "\n")

    .replace(/&lt;br\s*\/?&gt;/gi, "\n")

    .replace(/\\n/g, "\n")

    .replace(/[\u200B-\u200D\uFEFF]/g, "")

    .trim();
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-6 text-xl font-semibold leading-7 text-[#edf5fc]">
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="mb-3 mt-6 text-lg font-semibold leading-7 text-[#edf5fc]">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="mb-2 mt-5 text-base font-semibold leading-6 text-[#edf5fc]">
      {children}
    </h3>
  ),

  h4: ({ children }) => (
    <h4 className="mb-2 mt-4 text-sm font-semibold leading-6 text-[#edf5fc]">
      {children}
    </h4>
  ),

  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,

  strong: ({ children }) => (
    <strong className="font-semibold text-[#edf5fc]">{children}</strong>
  ),

  em: ({ children }) => <em className="italic">{children}</em>,

  del: ({ children }) => (
    <del className="text-[#697171] line-through">{children}</del>
  ),

  a: ({ href, children, ...props }) => (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#23ce6b] underline underline-offset-2 transition hover:text-[#32db79]"
    >
      {children}
    </a>
  ),

  ul: ({ children }) => (
    <ul className="my-3 ml-5 list-disc space-y-1">{children}</ul>
  ),

  ol: ({ children }) => (
    <ol className="my-3 ml-5 list-decimal space-y-1">{children}</ol>
  ),

  li: ({ children }) => <li className="pl-1">{children}</li>,

  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-[#414949] pl-4 italic text-[#8f9a9a]">
      {children}
    </blockquote>
  ),

  hr: () => <hr className="my-6 border-[#303737]" />,

  br: () => <br />,

  table: ({ children }) => (
    <div className="my-5 w-full overflow-x-auto rounded-xl border border-[#303737]">
      <table className="w-full min-w-150 border-collapse text-left text-xs">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }) => <thead className="bg-[#161a1a]">{children}</thead>,

  tbody: ({ children }) => <tbody>{children}</tbody>,

  tr: ({ children }) => <tr className="even:bg-[#101313]">{children}</tr>,

  th: ({ children }) => (
    <th className="border border-[#303737] px-3 py-2.5 font-semibold text-[#edf5fc]">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="border border-[#303737] px-3 py-2.5 align-top text-[#cbd5dc]">
      {children}
    </td>
  ),

  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-xl border border-[#303737] bg-[#111515] p-4">
      {children}
    </pre>
  ),

  code: ({ className, children, ...props }) => {
    const code = String(children);

    const language = className?.match(/language-([\w-]+)/)?.[1];

    if (language === "mermaid" || language === "mermaid-diagram") {
      return <Mermaid chart={code.trim()} />;
    }

    const isBlock = Boolean(className) || code.includes("\n");

    if (isBlock) {
      return (
        <code
          {...props}
          className={`${className ?? ""} font-mono text-xs leading-5 text-[#d7e0e5]`}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        {...props}
        className="rounded-md border border-[#303737] bg-[#111515] px-1.5 py-0.5 font-mono text-[0.85em] text-[#edf5fc]"
      >
        {children}
      </code>
    );
  },

  img: ({ src, alt }) => {
    if (!src || typeof src !== "string") {
      return null;
    }

    return (
      <span className="my-5 block overflow-hidden rounded-xl border border-[#303737] bg-[#0f1313]">
        <Image
          src={src}
          alt={alt ?? ""}
          width={1200}
          height={800}
          unoptimized
          className="h-auto max-h-150 w-auto max-w-full object-contain"
        />
      </span>
    );
  },

  input: ({ checked, disabled, type }) => {
    if (type !== "checkbox") {
      return null;
    }

    return (
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        readOnly
        className="mr-2 align-middle accent-[#23ce6b]"
      />
    );
  },
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const normalizedContent = normalizeMarkdown(content);

  return (
    <div className="nexus-markdown wrap-break-word">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}
