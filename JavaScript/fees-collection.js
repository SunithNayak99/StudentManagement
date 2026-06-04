// Fees Collection JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const saveBtn = document.getElementById('saveFeesBtn');
    const printBtn = document.getElementById('printReceiptBtn');
    const searchModalBtn = document.getElementById('searchFeesBtn');
    const searchBox = document.getElementById('feesSearchBox');
    const form = document.getElementById('feesForm');
    const tableBody = document.getElementById('feesTableBody');
    const modalEl = document.getElementById('feesModal');
    if (!saveBtn || !form || !tableBody || !modalEl) return;

    const modal = new bootstrap.Modal(modalEl);
    let count = 0;
    let lastSaved = null;

    form.querySelectorAll('input, select').forEach(f => f.addEventListener('input', () => f.classList.remove('is-invalid')));

    saveBtn.addEventListener('click', function () {
        let isValid = true;
        form.querySelectorAll('[required]').forEach(f => {
            if (!f.value.trim()) { f.classList.add('is-invalid'); isValid = false; }
        });
        if (!isValid) return;

        const emptyRow = document.getElementById('emptyRow');
        if (emptyRow) emptyRow.remove();

        lastSaved = {
            student: document.getElementById('studentName').value,
            cls: document.getElementById('studentClass').value,
            amount: document.getElementById('amount').value,
            mode: document.getElementById('paymentMode').value,
            date: document.getElementById('paymentDate').value
        };

        count++;
        const row = document.createElement('tr');
        row.style.animation = 'fadeIn 0.4s ease';
        row.innerHTML = `
            <td class="fw-semibold">${lastSaved.student}</td>
            <td>${lastSaved.cls}</td>
            <td>₹${parseInt(lastSaved.amount).toLocaleString()}</td>
            <td>${lastSaved.mode}</td>
            <td>${lastSaved.date}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i></button>
            </td>`;

        row.querySelector('.delete-btn').addEventListener('click', function () {
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
        printBtn.style.display = '';
        form.reset();
        modal.hide();
    });

    // Print Receipt — prints details of last collected fee
    printBtn.addEventListener('click', function () {
        if (!lastSaved) return;
        const win = window.open('', '_blank', 'width=400,height=300');
        win.document.write(`
            <html><head><title>Fee Receipt</title></head><body style="font-family:sans-serif;padding:20px;">
            <h2>Fee Receipt</h2><hr/>
            <p><b>Student:</b> ${lastSaved.student}</p>
            <p><b>Class:</b> ${lastSaved.cls}</p>
            <p><b>Amount:</b> &#8377;${parseInt(lastSaved.amount).toLocaleString()}</p>
            <p><b>Payment Mode:</b> ${lastSaved.mode}</p>
            <p><b>Date:</b> ${lastSaved.date}</p>
            <hr/><p style="font-size:12px;color:#888;">School Management System</p>
            <script>window.print();window.close();<\/script>
            </body></html>`);
    });

    // Search filters table
    searchModalBtn.addEventListener('click', function () {
        const q = document.getElementById('studentName').value.trim().toLowerCase();
        if (!q) return;
        let found = false;
        tableBody.querySelectorAll('tr:not(#emptyRow)').forEach(row => {
            const match = row.textContent.toLowerCase().includes(q);
            row.style.display = match ? '' : 'none';
            if (match) found = true;
        });
        if (!found) alert('No fee record found for that student.');
        modal.hide();
    });

    if (searchBox) {
        searchBox.addEventListener('input', function () {
            const q = this.value.toLowerCase();
            tableBody.querySelectorAll('tr:not(#emptyRow)').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
            });
        });
    }
});
