# Product Principles — Daily Commit

This document defines the principles that should guide product, design, and engineering decisions for Daily Commit.

These principles are intentionally practical. They should help decide what to build, what to postpone, and what to reject.

---

## P001 — Help the user win the day

Daily Commit should help the user act during the current day, not merely analyze past behavior.

The product should always prioritize the question:

> What helps the user make a better decision today?

---

## P002 — The day is the main surface of accountability

The day is the primary unit of commitment, execution, scoring, and review.

Objectives are reusable, but they only become meaningful when selected for a specific day.

---

## P003 — Visibility beats memory

The product exists because important commitments can fade during the day.

The UI should make the current commitment visible without requiring the user to remember it.

---

## P004 — The Today screen must be actionable

Today is not a reporting dashboard.

It must allow the user to update objectives directly, with minimal friction.

A user should be able to open the app, update progress, understand the score impact, and leave quickly.

---

## P005 — The score must stay honest

The score should motivate without hiding reality.

Bonus objectives may improve the score, but incomplete base objectives must remain visible.

The product should avoid mechanics that make it easy to protect the score by weakening the original commitment.

---

## P006 — Flexibility should not destroy commitment

The product should allow rest days, excluded days, bonus objectives, and active-day edits.

However, flexibility must be explicit. The user should understand when they are changing the original commitment rather than simply updating progress.

---

## P007 — Clarity over completeness

The product should prefer clear, limited behavior over broad but vague configurability.

If a feature makes the system harder to understand, it should be postponed until the core loop is validated.

---

## P008 — Low friction is a product requirement

The physical whiteboard is simple. The digital product must not feel heavier.

Daily configuration, progress updates, and weekly review should be fast enough to become part of the routine.

---

## P009 — Separate performance from consistency

A high score based on only a few active days can be misleading.

The product should always distinguish:

- performance: how well scored days went;
- consistency: how many days entered the system.

---

## P010 — Build for one real user before generalizing

The MVP is for the founder first.

Product decisions should solve the real current problem before introducing abstractions for future users.

---

## P011 — Documentation should shape delivery

Important product and technical decisions should be documented before implementation.

The Founding Engineer should be able to understand intent, constraints, and trade-offs from the repository documentation.
