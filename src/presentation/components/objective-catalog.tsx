import type { Objective } from "../../domain/objective/objective";

type ObjectiveCatalogViewProps = {
  objectives: Objective[];
  inactiveCount: number;
  errorMessage?: string;
  createAction: (formData: FormData) => void | Promise<void>;
  updateAction: (formData: FormData) => void | Promise<void>;
  deactivateAction: (formData: FormData) => void | Promise<void>;
  reactivateAction: (formData: FormData) => void | Promise<void>;
};

function ObjectiveFormFields({
  objective,
}: Readonly<{
  objective?: Objective;
}>) {
  return (
    <>
      {objective ? (
        <input name="objectiveId" type="hidden" value={objective.id} />
      ) : null}
      <label className="block">
        <span className="text-sm font-medium">Name</span>
        <input
          className="mt-2 w-full border border-neutral-300 bg-white px-3 py-2"
          defaultValue={objective?.name}
          name="name"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Type</span>
        <select
          className="mt-2 w-full border border-neutral-300 bg-white px-3 py-2"
          defaultValue={objective?.type ?? "binary"}
          name="type"
        >
          <option value="binary">Binary</option>
          <option value="numeric">Numeric</option>
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium">Target</span>
          <input
            className="mt-2 w-full border border-neutral-300 bg-white px-3 py-2"
            defaultValue={objective?.defaultTargetValue}
            min="0"
            name="defaultTargetValue"
            step="any"
            type="number"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Unit</span>
          <input
            className="mt-2 w-full border border-neutral-300 bg-white px-3 py-2"
            defaultValue={objective?.defaultUnit}
            name="defaultUnit"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Suggested weight</span>
          <input
            className="mt-2 w-full border border-neutral-300 bg-white px-3 py-2"
            defaultValue={objective?.defaultWeight}
            min="0"
            name="defaultWeight"
            step="any"
            type="number"
          />
        </label>
      </div>
    </>
  );
}

function ObjectiveSummary({ objective }: Readonly<{ objective: Objective }>) {
  const detail =
    objective.type === "numeric"
      ? `${objective.defaultTargetValue} ${objective.defaultUnit}`
      : "Binary";

  return (
    <div>
      <p className="font-medium">{objective.name}</p>
      <p className="mt-1 text-sm text-neutral-600">
        {detail}
        {objective.defaultWeight
          ? ` · suggested weight ${objective.defaultWeight}`
          : ""}
      </p>
    </div>
  );
}

function ObjectiveRow({
  objective,
  updateAction,
  deactivateAction,
  reactivateAction,
}: Readonly<{
  objective: Objective;
  updateAction: ObjectiveCatalogViewProps["updateAction"];
  deactivateAction: ObjectiveCatalogViewProps["deactivateAction"];
  reactivateAction: ObjectiveCatalogViewProps["reactivateAction"];
}>) {
  const activeStateAction = objective.isActive
    ? deactivateAction
    : reactivateAction;

  return (
    <article className="border border-neutral-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <ObjectiveSummary objective={objective} />
        <span className="w-fit border border-neutral-300 px-2 py-1 text-xs font-medium text-neutral-600">
          {objective.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium">Edit</summary>
        <form action={updateAction} className="mt-4 space-y-4">
          <ObjectiveFormFields objective={objective} />
          <button
            className="bg-neutral-950 px-4 py-2 text-sm font-medium text-white"
            type="submit"
          >
            Save
          </button>
        </form>
      </details>

      <form action={activeStateAction} className="mt-4">
        <input name="objectiveId" type="hidden" value={objective.id} />
        <button
          className="border border-neutral-300 bg-white px-3 py-2 text-sm font-medium"
          type="submit"
        >
          {objective.isActive ? "Deactivate" : "Reactivate"}
        </button>
      </form>
    </article>
  );
}

export function ObjectiveCatalogView({
  objectives,
  inactiveCount,
  errorMessage,
  createAction,
  updateAction,
  deactivateAction,
  reactivateAction,
}: Readonly<ObjectiveCatalogViewProps>) {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">Objectives</p>
          <h1 className="mt-2 text-2xl font-semibold">Objective catalog</h1>
        </div>
        <p className="text-sm text-neutral-600">
          {objectives.length} saved · {inactiveCount} inactive
        </p>
      </div>

      {errorMessage ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      <section className="border border-neutral-200 bg-white p-4">
        <h2 className="text-base font-semibold">Create objective</h2>
        <form action={createAction} className="mt-4 space-y-4">
          <ObjectiveFormFields />
          <button
            className="bg-neutral-950 px-4 py-2 text-sm font-medium text-white"
            type="submit"
          >
            Create
          </button>
        </form>
      </section>

      <section className="space-y-3">
        {objectives.length > 0 ? (
          objectives.map((objective) => (
            <ObjectiveRow
              deactivateAction={deactivateAction}
              key={objective.id}
              objective={objective}
              reactivateAction={reactivateAction}
              updateAction={updateAction}
            />
          ))
        ) : (
          <p className="border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
            No objectives yet.
          </p>
        )}
      </section>
    </section>
  );
}
