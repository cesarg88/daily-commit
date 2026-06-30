import { describe, expect, it } from "vitest";
import { isCronRequestAuthorized } from "./cron-auth";

describe("isCronRequestAuthorized", () => {
  it("accepts the configured bearer secret", () => {
    expect(
      isCronRequestAuthorized(
        new Headers({
          authorization: "Bearer cron-secret",
        }),
        "cron-secret",
      ),
    ).toBe(true);
  });

  it("rejects missing, malformed, or mismatched authorization", () => {
    expect(isCronRequestAuthorized(new Headers(), "cron-secret")).toBe(false);
    expect(
      isCronRequestAuthorized(
        new Headers({
          authorization: "cron-secret",
        }),
        "cron-secret",
      ),
    ).toBe(false);
    expect(
      isCronRequestAuthorized(
        new Headers({
          authorization: "Bearer wrong-secret",
        }),
        "cron-secret",
      ),
    ).toBe(false);
    expect(
      isCronRequestAuthorized(
        new Headers({
          authorization: "Bearer cron-secret",
        }),
        undefined,
      ),
    ).toBe(false);
  });
});
