# SAHYOG — System Architecture

> **Purpose:** Define the technical structure, application layers, data flow, integrations, and major system components of SAHYOG.

---

# 1. Architecture Overview

SAHYOG is a service platform connecting:

**Customers**

↓

**SAHYOG Platform**

↓

**Verified Workers**

↓

**Cooperatives / Administrators**

The system should be modular so that the Customer App, Worker App, and Cooperative/Admin Panel can evolve independently while sharing common backend services.

---

# 2. Major Applications

SAHYOG consists of three primary interfaces:

## Customer App

Used by customers to:

- Discover services
- Describe requirements
- Find recommended workers
- Book services
- Track bookings
- Make payments
- View service history
- Submit ratings and reviews

---

## Worker App

Used by workers to:

- Create/manage profiles
- Select skills
- Complete training
- Maintain availability
- Receive job requests
- Accept/reject jobs
- Manage active jobs
- Track earnings
- View completed work

---

## Cooperative / Admin Panel

Used to:

- Manage workers
- Verify workers
- Monitor service requests
- Manage workforce
- Allocate workers
- Monitor availability
- View analytics
- Manage training and verification data

---

# 3. High-Level System

```text
                 ┌─────────────────────┐
                 │    Customer App     │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │     API Layer       │
                 └──────────┬──────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
   │ User Service│   │ Booking     │   │ Matching    │
   │             │   │ Service     │   │ Engine      │
   └─────────────┘   └─────────────┘   └─────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      Database       │
                 └─────────────────────┘
````

---

# 4. Frontend Architecture

The frontend should be organized around reusable components and feature-based modules.

Recommended structure:

```text
src/
│
├── components/
│   ├── common/
│   ├── navigation/
│   ├── forms/
│   ├── cards/
│   └── feedback/
│
├── features/
│   ├── customer/
│   ├── worker/
│   └── admin/
│
├── pages/
│
├── services/
│
├── hooks/
│
├── utils/
│
├── types/
│
└── assets/
```

Use reusable components instead of duplicating UI across screens.

---

# 5. Customer Frontend Flow

```text
Home
  ↓
Service Categories
  ↓
Service Details
  ↓
Requirement
  ↓
Worker Recommendations
  ↓
Worker Profile
  ↓
Booking
  ↓
Payment
  ↓
Booking Tracking
  ↓
Completion
  ↓
Rating & Review
```

Each stage should maintain the required booking state.

---

# 6. Worker Frontend Flow

```text
Worker Dashboard
  ↓
Job Requests
  ↓
Job Details
  ↓
Accept / Reject
  ↓
Upcoming Jobs
  ↓
Start Service
  ↓
Complete Service
  ↓
Earnings
```

Worker training exists as a parallel workflow:

```text
Training
  ↓
Video Learning
  ↓
MCQ Test
  ↓
Result
  ↓
Skill Progress / Certificate
```

---

# 7. Admin Frontend Flow

```text
Admin Dashboard
  ↓
Workers
  ↓
Verification
  ↓
Requests / Jobs
  ↓
Workforce Allocation
  ↓
Analytics
```

The admin panel should consume the same backend data as the customer and worker applications.

---

# 8. Backend Architecture

The backend should contain separate logical services/modules.

Recommended modules:

```text
Backend
│
├── Authentication
├── Users
├── Workers
├── Services
├── Bookings
├── Matching
├── Payments
├── Reviews
├── Training
├── Verification
├── Notifications
├── Workforce
└── Analytics
```

These may initially exist as modules inside one backend application rather than separate microservices.

Do not introduce microservices unless there is a clear requirement.

---

# 9. Authentication & Authorization

Authentication identifies users.

Authorization determines what they are allowed to access.

Primary roles:

```text
Customer
Worker
Admin / Cooperative
```

Example:

```text
Customer
  → Create booking
  → View own bookings
  → Rate worker

Worker
  → View assigned requests
  → Accept jobs
  → Update job status
  → View earnings

Admin
  → Manage workers
  → Verify workers
  → Manage workforce
  → View analytics
```

Users must not be able to access resources belonging to unauthorized users.

---

# 10. User Data

A user may contain:

```text
User
├── id
├── name
├── phone
├── email
├── role
├── location
├── profileImage
├── createdAt
└── updatedAt
```

Additional worker-specific information should be stored separately where appropriate.

---

# 11. Worker Data

Worker information may include:

```text
Worker
├── id
├── userId
├── skills
├── experience
├── rating
├── completedJobs
├── availability
├── serviceArea
├── verificationStatus
├── certifications
├── trainingProgress
└── workload
```

Worker data should support matching, verification, and workforce management.

---

# 12. Service Data

Services represent the professions/categories available on SAHYOG.

Example:

```text
Service
├── id
├── name
├── category
├── description
├── icon
├── estimatedPrice
└── active
```

Examples:

* Electrician
* AC Repair
* Plumber
* Carpenter
* Painter
* Appliance Repair

---

# 13. Booking Data

A booking represents a customer's service request.

Example:

```text
Booking
├── id
├── customerId
├── workerId
├── serviceId
├── description
├── location
├── scheduledAt
├── status
├── price
├── paymentStatus
├── createdAt
└── completedAt
```

---

# 14. Booking State Machine

Booking status should follow controlled transitions.

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

Invalid state transitions should be prevented.

---

# 15. Worker Matching Engine

The matching engine recommends suitable workers for a customer request.

Input:

```text
Customer Request
+
Service Required
+
Location
+
Preferred Time
```

↓

Matching factors:

```text
Skill Match
+
Verification
+
Availability
+
Distance
+
Experience
+
Rating
+
Current Workload
+
Fairness
```

↓

Output:

```text
Ranked Worker Recommendations
```

The matching logic should be modular so that the scoring algorithm can be improved later without rewriting the booking system.

---

# 16. Matching Score

A conceptual score may combine multiple factors:

```text
Match Score =
    Skill Match
  + Availability
  + Distance
  + Experience
  + Rating
  + Workload
  + Fairness
