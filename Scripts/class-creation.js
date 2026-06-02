document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveClassBtn');
    const form = document.getElementById('classForm');
    const tableBody = document.getElementById('classTableBody');
    const modalEl = document.getElementById('classModal');
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
        row.innerHTML = `
            <td class="fw-semibold">${document.getElementById('className').value}</td>
            <td>${document.getElementById('section').value}</td>
            <td>${document.getElementById('roomNumber').value}</td>
            <td>${document.getElementById('classTeacher').value}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i></button>
            </td>
        `;

        row.querySelector('.delete-btn').addEventListener('click', function() {
            if (confirm('Delete this class?')) {
                row.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => { row.remove(); count--; document.getElementById('classCount').textContent = `${count} Class${count !== 1 ? 'es' : ''}`; }, 300);
            }
        });

        tableBody.appendChild(row);
        document.getElementById('classCount').textContent = `${count} Class${count !== 1 ? 'es' : ''}`;
        form.reset();
        modal.hide();
    });
});
