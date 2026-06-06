// frontend/assets/js/dashboard.js
import apiRequest from "./api.js";

// Load analytics data
async function loadAnalytics() {
  try {
    // Teacher distribution
    const teachersRes = await apiRequest("/analytics/teachers-by-subject", "GET");
    renderTeachersChart(teachersRes.data);

    // Attendance summary
    const attendanceRes = await apiRequest("/analytics/attendance-summary", "GET");
    renderAttendanceChart(attendanceRes.data);

    // Grades by class
    const gradesRes = await apiRequest("/analytics/grades-by-class", "GET");
    renderGradesChart(gradesRes.data);
  } catch (err) {
    alert("❌ Failed to load analytics: " + err.message);
  }
}

// Teacher distribution chart
function renderTeachersChart(data) {
  const ctx = document.getElementById("teachersChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: data.map((d) => d.subject),
      datasets: [{
        label: "Teachers by Subject",
        data: data.map((d) => d.count),
        backgroundColor: ["#06b6d4", "#9333ea", "#facc15", "#ef4444", "#22c55e"]
      }]
    }
  });
}

// Attendance summary chart
function renderAttendanceChart(data) {
  const ctx = document.getElementById("attendanceChart").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: data.map((d) => d.status),
      datasets: [{
        label: "Attendance",
        data: data.map((d) => d.count),
        backgroundColor: ["#22c55e", "#ef4444", "#facc15"]
      }]
    }
  });
}

// Grades by class chart
function renderGradesChart(data) {
  const ctx = document.getElementById("gradesChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map((d) => `Class ${d.class_id}`),
      datasets: [{
        label: "Average Grade",
        data: data.map((d) => d.average_grade),
        backgroundColor: "#06b6d4"
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });
}

// Initial load
loadAnalytics();
