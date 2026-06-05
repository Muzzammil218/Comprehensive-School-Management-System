// frontend/assets/js/auth.js
import apiRequest from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const logoutBtn = document.getElementById("logoutBtn");

  // Handle registration
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("regUsername").value.trim();
      const password = document.getElementById("regPassword").value.trim();

      try {
        const res = await apiRequest("/auth/register", "POST", {
          username,
          password
        });

        if (res.status === "success") {
          alert("✅ Registration successful! You can now log in.");
          registerForm.reset();
          window.location.href = "login.html";
        }
      } catch (err) {
        alert("❌ Registration failed: " + err.message);
      }
    });
  }

  // Handle logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      alert("👋 Logged out successfully!");
      window.location.href = "login.html";
    });
  }
});
