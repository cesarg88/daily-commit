import type { DayRepository } from "../ports/day-repository";
import type { ObjectiveRepository } from "../ports/objective-repository";
import {
  validateDayActivation,
  type DayActivationValidationResult,
} from "../../domain/day/day-validation";
import type { DailyObjective } from "../../domain/day/daily-objective";
import type { Day, DayState } from "../../domain/day/day";
import type { Objective } from "../../domain/objective/objective";

export interface SelectedDayObjectiveInput {
  objectiveId: string;
  kind: "base" | "bonus";
  weight: number;
}

export interface SaveDayConfigurationInput {
  date: string;
  selectedObjectives: SelectedDayObjectiveInput[];
  targetState: "draft" | "active";
  acknowledgeActiveEdit?: boolean;
}

export interface DayConfigurationViewModel {
  date: string;
  day: Day | null;
  activeObjectives: Objective[];
  selectedObjectives: DailyObjective[];
  validation: DayActivationValidationResult;
  requiresActiveEditAcknowledgement: boolean;
}

export type DayConfigurationSaveResult =
  | {
      status: "saved";
      record: {
        day: Day;
        objectives: DailyObjective[];
      };
    }
  | {
      status: "invalid";
      validation: DayActivationValidationResult;
    }
  | {
      status: "requires-active-edit-acknowledgement";
    };

type IdFactory = () => string;

function createDraftDay(date: string): Day {
  return {
    id: crypto.randomUUID(),
    date,
    state: "draft",
  };
}

function buildDailyObjective(
  objective: Objective,
  selectedObjective: SelectedDayObjectiveInput,
  createId: IdFactory,
): DailyObjective {
  const base = {
    id: createId(),
    objectiveId: objective.id,
    nameSnapshot: objective.name,
    type: objective.type,
    kind: selectedObjective.kind,
    weight: selectedObjective.weight,
    isCompleted: false,
  };

  if (objective.type === "binary") {
    return {
      ...base,
      type: "binary",
    };
  }

  return {
    ...base,
    type: "numeric",
    targetValue: objective.defaultTargetValue ?? 0,
    currentValue: 0,
    unit: objective.defaultUnit ?? "",
  };
}

async function buildDailyObjectives(
  userId: string,
  input: SaveDayConfigurationInput,
  objectiveRepository: ObjectiveRepository,
  createId: IdFactory,
): Promise<DailyObjective[]> {
  const catalog = await objectiveRepository.listByUser(userId);
  const objectivesById = new Map(
    catalog.map((objective) => [objective.id, objective]),
  );

  return input.selectedObjectives.flatMap((selectedObjective) => {
    const objective = objectivesById.get(selectedObjective.objectiveId);

    if (!objective || !objective.isActive) {
      return [];
    }

    return [buildDailyObjective(objective, selectedObjective, createId)];
  });
}

function canSaveActiveEdit(
  existingDay: Day | null,
  input: SaveDayConfigurationInput,
): boolean {
  return (
    existingDay?.state !== "active" || input.acknowledgeActiveEdit === true
  );
}

export async function getDayConfiguration(
  userId: string,
  date: string,
  objectiveRepository: ObjectiveRepository,
  dayRepository: DayRepository,
): Promise<DayConfigurationViewModel> {
  const [objectives, record] = await Promise.all([
    objectiveRepository.listByUser(userId),
    dayRepository.getByDate(userId, date),
  ]);
  const selectedObjectives = record?.objectives ?? [];
  const activeObjectives = objectives.filter((objective) => objective.isActive);

  return {
    date,
    day: record?.day ?? null,
    activeObjectives,
    selectedObjectives,
    validation: validateDayActivation(selectedObjectives),
    requiresActiveEditAcknowledgement: record?.day.state === "active",
  };
}

export async function saveDayConfiguration(
  userId: string,
  input: SaveDayConfigurationInput,
  objectiveRepository: ObjectiveRepository,
  dayRepository: DayRepository,
  createId: IdFactory = () => crypto.randomUUID(),
): Promise<DayConfigurationSaveResult> {
  const existingRecord = await dayRepository.getByDate(userId, input.date);
  const existingDay = existingRecord?.day ?? null;

  if (!canSaveActiveEdit(existingDay, input)) {
    return {
      status: "requires-active-edit-acknowledgement",
    };
  }

  const objectives = await buildDailyObjectives(
    userId,
    input,
    objectiveRepository,
    createId,
  );
  const validation = validateDayActivation(objectives);

  if (input.targetState === "active" && !validation.isValid) {
    return {
      status: "invalid",
      validation,
    };
  }

  const day: Day = {
    ...(existingDay ?? createDraftDay(input.date)),
    state: input.targetState,
    closedAt: undefined,
  };

  const record = await dayRepository.saveDay(userId, {
    day,
    objectives,
  });

  return {
    status: "saved",
    record,
  };
}

export async function excludeDay(
  userId: string,
  date: string,
  dayRepository: DayRepository,
): Promise<Day> {
  const existingRecord = await dayRepository.getByDate(userId, date);
  const existingDay = existingRecord?.day ?? createDraftDay(date);
  const state: DayState = "excluded";
  const record = await dayRepository.saveDay(userId, {
    day: {
      ...existingDay,
      state,
      closedAt: undefined,
    },
    objectives: existingRecord?.objectives ?? [],
  });

  return record.day;
}
