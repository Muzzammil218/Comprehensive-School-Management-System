const API_BASE = "http://127.0.0.1:8000/api/v1";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const json = await res.json();

    if (json.status === "success") {
      // Save JWT in localStorage
      localStorage.setItem("token", json.token);
      localStorage.setItem("role", json.role);

      // Redirect to dashboard
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("errorMsg").classList.remove("hidden");
    }
  } catch (err) {
    console.error("Login error:", err);
    document.getElementById("errorMsg").classList.remove("hidden");
  }
});
