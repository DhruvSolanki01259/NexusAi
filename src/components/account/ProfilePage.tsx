"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Brain,
  LogOut,
  Mail,
  MessageSquare,
  Settings,
  Shield,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { authClient } from "@/lib/authentication/auth-client";

import { ProfileSkeleton } from "../profile/ProfileSkeleton";
import { SectionHeading } from "../settings/SectionHeading";
import { StatCard } from "../profile/StatCard";
import { AccountLink } from "../profile/AccountLink";
import { DeleteDialog } from "../profile/DeleteDailog";

interface ProfileStatsResponse {
  success: boolean;
  message: string;
  data?: {
    total_conversations: number;
    personalization: boolean;
  };
}

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [totalConversations, setTotalConversations] = useState(0);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    const userId = session?.user?.id;

    if (isPending || !userId) {
      return;
    }

    let cancelled = false;

    const fetchProfileStats = async () => {
      setIsStatsLoading(true);

      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        const result: ProfileStatsResponse = await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(
            result.message || "Failed to fetch profile statistics.",
          );
        }

        if (cancelled) {
          return;
        }

        setTotalConversations(result.data.total_conversations);
        setPersonalizationEnabled(result.data.personalization);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to fetch profile statistics:", error);

        setTotalConversations(0);
        setPersonalizationEnabled(false);
      } finally {
        if (!cancelled) {
          setIsStatsLoading(false);
        }
      }
    };

    fetchProfileStats();

    return () => {
      cancelled = true;
    };
  }, [isPending, session?.user?.id]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

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

  const handleDeleteAccount = async () => {
    if (isDeletingAccount) {
      return;
    }

    setIsDeletingAccount(true);

    try {
      // Delete all user messages
      const messagesResponse = await fetch("/api/messages", {
        method: "DELETE",
      });

      if (!messagesResponse.ok) {
        let message = "Unable to delete your messages.";

        try {
          const data = await messagesResponse.json();
          message = data?.error || data?.message || message;
        } catch {}

        throw new Error(message);
      }

      // Delete all user conversations
      const conversationsResponse = await fetch("/api/conversations", {
        method: "DELETE",
      });

      if (!conversationsResponse.ok) {
        let message = "Unable to delete your conversations.";

        try {
          const data = await conversationsResponse.json();
          message = data?.error || data?.message || message;
        } catch {}

        throw new Error(message);
      }

      // Delete all user settings
      const settingsResponse = await fetch("/api/settings", {
        method: "DELETE",
      });

      if (!settingsResponse.ok) {
        let message = "Unable to delete your settings.";

        try {
          const data = await settingsResponse.json();
          message = data?.error || data?.message || message;
        } catch {}

        throw new Error(message);
      }

      // Delete the authenticated user
      const { error } = await authClient.deleteUser();

      if (error) {
        const message = error.message?.toLowerCase() || "";

        if (
          message.includes("fresh") ||
          message.includes("session") ||
          message.includes("reauth")
        ) {
          throw new Error(
            "For security, please sign in again and then try deleting your account.",
          );
        }

        throw new Error(error.message || "Unable to delete your account.");
      }

      setIsDeleteOpen(false);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Delete account error:", error);

      throw error;
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (isPending) {
    return <ProfileSkeleton />;
  }

  const user = session?.user;

  const name = user?.name || "User";
  const email = user?.email || "";
  const initial = name.charAt(0).toUpperCase();

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

        {/* Profile */}
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

        {/* Overview */}
        <section className="mt-10">
          <SectionHeading
            title="Overview"
            description="A quick look at your NEXUS account."
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <StatCard
              icon={MessageSquare}
              label="Total conversations"
              value={isStatsLoading ? "..." : totalConversations.toString()}
            />

            <StatCard
              icon={Brain}
              label="Personalization"
              value={
                isStatsLoading
                  ? "..."
                  : personalizationEnabled
                    ? "Enabled"
                    : "Disabled"
              }
              indicator={isStatsLoading ? undefined : personalizationEnabled}
            />
          </div>
        </section>

        {/* Preferences */}
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
              value={
                isStatsLoading
                  ? "..."
                  : personalizationEnabled
                    ? "Enabled"
                    : "Disabled"
              }
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

        {/* Security & Privacy */}
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

        {/* Account */}
        <section className="mt-10">
          <SectionHeading
            title="Account"
            description="Manage your NEXUS account."
          />

          <div className="mt-4 overflow-hidden rounded-2xl border border-[#414949] bg-[#161a1a]">
            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut || isDeletingAccount}
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

            {/* Delete Account */}
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              disabled={isDeletingAccount}
              className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-[#d95c5c]/6 focus:bg-[#d95c5c]/6 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#d95c5c]/8 text-[#d95c5c]">
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

      {/* Delete Account Dialog */}
      {isDeleteOpen && (
        <DeleteDialog
          onClose={() => {
            if (!isDeletingAccount) {
              setIsDeleteOpen(false);
            }
          }}
          onConfirm={handleDeleteAccount}
          loading={isDeletingAccount}
        />
      )}
    </main>
  );
}

function Divider() {
  return <div className="mx-5 border-t border-[#303737]" />;
}
