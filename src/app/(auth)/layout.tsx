import { getSession } from "@/lib/authentication/session";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#0b0d0d] text-[#edf5fc]">
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-175 w-225 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#23ce6b]/2.5 blur-[150px]" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(#edf5fc 1px, transparent 1px), linear-gradient(90deg, #edf5fc 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative z-10 min-h-screen">{children}</div>
      </div>
    </main>
  );
}
