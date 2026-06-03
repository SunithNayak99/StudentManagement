document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveTeacherBtn');
    const form = document.getElementById('teacherForm');
    const tableBody = document.getElementById('teacherTableBody');
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('teacherModal'));
    let count = 0;

    form.querySelectorAll('input, select').forEach(f => {
        f.addEventListener('input', () => f.classList.remove('is-invalid'));
    });

    saveBtn.addEventListener('click', function() {
        let isValid = true;
        form.querySelectorAll('[required]').forEach(f => {
            if (!f.value.trim()) { f.classList.add('is-invalid'); isValid = false; }
        });
        if (!isValid) return;

        const data = {
            name: document.getElementById('teacherName').value,
            subject: document.getElementById('subject').value,
            qualification: document.getElementById('qualification').value,
            email: document.getElementById('email').value,
            mobile: document.getElementById('mobile').value,
            joiningDate: document.getElementById('joiningDate').value,
            salary: document.getElementById('salary').value
        };

        if (document.getElementById('emptyRow')) document.getElementById('emptyRow').remove();

        count++;
        const row = document.createElement('tr');
        row.style.animation = 'fadeIn 0.4s ease';
        row.innerHTML = `
            <td><div class="fw-semibold">${data.name}</div><small class="text-muted">${data.email}</small></td>
            <td>${data.subject}</td>
            <td>${data.qualification}</td>
            <td>${data.mobile}</td>
            <td>₹${parseInt(data.salary).toLocaleString()}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i></button>
            </td>
        `;

        row.querySelector('.delete-btn').addEventListener('click', function() {
            if (confirm('Delete this teacher?')) {
                row.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => { row.remove(); count--; updateCount(); }, 300);
            }
        });

        tableBody.appendChild(row);
        updateCount();
        form.reset();
        modal.hide();
    });

    function updateCount() {
        document.getElementById('teacherCount').textContent = `${count} Teacher${count !== 1 ? 's' : ''}`;
    }
});
