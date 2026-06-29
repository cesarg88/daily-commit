# Product Discovery Canvas — Daily Commit

## 1. Product name

**Daily Commit**

Daily Commit is the working name for the product during discovery and MVP definition.

---

## 2. Product vision

Daily Commit is a personal, portable, score-based daily commitment board that helps the user keep daily goals visible, measurable, and actionable.

The product is not intended to be a generic task manager, productivity system, or habit tracker. Its purpose is to help the user stay connected to the commitments that matter today, update progress with minimal friction, and finish each day with an honest score.

The long-term product ambition is to help users build consistency by winning enough good days, one day at a time.

---

## 3. Target user

### Primary user

César, the founder and initial user of the product.

He is a Senior iOS Engineer working remotely from Madrid. He is trying to improve consistency around health, discipline, daily routine, and personal execution. He already knows many of the actions that improve his life, but he needs a clear structure, immediate feedback, and low-friction daily visibility to stay consistent.

### Relevant traits

- Needs clear daily structure.
- Responds well to immediate visual feedback.
- Benefits from short-term goals and nearby milestones.
- Can abandon systems when they become too abstract, too heavy, or too slow to provide feedback.
- Has already validated the core idea with a physical whiteboard.
- Wants to access the system from multiple devices.
- Wants to use this project as a real Product Engineering learning environment.

---

## 4. Problem statement

The user has clear daily goals, but those goals lose visibility, urgency, and weight during the day.

Traditional productivity tools are usually designed around tasks, projects, calendars, or generic habits. They do not behave like a personal daily board where the user defines a concrete commitment for the day, gives each objective a weight, tracks partial progress, and receives a clear score.

The problem is not knowing what to do. The problem is keeping the daily commitment visible, measuring progress without friction, and closing the day with an honest reading of how well the commitment was fulfilled.

---

## 5. Core problem hypotheses

### 5.1 Visibility

If daily objectives are not clearly visible throughout the day, they fade into the background and lose influence over behavior.

### 5.2 Tracking

The user can make good decisions during the day, but needs a convenient way to register completion and partial progress.

### 5.3 Consistency

The user does not need a large abstract plan. He needs to win enough good days, repeatedly.

### 5.4 Feedback

The user needs a clear signal during and after the day: how the day is going, what has been completed, what remains weak, and what score the day is likely to end with.

### 5.5 Portability

The physical whiteboard works, but it only exists in one physical location. The user needs to carry the board with him.

### 5.6 Measurable motivation

Turning habits and commitments into weighted points can help the user make better decisions during the day.

---

## 6. Product hypothesis

If the user can manually configure a daily commitment, keep it visible, update completion and partial progress with minimal friction, and receive a live score, then weekly consistency should improve because the user will have better visibility, faster feedback, and a stronger sense of daily progress.

---

## 7. Core product principle

**The app should help the user win the day, not merely record how the day went.**

This means the main experience should answer these questions quickly:

- What did I commit to today?
- How is my day going?
- What have I completed?
- What is still pending?
- Which pending objectives have the highest score impact?
- How consistent has my week been?

The Today screen must be actionable, not just informational.

---

## 8. Differentiation

Daily Commit does not primarily compete with Todoist, Notion, Apple Fitness, or traditional habit trackers.

### What it is not

- Not a project management tool.
- Not a generic checklist.
- Not a calendar.
- Not a complete health dashboard.
- Not a passive habit history.
- Not a social accountability product.

### What makes it different

Daily Commit is a personal daily commitment board. The user defines the day, assigns weights, tracks progress, and gets a score. The system focuses on the relationship between commitment, visibility, action, and honest feedback.

---

## 9. Operating roles

This project is treated as a real product initiative, even if the initial user base is one person.

### Founder / Product Owner

César.

Responsibilities:

- Own the problem and product intent.
- Validate whether the product is useful in real life.
- Decide priorities.
- Accept or reject product trade-offs.
- Provide usage feedback.

