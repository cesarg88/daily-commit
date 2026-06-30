import { listObjectiveCatalog } from "@/application/use-cases/objective-catalog";
import { requireAuthenticatedFounder } from "@/data/auth/server-session";
import { createObjectiveRepositoryForUserSession } from "@/data/repositories/server-repositories";
import { ObjectiveCatalogView } from "@/presentation/components/objective-catalog";
import {
  createObjectiveAction,
  deactivateObjectiveAction,
  reactivateObjectiveAction,
  updateObjectiveAction,
} from "./actions";

type ObjectivesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getStringParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ObjectivesPage({
  searchParams,
}: ObjectivesPageProps) {
  const params = (await searchParams) ?? {};
  const founder = await requireAuthenticatedFounder();
  const repository = createObjectiveRepositoryForUserSession(
    founder.accessToken,
  );
  const catalog = await listObjectiveCatalog(founder.id, repository);

  return (
    <ObjectiveCatalogView
      createAction={createObjectiveAction}
      deactivateAction={deactivateObjectiveAction}
      errorMessage={getStringParam(params.error)}
      inactiveCount={catalog.inactiveObjectives.length}
      objectives={catalog.objectives}
      reactivateAction={reactivateObjectiveAction}
      updateAction={updateObjectiveAction}
    />
  );
}
