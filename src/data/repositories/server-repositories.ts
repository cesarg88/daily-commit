import "server-only";

import { SupabaseDayRepository } from "./supabase-day-repository";
import { SupabaseObjectiveRepository } from "./supabase-objective-repository";
import { SupabaseScoreSnapshotRepository } from "./supabase-score-snapshot-repository";
import {
  createSupabaseAuthenticatedServerClient,
  createSupabaseServiceRoleClient,
} from "../supabase/server-clients";

export function createObjectiveRepositoryForUserSession(accessToken: string) {
  return new SupabaseObjectiveRepository(
    createSupabaseAuthenticatedServerClient(accessToken),
  );
}

export function createDayRepositoryForUserSession(accessToken: string) {
  return new SupabaseDayRepository(
    createSupabaseAuthenticatedServerClient(accessToken),
  );
}

export function createScoreSnapshotRepositoryForUserSession(
  accessToken: string,
) {
  return new SupabaseScoreSnapshotRepository(
    createSupabaseAuthenticatedServerClient(accessToken),
  );
}

export function createDayRepositoryForServiceRole() {
  return new SupabaseDayRepository(createSupabaseServiceRoleClient());
}

export function createScoreSnapshotRepositoryForServiceRole() {
  return new SupabaseScoreSnapshotRepository(createSupabaseServiceRoleClient());
}