### Fractional CTO / Head of Product Engineering

ChatGPT.

Responsibilities:

- Translate user needs into product direction.
- Maintain product focus.
- Define MVP scope, risks, and trade-offs.
- Support conceptual modeling and technical architecture.
- Prepare implementation prompts for the Founding Engineer.
- Review product and technical decisions.
- Avoid unnecessary complexity.

### Founding Engineer

Codex or another implementation agent.

Responsibilities:

- Implement the product in small, reviewable increments.
- Follow product and architecture documentation.
- Create branches and pull requests.
- Write tests where appropriate.
- Propose technical trade-offs when required.
- Ask for clarification when behavior is ambiguous.

---

## 10. MVP scope

### Must have

- Create configurable objectives.
- Edit existing objectives.
- Temporarily deactivate objectives.
- Configure each day manually.
- Select which objectives apply to the current day.
- Assign weight to base objectives.
- Support bonus objectives.
- Validate that base objectives sum to 100%.
- Require at least 3 base objectives before a day can be activated.
- Activate the day once configured.
- Allow active days to be edited, while making it clear that this changes the original commitment.
- Mark binary objectives as completed or not completed.
- Update numeric objectives with partial progress.
- Calculate proportional contribution for numeric objectives.
- Calculate base score.
- Calculate bonus score.
- Calculate final daily score capped at 100%.
- Let bonus objectives compensate globally in the MVP.
- Show the Today screen as the main execution surface.
- Allow progress updates directly from the Today screen.
- Automatically close the day when all base objectives are completed.
- Automatically close the day at midnight.
- Show a basic weekly summary.
- Calculate weekly performance based only on scored days.
- Show weekly consistency separately from weekly performance.
- Use Monday as the first day of the week.
- Persist data reliably.
- Work well on mobile web.

### Should have

- Basic streaks.
- Visual calendar.
- Objective-level statistics.
- Manual reminders.
- Cross-device sync.

### Could have

- Offline support.
- Apple Health integration.
- Apple Watch integration.
- Yazio integration.
- Smart notifications.
- Minimum number of good days per week.
- Day templates.
- Daily reflection.
- Weekly insights.
- Travel, injury, or recovery modes.

### Won't have in the MVP

- AI features.
- Social features.
- Sharing progress.
- Multiple user profiles.
- Public habit templates.
- Complex gamification.
- Automatic health integrations.
- Predefined day templates.
- Mandatory daily reflection.
- Change history for active day edits.
- Objective-specific bonus compensation rules.

---

## 11. Core user journey

### 11.1 Create reusable objectives

The user creates base objectives that can later be selected for a specific day.

Examples:

- Gym strength training.
- Spinning.
- 160 g protein.
- Track food in Yazio.
- Close Apple Watch rings.
- Work standing for 3 hours.
- Drink 2 liters of water.
- Eat 2 pieces of fruit.

---

### 11.2 Configure the day manually

The user selects which objectives apply today.

Base objectives must sum to exactly 100%.

A day requires at least 3 base objectives before it can be activated. This prevents weak configurations where one small objective can represent the entire day.

Bonus objectives are optional and may make the total available score greater than 100%, but the final score is capped at 100%.

Example:

Base objectives:

- Gym: 25%
- Protein: 20%
- Yazio: 15%
- Water: 10%
- Fruit: 10%
- Apple Watch rings: 10%
- Standing work: 10%

Base total: 100%

Bonus objective:

- Spinning: +15%

---

### 11.3 Activate the day

Once the day is configured and valid, the user activates it.

After activation, the product shifts from planning mode to execution mode.

An active day can still be edited in the MVP, but editing it should be presented as changing the original commitment rather than as a neutral update.

---

### 11.4 Execute during the day

The user opens the app and sees:

- Current final score.
- Base score.
- Bonus score applied.
- Completed objectives.
- Pending objectives.
- Partial progress.
- Score impact of pending objectives.
- Direct controls to update progress.

