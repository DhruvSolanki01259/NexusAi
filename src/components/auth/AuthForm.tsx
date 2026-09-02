"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { authClient } from "@/lib/authentication/auth-client";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthMode;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isAuthenticating = isLoading || isGoogleLoading;
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isAuthenticating) return;

    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);

      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");
      const name = String(formData.get("name") ?? "").trim();

      if (!email || !password) {
        setError("Please enter your email address and password.");
        return;
      }

      if (!isLogin && !name) {
        setError("Please enter your name.");
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }

      if (isLogin) {
        const { error } = await authClient.signIn.email({
          email,
          password,
          rememberMe: true,
        });

        if (error) {
          setError(
            error.message ||
              "Unable to sign in. Please check your credentials and try again.",
          );
          return;
        }
      } else {
        const { error } = await authClient.signUp.email({
          name,
          email,
          password,
        });

        if (error) {
          setError(
            error.message ||
              "Unable to create your account. Please check your details and try again.",
          );
          return;
        }
      }

      router.push("/chat");
    } catch (error) {
      console.error("Authentication error:", error);

      setError(
        isLogin
          ? "Unable to sign in. Please try again."
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (isAuthenticating) return;

    setError("");
    setIsGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/chat",
      });

      if (error) {
        setError(
          error.message ||
            (isLogin
              ? "Google sign-in failed. Please try again."
              : "Google sign-up failed. Please try again."),
        );

        return;
      }
    } catch (error) {
      console.error("Google authentication error:", error);

      setError(
        isLogin
          ? "Google sign-in failed. Please try again."
          : "Google sign-up failed. Please try again.",
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 flex justify-center lg:hidden">
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
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#edf5fc]">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#7f8585]">
          {isLogin
            ? "Sign in to continue to your NEXUS workspace."
            : "Create your NEXUS workspace and start your journey."}
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

      <button
        type="button"
        onClick={handleGoogleAuth}
        disabled={isAuthenticating}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#414949] bg-[#161a1a] text-sm font-medium text-[#edf5fc] transition-all duration-200 hover:border-[#596262] hover:bg-[#303737] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGoogleLoading ? (
          <>
            <Spinner />

            <span>
              {isLogin ? "Signing in with Google..." : "Creating account..."}
            </span>
          </>
        ) : (
          <>
            <GoogleIcon />

            <span>Continue with Google</span>
          </>
        )}
      </button>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#303737]" />

        <span className="text-[11px] font-medium tracking-[0.15em] text-[#697171]">
          OR
        </span>

        <div className="h-px flex-1 bg-[#303737]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[#c2c8ce]"
            >
              Name
            </label>

            <div className="relative">
              <User
                size={17}
                strokeWidth={1.8}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#697171]"
              />

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                required
                disabled={isAuthenticating}
                className="h-12 w-full rounded-xl border border-[#414949] bg-[#161a1a] pl-11 pr-4 text-sm text-[#edf5fc] outline-none placeholder:text-[#697171] transition-all duration-200 focus:border-[#23ce6b] focus:ring-2 focus:ring-[#23ce6b]/10 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        )}

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
              autoComplete="email"
              placeholder="you@example.com"
              required
              disabled={isAuthenticating}
              className="h-12 w-full rounded-xl border border-[#414949] bg-[#161a1a] pl-11 pr-4 text-sm text-[#edf5fc] outline-none placeholder:text-[#697171] transition-all duration-200 focus:border-[#23ce6b] focus:ring-2 focus:ring-[#23ce6b]/10 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[#c2c8ce]"
            >
              Password
            </label>

            {isLogin && (
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-[#23ce6b] transition-colors hover:text-[#32dc79]"
              >
                Forgot password?
              </Link>
            )}
          </div>

          <div className="relative">
            <Lock
              size={17}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#697171]"
            />

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder="••••••••"
              minLength={8}
              required
              disabled={isAuthenticating}
              className="h-12 w-full rounded-xl border border-[#414949] bg-[#161a1a] pl-11 pr-12 text-sm tracking-wider text-[#edf5fc] outline-none placeholder:text-[#697171] transition-all duration-200 focus:border-[#23ce6b] focus:ring-2 focus:ring-[#23ce6b]/10 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              disabled={isAuthenticating}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#697171] transition-colors hover:bg-[#303737] hover:text-[#edf5fc] disabled:pointer-events-none"
            >
              {showPassword ? (
                <EyeOff size={17} strokeWidth={1.8} />
              ) : (
                <Eye size={17} strokeWidth={1.8} />
              )}
            </button>
          </div>

          {!isLogin && (
            <p className="mt-2 text-xs text-[#697171]">
              Use at least 8 characters.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#697171]">
          <ShieldCheck
            size={15}
            strokeWidth={1.8}
            className="shrink-0 text-[#23ce6b]"
          />

          <span>Your account credentials are securely protected.</span>
        </div>

        <button
          type="submit"
          disabled={isAuthenticating}
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#23ce6b] px-4 text-sm font-bold text-[#0b0d0d] transition-all duration-200 hover:bg-[#32dc79] hover:shadow-[0_0_28px_rgba(35,206,107,0.15)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <Spinner dark />

              <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
            </>
          ) : (
            <>
              <span>{isLogin ? "Sign in" : "Create account"}</span>

              <ArrowRight
                size={16}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[#697171]">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="font-medium text-[#23ce6b] transition-colors hover:text-[#32dc79]"
        >
          {isLogin ? "Create one" : "Sign in"}
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

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M21.805 12.23c0-.79-.065-1.565-.205-2.295H12v4.345h5.505a4.7 4.7 0 0 1-2.04 3.085v2.56h3.3c1.935-1.78 3.04-4.4 3.04-7.695Z"
        fill="#4285F4"
      />

      <path
        d="M12 22c2.76 0 5.075-.915 6.765-2.475l-3.3-2.56c-.915.615-2.08.98-3.465.98-2.665 0-4.925-1.8-5.735-4.22h-3.4v2.64A10.22 10.22 0 0 0 12 22Z"
        fill="#34A853"
      />

      <path
        d="M6.265 13.725A6.14 6.14 0 0 1 5.945 12c0-.6.11-1.185.32-1.725v-2.64h-3.4A10.005 10.005 0 0 0 1.805 12c0 1.61.385 3.13 1.06 4.365l3.4-2.64Z"
        fill="#FBBC05"
      />

      <path
        d="M12 6.055c1.5 0 2.845.515 3.905 1.525l2.925-2.925C17.07 3.025 14.755 2 12 2A10.22 10.22 0 0 0 2.865 7.635l3.4 2.64C7.075 7.855 9.335 6.055 12 6.055Z"
        fill="#EA4335"
      />
    </svg>
  );
}
