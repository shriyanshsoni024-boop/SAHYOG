# SAHYOG — Coding Rules

> **Purpose:** Define the coding standards, conventions, quality rules, and development practices that must be followed while building and maintaining SAHYOG.

---

# 1. General Rule

Write code that is:

- Simple
- Readable
- Maintainable
- Reusable
- Reliable
- Easy to test

Prefer a simple working solution over unnecessary complexity.

---

# 2. Project Documentation

Before making a meaningful change:

1. Check `PRD.md` for requirements.
2. Check `DESIGN.md` for UI/UX.
3. Check `ARCHITECTURE.md` for technical structure.
4. Check `AGENTS.md` for AI instructions.
5. Check `DECISIONS.md` for previous decisions.
6. Check `MEMORY.md` for current project context.
7. Check `TESTING.md` for testing requirements.

Documentation is part of the project and must remain consistent with the implementation.

---

# 3. Naming Conventions

Use clear and descriptive names.

Prefer:

```text
getWorkerProfile()
createBooking()
calculateMatchScore()
updateBookingStatus()
````

Avoid:

```text
getData()
doStuff()
handleThing()
temp()
abc()
```

Use consistent naming throughout the project.

---

# 4. Components

Create reusable components when the same UI or behaviour appears multiple times.

Examples:

```text
Button
Input
Modal
WorkerCard
ServiceCard
BookingCard
StatusBadge
Rating
```

Do not create unnecessary abstractions for components that are only used once.

---

# 5. File Organization

Keep files focused on a clear responsibility.

Avoid extremely large files containing:

* UI
* API calls
* Business logic
* Validation
* Data processing

all together.

Separate responsibilities where it improves maintainability.

---

# 6. Duplicate Code

Avoid unnecessary duplication.

If the same logic is required in multiple places:

```text
Repeated Logic
      ↓
Reusable Function / Service / Component
```

However, do not create abstractions merely to eliminate a few lines of similar code.

---

# 7. Frontend Rules

Frontend code should:

* Follow `DESIGN.md`.
* Use reusable components.
* Keep business logic outside UI components where appropriate.
* Handle loading states.
* Handle empty states.
* Handle errors.
* Provide clear user feedback.
* Remain responsive.
* Maintain accessibility.

Avoid putting large amounts of business logic directly inside visual components.

---

# 8. UI Consistency

Use the same design system throughout SAHYOG.

Keep consistent:

* Colors
* Typography
* Spacing
* Buttons
* Cards
* Inputs
* Icons
* Navigation
* Status indicators
* Animations

Do not create a new visual pattern when an existing component can be reused.

---

# 9. Responsive Design

All major interfaces must support:

* Mobile
* Tablet
* Desktop

Do not assume that desktop layouts will automatically work on mobile.

Test important flows at different screen sizes.

---

# 10. Forms

All forms should:

* Validate input.
* Show clear labels.
* Show useful validation messages.
* Indicate required fields.
* Prevent invalid submissions.
* Preserve user input when appropriate.
* Provide loading feedback during submission.

Validation should exist on the backend even if frontend validation is present.

---

# 11. API Rules

API endpoints must:

* Validate input.
* Authenticate users where required.
* Authorize access.
* Return predictable responses.
* Handle failures safely.
* Avoid exposing sensitive information.

Use consistent API response structures.

---

# 12. Business Logic

Business logic should be separated from UI code whenever practical.

Examples of business logic:

* Worker matching
* Booking status transitions
* Price calculation
* Worker workload calculation
* Workforce allocation
* Rating calculations

Keep important business rules centralized rather than duplicating them across screens.

---

# 13. Database Rules

Before changing the database:

1. Check existing models.
2. Check relationships.
3. Avoid duplicate fields or tables.
4. Consider existing API dependencies.
5. Consider frontend dependencies.
6. Test the change.

Never make destructive database changes without explicit approval.

---

# 14. Booking Rules

Booking status must follow the defined state machine.

Expected flow:

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

Possible alternative states:

```text
REJECTED
CANCELLED
FAILED
```

Prevent invalid status transitions.

---

# 15. Worker Matching Rules

Worker matching should not depend only on distance.

The matching system should consider:

* Skills
* Verification
* Availability
* Distance
* Experience
* Rating
* Current workload
* Fairness

The matching algorithm should remain modular so that its scoring logic can be improved later.

---

# 16. AI Rules

AI features must solve a real product problem.

AI should be:

* Useful
* Explainable
* Demonstrable
* Modular

Do not add AI merely because it looks impressive in a demo.

For prototype implementations, mock AI behaviour is acceptable when clearly identified as demo functionality.

---

# 17. Mock Data Rules

When real APIs or integrations are unavailable:

* Use realistic demo data.
* Keep mock data organized.
* Clearly separate mock functionality from real functionality.
* Do not pretend mock functionality is a real integration.

Examples:

```text
Mock Payment
Mock KYC
Mock Worker Verification
Mock AI Matching
Mock Analytics
```

---

# 18. Security Rules

Never commit:

* Passwords
* API keys
* Access tokens
* Private keys
* Database credentials
* Authentication secrets

Use environment variables.

Example:

```text
.env
```

Keep real `.env` files out of Git.

Provide `.env.example` when appropriate.

---

# 19. User Data

Only collect and store information that is required by the product.

Protect:

* Personal information
* Contact information
* Location information
* Documents
* Payment-related information
* Authentication information

Do not expose private user information unnecessarily.

---

# 20. Error Handling

Never silently ignore important errors.

Handle:

```text
Network Error
Validation Error
Authentication Error
Authorization Error
Database Error
External API Error
Unknown Error
```

User-facing errors should use simple language.

Example:

```text
Something went wrong.
Please try again.
```

Do not expose internal stack traces to users.

---

# 21. Loading States

Any operation that may take noticeable time should provide feedback.

Examples:

* API requests
* Booking creation
* Worker matching
* Payment processing
* File uploads
* Data loading

Use:

* Loading indicators
* Skeletons
* Disabled buttons
* Progress indicators

where appropriate.

---

# 22. Empty States

Every major list should have a meaningful empty state.

Example:

```text
No upcoming bookings

