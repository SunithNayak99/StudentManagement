document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');

    function showError(field, message) {
        field.classList.add('is-invalid');
        const fb = field.parentNode.querySelector('.invalid-feedback');
        if (fb) fb.textContent = message;
    }

    [loginUsername, loginPassword].forEach(f => f.addEventListener('input', () => f.classList.remove('is-invalid')));

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let isValid = true;
        if (!loginUsername.value.trim()) { showError(loginUsername, 'Username is required'); isValid = false; }
        if (!loginPassword.value.trim()) { showError(loginPassword, 'Password is required'); isValid = false; }
        if (!isValid) return;

        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Logging in...';

        $.post('/Master/Login', { Username: loginUsername.value.trim(), Password: loginPassword.value.trim() })
            .done(function (res) {
                if (res.success) {
                    window.location.href = '/Home/Dashboard';
                } else {
                    showError(loginPassword, res.message || 'Invalid username or password.');
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Login';
                }
            })
            .fail(function () {
                showError(loginPassword, 'Server error. Please try again.');
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Login';
            });
    });
});
