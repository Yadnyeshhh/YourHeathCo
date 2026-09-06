/**
 * auth.js — Centralized token helpers for the patient (user) auth flow.
 *
 * Login stores:
 *   localStorage.setItem("token", <jwt-string>)
 *   localStorage.setItem("userEmail", <email-string>)
 *
 * Admin login stores:
 *   localStorage.setItem("admin", JSON.stringify({ email, token }))
 */

// ─── Patient auth ────────────────────────────────────────────────────────────

/** Returns the raw JWT string, or null if not logged in. */
export const getToken = () => localStorage.getItem("token");

/** Returns an Authorization header object ready for fetch/axios. */
export const getAuthHeaders = () => {
  const token = getToken();
  // console.log(token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Clears all patient session data. */
export const clearPatientSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
};

/** Returns true if a patient token is present in storage. */
export const isPatientLoggedIn = () => Boolean(getToken());

// ─── Admin auth ──────────────────────────────────────────────────────────────

/** Returns the { email, token } admin object, or null. */
export const getAdminSession = () => {
  try {
    const raw = localStorage.getItem("admin");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** Returns the admin JWT string, or null. */
export const getAdminToken = () => getAdminSession()?.token || null;

/** Returns an Authorization header object for admin requests. */
export const getAdminAuthHeaders = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Clears the admin session. */
export const clearAdminSession = () => {
  localStorage.removeItem("admin");
};

/** Returns true if an admin token is present in storage. */
export const isAdminLoggedIn = () => Boolean(getAdminToken());
