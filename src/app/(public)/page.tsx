import Link from "next/link";

const capabilities = [
  {
    title: "Remember",
    description:
      "Keeps relevant context from your conversations so you don't have to repeat yourself.",
  },
  {
    title: "Reason",
    description:
      "Breaks down complex requests and works through them using structured AI workflows.",
  },
  {
    title: "Use tools",
    description:
      "Connects reasoning with tools and external capabilities to get more than just a text response.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-[#272d2d] text-[#edf5fc]">
      <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#0b0d0d]">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-125 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#23ce6b]/4.5 blur-[130px]" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#edf5fc 1px, transparent 1px), linear-gradient(90deg, #edf5fc 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center justify-center px-6 py-24 lg:px-8">
          <div className="max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#414949] bg-[#161a1a] px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#23ce6b]" />

              <span className="text-xs font-medium text-[#aeb7ba]">
                Memory-augmented AI assistant
              </span>
            </div>

            <h1 className="mt-8 text-5xl font-semibold tracking-tighter text-[#edf5fc] sm:text-6xl lg:text-7xl">
              AI that remembers.
              <br />
              <span className="text-[#23ce6b]">AI that reasons.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#aeb7ba] sm:text-lg">
              NEXUS AI is an intelligent assistant built to remember useful
              context, reason through complex tasks, and use tools to help you
              get things done.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/chat"
                className="rounded-full bg-[#23ce6b] px-7 py-3.5 text-sm font-bold text-[#0b0d0d] transition-all duration-200 hover:bg-[#32dc79] hover:shadow-[0_0_32px_rgba(35,206,107,0.2)]"
              >
                Get Started
              </Link>

              <Link
                href="/about"
                className="rounded-full border border-[#23ce6b] bg-transparent px-7 py-3.5 text-sm font-semibold text-[#23ce6b] transition-all duration-200 hover:bg-[#23ce6b]/8 hover:text-[#32dc79] hover:shadow-[0_0_24px_rgba(35,206,107,0.08)]"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#272d2d] to-transparent" />
      </section>

      <section className="border-y border-[#414949] bg-[#272d2d]">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8585]">
              What makes NEXUS different
            </span>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#edf5fc] sm:text-4xl">
              Built for conversations that go further.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {capabilities.map((capability, index) => (
              <div
                key={capability.title}
                className="rounded-2xl border border-[#414949] bg-[#303737] p-7 transition-all duration-200 hover:border-[#23ce6b]/30 hover:bg-[#383f3f]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b0d0d] font-mono text-xs font-medium text-[#23ce6b]">
                  0{index + 1}
                </div>

                <h3 className="mt-7 text-lg font-semibold text-[#edf5fc]">
                  {capability.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#aeb7ba]">
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0b0d0d]">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8 lg:py-28">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#23ce6b] text-lg font-bold text-[#0b0d0d]">
            N
          </div>

          <h2 className="mt-7 text-3xl font-semibold tracking-tight text-[#edf5fc] sm:text-4xl">
            Meet your next AI assistant.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#9ba3a5] sm:text-base">
            Give NEXUS AI a task, a question, or a problem. Let it remember the
            context and figure out what comes next.
          </p>

          <Link
            href="/chat"
            className="mt-8 inline-flex rounded-full bg-[#23ce6b] px-7 py-3.5 text-sm font-bold text-[#0b0d0d] transition-all duration-200 hover:bg-[#32dc79] hover:shadow-[0_0_32px_rgba(35,206,107,0.2)]"
          >
            Start using NEXUS AI
          </Link>
        </div>
      </section>
    </div>
  );
}
