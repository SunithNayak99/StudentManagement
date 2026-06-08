document.addEventListener('DOMContentLoaded', function () {
    const saveBtn        = document.getElementById('saveStudentBtn');
    const updateBtn      = document.getElementById('updateStudentBtn');
    const searchModalBtn = document.getElementById('searchStudentBtn');
    const searchBox      = document.getElementById('studentSearchBox');
    const form           = document.getElementById('studentRegForm');
    const tableBody      = document.getElementById('studentTableBody');
    const countBadge     = document.getElementById('studentCount');
    const modalEl        = document.getElementById('studentModal');
    const modal          = bootstrap.Modal.getOrCreateInstance(modalEl);
    let editingId        = null;

    function updateCount() {
        const n = tableBody.querySelectorAll('tr[data-id]').length;
        countBadge.textContent = `${n} Student${n !== 1 ? 's' : ''}`;
    }

    function showEmpty() {
        if (!tableBody.querySelector('tr[data-id]') && !document.getElementById('emptyRow')) {
            const tr = document.createElement('tr');
            tr.id = 'emptyRow';
            tr.innerHTML = '<td colspan="7" class="text-center text-muted">No students registered yet. Click "Add Student" to register.</td>';
            tableBody.appendChild(tr);
        }
    }

    function formatDate(d) {
        return d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
    }

    function getFormData() {
        return {
            Id:            editingId || 0,
            Name:          document.getElementById('studentName').value,
            FatherName:    document.getElementById('fatherName').value,
            MotherName:    document.getElementById('motherName').value,
            Mobile:        document.getElementById('mobile').value,
            DOB:           document.getElementById('dob').value,
            Gender:        document.getElementById('gender').value,
            Address:       document.getElementById('address').value,
            Class:         document.getElementById('studentClass').value,
            Section:       document.getElementById('section').value,
            AdmissionDate: document.getElementById('admissionDate').value
        };
    }

    function fillForm(s) {
        document.getElementById('studentName').value    = s.Name || s.name;
        document.getElementById('fatherName').value     = s.FatherName || s.father;
        document.getElementById('motherName').value     = s.MotherName || s.mother;
        document.getElementById('mobile').value         = s.Mobile || s.mobile;
        document.getElementById('dob').value            = (s.DOB || s.dob || '').substring(0, 10);
        document.getElementById('gender').value         = s.Gender || s.gender;
        document.getElementById('address').value        = s.Address || s.address;
        document.getElementById('studentClass').value   = s.Class || s.class;
        document.getElementById('section').value        = s.Section || s.section;
        document.getElementById('admissionDate').value  = (s.AdmissionDate || s.admissionDate || '').substring(0, 10);
    }

    function validateForm() {
        let ok = true;
        form.querySelectorAll('[required]').forEach(f => {
            if (!f.value.trim()) { f.classList.add('is-invalid'); ok = false; }
        });
        return ok;
    }

    function renderRow(s) {
        const emptyRow = document.getElementById('emptyRow');
        if (emptyRow) emptyRow.remove();

        const row = document.createElement('tr');
        row.dataset.id = s.Id;
        row.style.animation = 'fadeIn 0.4s ease';
        row.innerHTML = `
            <td><div class="fw-semibold">${s.Name}</div><small class="text-muted">DOB: ${formatDate(s.DOB)}</small></td>
            <td>${s.FatherName}</td>
            <td>${s.Mobile}</td>
            <td>${s.Class}</td>
            <td>${s.Section}</td>
            <td>${s.Gender}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-warning edit-btn me-1"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i></button>
            </td>`;

        row.querySelector('.edit-btn').addEventListener('click', function () {
            editingId = s.Id;
            fillForm(s);
            saveBtn.style.display = 'none';
            updateBtn.style.display = '';
            document.getElementById('studentModalLabel').textContent = 'Edit Student';
            modal.show();
        });

        row.querySelector('.delete-btn').addEventListener('click', function () {
            if (!confirm('Delete this student?')) return;
            $.post('/Master/DeleteStudent', { id: s.Id }).done(function (res) {
                if (res.success) {
                    row.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => { row.remove(); updateCount(); showEmpty(); }, 300);
                }
            });
        });

        tableBody.appendChild(row);
        updateCount();
    }

    // Load students on page load
    $.get('/Master/GetStudents').done(function (list) {
        list.forEach(renderRow);
        showEmpty();
    });

    // Reset modal state on close
    modalEl.addEventListener('hidden.bs.modal', function () {
        form.reset();
        form.querySelectorAll('.is-invalid').forEach(f => f.classList.remove('is-invalid'));
        editingId = null;
        saveBtn.style.display = '';
        updateBtn.style.display = 'none';
        document.getElementById('studentModalLabel').textContent = 'Add New Student';
    });

    form.querySelectorAll('input, select, textarea').forEach(f =>
        f.addEventListener('input', () => f.classList.remove('is-invalid'))
    );

    // Save new student
    saveBtn.addEventListener('click', function () {
        if (!validateForm()) return;
        $.post('/Master/SaveStudent', getFormData()).done(function (res) {
            if (res.success) { renderRow(res.data); modal.hide(); }
        });
    });

    // Update existing student
    updateBtn.addEventListener('click', function () {
        if (!validateForm()) return;
        $.post('/Master/SaveStudent', getFormData()).done(function (res) {
            if (res.success) {
                const row = tableBody.querySelector(`tr[data-id="${editingId}"]`);
                if (row) row.remove();
                renderRow(res.data);
                modal.hide();
            }
        });
    });

    // Search in modal
    searchModalBtn.addEventListener('click', function () {
        const q = document.getElementById('studentName').value.trim().toLowerCase();
        if (!q) return;
        $.get('/Master/GetStudents').done(function (list) {
            const found = list.find(s => s.Name.toLowerCase().includes(q));
            if (found) { fillForm(found); editingId = found.Id; }
            else alert('No student found with that name.');
        });
    });

    // Filter table
    if (searchBox) {
        searchBox.addEventListener('input', function () {
            const q = this.value.toLowerCase();
            tableBody.querySelectorAll('tr[data-id]').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
            });
        });
    }
});
