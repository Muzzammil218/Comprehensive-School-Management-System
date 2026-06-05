// frontend/assets/js/teachers.js
import apiRequest from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const teacherForm = document.getElementById("teacherForm");
  const teacherTable = document.getElementById("teacherTable");

  // Load all teachers initially
  loadTeachers();

  // Handle form submission (Create teacher)
  if (teacherForm) {
    teacherForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("teacherName").value.trim();
      const subject = document.getElementById("teacherSubject").value.trim();

      try {
        await apiRequest("/teachers", "POST", {
          name,
          subject
        });

        alert("✅ Teacher added successfully!");
        teacherForm.reset();
        loadTeachers();
      } catch (err) {
        alert("❌ Error adding teacher: " + err.message);
      }
    });
  }

  // Load teachers into table
  async function loadTeachers() {
    try {
      const res = await apiRequest("/teachers");
      if (res.status === "success") {
        renderTable(res.data);
      }
    } catch (err) {
      console.error("❌ Error loading teachers:", err.message);
    }
  }

  // Render table rows
  function renderTable(teachers) {
    if (!teacherTable) return;
    teacherTable.innerHTML = "";

    teachers.forEach((t) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${t.teacher_id}</td>
        <td>${t.name}</td>
        <td>${t.subject}</td>
        <td>
          <button class="edit-btn" data-id="${t.teacher_id}">✏️ Edit</button>
          <button class="delete-btn" data-id="${t.teacher_id}">🗑️ Delete</button>
        </td>
      `;
      teacherTable.appendChild(row);
    });

    // Attach edit/delete handlers
    document.querySelectorAll(".edit-btn").forEach((btn) =>
      btn.addEventListener("click", () => editTeacher(btn.dataset.id))
    );
    document.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", () => deleteTeacher(btn.dataset.id))
    );
  }

  // Edit teacher
  async function editTeacher(id) {
    const newName = prompt("Enter new name:");
    const newSubject = prompt("Enter new subject:");

    if (!newName || !newSubject) return;

    try {
      await apiRequest(`/teachers/${id}`, "PUT", {
        name: newName,
        subject: newSubject
      });
      alert("✅ Teacher updated!");
      loadTeachers();
    } catch (err) {
      alert("❌ Error updating teacher: " + err.message);
    }
  }

  // Delete teacher
  async function deleteTeacher(id) {
    if (!confirm("Are you sure you want to delete this teacher?")) return;

    try {
      await apiRequest(`/teachers/${id}`, "DELETE");
      alert("✅ Teacher deleted!");
      loadTeachers();
    } catch (err) {
      alert("❌ Error deleting teacher: " + err.message);
    }
  }
});
