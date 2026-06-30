import { describe, expect, it } from "vitest";
import {
  parseActiveEditAcknowledgement,
  parseSelectedDayObjectives,
} from "./day-configuration-form";

describe("day configuration form parsing", () => {
  it("parses selected objectives with kind and weight", () => {
    const formData = new FormData();
    formData.append("selectedObjectiveId", "objective-1");
    formData.append("selectedObjectiveId", "objective-2");
    formData.set("kind:objective-1", "base");
    formData.set("kind:objective-2", "bonus");
    formData.set("weight:objective-1", "40");
    formData.set("weight:objective-2", "10");

    expect(parseSelectedDayObjectives(formData)).toEqual([
      {
        objectiveId: "objective-1",
        kind: "base",
        weight: 40,
      },
      {
        objectiveId: "objective-2",
        kind: "bonus",
        weight: 10,
      },
    ]);
  });

  it("parses active edit acknowledgement", () => {
    const formData = new FormData();
    formData.set("acknowledgeActiveEdit", "on");

    expect(parseActiveEditAcknowledgement(formData)).toBe(true);
  });
});
