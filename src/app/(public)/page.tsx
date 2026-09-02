import { getSession } from "@/lib/authentication/session";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Check,
  MessageSquare,
  Sparkles,
  Wrench,
} from "lucide-react";

interface User {
  name?: string | null;
  email?: string | null;
}

const capabilities = [
  {
    icon: Brain,
    title: "Remember",
    description:
      "NEXUS keeps relevant context from your conversations so you can spend less time repeating yourself.",
  },
  {
    icon: Sparkles,
    title: "Reason",
    description:
      "Complex requests are broken down into structured steps so NEXUS can work through problems more effectively.",
  },
  {
    icon: Wrench,
    title: "Use tools",
    description:
      "Connect reasoning with tools and external capabilities to move from answering questions to getting things done.",
  },
];

const quickActions = [
  {
    icon: MessageSquare,
    title: "Start a conversation",
    description: "Ask a question, explore an idea, or give NEXUS a task.",
    href: "/chat",
  },
  {
    icon: Brain,
    title: "Explore memory",
    description:
      "See how NEXUS manages conversation context and long-term memory.",
    href: "/memory",
  },
  {
    icon: Wrench,
    title: "Explore tools",
    description: "See how NEXUS uses tools through its agentic workflow.",
    href: "/tools",
  },
];

export default async function LandingPage() {
  const session = await getSession();
  const user = session?.user;

  return (
    <main className="bg-[#272d2d] text-[#edf5fc]">
      {user ? <AuthenticatedLanding user={user} /> : <PublicLanding />}
    </main>
  );
}

function PublicLanding() {
  return (
    <>
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
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-[#23ce6b] px-7 py-3.5 text-sm font-bold text-[#0b0d0d] transition-all duration-200 hover:bg-[#32dc79] hover:shadow-[0_0_32px_rgba(35,206,107,0.2)]"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/about"
                className="rounded-full border border-[#23ce6b] bg-transparent px-7 py-3.5 text-sm font-semibold text-[#23ce6b] transition-all duration-200 hover:bg-[#23ce6b]/8 hover:text-[#32dc79]"
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
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;

              return (
                <div
                  key={capability.title}
                  className="rounded-2xl border border-[#414949] bg-[#303737] p-7 transition-all duration-200 hover:border-[#23ce6b]/30 hover:bg-[#383f3f]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b0d0d] text-[#23ce6b]">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>

                  <div className="mt-6 font-mono text-[11px] text-[#697171]">
                    0{index + 1}
                  </div>

                  <h3 className="mt-2 text-lg font-semibold text-[#edf5fc]">
                    {capability.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#aeb7ba]">
                    {capability.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0b0d0d]">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8 lg:py-28">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#23ce6b] text-lg font-bold text-[#0b0d0d]">
            N
          </div>

          <h2 className="mt-7 text-3xl font-semibold tracking-tight text-[#edf5fc] sm:text-4xl">
            Start a conversation with NEXUS.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#9ba3a5] sm:text-base">
            Create your account and give NEXUS AI the context it needs to become
            a more useful assistant.
          </p>

          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#23ce6b] px-7 py-3.5 text-sm font-bold text-[#000000] transition-all duration-200 hover:bg-[#32dc79] hover:shadow-[0_0_32px_rgba(35,206,107,0.2)]"
          >
            Create your account
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

function AuthenticatedLanding({ user }: { user: User }) {
  const displayName =
    user.name?.split(" ")[0] || user.email?.split("@")[0] || "there";

  return (
    <>
      <section className="relative overflow-hidden bg-[#0b0d0d]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#edf5fc 1px, transparent 1px), linear-gradient(90deg, #edf5fc 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="pointer-events-none absolute -right-30 -top-45 h-125 w-125 rounded-full bg-[#23ce6b]/[0.035] blur-[120px]" />

        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#414949] bg-[#161a1a] px-3.5 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#23ce6b]" />

              <span className="text-xs font-medium text-[#aeb7ba]">
                NEXUS workspace
              </span>
            </div>

            <h1 className="mt-7 text-4xl font-semibold tracking-tight text-[#edf5fc] sm:text-5xl">
              Welcome back,{" "}
              <span className="text-[#23ce6b]">{displayName}.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#aeb7ba]">
              Your conversations, context, and AI workflows are ready. Pick up
              where you left off or start something new.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#23ce6b] px-7 py-3.5 text-sm font-bold text-[#0b0d0d] transition-all hover:bg-[#32dc79] hover:shadow-[0_0_32px_rgba(35,206,107,0.2)]"
              >
                Open NEXUS
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-[#414949] bg-[#161a1a] px-7 py-3.5 text-sm font-medium text-[#c2c8ce] transition-colors hover:border-[#596262] hover:text-[#edf5fc]"
              >
                About NEXUS
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#414949] bg-[#272d2d]">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8585]">
              Your workspace
            </span>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#edf5fc] sm:text-3xl">
              What would you like to do?
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-2xl border border-[#414949] bg-[#303737] p-6 transition-all duration-200 hover:border-[#23ce6b]/30 hover:bg-[#383f3f]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b0d0d] text-[#23ce6b]">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[#edf5fc]">
                      {action.title}
                    </h3>

                    <ArrowRight
                      size={16}
                      className="text-[#697171] transition-transform group-hover:translate-x-1 group-hover:text-[#23ce6b]"
                    />
                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#aeb7ba]">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0b0d0d]">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8585]">
                Built around you
              </span>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#edf5fc]">
                Your assistant gets more useful over time.
              </h2>

              <p className="mt-5 text-sm leading-6 text-[#9ba3a5]">
                NEXUS combines persistent context, structured reasoning, and
                tools to create a more capable AI workspace.
              </p>
            </div>

            <div className="space-y-3">
              {[
                "Relevant conversation context",
                "Structured reasoning workflows",
                "Tool-enabled AI capabilities",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-[#303737] bg-[#161a1a] px-5 py-4"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#23ce6b]/10 text-[#23ce6b]">
                    <Check size={14} strokeWidth={2.5} />
                  </div>

                  <span className="text-sm text-[#c2c8ce]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
