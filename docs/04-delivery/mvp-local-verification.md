# MVP Local Verification

Use this guide to verify the current founder MVP end to end before dogfooding or publishing changes.

## Prerequisites

- `.env.local` filled with the current Supabase project values and founder allowlist.
- Founder account available in Supabase Auth.
- Dependencies installed with `npm install`.

## Required commands

Run these before publishing:

```text
npm run validate
node scripts/validate-service-role-boundary.mjs
```

Optional persistence validation when PostgreSQL 17 is installed locally:

```text
npm run validate:persistence
```

## Core founder flow

1. Open `/login` and sign in with the allowlisted founder account.
2. Open `/objectives` and create:
   - at least 2 binary objectives;
   - at least 1 numeric objective with target and unit.
3. Open `/day` and confirm the no-objectives empty state is gone.
4. Configure a valid active day:
   - choose at least 3 base objectives;
   - keep base weight total at exactly `100%`;
   - optionally add a bonus objective.
5. Open `/today` and confirm:
   - the score cards render;
   - pending base objectives remain visible;
   - binary updates recalculate immediately;
   - numeric updates recalculate immediately.
6. Complete all base objectives and confirm the day closes.
7. Open `/week` and confirm the closed day appears as scored.

## Empty-state checks

Verify these render clearly:

- no objectives in `/objectives` and `/day`;
- no active day in `/today`;
- no scored week in `/week`.

## Basic error-state checks

Verify these return the founder to the same screen with an inline error:

- try activating a day with invalid base totals or fewer than 3 base objectives;
- try editing an active day without acknowledging the commitment change;
- exclude a day and then try updating progress from `/today`;
- temporarily break persistence or Supabase access and confirm action failures surface inline instead of silently failing.

## Mobile pass

Spot-check at a narrow viewport:

- primary navigation wraps without overlapping;
- objective rows stay readable;
- day configuration controls stack cleanly;
- Today controls remain tappable without horizontal scrolling.

## Known limitations

- founder-only single-user MVP;
- active-day edits do not preserve history;
- excluded days remain visible in weekly consistency;
- no reminders, streaks, AI, templates, integrations, or offline-first behavior.
