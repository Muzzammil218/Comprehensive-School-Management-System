// frontend/assets/js/invoices.js
import apiRequest from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const invoiceForm = document.getElementById("invoiceForm");
  const invoiceTable = document.getElementById("invoiceTable");

  // Load all invoices initially
  loadInvoices();

  // Handle form submission (Create invoice)
  if (invoiceForm) {
    invoiceForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const studentId = document.getElementById("invoiceStudent").value.trim();
      const amount = document.getElementById("invoiceAmount").value.trim();
      const status = document.getElementById("invoiceStatus").value.trim();

      try {
        await apiRequest("/invoices", "POST", {
          student_id: studentId,
          amount,
          status
        });

        alert("✅ Invoice added successfully!");
        invoiceForm.reset();
        loadInvoices();
      } catch (err) {
        alert("❌ Error adding invoice: " + err.message);
      }
    });
  }

  // Load invoices into table
  async function loadInvoices() {
    try {
      const res = await apiRequest("/invoices");
      if (res.status === "success") {
        renderTable(res.data);
      }
    } catch (err) {
      console.error("❌ Error loading invoices:", err.message);
    }
  }

  // Render table rows
  function renderTable(invoices) {
    if (!invoiceTable) return;
    invoiceTable.innerHTML = "";

    invoices.forEach((inv) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${inv.invoice_id}</td>
        <td>${inv.student_id}</td>
        <td>${inv.amount}</td>
        <td>${inv.status}</td>
        <td>
          <button class="edit-btn" data-id="${inv.invoice_id}">✏️ Edit</button>
          <button class="delete-btn" data-id="${inv.invoice_id}">🗑️ Delete</button>
        </td>
      `;
      invoiceTable.appendChild(row);
    });

    // Attach edit/delete handlers
    document.querySelectorAll(".edit-btn").forEach((btn) =>
      btn.addEventListener("click", () => editInvoice(btn.dataset.id))
    );
    document.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", () => deleteInvoice(btn.dataset.id))
    );
  }

  // Edit invoice
  async function editInvoice(id) {
    const newAmount = prompt("Enter new amount:");
    const newStatus = prompt("Enter new status (Paid/Unpaid/Partially Paid):");

    if (!newAmount || !newStatus) return;

    try {
      await apiRequest(`/invoices/${id}`, "PUT", {
        amount: newAmount,
        status: newStatus
      });
      alert("✅ Invoice updated!");
      loadInvoices();
    } catch (err) {
      alert("❌ Error updating invoice: " + err.message);
    }
  }

  // Delete invoice
  async function deleteInvoice(id) {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      await apiRequest(`/invoices/${id}`, "DELETE");
      alert("✅ Invoice deleted!");
      loadInvoices();
    } catch (err) {
      alert("❌ Error deleting invoice: " + err.message);
    }
  }
});