```

The exact weighting should be configurable.

The system should avoid selecting workers based only on distance.

---

# 17. Workforce Management

The cooperative/admin system should provide a broader view of worker availability and demand.

```text
Service Demand
      ↓
Available Workers
      ↓
Skill Matching
      ↓
Workload Analysis
      ↓
Allocation Recommendation
```

This allows the cooperative to identify:

* Skill shortages
* Available workers
* High-demand services
* Overloaded workers
* Underutilized workers

---

# 18. Training System

Workers can improve skills through structured training.

```text
Skill
  ↓
Training Video
  ↓
Learning
  ↓
MCQ Test
  ↓
Score
  ↓
Skill Progress
```

Training resources may include YouTube links.

Training completion can contribute to worker profile information and verification where defined by the product requirements.

---

# 19. Verification System

Worker verification should have controlled states:

```text
PENDING
   ↓
UNDER_REVIEW
   ↓
VERIFIED
```

Alternative:

```text
REJECTED
```

Verification data may include:

* Identity information
* Documents
* Skills
* Experience
* Training
* Certifications

Mock verification is acceptable for the prototype when real integrations are unavailable.

---

# 20. Payment System

The payment layer should be isolated from the booking logic.

Conceptual flow:

```text
Booking
  ↓
Price Calculation
  ↓
Payment
  ↓
Payment Verification
  ↓
Booking Confirmed
```

For prototype development, payment may use mock/demo functionality if a real payment gateway is not required.

Never expose payment credentials in frontend code.

---

# 21. Review & Rating System

After service completion:

```text
Completed Booking
      ↓
Customer Rating
      ↓
Review
      ↓
Worker Profile Update
```

Ratings should contribute to worker profile information and may be considered by the matching system.

---

# 22. Notification System

Notifications should connect important system events with users.

Examples:

```text
Booking Created
      ↓
Worker Notification

Worker Accepted
      ↓
Customer Notification

Worker On The Way
      ↓
Customer Notification

Service Completed
      ↓
Customer Notification
```

Notifications should be generated from meaningful events rather than arbitrary frontend actions.

---

# 23. API Architecture

APIs should follow consistent patterns.

Example:

```text
/api/auth
/api/users
/api/services
/api/workers
/api/bookings
/api/matching
/api/payments
/api/reviews
/api/training
/api/verification
/api/notifications
/api/workforce
/api/analytics
```

API naming should remain predictable and consistent.

---

# 24. API Response Structure

Use consistent response formats.

Example:

```json
{
  "success": true,
  "data": {},
  "message": "Request completed successfully"
}
```

For errors:

```json
{
  "success": false,
  "message": "Unable to complete request"
}
```

Do not expose internal stack traces or sensitive system information to users.

---

# 25. Database Architecture

The database should maintain relationships between:

```text
Users
  │
  ├── Workers
  │      │
  │      ├── Skills
  │      ├── Training
  │      ├── Verification
  │      └── Availability
  │
  └── Bookings
         │
         ├── Services
         ├── Workers
         ├── Payments
         └── Reviews
```

The exact database technology should be selected according to project requirements and implementation constraints.

---

# 26. Location Architecture

Location information is important for:

* Worker discovery
* Distance calculation
* Matching
* Service area validation
* Workforce planning

The system should avoid storing more precise location data than necessary.

For prototype purposes, location data may be represented using realistic demo coordinates or area names.

---

# 27. AI Architecture

AI-related features should be isolated from the core application logic.

Possible AI modules:

```text
AI Layer
│
├── Worker Matching
├── Demand Forecasting
├── Image-based Estimation
└── Voice Assistance
```

AI modules should communicate with the application through clear interfaces.

The application should continue to work if an advanced AI module is unavailable.

---

# 28. Image Estimation

If enabled in the prototype:

```text
Customer Uploads Image
        ↓
Image Analysis
        ↓
Problem / Service Classification
        ↓
Estimated Requirement
        ↓
Worker Matching / Price Estimation
```

This feature should be treated as an assistive estimate rather than a guaranteed diagnosis or price.

---

# 29. Demand Forecasting

The cooperative system may use historical service data to estimate future demand.

```text
Historical Bookings
        ↓
