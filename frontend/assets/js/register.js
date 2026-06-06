// frontend/assets/js/register.js
import apiRequest from "./api.js";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  try {
    const res = await apiRequest("/auth/register", "POST", { username, password, role });

    if (res.status === "success") {
      alert("✅ Registration successful! Please login.");
      window.location.href = "/login";
    } else {
      alert("❌ Registration failed");
    }
  } catch (err) {
    alert("❌ Error: " + err.message);
  }
});
