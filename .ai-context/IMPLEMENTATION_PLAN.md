# Implementation Plan

## Phase 3 — Ownership Validation

The next phase focuses on ensuring that schedule (`meds_meal.js`) and patient‑status controllers enforce proper ownership checks.

### Tasks
- **Schedule Controller**: Verify that the authenticated admin (`req.auth.id`) matches the `adminId` stored on the schedule before allowing updates or deletions.
- **Patient‑Status Controller**: Ensure only the patient who owns the status (`req.auth.id`) or an admin can modify the status.
- Add utility function `checkOwnership(resourceOwnerId, authId)` in a new helper file `utils/ownership.js`.
- Write unit tests for the new ownership middleware.
- Update route files to use the new `checkOwnership` middleware.

### Verification
- Run `npm run server` and use Postman/curl to attempt unauthorized updates – should receive 403.
- Run the new unit tests (`npm test`).

### Documentation
- Update `.ai-context/CURRENT_PHASE.md` to reflect Phase 3 IN PROGRESS.
- Add entries to `CHANGELOG.md`.

## Open Issues
- None identified after Phase 2.
\n\n*This file will be populated after the audit.*
