import Link from "next/link";

export default function AppPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium text-neutral-500">Founder shell</p>
        <h1 className="text-2xl font-semibold">Run the MVP loop end to end</h1>
        <p className="max-w-2xl text-sm text-neutral-600">
          Use this shell to verify the current founder flow on mobile and
          desktop: create reusable objectives, configure today, execute the day,
          and confirm the week view reflects the result honestly.
        </p>
      </div>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Link
          className="border border-neutral-200 bg-white p-4"
          href="/objectives"
        >
          <p className="text-sm font-medium text-neutral-500">Step 1</p>
          <h2 className="mt-2 text-lg font-semibold">Objectives</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Add at least 3 active objectives before configuring a day.
          </p>
        </Link>
        <Link className="border border-neutral-200 bg-white p-4" href="/day">
          <p className="text-sm font-medium text-neutral-500">Step 2</p>
          <h2 className="mt-2 text-lg font-semibold">Configure day</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Build a valid base commitment that totals 100%.
          </p>
        </Link>
        <Link className="border border-neutral-200 bg-white p-4" href="/today">
          <p className="text-sm font-medium text-neutral-500">Step 3</p>
          <h2 className="mt-2 text-lg font-semibold">Today</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Update binary and numeric progress, then confirm the score changes.
          </p>
        </Link>
        <Link className="border border-neutral-200 bg-white p-4" href="/week">
          <p className="text-sm font-medium text-neutral-500">Step 4</p>
          <h2 className="mt-2 text-lg font-semibold">Week</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Review performance only from scored days and consistency separately.
          </p>
        </Link>
      </section>

      <section className="border border-neutral-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Local verification focus</h2>
        <ul className="mt-4 space-y-2 text-sm text-neutral-700">
          <li>
            Confirm empty states for no objectives, no active day, and no scored
            week.
          </li>
          <li>
            Try an invalid day activation and verify the screen explains why it
            is blocked.
          </li>
          <li>
            Try updating Today after excluding a day and verify the action error
            returns to the same screen.
          </li>
          <li>
            Run `npm run validate` and `node
            scripts/validate-service-role-boundary.mjs` before publishing.
          </li>
        </ul>
      </section>
    </section>
  );
}
