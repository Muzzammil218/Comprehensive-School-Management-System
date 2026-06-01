const BACKEND_API = "http://127.0.0.1:8000/api/v1/analytics/dashboard";

async function initializeLiveDashboard() {
    try {
        const response = await fetch(BACKEND_API);
        const result = await response.json();
        
        if (result.status === "success") {
            const payload = result.data;

            // --- [PIE CHART MAPPING] ---
            const labelsFee = payload.finance_analytics.map(item => item.status);
            const valuesFee = payload.finance_analytics.map(item => item.invoice_count);

            const ctxFee = document.getElementById('feeStatusChart').getContext('2d');
            if (window.myPieChart) { window.myPieChart.destroy(); }
            window.myPieChart = new Chart(ctxFee, {
                type: 'pie',
                data: {
                    labels: labelsFee,
                    datasets: [{
                        data: valuesFee,
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                        borderColor: '#0f172a',
                        borderWidth: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'monospace', size: 11 } } } }
                }
            });

            // --- [BAR CHART MAPPING] ---
            const labelsClass = payload.class_analytics.map(item => item.class_name);
            const valuesStudents = payload.class_analytics.map(item => item.total_students);

            const ctxClass = document.getElementById('studentDensityChart').getContext('2d');
            if (window.myBarChart) { window.myBarChart.destroy(); }
            window.myBarChart = new Chart(ctxClass, {
                type: 'bar',
                data: {
                    labels: labelsClass,
                    datasets: [{
                        data: valuesStudents,
                        backgroundColor: 'rgba(99, 102, 241, 0.85)',
                        borderColor: '#6366f1',
                        borderWidth: 2,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { ticks: { color: '#64748b', font: { family: 'monospace' } }, grid: { display: false } },
                        y: { ticks: { color: '#64748b', font: { family: 'monospace' }, stepSize: 1 }, grid: { color: 'rgba(51, 65, 85, 0.1)' }, beginAtZero: true }
                    }
                }
            });
        }
    } catch (err) {
        console.error("Connectivity Fault:", err);
    }
}
document.addEventListener("DOMContentLoaded", initializeLiveDashboard);