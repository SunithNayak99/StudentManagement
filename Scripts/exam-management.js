document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveExamBtn');
    const form = document.getElementById('examForm');
    const tableBody = document.getElementById('examTableBody');
    const modalEl = document.getElementById('examModal');
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
        const status = document.getElementById('resultStatus').value;
        const badge = status === 'Pass' ? 'success' : 'danger';
        row.innerHTML = `
            <td class="fw-semibold">${document.getElementById('studentName').value}</td>
            <td>${document.getElementById('subject').value}</td>
            <td>${document.getElementById('marks').value}/100</td>
            <td><span class="badge bg-primary">${document.getElementById('grade').value}</span></td>
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
                    document.getElementById('examCount').textContent = `${count} Result${count !== 1 ? 's' : ''}`;
                }, 300);
            }
        });

        tableBody.appendChild(row);
        document.getElementById('examCount').textContent = `${count} Result${count !== 1 ? 's' : ''}`;
        form.reset();
        modal.hide();
    });
});
