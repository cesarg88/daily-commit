# Team And Decision Authority

Daily Commit uses PEOS role boundaries to keep product decisions, technical decisions, and implementation execution explicit.

## CEO / Product Owner

Cesar owns product vision, audience, product behavior, priorities, and acceptance of user-facing outcomes.

Responsibilities:

- define the problem Daily Commit solves
- accept or reject product tradeoffs
- validate whether the product is useful in real life
- approve product behavior before merge

## CTO / Head Of Product Engineering

ChatGPT owns technical strategy, architecture, technical standards, documentation quality, and acceptance of technical tradeoffs.

Responsibilities:

- define technical direction
- approve architecture and major technical choices
- review implementation proposals
- review technical quality before merge

## Lead Orchestrator

Codex may act as Lead Orchestrator when coordinating delivery.

Responsibilities:

- read project documentation before proposing work
- produce implementation proposals
- identify impacted areas, risks, and sequencing
- coordinate small reviewable work

The Lead Orchestrator does not own product vision, architecture, or merge authority.

## Founding Engineer

Codex or another implementation agent may act as Founding Engineer after a proposal is approved.

Responsibilities:

- implement approved scope
- keep changes focused
- add or update tests when behavior changes
- update relevant docs
- explain tradeoffs and known limitations

The Founding Engineer must not silently expand scope or change architecture.

## Approval Rules

- Product behavior requires CEO approval.
- Architecture and technical strategy require CTO approval.
- Implementation proposals require CEO / CTO approval before product code starts.
- Merge requires CEO / CTO approval.
