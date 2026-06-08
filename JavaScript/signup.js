document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
    const signupBtn = document.getElementById('signupBtn');
    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');

    function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

    function showError(field, message) {
        field.classList.add('is-invalid');
        const fb = field.parentNode.querySelector('.invalid-feedback');
        if (fb) fb.textContent = message;
    }

    signupForm.querySelectorAll('input, select').forEach(f => f.addEventListener('input', () => f.classList.remove('is-invalid')));

    // Password strength indicator
    signupPassword.addEventListener('input', function () {
        const fill = document.getElementById('strengthFill');
        const text = document.getElementById('strengthText');
        if (!fill || !text) return;
        const v = this.value;
        const score = [v.length >= 6, /[A-Z]/.test(v), /[a-z]/.test(v), /\d/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length;
        const levels = ['', 'strength-weak', 'strength-fair', 'strength-good', 'strength-good', 'strength-strong'];
        const labels = ['Password strength', 'Weak', 'Fair', 'Good', 'Good', 'Strong'];
        fill.className = 'strength-fill ' + (v ? levels[score] : '');
        text.textContent = v ? labels[score] : 'Password strength';
    });

    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const signupEmail = document.getElementById('signupEmail');
        const userRole = document.getElementById('userRole');
        let isValid = true;

        if (!firstName.value.trim()) { showError(firstName, 'First name is required'); isValid = false; }
        if (!lastName.value.trim()) { showError(lastName, 'Last name is required'); isValid = false; }
        if (!signupEmail.value.trim()) { showError(signupEmail, 'Email is required'); isValid = false; }
        else if (!validateEmail(signupEmail.value)) { showError(signupEmail, 'Invalid email format'); isValid = false; }
        if (!userRole.value) { showError(userRole, 'Please select a role'); isValid = false; }
        if (!signupPassword.value.trim()) { showError(signupPassword, 'Password is required'); isValid = false; }
        else if (signupPassword.value.length < 6) { showError(signupPassword, 'Minimum 6 characters'); isValid = false; }
        if (!confirmPassword.value.trim()) { showError(confirmPassword, 'Please confirm password'); isValid = false; }
        else if (signupPassword.value !== confirmPassword.value) { showError(confirmPassword, 'Passwords do not match'); isValid = false; }
        if (!isValid) return;

        signupBtn.disabled = true;
        signupBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Creating account...';

        $.post('/Master/Signup', {
            FirstName: firstName.value.trim(),
            LastName: lastName.value.trim(),
            Email: signupEmail.value.trim(),
            Role: userRole.value,
            Password: signupPassword.value,
            ConfirmPassword: confirmPassword.value
        })
        .done(function (res) {
            if (res.success) {
                window.location.href = '/Home/Login';
            } else {
                showError(signupEmail, res.message || 'Registration failed.');
                signupBtn.disabled = false;
                signupBtn.innerHTML = '<i class="bi bi-person-plus"></i> Create Account';
            }
        })
        .fail(function () {
            signupBtn.disabled = false;
            signupBtn.innerHTML = '<i class="bi bi-person-plus"></i> Create Account';
        });
    });
});
