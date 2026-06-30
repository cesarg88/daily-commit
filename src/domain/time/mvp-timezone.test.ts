import { describe, expect, it } from "vitest";
import {
  getMvpTodayDate,
  MVP_TIMEZONE,
  toLocalDateString,
} from "./mvp-timezone";

describe("MVP timezone date helpers", () => {
  it("uses Europe/Madrid as the MVP timezone", () => {
    expect(MVP_TIMEZONE).toBe("Europe/Madrid");
  });

  it("returns the next local day when UTC time has crossed midnight in Madrid", () => {
    expect(getMvpTodayDate(new Date("2026-06-30T22:30:00.000Z"))).toBe(
      "2026-07-01",
    );
  });

  it("returns the same local day before Madrid midnight", () => {
    expect(getMvpTodayDate(new Date("2026-06-30T21:30:00.000Z"))).toBe(
      "2026-06-30",
    );
  });

  it("supports explicit timezone conversion for closure policy", () => {
    expect(
      toLocalDateString(new Date("2026-01-01T23:30:00.000Z"), "Europe/Madrid"),
    ).toBe("2026-01-02");
  });
});
