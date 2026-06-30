import { describe, expect, it } from "vitest";
import { parseTodayProgressUpdate } from "./today-progress-form";

describe("parseTodayProgressUpdate", () => {
  it("parses a binary progress update", () => {
    const formData = new FormData();
    formData.set("date", "2026-07-01");
    formData.set("objectiveId", "daily-1");
    formData.set("type", "binary");
    formData.set("isCompleted", "true");

    expect(parseTodayProgressUpdate(formData)).toEqual({
      date: "2026-07-01",
      objectiveId: "daily-1",
      type: "binary",
      isCompleted: true,
    });
  });

  it("parses a numeric progress update", () => {
    const formData = new FormData();
    formData.set("date", "2026-07-01");
    formData.set("objectiveId", "daily-2");
    formData.set("type", "numeric");
    formData.set("currentValue", "7.5");

    expect(parseTodayProgressUpdate(formData)).toEqual({
      date: "2026-07-01",
      objectiveId: "daily-2",
      type: "numeric",
      currentValue: 7.5,
    });
  });

  it("normalizes malformed numeric progress to zero", () => {
    const formData = new FormData();
    formData.set("date", "2026-07-01");
    formData.set("objectiveId", "daily-2");
    formData.set("type", "numeric");
    formData.set("currentValue", "later");

    expect(parseTodayProgressUpdate(formData)).toMatchObject({
      type: "numeric",
      currentValue: 0,
    });
  });
});
