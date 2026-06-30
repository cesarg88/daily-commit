import Link from "next/link";
import { requireAuthenticatedFounder } from "@/data/auth/server-session";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const founder = await requireAuthenticatedFounder();

  return (
    <main className="min-h-screen px-6 py-8">
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">Daily Commit</p>
          <p className="mt-1 text-sm text-neutral-700">{founder.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-3 text-sm font-medium">
            <Link href="/app">Home</Link>
            <Link href="/today">Today</Link>
            <Link href="/day">Configure day</Link>
            <Link href="/objectives">Objectives</Link>
          </nav>
          <form action="/logout" method="post">
            <button
              className="border border-neutral-300 bg-white px-3 py-2 text-sm font-medium"
              type="submit"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl py-8">{children}</div>
    </main>
  );
}
