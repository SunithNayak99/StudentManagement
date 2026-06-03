// Student Registration JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const saveBtn = document.getElementById('saveStudentBtn');
    const form = document.getElementById('studentRegForm');
    const tableBody = document.getElementById('studentTableBody');
    const countBadge = document.getElementById('studentCount');
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('studentModal'));

    function loadStudents() { return JSON.parse(localStorage.getItem('registeredStudents') || '[]'); }
    function saveStudents(list) { localStorage.setItem('registeredStudents', JSON.stringify(list)); }

    function getCount() { return tableBody.querySelectorAll('tr[data-idx]').length; }

    function updateCount() {
        const n = getCount();
        countBadge.textContent = `${n} Student${n !== 1 ? 's' : ''}`;
    }

    function showEmpty() {
        if (getCount() === 0 && !document.getElementById('emptyRow')) {
            const tr = document.createElement('tr');
            tr.id = 'emptyRow';
            tr.innerHTML = '<td colspan="7" class="text-center text-muted">No students registered yet. Click "Add Student" to register.</td>';
            tableBody.appendChild(tr);
        }
    }

    function formatDate(d) {
        return d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
    }

    function renderRow(data, storageIndex) {
        const emptyRow = document.getElementById('emptyRow');
        if (emptyRow) emptyRow.remove();

        const row = document.createElement('tr');
        row.dataset.idx = storageIndex;
        row.style.animation = 'fadeIn 0.4s ease';
        row.innerHTML = `
            <td><div class="fw-semibold">${data.name}</div><small class="text-muted">DOB: ${formatDate(data.dob)}</small></td>
            <td>${data.father}</td>
            <td>${data.mobile}</td>
            <td>${data.class}</td>
            <td>${data.section}</td>
            <td>${data.gender}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i></button>
            </td>`;

        row.querySelector('.delete-btn').addEventListener('click', function () {
            if (confirm('Delete this student?')) {
                row.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    const list = loadStudents();
                    const idx = parseInt(row.dataset.idx);
                    list.splice(idx, 1);
                    saveStudents(list);
                    row.remove();
                    // re-index remaining rows
                    tableBody.querySelectorAll('tr[data-idx]').forEach((r, i) => r.dataset.idx = i);
                    updateCount();
                    showEmpty();
                }, 300);
            }
        });

        tableBody.appendChild(row);
        updateCount();
    }

    // Load existing students on page load
    loadStudents().forEach((s, i) => renderRow(s, i));
    showEmpty();

    // Clear errors on input
    form.querySelectorAll('input, select, textarea').forEach(f =>
        f.addEventListener('input', () => f.classList.remove('is-invalid'))
    );

    // Save student
    saveBtn.addEventListener('click', function () {
        let isValid = true;
        form.querySelectorAll('[required]').forEach(f => {
            if (!f.value.trim()) { f.classList.add('is-invalid'); isValid = false; }
        });
        if (!isValid) return;

        const data = {
            name: document.getElementById('studentName').value,
            father: document.getElementById('fatherName').value,
            mother: document.getElementById('motherName').value,
            mobile: document.getElementById('mobile').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            address: document.getElementById('address').value,
            class: document.getElementById('studentClass').value,
            section: document.getElementById('section').value,
            admissionDate: document.getElementById('admissionDate').value
        };

        const list = loadStudents();
        list.push(data);
        saveStudents(list);
        renderRow(data, list.length - 1);

        form.reset();
        modal.hide();
    });
});
