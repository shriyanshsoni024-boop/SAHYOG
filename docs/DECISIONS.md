# SAHYOG — Architecture & Product Decisions

> **Purpose:** Record important product, design, and technical decisions made during the development of SAHYOG and explain why they were chosen.

---

# 1. Decision: Cooperative-Centric Service Platform

**Decision:**  
SAHYOG will connect customers and skilled workers while keeping cooperatives as an important workforce-management layer.

**Reason:**  
The platform is not intended to be only a customer-to-worker booking system. The cooperative layer enables worker verification, workforce planning, allocation, and demand management.

---

# 2. Decision: Three Primary Interfaces

**Decision:**  
SAHYOG will have three major interfaces:

- Customer App
- Worker App
- Cooperative / Admin Panel

**Reason:**  
Each user group has different responsibilities and workflows. Separating the interfaces keeps the experience focused and easier to use.

---

# 3. Decision: Urban Company-Inspired UX

**Decision:**  
Urban Company will be used as a primary UI/UX reference.

**Reason:**  
Its service-discovery, provider-profile, booking, and service-tracking patterns provide a familiar experience for customers.

**Constraint:**  
SAHYOG will maintain its own branding, content, identity, and cooperative-focused functionality instead of directly copying proprietary design or assets.

---

# 4. Decision: Customer and Worker Experiences Are Separate

**Decision:**  
The Customer App and Worker App will have different interfaces and workflows.

**Reason:**  
Customers need service discovery and booking, while workers need job management, availability, training, earnings, and service controls.

---

# 5. Decision: Core Booking Flow First

**Decision:**  
The prototype will prioritize the complete booking lifecycle before advanced features.

**Core Flow:**

