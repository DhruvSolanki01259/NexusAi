"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Brain, FileText, Sparkles, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();

  const settingsInitialized = useRef(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (settingsInitialized.current) {
      return;
    }

    settingsInitialized.current = true;

    const initializeSettings = async () => {
      try {
        const response = await fetch("/api/settings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 201) return;

        if (response.status === 409) return;

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        console.error(
          "Failed to initialize personalization settings:",
          response.status,
        );
      } catch (error) {
        console.error(
          "Error while initializing personalization settings:",
          error,
        );
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSettings();
  }, [router]);

  if (isInitializing) {
    return (
      <div className="flex min-h-full w-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#697171] border-t-[#23ce6b]" />
      </div>
    );
  }

  return (
    <div className="min-h-full w-full px-3 sm:px-5 md:px-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center py-8 sm:py-10 md:py-12">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#23ce6b] text-lg font-bold text-[#0b0d0d] shadow-[0_0_40px_rgba(35,206,107,0.12)]">
          N
        </div>

        <h1 className="mt-5 text-center text-2xl font-semibold tracking-[-0.04em] text-[#edf5fc] sm:text-3xl md:text-4xl">
          Chat
        </h1>

        <p className="mt-2.5 max-w-lg px-2 text-center text-xs leading-5 text-[#8f999b] sm:text-sm sm:leading-6">
          NEXUS is an AI assistant built to remember context, reason through
          problems, and use tools when they can help get things done.
        </p>

        <div className="mt-7 w-full space-y-2.5 sm:mt-9 sm:space-y-3">
          <Link
            href="/memory"
            className="group flex w-full items-center justify-between rounded-2xl border border-[#303737] bg-[#101414] px-4 py-3.5 transition-all duration-200 hover:border-[#414949] hover:bg-[#161a1a] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/30"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#242a2a] text-[#23ce6b]">
                <Brain size={17} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-[#edf5fc]">
                  How memory works
                </p>

                <p className="mt-0.5 truncate text-[11px] text-[#697171]">
                  Explore how NEXUS remembers context.
                </p>
              </div>
            </div>

            <ArrowRight
              size={16}
              strokeWidth={1.8}
              className="shrink-0 text-[#697171] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#23ce6b]"
            />
          </Link>

          <Link
            href="/tools"
            className="group flex w-full items-center justify-between rounded-2xl border border-[#303737] bg-[#101414] px-4 py-3.5 transition-all duration-200 hover:border-[#414949] hover:bg-[#161a1a] focus:outline-none focus:ring-2 focus:ring-[#23ce6b]/30"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#242a2a] text-[#23ce6b]">
                <Wrench size={17} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-[#edf5fc]">
                  How tools work
                </p>

                <p className="mt-0.5 truncate text-[11px] text-[#697171]">
                  Explore how NEXUS uses external tools.
                </p>
              </div>
            </div>

            <ArrowRight
              size={16}
              strokeWidth={1.8}
              className="shrink-0 text-[#697171] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#23ce6b]"
            />
          </Link>

          <div className="rounded-2xl border border-[#303737] bg-[#0f1212] px-4 py-3.5">
            <div className="flex items-start gap-3">
              <Sparkles
                size={16}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0 text-[#23ce6b]"
              />

              <div className="min-w-0">
                <p className="text-sm font-medium text-[#aeb7ba]">
                  About this project
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#697171]">
                  NEXUS AI is a learning project built through hands-on
                  experimentation and tested across multiple cases. It uses the
                  free tier of the Groq model, so some requests may occasionally
                  hit TPM (Tokens Per Minute) or TPD (Tokens Per Day) limits.
                  The daily token limit is 200,000 tokens. Responses may take a
                  little longer in some cases, and the service may become
                  temporarily unavailable if the daily limit is reached.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#303737] bg-[#0f1212] px-4 py-3.5">
            <div className="flex items-start gap-3">
              <FileText
                size={16}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0 text-[#8f999b]"
              />

              <div className="min-w-0">
                <p className="text-sm font-medium text-[#aeb7ba]">
                  File uploads
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#697171]">
                  NEXUS AI currently does not support file uploads. For
                  file-based conversations, check out{" "}
                  <a
                    href="https://github.com/DhruvSolanki01259/RecallAI"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="font-medium text-[#23ce6b] transition-colors hover:underline">
                      RecallAI
                    </span>
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 px-2 text-center text-[10px] text-[#555e60]">
          Memory · Reasoning · Tools · Context-aware assistance
        </p>
      </div>
    </div>
  );
}
