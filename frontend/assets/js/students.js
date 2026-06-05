// frontend/assets/js/students.js
import apiRequest from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const studentForm = document.getElementById("studentForm");
  const studentTable = document.getElementById("studentTable");

  // Load all students initially
  loadStudents();

  // Handle form submission (Create student)
  if (studentForm) {
    studentForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("studentName").value.trim();
      const age = document.getElementById("studentAge").value.trim();
      const classId = document.getElementById("studentClass").value.trim();

      try {
        await apiRequest("/students", "POST", {
          name,
          age,
          class_id: classId
        });

        alert("✅ Student added successfully!");
        studentForm.reset();
        loadStudents();
      } catch (err) {
        alert("❌ Error adding student: " + err.message);
      }
    });
  }

  // Load students into table
  async function loadStudents() {
    try {
      const res = await apiRequest("/students");
      if (res.status === "success") {
        renderTable(res.data);
      }
    } catch (err) {
      console.error("❌ Error loading students:", err.message);
    }
  }

  // Render table rows
  function renderTable(students) {
    if (!studentTable) return;
    studentTable.innerHTML = "";

    students.forEach((s) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${s.student_id}</td>
        <td>${s.name}</td>
        <td>${s.age}</td>
        <td>${s.class_id}</td>
        <td>
          <button class="edit-btn" data-id="${s.student_id}">✏️ Edit</button>
          <button class="delete-btn" data-id="${s.student_id}">🗑️ Delete</button>
        </td>
      `;
      studentTable.appendChild(row);
    });

    // Attach edit/delete handlers
    document.querySelectorAll(".edit-btn").forEach((btn) =>
      btn.addEventListener("click", () => editStudent(btn.dataset.id))
    );
    document.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", () => deleteStudent(btn.dataset.id))
    );
  }

  // Edit student
  async function editStudent(id) {
    const newName = prompt("Enter new name:");
    const newAge = prompt("Enter new age:");
    const newClassId = prompt("Enter new class ID:");

    if (!newName || !newAge || !newClassId) return;

    try {
      await apiRequest(`/students/${id}`, "PUT", {
        name: newName,
        age: newAge,
        class_id: newClassId
      });
      alert("✅ Student updated!");
      loadStudents();
    } catch (err) {
      alert("❌ Error updating student: " + err.message);
    }
  }

  // Delete student
  async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      await apiRequest(`/students/${id}`, "DELETE");
      alert("✅ Student deleted!");
      loadStudents();
    } catch (err) {
      alert("❌ Error deleting student: " + err.message);
    }
  }
});
