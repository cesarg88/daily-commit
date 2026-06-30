import type { ObjectiveCatalogInput } from "../../application/use-cases/objective-catalog";

function getString(formData: FormData, name: string): string {
  const value = formData.get(name);

  return typeof value === "string" ? value : "";
}

function getOptionalNumber(
  formData: FormData,
  name: string,
): number | undefined {
  const value = getString(formData, name).trim();

  if (value.length === 0) {
    return undefined;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

export function parseObjectiveFormData(
  formData: FormData,
): ObjectiveCatalogInput {
  const type = getString(formData, "type") === "numeric" ? "numeric" : "binary";

  return {
    name: getString(formData, "name"),
    type,
    defaultTargetValue: getOptionalNumber(formData, "defaultTargetValue"),
    defaultUnit: getString(formData, "defaultUnit"),
    defaultWeight: getOptionalNumber(formData, "defaultWeight"),
  };
}

export function getObjectiveId(formData: FormData): string {
  return getString(formData, "objectiveId");
}
