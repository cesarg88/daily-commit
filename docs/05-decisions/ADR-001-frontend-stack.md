# ADR-001 — Use Next.js, React, TypeScript, and Tailwind CSS for the MVP frontend

## Status

Accepted

## Date

2026-06-29

## Context

Daily Commit needs a mobile-friendly web app that can support direct progress updates, form-heavy day configuration, cross-device access, and small reviewable implementation PRs.

The MVP should avoid native-app complexity, offline-first sync, and premature backend architecture while keeping domain logic testable outside the UI.

## Decision

Use Next.js App Router, React, TypeScript, and Tailwind CSS for the MVP web application.

Use Vitest for domain tests. Add React Testing Library and Playwright when UI behavior exists.

## Rationale

Next.js provides routing, server execution, and deployment compatibility in one framework. React is appropriate for an interactive Today surface and configuration flows. TypeScript makes product rules and DTOs explicit. Tailwind CSS keeps early styling lightweight without committing to a large component system.

The domain layer must remain independent from Next.js and React.

## Consequences

### Positive

- Fast path to a mobile-friendly web MVP.
- Works naturally with Vercel hosting.
- Supports server-side orchestration for persistence and scheduled closure.
- Keeps the implementation approachable for small PRs.

### Negative

- Introduces React and Next.js framework conventions that must be kept out of domain logic.
- Requires JavaScript tooling and dependency maintenance.

### Neutral / operational

- The first implementation PR should scaffold only the minimal app, tooling, validation commands, and a placeholder route.
- The scaffold PR must not include domain models, scoring rules, persistence, authentication flows, product screens, or product feature implementation.
- UI tests should wait until real product screens exist.

## Alternatives considered

### Vite React SPA

Not selected because the MVP benefits from server-side mutations, route handlers, and Vercel Cron integration without adding a separate backend.

### Native iOS

Not selected because the MVP needs cross-device access and fast web iteration.

### SvelteKit or Remix

Not selected because Next.js has the most direct alignment with the proposed Vercel hosting path and broad ecosystem support.

## Follow-up actions

- Scaffold the minimal Next.js TypeScript app only after approval.
- Add `npm run validate` to combine lint, typecheck, test, and build.
- Keep domain logic, persistence, auth flows, product screens, and product features out of the scaffold PR.

## Related documents

- `docs/03-architecture/technical-strategy-proposal.md`
- `docs/03-architecture/technical-architecture.md`
