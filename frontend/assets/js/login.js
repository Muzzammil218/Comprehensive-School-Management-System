// frontend/assets/js/login.js
import apiRequest from "./api.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await apiRequest("/auth/login", "POST", { username, password });

    if (res.token) {
      localStorage.setItem("token", res.token);
      alert("✅ Login successful!");
      window.location.href = "/dashboard";
    } else {
      alert("❌ Login failed");
    }
  } catch (err) {
    alert("❌ Error: " + err.message);
  }
});
