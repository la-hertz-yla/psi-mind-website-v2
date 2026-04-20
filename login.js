// Utilisation du client global Supabase
const supabase = window.supabaseClient || window.supabase.createClient("https://uyhwwqlcophdvjgeucef.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5aHd3cWxjb3BoZHZqZ2V1Y2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDU2NjIsImV4cCI6MjA5MjE4MTY2Mn0.ecDNU4OyjbqP6PFclRzHd7OXGVP1eugGw-29mLdoDXc");

// Rediriger si déjà connecté
if (localStorage.getItem('psi_mind_user')) {
    const redirect = localStorage.getItem('psi_mind_redirect') || 'index.html';
    localStorage.removeItem('psi_mind_redirect');
    window.location.href = redirect;
}

// Particules flottantes pour le design
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

// Navigation entre Onglets (Connexion / Inscription)
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

// Affichage des messages (Success / Error)
function showMessage(text, type) {
    const msg = document.getElementById('formMessage');
    msg.textContent = text;
    msg.className = 'form-message ' + type;
}

// Inscription
async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    if (password !== confirm) {
        return showMessage('Les mots de passe ne correspondent pas.', 'error');
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name }
            }
        });

        if (error) throw error;

        showMessage('Inscription réussie ! Vous allez être redirigé vers la connexion.', 'success');
        setTimeout(() => {
            switchTab('login');
            document.getElementById('login-email').value = email;
        }, 2000);
    } catch (error) {
        showMessage('Erreur d\'inscription : ' + error.message, 'error');
    }
}

// Connexion
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Synchronisation de la session locale pour le site
        const user = data.user;
        const sessionData = {
            name: user.user_metadata.full_name || user.email.split('@')[0],
            email: user.email,
            id: user.id
        };
        localStorage.setItem('psi_mind_user', JSON.stringify(sessionData));

        showMessage('Connexion réussie ! Redirection en cours...', 'success');
        setTimeout(() => {
            const redirect = localStorage.getItem('psi_mind_redirect') || 'index.html';
            localStorage.removeItem('psi_mind_redirect');
            window.location.href = redirect;
        }, 1000);
    } catch (error) {
        showMessage('Erreur de connexion : ' + error.message, 'error');
    }
}

// Toggle visibilité mot de passe
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Menu Mobile
const menuToggle = document.getElementById('menu-toggle');
if (menuToggle) {
    menuToggle.onclick = () => document.querySelector('.mobile-menu').classList.toggle('active');
}