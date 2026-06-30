type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const errorMessages = {
  invalid_credentials: "Check the email and password.",
  not_allowlisted: "This account is not allowed to access Daily Commit.",
  allowlist_not_configured: "Founder access is not configured.",
} as const;

function getStringParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getErrorMessage(
  code: string | string[] | undefined,
): string | undefined {
  const errorCode = getStringParam(code);

  if (!errorCode || !(errorCode in errorMessages)) {
    return undefined;
  }

  return errorMessages[errorCode as keyof typeof errorMessages];
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const next = getStringParam(params.next) ?? "/app";
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-sm font-medium text-neutral-500">Daily Commit</p>
          <h1 className="mt-2 text-2xl font-semibold">Sign in</h1>
        </div>

        {errorMessage ? (
          <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {errorMessage}
          </p>
        ) : null}

        <form action="/login/submit" className="space-y-4" method="post">
          <input name="next" type="hidden" value={next} />

          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              autoComplete="email"
              className="mt-2 w-full border border-neutral-300 bg-white px-3 py-2"
              name="email"
              required
              type="email"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              autoComplete="current-password"
              className="mt-2 w-full border border-neutral-300 bg-white px-3 py-2"
              name="password"
              required
              type="password"
            />
          </label>

          <button
            className="w-full bg-neutral-950 px-4 py-2 font-medium text-white"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
