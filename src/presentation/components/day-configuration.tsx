import type { DayConfigurationViewModel } from "../../application/use-cases/day-configuration";
import type { DailyObjective } from "../../domain/day/daily-objective";
import type { Objective } from "../../domain/objective/objective";

type DayConfigurationViewProps = {
  model: DayConfigurationViewModel;
  errorMessage?: string;
  saveDraftAction: (formData: FormData) => void | Promise<void>;
  activateAction: (formData: FormData) => void | Promise<void>;
  excludeAction: (formData: FormData) => void | Promise<void>;
};

const issueMessages: Record<string, string> = {
  "base-weight-total-below-100": "Base total must equal 100%.",
  "base-weight-total-above-100": "Base total must equal 100%.",
  "insufficient-base-objectives": "Choose at least 3 base objectives.",
  "non-positive-weight": "Base objective weights must be greater than 0.",
  "missing-numeric-target": "Numeric base objectives need a target.",
  "missing-numeric-unit": "Numeric base objectives need a unit.",
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
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px_120px]">
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
  const issueLabels = model.validation.issues.map(
    (issue) => issueMessages[issue.code],
  );
  const uniqueIssueLabels = Array.from(new Set(issueLabels));

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
        <ul className="mt-4 space-y-1 text-sm text-red-800">
          {uniqueIssueLabels.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-neutral-600">Ready to activate.</p>
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
        </div>
        <p className="text-sm text-neutral-600">
          {model.day?.state ?? "unconfigured"}
        </p>
      </div>

      {errorMessage ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
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
            <span>I understand this changes an already active commitment.</span>
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
            <p className="border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
              Create active objectives before configuring a day.
            </p>
          )}
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            className="border border-neutral-300 bg-white px-4 py-2 text-sm font-medium"
            formAction={saveDraftAction}
            type="submit"
          >
            Save draft
          </button>
          <button
            className="bg-neutral-950 px-4 py-2 text-sm font-medium text-white"
            formAction={activateAction}
            type="submit"
          >
            Activate
          </button>
          <button
            className="border border-neutral-300 bg-white px-4 py-2 text-sm font-medium"
            formAction={excludeAction}
            type="submit"
          >
            Exclude day
          </button>
        </div>
      </form>
    </section>
  );
}
