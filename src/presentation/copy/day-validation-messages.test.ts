import { describe, expect, it } from "vitest";
import { describeDayValidationIssues } from "./day-validation-messages";

describe("describeDayValidationIssues", () => {
  it("deduplicates equivalent validation messages", () => {
    expect(
      describeDayValidationIssues([
        { code: "base-weight-total-below-100" },
        { code: "base-weight-total-above-100" },
        { code: "insufficient-base-objectives" },
      ]),
    ).toEqual([
      "Base objectives must add up to exactly 100%.",
      "Choose at least 3 base objectives.",
    ]);
  });
});
