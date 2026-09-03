"use client";

import Link from "next/link";

import { ArrowLeft, Brain, ChevronRight, Lock } from "lucide-react";

const accountSettings = [
  {
    icon: Brain,
    title: "Personalization",
    description:
      "Customize how NEXUS communicates with you and uses your preferences.",
    href: "/profile/settings/personalization",
  },
  {
    icon: Lock,
    title: "Security",
    description: "Manage authentication, sessions, and account security.",
    href: "/profile/settings/security",
  },
];

export default function SettingsPage() {
  return (
    <main className="min-h-dvh overflow-y-auto bg-[#0b0d0d] text-[#edf5fc]">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 lg:py-14">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-xs text-[#697171] transition-colors hover:text-[#edf5fc] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/20"
        >
          <ArrowLeft size={15} strokeWidth={1.8} />
          Back to profile
        </Link>

        <div className="mt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#23ce6b]">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
            Settings
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#697171]">
            Manage your NEXUS preferences and account settings.
          </p>
        </div>

        <SettingsSection
          title="Account"
          description="Manage your account and how NEXUS interacts with you."
          settings={accountSettings}
        />

        <p className="mt-10 text-center text-[11px] text-[#4f5757]">
          NEXUS settings
        </p>
      </div>
    </main>
  );
}

function SettingsSection({
  title,
  description,
  settings,
}: {
  title: string;
  description: string;
  settings: {
    icon: React.ComponentType<{
      size?: number;
      strokeWidth?: number;
    }>;
    title: string;
    description: string;
    href: string;
  }[];
}) {
  return (
    <section className="mt-9 first:mt-8 sm:mt-10">
      <div>
        <h2 className="text-sm font-semibold text-[#edf5fc]">{title}</h2>

        <p className="mt-1 text-xs leading-5 text-[#697171]">{description}</p>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[#303737] bg-[#141818]">
        {settings.map((setting, index) => {
          const Icon = setting.icon;

          return (
            <Link
              key={setting.title}
              href={setting.href}
              className={`group flex items-center gap-4 p-4 transition-colors sm:p-5 ${
                index !== settings.length - 1 ? "border-b border-[#303737]" : ""
              } hover:bg-[#191e1e] focus:bg-[#191e1e] focus:outline-none`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#242a2a] text-[#23ce6b] transition-colors group-hover:bg-[#26342d]">
                <Icon size={17} strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#edf5fc]">
                  {setting.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#697171]">
                  {setting.description}
                </p>
              </div>

              <ChevronRight
                size={16}
                strokeWidth={1.8}
                className="shrink-0 text-[#5f6666] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[#8b9494]"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
