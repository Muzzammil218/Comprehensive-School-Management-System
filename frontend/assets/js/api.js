// frontend/assets/js/api.js

const API_BASE = "http://localhost:8000/api/v1"; // adjust if deployed

/**
 * Generic fetch wrapper with JWT support
 * @param {string} endpoint - API endpoint (e.g. "/students")
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} body - Request body (optional)
 * @returns {Promise<object>} - JSON response
 */
async function apiRequest(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("token"); // JWT stored after login

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

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (err) {
    console.error("❌ API Error:", err.message);
    throw err;
  }
}

export default apiRequest;
