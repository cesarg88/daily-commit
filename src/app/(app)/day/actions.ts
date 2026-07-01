"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  excludeDay,
  saveDayConfiguration,
} from "@/application/use-cases/day-configuration";
import { requireAuthenticatedFounder } from "@/data/auth/server-session";
import {
  createDayRepositoryForUserSession,
  createObjectiveRepositoryForUserSession,
} from "@/data/repositories/server-repositories";
import { getMvpTodayDate } from "@/domain/time/mvp-timezone";
import {
  parseActiveEditAcknowledgement,
  parseSelectedDayObjectives,
} from "@/presentation/forms/day-configuration-form";
import { describeDayValidationIssues } from "@/presentation/copy/day-validation-messages";

function getDate(formData: FormData): string {
  const value = formData.get("date");

  return typeof value === "string" && value.length > 0
    ? value
    : getMvpTodayDate();
}

function redirectWithDayError(message: string): never {
  redirect(`/day?error=${encodeURIComponent(message)}`);
}

async function getDayActionContext() {
  const founder = await requireAuthenticatedFounder();

  return {
    founder,
    objectiveRepository: createObjectiveRepositoryForUserSession(
      founder.accessToken,
    ),
    dayRepository: createDayRepositoryForUserSession(founder.accessToken),
  };
}

async function saveConfiguration(
  formData: FormData,
  targetState: "draft" | "active",
) {
  try {
    const { founder, objectiveRepository, dayRepository } =
      await getDayActionContext();
    const result = await saveDayConfiguration(
      founder.id,
      {
        date: getDate(formData),
        selectedObjectives: parseSelectedDayObjectives(formData),
        targetState,
        acknowledgeActiveEdit: parseActiveEditAcknowledgement(formData),
      },
      objectiveRepository,
      dayRepository,
    );

    if (result.status === "requires-active-edit-acknowledgement") {
      redirectWithDayError("Acknowledge the active-day change before saving.");
    }

    if (result.status === "invalid") {
      redirectWithDayError(
        describeDayValidationIssues(result.validation.issues).join(" "),
      );
    }
  } catch (error) {
    redirectWithDayError(
      error instanceof Error
        ? error.message
        : "Unable to save the day configuration.",
    );
  }

  revalidatePath("/day");
}

export async function saveDraftDayAction(formData: FormData) {
  await saveConfiguration(formData, "draft");
}

export async function activateDayAction(formData: FormData) {
  await saveConfiguration(formData, "active");
}

export async function excludeDayAction(formData: FormData) {
  try {
    const { founder, dayRepository } = await getDayActionContext();

    await excludeDay(founder.id, getDate(formData), dayRepository);
  } catch (error) {
    redirectWithDayError(
      error instanceof Error ? error.message : "Unable to exclude this day.",
    );
  }

  revalidatePath("/day");
}
