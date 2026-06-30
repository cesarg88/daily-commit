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
  const founder = await requireAuthenticatedFounder();
  const result = await updateTodayProgress(
    founder.id,
    parseTodayProgressUpdate(formData),
    createDayRepositoryForUserSession(founder.accessToken),
    createScoreSnapshotRepositoryForUserSession(founder.accessToken),
  );

  if (result.status === "not-active") {
    redirectWithTodayError("Activate today's commitment before updating it.");
  }

  if (result.status === "objective-not-found") {
    redirectWithTodayError("That objective is not part of today's commitment.");
  }

  revalidatePath("/today");
}