Service Demand Analysis
        ↓
Pattern Detection
        ↓
Demand Forecast
        ↓
Workforce Planning
```

Forecasting should support cooperative decision-making rather than automatically making irreversible workforce decisions.

---

# 30. Data Flow — Main Booking

```text
Customer
   ↓
Select Service
   ↓
Submit Requirement
   ↓
Backend
   ↓
Matching Engine
   ↓
Rank Workers
   ↓
Worker Recommendation
   ↓
Customer Confirmation
   ↓
Booking Created
   ↓
Worker Notification
   ↓
Worker Accepts
   ↓
Service
   ↓
Completion
   ↓
Payment
   ↓
Rating & Review
```

This is the primary end-to-end system flow.

---

# 31. Data Flow — Worker

```text
Worker
   ↓
Profile
   ↓
Skills
   ↓
Training
   ↓
Verification
   ↓
Availability
   ↓
Matching Engine
   ↓
Job Request
   ↓
Accept
   ↓
Service
   ↓
Completion
   ↓
Earnings
```

---

# 32. Data Flow — Cooperative

```text
Workers
   ↓
Availability + Skills + Workload
   ↓
Cooperative Dashboard
   ↓
Demand Analysis
   ↓
Allocation Recommendation
   ↓
Workforce Planning
```

---

# 33. Real-Time Features

Real-time functionality may be used for:

* Booking status
* Worker acceptance
* Worker arrival
* Notifications
* Job updates

For the initial prototype, polling or simulated updates may be used if real-time infrastructure is unnecessary.

Architecture should allow real-time functionality to be added later.

---

# 34. External Integrations

Potential integrations include:

* Maps / location services
* Payment gateway
* YouTube training resources
* SMS / OTP
* Authentication services
* AI APIs
* Government verification services

External integrations should be isolated behind service modules so they can be replaced without affecting the entire application.

---

# 35. Environment Configuration

Environment-specific configuration should be stored outside source code.

Example:

```text
.env
```

Potential configuration:

```text
DATABASE_URL
API_BASE_URL
MAPS_API_KEY
AI_API_KEY
PAYMENT_API_KEY
AUTH_SECRET
```

Never commit `.env` files containing real secrets.

Provide `.env.example` when required.

---

# 36. Error Handling

Errors should be handled at every layer.

```text
User Input
   ↓
Validation
   ↓
API
   ↓
Business Logic
   ↓
Database / External Service
```

Errors should be:

* Logged appropriately
* Returned safely
* Understandable to users
* Recoverable where possible

---

# 37. Scalability

The initial architecture should prioritize simplicity.

Start with a modular monolith if appropriate.

```text
Frontend
   ↓
Backend Application
   ↓
Database
```

Modules should remain loosely coupled so individual components can be separated later if the platform grows.

Do not optimize for massive scale before the MVP requires it.

---

# 38. Security Architecture

Security must be applied across:

```text
Authentication
Authorization
Input Validation
API Security
Database Access
Secrets Management
File Uploads
Payments
```

Sensitive data must be protected.

Users should only access resources they are authorized to access.

---

# 39. Prototype vs Production

The prototype may use:

* Mock users
* Mock workers
* Mock payments
* Mock verification
* Simulated AI
* Demo analytics
* Sample locations

However, the architecture should clearly separate these from production-ready integrations.

Example:

```text
Interface
   ↓
Service Layer
   ↓
Mock Implementation

Later:

Interface
   ↓
Service Layer
   ↓
Real API / Integration
```

This allows prototype functionality to be replaced without rebuilding the frontend.

---

# 40. Recommended Development Order

Build the system incrementally:

```text
1. Project Setup
       ↓
2. UI Foundation
       ↓
3. Customer Service Discovery
       ↓
4. Booking Flow
       ↓
5. Worker Dashboard
       ↓
6. Worker Job Acceptance
       ↓
7. Booking Status
       ↓
8. Worker Profiles
       ↓
9. Matching Engine
       ↓
10. Admin / Cooperative Dashboard
       ↓
11. Training
       ↓
12. Payments
       ↓
13. Reviews
       ↓
14. Analytics
       ↓
15. Advanced AI Features
```

The core booking flow should be completed before advanced features.

---

# 41. Architecture Principles

The architecture must follow these principles:

* Keep modules focused.
* Prefer reusable services.
* Avoid unnecessary microservices.
* Keep frontend and backend responsibilities clear.
* Keep AI features modular.
* Keep external integrations replaceable.
* Validate all important inputs.
* Protect sensitive data.
* Prefer simple solutions for the prototype.
* Design for future expansion without over-engineering.

---

# 42. Final Architecture Rule

> **Build a simple, modular architecture that can support the complete SAHYOG workflow without unnecessary complexity.**

The system should connect:

**Customer → Matching → Worker → Service → Payment → Review**

while enabling:

**Cooperative → Verification → Workforce Management → Allocation → Analytics**

```
```
