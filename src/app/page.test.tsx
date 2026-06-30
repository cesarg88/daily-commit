import { describe, expect, it } from "vitest";
import { placeholderMessage, placeholderTitle } from "./placeholder";

describe("placeholder route", () => {
  it("defines placeholder copy without product behavior", () => {
    expect(placeholderTitle).toBe("Daily Commit");
    expect(placeholderMessage).toBe("Web app scaffold placeholder.");
  });
});
