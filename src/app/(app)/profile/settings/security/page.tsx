"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, LogOut, Shield, Trash2 } from "lucide-react";

import { authClient } from "@/lib/authentication/auth-client";

import { SecondaryButton } from "@/components/settings/buttons/SecondaryButton";
import { PrimaryButton } from "@/components/settings/buttons/PrimaryButton";
import { DangerButton } from "@/components/settings/buttons/DangerButton";

import { ErrorMessage } from "@/components/settings/messages/ErrorMessage";
import { SuccessMessage } from "@/components/settings/messages/SuccessMessage";

import { PasswordStrength } from "@/components/settings/passwords/PasswordStrength";
import { PasswordField } from "@/components/settings/passwords/PasswordField";

import { ModalShell } from "@/components/settings/modals/ModalShell";
import { ModalHeader } from "@/components/settings/modals/ModalHeader";

import { SectionHeading } from "@/components/settings/SectionHeading";
import { SecurityRow } from "@/components/settings/SecurityRow";

type ModalType = "password" | "sessions" | "delete" | null;

export default function SecurityPage() {
  const router = useRouter();

  const [modal, setModal] = useState<ModalType>(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  
  // Reset all modal state.
  
  const resetState = useCallback(() => {
    setError("");
    setSuccess("");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setDeleteConfirmation("");
  }, []);

  
  const closeModal = useCallback(() => {
    if (loading) return;

    setModal(null);
    resetState();
  }, [loading, resetState]);

  const openModal = useCallback(
    (type: ModalType) => {
      resetState();
      setModal(type);
    },
    [resetState],
  );


  useEffect(() => {
    if (!modal) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [modal, loading, closeModal]);

  
  useEffect(() => {
    if (!modal) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [modal]);

  
   // Password modal.
  const handlePasswordChange = () => {
    openModal("password");
  };

  const submitPasswordChange = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword) {
      setError("Enter your current password.");
      return;
    }

    if (!newPassword) {
      setError("Enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }

    if (!confirmPassword) {
      setError("Confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        "Your new password must be different from your current password.",
      );
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setError(error.message || "Unable to change your password.");
        return;
      }

      setSuccess("Password changed successfully.");

      window.setTimeout(() => {
        setModal(null);
        resetState();
      }, 900);
    } catch (error) {
      console.error("Change password error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Signout session modal
  const handleSignoutSessions = () => {
    openModal("sessions");
  };

  const submitSignoutSessions = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const { error } = await authClient.revokeOtherSessions();

      if (error) {
        setError(error.message || "Unable to sign out your other sessions.");
        return;
      }

      setSuccess("All other sessions have been signed out.");

      window.setTimeout(() => {
        setModal(null);
        resetState();
      }, 900);
    } catch (error) {
      console.error("Revoke sessions error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Account deleteion modal
  const handleAccountDeletion = () => {
    openModal("delete");
  };

  const submitAccountDeletion = async () => {
    setError("");
    setSuccess("");

    if (deleteConfirmation !== "DELETE") {
      setError('Type "DELETE" to confirm account deletion.');
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.deleteUser();

      if (error) {
        const message = error.message?.toLowerCase() || "";

        if (
          message.includes("fresh") ||
          message.includes("session") ||
          message.includes("reauth")
        ) {
          setError(
            "For security, please sign in again and then try deleting your account.",
          );
        } else {
          setError(error.message || "Unable to delete your account.");
        }

        return;
      }

      setSuccess("Your account has been permanently deleted.");

      window.setTimeout(() => {
        router.replace("/");
        router.refresh();
      }, 900);
    } catch (error) {
      console.error("Delete account error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh overflow-y-auto bg-[#0b0d0d] text-[#edf5fc]">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 lg:py-14">
        <Link
          href="/profile/settings"
          className="inline-flex items-center gap-2 rounded-md text-xs text-[#697171] transition-colors hover:text-[#edf5fc] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/20"
        >
          <ArrowLeft size={15} strokeWidth={1.8} />
          Back to settings
        </Link>

        <header className="mt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#23ce6b]">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
            Security
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#697171]">
            Manage your authentication and account security.
          </p>
        </header>

        {/* Authentication */}
        <section className="mt-10">
          <SectionHeading
            title="Authentication"
            description="Manage how you access your NEXUS account."
          />

          <div className="mt-4 overflow-hidden rounded-2xl border border-[#303737] bg-[#141818]">
            <SecurityRow
              icon={KeyRound}
              title="Password"
              description="Change your password to keep your account secure."
              action="Change password"
              onClick={handlePasswordChange}
            />
          </div>
        </section>

        {/* Sessions */}
        <section className="mt-10">
          <SectionHeading
            title="Sessions"
            description="Manage where your NEXUS account is currently signed in."
          />

          <div className="mt-4 overflow-hidden rounded-2xl border border-[#303737] bg-[#141818]">
            {/* Current session */}
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

              <span className="shrink-0 rounded-full bg-[#203329] px-2.5 py-1 text-[10px] font-medium text-[#23ce6b]">
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
                  Sign out devices other than the one you&apos;re currently
                  using.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSignoutSessions}
                className="h-9 shrink-0 rounded-lg border border-[#3a4242] px-3.5 text-xs font-medium text-[#c5cdcd] transition-all hover:border-[#596262] hover:bg-[#1b2020] hover:text-[#edf5fc] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/20"
              >
                Sign out others
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="mt-10">
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
                className="h-9 shrink-0 rounded-lg border border-[#713d3d] px-3.5 text-xs font-medium text-[#d87575] transition-all hover:border-[#a14e4e] hover:bg-[#251818] focus:outline-none focus:ring-2 focus:ring-[#d87575]/20"
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

      {/* Change Password Modal */}
      {modal === "password" && (
        <ModalShell
          onClose={closeModal}
          disabled={loading}
          title="Change password"
        >
          <ModalHeader
            icon={KeyRound}
            title="Change password"
            description="Choose a new password for your account."
            onClose={closeModal}
            disabled={loading}
          />

          <div className="p-5">
            <div className="space-y-4">
              <PasswordField
                label="Current password"
                value={currentPassword}
                onChange={setCurrentPassword}
                visible={showCurrentPassword}
                onToggle={() => setShowCurrentPassword((previous) => !previous)}
                disabled={loading}
                autoComplete="current-password"
              />

              <PasswordField
                label="New password"
                value={newPassword}
                onChange={setNewPassword}
                visible={showNewPassword}
                onToggle={() => setShowNewPassword((previous) => !previous)}
                disabled={loading}
                autoComplete="new-password"
              />

              <PasswordField
                label="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((previous) => !previous)}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            {newPassword && <PasswordStrength password={newPassword} />}

            {error && <ErrorMessage message={error} />}

            {success && <SuccessMessage message={success} />}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <SecondaryButton onClick={closeModal} disabled={loading}>
                Cancel
              </SecondaryButton>

              <PrimaryButton onClick={submitPasswordChange} loading={loading}>
                Update password
              </PrimaryButton>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Sessions Modal */}
      {modal === "sessions" && (
        <ModalShell
          onClose={closeModal}
          disabled={loading}
          title="Sign out other sessions"
        >
          <ModalHeader
            icon={LogOut}
            title="Sign out other sessions?"
            description="Your current device will remain signed in."
            onClose={closeModal}
            disabled={loading}
          />

          <div className="p-5">
            <div className="rounded-xl border border-[#303737] bg-[#101313] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#203329] text-[#23ce6b]">
                  <Shield size={14} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-xs font-medium text-[#c5cdcd]">
                    What will happen?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#697171]">
                    Every other active session will be invalidated. Those
                    devices will need to sign in again.
                  </p>
                </div>
              </div>
            </div>

            {error && <ErrorMessage message={error} />}

            {success && <SuccessMessage message={success} />}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <SecondaryButton onClick={closeModal} disabled={loading}>
                Cancel
              </SecondaryButton>

              <PrimaryButton onClick={submitSignoutSessions} loading={loading}>
                Sign out others
              </PrimaryButton>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Delete Account Modal */}
      {modal === "delete" && (
        <ModalShell
          onClose={closeModal}
          disabled={loading}
          title="Delete account"
        >
          <ModalHeader
            icon={Trash2}
            title="Delete your account?"
            description="This action permanently removes your NEXUS account and cannot be undone."
            onClose={closeModal}
            disabled={loading}
            danger
          />

          <div className="p-5">
            <div className="rounded-xl border border-[#543232] bg-[#211818] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2b1c1c] text-[#d87575]">
                  <Trash2 size={14} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-xs font-medium text-[#d87575]">
                    This cannot be undone
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8c7474]">
                    Your NEXUS account and associated data will be permanently
                    deleted.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="delete-confirmation"
                className="mb-2 block text-xs font-medium text-[#c5cdcd]"
              >
                Type <span className="text-[#d87575]">DELETE</span> to confirm
              </label>

              <input
                id="delete-confirmation"
                type="text"
                value={deleteConfirmation}
                onChange={(event) =>
                  setDeleteConfirmation(event.target.value.toUpperCase())
                }
                disabled={loading}
                autoComplete="off"
                spellCheck={false}
                placeholder="DELETE"
                className="h-11 w-full rounded-xl border border-[#3a3030] bg-[#101313] px-3.5 text-sm uppercase tracking-wide text-[#edf5fc] outline-none transition-colors placeholder:text-[#4f4545] focus:border-[#d87575]/50 focus:ring-2 focus:ring-[#d87575]/10 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="mt-2 text-[11px] leading-5 text-[#695858]">
                This confirmation helps prevent accidental account deletion.
              </p>
            </div>

            {error && <ErrorMessage message={error} danger />}

            {success && <SuccessMessage message={success} danger />}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <SecondaryButton onClick={closeModal} disabled={loading}>
                Keep my account
              </SecondaryButton>

              <DangerButton
                onClick={submitAccountDeletion}
                loading={loading}
                disabled={deleteConfirmation !== "DELETE"}
              >
                Permanently delete
              </DangerButton>
            </div>
          </div>
        </ModalShell>
      )}
    </main>
  );
}