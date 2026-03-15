/**
 * Shared API route constants
 * Used for documentation purposes — the frontend uses VITE_API_URL env variable
 * and the backend defines routes directly in route files.
 */

const API_ROUTES = {
  // User routes
  USER_LOGIN: '/api/user/login',
  USER_SIGNUP: '/api/user/signup',
  USER_PROFILE: '/api/user/profile',
  USER_UPDATE: '/api/user/update/:id',
  USER_SEARCH: '/api/user/search',
  USER_ASSIGN: '/api/user/assign/:id',
  USER_UNASSIGN: '/api/user/unassign/:id',
  USER_ALL: '/api/user/all',

  // Admin routes
  ADMIN_LOGIN: '/api/admin/login',
  ADMIN_SIGNUP: '/api/admin/signup',
  ADMIN_PROFILE: '/api/admin/profile',
  ADMIN_USERS: '/api/admin/users',

  // Meds & Meals routes
  MEDS_CREATE: '/api/meds_meals/create/:id',
  MEDS_UPDATE: '/api/meds_meals/patient/:id/medications',
  MEDS_SCHEDULE: '/api/meds_meals/patient/:id/schedule',

  // Patient Status routes
  PATIENT_STATUS_UPDATE: '/api/patient-status/:userId',
};

module.exports = API_ROUTES;
