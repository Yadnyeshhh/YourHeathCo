# Initial Codebase Audit

## Repository Overview (pre‑implementation)

- **Root**
  - `YOURHEALTHCO_PROJECT_SPEC.md` – source of truth for the project.
  - `README.md`, `package.json`.
- **Server (`/server`)**
  - **Models**: `userModel.js`, `adminModel.js`, `billingModel.js` (removed later), other domain models.
  - **Middleware**:
    - `auth.js` – JWT verification for **patients** only, expects payload `{ _id }` and uses `process.env.SECRET`.
    - `requireAdminAuth.js` – JWT verification for **admins** only, same env var.
    - `authOrAdmin.js` – hybrid middleware that tries patient then admin, also uses `process.env.SECRET`.
    - `validate.js` – request validation.
  - **Controllers**:
    - `userController.js` – user signup/login, profile, admin‑related actions.
    - `adminController.js` – admin signup/login, profile, `getAllUsers` (returns all users, not filtered initially).
    - `billingController.js` – **billing** CRUD endpoints (to be removed).
    - `meds_meal.js` – schedule controller, creates/updates patient medication/meal schedule. No ownership checks.
    - `PatientStatusController.js` – update patient status, no GET endpoint, no ownership checks.
  - **Routes**:
    - `user.js` – imports `auth.js` for patient routes and `requireAdminAuth.js` (as `auth`) for admin‑only actions.
    - `admin.js` – protects routes with `requireAdminAuth.js`.
    - `billingRoutes.js` – mounts under `/api/billing`.
    - `meds_meal.js` – schedule routes (create, patch, get) without auth middleware.
    - `patientStatusRoutes.js` – protected by `requireAdminAuth.js`.
  - **Services**:
    - `userService.js` – creates JWT with `jwt.sign({ _id }, process.env.SECRET, …)`.
    - `adminService.js` – same pattern for admins.
    - `billingService.js` – billing logic.
  - **Validators** – include `billingValidator.js`.
- **Client (`/client/src`)**
  - React app using component state and `localStorage` for tokens.
  - **Billing UI** under `components/patient-dashboard/BillingSection/`.
  - **Auth utils** (`utils/auth.js`) provide `getToken`, `getAdminToken`, header helpers.
  - Empty `redux` folder.

## Key Points Before Changes

1. **Authentication** – two separate middlewares (`auth.js`, `requireAdminAuth.js`) with identical JWT verification but no `role` claim.
2. **Authorization** – no role‑based checks; admin routes use `requireAdminAuth.js`, patient routes use `auth.js`.
3. **Billing** – fully functional module with models, controllers, routes, validators, UI, and tests.
4. **Environment Variables** – JWT secret stored in `process.env.SECRET`.
5. **Ownership** – schedule and status controllers do not verify that the requesting user owns the patient data.
6. **Frontend State** – Redux directory empty, app relies on component state and `localStorage`.

This audit captures the state of the codebase *prior* to any modifications made during the implementation.
