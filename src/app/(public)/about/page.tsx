import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Persistent Memory",
    description:
      "NEXUS AI is designed to retain relevant information across conversations, allowing interactions to become more contextual and useful over time.",
  },
  {
    number: "02",
    title: "Reasoning",
    description:
      "The system can break down complex requests, evaluate context, and determine appropriate steps needed to produce useful responses.",
  },
  {
    number: "03",
    title: "Tool Usage",
    description:
      "NEXUS AI can work with external tools and services, allowing the assistant to move beyond simple text generation.",
  },
  {
    number: "04",
    title: "Context Awareness",
    description:
      "The application focuses on understanding conversations as an ongoing interaction rather than treating every message as an isolated request.",
  },
];

const technologies = [
  {
    name: "Next.js",
    description: "Application framework",
  },
  {
    name: "TypeScript",
    description: "Type-safe development",
  },
  {
    name: "LangChain",
    description: "LLM application framework",
  },
  {
    name: "LangGraph",
    description: "Agentic workflow orchestration",
  },
  {
    name: "Groq AI",
    description: "High-performance AI inference",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#272d2d]">
      <section className="relative overflow-hidden border-b border-[#414949] bg-[#0b0d0d]">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#23ce6b]/[0.045] blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center lg:px-8 lg:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#414949] bg-[#161a1a] px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#23ce6b]" />

            <span className="text-xs font-medium text-[#aeb7ba]">
              About NEXUS AI
            </span>
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-[#edf5fc] sm:text-5xl lg:text-6xl">
            An AI assistant that{" "}
            <span className="text-[#23ce6b]">remembers and reasons.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#c2c8ce] sm:text-lg">
            NEXUS AI is a memory-augmented AI assistant built to make
            conversations more contextual, reasoning more structured, and
            interactions with AI more useful over time.
          </p>
        </div>
      </section>

      <section className="bg-[#272d2d]">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8585]">
                The Project
              </span>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#edf5fc] sm:text-4xl">
                More than a chatbot.
              </h2>

              <div className="mt-6 h-px w-16 bg-[#23ce6b]" />
            </div>

            <div className="space-y-6 text-[15px] leading-7 text-[#c2c8ce]">
              <p>
                Traditional AI assistants often treat conversations as isolated
                interactions. Once a conversation ends, important context can
                disappear, forcing users to repeatedly explain their
                preferences, goals, and previous decisions.
              </p>

              <p>
                NEXUS AI explores a different approach. The project combines
                conversational AI with memory, structured workflows, reasoning,
                and tool usage to create an assistant that can maintain useful
                context and respond more intelligently to ongoing interactions.
              </p>

              <p>
                The goal is not simply to generate better text. NEXUS AI is
                designed around the idea of an assistant that can understand
                context, reason about a task, remember relevant information, and
                use available capabilities when appropriate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#414949] bg-[#0b0d0d]">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8585]">
              Core capabilities
            </span>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#edf5fc] sm:text-4xl">
              Designed around useful intelligence.
            </h2>

            <p className="mt-5 text-sm leading-6 text-[#9ba3a5]">
              The architecture is centered around memory, reasoning, context,
              and the ability to interact with tools.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="group rounded-2xl border border-[#414949] bg-[#161a1a] p-7 transition-all duration-200 hover:border-[#23ce6b]/30 hover:bg-[#1b2020]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#303737] text-sm font-semibold text-[#23ce6b]">
                    N
                  </div>

                  <span className="font-mono text-xs text-[#697171]">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-7 text-lg font-semibold text-[#edf5fc]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#aeb7ba]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#272d2d]">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8585]">
                Under the hood
              </span>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#edf5fc] sm:text-4xl">
                Built with modern AI infrastructure.
              </h2>

              <p className="mt-6 text-[15px] leading-7 text-[#c2c8ce]">
                NEXUS AI uses Next.js and TypeScript for the application layer,
                while LangChain and LangGraph provide the foundation for AI
                workflows, reasoning, memory, and tool-oriented execution. Groq
                AI provides high-performance model inference for the assistant.
              </p>
            </div>

            <div className="rounded-3xl border border-[#414949] bg-[#0b0d0d] p-5">
              <div className="space-y-2">
                {technologies.map((technology) => (
                  <div
                    key={technology.name}
                    className="flex items-center justify-between rounded-xl border border-[#303737] bg-[#161a1a] px-5 py-4"
                  >
                    <span className="text-sm font-medium text-[#edf5fc]">
                      {technology.name}
                    </span>

                    <span className="hidden text-xs text-[#7f8585] sm:block">
                      {technology.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#414949] bg-[#0b0d0d]">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8 lg:py-32">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8585]">
            The vision
          </span>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#edf5fc] sm:text-4xl">
            AI should understand the conversation,
            <br className="hidden sm:block" />
            not just the message.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#9ba3a5] sm:text-base">
            NEXUS AI explores what happens when language understanding is
            combined with memory, reasoning, workflows, and tools.
          </p>

          <Link
            href="/"
            className="mt-9 inline-flex rounded-full bg-[#23ce6b] px-6 py-3 text-sm font-semibold text-[#101512] transition-all hover:bg-[#32dc79] hover:shadow-[0_0_28px_rgba(35,206,107,0.18)]"
          >
            Explore NEXUS AI
          </Link>
        </div>
      </section>
    </div>
  );
}