The Today screen must allow direct action.

Examples:

- Tap a checkbox to mark Gym as completed.
- Increase water from 1.0 L to 1.5 L.
- Update protein from 90 g to 130 g.
- Increase fruit from 1/2 to 2/2.

---

### 11.5 Close the day

The day closes automatically when one of these conditions is met:

1. All base objectives are fully completed.
2. Midnight arrives.

The day must not close automatically just because bonus objectives bring the final score to 100%.

This distinction keeps the original daily commitment visible even when bonus work compensates for missed base objectives.

---

### 11.6 Mark a day as excluded

The user can explicitly mark a day as excluded, for example as a rest day.

An excluded day does not count toward weekly performance.

This is different from an unconfigured day.

- Unconfigured means the day never entered the system.
- Excluded means the user intentionally decided the day should not be scored.

---

### 11.7 Review the week

The user reviews:

- Weekly performance score.
- Number of scored days.
- Number of excluded days.
- Number of unconfigured days.
- Scores per day.

Weekly performance and weekly consistency must be shown separately.

Weeks start on Monday.

---

## 12. Objective types

### 12.1 Binary objective

A binary objective is either completed or not completed.

Examples:

- Gym.
- Spinning.
- Track food in Yazio.
- Close Apple Watch rings.

Calculation:

- 0% of its weight if not completed.
- 100% of its weight if completed.

---

### 12.2 Numeric objective

A numeric objective has a target value and a current value.

Examples:

- 160 g protein.
- 2 liters of water.
- 3 hours standing.
- 2 pieces of fruit.

Calculation:

```text
contribution = min(currentValue / targetValue, 1) * weight
```

Example:

- Objective: 160 g protein.
- Weight: 20%.
- Progress: 120 g.

```text
120 / 160 = 0.75
0.75 * 20 = 15
```

Score contribution: 15%.

---

## 13. Score model

### 13.1 Base score

Base objectives define the core daily commitment and must sum to 100%.

```text
baseScore = sum(base objective contributions)
```

### 13.2 Bonus score

Bonus objectives are optional and can compensate for missed base points.

In the MVP, bonus compensation is global. Bonus points apply to the daily score as a whole, not to specific base objectives.

```text
bonusScore = sum(bonus objective contributions)
```

### 13.3 Final daily score

The final daily score is capped at 100%.

```text
finalScore = min(baseScore + bonusScore, 100)
```

The product may still show earned bonus separately.

Example:

```text
Base: 70 / 100
Bonus applied: +20
Final score: 90%
```

If base score is 100 and bonus earned is +10:

```text
Base: 100 / 100
Bonus earned: +10
Final score: 100%
```

The score remains 100%, but the extra effort can still be recognized.

---

## 14. Day states

### Unconfigured

No daily commitment has been created for this day.

The day does not count toward weekly performance.

### Draft

The day is being configured but is not active yet.

### Active

The day has been configured and is in execution mode.

An active day can be edited in the MVP, but the experience should make it clear that the original commitment is being changed.

### Closed

The day has ended and has a final score.

A day can close automatically when all base objectives are completed or when midnight arrives.

### Excluded

The user explicitly decided the day should not be scored.

Example: rest day.

Excluded days do not count toward weekly performance, but they should be visible in the weekly review.

---

## 15. Weekly model

Daily Commit separates weekly performance from weekly consistency.

Weeks start on Monday.

### 15.1 Weekly performance

Weekly performance is the average of scored days only.

Unconfigured days and excluded days do not count toward this average.

Example:

| Day | State | Score | Counts toward performance |
| --- | --- | ---: | --- |
| Monday | Closed | 80% | Yes |
| Tuesday | Closed | 100% | Yes |
| Wednesday | Unconfigured | — | No |
| Thursday | Excluded | — | No |
| Friday | Closed | 60% | Yes |
| Saturday | Closed | 90% | Yes |
| Sunday | Excluded | — | No |

