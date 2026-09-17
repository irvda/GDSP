const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const getFieldLabel = (input) => {
    const fieldNames = {
        username: 'Nombre de Usuario',
        email: 'Correo electrónico',
        password: 'Contraseña'
    };

    return fieldNames[input.name] || input.placeholder || 'Campo';
};

const showError = (input, message) => {
    const errorMessage = input.nextElementSibling;
    input.classList.add('input-error');
    if (errorMessage && errorMessage.classList.contains('error-message')) {
        errorMessage.textContent = message;
    }
};

const clearError = (input) => {
    const errorMessage = input.nextElementSibling;
    input.classList.remove('input-error');
    if (errorMessage && errorMessage.classList.contains('error-message')) {
        errorMessage.textContent = '';
    }
};

const validateField = (input) => {
    const value = input.value.trim();
    const fieldLabel = getFieldLabel(input);

    if (!value) {
        showError(input, `El campo "${fieldLabel}" es obligatorio.`);
        return false;
    }

    if (input.type === 'email' && !isValidEmail(value)) {
        showError(input, `El campo "${fieldLabel}" debe tener un formato de correo válido.`);
        return false;
    }

    if (input.type === 'password' && value.length > 8) {
        showError(input, `El campo "${fieldLabel}" no debe superar 8 caracteres.`);
        return false;
    }

    clearError(input);
    return true;
};

const setupFormValidation = (form) => {
    const fields = form.querySelectorAll('input');

    fields.forEach((field) => {
        field.addEventListener('input', () => validateField(field));
        field.addEventListener('blur', () => validateField(field));
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let isValid = true;

        fields.forEach((field) => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            window.location.href = '../index.html';
        }
    });
};

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

setupFormValidation(document.getElementById('registerForm'));
setupFormValidation(document.getElementById('loginForm'));