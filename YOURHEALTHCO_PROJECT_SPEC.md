# YourHealthCo — Updated Project Specification & System Design

## 1. Purpose

YourHealthCo is a basic college-level healthcare management application connecting:

- Patients
- Hospital / Institute Admins

The system allows admins to manage their patients and maintain patient medication, meal, and health-status information. Patients can view and manage their own profile and view the information maintained for them.

> **Important:** This is intentionally a simple monolithic college project. Do not introduce unnecessary architecture, microservices, Redis, queues, event-driven systems, or other infrastructure unless explicitly required later.

---

# 2. Scope

## 2.1 Roles

The application has exactly two roles:

### Patient

A patient can:

- Sign up
- Log in
- View their profile
- Update their profile
- Upload/update profile picture
- View their medication schedule
- View their meal schedule
- View their current health status and notes
- Log out

### Hospital Admin

An admin can:

- Sign up
- Log in
- View their institute profile
- View patients assigned to them
- Search patients
- View individual patient details
- Assign patients to their institute/admin
- Create or update medication schedules
- Create or update meal schedules
- Update patient health status and notes
- Log out

---

# 3. Explicitly Removed Features

## Billing

Billing must be removed completely from the project.

This includes both frontend and backend.

### Remove from backend

Delete:

- `billingController`
- `billingService`
- `billingModel`
- `billingRoutes`
- All `/api/billing/*` routes
- Billing validation schemas
- Billing-related imports
- Billing-related database queries
- Billing-related tests, if any

Remove the `billings` MongoDB collection from the application's design.

### Remove from frontend

Delete:

- Billing pages/components
- Billing cards
- Billing tables
- Invoice UI
- Billing API calls
- Billing state
- Billing routes
- Billing-related utilities
- Billing text from the patient dashboard
- Any navigation/menu item related to billing

### Important

There must be no remaining dependency on:

```text
billing
invoice
bill
amount
payment
invoiceId
```

unless a piece of code is unrelated and legitimately uses one of these words.

---

# 4. Final System Architecture

Keep the architecture simple:

```text
                    React Frontend
                          |
                          | HTTP / REST
                          |
                          v
                   Express Backend
                          |
              +-----------+-----------+
              |                       |
              v                       v
       Authentication          Business Logic
       Middleware              Controllers/Services
                                      |
                                      v
                                  Mongoose
                                      |
                                      v
                                  MongoDB
```

The backend remains a single Express application.

Do not split it into multiple services.

---

# 5. Backend Structure

Use the existing basic structure as the starting point:

```text
server/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── adminController.js
│   ├── userController.js
│   ├── medsController.js
│   └── PatientStatusController.js
│
├── services/
│   ├── adminService.js
│   ├── userService.js
│   ├── medsService.js
│   └── patientStatusService.js
│
├── models/
│   ├── adminModel.js
│   ├── userModel.js
│   ├── meds_meal.js
│   └── PatientStatus.js
│
├── routes/
│   ├── admin.js
│   ├── user.js
│   ├── meds_meal.js
│   └── patientStatusRoutes.js
│
├── middleware/
│   ├── auth.js
│   ├── requireAdminAuth.js
│   ├── errorMiddleware.js
│   └── validate.js
│
├── validators/
│   ├── adminValidator.js
│   ├── userValidator.js
│   └── medsValidator.js
│
└── utils/
    ├── apiResponse.js
    ├── appError.js
    └── catchAsync.js
```

Do not create additional architectural layers unless they solve an actual problem.

---

# 6. Database Design

The final application uses four MongoDB collections.

## 6.1 Admin

Collection:

```text
admins
```

Fields:

```text
_id
name
email
password
instituteName
address
createdAt
updatedAt
```

---

## 6.2 User / Patient

Collection:

```text
users
```

Fields:

```text
_id
name
email
password
age
gender
contact
bloodGroup
profileImage
admin
createdAt
updatedAt
```

### Relationship

```text
Admin
  |
  | 1 : many
  |
  +---- Patient
  +---- Patient
  +---- Patient
```

