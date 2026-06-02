document.addEventListener("DOMContentLoaded", () => {
    // Sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('open');
        });
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('open');
        });
    }

    // Student management functionality
    const studentModal = document.getElementById("studentModal");
    const studentForm = document.getElementById("studentForm");
    const studentName = document.getElementById("studentName");
    const studentAge = document.getElementById("studentAge");
    const studentEmail = document.getElementById("studentEmail");
    const studentCourse = document.getElementById("studentCourse");
    const studentTableBody = document.getElementById("studentTableBody");
    const studentCount = document.getElementById("studentCount");
    const modalTitle = document.getElementById("studentModalLabel");
    const saveStudentBtn = document.getElementById("saveStudentBtn");
    const addStudentBtn = document.querySelector(".action-btn[data-bs-target='#studentModal']");

    // Login form functionality
    const loginForm = document.getElementById("loginForm");
    const loginBtn = document.getElementById("loginBtn");
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");

    // Signup form functionality
    const signupForm = document.getElementById("signupForm");
    const signupBtn = document.getElementById("signupBtn");
    const signupPassword = document.getElementById("signupPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const strengthFill = document.getElementById("strengthFill");
    const strengthText = document.getElementById("strengthText");

    // Enhanced form validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        const minLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const score = [minLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
        return { score, minLength, hasUpper, hasLower, hasNumber, hasSpecial };
    }

    function showFieldError(field, message) {
        field.classList.add('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
        }
        field.addEventListener('input', () => {
            field.classList.remove('is-invalid');
        }, { once: true });
    }

    function showFieldSuccess(field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        setTimeout(() => {
            field.classList.remove('is-valid');
        }, 2000);
    }

    function showLoadingState(button) {
        button.classList.add('loading');
        button.disabled = true;
    }

    function hideLoadingState(button) {
        button.classList.remove('loading');
        button.disabled = false;
    }

    // Password strength indicator
    if (signupPassword && strengthFill && strengthText) {
        signupPassword.addEventListener('input', () => {
            const password = signupPassword.value;
            const validation = validatePassword(password);
            
            strengthFill.className = 'strength-fill';
            
            if (password.length === 0) {
                strengthText.textContent = 'Password strength';
                return;
            }
            
            switch (validation.score) {
                case 0:
                case 1:
                    strengthFill.classList.add('strength-weak');
                    strengthText.textContent = 'Weak password';
                    break;
                case 2:
                    strengthFill.classList.add('strength-fair');
                    strengthText.textContent = 'Fair password';
                    break;
                case 3:
                case 4:
                    strengthFill.classList.add('strength-good');
                    strengthText.textContent = 'Good password';
                    break;
                case 5:
                    strengthFill.classList.add('strength-strong');
                    strengthText.textContent = 'Strong password';
                    break;
            }
        });
    }

    // Login form handling
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            if (!loginEmail.value.trim()) {
                showFieldError(loginEmail, 'Email is required');
                isValid = false;
            } else if (!validateEmail(loginEmail.value)) {
                showFieldError(loginEmail, 'Please enter a valid email');
                isValid = false;
            } else {
                showFieldSuccess(loginEmail);
            }
            
            if (!loginPassword.value.trim()) {
                showFieldError(loginPassword, 'Password is required');
                isValid = false;
            } else {
                showFieldSuccess(loginPassword);
            }
            
            if (isValid) {
                showLoadingState(loginBtn);
                
                // Simulate login process
                setTimeout(() => {
                    hideLoadingState(loginBtn);
                    // Redirect to dashboard
                    window.location.href = '/Home/Dashboard';
                }, 1500);
            }
        });
    }

    // Signup form handling
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');
            const signupEmail = document.getElementById('signupEmail');
            const userRole = document.getElementById('userRole');
            
            // Validate all fields
            if (!firstName.value.trim()) {
                showFieldError(firstName, 'First name is required');
                isValid = false;
            } else {
                showFieldSuccess(firstName);
            }
            
            if (!lastName.value.trim()) {
                showFieldError(lastName, 'Last name is required');
                isValid = false;
            } else {
                showFieldSuccess(lastName);
            }
            
            if (!signupEmail.value.trim()) {
                showFieldError(signupEmail, 'Email is required');
                isValid = false;
            } else if (!validateEmail(signupEmail.value)) {
                showFieldError(signupEmail, 'Please enter a valid email');
                isValid = false;
            } else {
                showFieldSuccess(signupEmail);
            }
            
            if (!userRole.value) {
                showFieldError(userRole, 'Please select a role');
                isValid = false;
            } else {
                showFieldSuccess(userRole);
            }
            
            const passwordValidation = validatePassword(signupPassword.value);
            if (!signupPassword.value.trim()) {
                showFieldError(signupPassword, 'Password is required');
                isValid = false;
            } else if (passwordValidation.score < 3) {
                showFieldError(signupPassword, 'Password is too weak');
                isValid = false;
            } else {
                showFieldSuccess(signupPassword);
            }
            
            if (!confirmPassword.value.trim()) {
                showFieldError(confirmPassword, 'Please confirm your password');
                isValid = false;
            } else if (signupPassword.value !== confirmPassword.value) {
                showFieldError(confirmPassword, 'Passwords do not match');
                isValid = false;
            } else {
                showFieldSuccess(confirmPassword);
            }
            
            if (isValid) {
                showLoadingState(signupBtn);
                
                // Simulate signup process
                setTimeout(() => {
                    hideLoadingState(signupBtn);
                    // Redirect to login
                    window.location.href = '/Home/Login';
                }, 2000);
            }
        });
    }

    // Student management functionality (preserve existing)
    if (!studentModal || !studentForm || !studentTableBody) {
        return;
    }

    let editRow = null;

    const updateCount = () => {
        const total = studentTableBody.querySelectorAll("tr").length;
        studentCount.textContent = `${total} Total`;
    };

    const generateStudentId = () => `ST-${Math.floor(1000 + Math.random() * 9000)}`;

    const resetForm = () => {
        studentForm.reset();
        editRow = null;
    };

    const showAddMode = () => {
        resetForm();
        modalTitle.textContent = "Add Student";
    };

    const fillFormFromRow = (row) => {
        const cells = row.querySelectorAll("td");
        studentName.value = cells[0].querySelector(".fw-semibold").textContent.trim();
        studentAge.value = cells[1].textContent.trim();
        studentEmail.value = cells[2].textContent.trim();
        studentCourse.value = cells[3].textContent.trim();
    };

    addStudentBtn?.addEventListener("click", showAddMode);

    studentTableBody.addEventListener("click", (event) => {
        const editButton = event.target.closest(".edit-student");
        const deleteButton = event.target.closest(".delete-student");

        if (editButton) {
            editRow = editButton.closest("tr");
            modalTitle.textContent = "Edit Student";
            fillFormFromRow(editRow);
        }

        if (deleteButton) {
            const row = deleteButton.closest("tr");
            row.classList.add("row-animate-out");
            row.addEventListener("animationend", () => {
                row.remove();
                updateCount();
            }, { once: true });
        }
    });

    saveStudentBtn.addEventListener("click", () => {
        if (!studentName.value.trim() || !studentAge.value.trim() || !studentEmail.value.trim()) {
            return;
        }

        if (editRow) {
            editRow.querySelector(".fw-semibold").textContent = studentName.value.trim();
            editRow.querySelectorAll("td")[1].textContent = studentAge.value.trim();
            editRow.querySelectorAll("td")[2].textContent = studentEmail.value.trim();
            editRow.querySelectorAll("td")[3].textContent = studentCourse.value;
        } else {
            const row = document.createElement("tr");
            row.classList.add("row-animate-in");
            row.innerHTML = `
                <td>
                    <div class="fw-semibold">${studentName.value.trim()}</div>
                    <small class="text-muted">Student ID: ${generateStudentId()}</small>
                </td>
                <td>${studentAge.value.trim()}</td>
                <td>${studentEmail.value.trim()}</td>
                <td>${studentCourse.value}</td>
                <td class="text-end action-group">
                    <button class="btn btn-sm btn-outline-light me-2 edit-student" data-bs-toggle="modal" data-bs-target="#studentModal">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-student">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </td>
            `;
            studentTableBody.prepend(row);
            updateCount();
        }

        bootstrap.Modal.getOrCreateInstance(studentModal).hide();
        resetForm();
    });

    studentModal.addEventListener("hidden.bs.modal", resetForm);

    // Enhanced interactions
    document.querySelectorAll('.form-control, .form-select').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentNode.classList.remove('focused');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading states to all buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('loading') && !this.hasAttribute('data-bs-toggle')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });
});
