// Student Registration JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveStudentBtn');
    const form = document.getElementById('studentRegForm');
    const tableBody = document.getElementById('studentTableBody');
    const emptyRow = document.getElementById('emptyRow');
    const countBadge = document.getElementById('studentCount');
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('studentModal'));

    let studentCount = 0;

    // Clear errors on input
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => field.classList.remove('is-invalid'));
    });

    // Save student
    saveBtn.addEventListener('click', function() {
        let isValid = true;

        // Validate all required fields
        form.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            }
        });

        if (!isValid) return;

        // Get form data
        const studentData = {
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

        // Add to table
        addStudentToTable(studentData);

        // Reset form and close modal
        form.reset();
        modal.hide();
    });

    function addStudentToTable(data) {
        // Remove empty row if exists
        if (emptyRow) {
            emptyRow.remove();
        }

        studentCount++;
        const row = document.createElement('tr');
        row.style.animation = 'fadeIn 0.4s ease';
        row.innerHTML = `
            <td>
                <div class="fw-semibold">${data.name}</div>
                <small class="text-muted">DOB: ${formatDate(data.dob)}</small>
            </td>
            <td>${data.father}</td>
            <td>${data.mobile}</td>
            <td>${data.class}</td>
            <td>${data.section}</td>
            <td>${data.gender}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-light me-2 edit-btn">
                    <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </td>
        `;

        // Delete functionality
        row.querySelector('.delete-btn').addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this student?')) {
                row.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    row.remove();
                    studentCount--;
                    updateCount();
                    
                    if (studentCount === 0) {
                        const emptyRow = document.createElement('tr');
                        emptyRow.id = 'emptyRow';
                        emptyRow.innerHTML = '<td colspan="7" class="text-center text-muted">No students registered yet. Click "Add Student" to register.</td>';
                        tableBody.appendChild(emptyRow);
                    }
                }, 300);
            }
        });

        tableBody.appendChild(row);
        updateCount();
    }

    function updateCount() {
        countBadge.textContent = `${studentCount} Student${studentCount !== 1 ? 's' : ''}`;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
});
