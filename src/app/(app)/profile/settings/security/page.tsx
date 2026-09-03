"use client";

import Link from "next/link";

import { ArrowLeft, KeyRound, LogOut, Shield, Trash2 } from "lucide-react";

export default function SecurityPage() {
  const handlePasswordChange = async () => {
    console.log("Change password");
  };

  const handleSignoutSessions = async () => {
    console.log("Sign out other sessions");
  };

  const handleAccountDeletion = async () => {
    console.log("Delete account");
  };

  return (
    <main className="min-h-dvh overflow-y-auto bg-[#0b0d0d] text-[#edf5fc]">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 lg:py-14">
        <Link
          href="/profile/settings"
          className="inline-flex items-center gap-2 text-xs text-[#697171] transition-colors hover:text-[#edf5fc] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/20"
        >
          <ArrowLeft size={15} strokeWidth={1.8} />
          Back to settings
        </Link>

        <div className="mt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#23ce6b]">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
            Security
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#697171]">
            Manage your authentication and account security.
          </p>
        </div>

        <section className="mt-9 sm:mt-10">
          <SectionHeading
            title="Authentication"
            description="Manage how you access your NEXUS account."
          />

          <div className="mt-4 overflow-hidden rounded-2xl border border-[#303737] bg-[#141818]">
            <SecurityRow
              icon={KeyRound}
              title="Password"
              description="Your account password is managed securely."
              action="Change password"
              onClick={handlePasswordChange}
            />
          </div>
        </section>

        <section className="mt-9 sm:mt-10">
          <SectionHeading
            title="Sessions"
            description="Manage where your NEXUS account is currently signed in."
          />

          <div className="mt-4 overflow-hidden rounded-2xl border border-[#303737] bg-[#141818]">
            <div className="flex items-center gap-4 p-4 sm:p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#203329] text-[#23ce6b]">
                <Shield size={18} strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#edf5fc]">
                  Current session
                </p>

                <p className="mt-1 text-xs leading-5 text-[#697171]">
                  This device · Active now
                </p>
              </div>

              <span className="rounded-full bg-[#203329] px-2.5 py-1 text-[10px] font-medium text-[#23ce6b]">
                Active
              </span>
            </div>

            <div className="mx-5 border-t border-[#303737]" />

            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#242929] text-[#697171]">
                <LogOut size={18} strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#edf5fc]">
                  Sign out of all other sessions
                </p>

                <p className="mt-1 text-xs leading-5 text-[#697171]">
                  Sign out any other devices currently using your account.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSignoutSessions}
                className="h-9 shrink-0 rounded-lg border border-[#3a4242] px-3.5 text-xs font-medium text-[#c5cdcd] transition-colors hover:border-[#596262] hover:bg-[#1b2020] hover:text-[#edf5fc] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/20"
              >
                Sign out others
              </button>
            </div>
          </div>
        </section>

        <section className="mt-9 sm:mt-10">
          <SectionHeading
            title="Danger zone"
            description="Irreversible account actions."
          />

          <div className="mt-4 rounded-2xl border border-[#4a3030] bg-[#171313] p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2b1c1c] text-[#d87575]">
                <Trash2 size={18} strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#edf5fc]">
                  Delete account
                </p>

                <p className="mt-1 text-xs leading-5 text-[#8c7474]">
                  Permanently delete your NEXUS account and associated data.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAccountDeletion}
                className="h-9 shrink-0 rounded-lg border border-[#713d3d] px-3.5 text-xs font-medium text-[#d87575] transition-colors hover:border-[#a14e4e] hover:bg-[#251818] focus:outline-none focus:ring-2 focus:ring-[#d87575]/20"
              >
                Delete account
              </button>
            </div>
          </div>
        </section>

        <p className="mt-10 pb-8 text-center text-[11px] text-[#4f5757]">
          Keep your account secure and up to date.
        </p>
      </div>
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

function SecurityRow({
  icon: Icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#242929] text-[#23ce6b]">
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#edf5fc]">{title}</p>

        <p className="mt-1 text-xs leading-5 text-[#697171]">{description}</p>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="h-9 shrink-0 rounded-lg border border-[#3a4242] px-3.5 text-xs font-medium text-[#c5cdcd] transition-colors hover:border-[#596262] hover:bg-[#1b2020] hover:text-[#edf5fc] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/20"
      >
        {action}
      </button>
    </div>
  );
}
