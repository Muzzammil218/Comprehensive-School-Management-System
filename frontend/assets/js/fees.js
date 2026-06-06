// frontend/assets/js/fee.js
import apiRequest from "./api.js";

const feeForm = document.getElementById("feeForm");
const feeTableBody = document.getElementById("feeTableBody");

// Load all fee records
async function loadFees() {
  try {
    const res = await apiRequest("/invoices", "GET");
    renderTable(res.data);
  } catch (err) {
    alert("❌ Failed to load fees: " + err.message);
  }
}

// Render fee records in table
function renderTable(fees) {
  if (!feeTableBody) return;
  feeTableBody.innerHTML = "";

  fees.forEach((f) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-2 border border-cyan-400">${f.invoice_id}</td>
      <td class="p-2 border border-cyan-400">${f.student_id}</td>
      <td class="p-2 border border-cyan-400">${f.amount}</td>
      <td class="p-2 border border-cyan-400">${f.status}</td>
      <td class="p-2 border border-cyan-400">
        <button class="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded edit-btn" data-id="${f.invoice_id}">Edit</button>
        <button class="px-2 py-1 bg-red-600 hover:bg-red-700 rounded delete-btn" data-id="${f.invoice_id}">Delete</button>
      </td>
    `;
    feeTableBody.appendChild(row);
  });

  // Attach handlers
  document.querySelectorAll(".edit-btn").forEach((btn) =>
    btn.addEventListener("click", () => editFee(btn.dataset.id))
  );
  document.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", () => deleteFee(btn.dataset.id))
  );
}

// Add new fee record
if (feeForm) {
  feeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const studentId = document.getElementById("feeStudent").value.trim();
    const amount = document.getElementById("feeAmount").value.trim();
    const status = document.getElementById("feeStatus").value;

    try {
      await apiRequest("/invoices", "POST", {
        student_id: studentId,
        amount,
        status
      });

      alert("✅ Fee record added successfully!");
      feeForm.reset();
      loadFees();
    } catch (err) {
      alert("❌ Error adding fee: " + err.message);
    }
  });
}

// Edit fee record
async function editFee(id) {
  const newAmount = prompt("Enter new amount:");
  const newStatus = prompt("Enter new status (Paid/Unpaid/Partially Paid):");

  if (!newAmount || !newStatus) return;

  try {
    await apiRequest(`/invoices/${id}`, "PUT", {
      amount: newAmount,
      status: newStatus
    });
    alert("✅ Fee record updated!");
    loadFees();
  } catch (err) {
    alert("❌ Error updating fee: " + err.message);
  }
}

// Delete fee record
async function deleteFee(id) {
  if (!confirm("Are you sure you want to delete this fee record?")) return;

  try {
    await apiRequest(`/invoices/${id}`, "DELETE");
    alert("🗑️ Fee record deleted!");
    loadFees();
  } catch (err) {
    alert("❌ Error deleting fee: " + err.message);
  }
}

// Initial load
loadFees();
