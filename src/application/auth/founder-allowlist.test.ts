import { describe, expect, it } from "vitest";
import {
  isFounderEmailAllowed,
  parseFounderEmailAllowlist,
} from "./founder-allowlist";

describe("founder allowlist", () => {
  it("parses configured founder emails case-insensitively", () => {
    expect(
      parseFounderEmailAllowlist(" Founder@Example.com, other@example.com "),
    ).toEqual(["founder@example.com", "other@example.com"]);
  });

  it("allows only configured founder emails", () => {
    expect(
      isFounderEmailAllowed("FOUNDER@example.com", ["founder@example.com"]),
    ).toBe(true);
    expect(
      isFounderEmailAllowed("other@example.com", ["founder@example.com"]),
    ).toBe(false);
  });
});
