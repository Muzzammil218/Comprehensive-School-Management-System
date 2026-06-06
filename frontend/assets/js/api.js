// frontend/assets/js/api.js

/**
 * Generic API request helper
 * @param {string} endpoint - API endpoint (e.g. "/students")
 * @param {string} method - HTTP method ("GET", "POST", "PUT", "DELETE")
 * @param {object} body - Request body (optional)
 * @returns {Promise<object>} - Parsed JSON response
 */
export default async function apiRequest(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  // Attach JWT if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(endpoint, options);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API request failed");
  }

  return res.json();
}
