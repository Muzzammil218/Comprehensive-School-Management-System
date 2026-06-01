const API_GET_CLASSES = "http://127.0.0.1:8000/api/v1/classes";
const API_POST_STUDENT = "http://127.0.0.1:8000/api/v1/students";

async function loadClassesDropdown() {
    const classSelect = document.getElementById("studentClassSelection");
    try {
        const response = await fetch(API_GET_CLASSES);
        const result = await response.json();
        if (result.status === "success") {
            classSelect.innerHTML = '<option value="" disabled selected>Select Allocation Segment...</option>';
            result.data.forEach(cls => {
                const opt = document.createElement("option");
                opt.value = cls.class_id;
                opt.textContent = `${cls.class_name} (Room ${cls.room_number})`;
                opt.className = "bg-[#0b0f19] text-slate-200";
                classSelect.appendChild(opt);
            });
        }
    } catch (err) { console.error(err); }
}

async function handleStudentSubmit(e) {
    e.preventDefault();
    const feedback = document.getElementById("submissionFeedback");
    const data = {
        first_name: document.getElementById("firstName").value.trim(),
        last_name: document.getElementById("lastName").value.trim(),
        email: document.getElementById("studentEmail").value.trim(),
        phone: document.getElementById("studentPhone").value.trim(),
        class_id: parseInt(document.getElementById("studentClassSelection").value)
    };

    try {
        const res = await fetch(API_POST_STUDENT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok && result.status === "success") {
            feedback.className = "mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 block";
            feedback.textContent = `🎉 System Allocation Node Complete. Allocated ID: ${result.data.student_id}`;
            document.getElementById("studentRegistrationForm").reset();
        }
    } catch (err) {
        feedback.className = "mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 block";
        feedback.textContent = "❌ Transaction Terminated: Network Endpoint Offline.";
    }
}
document.addEventListener("DOMContentLoaded", () => { loadClassesDropdown(); document.getElementById("studentRegistrationForm").addEventListener("submit", handleStudentSubmit); });