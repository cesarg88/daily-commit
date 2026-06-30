import { describe, expect, it } from "vitest";
import {
  createObjective,
  listObjectiveCatalog,
  setObjectiveActiveState,
  updateObjective,
} from "./objective-catalog";
import type {
  CreateObjectiveInput,
  ObjectiveRepository,
} from "../ports/objective-repository";
import type { Objective } from "../../domain/objective/objective";

function createInMemoryObjectiveRepository(
  seedObjectives: Objective[] = [],
): ObjectiveRepository {
  const objectives = new Map(
    seedObjectives.map((objective) => [objective.id, objective]),
  );

  return {
    async create(_userId: string, input: CreateObjectiveInput) {
      const objective = {
        id: `objective-${objectives.size + 1}`,
        ...input,
      };
      objectives.set(objective.id, objective);
      return objective;
    },
    async getById(_userId: string, objectiveId: string) {
      return objectives.get(objectiveId) ?? null;
    },
    async listByUser() {
      return Array.from(objectives.values());
    },
    async update(_userId: string, objective: Objective) {
      objectives.set(objective.id, objective);
      return objective;
    },
  };
}

describe("objective catalog use cases", () => {
  it("creates a binary objective", async () => {
    const repository = createInMemoryObjectiveRepository();

    await expect(
      createObjective(
        "user-1",
        {
          name: "Read",
          type: "binary",
        },
        repository,
      ),
    ).resolves.toEqual({
      id: "objective-1",
      name: "Read",
      type: "binary",
      isActive: true,
    });
  });

  it("creates a numeric objective with target value, unit, and optional weight", async () => {
    const repository = createInMemoryObjectiveRepository();

    await expect(
      createObjective(
        "user-1",
        {
          name: "Walk",
          type: "numeric",
          defaultTargetValue: 8,
          defaultUnit: "km",
          defaultWeight: 30,
        },
        repository,
      ),
    ).resolves.toEqual({
      id: "objective-1",
      name: "Walk",
      type: "numeric",
      isActive: true,
      defaultTargetValue: 8,
      defaultUnit: "km",
      defaultWeight: 30,
    });
  });

  it("rejects numeric objectives without target value and unit", async () => {
    const repository = createInMemoryObjectiveRepository();

    await expect(
      createObjective(
        "user-1",
        {
          name: "Walk",
          type: "numeric",
        },
        repository,
      ),
    ).rejects.toThrow(
      "Numeric objectives require a target value greater than 0. Numeric objectives require a unit.",
    );
  });

  it("edits objective fields without changing active state", async () => {
    const repository = createInMemoryObjectiveRepository([
      {
        id: "objective-1",
        name: "Walk",
        type: "numeric",
        isActive: false,
        defaultTargetValue: 5,
        defaultUnit: "km",
      },
    ]);

    await expect(
      updateObjective(
        "user-1",
        "objective-1",
        {
          name: "Read",
          type: "binary",
          defaultTargetValue: 10,
          defaultUnit: "pages",
        },
        repository,
      ),
    ).resolves.toEqual({
      id: "objective-1",
      name: "Read",
      type: "binary",
      isActive: false,
    });
  });

  it("deactivates and reactivates objectives", async () => {
    const repository = createInMemoryObjectiveRepository([
      {
        id: "objective-1",
        name: "Read",
        type: "binary",
        isActive: true,
      },
    ]);

    await expect(
      setObjectiveActiveState("user-1", "objective-1", false, repository),
    ).resolves.toMatchObject({
      id: "objective-1",
      isActive: false,
    });

    await expect(
      setObjectiveActiveState("user-1", "objective-1", true, repository),
    ).resolves.toMatchObject({
      id: "objective-1",
      isActive: true,
    });
  });

  it("keeps deactivated objectives historically available but outside default candidates", async () => {
    const repository = createInMemoryObjectiveRepository([
      {
        id: "objective-1",
        name: "Read",
        type: "binary",
        isActive: true,
      },
      {
        id: "objective-2",
        name: "Archived",
        type: "binary",
        isActive: false,
      },
    ]);

    await expect(listObjectiveCatalog("user-1", repository)).resolves.toEqual({
      objectives: [
        {
          id: "objective-1",
          name: "Read",
          type: "binary",
          isActive: true,
        },
        {
          id: "objective-2",
          name: "Archived",
          type: "binary",
          isActive: false,
        },
      ],
      defaultCandidates: [
        {
          id: "objective-1",
          name: "Read",
          type: "binary",
          isActive: true,
        },
      ],
      inactiveObjectives: [
        {
          id: "objective-2",
          name: "Archived",
          type: "binary",
          isActive: false,
        },
      ],
    });
  });
});
