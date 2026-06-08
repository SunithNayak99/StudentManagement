document.addEventListener('DOMContentLoaded', function () {
    $.get('/Master/GetStudents').done(function (students) {
        document.getElementById('dashStudentCount').textContent = students.length;

        const pieCanvas  = document.getElementById('genderPieChart');
        const barCanvas  = document.getElementById('enrollmentBarChart');
        const pieEmpty   = document.getElementById('pieChartEmpty');
        const barEmpty   = document.getElementById('barChartEmpty');

        if (!students.length) {
            pieCanvas.style.display = 'none'; pieEmpty.style.display = 'block';
            barCanvas.style.display = 'none'; barEmpty.style.display = 'block';
            return;
        }

        // Gender pie chart
        const genderCounts = students.reduce((acc, s) => {
            acc[s.Gender] = (acc[s.Gender] || 0) + 1; return acc;
        }, {});
        new Chart(pieCanvas, {
            type: 'pie',
            data: {
                labels: Object.keys(genderCounts),
                datasets: [{ data: Object.values(genderCounts), backgroundColor: ['#6366f1', '#ec4899', '#10b981'], borderWidth: 0 }]
            },
            options: { plugins: { legend: { position: 'bottom' } } }
        });

        // Enrollment bar chart
        const classCounts = students.reduce((acc, s) => {
            acc[s.Class] = (acc[s.Class] || 0) + 1; return acc;
        }, {});
        const sorted = Object.entries(classCounts).sort((a, b) =>
            (parseInt(a[0].replace(/\D/g, '')) || 0) - (parseInt(b[0].replace(/\D/g, '')) || 0)
        );
        new Chart(barCanvas, {
            type: 'bar',
            data: {
                labels: sorted.map(e => e[0]),
                datasets: [{ label: 'Students', data: sorted.map(e => e[1]), backgroundColor: 'rgba(99,102,241,0.85)', borderRadius: 8, borderSkipped: false }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.04)' } },
                    x: { grid: { display: false } }
                }
            }
        });

        // Recent activity
        const list   = document.getElementById('activityList');
        const recent = [...students].reverse().slice(0, 3);
        recent.forEach(s => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="bi bi-person-plus"></i>
                <span>New student <strong>${s.Name}</strong> registered in ${s.Class}-${s.Section}</span>
                <small class="text-muted">Recently</small>`;
            list.insertBefore(li, list.firstChild);
        });
    });
});