```text
weeklyPerformance = (80 + 100 + 60 + 90) / 4 = 82.5%
```

### 15.2 Weekly consistency

Weekly consistency shows how much of the week entered the system.

Example:

```text
Scored days: 4 / 7
Excluded days: 2
Unconfigured days: 1
```

This prevents a misleading interpretation of a high weekly performance score based on very few scored days.

---

## 16. Main screens

### Today

The primary screen.

It should answer:

- What is today's commitment?
- What is my current score?
- What is complete?
- What is pending?
- What should I update now?
- What has the biggest impact on the day?

It must also allow direct updates to objectives.

### Configure Day

The screen where the user manually builds the daily commitment.

It should support:

- Selecting objectives.
- Setting objective weights.
- Marking objectives as base or bonus.
- Validating that base objectives sum to 100%.
- Validating that at least 3 base objectives are selected.
- Activating the day.
- Marking the day as excluded.

### Objectives

The screen for managing reusable objectives.

It should support:

- Create objective.
- Edit objective.
- Activate objective.
- Deactivate objective.
- Define objective type.
- Define target value and unit for numeric objectives.

### Week

The weekly review screen.

It should show:

- Performance score.
- Consistency.
- Daily states.
- Daily scores.
- Excluded days.
- Unconfigured days.

---

## 17. Success metrics

Because this is initially a personal product, metrics should be simple and behavior-oriented.

### Product usage metrics

- Days configured per week.
- Days scored per week.
- Days explicitly excluded per week.
- App opens per day.
- Objective updates per day.
- Percentage of objectives updated during the day.
- Time needed to update an objective.

### Outcome metrics

- Average weekly performance.
- Weekly consistency.
- Number of days with score >= 75%.
- Completion rate per objective.
- Evolution of performance over several weeks.

### Primary leading indicator

Configured or explicitly excluded days per week.

If the user does not configure or intentionally exclude days, the product is not being used as a daily commitment system.

---

## 18. Main risks

### 18.1 Configuration friction

If configuring the day takes too long, the user may abandon the system.

### 18.2 Excessive flexibility

If everything is configurable, the product can become harder to use than the physical whiteboard.

### 18.3 Self-deception

If the user can freely modify commitments during execution, the score may stop being honest.

### 18.4 Bonus abuse

If bonus objectives compensate too much, the user may avoid important base commitments while still obtaining a high score.

### 18.5 Weak feedback

If the score is not instantly understandable, the main value proposition is weakened.

### 18.6 Poor mobile experience

If updating objectives on mobile is slow, the physical board remains superior.

### 18.7 Premature complexity

Offline support, integrations, streaks, and analytics could distract from validating the core loop.

---

## 19. Product constraints

- The product starts as a single-user product.
- Documentation must be written in English.
- The product should be treated as a real product initiative.
- The MVP should prioritize the core loop over advanced features.
- Mobile web experience is mandatory.
- Offline support is not a hard MVP requirement yet.
- The product should be designed so offline support can be evaluated later.
- Implementation should happen in small, reviewable increments.

---

## 20. Decision backlog

This section tracks remaining product questions and explicitly separates accepted MVP behavior from deferred decisions.

### Decided for MVP

- Active days can be edited, but the UI must make it clear that editing changes the original commitment.
- The MVP does not need to record a change history when an active day is edited.
- A day requires at least 3 base objectives before it can be activated.
- Bonus objectives compensate globally in the MVP, not against specific base objectives.
- Weeks start on Monday.

### Deferred

- Define whether some base objectives should be non-compensable by bonus objectives.
- Define a maximum recommended or enforced weight for bonus objectives.
- Define score thresholds for labels such as poor, acceptable, good, and excellent day.
- Define streak rules.
- Decide whether unconfigured days break streaks.
- Decide whether excluded days pause streaks.
- Decide when cross-device sync enters the roadmap.
