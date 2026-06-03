// Signup Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const signupBtn = document.getElementById('signupBtn');
    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');

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

    signupForm.querySelectorAll('input, select').forEach(field => {
        field.addEventListener('input', () => clearError(field));
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const signupEmail = document.getElementById('signupEmail');
        const userRole = document.getElementById('userRole');

        if (!firstName.value.trim()) {
            showError(firstName, 'First name is required');
            isValid = false;
        }

        if (!lastName.value.trim()) {
            showError(lastName, 'Last name is required');
            isValid = false;
        }

        if (!signupEmail.value.trim()) {
            showError(signupEmail, 'Email is required');
            isValid = false;
        } else if (!validateEmail(signupEmail.value)) {
            showError(signupEmail, 'Invalid email format');
            isValid = false;
        }

        if (!userRole.value) {
            showError(userRole, 'Please select a role');
            isValid = false;
        }

        if (!signupPassword.value.trim()) {
            showError(signupPassword, 'Password is required');
            isValid = false;
        } else if (signupPassword.value.length < 6) {
            showError(signupPassword, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!confirmPassword.value.trim()) {
            showError(confirmPassword, 'Please confirm password');
            isValid = false;
        } else if (signupPassword.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }

        if (isValid) {
            signupBtn.disabled = true;
            signupBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Creating account...';
            
            setTimeout(() => {
                window.location.href = '/Home/Login';
            }, 1500);
        }
    });
});
