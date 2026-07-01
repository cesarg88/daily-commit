import { beforeEach, describe, expect, it, vi } from "vitest";

const redirectMock = vi.fn((url: string) => {
  throw new Error(`redirect:${url}`);
});
const revalidatePathMock = vi.fn();
const requireAuthenticatedFounderMock = vi.fn();
const createObjectiveRepositoryForUserSessionMock = vi.fn();
const createDayRepositoryForUserSessionMock = vi.fn();
const saveDayConfigurationMock = vi.fn();
const excludeDayMock = vi.fn();
const parseSelectedDayObjectivesMock = vi.fn();
const parseActiveEditAcknowledgementMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("@/data/auth/server-session", () => ({
  requireAuthenticatedFounder: requireAuthenticatedFounderMock,
}));

vi.mock("@/data/repositories/server-repositories", () => ({
  createObjectiveRepositoryForUserSession:
    createObjectiveRepositoryForUserSessionMock,
  createDayRepositoryForUserSession: createDayRepositoryForUserSessionMock,
}));

vi.mock("@/application/use-cases/day-configuration", () => ({
  saveDayConfiguration: saveDayConfigurationMock,
  excludeDay: excludeDayMock,
}));

vi.mock("@/presentation/forms/day-configuration-form", () => ({
  parseSelectedDayObjectives: parseSelectedDayObjectivesMock,
  parseActiveEditAcknowledgement: parseActiveEditAcknowledgementMock,
}));

describe("day actions", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    requireAuthenticatedFounderMock.mockResolvedValue({
      id: "founder-1",
      accessToken: "token",
    });
    createObjectiveRepositoryForUserSessionMock.mockReturnValue({
      kind: "objective-repository",
    });
    createDayRepositoryForUserSessionMock.mockReturnValue({
      kind: "day-repository",
    });
    parseSelectedDayObjectivesMock.mockReturnValue([]);
    parseActiveEditAcknowledgementMock.mockReturnValue(false);
  });

  it("redirects invalid activation with the validation message", async () => {
    saveDayConfigurationMock.mockResolvedValue({
      status: "invalid",
      validation: {
        isValid: false,
        baseObjectiveCount: 2,
        baseWeightTotal: 90,
        issues: [{ code: "insufficient-base-objectives" }],
      },
    });
    const formData = new FormData();
    formData.set("date", "2026-07-01");
    const { activateDayAction } = await import("./actions");

    await expect(activateDayAction(formData)).rejects.toThrow(
      "redirect:/day?error=Choose%20at%20least%203%20base%20objectives.",
    );
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("redirects active-day edit without acknowledgement with the intended message", async () => {
    saveDayConfigurationMock.mockResolvedValue({
      status: "requires-active-edit-acknowledgement",
    });
    const formData = new FormData();
    formData.set("date", "2026-07-01");
    const { activateDayAction } = await import("./actions");

    await expect(activateDayAction(formData)).rejects.toThrow(
      "redirect:/day?error=Acknowledge%20the%20active-day%20change%20before%20saving.",
    );
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("surfaces unexpected persistence errors as inline error redirects", async () => {
    saveDayConfigurationMock.mockRejectedValue(
      new Error("Database unavailable."),
    );
    const formData = new FormData();
    formData.set("date", "2026-07-01");
    const { saveDraftDayAction } = await import("./actions");

    await expect(saveDraftDayAction(formData)).rejects.toThrow(
      "redirect:/day?error=Database%20unavailable.",
    );
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });
});
