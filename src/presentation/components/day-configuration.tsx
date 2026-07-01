import Link from "next/link";
import type { DayConfigurationViewModel } from "../../application/use-cases/day-configuration";
import type { DailyObjective } from "../../domain/day/daily-objective";
import type { Objective } from "../../domain/objective/objective";
import { describeDayValidationIssues } from "../copy/day-validation-messages";

type DayConfigurationViewProps = {
  model: DayConfigurationViewModel;
  errorMessage?: string;
  saveDraftAction: (formData: FormData) => void | Promise<void>;
  activateAction: (formData: FormData) => void | Promise<void>;
  excludeAction: (formData: FormData) => void | Promise<void>;
};

function getSelectedObjective(
  selectedObjectives: DailyObjective[],
  objectiveId: string,
): DailyObjective | undefined {
  return selectedObjectives.find(
    (objective) => objective.objectiveId === objectiveId,
  );
}

function ObjectiveOption({
  objective,
  selectedObjective,
}: Readonly<{
  objective: Objective;
  selectedObjective?: DailyObjective;
}>) {
  const detail =
    objective.type === "numeric"
      ? `${objective.defaultTargetValue} ${objective.defaultUnit}`
      : "Binary";

  return (
    <article className="border border-neutral-200 bg-white p-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_140px_140px]">
        <label className="flex items-start gap-3">
          <input
            className="mt-1"
            defaultChecked={Boolean(selectedObjective)}
            name="selectedObjectiveId"
            type="checkbox"
            value={objective.id}
          />
          <span>
            <span className="block font-medium">{objective.name}</span>
            <span className="mt-1 block text-sm text-neutral-600">
              {detail}
            </span>
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Kind</span>
          <select
            className="mt-2 w-full border border-neutral-300 bg-white px-3 py-2"
            defaultValue={selectedObjective?.kind ?? "base"}
            name={`kind:${objective.id}`}
          >
            <option value="base">Base</option>
            <option value="bonus">Bonus</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Weight</span>
          <input
            className="mt-2 w-full border border-neutral-300 bg-white px-3 py-2"
            defaultValue={
              selectedObjective?.weight ?? objective.defaultWeight ?? ""
            }
            min="0"
            name={`weight:${objective.id}`}
            step="any"
            type="number"
          />
        </label>
      </div>
    </article>
  );
}

function ValidationSummary({
  model,
}: Readonly<{
  model: DayConfigurationViewModel;
}>) {
  const uniqueIssueLabels = describeDayValidationIssues(
    model.validation.issues,
  );

  return (
    <section className="border border-neutral-200 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">Base total</p>
          <p className="text-2xl font-semibold">
            {model.validation.baseWeightTotal}%
          </p>
        </div>
        <div className="text-sm text-neutral-600">
          {model.validation.baseObjectiveCount} base objectives
        </div>
      </div>

      {uniqueIssueLabels.length > 0 ? (
        <ul
          aria-live="polite"
          className="mt-4 space-y-1 text-sm text-red-800"
          role="alert"
        >
          {uniqueIssueLabels.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-neutral-600">
          Ready to activate. Base objectives now total 100% across at least 3
          commitments.
        </p>
      )}
    </section>
  );
}

export function DayConfigurationView({
  model,
  errorMessage,
  saveDraftAction,
  activateAction,
  excludeAction,
}: Readonly<DayConfigurationViewProps>) {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{model.date}</p>
          <h1 className="mt-2 text-2xl font-semibold">Configure day</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">
            Build a deliberate board for this date. Keep base objectives honest,
            then use bonus objectives only for extra upside.
          </p>
        </div>
        <p className="text-sm text-neutral-600">
          {model.day?.state ?? "unconfigured"}
        </p>
      </div>

      {errorMessage ? (
        <p
          aria-live="polite"
          className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      <ValidationSummary model={model} />

      <form className="space-y-4">
        <input name="date" type="hidden" value={model.date} />

        {model.requiresActiveEditAcknowledgement ? (
          <label className="flex gap-3 border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <input
              className="mt-1"
              name="acknowledgeActiveEdit"
              type="checkbox"
            />
            <span>
              I understand this changes a commitment that was already active for
              today.
            </span>
          </label>
        ) : null}

        <section className="space-y-3">
          {model.activeObjectives.length > 0 ? (
            model.activeObjectives.map((objective) => (
              <ObjectiveOption
                key={objective.id}
                objective={objective}
                selectedObjective={getSelectedObjective(
                  model.selectedObjectives,
                  objective.id,
                )}
              />
            ))
          ) : (
            <div className="border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
              <p>Create active objectives before configuring a day.</p>
              <Link
                className="mt-4 inline-block border border-neutral-300 bg-white px-3 py-2 font-medium text-neutral-900"
                href="/objectives"
              >
                Open objectives
              </Link>
            </div>
          )}
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            className="w-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium sm:w-auto"
            formAction={saveDraftAction}
            type="submit"
          >
            Save draft
          </button>
          <button
            className="w-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white sm:w-auto"
            formAction={activateAction}
            type="submit"
          >
            Activate day
          </button>
          <button
            className="w-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium sm:w-auto"
            formAction={excludeAction}
            type="submit"
          >
            Exclude this day
          </button>
        </div>
      </form>
    </section>
  );
}
