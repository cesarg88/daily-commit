import { getDayConfiguration } from "@/application/use-cases/day-configuration";
import { requireAuthenticatedFounder } from "@/data/auth/server-session";
import {
  createDayRepositoryForUserSession,
  createObjectiveRepositoryForUserSession,
} from "@/data/repositories/server-repositories";
import { getMvpTodayDate } from "@/domain/time/mvp-timezone";
import { DayConfigurationView } from "@/presentation/components/day-configuration";
import {
  activateDayAction,
  excludeDayAction,
  saveDraftDayAction,
} from "./actions";

type DayConfigurationPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getStringParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DayConfigurationPage({
  searchParams,
}: DayConfigurationPageProps) {
  const params = (await searchParams) ?? {};
  const founder = await requireAuthenticatedFounder();
  const model = await getDayConfiguration(
    founder.id,
    getMvpTodayDate(),
    createObjectiveRepositoryForUserSession(founder.accessToken),
    createDayRepositoryForUserSession(founder.accessToken),
  );

  return (
    <DayConfigurationView
      activateAction={activateDayAction}
      errorMessage={getStringParam(params.error)}
      excludeAction={excludeDayAction}
      model={model}
      saveDraftAction={saveDraftDayAction}
    />
  );
}
