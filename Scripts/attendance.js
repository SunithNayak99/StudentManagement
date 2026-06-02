document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveAttendanceBtn');
    const form = document.getElementById('attendanceForm');
    const tableBody = document.getElementById('attendanceTableBody');
    const modalEl = document.getElementById('attendanceModal');
    if (!saveBtn || !form || !tableBody || !modalEl) return;
    
    const modal = new bootstrap.Modal(modalEl);
    let count = 0;

    form.querySelectorAll('input, select').forEach(f => f.addEventListener('input', () => f.classList.remove('is-invalid')));

    saveBtn.addEventListener('click', function() {
        let isValid = true;
        form.querySelectorAll('[required]').forEach(f => {
            if (!f.value.trim()) { f.classList.add('is-invalid'); isValid = false; }
        });
        if (!isValid) return;

        const emptyRow = document.getElementById('emptyRow');
        if (emptyRow) emptyRow.remove();

        count++;
        const row = document.createElement('tr');
        row.style.animation = 'fadeIn 0.4s ease';
        const status = document.getElementById('attendanceStatus').value;
        const badge = status === 'Present' ? 'success' : status === 'Absent' ? 'danger' : 'warning';
        row.innerHTML = `
            <td class="fw-semibold">${document.getElementById('studentName').value}</td>
            <td>${document.getElementById('studentClass').value}</td>
            <td>${document.getElementById('attendanceDate').value}</td>
            <td><span class="badge bg-${badge}">${status}</span></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i></button>
            </td>
        `;

        row.querySelector('.delete-btn').addEventListener('click', function() {
            if (confirm('Delete?')) {
                row.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    row.remove();
                    count--;
                    document.getElementById('attendanceCount').textContent = `${count} Record${count !== 1 ? 's' : ''}`;
                }, 300);
            }
        });

        tableBody.appendChild(row);
        document.getElementById('attendanceCount').textContent = `${count} Record${count !== 1 ? 's' : ''}`;
        form.reset();
        modal.hide();
    });
});
