# SAHYOG — Testing & Quality Checks

> **Purpose:** Define the testing strategy, quality checks, and verification requirements for the SAHYOG project.

---

# 1. Testing Goal

Every important feature must be verified before it is considered complete.

Testing should ensure that:

- Features work as expected.
- User flows are functional.
- Invalid actions are handled correctly.
- UI does not break.
- APIs return expected results.
- Existing functionality is not unnecessarily broken.

---

# 2. Testing Priorities

Testing priority should follow the product priority:

```text
P0 — Core Booking Flow
        ↓
P1 — Important Features
        ↓
P2 — Advanced Features
````

The core customer-to-worker workflow must receive the highest testing priority.

---

# 3. Core User Flow

The primary flow to verify is:

```text
Customer Request
        ↓
Smart Matching
        ↓
Worker Receives Request
        ↓
Worker Accepts
        ↓
Worker Starts Service
        ↓
Worker Completes Service
        ↓
Customer Sees Completion
        ↓
Customer Gives Feedback
```

Every major step must be tested.

---

# 4. Customer App Testing

Verify that customers can:

* Open the application.
* Browse service categories.
* Search for services.
* Select a service.
* Enter service requirements.
* View recommended workers.
* View worker details.
* Create a booking.
* View booking status.
* Track an active service.
* Complete payment/demo payment.
* Submit rating and feedback.
* View service history.

Also test:

* No available workers.
* Invalid service information.
* Failed booking.
* Cancelled booking.
* Network/API failure.
* Empty booking history.

---

# 5. Worker App Testing

Verify that workers can:

* Create/view their profile.
* Add skills.
* View verification status.
* View training.
* Open training videos.
* Take MCQ tests.
* View training progress.
* Set availability.
* Receive job requests.
* Accept a request.
* Reject a request.
* View active jobs.
* Start a service.
* Complete a service.
* View completed jobs.
* View earnings.

Also test:

* Worker unavailable.
* Worker rejects a request.
* Worker has no active jobs.
* Worker has no available jobs.
* Invalid job state transition.

---

# 6. Cooperative / Admin Panel Testing

Verify that administrators/cooperatives can:

* View workers.
* View worker skills.
* View verification status.
* Verify or reject workers in the prototype.
* View service requests.
* View active bookings.
* View worker availability.
* View workforce information.
* View demand information.
* View workforce analytics.
* View allocation recommendations.

Also test:

* Empty worker list.
* Empty service requests.
* Missing worker information.
* Invalid administrative action.

---

# 7. Booking State Testing

The booking state machine must be tested carefully.

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

Alternative states:

```text
REJECTED
CANCELLED
FAILED
```

Test that:

* Valid transitions work.
* Invalid transitions are rejected.
* Completed bookings cannot accidentally return to an earlier state.
* Cancelled bookings cannot continue normally.
* Rejected requests do not appear as accepted jobs.

---

# 8. Matching Testing

The worker matching system should be tested using different worker profiles.

Test factors such as:

* Skill match
* Verification
* Availability
* Distance
* Experience
* Rating
* Workload
* Fairness

Example:

```text
Worker A
High skill match
Farther distance

Worker B
Medium skill match
Closer distance
```

Verify that the matching logic considers the configured factors rather than blindly selecting the nearest worker.

---

# 9. Training Testing

Verify:

```text
Select Skill
    ↓
Open Training
    ↓
Watch/Access Video
    ↓
Take MCQ
    ↓
Submit Test
    ↓
Receive Result
    ↓
Update Progress
```

Test:

* Correct answers.
* Incorrect answers.
* Incomplete test.
* Passing score.
* Failing score.
* Progress updates.
* Certificate/demo certificate conditions.

---

# 10. UI Testing

Check the UI for:

* Correct layout.
* Responsive behaviour.
* Consistent components.
* Correct buttons.
* Correct navigation.
* Readable text.
* Proper spacing.
* Correct status indicators.
* Loading states.
* Empty states.
* Error states.

Test important screens on:

* Mobile
* Tablet
* Desktop

---

# 11. Urban Company-Inspired UX Verification

Because Urban Company is a UX reference, verify that SAHYOG provides similarly clear patterns for:

* Service discovery
* Category browsing
* Search
* Worker/provider profiles
* Ratings
* Booking
* Time-slot selection
* Tracking
* History

However, testing must also verify that SAHYOG maintains its own branding and cooperative-focused experience.

---

# 12. Form Testing

For every important form, test:

* Valid input.
* Empty input.
* Invalid input.
* Missing required fields.
* Very long input.
* Incorrect formats.
* Duplicate submissions.
* Loading during submission.
* API failure.

---

# 13. API Testing

Verify that important APIs:

* Accept valid requests.
* Reject invalid requests.
* Validate input.
* Return expected status codes.
* Return predictable response structures.
* Handle authentication correctly.
* Handle authorization correctly.
* Handle errors safely.

Test both success and failure cases.

---

# 14. Authentication Testing

Verify:

* Valid login.
* Invalid login.
* Logout.
* Protected pages.
* Unauthorized access.
* Session/token handling.
* Different user roles.

Test that:

```text
Customer
    ≠
