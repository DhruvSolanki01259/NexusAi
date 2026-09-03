"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Brain,
  ChevronRight,
  LogOut,
  Mail,
  MessageSquare,
  Settings,
  Shield,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { authClient } from "@/lib/authentication/auth-client";

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (isPending) {
    return <ProfileSkeleton />;
  }

  const user = session?.user;

  const name = user?.name || "User";
  const email = user?.email || "";
  const initial = name.charAt(0).toUpperCase();

  const totalConversations = 0;
  const personalizationEnabled = true;

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="min-h-dvh overflow-y-auto bg-[#0b0d0d] text-[#edf5fc]">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 lg:py-14">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#23ce6b]">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
            Profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#697171]">
            Manage your NEXUS account and preferences.
          </p>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-[#414949] bg-[#161a1a]">
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-7">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#303737] text-2xl font-semibold text-[#23ce6b]">
              {initial}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-semibold text-[#edf5fc]">
                {name}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-[#8f999b]">
                <Mail size={15} strokeWidth={1.8} />
                <span className="truncate">{email}</span>
              </div>
            </div>

            <Link
              href="/profile/settings"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#414949] bg-[#0f1212] px-4 text-sm font-medium text-[#aeb7ba] transition-colors hover:bg-[#303737] hover:text-[#edf5fc] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/20"
            >
              <Settings size={16} strokeWidth={1.8} />
              Settings
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <SectionHeading
            title="Overview"
            description="A quick look at your NEXUS account."
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <StatCard
              icon={MessageSquare}
              label="Total conversations"
              value={totalConversations.toString()}
            />

            <StatCard
              icon={Brain}
              label="Personalization"
              value={personalizationEnabled ? "Enabled" : "Disabled"}
              indicator={personalizationEnabled}
            />
          </div>
        </section>

        <section className="mt-10">
          <SectionHeading
            title="Preferences"
            description="Customize how NEXUS works for you."
          />

          <div className="mt-4 overflow-hidden rounded-2xl border border-[#414949] bg-[#161a1a]">
            <AccountLink
              href="/profile/settings/personalization"
              icon={Brain}
              title="Personalization"
              description="Tell NEXUS about your preferences, communication style, and how you want responses."
              value={personalizationEnabled ? "Enabled" : "Disabled"}
            />
            <Divider />

            <AccountLink
              href="/profile/settings"
              icon={Settings}
              title="All settings"
              description="Manage your NEXUS application and account preferences."
            />
          </div>
        </section>

        <section className="mt-10">
          <SectionHeading
            title="Security & privacy"
            description="Manage your account security and privacy preferences."
          />

          <div className="mt-4 overflow-hidden rounded-2xl border border-[#414949] bg-[#161a1a]">
            <AccountLink
              href="/profile/settings/security"
              icon={ShieldCheck}
              title="Account security"
              description="Manage your password, sessions, and account security."
            />

            <Divider />

            <AccountLink
              href="/privacy"
              icon={Shield}
              title="Privacy"
              description="Manage your data, personalization, and privacy preferences."
            />
          </div>
        </section>

        <section className="mt-10">
          <SectionHeading
            title="Account"
            description="Manage your NEXUS account."
          />

          <div className="mt-4 overflow-hidden rounded-2xl border border-[#414949] bg-[#161a1a]">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-[#303737] focus:bg-[#303737] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#303737] text-[#aeb7ba]">
                <LogOut size={17} strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#edf5fc]">
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </p>

                <p className="mt-1 text-xs text-[#697171]">
                  Sign out of your NEXUS account.
                </p>
              </div>
            </button>

            <Divider />

            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-[#d95c5c]/[0.06] focus:bg-[#d95c5c]/[0.06] focus:outline-none"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#d95c5c]/[0.08] text-[#d95c5c]">
                <Trash2 size={17} strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#d95c5c]">
                  Delete account
                </p>

                <p className="mt-1 text-xs text-[#697171]">
                  Permanently delete your account and associated data.
                </p>
              </div>
            </button>
          </div>
        </section>

        <p className="mt-10 text-center text-[11px] text-[#5f6666]">
          NEXUS AI · Account & preferences
        </p>
      </div>

      {isDeleteOpen && <DeleteDialog onClose={() => setIsDeleteOpen(false)} />}
    </main>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-[#edf5fc]">{title}</h2>

      <p className="mt-1 text-xs leading-5 text-[#697171]">{description}</p>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  indicator,
}: {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  label: string;
  value: string;
  indicator?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#414949] bg-[#161a1a] p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#303737] text-[#23ce6b]">
          <Icon size={17} strokeWidth={1.8} />
        </div>

        {indicator !== undefined && (
          <span
            className={`flex items-center gap-1.5 text-xs ${
              indicator ? "text-[#23ce6b]" : "text-[#697171]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                indicator ? "bg-[#23ce6b]" : "bg-[#697171]"
              }`}
            />

            {indicator ? "Active" : "Off"}
          </span>
        )}
      </div>

      <p className="mt-5 text-2xl font-semibold tracking-tight text-[#edf5fc]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#697171]">{label}</p>
    </div>
  );
}

function AccountLink({
  href,
  icon: Icon,
  title,
  description,
  value,
}: {
  href: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  title: string;
  description: string;
  value?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 p-5 transition-colors hover:bg-[#303737] focus:bg-[#303737] focus:outline-none"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#303737] text-[#23ce6b] transition-colors group-hover:bg-[#26342d]">
        <Icon size={17} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#edf5fc]">{title}</p>

        <p className="mt-1 max-w-xl text-xs leading-5 text-[#697171]">
          {description}
        </p>
      </div>

      {value && (
        <span className="hidden shrink-0 text-xs text-[#23ce6b] sm:block">
          {value}
        </span>
      )}

      <ChevronRight
        size={16}
        strokeWidth={1.8}
        className="shrink-0 text-[#5f6666] transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-[#8b9494]"
      />
    </Link>
  );
}

function Divider() {
  return <div className="mx-5 border-t border-[#303737]" />;
}

function DeleteDialog({ onClose }: { onClose: () => void }) {
  const handleAccountDeletion = async () => {
    console.log("Deleting Account");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#414949] bg-[#161a1a] p-6 shadow-2xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d95c5c]/8 text-[#d95c5c]">
          <Trash2 size={19} strokeWidth={1.8} />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-[#edf5fc]">
          Delete your account?
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#697171]">
          This permanently removes your NEXUS account and associated data. This
          action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-[#414949] bg-[#0f1212] px-4 text-sm font-medium text-[#aeb7ba] transition-colors hover:bg-[#303737] hover:text-[#edf5fc] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/20"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAccountDeletion}
            className="h-10 rounded-xl bg-[#d95c5c] px-4 text-sm font-medium text-[#0b0d0d] transition-colors hover:bg-[#e8a0a0] focus:outline-none focus:ring-2 focus:ring-[#d95c5c]/20"
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <main className="min-h-dvh bg-[#0b0d0d] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl animate-pulse">
        <div className="h-3 w-16 rounded bg-[#303737]" />

        <div className="mt-3 h-9 w-32 rounded bg-[#303737]" />

        <div className="mt-2 h-4 w-64 rounded bg-[#161a1a]" />

        <div className="mt-8 h-32 rounded-2xl bg-[#161a1a]" />

        <div className="mt-10 h-5 w-24 rounded bg-[#303737]" />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="h-32 rounded-2xl bg-[#161a1a]" />
          <div className="h-32 rounded-2xl bg-[#161a1a]" />
        </div>
      </div>
    </main>
  );
}
