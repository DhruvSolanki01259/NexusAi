import fs from "fs";
import path from "path";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";

export const metadata = {
  title: "Tools | NEXUS AI",
  description:
    "Learn how NEXUS AI uses tools with LangChain and LangGraph to interact with external capabilities and perform actions.",
};

export default function ToolsPage() {
  const filePath = path.join(process.cwd(), "content", "blogs", "tools.md");

  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <main className="min-h-screen bg-[#272d2d]">
      <section className="relative overflow-hidden border-b border-[#414949] bg-[#0b0d0d]">
        <div className="pointer-events-none absolute left-1/2 top-0 h-125 w-175 -translate-x-1/2 rounded-full bg-[#23ce6b]/[0.035] blur-[130px]" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#edf5fc 1px, transparent 1px), linear-gradient(90deg, #edf5fc 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#414949] bg-[#161a1a] px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#23ce6b]" />

              <span className="text-xs font-medium text-[#aeb7ba]">
                NEXUS AI · Tools
              </span>
            </div>

            <h1 className="mt-7 text-4xl font-semibold tracking-[-0.04em] text-[#edf5fc] sm:text-5xl lg:text-6xl">
              How NEXUS AI
              <span className="block text-[#23ce6b]">uses tools.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#aeb7ba] sm:text-lg">
              Explore how NEXUS AI uses LangChain tools and LangGraph workflows
              to move beyond generating text and interact with external
              capabilities.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#272d2d]">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
          <article className="rounded-2xl border border-[#414949] bg-[#303737] p-6 shadow-2xl shadow-black/10 sm:p-8 lg:p-12">
            <MarkdownRenderer content={content} />
          </article>
        </div>
      </section>
    </main>
  );
}
