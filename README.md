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

Implementation — PR 1 Scaffold & Tooling.

Product discovery, MVP definition, Technical Strategy, and Delivery Breakdown are approved. Current implementation must stay within the approved PR 1 scaffold constraints.

## Documentation

- `docs/00-product/` — product vision, discovery, principles and decisions
- `docs/01-requirements/` — MVP scope, user flows and user stories
- `docs/02-design/` — UX, screens and information architecture
- `docs/03-architecture/` — conceptual model, data model and technical architecture
- `docs/04-delivery/` — delivery breakdown, implementation plan, milestones and backlog
- `docs/05-decisions/` — architecture/product decision records

Start delivery review with `docs/04-delivery/delivery-breakdown.md`.

## Local Development

```text
npm install
npm run dev
npm run test
npm run lint
npm run typecheck
npm run validate
```

Environment variable names are documented in `.env.example`. Do not commit `.env.local`.
