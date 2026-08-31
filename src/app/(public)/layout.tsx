import Link from "next/link";
import type { ReactNode } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-[#272d2d] text-[#edf5fc]">
      <header className="sticky top-0 z-50 border-b border-[#414949] bg-[#0b0d0d]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#23ce6b] text-sm font-bold text-[#101512] transition-transform duration-200 group-hover:scale-105">
              N
            </div>

            <span className="text-[15px] font-semibold tracking-tight text-[#edf5fc]">
              NEXUS AI
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-[#aeb7ba] transition-colors hover:text-[#edf5fc]"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-[#aeb7ba] transition-colors hover:text-[#edf5fc]"
            >
              About
            </Link>

            <Link
              href="/terms"
              className="text-sm font-medium text-[#aeb7ba] transition-colors hover:text-[#edf5fc]"
            >
              Terms
            </Link>

            <Link
              href="/privacy"
              className="text-sm font-medium text-[#aeb7ba] transition-colors hover:text-[#edf5fc]"
            >
              Privacy
            </Link>
          </nav>

          <Link
            href="/"
            className="rounded-full bg-[#23ce6b] px-5 py-2.5 text-sm font-semibold text-[#101512] transition-all duration-200 hover:bg-[#32dc79] hover:shadow-[0_0_28px_rgba(35,206,107,0.2)]"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-[#414949] bg-[#0b0d0d]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-12 md:grid-cols-4">
            {/* Brand */}

            <div className="md:col-span-2">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#23ce6b] text-sm font-bold text-[#101512]">
                  N
                </div>

                <span className="text-[15px] font-semibold tracking-tight text-[#edf5fc]">
                  NEXUS AI
                </span>
              </Link>

              <p className="mt-5 max-w-md text-sm leading-6 text-[#aeb7ba]">
                An AI assistant designed to remember context, reason through
                complex tasks, and use tools to help you get things done.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#edf5fc]">Product</h3>

              <div className="mt-5 space-y-3">
                <Link
                  href="/"
                  className="block text-sm text-[#8f999b] transition-colors hover:text-[#edf5fc]"
                >
                  Home
                </Link>

                <Link
                  href="/about"
                  className="block text-sm text-[#8f999b] transition-colors hover:text-[#edf5fc]"
                >
                  About
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#edf5fc]">Legal</h3>

              <div className="mt-5 space-y-3">
                <Link
                  href="/privacy"
                  className="block text-sm text-[#8f999b] transition-colors hover:text-[#edf5fc]"
                >
                  Privacy Policy
                </Link>

                <Link
                  href="/terms"
                  className="block text-sm text-[#8f999b] transition-colors hover:text-[#edf5fc]"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-[#303737] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#7f8585]">
              © {new Date().getFullYear()} NEXUS AI. All rights reserved.
            </p>

            <p className="text-xs text-[#697171]">
              Built with memory, reasoning, and tools.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
