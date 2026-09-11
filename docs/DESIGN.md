# SAHYOG — Design System & UI/UX Specification

> **Purpose:** Define the visual language, interaction patterns, layout principles, and user experience standards for SAHYOG.

---

# 1. Design Vision

SAHYOG should feel:

**Trustworthy → Modern → Simple → Human → Professional**

The interface should be easy enough for a first-time customer or worker to understand without technical knowledge.

The design should communicate that SAHYOG is:

* A reliable service platform
* A worker-friendly ecosystem
* A cooperative workforce platform
* A trustworthy alternative to informal service booking
* An intelligent but simple technology platform

---

# 2. Design Principles

## 2.1 Simplicity First

Every screen should have one clear primary purpose.

Avoid:

* Unnecessary information
* Excessive buttons
* Complicated navigation
* Dense dashboards
* Long forms when unnecessary

---

## 2.2 Trust

Trust is critical because customers are hiring workers for services at their homes.

Trust should be communicated through:

* Worker verification badges
* Skill information
* Ratings and reviews
* Experience
* Completed jobs
* Clear pricing
* Transparent booking status
* Professional worker profiles

---

## 2.3 Human-Centered Design

The interface should feel friendly rather than corporate.

Use:

* Clear language
* Familiar icons
* Helpful empty states
* Simple instructions
* Human-readable status messages
* Large touch-friendly controls

---

## 2.4 Accessibility

Important information must not depend only on color.

Use:

* Icons
* Text labels
* Clear contrast
* Readable font sizes
* Visible focus states
* Large interactive areas

---

# 3. Visual Direction

SAHYOG's UI/UX should take **Urban Company** as the primary product and interaction reference.

The goal is to learn from the clarity, service discovery, booking experience, provider presentation, and overall usability of modern service platforms while creating a distinct SAHYOG identity.

## 3.1 Urban Company Reference

The following areas should be used as UI/UX references:

* Service category presentation
* Home screen structure
* Service discovery
* Search and browsing experience
* Service detail presentation
* Worker/service-provider profile cards
* Ratings and verification presentation
* Booking flow
* Time-slot selection
* Service status and tracking
* Customer booking history
* Clear call-to-action placement
* Mobile-first usability
* Clean card-based layouts
* Simple and intuitive navigation

The implementation should capture the **overall interaction philosophy and usability patterns**, not blindly reproduce the interface.

---

## 3.2 SAHYOG Identity

Although Urban Company is the primary UI/UX reference, SAHYOG must have its own visual identity.

The design should feel:

**Clean + Premium + Approachable + Trustworthy**

SAHYOG should not be presented as a clone of Urban Company.

The following must remain specific to SAHYOG:

* Brand identity
* Logo
* Color system
* Typography choices
* Content
* Worker/cooperative features
* Training experience
* Workforce management
* AI matching experience
* Cooperative dashboard
* Any SAHYOG-specific workflows

---

## 3.3 Customer App Direction

The customer experience should follow a familiar service-platform structure:

**Home**

↓

**Choose Service**

↓

**Service Details**

↓

**Select / Recommend Worker**

↓

**Choose Time**

↓

**Confirm Booking**

↓

**Track Service**

↓

**Complete Service**

↓

**Rate & Review**

The experience should feel familiar to users who have used modern home-service applications.

---

## 3.4 Worker App Direction

The Worker App should maintain the same level of simplicity as the Customer App but optimize the interface for workers.

Prioritize:

* Job requests
* Current jobs
* Availability
* Earnings
* Training
* Profile
* Verification

The interface should minimize unnecessary navigation and make important actions immediately visible.

---

## 3.5 Cooperative/Admin Direction

The Cooperative/Admin interface may use a more information-dense dashboard layout.

It should provide:

* Worker management
* Worker verification
* Job management
* Workforce allocation
* Demand visibility
* Worker availability
* Analytics

The dashboard should remain clean and understandable rather than looking like a generic enterprise admin template.

---

# 4. Color System

Use a consistent semantic color system.

