import Link from "next/link";

type AuthMode = "login" | "signup";
interface AuthSidePanelProps {
  mode: AuthMode;
}

const content = {
  login: {
    eyebrow: "YOUR AI WORKSPACE",
    title: (
      <>
        Continue where your
        <span className="text-[#23ce6b]"> context </span>
        left off.
      </>
    ),
    description:
      "Sign in to access NEXUS AI and continue conversations with an assistant designed to remember useful context, reason through tasks, and work with tools.",
    features: [
      {
        number: "01",
        title: "Memory",
        description: "Keep useful context available.",
      },
      {
        number: "02",
        title: "Reasoning",
        description: "Work through complex requests.",
      },
      {
        number: "03",
        title: "Tools",
        description: "Connect reasoning with actions.",
      },
    ],
    footer: "Intelligent assistance, connected.",
  },

  signup: {
    eyebrow: "START YOUR WORKSPACE",
    title: (
      <>
        Give your conversations
        <span className="text-[#23ce6b]"> continuity.</span>
      </>
    ),
    description:
      "Create your NEXUS AI account and build a persistent workspace where your conversations, context, and AI workflows can come together.",
    features: [
      {
        number: "01",
        title: "Remember",
        description: "Keep useful context available.",
      },
      {
        number: "02",
        title: "Reason",
        description: "Work through complex requests.",
      },
      {
        number: "03",
        title: "Connect",
        description: "Use tools when they matter.",
      },
    ],
    footer: "Built for context-aware assistance.",
  },
};

export default function AuthSidePanel({ mode }: AuthSidePanelProps) {
  const current = content[mode];

  return (
    <section className="relative hidden w-1/2 flex-col justify-between border-[#303737] px-12 py-10 lg:flex xl:px-20">
      <div>
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#23ce6b] text-sm font-bold text-[#0b0d0d]">
            N
          </div>

          <span className="text-sm font-semibold tracking-tight text-[#edf5fc]">
            NEXUS AI
          </span>
        </Link>

        <div className="mt-28 max-w-lg">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#23ce6b]" />

            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#7f8585]">
              {current.eyebrow}
            </span>
          </div>

          <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#edf5fc] xl:text-5xl">
            {current.title}
          </h2>

          <p className="mt-6 max-w-md text-sm leading-7 text-[#9ba3a5]">
            {current.description}
          </p>
        </div>

        <div className="mt-12 grid max-w-lg grid-cols-3 gap-3">
          {current.features.map((feature) => (
            <div
              key={feature.number}
              className="rounded-2xl border border-[#303737] bg-[#111414] p-4"
            >
              <span className="font-mono text-[10px] text-[#23ce6b]">
                {feature.number}
              </span>

              <h3 className="mt-3 text-sm font-semibold text-[#edf5fc]">
                {feature.title}
              </h3>

              <p className="mt-1.5 text-[11px] leading-4 text-[#697171]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#697171]">
        <span>NEXUS AI</span>

        <span>{current.footer}</span>
      </div>
    </section>
  );
}