`admin` stores the Admin ID assigned to the patient.

A patient may initially have:

```text
admin = null
```

until an admin assigns the patient.

---

## 6.3 Medication + Meal Schedule

Collection:

```text
meds_meal
```

Fields:

```text
_id
patientId
medications[]
meals[]
createdAt
updatedAt
```

Medication object:

```text
name
dosage
time
instructions
```

Meal object:

```text
mealType
time
description
```

Example:

```json
{
  "patientId": "PATIENT_ID",
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "time": "09:00",
      "instructions": "After breakfast"
    }
  ],
  "meals": [
    {
      "mealType": "Breakfast",
      "time": "08:00",
      "description": "Light breakfast"
    }
  ]
}
```

---

## 6.4 Patient Status

Collection:

```text
patientstatuses
```

Fields:

```text
_id
userId
status
notes
createdAt
updatedAt
```

Example:

```json
{
  "userId": "PATIENT_ID",
  "status": "Recovering",
  "notes": "Condition improving"
}
```

---

# 7. API Design

The application should have approximately 15 REST APIs.

---

## 7.1 Patient Authentication & Profile

### API 1 — Patient Signup

```http
POST /api/user/signup
```

Authentication:

```text
Public
```

Request:

```json
{
  "name": "Patient Name",
  "email": "patient@example.com",
  "password": "password",
  "age": 21,
  "gender": "Male",
  "contact": "9876543210",
  "bloodGroup": "B+"
}
```

Responsibilities:

1. Validate input
2. Check duplicate email
3. Hash password
4. Create patient
5. Generate JWT
6. Return patient + token

---

### API 2 — Patient Login

```http
POST /api/user/login
```

Authentication:

```text
Public
```

Request:

```json
{
  "email": "patient@example.com",
  "password": "password"
}
```

Responsibilities:

1. Find patient
2. Validate password
3. Generate JWT
4. Return patient + token

---

### API 3 — Get Patient Profile

```http
GET /api/user/profile
```

Authentication:

```text
Patient JWT
```

The patient ID comes from the JWT.

The frontend should not need to send a patient ID to retrieve the logged-in patient's own profile.

---

### API 4 — Update Patient Profile

```http
PATCH /api/user/profile
```

Authentication:

```text
Patient JWT
```

Allowed fields:

```text
name
age
gender
contact
bloodGroup
```

Do not allow this endpoint to change:

```text
email
password
admin
```

unless a separate feature is intentionally added later.

---

### API 5 — Upload Profile Picture

```http
PATCH /api/user/upload-profile
```

Authentication:

```text
Patient JWT
```

Uses:

```text
multipart/form-data
```

Stores the uploaded profile image and updates `profileImage`.

---

# 8. Admin Authentication & Profile

### API 6 — Admin Signup

```http
POST /api/admin/signup
```

Authentication:

```text
Public
```

Request:

```json
{
  "name": "Hospital Admin",
  "email": "admin@example.com",
  "password": "password",
  "instituteName": "ABC Hospital",
  "address": "Mumbai"
}
```

Responsibilities:

1. Validate input
2. Check duplicate email
3. Hash password
4. Create admin
5. Generate JWT
6. Return admin + token

---

### API 7 — Admin Login

```http
POST /api/admin/login
```

Authentication:

```text
Public
```

Request:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Returns:

```text
Admin information
JWT token
```

---

### API 8 — Get Admin Profile

```http
GET /api/admin/profile
```

Authentication:

```text
Admin JWT
```

Returns the logged-in admin's information.

---

# 9. Patient Management APIs

## API 9 — List / Search Admin Patients

```http
GET /api/admin/users
```

Authentication:

```text
Admin JWT
```

Optional query:

```http
GET /api/admin/users?query=yadnyesh
```

Backend logic:

```text
Get admin ID from JWT
        |
        v
Find users where:
admin == logged-in admin ID
        |
        v
Return patients
```

An admin must never receive patients belonging to another admin.

---

## API 10 — Get Patient Details

```http
GET /api/admin/users/:userId
```

Authentication:

```text
Admin JWT
```