## Primary

Primary color is used for:

* Main CTA buttons
* Active navigation
* Important actions
* Selected states
* Key highlights

Choose one strong brand color and use it consistently.

---

## Secondary

Secondary colors may be used for:

* Supporting actions
* Category indicators
* Secondary highlights

Do not introduce many unrelated accent colors.

---

## Semantic Colors

### Success

Used for:

* Completed jobs
* Successful payments
* Verified workers
* Successful actions

### Warning

Used for:

* Pending verification
* Pending payments
* Warnings
* Attention-required states

### Error

Used for:

* Failed actions
* Invalid input
* Cancelled operations
* System errors

### Information

Used for:

* Helpful messages
* Informational banners
* Explanations

---

# 5. Typography

Typography must prioritize readability.

Use a modern sans-serif font.

Recommended hierarchy:

**Display / Hero**
Large and visually strong.

**H1**
Primary page heading.

**H2**
Major section heading.

**H3**
Component or subsection heading.

**Body**
Comfortable reading size.

**Caption**
Secondary information.

**Button / Label**
Medium-weight and easy to scan.

Avoid excessive font weights and decorative typography.

---

# 6. Spacing

Use a consistent spacing system.

Prefer a base spacing scale such as:

```text
4
8
12
16
20
24
32
40
48
64
```

Avoid random spacing values throughout the application.

---

# 7. Border Radius

Use modern rounded components.

Suggested:

* Small controls: 8px
* Inputs: 10–12px
* Cards: 12–16px
* Large containers: 16–24px
* Pills / badges: fully rounded

Do not make every element excessively rounded.

---

# 8. Shadows

Use shadows sparingly.

Prefer subtle elevation for:

* Cards
* Modals
* Floating controls
* Dropdowns

Avoid heavy shadows that make the UI look outdated.

---

# 9. Layout System

Use a responsive layout.

Primary structure:

**Header / Navigation**
↓
**Page Content**
↓
**Primary Actions / Supporting Content**

Desktop interfaces may use:

```text
┌───────────────────────────────────────────┐
│ Navigation                                │
├───────────────────────────────────────────┤
│                                           │
│ Main Content              Sidebar         │
│                                           │
│                                           │
└───────────────────────────────────────────┘
```

Mobile interfaces should prioritize:

```text
┌─────────────────────┐
│ Header              │
├─────────────────────┤
│                     │
│ Main Content        │
│                     │
│                     │
├─────────────────────┤
│ Bottom Navigation   │
└─────────────────────┘
```

---

# 10. Navigation

Navigation must remain predictable.

## Customer

Primary navigation:

**Home**
↓
**Bookings**
↓
**Activity**
↓
**Profile**

---

## Worker

Primary navigation:

**Dashboard**
↓
**Jobs**
↓
**Training**
↓
**Earnings**
↓
**Profile**

---

## Admin / Cooperative

Primary navigation:

**Dashboard**
↓
**Workers**
↓
**Requests / Jobs**
↓
**Allocation**
↓
**Analytics**

---

# 11. Customer Experience

The customer experience should follow a simple journey:

**Home**

↓

**Choose Service**

↓

**Describe Requirement**

↓

**View Recommended Worker**

↓

**Confirm Booking**

↓

**Track Service**

↓

**Complete Service**

↓

**Rate & Review**

---

# 12. Customer Home Screen

The home screen should immediately answer:

**"What service do you need?"**

Important elements:

* Search
* Service categories
* Popular services
* Recent bookings
* Recommended services
* Quick booking CTA

Example structure:

```text
Welcome

What service do you need?

[ Search for a service ]

Popular Services

[ Electrician ]
[ AC Repair ]
[ Plumber ]
[ Appliance Repair ]

Recent Booking

[ View details ]
```

---

# 13. Service Categories

Services should be visually recognizable.

Examples:

* Electrician
* Plumber
* AC Repair
* Appliance Repair
* Carpenter
* Painter
* Other available professions

Each category should have:

* Icon
* Name
* Optional short description

---

