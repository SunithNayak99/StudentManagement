document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveFeesBtn');
    const form = document.getElementById('feesForm');
    const tableBody = document.getElementById('feesTableBody');
    const modalEl = document.getElementById('feesModal');
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
            <td class="fw-semibold">${document.getElementById('studentName').value}</td>
            <td>${document.getElementById('studentClass').value}</td>
            <td>₹${parseInt(document.getElementById('amount').value).toLocaleString()}</td>
            <td>${document.getElementById('paymentMode').value}</td>
            <td>${document.getElementById('paymentDate').value}</td>
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
                    document.getElementById('feesCount').textContent = `${count} Record${count !== 1 ? 's' : ''}`;
                }, 300);
            }
        });

        tableBody.appendChild(row);
        document.getElementById('feesCount').textContent = `${count} Record${count !== 1 ? 's' : ''}`;
        form.reset();
        modal.hide();
    });
});
