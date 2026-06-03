document.addEventListener('DOMContentLoaded', function () {
    const students = JSON.parse(localStorage.getItem('registeredStudents') || '[]');

    // Update total student count
    document.getElementById('dashStudentCount').textContent = students.length;

    const hasStudents = students.length > 0;

    // --- Gender Pie Chart ---
    const pieEmpty = document.getElementById('pieChartEmpty');
    const pieCanvas = document.getElementById('genderPieChart');
    if (!hasStudents) {
        pieCanvas.style.display = 'none';
        pieEmpty.style.display = 'block';
    } else {
        const genderCounts = students.reduce((acc, s) => {
            acc[s.gender] = (acc[s.gender] || 0) + 1;
            return acc;
        }, {});
        new Chart(pieCanvas, {
            type: 'pie',
            data: {
                labels: Object.keys(genderCounts),
                datasets: [{
                    data: Object.values(genderCounts),
                    backgroundColor: ['#6366f1', '#ec4899', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: { plugins: { legend: { position: 'bottom' } } }
        });
    }

    // --- Enrollment Bar Chart ---
    const barEmpty = document.getElementById('barChartEmpty');
    const barCanvas = document.getElementById('enrollmentBarChart');
    if (!hasStudents) {
        barCanvas.style.display = 'none';
        barEmpty.style.display = 'block';
    } else {
        const classCounts = students.reduce((acc, s) => {
            acc[s.class] = (acc[s.class] || 0) + 1;
            return acc;
        }, {});
        // Sort by class number
        const sorted = Object.entries(classCounts).sort((a, b) => {
            const n = x => parseInt(x.replace(/\D/g, '')) || 0;
            return n(a[0]) - n(b[0]);
        });
        new Chart(barCanvas, {
            type: 'bar',
            data: {
                labels: sorted.map(e => e[0]),
                datasets: [{
                    label: 'Students',
                    data: sorted.map(e => e[1]),
                    backgroundColor: 'rgba(99,102,241,0.85)',
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.04)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // --- Recent activity: latest registered students ---
    if (students.length > 0) {
        const list = document.getElementById('activityList');
        const recent = [...students].reverse().slice(0, 3);
        recent.forEach(s => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="bi bi-person-plus"></i>
                <span>New student <strong>${s.name}</strong> registered in ${s.class}-${s.section}</span>
                <small class="text-muted">Recently</small>`;
            list.insertBefore(li, list.firstChild);
        });
    }
});