# 14. Worker Profile

Worker profiles are a major trust component.

Display:

* Profile photo
* Name
* Verification status
* Skills
* Experience
* Rating
* Number of completed jobs
* Availability
* Service area
* Certifications where applicable

Example:

```text
Worker Name

✓ Verified

Electrician
AC Repair

★★★★★ 4.8

126 Jobs Completed

8 Years Experience

[ Book Worker ]
```

---

# 15. Worker Matching UI

The matching experience should explain why a worker is recommended.

Example:

```text
Recommended for You

Worker Name
✓ Verified

Skill Match       95%
Distance          2.4 km
Availability      Available
Rating            4.8 ★
Experience        8 years

[ View Profile ]
[ Book Now ]
```

Avoid exposing complex AI calculations directly to users.

Use simple explanations such as:

**"Best match based on skill, availability and distance."**

---

# 16. Booking UI

Booking should be simple and progressive.

Recommended flow:

**Service**
↓
**Problem / Requirement**
↓
**Location**
↓
**Preferred Time**
↓
**Worker**
↓
**Price Estimate**
↓
**Confirm**

Avoid presenting a huge form on one screen.

---

# 17. Booking Status

Use clear status indicators.

Possible states:

```text
Request Sent
↓
Worker Assigned
↓
Worker Accepted
↓
Worker On The Way
↓
Service Started
↓
Service Completed
```

The current state should always be visually obvious.

---

# 18. Worker Experience

Workers should be able to quickly understand:

**"What work do I have today?"**

Worker dashboard should prioritize:

* New job requests
* Upcoming jobs
* Current job
* Earnings
* Availability
* Training progress

---

# 19. Worker Job Request

A job request should clearly show:

* Service type
* Customer requirement
* Location
* Distance
* Preferred time
* Estimated earning
* Customer details required for the job

Primary actions:

**Accept**

**Reject**

Avoid hiding these actions inside menus.

---

# 20. Worker Availability

Workers should have a simple availability control.

Example:

```text
Availability

● Available

[ Toggle ]

Today's Schedule

09:00 AM — 12:00 PM
02:00 PM — 06:00 PM
```

The system should make availability easy to update.

---

# 21. Worker Training

Training should be simple and practical.

Flow:

**Choose Skill**

↓

**Training Videos**

↓

**Learn**

↓

**MCQ Test**

↓

**Result**

↓

**Certificate / Skill Progress**

Training resources may include YouTube links as defined in the PRD.

---

# 22. Admin / Cooperative Dashboard

The admin interface should prioritize operational visibility.

Important metrics:

* Total workers
* Verified workers
* Available workers
* Active jobs
* Pending requests
* Completed jobs
* Workforce utilization

Example:

```text
Dashboard

Workers       Active Jobs       Pending

  248             36              12

---------------------------------------

Workforce Allocation

Electrician     █████████
AC Repair       ███████
Plumber         █████
Carpenter       ████
```

---

# 23. Worker Verification UI

Verification should clearly communicate status.

Possible states:

**Pending**
**Under Review**
**Verified**
**Rejected**

Verification should display:

* Worker information
* Skills
* Documents
* Training
* Experience
* Verification history

---

# 24. Workforce Allocation

Allocation should make worker distribution easy to understand.

Flow:

**Demand**
↓
**Available Workers**
↓
**Skill Match**
↓
**Workload Check**
↓
**Allocation Recommendation**

The admin should be able to understand why a worker is recommended.

---

# 25. Analytics

Analytics should prioritize actionable information.

Useful views:

* Service demand
* Worker availability
* Worker utilization
* Completion rate
* Average rating
* Service categories
* Peak demand periods

Use:

* Cards
* Charts
* Simple filters
* Tables
* Status indicators

Avoid excessive charts.

---

# 26. Forms

Forms should:

* Use clear labels
* Show validation messages
* Group related fields
* Minimize unnecessary fields
* Preserve entered information when validation fails
* Clearly indicate required fields

Example:

