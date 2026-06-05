// Backend REST + WebSocket endpoints
const BACKEND_API = "http://127.0.0.1:8000/api/v1/analytics/dashboard";
const socket = io("http://127.0.0.1:8000"); // Socket.IO connection

// Chart instances
let feeChart, classChart, teacherChart, attendanceChart, gradesChart;

async function initializeLiveDashboard() {
    try {
        const response = await fetch(BACKEND_API);
        const result = await response.json();
        if (result.status === "success") {
            renderCharts(result.data);
        }
    } catch (err) {
        console.error("Connectivity Fault:", err);
    }
}

function renderCharts(payload) {
    // Finance Pie Chart
    const ctxFee = document.getElementById('feeStatusChart').getContext('2d');
    feeChart = new Chart(ctxFee, {
        type: 'pie',
        data: {
            labels: payload.finance_analytics.map(i => i.status),
            datasets: [{
                data: payload.finance_analytics.map(i => i.invoice_count),
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderColor: '#0f172a',
                borderWidth: 4
            }]
        },
        options: { responsive:true, plugins:{ legend:{ position:'bottom' } } }
    });

    // Enrollment Bar Chart
    const ctxClass = document.getElementById('studentDensityChart').getContext('2d');
    classChart = new Chart(ctxClass, {
        type: 'bar',
        data: {
            labels: payload.class_analytics.map(i => i.class_name),
            datasets: [{
                data: payload.class_analytics.map(i => i.total_students),
                backgroundColor: 'rgba(99,102,241,0.85)',
                borderColor: '#6366f1',
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: { responsive:true, plugins:{ legend:{ display:false } } }
    });

    // Teacher Distribution Doughnut Chart
    if (payload.teacher_analytics) {
        const ctxTeacher = document.getElementById('teacherChart').getContext('2d');
        teacherChart = new Chart(ctxTeacher, {
            type: 'doughnut',
            data: {
                labels: payload.teacher_analytics.map(i => i.subject),
                datasets: [{
                    data: payload.teacher_analytics.map(i => i.count),
                    backgroundColor: ['#06b6d4','#22c55e','#f97316','#a855f7']
                }]
            },
            options: { responsive:true, plugins:{ legend:{ position:'bottom' } } }
        });
    }

    // Attendance Line Chart
    if (payload.attendance_analytics) {
        const ctxAttendance = document.getElementById('attendanceChart').getContext('2d');
        attendanceChart = new Chart(ctxAttendance, {
            type: 'line',
            data: {
                labels: payload.attendance_analytics.map(i => i.date),
                datasets: [
                    { label:"Present", data: payload.attendance_analytics.map(i => i.present), borderColor:'#10b981', fill:false },
                    { label:"Absent", data: payload.attendance_analytics.map(i => i.absent), borderColor:'#ef4444', fill:false }
                ]
            },
            options: { responsive:true, plugins:{ legend:{ position:'bottom' } } }
        });
    }

    // Grades Radar Chart
    if (payload.grades_analytics) {
        const ctxGrades = document.getElementById('gradesChart').getContext('2d');
        gradesChart = new Chart(ctxGrades, {
            type: 'radar',
            data: {
                labels: payload.grades_analytics.map(i => i.subject),
                datasets: [{
                    label: "Average Marks",
                    data: payload.grades_analytics.map(i => i.average),
                    backgroundColor: 'rgba(99,102,241,0.2)',
                    borderColor: '#6366f1'
                }]
            },
            options: { responsive:true }
        });
    }
}

// Real-time updates
socket.on("dashboard_update", (payload) => {
    if (feeChart) {
        feeChart.data.labels = payload.finance_analytics.map(i => i.status);
        feeChart.data.datasets[0].data = payload.finance_analytics.map(i => i.invoice_count);
        feeChart.update();
    }
    if (classChart) {
        classChart.data.labels = payload.class_analytics.map(i => i.class_name);
        classChart.data.datasets[0].data = payload.class_analytics.map(i => i.total_students);
        classChart.update();
    }
    if (teacherChart && payload.teacher_analytics) {
        teacherChart.data.labels = payload.teacher_analytics.map(i => i.subject);
        teacherChart.data.datasets[0].data = payload.teacher_analytics.map(i => i.count);
        teacherChart.update();
    }
    if (attendanceChart && payload.attendance_analytics) {
        attendanceChart.data.labels = payload.attendance_analytics.map(i => i.date);
        attendanceChart.data.datasets[0].data = payload.attendance_analytics.map(i => i.present);
        attendanceChart.data.datasets[1].data = payload.attendance_analytics.map(i => i.absent);
        attendanceChart.update();
    }
    if (gradesChart && payload.grades_analytics) {
        gradesChart.data.labels = payload.grades_analytics.map(i => i.subject);
        gradesChart.data.datasets[0].data = payload.grades_analytics.map(i => i.average);
        gradesChart.update();
    }
});

document.addEventListener("DOMContentLoaded", initializeLiveDashboard);