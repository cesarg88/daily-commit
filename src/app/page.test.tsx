import { describe, expect, it } from "vitest";
import { describeDayValidationIssues } from "@/presentation/copy/day-validation-messages";

describe("root app copy helpers", () => {
  it("reuses the same day activation copy across UI surfaces", () => {
    expect(
      describeDayValidationIssues([
        { code: "base-weight-total-below-100" },
        { code: "missing-numeric-unit" },
      ]),
    ).toEqual([
      "Base objectives must add up to exactly 100%.",
      "Numeric base objectives need a unit.",
    ]);
  });
});