Before returning the patient, verify:

```text
patient.admin == logged-in admin ID
```

If the patient belongs to another admin:

```http
403 Forbidden
```

---

## API 11 — Assign Patient

```http
PATCH /api/admin/users/:userId/assign
```

Authentication:

```text
Admin JWT
```

Purpose:

Assign an unassigned patient to the logged-in admin.

Backend:

```text
Patient.admin = req.admin._id
```

The endpoint should not allow an admin to arbitrarily assign or modify another admin's patients without the intended authorization rules.

For the basic project, the simplest workflow is:

```text
Patient signs up
        |
        v
admin = null
        |
        v
Admin searches patient
        |
        v
Admin assigns patient
        |
        v
patient.admin = admin._id
```

---

# 10. Schedule APIs

Medication and meals are treated as one patient schedule.

## API 12 — Get Patient Schedule

```http
GET /api/schedules/:patientId
```

Authentication:

```text
Patient OR Admin
```

Authorization:

### Patient

The patient can only access:

```text
patientId == req.user._id
```

### Admin

The admin can only access a patient where:

```text
patient.admin == req.admin._id
```

Returns:

```json
{
  "patientId": "PATIENT_ID",
  "medications": [],
  "meals": []
}
```

---

## API 13 — Create / Update Patient Schedule

```http
PUT /api/schedules/:patientId
```

Authentication:

```text
Admin JWT
```

Only the admin responsible for the patient can modify the schedule.

Request:

```json
{
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "time": "09:00",
      "instructions": "After breakfast"
    }
  ],
  "meals": [
    {
      "mealType": "Breakfast",
      "time": "08:00",
      "description": "Light breakfast"
    }
  ]
}
```

If a schedule does not exist:

```text
Create it
```

If it already exists:

```text
Update it
```

This avoids unnecessary create/update endpoints.

---

# 11. Patient Status APIs

## API 14 — Get Patient Status

```http
GET /api/patient-status/:patientId
```

Authentication:

```text
Patient OR Admin
```

Authorization follows the same rules as the schedule API.

Patient:

```text
Can see own status
```

Admin:

```text
Can see status of assigned patients
```

---

## API 15 — Update Patient Status

```http
PUT /api/patient-status/:patientId
```

Authentication:

```text
Admin JWT
```

Request:

```json
{
  "status": "Recovering",
  "notes": "Patient condition is improving."
}
```

Only the admin assigned to the patient can update the status.

---

# 12. Complete API Table

| # | Method | Endpoint | Auth | Purpose |
|---|---|---|---|---|
| 1 | POST | `/api/user/signup` | Public | Patient signup |
| 2 | POST | `/api/user/login` | Public | Patient login |
| 3 | GET | `/api/user/profile` | Patient | Get own profile |
| 4 | PATCH | `/api/user/profile` | Patient | Update own profile |
| 5 | PATCH | `/api/user/upload-profile` | Patient | Upload profile picture |
| 6 | POST | `/api/admin/signup` | Public | Admin signup |
| 7 | POST | `/api/admin/login` | Public | Admin login |
| 8 | GET | `/api/admin/profile` | Admin | Get own admin profile |
| 9 | GET | `/api/admin/users` | Admin | List/search patients |
| 10 | GET | `/api/admin/users/:userId` | Admin | View patient details |
| 11 | PATCH | `/api/admin/users/:userId/assign` | Admin | Assign patient |
| 12 | GET | `/api/schedules/:patientId` | Patient/Admin | View schedule |
| 13 | PUT | `/api/schedules/:patientId` | Admin | Create/update schedule |
| 14 | GET | `/api/patient-status/:patientId` | Patient/Admin | View patient status |
| 15 | PUT | `/api/patient-status/:patientId` | Admin | Update patient status |

---

# 13. Authentication Design

The current project has inconsistent token storage. The final implementation should make it consistent.

## Patient

Frontend stores:

```text
localStorage
└── token
```

Requests:

```http
Authorization: Bearer <token>
```

Backend middleware:

```text
authMiddleware
      |
      v
req.user
```

