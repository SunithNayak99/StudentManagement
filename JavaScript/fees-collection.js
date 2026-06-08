document.addEventListener('DOMContentLoaded', function () {
    const saveBtn        = document.getElementById('saveFeesBtn');
    const printBtn       = document.getElementById('printReceiptBtn');
    const searchModalBtn = document.getElementById('searchFeesBtn');
    const searchBox      = document.getElementById('feesSearchBox');
    const form           = document.getElementById('feesForm');
    const tableBody      = document.getElementById('feesTableBody');
    const modalEl        = document.getElementById('feesModal');
    if (!saveBtn || !form || !tableBody || !modalEl) return;

    const modal = new bootstrap.Modal(modalEl);
    let lastSaved = null;

    function updateCount() {
        const n = tableBody.querySelectorAll('tr[data-id]').length;
        document.getElementById('feesCount').textContent = `${n} Record${n !== 1 ? 's' : ''}`;
    }

    function renderRow(f) {
        const emptyRow = document.getElementById('emptyRow');
        if (emptyRow) emptyRow.remove();

        const row = document.createElement('tr');
        row.dataset.id = f.Id;
        row.style.animation = 'fadeIn 0.4s ease';
        row.innerHTML = `
            <td class="fw-semibold">${f.StudentName}</td>
            <td>${f.Class}</td>
            <td>₹${parseInt(f.Amount).toLocaleString()}</td>
            <td>${f.PaymentMode}</td>
            <td>${f.PaymentDate ? f.PaymentDate.substring(0, 10) : ''}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i></button>
            </td>`;

        row.querySelector('.delete-btn').addEventListener('click', function () {
            if (!confirm('Delete?')) return;
            $.post('/Master/DeleteFee', { id: f.Id }).done(function (res) {
                if (res.success) {
                    row.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => { row.remove(); updateCount(); }, 300);
                }
            });
        });

        tableBody.appendChild(row);
        updateCount();
    }

    // Load existing records
    $.get('/Master/GetFees').done(function (list) { list.forEach(renderRow); });

    form.querySelectorAll('input, select').forEach(f => f.addEventListener('input', () => f.classList.remove('is-invalid')));

    saveBtn.addEventListener('click', function () {
        let isValid = true;
        form.querySelectorAll('[required]').forEach(f => {
            if (!f.value.trim()) { f.classList.add('is-invalid'); isValid = false; }
        });
        if (!isValid) return;

        const data = {
            StudentName:  document.getElementById('studentName').value,
            Class:        document.getElementById('studentClass').value,
            Amount:       document.getElementById('amount').value,
            PaymentMode:  document.getElementById('paymentMode').value,
            PaymentDate:  document.getElementById('paymentDate').value
        };

        $.post('/Master/SaveFee', data).done(function (res) {
            if (res.success) {
                lastSaved = res.data;
                renderRow(res.data);
                printBtn.style.display = '';
                form.reset();
                modal.hide();
            }
        });
    });

    printBtn.addEventListener('click', function () {
        if (!lastSaved) return;
        const win = window.open('', '_blank', 'width=400,height=300');
        win.document.write(`
            <html><head><title>Fee Receipt</title></head><body style="font-family:sans-serif;padding:20px;">
            <h2>Fee Receipt</h2><hr/>
            <p><b>Student:</b> ${lastSaved.StudentName}</p>
            <p><b>Class:</b> ${lastSaved.Class}</p>
            <p><b>Amount:</b> &#8377;${parseInt(lastSaved.Amount).toLocaleString()}</p>
            <p><b>Payment Mode:</b> ${lastSaved.PaymentMode}</p>
            <p><b>Date:</b> ${lastSaved.PaymentDate ? lastSaved.PaymentDate.substring(0, 10) : ''}</p>
            <hr/><p style="font-size:12px;color:#888;">School Management System</p>
            <script>window.print();window.close();<\/script>
            </body></html>`);
    });

    searchModalBtn.addEventListener('click', function () {
        const q = document.getElementById('studentName').value.trim().toLowerCase();
        if (!q) return;
        let found = false;
        tableBody.querySelectorAll('tr[data-id]').forEach(row => {
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
            tableBody.querySelectorAll('tr[data-id]').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
            });
        });
    }
});