Worker
    ≠
Admin/Cooperative
```

Users should only access functionality appropriate to their role.

---

# 15. Security Testing

Check that:

* No secrets are exposed.
* API keys are not committed.
* Passwords are not stored insecurely.
* Sensitive data is not unnecessarily returned by APIs.
* Protected operations require authorization.
* Invalid requests cannot bypass business rules.

---

# 16. Mock Integration Testing

For prototype integrations, verify that mock systems behave predictably.

Examples:

* Mock payment
* Mock KYC
* Mock verification
* Mock AI matching
* Mock notifications
* Demo analytics

The UI should clearly indicate demo/mock behaviour where appropriate.

---

# 17. Error Testing

Important error scenarios should be tested.

Examples:

```text
Network Failure
API Failure
Invalid Input
Unauthorized Request
Unavailable Worker
Failed Booking
Payment Failure
Missing Data
Server Error
```

Verify that the application:

1. Does not crash unnecessarily.
2. Shows a useful message.
3. Allows recovery where possible.
4. Does not expose internal technical details.

---

# 18. Loading State Testing

Verify loading states for operations such as:

* Fetching services.
* Fetching workers.
* Creating bookings.
* Matching workers.
* Updating booking status.
* Processing payment.
* Loading analytics.
* Submitting forms.

Buttons should not allow accidental repeated submissions during important operations.

---

# 19. Empty State Testing

Test screens where there is no data.

Examples:

```text
No bookings
No workers
No job requests
No training
No notifications
No search results
No analytics data
```

Every important empty state should clearly communicate what is happening.

---

# 20. Edge Case Testing

Test unusual but possible situations.

Examples:

* No workers available.
* Multiple workers match equally.
* Worker becomes unavailable after matching.
* Customer cancels a booking.
* Worker rejects a booking.
* Worker has too many active jobs.
* Service request has incomplete information.
* API returns incomplete data.
* User refreshes during an active booking.
* Network disconnects during an important action.

---

# 21. Regression Testing

After making a change:

1. Test the changed feature.
2. Test the related user flow.
3. Check important existing functionality.
4. Check for console/runtime errors.
5. Fix regressions before completion.

Do not assume that a small code change cannot affect other functionality.

---

# 22. Browser Testing

The prototype should be checked in the main supported browser environment.

At minimum verify:

* Page loading.
* Navigation.
* Forms.
* Buttons.
* Modals.
* API requests.
* Responsive layouts.
* No major console errors.

---

# 23. Performance Checks

For important screens, check:

* Initial loading time.
* Unnecessary API requests.
* Large assets.
* Excessive rendering.
* Slow operations.

Do not optimize prematurely. Fix meaningful performance problems when identified.

---

# 24. Accessibility Checks

Verify important interfaces for:

* Keyboard navigation.
* Proper labels.
* Readable text.
* Focus states.
* Sufficient contrast.
* Semantic elements.
* Accessible buttons.
* Useful error messages.

Do not communicate important information through color alone.

---

# 25. Test Data

Use realistic but clearly identifiable demo data for prototype testing.

Example:

```text
Customer
Worker
Electrician
AC Technician
Plumber
Service Requests
Bookings
Ratings
Training Courses
Certificates
```

Do not use real personal information in demo data.

---

# 26. Definition of Done

A feature should not be considered complete until:

```text
Implementation
      ↓
Relevant Tests
      ↓
Error Checking
      ↓
User Flow Verification
      ↓
Edge Case Check
      ↓
Responsive/UI Check
      ↓
Documentation Update if Required
      ↓
Complete
```

---

# 27. Testing Report

When completing a meaningful feature, record:

* What was tested.
* What passed.
* What failed.
* What was fixed.
* Any known limitations.

For prototype work, major known limitations should be documented clearly.

---

# 28. Final Quality Principle

> **Never declare a feature complete only because the code has been written. Verify that the feature actually works, handles failure cases, and does not unnecessarily break existing functionality.**

```
```
