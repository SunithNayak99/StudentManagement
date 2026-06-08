document.addEventListener('DOMContentLoaded', function () {
    const saveBtn        = document.getElementById('saveAttendanceBtn');
    const searchModalBtn = document.getElementById('searchAttendanceBtn');
    const searchBox      = document.getElementById('attendanceSearchBox');
    const form           = document.getElementById('attendanceForm');
    const tableBody      = document.getElementById('attendanceTableBody');
    const modalEl        = document.getElementById('attendanceModal');
    if (!saveBtn || !form || !tableBody || !modalEl) return;

    const modal = new bootstrap.Modal(modalEl);

    function updateCount() {
        const n = tableBody.querySelectorAll('tr[data-id]').length;
        document.getElementById('attendanceCount').textContent = `${n} Record${n !== 1 ? 's' : ''}`;
    }

    function renderRow(a) {
        const emptyRow = document.getElementById('emptyRow');
        if (emptyRow) emptyRow.remove();

        const badge = a.Status === 'Present' ? 'success' : a.Status === 'Absent' ? 'danger' : 'warning';
        const row = document.createElement('tr');
        row.dataset.id = a.Id;
        row.style.animation = 'fadeIn 0.4s ease';
        row.innerHTML = `
            <td class="fw-semibold">${a.StudentName}</td>
            <td>${a.Class}</td>
            <td>${a.Date ? a.Date.substring(0, 10) : ''}</td>
            <td><span class="badge bg-${badge}">${a.Status}</span></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i></button>
            </td>`;

        row.querySelector('.delete-btn').addEventListener('click', function () {
            if (!confirm('Delete?')) return;
            $.post('/Master/DeleteAttendance', { id: a.Id }).done(function (res) {
                if (res.success) {
                    row.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => { row.remove(); updateCount(); }, 300);
                }
            });
        });

        tableBody.appendChild(row);
        updateCount();
    }

    // Load existing records
    $.get('/Master/GetAttendance').done(function (list) { list.forEach(renderRow); });

    form.querySelectorAll('input, select').forEach(f => f.addEventListener('input', () => f.classList.remove('is-invalid')));

    saveBtn.addEventListener('click', function () {
        let isValid = true;
        form.querySelectorAll('[required]').forEach(f => {
            if (!f.value.trim()) { f.classList.add('is-invalid'); isValid = false; }
        });
        if (!isValid) return;

        const data = {
            StudentName: document.getElementById('studentName').value,
            Class:       document.getElementById('studentClass').value,
            Date:        document.getElementById('attendanceDate').value,
            Status:      document.getElementById('attendanceStatus').value
        };

        $.post('/Master/SaveAttendance', data).done(function (res) {
            if (res.success) { renderRow(res.data); form.reset(); modal.hide(); }
        });
    });

    searchModalBtn.addEventListener('click', function () {
        const q = document.getElementById('studentName').value.trim().toLowerCase();
        if (!q) return;
        let found = false;
        tableBody.querySelectorAll('tr[data-id]').forEach(row => {
            const match = row.textContent.toLowerCase().includes(q);
            row.style.display = match ? '' : 'none';
            if (match) found = true;
        });
        if (!found) alert('No attendance record found for that name.');
        modal.hide();
    });

    if (searchBox) {
        searchBox.addEventListener('input', function () {
            const q = this.value.toLowerCase();
            tableBody.querySelectorAll('tr[data-id]').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
            });
        });
    }
});