```text
Phone Number *

[ +91 __________ ]

Enter a valid 10-digit mobile number.
```

---

# 27. Buttons

Every screen should have a clear primary action.

Button hierarchy:

**Primary**
→ Main action

**Secondary**
→ Supporting action

**Tertiary**
→ Low-priority action

**Destructive**
→ Delete, cancel, reject, or irreversible action

Avoid multiple competing primary buttons.

---

# 28. Cards

Cards should group related information.

Use cards for:

* Workers
* Services
* Bookings
* Jobs
* Training
* Analytics summaries

Cards should not become containers for every piece of information.

---

# 29. Loading States

Every asynchronous operation should have a loading state.

Examples:

* Skeleton cards
* Loading indicators
* Button loading states
* Progress indicators

Avoid blank screens while data is loading.

---

# 30. Empty States

Empty states should explain what happened and what the user can do next.

Example:

```text
No upcoming bookings

You don't have any upcoming services.

[ Explore Services ]
```

---

# 31. Error States

Errors should be human-readable.

Bad:

```text
Error 500
```

Better:

```text
Something went wrong.

We couldn't load your bookings.

[ Try Again ]
```

---

# 32. Notifications

Notifications should be useful and actionable.

Examples:

* New job request
* Worker accepted booking
* Worker arriving
* Service completed
* Payment completed
* Training completed

Avoid unnecessary notification spam.

---

# 33. Language

SAHYOG should support clear language for Indian users.

Where required:

**English ↔ Hindi**

Use simple terminology.

Avoid unnecessarily technical terms.

---

# 34. Responsive Design

The application must work across:

* Desktop
* Laptop
* Tablet
* Mobile

Mobile should not simply be a compressed desktop layout.

On smaller screens:

* Stack content vertically
* Increase touch targets
* Simplify navigation
* Reduce unnecessary information
* Keep primary actions accessible

---

# 35. Micro-interactions

Use subtle animations for:

* Button feedback
* Page transitions
* Modal opening
* Status changes
* Success states
* Loading states

Animations should improve understanding, not distract the user.

Avoid excessive animation.

---

# 36. Icons

Use one consistent icon library.

Icons should:

* Have consistent visual weight
* Be recognizable
* Support text labels where needed
* Never replace important information completely

Do not mix many unrelated icon styles.

---

# 37. Images

Use images where they improve trust or understanding.

Examples:

* Worker profiles
* Service categories
* Training content
* Service illustrations

Images should be optimized and responsive.

Do not use copyrighted images without appropriate rights.

---

# 38. Design Consistency

The same component should look and behave the same everywhere.

For example:

**Primary Button**

should maintain consistent:

* Shape
* Size
* Typography
* Interaction
* Loading state
* Disabled state

across Customer, Worker, and Admin interfaces.

---

# 39. Prototype Priority

During prototype development, prioritize screens in this order:

**Customer Booking**

↓

**Worker Job Acceptance**

↓

**Service Tracking / Status**

↓

**Worker Profile & Verification**

↓

**Cooperative Dashboard**

↓

**Worker Training**

↓

**Analytics**

Advanced screens should not delay the main booking-to-completion flow.

---

# 40. Final Design Rule

> **Every screen should make the next action obvious.**

SAHYOG should feel:

**Simple enough for a customer.**
**Useful enough for a worker.**
**Powerful enough for a cooperative.**

The design must always prioritize:

**Trust → Clarity → Speed → Accessibility → Consistency**
SAHYOG UI should follow the interaction quality and visual structure of a
modern Indian home-services marketplace such as Urban Company.

Use Urban Company only as UX inspiration/reference.
Do not copy its proprietary branding, assets, exact screens, or copyrighted
visual elements.

The UI should feel:
- production-ready
- clean
- trustworthy
- premium
- mobile-first
- service-marketplace focused
- simple for non-technical users

Avoid:
- excessive glassmorphism
- excessive gradients
- oversized decorative cards
- generic AI-dashboard appearance
- excessive rounded containers
- unnecessary animations
- too many colors
- overly dense information