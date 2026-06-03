document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('classForm');
    const tableBody = document.getElementById('classTableBody');
    const modalEl = document.getElementById('classModal');
    const editModalEl = document.getElementById('editClassModal');
    if (!form || !tableBody || !modalEl || !editModalEl) return;

    const modal = new bootstrap.Modal(modalEl);
    const editModal = new bootstrap.Modal(editModalEl);

    function getCount() {
        return tableBody.querySelectorAll('tr[data-key]').length;
    }

    function updateCount() {
        const n = getCount();
        document.getElementById('classCount').textContent = `${n} Class${n !== 1 ? 'es' : ''}`;
    }

    function isDuplicate(className, section, excludeKey) {
        let found = false;
        tableBody.querySelectorAll('tr[data-key]').forEach(row => {
            if (row.dataset.key === excludeKey) return;
            if (row.dataset.class === className && row.dataset.section === section) found = true;
        });
        return found;
    }

    function showEmpty() {
        if (getCount() === 0 && !document.getElementById('emptyRow')) {
            const tr = document.createElement('tr');
            tr.id = 'emptyRow';
            tr.innerHTML = '<td colspan="5" class="text-center text-muted">No classes created yet.</td>';
            tableBody.appendChild(tr);
        }
    }

    // clear validation on input
    [form, document.getElementById('editClassForm')].forEach(f => {
        if (f) f.querySelectorAll('input, select').forEach(el =>
            el.addEventListener('input', () => el.classList.remove('is-invalid'))
        );
    });

    // reset form when modal closes
    modalEl.addEventListener('hidden.bs.modal', () => form.reset());

    // CREATE
    document.getElementById('saveClassBtn').addEventListener('click', function () {
        let isValid = true;
        form.querySelectorAll('[required]').forEach(f => {
            if (!f.value.trim()) { f.classList.add('is-invalid'); isValid = false; }
        });
        if (!isValid) return;

        const className = document.getElementById('className').value;
        const section = document.getElementById('section').value;

        if (isDuplicate(className, section, null)) {
            document.getElementById('section').classList.add('is-invalid');
            document.getElementById('sectionError').textContent = `${className} - Section ${section} already exists.`;
            return;
        }

        const emptyRow = document.getElementById('emptyRow');
        if (emptyRow) emptyRow.remove();

        const key = `${className}-${section}-${Date.now()}`;
        const row = document.createElement('tr');
        row.dataset.key = key;
        row.dataset.class = className;
        row.dataset.section = section;
        row.style.animation = 'fadeIn 0.4s ease';
        row.innerHTML = `
            <td class="fw-semibold">${className}</td>
            <td>${section}</td>
            <td>${document.getElementById('roomNumber').value}</td>
            <td>${document.getElementById('classTeacher').value}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary edit-btn me-1"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i></button>
            </td>
        `;
        attachRowHandlers(row);
        tableBody.appendChild(row);
        updateCount();
        modal.hide();
    });

    function attachRowHandlers(row) {
        row.querySelector('.delete-btn').addEventListener('click', function () {
            if (confirm('Delete this class?')) {
                row.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => { row.remove(); updateCount(); showEmpty(); }, 300);
            }
        });

        row.querySelector('.edit-btn').addEventListener('click', function () {
            const cells = row.querySelectorAll('td');
            document.getElementById('editClassName').value = row.dataset.class;
            document.getElementById('editSection').value = row.dataset.section;
            document.getElementById('editRoomNumber').value = cells[2].textContent;
            document.getElementById('editClassTeacher').value = cells[3].textContent;
            document.getElementById('updateClassBtn').dataset.key = row.dataset.key;
            editModal.show();
        });
    }

    // EDIT SAVE
    document.getElementById('updateClassBtn').addEventListener('click', function () {
        const editForm = document.getElementById('editClassForm');
        let isValid = true;
        editForm.querySelectorAll('[required]').forEach(f => {
            if (!f.value.trim()) { f.classList.add('is-invalid'); isValid = false; }
        });
        if (!isValid) return;

        const key = this.dataset.key;
        const className = document.getElementById('editClassName').value;
        const section = document.getElementById('editSection').value;

        if (isDuplicate(className, section, key)) {
            document.getElementById('editSection').classList.add('is-invalid');
            document.getElementById('editSectionError').textContent = `${className} - Section ${section} already exists.`;
            return;
        }

        const row = tableBody.querySelector(`tr[data-key="${key}"]`);
        row.dataset.class = className;
        row.dataset.section = section;
        const cells = row.querySelectorAll('td');
        cells[0].textContent = className;
        cells[1].textContent = section;
        cells[2].textContent = document.getElementById('editRoomNumber').value;
        cells[3].textContent = document.getElementById('editClassTeacher').value;
        editModal.hide();
    });
});
