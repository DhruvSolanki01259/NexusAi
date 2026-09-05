"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { authClient } from "@/lib/authentication/auth-client";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) return;

    setError("");
    setSuccess(false);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.requestPasswordReset({
        email: normalizedEmail,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(
          error.message || "Unable to process your password reset request.",
        );
        return;
      }

      // Email Service Required for reset password feature.

      setSuccess(true);
    } catch (error) {
      console.error("Password reset request error:", error);

      setError(
        "Unable to process your password reset request. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#0b0d0d] px-4">
      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            aria-label="NEXUS AI home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#23ce6b] text-sm font-bold text-[#0b0d0d]">
              N
            </div>

            <span className="font-semibold tracking-tight text-[#edf5fc]">
              NEXUS AI
            </span>
          </Link>
        </div>

        <div className="mb-8">
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-[#697171] transition-colors hover:text-[#edf5fc]"
          >
            <ArrowLeft size={15} strokeWidth={1.8} />
            Back to login
          </Link>

          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#23ce6b]/10 text-[#23ce6b]">
            <Mail size={19} strokeWidth={1.8} />
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#edf5fc]">
            Forgot your password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#7f8585]">
            Enter your email address and we&apos;ll help you reset your
            password.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-[#d95c5c]/30 bg-[#d95c5c]/8 px-4 py-3"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d95c5c] text-[#0b0d0d]">
                <AlertCircle size={13} strokeWidth={2.5} />
              </div>

              <p className="text-sm leading-5 text-[#e8a0a0]">{error}</p>
            </div>
          </div>
        )}

        {success ? (
          <div className="rounded-xl border border-[#23ce6b]/20 bg-[#23ce6b]/5 px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#23ce6b] text-[#0b0d0d]">
                <Mail size={12} strokeWidth={2.5} />
              </div>

              <div>
                <p className="text-sm font-medium text-[#edf5fc]">
                  Password reset requested
                </p>

                <p className="mt-1 text-xs leading-5 text-[#7f8585]">
                  Check the server console for the reset link during
                  development.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
              className="mt-4 text-xs font-medium text-[#23ce6b] transition-colors hover:text-[#32dc79]"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#c2c8ce]"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#697171]"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                  className="h-12 w-full rounded-xl border border-[#414949] bg-[#161a1a] pl-11 pr-4 text-sm text-[#edf5fc] outline-none placeholder:text-[#697171] transition-all duration-200 focus:border-[#23ce6b] focus:ring-2 focus:ring-[#23ce6b]/10 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#697171]">
              <ShieldCheck
                size={15}
                strokeWidth={1.8}
                className="shrink-0 text-[#23ce6b]"
              />

              <span>Your password reset request is securely handled.</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#23ce6b] px-4 text-sm font-bold text-[#0b0d0d] transition-all duration-200 hover:bg-[#32dc79] hover:shadow-[0_0_28px_rgba(35,206,107,0.15)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Spinner dark />
                  <span>Sending request...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>

                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-[#697171]">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-[#23ce6b] transition-colors hover:text-[#32dc79]"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-6 text-center text-xs leading-5 text-[#5f6666]">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-[#7f8585] underline underline-offset-2 transition-colors hover:text-[#aeb7ba]"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-[#7f8585] underline underline-offset-2 transition-colors hover:text-[#aeb7ba]"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

function Spinner({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`h-4 w-4 animate-spin rounded-full border-2 ${
        dark
          ? "border-[#0b0d0d]/30 border-t-[#0b0d0d]"
          : "border-[#697171] border-t-[#edf5fc]"
      }`}
    />
  );
}
