"use client";

import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#0b0d0d] px-6 text-[#edf5fc]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#edf5fc 1px, transparent 1px), linear-gradient(90deg, #edf5fc 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-130 w-180 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#23ce6b]/[0.035] blur-[140px]" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#414949] bg-[#161a1a] shadow-[0_0_40px_rgba(35,206,107,0.04)]">
          <SearchX size={25} strokeWidth={1.8} className="text-[#23ce6b]" />
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#7f8585]">
          Error 404
        </p>

        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#edf5fc] sm:text-5xl md:text-6xl">
          This page doesn&apos;t exist.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#8f999b] sm:text-base">
          NEXUS couldn&apos;t find the page you&apos;re looking for. It may have
          been moved, removed, or the address might be incorrect.
        </p>

        <div className="mt-9 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#23ce6b] px-6 text-sm font-semibold text-[#0b0d0d] transition-all duration-200 hover:bg-[#32dc79] hover:shadow-[0_0_28px_rgba(35,206,107,0.18)]"
          >
            <Home size={16} strokeWidth={2} />
            Back to home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#414949] bg-[#161a1a] px-6 text-sm font-medium text-[#8f999b] transition-all duration-200 hover:border-[#596262] hover:bg-[#303737] hover:text-[#edf5fc]"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Go back
          </button>
        </div>

        <div className="mt-16 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#23ce6b] text-xs font-bold text-[#0b0d0d]">
            N
          </div>

          <span className="text-xs font-medium tracking-tight text-[#697171]">
            NEXUS AI
          </span>
        </div>
      </div>
    </main>
  );
}
