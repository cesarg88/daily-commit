# Daily Commit

Daily Commit is a personal daily commitment board designed to help me keep my daily goals visible, measurable, and actionable.

The product is inspired by a physical whiteboard system where each day contains a set of objectives. Each objective can be completed fully or partially, contributes to a daily score, and helps build consistency over time.

## Product Intent

This is not a generic task manager or habit tracker.

The goal is to create a personal, portable, score-based daily board that helps answer:

- What did I commit to today?
- How is my day going?
- What is still pending?
- What is my current score?
- How consistent was my week?

## Current Phase

Implementation complete for the current rules-engine MVP.

The current app covers the founder loop across authentication, objective catalog, day configuration, Today execution, day closure, and weekly review. It is ready for founder dogfooding as a rules-engine MVP, not yet as a fully polished or low-friction product.

## Documentation

- `docs/00-product/` — product vision, discovery, principles and decisions
- `docs/01-requirements/` — MVP scope, user flows and user stories
- `docs/02-design/` — UX, screens and information architecture
- `docs/03-architecture/` — conceptual model, data model and technical architecture
- `docs/04-delivery/` — delivery breakdown, implementation plan, milestones and backlog
- `docs/05-decisions/` — architecture/product decision records

Start delivery review with `docs/04-delivery/delivery-breakdown.md`.

Implementation PR review handling is documented in `docs/04-delivery/review-workflow.md`.

## Local Development

```text
npm install
cp .env.example .env.local
npm run dev
npm run test
npm run lint
npm run typecheck
npm run validate
node scripts/validate-service-role-boundary.mjs
```

Environment variable names are documented in `.env.example`. Do not commit `.env.local`.

For the current MVP pass, also see:

- `docs/04-delivery/mvp-local-verification.md`
- `docs/04-delivery/founder-dogfooding-checklist.md`
- `docs/04-delivery/mvp-dogfooding-start.md`

## Known limitations

- Founder-only single-user app.
- No AI, templates, reminders, integrations, streaks, or offline-first support.
- Active-day edits do not keep change history.
