import api from "./api";

/**
 * Admin login → calls POST /auth/admin-login on the backend.
 *
 * On success, stores the token and user in localStorage using
 * the same keys the global api interceptor expects.
 *
 * @param {{ login: string, password: string }} credentials
 * @returns {Promise<object>}  The parsed response body
 */
export async function adminLoginApi(credentials) {
  const res = await api.post("/auth/admin-login", credentials);
  const body = res.data; // { status, message, token, token_type, data: {...} }

  if (body.token) {
    localStorage.setItem("lms_api_token", body.token);
  }
  if (body.data) {
    localStorage.setItem("lms_api_user", JSON.stringify(body.data));
  }

  return body;
}

/**
 * Clear auth state from localStorage.
 */
export function adminLogout() {
  localStorage.removeItem("lms_api_token");
  localStorage.removeItem("lms_api_user");
}

/**
 * Legacy stub – kept so SignIn.jsx doesn't break.
 * Admin login is now handled exclusively through the dedicated
 * /admin/login page (AdminLogin.jsx) which calls the real API.
 */
export function matchAdminCredential() {
  return null;
}
