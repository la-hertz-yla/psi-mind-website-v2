if (localStorage.getItem('psi_mind_user')) {
        const redirect = localStorage.getItem('psi_mind_redirect') || 'index.html';
        localStorage.removeItem('psi_mind_redirect');
        window.location.href = redirect;
}

// Create floating particles
function createLoginParticles() {
    const container = document.getElementById('loginParticles');
    if (!container) return;
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'login-particle';
        const size = Math.random() * 5 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.setProperty('--dur', (Math.random() * 4 + 3) + 's');
        particle.style.setProperty('--delay', (Math.random() * 3) + 's');
        container.appendChild(particle);
    }
}
createLoginParticles();

// Tab switching
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const message = document.getElementById('formMessage');

    message.className = 'form-message';
    message.textContent = '';

    if (tab === 'login') {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
    }
}

// Toggle password visibility
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show message
function showMessage(text, type) {
    const msg = document.getElementById('formMessage');
    msg.textContent = text;
    msg.className = 'form-message ' + type;
}

// Get stored users
function getUsers() {
    const data = localStorage.getItem('psi_mind_users');
    return data ? JSON.parse(data) : [];
}

// Save users
function saveUsers(users) {
    localStorage.setItem('psi_mind_users', JSON.stringify(users));
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    if (password !== confirm) {
        showMessage('Les mots de passe ne correspondent pas.', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('Le mot de passe doit contenir au moins 6 caractères.', 'error');
        return;
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
        showMessage('Un compte existe déjà avec cet email.', 'error');
        return;
    }

    users.push({ name, email, password });
    saveUsers(users);

    showMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.', 'success');
        
    // Auto switch to login after 1.5s
    setTimeout(() => {
        switchTab('login');
        document.getElementById('login-email').value = email;
    }, 1500);
}

// Handle login
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showMessage('Email ou mot de passe incorrect.', 'error');
        return;
    }

    // Store session
    const sessionData = {
        name: user.name,
        email: user.email,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('psi_mind_user', JSON.stringify(sessionData));

    showMessage('Connexion réussie ! Redirection...', 'success');

    // Redirect
    setTimeout(() => {
        const redirect = localStorage.getItem('psi_mind_redirect') || 'index.html';
        localStorage.removeItem('psi_mind_redirect');
        window.location.href = redirect;
    }, 1000);
}

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuToggle) {
    menuToggle.onclick = function() {
        mobileMenu.classList.toggle('active');
    };
    menuToggle.addEventListener('mouseenter', function() {
        mobileMenu.classList.add('active');
    });
}
if (mobileMenu) {
    mobileMenu.addEventListener('mouseleave', function() {
        mobileMenu.classList.remove('active');
    });
}

// Theme toggle Logic
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-toggle-icon');
const themeText = document.getElementById('theme-text');

if (themeBtn) {
    themeBtn.onclick = function() {
        document.body.classList.toggle('light-theme');
        if (document.body.classList.contains('light-theme')) {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            themeText.textContent = 'Dark Mode';
        } else {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeText.textContent = 'Light Mode';
        }
    };
}