You don't have any upcoming services.

[ Explore Services ]
```

Empty states should explain what the user can do next whenever possible.

---

# 23. Accessibility Rules

Important interfaces should support accessibility.

Use:

* Semantic HTML where applicable
* Proper labels
* Keyboard navigation
* Visible focus states
* Sufficient contrast
* Readable text
* Accessible buttons
* Meaningful error messages

Do not rely on color alone to communicate status.

---

# 24. Internationalization

Where Hindi/English support is required:

* Avoid hardcoding user-facing text unnecessarily.
* Keep translations organized.
* Use consistent terminology.
* Ensure layouts can accommodate different text lengths.

Do not mix languages randomly within the same interface.

---

# 25. Performance

Prefer efficient implementations.

Avoid:

* Unnecessary API requests
* Repeated expensive calculations
* Huge assets
* Unnecessary dependencies
* Excessive re-rendering
* Loading data that is not required

Optimize only where there is a meaningful performance issue.

---

# 26. Dependencies

Before adding a dependency, verify:

* It is actually needed.
* Existing project tools cannot solve the problem.
* It is compatible with the project.
* It does not introduce unnecessary complexity.

Avoid dependency bloat.

---

# 27. External Services

External services must be isolated behind appropriate service modules.

Examples:

```text
Maps Service
Payment Service
AI Service
Notification Service
Training Service
```

This makes it easier to replace or modify integrations later.

---

# 28. Environment Variables

Configuration that changes between environments should use environment variables.

Examples:

```text
DATABASE_URL
API_BASE_URL
AI_API_KEY
PAYMENT_API_KEY
MAPS_API_KEY
AUTH_SECRET
```

Never hardcode secrets inside source code.

---

# 29. Git Rules

Use focused commits.

Good:

```text
Add customer booking flow
Implement worker matching
Add worker verification
Fix booking status transition
Add Hindi translations
```

Avoid:

```text
update
changes
final
new code
fix stuff
```

Do not commit:

* Secrets
* Temporary files
* Build artifacts
* Large unnecessary files
* Local configuration

---

# 30. Change Management

Before modifying existing functionality:

```text
Understand
    ↓
Check Dependencies
    ↓
Make Smallest Reasonable Change
    ↓
Test
    ↓
Verify Existing Functionality
```

Do not rewrite working code without a clear reason.

---

# 31. No Unrequested Features

Do not add features outside the current requirement simply because they may be useful.

If a feature is not required:

* Do not implement it automatically.
* Mention it separately if it is genuinely important.
* Wait for approval before adding significant scope.

---

# 32. Prototype Rules

The prototype should prioritize:

```text
Customer Booking
        ↓
Worker Acceptance
        ↓
Service Tracking
        ↓
Service Completion
        ↓
Feedback
```

Secondary features must not break or delay this core flow.

---

# 33. Testing Before Completion

Before declaring a meaningful feature complete:

1. Run relevant tests.
2. Check console errors.
3. Check API errors.
4. Verify the affected user flow.
5. Test important edge cases.
6. Check responsive behaviour where applicable.
7. Fix discovered issues.

Never claim a feature is working without verification.

---

# 34. Documentation Updates

When implementation changes the project significantly, update the relevant documentation.

```text
Product Change
→ PRD.md

Design Change
→ DESIGN.md

Architecture Change
→ ARCHITECTURE.md

Coding Convention Change
→ RULES.md

Project State Change
→ MEMORY.md

Important Decision
→ DECISIONS.md

Testing Requirement
→ TESTING.md
```

---

# 35. Code Quality

Before considering code complete, check:

* Is it readable?
* Is it maintainable?
* Is duplication minimized?
* Are errors handled?
* Are loading states handled?
* Are edge cases considered?
* Does it follow the architecture?
* Does it follow the design system?
* Does it follow the project rules?

---

# 36. Final Rule

> **Build the simplest clean solution that satisfies the requirement, follows the existing architecture and design system, and does not break existing functionality.**

```
```
