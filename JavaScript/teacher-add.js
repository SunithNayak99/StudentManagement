// Teacher Add JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const saveBtn = document.getElementById('saveTeacherBtn');
    const updateBtn = document.getElementById('updateTeacherBtn');
    const searchModalBtn = document.getElementById('searchTeacherBtn');
    const searchBox = document.getElementById('teacherSearchBox');
    const form = document.getElementById('teacherForm');
    const tableBody = document.getElementById('teacherTableBody');
    const modalEl = document.getElementById('teacherModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    let teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    let editingIdx = null;

    function save() { localStorage.setItem('teachers', JSON.stringify(teachers)); }

    function updateCount() {
        const n = tableBody.querySelectorAll('tr[data-idx]').length;
        document.getElementById('teacherCount').textContent = `${n} Teacher${n !== 1 ? 's' : ''}`;
    }

    function fillForm(data) {
        document.getElementById('teacherName').value = data.name;
        document.getElementById('subject').value = data.subject;
        document.getElementById('qualification').value = data.qualification;
        document.getElementById('email').value = data.email;
        document.getElementById('mobile').value = data.mobile;
        document.getElementById('joiningDate').value = data.joiningDate;
        document.getElementById('salary').value = data.salary;
    }

    function renderRow(data, idx) {
        const emptyRow = document.getElementById('emptyRow');
        if (emptyRow) emptyRow.remove();

        const row = document.createElement('tr');
        row.dataset.idx = idx;
        row.style.animation = 'fadeIn 0.4s ease';
        row.innerHTML = `
            <td><div class="fw-semibold">${data.name}</div><small class="text-muted">${data.email}</small></td>
            <td>${data.subject}</td>
            <td>${data.qualification}</td>
            <td>${data.mobile}</td>
            <td>₹${parseInt(data.salary).toLocaleString()}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-warning edit-btn me-1"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i></button>
            </td>`;

        row.querySelector('.edit-btn').addEventListener('click', function () {
            editingIdx = parseInt(row.dataset.idx);
            fillForm(teachers[editingIdx]);
            saveBtn.style.display = 'none';
            updateBtn.style.display = '';
            modal.show();
        });

        row.querySelector('.delete-btn').addEventListener('click', function () {
            if (confirm('Delete this teacher?')) {
                row.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    teachers.splice(parseInt(row.dataset.idx), 1);
                    save();
                    row.remove();
                    tableBody.querySelectorAll('tr[data-idx]').forEach((r, i) => r.dataset.idx = i);
                    updateCount();
                    if (tableBody.querySelectorAll('tr[data-idx]').length === 0) {
                        const tr = document.createElement('tr');
                        tr.id = 'emptyRow';
                        tr.innerHTML = '<td colspan="6" class="text-center text-muted">No teachers added yet. Click "Add Teacher" to begin.</td>';
                        tableBody.appendChild(tr);
                    }
                }, 300);
            }
        });

        tableBody.appendChild(row);
        updateCount();
    }

    teachers.forEach((t, i) => renderRow(t, i));

    modalEl.addEventListener('hidden.bs.modal', function () {
        form.reset();
        form.querySelectorAll('.is-invalid').forEach(f => f.classList.remove('is-invalid'));
        editingIdx = null;
        saveBtn.style.display = '';
        updateBtn.style.display = 'none';
    });

    form.querySelectorAll('input, select').forEach(f =>
        f.addEventListener('input', () => f.classList.remove('is-invalid'))
    );

    function getFormData() {
        return {
            name: document.getElementById('teacherName').value,
            subject: document.getElementById('subject').value,
            qualification: document.getElementById('qualification').value,
            email: document.getElementById('email').value,
            mobile: document.getElementById('mobile').value,
            joiningDate: document.getElementById('joiningDate').value,
            salary: document.getElementById('salary').value
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
        teachers.push(data);
        save();
        renderRow(data, teachers.length - 1);
        modal.hide();
    });

    updateBtn.addEventListener('click', function () {
        if (!validateForm()) return;
        teachers[editingIdx] = getFormData();
        save();
        tableBody.innerHTML = '';
        teachers.forEach((t, i) => renderRow(t, i));
        modal.hide();
    });

    searchModalBtn.addEventListener('click', function () {
        const q = document.getElementById('teacherName').value.trim().toLowerCase();
        if (!q) return;
        const found = teachers.find(t => t.name.toLowerCase().includes(q));
        if (found) { fillForm(found); } else { alert('No teacher found with that name.'); }
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
