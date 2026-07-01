# MVP Dogfooding Start

## Status

The current Daily Commit implementation is ready for founder dogfooding as a rules-engine MVP.

At this stage, the app has enough functionality to run the core Daily Commit loop locally:

- founder authentication;
- objective catalog;
- day configuration;
- active day execution in Today;
- day closure;
- weekly review.

This should be treated as the close of the current implementation phase.

It is suitable for founder dogfooding, not for broader release.

## What "ready" means in this phase

Ready in this phase means:

- the app can be run locally with the current founder-only setup;
- the core rules around scoring, activation, closure, and weekly review are implemented;
- the founder can use the app in real daily life and capture friction in the current flow.

Ready in this phase does not mean:

- polished UI;
- low-friction product flow;
- polished or low-friction usable product readiness;
- broader user readiness;
- production launch readiness beyond the limited founder MVP.

## Local run checklist

Use this checklist before starting a dogfooding pass.

### Environment setup

- Run `npm install`.
- Copy `.env.example` to `.env.local`.
- Fill `.env.local` with the current Supabase project values.
- Confirm the founder allowlist values are present in `.env.local`.
- Do not commit `.env.local`.

### Supabase and founder prerequisites

- The Supabase project for the MVP is available and reachable from the local machine.
- The current database schema and RLS policies are already applied in that project.
- A founder account exists in Supabase Auth.
- The founder account email matches the allowlisted founder configuration used by the app.

### Validation commands

Run:

```text
npm run validate
node scripts/validate-service-role-boundary.mjs
```

Optional when PostgreSQL 17 is installed locally:

```text
npm run validate:persistence
```

See `docs/04-delivery/mvp-local-verification.md` for the broader end-to-end verification pass.

### Local startup

Run:

```text
npm run dev
```

Then:

1. Open the local app URL shown by Next.js.
2. Sign in through `/login` with the founder account.
3. Walk the dogfooding loop below.

## First founder dogfooding protocol

Use this short loop for the first real pass.

1. Create objectives in `/objectives`.
   - Add at least 3 base-capable objectives.
   - Include at least 1 numeric objective.
2. Configure a day in `/day`.
   - Choose at least 3 base objectives.
   - Set base weights to exactly `100%`.
   - Optionally add a bonus objective.
3. Activate the day.
4. Update `/today` during the day.
   - Mark binary objectives complete as work happens.
   - Update numeric progress in the same flow.
5. Complete the day naturally.
   - Complete base objectives when they are truly done.
   - It is acceptable to leave some base objectives incomplete if that reflects reality.
6. Verify day closure.
   - Confirm the day closes when base completion rules are met.
   - If the day is not completed, confirm closure behavior still reflects the current MVP rules.
7. Review the week in `/week`.
   - Confirm the closed day appears correctly.
   - Review performance versus consistency.

## Feedback to capture during dogfooding

Capture notes every time the founder hesitates, compensates, or feels pulled out of flow.

Track explicitly:

- friction in configuring a day;
- whether objective weights require too much manual arithmetic;
- whether draft saving feels too strict;
- whether suggested objective weight creates cognitive load;
- whether editing an active day is discoverable;
- whether labels like `Reopen` are ambiguous;
- whether Today feels like the main daily surface;
- whether the visual and UI quality is sufficient for daily use;
- any moment where the founder has to stop and think.

Use `docs/04-delivery/founder-dogfooding-checklist.md` as the daily companion checklist during the pass.

## Known MVP limitations

The current MVP intentionally does not include:

- polished UI;
- automatic weight distribution;
- advanced onboarding;
- analytics;
- streaks;
- reminders;
- AI;
- templates;
- integrations;
- offline-first support;
- multi-user support.

This phase should be understood as a rules-engine MVP with enough product surface to test the real daily loop, not as a fully polished or low-friction usable product.

## Next phase recommendation

Findings from this dogfooding pass should be converted into a future epic, not active implementation in this PR:

- `Epic — Founder Usable MVP`

That future epic should turn the current rules-engine MVP into a low-friction daily product flow without expanding into broader post-MVP scope prematurely.