---

## Admin

Frontend stores:

```text
localStorage
└── adminToken
```

Requests:

```http
Authorization: Bearer <adminToken>
```

Backend middleware:

```text
requireAdminAuth
      |
      v
req.admin
```

Do not store the admin token inside a complicated JSON object unless there is an actual need for it.

---

# 14. Authorization Rules

Authentication answers:

> "Who are you?"

Authorization answers:

> "Are you allowed to access this?"

These rules must be enforced on the backend.

---

## Patient Rules

A patient can:

```text
GET     /api/user/profile
PATCH   /api/user/profile
PATCH   /api/user/upload-profile

GET     /api/schedules/:ownId
GET     /api/patient-status/:ownId
```

A patient cannot:

```text
View another patient
Modify another patient's schedule
Modify patient status
Assign patients
View admin-only patient lists
```

---

## Admin Rules

An admin can:

```text
GET     /api/admin/profile
GET     /api/admin/users
GET     /api/admin/users/:userId
PATCH   /api/admin/users/:userId/assign

GET     /api/schedules/:patientId
PUT     /api/schedules/:patientId

GET     /api/patient-status/:patientId
PUT     /api/patient-status/:patientId
```

But only for patients assigned to that admin.

---

# 15. Patient Workflow

```text
                     Patient
                        |
              +---------+---------+
              |                   |
            Signup              Login
              |                   |
              +---------+---------+
                        |
                        v
                Patient Dashboard
                        |
        +---------------+---------------+
        |               |               |
        v               v               v
     Profile         Schedule          Status
        |               |               |
        |          +----+----+          |
        |          |         |          |
        |         Meds     Meals        |
        |                               |
        +-------------------------------+
```

---

# 16. Admin Workflow

```text
                     Admin
                       |
                 Signup / Login
                       |
                       v
                Admin Dashboard
                       |
                 Patient List
                       |
          +------------+------------+
          |                         |
          v                         v
      Search                    Select Patient
                                    |
                                    v
                             Patient Details
                                    |
                     +--------------+--------------+
                     |              |              |
                     v              v              v
                Medication        Meals         Status
                  Schedule       Schedule       Update
```

---

# 17. Patient Assignment Workflow

```text
Patient Signup
      |
      v
Patient created
      |
      v
admin = null
      |
      v
Admin logs in
      |
      v
Admin searches patients
      |
      v
Finds unassigned patient
      |
      v
Assign patient
      |
      v
patient.admin = admin._id
      |
      v
Patient now belongs to that admin
```

---

# 18. Schedule Workflow

```text
Admin selects patient
        |
        v
GET /api/schedules/:patientId
        |
        v
Schedule exists?
    /           \
  YES            NO
   |              |
   v              v
Display        Empty schedule
schedule           |
   |               |
   +-------+-------+
           |
           v
Admin edits medications/meals
           |
           v
PUT /api/schedules/:patientId
           |
           v
MongoDB updated
           |
           v
Patient dashboard displays
updated schedule
```

---

# 19. Patient Status Workflow

```text
Admin selects patient
        |
        v
Update health status
        |
        v
PUT /api/patient-status/:patientId
        |
        v
MongoDB
        |
        v
Patient opens dashboard
        |
        v
GET /api/patient-status/:patientId
        |
        v
Current status displayed
```

---

# 20. Frontend Pages

The final frontend should be approximately:

```text
client/src/pages/

Home/
Login/
AdminSignup/
PatientDashboard/
AdminDashboard/
PatientProfile/
```

Additional components can be organized normally under:

```text
client/src/components/
```

---

# 21. Patient UI

## Home

Simple landing page.

Actions:

```text
Login
Sign Up
Admin Login
```

---

## Login

Allow:

```text
Patient Login
Admin Login
```

---

## Patient Dashboard

The dashboard should contain:

```text
Welcome / Patient Information

Current Health Status

Today's Medications

Today's Meals
```

There must be **no billing section**.

---

## Patient Profile

Display:

```text
Name
Email
Age
Gender
Contact
Blood Group
Profile Picture
Assigned Hospital/Admin
```

