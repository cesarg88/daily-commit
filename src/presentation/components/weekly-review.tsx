import type { WeeklyReviewViewModel } from "../../application/use-cases/weekly-review";
import type { WeeklyDaySummary } from "../../domain/week/weekly-summary";

type WeeklyReviewViewProps = {
  model: WeeklyReviewViewModel;
};

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function formatScore(value: number | null): string {
  if (value === null) {
    return "No scored days";
  }

  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

function dayCardClasses(day: WeeklyDaySummary): string {
  if (day.state === "scored") {
    return "border border-neutral-950 bg-neutral-950 text-white";
  }

  if (day.state === "excluded") {
    return "border border-amber-200 bg-amber-50 text-amber-950";
  }

  return "border border-neutral-200 bg-white text-neutral-700";
}

function dayDetail(day: WeeklyDaySummary): string {
  if (day.state === "scored") {
    return `${day.finalScore}%`;
  }

  if (day.state === "excluded") {
    return "Excluded";
  }

  return "Unconfigured";
}

function SummaryCards({
  model,
}: Readonly<{
  model: WeeklyReviewViewModel;
}>) {
  return (
    <section className="grid gap-3 md:grid-cols-2">
      <div className="border border-neutral-200 bg-white p-4">
        <p className="text-sm font-medium text-neutral-500">Performance</p>
        <p className="mt-2 text-3xl font-semibold">
          {formatScore(model.summary.performance.averageScore)}
        </p>
        <p className="mt-2 text-sm text-neutral-600">
          {model.summary.performance.scoredDayCount} scored days
        </p>
      </div>
      <div className="border border-neutral-200 bg-white p-4">
        <p className="text-sm font-medium text-neutral-500">Consistency</p>
        <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="font-medium text-neutral-900">
              {model.summary.consistency.scoredDayCount}
            </p>
            <p className="text-neutral-600">Scored</p>
          </div>
          <div>
            <p className="font-medium text-neutral-900">
              {model.summary.consistency.excludedDayCount}
            </p>
            <p className="text-neutral-600">Excluded</p>
          </div>
          <div>
            <p className="font-medium text-neutral-900">
              {model.summary.consistency.unconfiguredDayCount}
            </p>
            <p className="text-neutral-600">Unconfigured</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WeekGrid({
  days,
}: Readonly<{
  days: WeeklyReviewViewModel["summary"]["days"];
}>) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Week at a glance</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {days.map((day, index) => (
          <article className={`p-4 ${dayCardClasses(day)}`} key={day.date}>
            <p className="text-sm font-medium">{weekdayLabels[index]}</p>
            <p className="mt-1 text-sm opacity-80">{formatDate(day.date)}</p>
            <p className="mt-6 text-lg font-semibold">{dayDetail(day)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function WeeklyReviewView({ model }: Readonly<WeeklyReviewViewProps>) {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">
            {formatDate(model.summary.range.startDate)} -{" "}
            {formatDate(model.summary.range.endDate)}
          </p>
          <h1 className="mt-2 text-2xl font-semibold">Week</h1>
        </div>
        <p className="text-sm text-neutral-600">
          Week of {formatDate(model.containingDate)}
        </p>
      </div>

      <SummaryCards model={model} />

      {model.summary.performance.averageScore === null ? (
        <p className="border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
          No weekly performance yet. Consistency still shows which days were
          scored, excluded, or left unconfigured.
        </p>
      ) : null}

      <WeekGrid days={model.summary.days} />
    </section>
  );
}
