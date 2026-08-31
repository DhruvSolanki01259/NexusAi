"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Mermaid from "./Mermaid";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="nexus-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-8 border-b border-[#414949] pb-5 text-3xl font-semibold tracking-[-0.03em] text-[#edf5fc] sm:text-4xl">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-5 mt-14 text-2xl font-semibold tracking-[-0.02em] text-[#edf5fc] sm:text-3xl">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-4 mt-10 text-xl font-semibold text-[#edf5fc]">
              {children}
            </h3>
          ),

          h4: ({ children }) => (
            <h4 className="mb-3 mt-8 text-lg font-semibold text-[#dce4e8]">
              {children}
            </h4>
          ),

          p: ({ children }) => (
            <p className="my-5 text-[15px] leading-7 text-[#aeb7ba]">
              {children}
            </p>
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#23ce6b] underline decoration-[#23ce6b]/30 underline-offset-4 transition-colors hover:text-[#32dc79] hover:decoration-[#32dc79]"
            >
              {children}
            </a>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-[#edf5fc]">{children}</strong>
          ),

          em: ({ children }) => <em className="text-[#c2c8ce]">{children}</em>,

          ul: ({ children }) => (
            <ul className="my-6 space-y-3 pl-6 text-[15px] leading-7 text-[#aeb7ba] marker:text-[#23ce6b]">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="my-6 space-y-3 pl-6 text-[15px] leading-7 text-[#aeb7ba] marker:font-semibold marker:text-[#23ce6b]">
              {children}
            </ol>
          ),

          li: ({ children }) => <li className="pl-1">{children}</li>,

          blockquote: ({ children }) => (
            <blockquote className="my-7 border-l-2 border-[#23ce6b] bg-[#161a1a] px-5 py-4 text-[#aeb7ba]">
              {children}
            </blockquote>
          ),

          code: ({ className, children }) => {
            const language = className?.replace("language-", "");

            /*
             * Mermaid is handled separately.
             */
            if (language === "mermaid") {
              return <Mermaid chart={String(children).trim()} />;
            }

            return (
              <code className="rounded-md border border-[#414949] bg-[#161a1a] px-1.5 py-0.5 font-mono text-[0.85em] text-[#23ce6b]">
                {children}
              </code>
            );
          },

          pre: ({ children }) => (
            <pre className="my-7 overflow-x-auto rounded-xl border border-[#414949] bg-[#0b0d0d] p-5 font-mono text-[13px] leading-6 text-[#c2c8ce] shadow-inner">
              {children}
            </pre>
          ),

          hr: () => <hr className="my-12 border-0 border-t border-[#414949]" />,

          table: ({ children }) => (
            <div className="my-8 overflow-x-auto rounded-xl border border-[#414949]">
              <table className="w-full min-w-150 border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-[#161a1a] text-[#edf5fc]">{children}</thead>
          ),

          tbody: ({ children }) => (
            <tbody className="divide-y divide-[#414949] bg-[#303737]">
              {children}
            </tbody>
          ),

          tr: ({ children }) => (
            <tr className="transition-colors hover:bg-[#383f3f]">{children}</tr>
          ),

          th: ({ children }) => (
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#c2c8ce]">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="px-4 py-3 text-sm leading-6 text-[#aeb7ba]">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
