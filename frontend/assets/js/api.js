const API_BASE = "http://127.0.0.1:8000/api/v1";

/**
 * Generic API request wrapper with JWT support
 * @param {string} endpoint - API endpoint (e.g. "/students")
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} body - Request body (optional)
 * @returns {Promise<object>} - JSON response
 */
async function apiRequest(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, options);

  // Handle unauthorized
  if (res.status === 401) {
    alert("Session expired. Please log in again.");
    window.location.href = "login.html";
    return;
  }

  return res.json();
}