Allow editing of appropriate profile fields.

---

# 22. Admin UI

## Admin Dashboard

Basic layout:

```text
Admin Dashboard

Institute Information

Patient Search

Patient List
```

---

## Patient Details

When an admin selects a patient:

```text
Patient Information

Health Status
    |
    +-- Status
    +-- Notes

Medication Schedule
    |
    +-- Add/Edit Medication

Meal Schedule
    |
    +-- Add/Edit Meal
```

---

# 23. Error Handling

Use simple HTTP status codes.

### 200

Successful GET/update.

### 201

Successful creation.

### 400

Invalid request.

### 401

Not authenticated.

```text
Missing/invalid JWT
```

### 403

Authenticated but not authorized.

Example:

```text
Admin tries to access another admin's patient
```

### 404

Resource does not exist.

### 409

Duplicate resource.

Example:

```text
Email already registered
```

### 500

Unexpected server error.

---

# 24. Validation

Validate requests at the backend.

Examples:

### Signup

```text
name       required
email      valid email
password   required
age        valid number
gender     valid value
contact    valid
bloodGroup valid
```

### Schedule

```text
medications must be an array
meals must be an array
medication name required
time valid
meal type required
```

### Patient Status

```text
status required
notes optional
```

Keep validation simple. Do not over-engineer it.

---

# 25. Frontend API Handling

The existing project currently performs API calls directly inside components and has an empty `services` directory.

The final implementation should introduce a small API layer.

Example:

```text
client/src/services/
│
├── authService.js
├── userService.js
├── adminService.js
└── scheduleService.js
```

This is enough.

Do not build a large API abstraction framework.

A simple shared API helper can handle:

```text
base URL
Authorization header
JSON handling
common errors
```

---

# 26. Route Protection on Frontend

Use React Router.

Basic structure:

```text
/
├── /login
├── /admin-signup
├── /pdashboard
├── /profile
└── /admin
```

Protected routes:

```text
/pdashboard
/profile
```

require patient authentication.

```text
/admin
```

requires admin authentication.

Frontend route protection improves user experience, but the backend must still enforce authorization.

---

# 27. Backend Request Flow

For a protected request:

```text
Frontend
   |
   | Authorization: Bearer JWT
   v
Express Route
   |
   v
Authentication Middleware
   |
   +---- Invalid --> 401
   |
   v
Controller
   |
   v
Service
   |
   v
Mongoose Model
   |
   v
MongoDB
   |
   v
Response
   |
   v
Frontend
```

For admin patient operations:

```text
JWT
 |
 v
requireAdminAuth
 |
 v
req.admin
 |
 v
Find patient
 |
 v
Verify patient.admin === req.admin._id
 |
 +---- No --> 403
 |
 v
Perform operation
```

---

# 28. Files / Features to Remove

The implementation agent must search the complete repository for billing references.

Search for:

```text
billing
Billing
bill
Bill
invoice
Invoice
invoiceId
amount
payment
```

Then remove or update every legitimate billing-related reference.

Check:

```text
routes
controllers
services
models
validators
frontend pages
frontend components
API calls
navigation
dashboard
shared constants
environment/config
documentation
tests
README
```

Do not leave dead billing code behind.

---

# 29. Existing Issues That Must Be Fixed

The audit identified several existing issues that should be resolved during implementation.

## Authentication inconsistency

Current patient and admin token storage differs.

Final system should use:

```text
token
adminToken
```

consistently.

---

## Medication authentication

The current medication/meal routes lack proper authentication protection.

Every schedule endpoint must verify authentication and authorization.

---

## Patient ownership

Every operation involving:

```text
patientId
```

must verify that the requesting user/admin is allowed to access that patient.

---

## Frontend API organization

Move repeated API request logic into the simple `services` directory.

---

## Patient status integration

The backend already has patient-status functionality, but the frontend integration is incomplete.

The final frontend must use:

```text
GET /api/patient-status/:patientId
PUT /api/patient-status/:patientId
```

consistently.

---

