import type {
  CreateObjectiveInput,
  ObjectiveRepository,
} from "../ports/objective-repository";
import type {
  Objective,
  ObjectiveType,
} from "../../domain/objective/objective";

export interface ObjectiveCatalogInput {
  name: string;
  type: ObjectiveType;
  defaultTargetValue?: number;
  defaultUnit?: string;
  defaultWeight?: number;
}

export interface ObjectiveCatalog {
  objectives: Objective[];
  defaultCandidates: Objective[];
  inactiveObjectives: Objective[];
}

export type ObjectiveCatalogValidationResult =
  | {
      valid: true;
      value: CreateObjectiveInput;
    }
  | {
      valid: false;
      errors: string[];
    };

export function validateObjectiveCatalogInput(
  input: ObjectiveCatalogInput,
): ObjectiveCatalogValidationResult {
  const errors: string[] = [];
  const name = input.name.trim();
  const defaultUnit = input.defaultUnit?.trim();

  if (name.length === 0) {
    errors.push("Objective name is required.");
  }

  if (input.type === "numeric") {
    if (
      input.defaultTargetValue === undefined ||
      input.defaultTargetValue <= 0
    ) {
      errors.push("Numeric objectives require a target value greater than 0.");
    }

    if (!defaultUnit) {
      errors.push("Numeric objectives require a unit.");
    }
  }

  if (input.defaultWeight !== undefined && input.defaultWeight <= 0) {
    errors.push("Suggested weight must be greater than 0.");
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    value: {
      name,
      type: input.type,
      isActive: true,
      defaultTargetValue:
        input.type === "numeric" ? input.defaultTargetValue : undefined,
      defaultUnit: input.type === "numeric" ? defaultUnit : undefined,
      defaultWeight: input.defaultWeight,
    },
  };
}

export async function listObjectiveCatalog(
  userId: string,
  repository: ObjectiveRepository,
): Promise<ObjectiveCatalog> {
  const objectives = await repository.listByUser(userId);

  return {
    objectives,
    defaultCandidates: objectives.filter((objective) => objective.isActive),
    inactiveObjectives: objectives.filter((objective) => !objective.isActive),
  };
}

export async function createObjective(
  userId: string,
  input: ObjectiveCatalogInput,
  repository: ObjectiveRepository,
): Promise<Objective> {
  const validation = validateObjectiveCatalogInput(input);

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  return repository.create(userId, validation.value);
}

export async function updateObjective(
  userId: string,
  objectiveId: string,
  input: ObjectiveCatalogInput,
  repository: ObjectiveRepository,
): Promise<Objective> {
  const existingObjective = await repository.getById(userId, objectiveId);

  if (!existingObjective) {
    throw new Error("Objective not found.");
  }

  const validation = validateObjectiveCatalogInput(input);

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  return repository.update(userId, {
    ...validation.value,
    id: existingObjective.id,
    isActive: existingObjective.isActive,
  });
}

export async function setObjectiveActiveState(
  userId: string,
  objectiveId: string,
  isActive: boolean,
  repository: ObjectiveRepository,
): Promise<Objective> {
  const objective = await repository.getById(userId, objectiveId);

  if (!objective) {
    throw new Error("Objective not found.");
  }

  return repository.update(userId, {
    ...objective,
    isActive,
  });
}