```text
Customer Request
↓
Smart Matching
↓
Worker Request
↓
Worker Accepts
↓
Service Starts
↓
Service Completes
↓
Customer Feedback
````

**Reason:**
This is the main product workflow and is the clearest way to demonstrate the value of SAHYOG.

---

# 6. Decision: Distance Is Not the Only Matching Factor

**Decision:**
Worker matching will consider multiple factors.

These include:

* Skills
* Verification
* Availability
* Distance
* Experience
* Rating
* Workload
* Fairness

**Reason:**
Selecting workers only by distance can produce poor matches and does not consider worker suitability or workload.

---

# 7. Decision: Modular Matching Engine

**Decision:**
The matching system will be implemented as a separate logical module.

**Reason:**
The matching algorithm may change as the project develops. Keeping it modular allows scoring logic to improve without rewriting the complete booking system.

---

# 8. Decision: Simple Architecture for Prototype

**Decision:**
The initial prototype should prefer a modular monolith instead of microservices.

**Reason:**
The prototype needs to be developed quickly and reliably. Multiple microservices would introduce unnecessary deployment and development complexity at this stage.

---

# 9. Decision: Reusable Frontend Components

**Decision:**
Common UI elements will be implemented as reusable components.

Examples:

```text
Button
Input
Card
WorkerCard
ServiceCard
BookingCard
StatusBadge
Modal
```

**Reason:**
Reusable components improve consistency and reduce duplicated UI code.

---

# 10. Decision: Mock Integrations for Prototype

**Decision:**
Mock implementations may be used where real integrations are unavailable.

Possible examples:

* Mock KYC
* Mock worker verification
* Mock payments
* Mock AI matching
* Demo analytics
* Sample locations

**Reason:**
The prototype needs to demonstrate the complete product workflow even when production integrations are not available.

**Important:**
Mock functionality must never be presented as a real external integration.

---

# 11. Decision: AI Must Provide Real Product Value

**Decision:**
AI features will be included only when they provide a meaningful product benefit.

Possible AI areas:

* Worker matching
* Demand forecasting
* Image-based estimation
* Voice assistance

**Reason:**
AI should solve a real problem rather than being added only for presentation.

---

# 12. Decision: AI Features Should Be Modular

**Decision:**
AI functionality should be isolated from the core application.

**Reason:**
The main platform should continue functioning even if an AI service is unavailable, changed, or replaced.

---

# 13. Decision: Training Through Video + MCQ

**Decision:**
Worker training will support learning videos and MCQ-based assessments.

**Reason:**
Workers can learn skills through accessible resources and demonstrate learning progress through assessments.

YouTube links may be used as training resources.

---

# 14. Decision: Worker Verification Is Important

**Decision:**
Worker verification will be part of the platform.

**Reason:**
Verification helps establish customer trust and supports the platform's goal of connecting customers with verified skilled workers.

For the prototype, verification may be demonstrated using mock data.

---

# 15. Decision: Booking Uses Controlled Statuses

**Decision:**
Bookings will use a defined state machine.

```text
REQUESTED
↓
MATCHED
↓
ACCEPTED
↓
ON_THE_WAY
↓
IN_PROGRESS
↓
COMPLETED
```

Alternative states may include:

```text
REJECTED
CANCELLED
FAILED
```

**Reason:**
Controlled states make the booking lifecycle predictable and prevent invalid transitions.

---

# 16. Decision: Hindi + English Support

**Decision:**
SAHYOG should support Hindi and English where required.

**Reason:**
The platform serves skilled workers and customers who may have different language preferences. Supporting both languages can improve accessibility and usability.

---

# 17. Decision: Mobile-First Customer and Worker Experience

**Decision:**
Customer and Worker interfaces should prioritize mobile usability while supporting tablet and desktop layouts where required.

**Reason:**
Service requests and job management are likely to happen while users are away from a desktop environment.

---

# 18. Decision: Security Before Production Integrations

**Decision:**
Secrets and sensitive credentials must be kept outside source code.

Examples:

```text
API Keys
Passwords
Tokens
Database Credentials
Authentication Secrets
```

**Reason:**
Credentials committed to source code can expose the project and connected services to unauthorized access.

Environment variables should be used for sensitive configuration.

---

# 19. Decision: No Unnecessary Features

**Decision:**
Features outside the current product requirements should not be implemented automatically.

**Reason:**
The prototype has a defined scope. Additional features can increase complexity and reduce focus on the core product.

---

# 20. Decision: Focused Git Commits

**Decision:**
Git commits should represent focused changes.

Examples:

```text
Add customer booking flow
Implement worker matching
Add worker verification
Fix booking status transition
Add Hindi translations
```

**Reason:**
Focused commits make development history easier to understand and debugging easier.

---

# 21. Decision: Documentation Before Major Vibe Coding

**Decision:**
The project will maintain eight core documentation files before major prototype development.

```text
PRD.md
AGENTS.md
DESIGN.md
ARCHITECTURE.md
RULES.md
MEMORY.md
DECISIONS.md
TESTING.md
```

**Reason:**
These documents provide the AI coding agent with product requirements, instructions, design context, architecture, coding rules, project memory, decisions, and testing requirements.

---

# 22. Decision: Documentation Is a Living System

**Decision:**
Documentation should be updated when important project decisions or implementation changes occur.

**Reason:**
The AI coding agent must be able to understand the current project state across development sessions.

---

# 23. Decision: Prototype Before Production Complexity

**Decision:**
The first implementation will focus on proving the product concept rather than building production-scale infrastructure immediately.

**Reason:**
The immediate objective is to demonstrate a functional and understandable SAHYOG prototype.

---

# 24. Decision: Core Ecosystem Over Individual Features

**Decision:**
The prototype should demonstrate how customers, workers, and cooperatives work together.

**Reason:**
SAHYOG's differentiation comes from the complete ecosystem:

```text
Customer
   ↓
Service Request
   ↓
Matching
   ↓
Worker
   ↓
Service
   ↓
Feedback

Cooperative
   ↓
Verification
   ↓
Workforce Management
   ↓
Planning
   ↓
Allocation
```

The prototype should therefore demonstrate the complete ecosystem rather than isolated features.

---

# 25. Decision Rule for Future Changes

When a new major decision is made, document it using:

```text
Decision
↓
Reason
↓
Impact
↓
Alternatives (if important)
```

Avoid silently changing major architectural or product decisions.

---

# 26. Final Decision Principle

> **Choose the simplest approach that clearly demonstrates SAHYOG's core value, keeps the system maintainable, and allows future expansion without unnecessary complexity.**

```
```
