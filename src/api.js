import axios from "axios";

// ────────────────────────────────────────────────────────────────────
// Global Axios instance – every API call in the app goes through this.
// ────────────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8002/api",
  headers: {
    Accept: "application/json",
  },
});

// ─── REQUEST interceptor → attach Bearer token ─────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lms_api_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE interceptor → handle 401 / 422 globally ─────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const token = localStorage.getItem("lms_api_token");

    // Unauthorized with a stale token → force logout
    if (status === 401 && token) {
      localStorage.removeItem("lms_api_token");
      localStorage.removeItem("lms_api_user");

      alert("Session expired. Please login again.");
      window.location.href = "/admin/login";
    }

    // Validation errors from the server
    if (status === 422) {
      const msg = error.response?.data?.message || "Validation failed";
      alert(msg);
    }

    return Promise.reject(error);
  }
);

export default api;