# 30. What NOT to Build

Do not add any of the following unless explicitly requested later:

```text
Billing
Payments
Invoices
Doctor role
Nurse role
Appointment system
Chat
Video calling
Notifications
Email notification service
SMS
Redis
Kafka
RabbitMQ
Microservices
API Gateway
GraphQL
WebSockets
AI diagnosis
AI chatbot
Recommendation engine
Complex analytics
Payment gateway
Cloud storage
Complex caching
Background job system
```

The goal is a clean, understandable college project.

---

# 31. Final Feature Set

| Feature | Keep? |
|---|---|
| Patient Signup | YES |
| Patient Login | YES |
| Admin Signup | YES |
| Admin Login | YES |
| Patient Profile | YES |
| Profile Image | YES |
| Admin Profile | YES |
| Patient Assignment | YES |
| Patient Search | YES |
| Patient Details | YES |
| Medication Schedule | YES |
| Meal Schedule | YES |
| Patient Health Status | YES |
| Logout | YES |
| Billing | NO |
| Invoice | NO |
| Payment | NO |

---

# 32. Final System in One Diagram

```text
                         YOURHEALTHCO
                              |
             +----------------+----------------+
             |                                 |
             v                                 v
          PATIENT                            ADMIN
             |                                 |
       +-----+------+                    +-----+------+
       |     |      |                    |     |      |
       v     v      v                    v     v      v
    Profile Meds  Status              Patients Profile Schedule
              |                          |
              |                     +----+----+
              |                     |         |
              |                     v         v
              |                   Search   Patient
              |                              Details
              |                                 |
              |                     +-----------+-----------+
              |                     |           |           |
              |                     v           v           v
              |                   Meds        Meals       Status
              |                     |           |           |
              +---------------------+-----------+-----------+
                                    |
                                    v
                                MongoDB
                                    |
                   +----------------+----------------+
                   |                |                |
                   v                v                v
                 Admins           Users        Meds/Meals
                                                     |
                                                     v
                                               Patient Status
```

---

# 33. Implementation Principle

Build the system in this order:

```text
1. Clean/remove billing
        ↓
2. Clean database models
        ↓
3. Fix authentication
        ↓
4. Implement patient APIs
        ↓
5. Implement admin APIs
        ↓
6. Implement patient assignment
        ↓
7. Implement schedule APIs
        ↓
8. Implement patient status APIs
        ↓
9. Test backend completely
        ↓
10. Build frontend against stable APIs
        ↓
11. Integrate frontend + backend
        ↓
12. Final testing and cleanup
```

Backend should be completed and tested before spending significant time on frontend UI.

---

# 34. Definition of Done

The backend is considered complete when:

- Patient signup works
- Patient login works
- Patient profile works
- Profile update works
- Profile image upload works
- Admin signup works
- Admin login works
- Admin profile works
- Admin can list patients
- Admin can search patients
- Admin can view a patient
- Admin can assign a patient
- Admin can create/update medication schedule
- Admin can create/update meal schedule
- Patient can view schedule
- Admin can update patient status
- Patient can view own status
- Unauthorized users receive 401
- Unauthorized access to another patient's data receives 403
- Billing is completely removed
- No broken billing references remain
- No medication/status endpoint is left unprotected
- MongoDB contains only the required collections
- Frontend can consume all final APIs

---

# 35. Important Instruction for AI Implementation Agents

This document is the **approved system design and scope**.

When implementing:

1. Follow this document instead of inventing additional features.
2. Keep the architecture basic.
3. Do not add billing back.
4. Do not add new roles without explicit approval.
5. Do not introduce unnecessary technologies.
6. Inspect existing code before changing it.
7. Reuse working code where reasonable.
8. Remove obsolete code rather than leaving dead code.
9. Keep backend APIs consistent.
10. Enforce authorization on the backend.
11. After each implementation phase, update the project's progress/documentation file so another AI can continue from the exact current state.
12. Do not start frontend work until the backend APIs for the relevant feature are implemented and tested.

This specification defines the target system. It should be treated as the source of truth for implementation.
