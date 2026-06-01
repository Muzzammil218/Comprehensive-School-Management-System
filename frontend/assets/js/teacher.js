const API_POST_TEACHER = "http://127.0.0.1:8000/api/v1/teachers";

async function handleTeacherSubmit(e) {
    e.preventDefault();
    const feedback = document.getElementById("teacherFeedback");
    const data = {
        first_name: document.getElementById("tFirstName").value.trim(),
        last_name: document.getElementById("tLastName").value.trim(),
        email: document.getElementById("teacherEmail").value.trim(),
        phone: document.getElementById("teacherPhone").value.trim(),
        hire_date: document.getElementById("hireDate").value
    };

    try {
        const res = await fetch(API_POST_TEACHER, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok && result.status === "success") {
            feedback.className = "mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 block";
            feedback.textContent = `🎉 Faculty Ingestion Successful. Staff ID: ${result.data.teacher_id}`;
            document.getElementById("teacherRegistrationForm").reset();
        }
    } catch (err) {
        feedback.className = "mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 block";
        feedback.textContent = "❌ Network Fault: Node Connection Refused.";
    }
}
document.addEventListener("DOMContentLoaded", () => { document.getElementById("teacherRegistrationForm").addEventListener("submit", handleTeacherSubmit); });