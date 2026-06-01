const API_POST_INVOICE = "http://127.0.0.1:8000/api/v1/invoices";

async function handleInvoiceSubmit(e) {
    e.preventDefault();
    const feedback = document.getElementById("feeFeedback");
    const data = {
        student_id: parseInt(document.getElementById("refStudentId").value),
        amount: parseFloat(document.getElementById("invoiceAmount").value),
        due_date: document.getElementById("dueDate").value,
        status: document.getElementById("paymentStatus").value
    };

    try {
        const res = await fetch(API_POST_INVOICE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok && result.status === "success") {
            feedback.className = "mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 block";
            feedback.textContent = `🎉 Financial Post Ledger Active. Ref ID: ${result.data.invoice_id}`;
            document.getElementById("feeGenerationForm").reset();
        }
    } catch (err) {
        feedback.className = "mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 block";
        feedback.textContent = "❌ Transaction Failure: Ledger Stream Offline.";
    }
}
document.addEventListener("DOMContentLoaded", () => { document.getElementById("feeGenerationForm").addEventListener("submit", handleInvoiceSubmit); });