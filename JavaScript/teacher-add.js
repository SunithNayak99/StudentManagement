document.addEventListener('DOMContentLoaded', function () {
    const saveBtn        = document.getElementById('saveTeacherBtn');
    const updateBtn      = document.getElementById('updateTeacherBtn');
    const searchModalBtn = document.getElementById('searchTeacherBtn');
    const searchBox      = document.getElementById('teacherSearchBox');
    const form           = document.getElementById('teacherForm');
    const tableBody      = document.getElementById('teacherTableBody');
    const modalEl        = document.getElementById('teacherModal');
    const modal          = bootstrap.Modal.getOrCreateInstance(modalEl);
    let editingId        = null;

    function updateCount() {
        const n = tableBody.querySelectorAll('tr[data-id]').length;
        document.getElementById('teacherCount').textContent = `${n} Teacher${n !== 1 ? 's' : ''}`;
    }

    function getFormData() {
        return {
            Id:           editingId || 0,
            Name:         document.getElementById('teacherName').value,
            Subject:      document.getElementById('subject').value,
            Qualification: document.getElementById('qualification').value,
            Email:        document.getElementById('email').value,
            Mobile:       document.getElementById('mobile').value,
            JoiningDate:  document.getElementById('joiningDate').value,
            Salary:       document.getElementById('salary').value
        };
    }

    function fillForm(t) {
        document.getElementById('teacherName').value    = t.Name;
        document.getElementById('subject').value        = t.Subject;
        document.getElementById('qualification').value  = t.Qualification;
        document.getElementById('email').value          = t.Email;
        document.getElementById('mobile').value         = t.Mobile;
        document.getElementById('joiningDate').value    = (t.JoiningDate || '').substring(0, 10);
        document.getElementById('salary').value         = t.Salary;
    }

    function validateForm() {
        let ok = true;
        form.querySelectorAll('[required]').forEach(f => {
            if (!f.value.trim()) { f.classList.add('is-invalid'); ok = false; }
        });
        return ok;
    }

    function renderRow(t) {
        const emptyRow = document.getElementById('emptyRow');
        if (emptyRow) emptyRow.remove();

        const row = document.createElement('tr');
        row.dataset.id = t.Id;
        row.style.animation = 'fadeIn 0.4s ease';
        row.innerHTML = `
            <td><div class="fw-semibold">${t.Name}</div><small class="text-muted">${t.Email}</small></td>
            <td>${t.Subject}</td>
            <td>${t.Qualification}</td>
            <td>${t.Mobile}</td>
            <td>₹${parseInt(t.Salary).toLocaleString()}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-warning edit-btn me-1"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i></button>
            </td>`;

        row.querySelector('.edit-btn').addEventListener('click', function () {
            editingId = t.Id;
            fillForm(t);
            saveBtn.style.display = 'none';
            updateBtn.style.display = '';
            modal.show();
        });

        row.querySelector('.delete-btn').addEventListener('click', function () {
            if (!confirm('Delete this teacher?')) return;
            $.post('/Master/DeleteTeacher', { id: t.Id }).done(function (res) {
                if (res.success) {
                    row.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        row.remove();
                        updateCount();
                        if (!tableBody.querySelector('tr[data-id]')) {
                            const tr = document.createElement('tr');
                            tr.id = 'emptyRow';
                            tr.innerHTML = '<td colspan="6" class="text-center text-muted">No teachers added yet.</td>';
                            tableBody.appendChild(tr);
                        }
                    }, 300);
                }
            });
        });

        tableBody.appendChild(row);
        updateCount();
    }

    // Load on page load
    $.get('/Master/GetTeachers').done(function (list) {
        list.forEach(renderRow);
        if (!list.length) {
            const tr = document.createElement('tr');
            tr.id = 'emptyRow';
            tr.innerHTML = '<td colspan="6" class="text-center text-muted">No teachers added yet. Click "Add Teacher" to begin.</td>';
            tableBody.appendChild(tr);
        }
    });

    modalEl.addEventListener('hidden.bs.modal', function () {
        form.reset();
        form.querySelectorAll('.is-invalid').forEach(f => f.classList.remove('is-invalid'));
        editingId = null;
        saveBtn.style.display = '';
        updateBtn.style.display = 'none';
    });

    form.querySelectorAll('input, select').forEach(f =>
        f.addEventListener('input', () => f.classList.remove('is-invalid'))
    );

    saveBtn.addEventListener('click', function () {
        if (!validateForm()) return;
        $.post('/Master/SaveTeacher', getFormData()).done(function (res) {
            if (res.success) { renderRow(res.data); modal.hide(); }
        });
    });

    updateBtn.addEventListener('click', function () {
        if (!validateForm()) return;
        $.post('/Master/SaveTeacher', getFormData()).done(function (res) {
            if (res.success) {
                const row = tableBody.querySelector(`tr[data-id="${editingId}"]`);
                if (row) row.remove();
                renderRow(res.data);
                modal.hide();
            }
        });
    });

    searchModalBtn.addEventListener('click', function () {
        const q = document.getElementById('teacherName').value.trim().toLowerCase();
        if (!q) return;
        $.get('/Master/GetTeachers').done(function (list) {
            const found = list.find(t => t.Name.toLowerCase().includes(q));
            if (found) { fillForm(found); editingId = found.Id; }
            else alert('No teacher found with that name.');
        });
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
