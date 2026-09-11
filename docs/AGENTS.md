# SAHYOG — AI Agent Instructions

> **Purpose:** Give the AI coding agent a clear understanding of how to build, modify, test, and maintain SAHYOG.

---

# 1. Project Context

**SAHYOG** is a cooperative-powered service platform connecting customers with verified skilled workers while helping cooperatives manage and intelligently plan their workforce.

The AI agent must treat the project documentation as the source of truth for product scope, design, architecture, rules, decisions, memory, and testing.

---

# 2. Documentation System

The project uses eight core documents:

**PRD**
↓
Product requirements, users, features, MVP scope

**AGENTS**
↓
AI coding instructions and working behaviour

**DESIGN**
↓
UI/UX system, visual language, components

**ARCHITECTURE**
↓
Frontend, backend, database, APIs and system structure

**RULES**
↓
Coding standards and project conventions

**MEMORY**
↓
Current project state and important context

**DECISIONS**
↓
Important decisions and the reasons behind them

**TESTING**
↓
Quality checks and verification requirements

---

# 3. Before Coding

Before implementing a meaningful feature:

1. Understand the user's request.
2. Read the relevant section of `PRD.md`.
3. Check `ARCHITECTURE.md` for technical structure.
4. Check `DESIGN.md` for frontend/UI work.
5. Check `RULES.md` for coding conventions.
6. Check `DECISIONS.md` for previous decisions.
7. Check `MEMORY.md` for the current project state.
8. Check `TESTING.md` for relevant quality checks.

Do not make major assumptions when the documentation already defines the requirement.

---

# 4. Product Priorities

Every feature should support one or more of these goals:

* **Customer Trust**
* **Worker Empowerment**
* **Cooperative Workforce Management**
* **Intelligent Worker Matching**
* **Workforce Planning**
* **Demo Clarity**

Do not add unnecessary features just because they seem interesting.

---

# 5. MVP Golden Flow

The most important flow is:

**Customer Request**
↓
**Smart Matching**
↓
**Worker Receives Request**
↓
**Worker Accepts**
↓
**Worker Starts Service**
↓
**Worker Completes Service**
↓
**Customer Sees Completion**

This flow must remain functional before spending significant effort on secondary features.

---

# 6. MVP Priority Levels

## P0 — Core

* Customer experience
* Worker experience
* Service discovery
* Booking
* Smart matching
* Worker request
* Accept/reject
* Service start
* Service completion
* Feedback
* Service history

## P1 — Important

* Worker training
* YouTube learning links
* MCQ tests
* Certificates
* KYC demo
* Admin verification
* Disputes
* Payment demo
* Invoice
* Basic analytics

## P2 — Advanced

* AI image estimation
* Demand forecasting
* Voice navigation
* Welfare features
* Advanced analytics

---

# 7. Implementation Philosophy

Build the **simplest reliable implementation** that satisfies the requirement.

## Prefer

* Reusable components
* Clear architecture
* Small focused modules
* Type-safe code where applicable
* Reusable API services
* Centralized configuration
* Environment variables
* Consistent naming
* Explicit error handling
* Loading states
* Empty states
* Error states

## Avoid

* Unnecessary dependencies
* Duplicate logic
* Hardcoded secrets
* Hardcoded API keys
* Duplicate components
* Unnecessary abstractions
* Over-engineering
* Unrequested features

---

# 8. Frontend Rules

SAHYOG contains three major interfaces:

**Customer App**
↓
Service discovery → Booking → Tracking → Feedback

**Worker App**
↓
Skills → Training → Availability → Jobs → Earnings

**Admin / Cooperative Panel**
↓
Verification → Workforce → Allocation → Analytics

When building frontend features:

* Follow `DESIGN.md`.
* Keep interfaces responsive.
* Prioritize usability.
* Keep important actions obvious.
* Maintain consistent navigation.
* Implement loading, empty, and error states.
* Support Hindi and English where required.
* Do not copy proprietary branding or assets.

---

# 9. Backend Rules

Backend implementation must follow `ARCHITECTURE.md`.

APIs should:

* Validate input.
* Return predictable responses.
* Handle errors properly.
* Protect sensitive information.
* Apply authentication and authorization where required.
* Keep business logic reusable.

