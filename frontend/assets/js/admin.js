// frontend/assets/js/admin.js
import apiRequest from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const adminForm = document.getElementById("adminForm");
  const adminTable = document.getElementById("adminTable");

  // Load all admins initially
  loadAdmins();

  // Handle form submission (Create admin)
  if (adminForm) {
    adminForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("adminUsername").value.trim();
      const password = document.getElementById("adminPassword").value.trim();

      try {
        await apiRequest("/admins", "POST", {
          username,
          password
        });

        alert("✅ Admin added successfully!");
        adminForm.reset();
        loadAdmins();
      } catch (err) {
        alert("❌ Error adding admin: " + err.message);
      }
    });
  }

  // Load admins into table
  async function loadAdmins() {
    try {
      const res = await apiRequest("/admins");
      if (res.status === "success") {
        renderTable(res.data);
      }
    } catch (err) {
      console.error("❌ Error loading admins:", err.message);
    }
  }

  // Render table rows
  function renderTable(admins) {
    if (!adminTable) return;
    adminTable.innerHTML = "";

    admins.forEach((a) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${a.admin_id}</td>
        <td>${a.username}</td>
        <td>
          <button class="edit-btn" data-id="${a.admin_id}">✏️ Edit</button>
          <button class="delete-btn" data-id="${a.admin_id}">🗑️ Delete</button>
        </td>
      `;
      adminTable.appendChild(row);
    });

    // Attach edit/delete handlers
    document.querySelectorAll(".edit-btn").forEach((btn) =>
      btn.addEventListener("click", () => editAdmin(btn.dataset.id))
    );
    document.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", () => deleteAdmin(btn.dataset.id))
    );
  }

  // Edit admin
  async function editAdmin(id) {
    const newUsername = prompt("Enter new username:");
    const newPassword = prompt("Enter new password:");

    if (!newUsername || !newPassword) return;

    try {
      await apiRequest(`/admins/${id}`, "PUT", {
        username: newUsername,
        password: newPassword
      });
      alert("✅ Admin updated!");
      loadAdmins();
    } catch (err) {
      alert("❌ Error updating admin: " + err.message);
    }
  }

  // Delete admin
  async function deleteAdmin(id) {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      await apiRequest(`/admins/${id}`, "DELETE");
      alert("✅ Admin deleted!");
      loadAdmins();
    } catch (err) {
      alert("❌ Error deleting admin: " + err.message);
    }
  }
});
