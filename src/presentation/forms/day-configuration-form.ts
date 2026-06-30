import type { SelectedDayObjectiveInput } from "../../application/use-cases/day-configuration";

function getString(formData: FormData, name: string): string {
  const value = formData.get(name);

  return typeof value === "string" ? value : "";
}

function getNumber(formData: FormData, name: string): number {
  const value = Number(getString(formData, name));

  return Number.isFinite(value) ? value : 0;
}

export function parseSelectedDayObjectives(
  formData: FormData,
): SelectedDayObjectiveInput[] {
  return formData
    .getAll("selectedObjectiveId")
    .filter((value): value is string => typeof value === "string")
    .map((objectiveId) => ({
      objectiveId,
      kind:
        getString(formData, `kind:${objectiveId}`) === "bonus"
          ? "bonus"
          : "base",
      weight: getNumber(formData, `weight:${objectiveId}`),
    }));
}

export function parseActiveEditAcknowledgement(formData: FormData): boolean {
  return getString(formData, "acknowledgeActiveEdit") === "on";
}
