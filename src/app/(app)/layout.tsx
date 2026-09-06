import { getSession } from "@/lib/authentication/session";
import Sidebar from "@/components/chat/sidebar/Sidebar";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#0b0d0d]">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
