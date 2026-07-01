"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateTodayProgress } from "@/application/use-cases/today-execution";
import { requireAuthenticatedFounder } from "@/data/auth/server-session";
import {
  createDayRepositoryForUserSession,
  createScoreSnapshotRepositoryForUserSession,
} from "@/data/repositories/server-repositories";
import { parseTodayProgressUpdate } from "@/presentation/forms/today-progress-form";

function redirectWithTodayError(message: string): never {
  redirect(`/today?error=${encodeURIComponent(message)}`);
}

export async function updateTodayProgressAction(formData: FormData) {
  let result;

  try {
    const founder = await requireAuthenticatedFounder();
    result = await updateTodayProgress(
      founder.id,
      parseTodayProgressUpdate(formData),
      createDayRepositoryForUserSession(founder.accessToken),
      createScoreSnapshotRepositoryForUserSession(founder.accessToken),
    );
  } catch (error) {
    redirectWithTodayError(
      error instanceof Error
        ? error.message
        : "Unable to update today's progress.",
    );
  }

  if (result.status === "not-active") {
    redirectWithTodayError("Activate today's commitment before updating it.");
  }

  if (result.status === "objective-not-found") {
    redirectWithTodayError("That objective is not part of today's commitment.");
  }

  revalidatePath("/today");
}