Avoid duplicating business logic across multiple endpoints.

---

# 10. Database Rules

Before adding a table or field:

1. Check existing data structures.
2. Reuse existing structures where appropriate.
3. Avoid duplicate representations of the same data.
4. Keep relationships clear.
5. Consider effects on APIs and frontend flows.

Do not make destructive database changes without explicit approval.

---

# 11. AI Features

AI should provide **real product value**, not exist only for presentation.

AI features should be:

* Explainable
* Practical
* Demonstrable
* Connected to an actual workflow

The worker matching system should consider more than distance.

A conceptual matching flow is:

**Skills**

* **Verification**
* **Availability**
* **Distance**
* **Experience**
* **Rating**
* **Workload**
* **Fairness**
  ↓
  **Match Score**
  ↓
  **Recommended Worker**

For prototype features, mock/demo implementations are acceptable when permitted by the PRD.

---

# 12. Demo Data

When real integrations are unavailable, use realistic demo data.

Clearly distinguish between:

* **Real functionality**
* **Mock functionality**
* **Future functionality**

Never present a mock government, payment, KYC, or certification integration as a real integration.

---

# 13. Security

Never:

* Commit passwords.
* Commit API keys.
* Commit secrets.
* Expose private credentials.
* Put sensitive credentials in frontend code.

Use environment variables and appropriate secret management.

---

# 14. Changing Existing Code

Before modifying existing code:

**Understand**
↓
**Identify dependencies**
↓
**Make the smallest reasonable change**
↓
**Test**
↓
**Verify existing functionality**

Do not rewrite working parts without a clear reason.

---

# 15. Dependencies

Before adding a dependency, ask:

* Is it actually required?
* Can existing functionality solve the problem?
* Is it compatible with the project?
* Does it add unnecessary complexity?

Avoid dependency bloat.

---

# 16. Documentation Maintenance

When the project changes significantly:

**Product requirement changes**
→ Update `PRD.md`

**Architecture changes**
→ Update `ARCHITECTURE.md`

**Design changes**
→ Update `DESIGN.md`

**Coding rule changes**
→ Update `RULES.md`

**Current project state changes**
→ Update `MEMORY.md`

**Important decisions**
→ Update `DECISIONS.md`

**Testing requirements change**
→ Update `TESTING.md`

Documentation must remain consistent with the actual codebase.

---

# 17. Testing

After implementing a meaningful feature:

1. Run relevant tests.
2. Check for errors.
3. Verify affected user flows.
4. Fix issues before declaring the feature complete.
5. Update `TESTING.md` when a new important test requirement is introduced.

Never claim that something works without verifying it.

---

# 18. Git Workflow

Use focused commits.

Good examples:

```text
Add customer booking flow
Implement worker matching
Add admin worker verification
Fix booking status transition
Add Hindi translations
```

Avoid vague commits such as:

```text
changes
update
final
test
stuff
```

Do not force-push or rewrite Git history unless explicitly requested.

---

# 19. Working Style

For large tasks:

**Understand**
↓
**Plan**
↓
**Implement**
↓
**Test**
↓
**Verify**
↓
**Document**

Work incrementally.

Do not modify unrelated files.

Do not rebuild the whole project when a focused change is sufficient.

---

# 20. Handling Ambiguity

If an unclear requirement could materially affect the architecture or product:

**Stop → Identify the ambiguity → Ask for clarification**

If the ambiguity is minor and a safe choice exists:

**Choose the simplest reasonable option → Document it when appropriate**

Never invent major product requirements.

---

# 21. Completion Checklist

Before declaring a task complete:

* [ ] Requirement understood
* [ ] Relevant documentation checked
* [ ] Correct architecture followed
* [ ] Existing functionality preserved
* [ ] UI follows design system
* [ ] Loading states handled
* [ ] Empty states handled
* [ ] Error states handled
* [ ] Relevant tests run
* [ ] No secrets committed
* [ ] Documentation updated if necessary
* [ ] Git changes are focused

---

# 22. Golden Rule

> **Build what SAHYOG needs, not what the AI thinks would be cool.**

Keep the project:

**Focused → Reliable → Understandable → Demo-ready**
