import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ObjectiveCatalogView } from "./objective-catalog";
import { DayConfigurationView } from "./day-configuration";
import { TodayExecutionView } from "./today-execution";
import { WeeklyReviewView } from "./weekly-review";

function noopAction() {
  return Promise.resolve();
}

describe("MVP hardening states", () => {
  it("renders the no-objectives empty state in the catalog", () => {
    const markup = renderToStaticMarkup(
      <ObjectiveCatalogView
        createAction={noopAction}
        deactivateAction={noopAction}
        inactiveCount={0}
        objectives={[]}
        reactivateAction={noopAction}
        updateAction={noopAction}
      />,
    );

    expect(markup).toContain("No active objectives yet.");
  });

  it("renders the no-active-day empty state in Today", () => {
    const markup = renderToStaticMarkup(
      <TodayExecutionView
        model={{
          date: "2026-07-01",
          day: null,
          objectives: [],
          baseObjectives: [],
          bonusObjectives: [],
          pendingBaseObjectives: [],
          score: {
            baseScore: 0,
            bonusScore: 0,
            finalScore: 0,
          },
          canUpdateProgress: false,
        }}
        updateProgressAction={noopAction}
      />,
    );

    expect(markup).toContain("No active commitment");
    expect(markup).toContain("Configure today");
  });

  it("renders the no-scored-week empty state", () => {
    const markup = renderToStaticMarkup(
      <WeeklyReviewView
        model={{
          containingDate: "2026-07-01",
          summary: {
            range: {
              startDate: "2026-06-29",
              endDate: "2026-07-05",
              dates: [
                "2026-06-29",
                "2026-06-30",
                "2026-07-01",
                "2026-07-02",
                "2026-07-03",
                "2026-07-04",
                "2026-07-05",
              ],
            },
            days: [
              { date: "2026-06-29", state: "unconfigured" },
              { date: "2026-06-30", state: "unconfigured" },
              { date: "2026-07-01", state: "unconfigured" },
              { date: "2026-07-02", state: "unconfigured" },
              { date: "2026-07-03", state: "unconfigured" },
              { date: "2026-07-04", state: "unconfigured" },
              { date: "2026-07-05", state: "unconfigured" },
            ],
            performance: {
              averageScore: null,
              scoredDayCount: 0,
            },
            consistency: {
              scoredDayCount: 0,
              excludedDayCount: 0,
              unconfiguredDayCount: 7,
              totalDayCount: 7,
            },
          },
        }}
      />,
    );

    expect(markup).toContain("No scored days yet");
  });

  it("renders inline error feedback for invalid operations", () => {
    const markup = renderToStaticMarkup(
      <DayConfigurationView
        activateAction={noopAction}
        errorMessage="Choose at least 3 base objectives."
        excludeAction={noopAction}
        model={{
          date: "2026-07-01",
          day: null,
          activeObjectives: [],
          selectedObjectives: [],
          validation: {
            isValid: false,
            baseObjectiveCount: 0,
            baseWeightTotal: 0,
            issues: [{ code: "insufficient-base-objectives" }],
          },
          requiresActiveEditAcknowledgement: false,
        }}
        saveDraftAction={noopAction}
      />,
    );

    expect(markup).toContain("Choose at least 3 base objectives.");
    expect(markup).toContain(
      "Create active objectives before configuring a day.",
    );
  });
});
