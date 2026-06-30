import type { TodayProgressUpdateInput } from "../../application/use-cases/today-execution";

function getRequiredString(formData: FormData, name: string): string {
  const value = formData.get(name);

  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing ${name}.`);
  }

  return value;
}

function parseNumber(value: string): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function parseTodayProgressUpdate(
  formData: FormData,
): TodayProgressUpdateInput {
  const date = getRequiredString(formData, "date");
  const objectiveId = getRequiredString(formData, "objectiveId");
  const type = getRequiredString(formData, "type");

  if (type === "binary") {
    return {
      date,
      objectiveId,
      type,
      isCompleted: getRequiredString(formData, "isCompleted") === "true",
    };
  }

  if (type === "numeric") {
    return {
      date,
      objectiveId,
      type,
      currentValue: parseNumber(getRequiredString(formData, "currentValue")),
    };
  }

  throw new Error("Unsupported today progress update type.");
}
