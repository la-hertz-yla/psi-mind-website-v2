// ============================================================
//  login.js  —  VERSION CORRIGÉE
// ============================================================

// Redirige si déjà connecté
if (localStorage.getItem('psi_mind_user')) {
    const redirect = localStorage.getItem('psi_mind_redirect') || 'index.html';
    localStorage.removeItem('psi_mind_redirect');
    window.location.href = redirect;
}

// ── Particules décoratives ───────────────────────────────────
function createLoginParticles() {
    const container = document.getElementById('loginParticles');
    if (!container) return;

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'login-particle';
        const size = Math.random() * 5 + 2;
        particle.style.width  = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left   = Math.random() * 100 + '%';
        particle.style.top    = Math.random() * 100 + '%';
        particle.style.setProperty('--dur',   (Math.random() * 4 + 3) + 's');
        particle.style.setProperty('--delay', (Math.random() * 3) + 's');
        container.appendChild(particle);
    }
}
createLoginParticles();

// ── Basculement login / register ────────────────────────────
function switchTab(tab) {
    const loginForm    = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLogin     = document.getElementById('tab-login');
    const tabRegister  = document.getElementById('tab-register');
    const message      = document.getElementById('formMessage');

    message.className   = 'form-message';
    message.textContent = '';

    if (tab === 'login') {
        loginForm.style.display    = 'flex';
        registerForm.style.display = 'none';
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
    } else {
        loginForm.style.display    = 'none';
        registerForm.style.display = 'flex';
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
    }
}

// ── Messages de formulaire ──────────────────────────────────
function showMessage(text, type) {
    const msg = document.getElementById('formMessage');
    msg.textContent = text;
    msg.className   = 'form-message ' + type;
}

// ── Inscription ─────────────────────────────────────────────
async function handleRegister(e) {
    e.preventDefault();

    const name     = document.getElementById('register-name').value.trim();
    const email    = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    const confirm  = document.getElementById('register-confirm').value;

    if (password !== confirm) {
        return showMessage('Les mots de passe ne correspondent pas.', 'error');
    }
    if (password.length < 6) {
        return showMessage('Le mot de passe doit contenir au moins 6 caractères.', 'error');
    }

    const btn = document.getElementById('registerBtn');
    btn.disabled    = true;
    btn.textContent = 'Inscription...';

    try {
        // CORRECTION BUG 1 : URL relative au lieu de localhost:3000
        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Erreur register');
        }

        showMessage('✅ Inscription réussie !', 'success');
        setTimeout(() => switchTab('login'), 1000);

    } catch (error) {
        showMessage('Erreur : ' + error.message, 'error');
    } finally {
        btn.disabled    = false;
        btn.textContent = "S'INSCRIRE";
    }
}

// ── Connexion ───────────────────────────────────────────────
async function handleLogin(e) {
    e.preventDefault();

    const email    = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    const btn = document.getElementById('loginBtn');
    btn.disabled    = true;
    btn.textContent = 'Connexion...';

    try {
        // CORRECTION BUG 1 : URL relative au lieu de localhost:3000
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Erreur login');
        }

        localStorage.setItem('psi_mind_user', JSON.stringify(data.user));
        showMessage('Connexion réussie ! Redirection...', 'success');

        // CORRECTION BUG 2 : lire le redirect AVANT de le supprimer,
        // et stocker dans une variable locale pour le setTimeout
        const redirect = localStorage.getItem('psi_mind_redirect') || 'index.html';
        localStorage.removeItem('psi_mind_redirect');

        setTimeout(() => {
            window.location.href = redirect;
        }, 1000);

    } catch (error) {
        showMessage('Erreur : ' + error.message, 'error');
    } finally {
        btn.disabled    = false;
        btn.textContent = 'SE CONNECTER';
    }
}

// ── Afficher / masquer le mot de passe ──────────────────────
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);

    if (!btn.querySelector('i')) {
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-eye';
        btn.appendChild(icon);
    }

    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type     = 'text';
        icon.className = 'fa-solid fa-eye-slash';
    } else {
        input.type     = 'password';
        icon.className = 'fa-solid fa-eye';
    }
}

// ── Menu mobile ─────────────────────────────────────────────
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuToggle) {
    menuToggle.onclick = () => mobileMenu.classList.toggle('active');
    menuToggle.addEventListener('mouseenter', () => mobileMenu.classList.add('active'));
}
if (mobileMenu) {
    mobileMenu.addEventListener('mouseleave', () => mobileMenu.classList.remove('active'));
}

// ── Thème clair / sombre ────────────────────────────────────
const themeBtn  = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-toggle-icon');

if (localStorage.getItem('psi_mind_theme') === 'light') {
    document.body.classList.add('light-theme');
    if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
}

if (themeBtn) {
    themeBtn.onclick = function () {
        const isLight = document.body.classList.toggle('light-theme');
        if (isLight) {
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('psi_mind_theme', 'light');
        } else {
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('psi_mind_theme', 'dark');
        }
    };
}

// ── Attacher les événements de formulaire ───────────────────
const registerForm = document.getElementById('registerForm');
if (registerForm) registerForm.addEventListener('submit', handleRegister);

const loginForm = document.getElementById('loginForm');
if (loginForm) loginForm.addEventListener('submit', handleLogin);