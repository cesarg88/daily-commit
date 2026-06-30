import Link from "next/link";
import type { TodayExecutionViewModel } from "../../application/use-cases/today-execution";
import type { DailyObjective } from "../../domain/day/daily-objective";

type TodayExecutionViewProps = {
  model: TodayExecutionViewModel;
  errorMessage?: string;
  updateProgressAction: (formData: FormData) => void | Promise<void>;
};

function formatScore(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function objectiveStatus(objective: DailyObjective): string {
  if (objective.type === "binary") {
    return objective.isCompleted ? "Complete" : "Pending";
  }

  return `${objective.currentValue} / ${objective.targetValue} ${objective.unit}`;
}

function objectiveProgress(objective: DailyObjective): number {
  if (objective.type === "binary") {
    return objective.isCompleted ? 100 : 0;
  }

  if (objective.targetValue <= 0) {
    return 0;
  }

  return (
    Math.min(Math.max(objective.currentValue / objective.targetValue, 0), 1) *
    100
  );
}

function ScoreSummary({
  model,
}: Readonly<{
  model: TodayExecutionViewModel;
}>) {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <div className="border border-neutral-200 bg-white p-4">
        <p className="text-sm font-medium text-neutral-500">Final score</p>
        <p className="mt-2 text-3xl font-semibold">
          {formatScore(model.score.finalScore)}%
        </p>
      </div>
      <div className="border border-neutral-200 bg-white p-4">
        <p className="text-sm font-medium text-neutral-500">Base</p>
        <p className="mt-2 text-2xl font-semibold">
          {formatScore(model.score.baseScore)} / 100
        </p>
      </div>
      <div className="border border-neutral-200 bg-white p-4">
        <p className="text-sm font-medium text-neutral-500">Bonus</p>
        <p className="mt-2 text-2xl font-semibold">
          +{formatScore(model.score.bonusScore)}
        </p>
      </div>
    </section>
  );
}

function PendingBaseSummary({
  model,
}: Readonly<{
  model: TodayExecutionViewModel;
}>) {
  return (
    <section className="border border-neutral-200 bg-white p-4">
      <p className="text-sm font-medium text-neutral-500">Pending base</p>
      {model.pendingBaseObjectives.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          {model.pendingBaseObjectives.map((objective) => (
            <li
              className="border border-amber-200 bg-amber-50 px-3 py-1 text-amber-900"
              key={objective.id}
            >
              {objective.nameSnapshot}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-neutral-600">Base complete.</p>
      )}
    </section>
  );
}

function BinaryObjectiveControl({
  date,
  disabled,
  objective,
  updateProgressAction,
}: Readonly<{
  date: string;
  disabled: boolean;
  objective: DailyObjective & { type: "binary" };
  updateProgressAction: (formData: FormData) => void | Promise<void>;
}>) {
  return (
    <form>
      <input name="date" type="hidden" value={date} />
      <input name="objectiveId" type="hidden" value={objective.id} />
      <input name="type" type="hidden" value="binary" />
      <input
        name="isCompleted"
        type="hidden"
        value={objective.isCompleted ? "false" : "true"}
      />
      <button
        className="border border-neutral-300 bg-white px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        formAction={updateProgressAction}
        type="submit"
      >
        {objective.isCompleted ? "Reopen" : "Complete"}
      </button>
    </form>
  );
}

function NumericObjectiveControl({
  date,
  disabled,
  objective,
  updateProgressAction,
}: Readonly<{
  date: string;
  disabled: boolean;
  objective: DailyObjective & { type: "numeric" };
  updateProgressAction: (formData: FormData) => void | Promise<void>;
}>) {
  return (
    <form className="flex flex-wrap items-end gap-2">
      <input name="date" type="hidden" value={date} />
      <input name="objectiveId" type="hidden" value={objective.id} />
      <input name="type" type="hidden" value="numeric" />
      <label className="block">
        <span className="text-sm font-medium">Progress</span>
        <input
          className="mt-2 w-32 border border-neutral-300 bg-white px-3 py-2"
          defaultValue={objective.currentValue}
          disabled={disabled}
          min="0"
          name="currentValue"
          step="any"
          type="number"
        />
      </label>
      <button
        className="border border-neutral-300 bg-white px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        formAction={updateProgressAction}
        type="submit"
      >
        Update
      </button>
    </form>
  );
}

function ObjectiveRow({
  date,
  disabled,
  objective,
  updateProgressAction,
}: Readonly<{
  date: string;
  disabled: boolean;
  objective: DailyObjective;
  updateProgressAction: (formData: FormData) => void | Promise<void>;
}>) {
  const progress = objectiveProgress(objective);

  return (
    <article className="border border-neutral-200 bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium">{objective.nameSnapshot}</h3>
            <span className="border border-neutral-200 px-2 py-1 text-xs text-neutral-600">
              {objective.weight}%
            </span>
          </div>
          <p className="mt-2 text-sm text-neutral-600">
            {objectiveStatus(objective)}
          </p>
          <div className="mt-3 h-2 w-full bg-neutral-100">
            <div
              className="h-2 bg-neutral-950"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {objective.type === "binary" ? (
          <BinaryObjectiveControl
            date={date}
            disabled={disabled}
            objective={objective}
            updateProgressAction={updateProgressAction}
          />
        ) : (
          <NumericObjectiveControl
            date={date}
            disabled={disabled}
            objective={objective}
            updateProgressAction={updateProgressAction}
          />
        )}
      </div>
    </article>
  );
}

function ObjectiveSection({
  date,
  disabled,
  objectives,
  title,
  updateProgressAction,
}: Readonly<{
  date: string;
  disabled: boolean;
  objectives: DailyObjective[];
  title: string;
  updateProgressAction: (formData: FormData) => void | Promise<void>;
}>) {
  if (objectives.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {objectives.map((objective) => (
        <ObjectiveRow
          date={date}
          disabled={disabled}
          key={objective.id}
          objective={objective}
          updateProgressAction={updateProgressAction}
        />
      ))}
    </section>
  );
}

function EmptyToday({
  state,
}: Readonly<{
  state: string;
}>) {
  return (
    <section className="border border-neutral-200 bg-white p-5">
      <p className="text-sm font-medium text-neutral-500">Today is {state}</p>
      <h2 className="mt-2 text-xl font-semibold">No active commitment</h2>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          className="bg-neutral-950 px-4 py-2 text-sm font-medium text-white"
          href="/day"
        >
          Configure today
        </Link>
      </div>
    </section>
  );
}

export function TodayExecutionView({
  model,
  errorMessage,
  updateProgressAction,
}: Readonly<TodayExecutionViewProps>) {
  const state = model.day?.state ?? "unconfigured";

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{model.date}</p>
          <h1 className="mt-2 text-2xl font-semibold">Today</h1>
        </div>
        <p className="text-sm text-neutral-600">{state}</p>
      </div>

      {errorMessage ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      {model.day?.state === "active" || model.day?.state === "closed" ? (
        <>
          <ScoreSummary model={model} />
          <PendingBaseSummary model={model} />
          <ObjectiveSection
            date={model.date}
            disabled={!model.canUpdateProgress}
            objectives={model.baseObjectives}
            title="Base objectives"
            updateProgressAction={updateProgressAction}
          />
          <ObjectiveSection
            date={model.date}
            disabled={!model.canUpdateProgress}
            objectives={model.bonusObjectives}
            title="Bonus objectives"
            updateProgressAction={updateProgressAction}
          />
        </>
      ) : (
        <EmptyToday state={state} />
      )}
    </section>
  );
}
