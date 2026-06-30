import { requireAuthenticatedFounder } from "@/data/auth/server-session";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const founder = await requireAuthenticatedFounder();

  return (
    <main className="min-h-screen px-6 py-8">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">Daily Commit</p>
          <p className="mt-1 text-sm text-neutral-700">{founder.email}</p>
        </div>
        <form action="/logout" method="post">
          <button
            className="border border-neutral-300 bg-white px-3 py-2 text-sm font-medium"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </header>
      <div className="mx-auto w-full max-w-5xl py-8">{children}</div>
    </main>
  );
}
