// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(field, message) {
        field.classList.add('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) feedback.textContent = message;
    }

    function clearError(field) {
        field.classList.remove('is-invalid');
    }

    loginEmail.addEventListener('input', () => clearError(loginEmail));
    loginPassword.addEventListener('input', () => clearError(loginPassword));

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;

        if (!loginEmail.value.trim()) {
            showError(loginEmail, 'Email is required');
            isValid = false;
        } else if (!validateEmail(loginEmail.value)) {
            showError(loginEmail, 'Invalid email format');
            isValid = false;
        }

        if (!loginPassword.value.trim()) {
            showError(loginPassword, 'Password is required');
            isValid = false;
        }

        if (isValid) {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Logging in...';
            
            setTimeout(() => {
                window.location.href = '/Home/Dashboard';
            }, 1000);
        }
    });
});
