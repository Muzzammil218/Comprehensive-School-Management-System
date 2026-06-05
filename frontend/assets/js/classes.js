// frontend/assets/js/classes.js
import apiRequest from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const classForm = document.getElementById("classForm");
  const classTable = document.getElementById("classTable");

  // Load all classes initially
  loadClasses();

  // Handle form submission (Create class)
  if (classForm) {
    classForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const className = document.getElementById("className").value.trim();
      const section = document.getElementById("classSection").value.trim();

      try {
        await apiRequest("/classes", "POST", {
          class_name: className,
          section
        });

        alert("✅ Class added successfully!");
        classForm.reset();
        loadClasses();
      } catch (err) {
        alert("❌ Error adding class: " + err.message);
      }
    });
  }

  // Load classes into table
  async function loadClasses() {
    try {
      const res = await apiRequest("/classes");
      if (res.status === "success") {
        renderTable(res.data);
      }
    } catch (err) {
      console.error("❌ Error loading classes:", err.message);
    }
  }

  // Render table rows
  function renderTable(classes) {
    if (!classTable) return;
    classTable.innerHTML = "";

    classes.forEach((c) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.class_id}</td>
        <td>${c.class_name}</td>
        <td>${c.section}</td>
        <td>
          <button class="edit-btn" data-id="${c.class_id}">✏️ Edit</button>
          <button class="delete-btn" data-id="${c.class_id}">🗑️ Delete</button>
        </td>
      `;
      classTable.appendChild(row);
    });

    // Attach edit/delete handlers
    document.querySelectorAll(".edit-btn").forEach((btn) =>
      btn.addEventListener("click", () => editClass(btn.dataset.id))
    );
    document.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", () => deleteClass(btn.dataset.id))
    );
  }

  // Edit class
  async function editClass(id) {
    const newName = prompt("Enter new class name:");
    const newSection = prompt("Enter new section:");

    if (!newName || !newSection) return;

    try {
      await apiRequest(`/classes/${id}`, "PUT", {
        class_name: newName,
        section: newSection
      });
      alert("✅ Class updated!");
      loadClasses();
    } catch (err) {
      alert("❌ Error updating class: " + err.message);
    }
  }

  // Delete class
  async function deleteClass(id) {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      await apiRequest(`/classes/${id}`, "DELETE");
      alert("✅ Class deleted!");
      loadClasses();
    } catch (err) {
      alert("❌ Error deleting class: " + err.message);
    }
  }
});
