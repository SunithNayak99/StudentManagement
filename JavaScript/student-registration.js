// Student Registration JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const saveBtn = document.getElementById('saveStudentBtn');
    const updateBtn = document.getElementById('updateStudentBtn');
    const searchModalBtn = document.getElementById('searchStudentBtn');
    const searchBox = document.getElementById('studentSearchBox');
    const form = document.getElementById('studentRegForm');
    const tableBody = document.getElementById('studentTableBody');
    const countBadge = document.getElementById('studentCount');
    const modalEl = document.getElementById('studentModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    let editingIdx = null;

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

    function fillForm(data) {
        document.getElementById('studentName').value = data.name;
        document.getElementById('fatherName').value = data.father;
        document.getElementById('motherName').value = data.mother;
        document.getElementById('mobile').value = data.mobile;
        document.getElementById('dob').value = data.dob;
        document.getElementById('gender').value = data.gender;
        document.getElementById('address').value = data.address;
        document.getElementById('studentClass').value = data.class;
        document.getElementById('section').value = data.section;
        document.getElementById('admissionDate').value = data.admissionDate;
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
                <button class="btn btn-sm btn-outline-warning edit-btn me-1"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i></button>
            </td>`;

        row.querySelector('.edit-btn').addEventListener('click', function () {
            editingIdx = parseInt(row.dataset.idx);
            fillForm(loadStudents()[editingIdx]);
            saveBtn.style.display = 'none';
            updateBtn.style.display = '';
            document.getElementById('studentModalLabel').textContent = 'Edit Student';
            modal.show();
        });

        row.querySelector('.delete-btn').addEventListener('click', function () {
            if (confirm('Delete this student?')) {
                row.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    const list = loadStudents();
                    list.splice(parseInt(row.dataset.idx), 1);
                    saveStudents(list);
                    row.remove();
                    tableBody.querySelectorAll('tr[data-idx]').forEach((r, i) => r.dataset.idx = i);
                    updateCount();
                    showEmpty();
                }, 300);
            }
        });

        tableBody.appendChild(row);
        updateCount();
    }

    loadStudents().forEach((s, i) => renderRow(s, i));
    showEmpty();

    modalEl.addEventListener('hidden.bs.modal', function () {
        form.reset();
        form.querySelectorAll('.is-invalid').forEach(f => f.classList.remove('is-invalid'));
        editingIdx = null;
        saveBtn.style.display = '';
        updateBtn.style.display = 'none';
        document.getElementById('studentModalLabel').textContent = 'Add New Student';
    });

    form.querySelectorAll('input, select, textarea').forEach(f =>
        f.addEventListener('input', () => f.classList.remove('is-invalid'))
    );

    function getFormData() {
        return {
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
    }

    function validateForm() {
        let isValid = true;
        form.querySelectorAll('[required]').forEach(f => {
            if (!f.value.trim()) { f.classList.add('is-invalid'); isValid = false; }
        });
        return isValid;
    }

    saveBtn.addEventListener('click', function () {
        if (!validateForm()) return;
        const data = getFormData();
        const list = loadStudents();
        list.push(data);
        saveStudents(list);
        renderRow(data, list.length - 1);
        modal.hide();
    });

    updateBtn.addEventListener('click', function () {
        if (!validateForm()) return;
        const list = loadStudents();
        list[editingIdx] = getFormData();
        saveStudents(list);
        tableBody.innerHTML = '';
        list.forEach((s, i) => renderRow(s, i));
        if (list.length === 0) showEmpty();
        modal.hide();
    });

    searchModalBtn.addEventListener('click', function () {
        const q = document.getElementById('studentName').value.trim().toLowerCase();
        if (!q) return;
        const found = loadStudents().find(s => s.name.toLowerCase().includes(q));
        if (found) { fillForm(found); } else { alert('No student found with that name.'); }
    });

    if (searchBox) {
        searchBox.addEventListener('input', function () {
            const q = this.value.toLowerCase();
            tableBody.querySelectorAll('tr[data-idx]').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
            });
        });
    }
});
