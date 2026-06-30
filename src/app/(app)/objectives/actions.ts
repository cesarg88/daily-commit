"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createObjective,
  setObjectiveActiveState,
  updateObjective,
} from "@/application/use-cases/objective-catalog";
import { requireAuthenticatedFounder } from "@/data/auth/server-session";
import { createObjectiveRepositoryForUserSession } from "@/data/repositories/server-repositories";
import {
  getObjectiveId,
  parseObjectiveFormData,
} from "@/presentation/forms/objective-form";

async function getObjectiveActionContext() {
  const founder = await requireAuthenticatedFounder();

  return {
    founder,
    repository: createObjectiveRepositoryForUserSession(founder.accessToken),
  };
}

function redirectWithActionError(error: unknown): never {
  const message =
    error instanceof Error ? error.message : "Unable to save objective.";

  redirect(`/objectives?error=${encodeURIComponent(message)}`);
}

export async function createObjectiveAction(formData: FormData) {
  const { founder, repository } = await getObjectiveActionContext();

  try {
    await createObjective(
      founder.id,
      parseObjectiveFormData(formData),
      repository,
    );
  } catch (error) {
    redirectWithActionError(error);
  }

  revalidatePath("/objectives");
}

export async function updateObjectiveAction(formData: FormData) {
  const { founder, repository } = await getObjectiveActionContext();

  try {
    await updateObjective(
      founder.id,
      getObjectiveId(formData),
      parseObjectiveFormData(formData),
      repository,
    );
  } catch (error) {
    redirectWithActionError(error);
  }

  revalidatePath("/objectives");
}

export async function deactivateObjectiveAction(formData: FormData) {
  const { founder, repository } = await getObjectiveActionContext();

  await setObjectiveActiveState(
    founder.id,
    getObjectiveId(formData),
    false,
    repository,
  );
  revalidatePath("/objectives");
}

export async function reactivateObjectiveAction(formData: FormData) {
  const { founder, repository } = await getObjectiveActionContext();

  await setObjectiveActiveState(
    founder.id,
    getObjectiveId(formData),
    true,
    repository,
  );
  revalidatePath("/objectives");
}
