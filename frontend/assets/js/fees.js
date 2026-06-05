// frontend/assets/js/fee.js
import apiRequest from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const feeForm = document.getElementById("feeForm");
  const feeTable = document.getElementById("feeTable");

  // Load all fees initially
  loadFees();

  // Handle form submission (Create fee record)
  if (feeForm) {
    feeForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const studentId = document.getElementById("feeStudent").value.trim();
      const amount = document.getElementById("feeAmount").value.trim();
      const status = document.getElementById("feeStatus").value.trim();

      try {
        await apiRequest("/fees", "POST", {
          student_id: studentId,
          amount,
          status
        });

        alert("✅ Fee record added successfully!");
        feeForm.reset();
        loadFees();
      } catch (err) {
        alert("❌ Error adding fee record: " + err.message);
      }
    });
  }

  // Load fees into table
  async function loadFees() {
    try {
      const res = await apiRequest("/fees");
      if (res.status === "success") {
        renderTable(res.data);
      }
    } catch (err) {
      console.error("❌ Error loading fees:", err.message);
    }
  }

  // Render table rows
  function renderTable(fees) {
    if (!feeTable) return;
    feeTable.innerHTML = "";

    fees.forEach((f) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${f.fee_id}</td>
        <td>${f.student_id}</td>
        <td>${f.amount}</td>
        <td>${f.status}</td>
        <td>
          <button class="edit-btn" data-id="${f.fee_id}">✏️ Edit</button>
          <button class="delete-btn" data-id="${f.fee_id}">🗑️ Delete</button>
        </td>
      `;
      feeTable.appendChild(row);
    });

    // Attach edit/delete handlers
    document.querySelectorAll(".edit-btn").forEach((btn) =>
      btn.addEventListener("click", () => editFee(btn.dataset.id))
    );
    document.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", () => deleteFee(btn.dataset.id))
    );
  }

  // Edit fee record
  async function editFee(id) {
    const newAmount = prompt("Enter new amount:");
    const newStatus = prompt("Enter new status (Paid/Unpaid/Partially Paid):");

    if (!newAmount || !newStatus) return;

    try {
      await apiRequest(`/fees/${id}`, "PUT", {
        amount: newAmount,
        status: newStatus
      });
      alert("✅ Fee record updated!");
      loadFees();
    } catch (err) {
      alert("❌ Error updating fee record: " + err.message);
    }
  }

  // Delete fee record
  async function deleteFee(id) {
    if (!confirm("Are you sure you want to delete this fee record?")) return;

    try {
      await apiRequest(`/fees/${id}`, "DELETE");
      alert("✅ Fee record deleted!");
      loadFees();
    } catch (err) {
      alert("❌ Error deleting fee record: " + err.message);
    }
  }
});
