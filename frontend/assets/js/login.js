// frontend/assets/js/login.js
import apiRequest from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        const res = await apiRequest("/auth/login", "POST", { username, password });

        if (res.token) {
          localStorage.setItem("token", res.token);
          alert("✅ Login successful!");
          // ✅ Fixed redirect
          window.location.href = "/dashboard";
        }
      } catch (err) {
        alert("❌ Login failed: " + err.message);
      }
    });
  }
});
