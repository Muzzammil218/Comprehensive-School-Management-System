const socket = io("http://127.0.0.1:8000");

// Chart instances
let feeStatusChart, studentDensityChart, teacherChart, attendanceChart, gradesChart;

// Initialize charts
function initCharts(initialData) {
  // Finance (Invoices)
  const ctxFee = document.getElementById("feeStatusChart").getContext("2d");
  feeStatusChart = new Chart(ctxFee, {
    type: "doughnut",
    data: {
      labels: ["Paid", "Unpaid", "Partially Paid"],
      datasets: [{
        data: initialData.finance_analytics.map(f => f.invoice_count),
        backgroundColor: ["#22c55e", "#ef4444", "#eab308"]
      }]
    }
  });

  // Students per class
  const ctxStudent = document.getElementById("studentDensityChart").getContext("2d");
  studentDensityChart = new Chart(ctxStudent, {
    type: "bar",
    data: {
      labels: initialData.class_analytics.map(c => c.class_name),
      datasets: [{
        label: "Students per Class",
        data: initialData.class_analytics.map(c => c.total_students),
        backgroundColor: "#6366f1"
      }]
    }
  });

  // Teachers per subject
  const ctxTeacher = document.getElementById("teacherChart").getContext("2d");
  teacherChart = new Chart(ctxTeacher, {
    type: "pie",
    data: {
      labels: initialData.teacher_analytics.map(t => t.subject),
      datasets: [{
        data: initialData.teacher_analytics.map(t => t.count),
        backgroundColor: ["#06b6d4", "#f97316", "#8b5cf6"]
      }]
    }
  });

  // Attendance (last 7 days)
  const ctxAttendance = document.getElementById("attendanceChart").getContext("2d");
  attendanceChart = new Chart(ctxAttendance, {
    type: "line",
    data: {
      labels: initialData.attendance_analytics.map(a => a.date),
      datasets: [{
        label: "Present",
        data: initialData.attendance_analytics.map(a => a.present),
        borderColor: "#10b981"
      }]
    }
  });

  // Grades per subject
  const ctxGrades = document.getElementById("gradesChart").getContext("2d");
  gradesChart = new Chart(ctxGrades, {
    type: "bar",
    data: {
      labels: initialData.grades_analytics.map(g => g.subject),
      datasets: [{
        label: "Average Grades",
        data: initialData.grades_analytics.map(g => g.average),
        backgroundColor: "#f59e0b"
      }]
    }
  });
}

// Fetch initial analytics (JWT protected)
async function loadAnalytics() {
  const json = await apiRequest("/analytics");
  if (json.status === "success") {
    initCharts(json.data);
  }
}

// Listen for realtime updates
socket.on("dashboard_update", payload => {
  console.log("Realtime update:", payload);

  if (payload.finance_analytics) {
    feeStatusChart.data.datasets[0].data = payload.finance_analytics.map(f => f.invoice_count);
    feeStatusChart.update();
  }

  if (payload.class_analytics) {
    studentDensityChart.data.labels = payload.class_analytics.map(c => c.class_name);
    studentDensityChart.data.datasets[0].data = payload.class_analytics.map(c => c.total_students);
    studentDensityChart.update();
  }

  if (payload.teacher_analytics) {
    teacherChart.data.labels = payload.teacher_analytics.map(t => t.subject);
    teacherChart.data.datasets[0].data = payload.teacher_analytics.map(t => t.count);
    teacherChart.update();
  }

  if (payload.attendance_analytics) {
    attendanceChart.data.labels = payload.attendance_analytics.map(a => a.date);
    attendanceChart.data.datasets[0].data = payload.attendance_analytics.map(a => a.present);
    attendanceChart.update();
  }

  if (payload.grades_analytics) {
    gradesChart.data.labels = payload.grades_analytics.map(g => g.subject);
    gradesChart.data.datasets[0].data = payload.grades_analytics.map(g => g.average);
    gradesChart.update();
  }
});

// Protect dashboard route
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }
  loadAnalytics();
});
