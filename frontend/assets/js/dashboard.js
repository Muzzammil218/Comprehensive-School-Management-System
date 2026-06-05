// frontend/assets/js/dashboard.js
import apiRequest from "./api.js";

const socket = io("http://127.0.0.1:8000");

// Chart instances
let feeStatusChart, studentDensityChart, teacherChart, attendanceChart, gradesChart;

// Initialize charts
function initCharts(initialData) {
  feeStatusChart = createFeeChart(initialData.finance_analytics);
  studentDensityChart = createStudentChart(initialData.class_analytics);
  teacherChart = createTeacherChart(initialData.teacher_analytics);
  attendanceChart = createAttendanceChart(initialData.attendance_analytics);
  gradesChart = createGradesChart(initialData.grades_analytics);
}

// Chart creation functions
function createFeeChart(data) {
  return new Chart(document.getElementById("feeStatusChart"), {
    type: "doughnut",
    data: {
      labels: ["Paid", "Unpaid", "Partially Paid"],
      datasets: [{
        data: data.map(f => f.invoice_count),
        backgroundColor: ["#22c55e", "#ef4444", "#eab308"],
        borderColor: "#0f0",
        borderWidth: 2
      }]
    },
    options: { plugins: { legend: { labels: { color: "#0ff" } } } }
  });
}

function createStudentChart(data) {
  return new Chart(document.getElementById("studentDensityChart"), {
    type: "bar",
    data: {
      labels: data.map(c => c.class_name),
      datasets: [{
        label: "Students per Class",
        data: data.map(c => c.total_students),
        backgroundColor: "#6366f1",
        borderColor: "#f0f",
        borderWidth: 2
      }]
    },
    options: { scales: { x: { ticks: { color: "#0ff" } }, y: { ticks: { color: "#0ff" } } } }
  });
}

function createTeacherChart(data) {
  return new Chart(document.getElementById("teacherChart"), {
    type: "pie",
    data: {
      labels: data.map(t => t.subject),
      datasets: [{
        data: data.map(t => t.count),
        backgroundColor: ["#06b6d4", "#f97316", "#8b5cf6"],
        borderColor: "#ff0",
        borderWidth: 2
      }]
    },
    options: { plugins: { legend: { labels: { color: "#0ff" } } } }
  });
}

function createAttendanceChart(data) {
  return new Chart(document.getElementById("attendanceChart"), {
    type: "line",
    data: {
      labels: data.map(a => a.date),
      datasets: [{
        label: "Present",
        data: data.map(a => a.present),
        borderColor: "#10b981",
        backgroundColor: "#0ff",
        tension: 0.3
      }]
    },
    options: { scales: { x: { ticks: { color: "#0ff" } }, y: { ticks: { color: "#0ff" } } } }
  });
}

function createGradesChart(data) {
  return new Chart(document.getElementById("gradesChart"), {
    type: "bar",
    data: {
      labels: data.map(g => g.subject),
      datasets: [{
        label: "Average Grades",
        data: data.map(g => g.average),
        backgroundColor: "#f59e0b",
        borderColor: "#0ff",
        borderWidth: 2
      }]
    },
    options: { scales: { x: { ticks: { color: "#0ff" } }, y: { ticks: { color: "#0ff" } } } }
  });
}

// Fetch initial analytics
async function loadAnalytics() {
  const json = await apiRequest("/analytics");
  if (json.status === "success") {
    initCharts(json.data);
  }
}

// Listen for realtime updates
socket.on("dashboard_update", async () => {
  const json = await apiRequest("/analytics");
  if (json.status === "success") {
    feeStatusChart.data.datasets[0].data = json.data.finance_analytics.map(f => f.invoice_count);
    feeStatusChart.update();

    studentDensityChart.data.labels = json.data.class_analytics.map(c => c.class_name);
    studentDensityChart.data.datasets[0].data = json.data.class_analytics.map(c => c.total_students);
    studentDensityChart.update();

    teacherChart.data.labels = json.data.teacher_analytics.map(t => t.subject);
    teacherChart.data.datasets[0].data = json.data.teacher_analytics.map(t => t.count);
    teacherChart.update();

    attendanceChart.data.labels = json.data.attendance_analytics.map(a => a.date);
    attendanceChart.data.datasets[0].data = json.data.attendance_analytics.map(a => a.present);
    attendanceChart.update();

    gradesChart.data.labels = json.data.grades_analytics.map(g => g.subject);
    gradesChart.data.datasets[0].data = json.data.grades_analytics.map(g => g.average);
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
