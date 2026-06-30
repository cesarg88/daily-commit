import Link from "next/link";

export default function AppPage() {
  return (
    <section>
      <p className="text-sm font-medium text-neutral-500">Founder shell</p>
      <h1 className="mt-2 text-2xl font-semibold">Signed in</h1>
      <Link
        className="mt-6 inline-block border border-neutral-300 bg-white px-3 py-2 text-sm font-medium"
        href="/day"
      >
        Configure day
      </Link>
    </section>
  );
}
