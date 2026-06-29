# PEOS

PEOS means Product Engineering Operating System.

Its purpose is to give product teams a small, reusable workflow for building software with AI agents while preserving human ownership of product and technical decisions.

## Core Principle

Humans own decisions. AI owns execution.

AI may propose plans, designs, tradeoffs, and implementation paths. Humans approve direction before work proceeds.

## Workflow Overview

1. Define product intent and constraints.
2. Approve technical strategy and architecture.
3. Produce an implementation proposal for a small unit of work.
4. Get CEO/CTO approval before implementation starts.
5. Let specialized agents implement the approved scope.
6. Review product behavior, architecture, tests, and maintainability.
7. Merge only after human approval.

## Decisions And Execution

PEOS separates decisions from execution so agents can move quickly without silently changing product or architecture direction.

Agents are expected to:

- read the project context
- identify affected areas
- propose implementation plans
- implement approved work
- surface risks and tradeoffs

Agents are not expected to:

- redefine product vision
- change technical strategy
- expand scope without approval
- merge their own work

This keeps AI useful as an execution layer while leaving accountability with the people responsible for the product.
