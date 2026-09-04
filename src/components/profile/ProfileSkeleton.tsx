export function ProfileSkeleton() {
  return (
    <main className="min-h-dvh bg-[#0b0d0d] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl animate-pulse">
        <div className="h-3 w-16 rounded bg-[#303737]" />

        <div className="mt-3 h-9 w-32 rounded bg-[#303737]" />

        <div className="mt-2 h-4 w-64 rounded bg-[#161a1a]" />

        <div className="mt-8 h-32 rounded-2xl bg-[#161a1a]" />

        <div className="mt-10 h-5 w-24 rounded bg-[#303737]" />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="h-32 rounded-2xl bg-[#161a1a]" />
          <div className="h-32 rounded-2xl bg-[#161a1a]" />
        </div>
      </div>
    </main>
  );
}
