const supabase = window.supabaseClient;

if (localStorage.getItem('psi_mind_user')) {
    const redirect = localStorage.getItem('psi_mind_redirect') || 'index.html';
    localStorage.removeItem('psi_mind_redirect');
    window.location.href = redirect;
}

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

function showMessage(text, type) {
    const msg = document.getElementById('formMessage');
    msg.textContent = text;
    msg.className = 'form-message ' + type;
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    if (password !== confirm) {
        return showMessage('Les mots de passe ne correspondent pas.', 'error');
    }
    if (password.length < 6) {
        return showMessage('Le mot de passe doit contenir au moins 6 caractères.', 'error');
    }

    const btn = document.getElementById('registerBtn');
    btn.disabled = true;
    btn.textContent = 'Inscription...';

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } }
        });

        if (error) throw error;

        if (data.user && !data.session) {
            showMessage('✅ Inscription réussie ! Vérifiez votre email pour confirmer votre compte.', 'success');
        } else if (data.session) {
            showMessage('✅ Inscription réussie ! Redirection...', 'success');
            const sessionData = { name, email: data.user.email, id: data.user.id };
            localStorage.setItem('psi_mind_user', JSON.stringify(sessionData));
            setTimeout(() => { window.location.href = 'index.html'; }, 1200);
        }
    } catch (error) {
        let msg = error.message;
        if (msg.includes('already registered') || msg.includes('already been registered')) {
            msg = 'Cet email est déjà utilisé. Essayez de vous connecter.';
        } else if (msg.includes('invalid')) {
            msg = 'Email invalide.';
        }
        showMessage('Erreur : ' + msg, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = "S'INSCRIRE";
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.textContent = 'Connexion...';

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const user = data.user;
        const sessionData = {
            name: user.user_metadata?.full_name || user.email.split('@')[0],
            email: user.email,
            id: user.id
        };
        localStorage.setItem('psi_mind_user', JSON.stringify(sessionData));
        showMessage('Connexion réussie ! Redirection...', 'success');

        setTimeout(() => {
            const redirect = localStorage.getItem('psi_mind_redirect') || 'index.html';
            localStorage.removeItem('psi_mind_redirect');
            window.location.href = redirect;
        }, 1000);
    } catch (error) {
        let msg = error.message;
        if (msg.includes('Invalid login')) msg = 'Email ou mot de passe incorrect.';
        if (msg.includes('Email not confirmed')) msg = 'Confirmez votre email avant de vous connecter.';
        showMessage('Erreur : ' + msg, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'SE CONNECTER';
    }
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!btn.querySelector('i')) {
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-eye';
        btn.appendChild(icon);
    }
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fa-solid fa-eye';
    }
}

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
if (menuToggle) {
    menuToggle.onclick = () => mobileMenu.classList.toggle('active');
    menuToggle.addEventListener('mouseenter', () => mobileMenu.classList.add('active'));
}
if (mobileMenu) {
    mobileMenu.addEventListener('mouseleave', () => mobileMenu.classList.remove('active'));
}

const themeBtn = document.getElementById('theme-toggle');
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