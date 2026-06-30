import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("day closure cron route", () => {
  it("rejects unauthorized cron requests", async () => {
    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://daily-commit.test/api/cron/day-closure", {
        headers: {
          authorization: "Bearer wrong-secret",
        },
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Unauthorized",
    });
  });
});
