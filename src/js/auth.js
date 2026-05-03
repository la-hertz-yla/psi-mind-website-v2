function injectAuthStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .auth-nav-btn {
            display: flex; align-items: center; gap: 6px;
            padding: 8px 16px; border-radius: 12px;
            font-family: 'Nunito', sans-serif; font-size: 0.85rem;
            font-weight: 600; cursor: pointer;
            transition: all 0.3s ease; text-decoration: none;
            border: none; line-height: normal;
        }
        .auth-login-btn {
            background: linear-gradient(135deg, rgba(88,130,255,0.3), rgba(140,80,255,0.3));
            border: 1.5px solid rgba(255,255,255,0.2) !important;
            color: white !important;
        }
        .auth-login-btn:hover {
            background: linear-gradient(135deg, rgba(88,130,255,0.5), rgba(140,80,255,0.5));
            border-color: rgba(255,255,255,0.4) !important;
            transform: scale(1.05); color: white !important;
        }
        .auth-logout-btn {
            background: rgba(255,80,80,0.15);
            border: 1.5px solid rgba(255,80,80,0.3) !important;
            color: rgba(255,150,150,0.9) !important; padding: 8px 12px;
        }
        .auth-logout-btn:hover {
            background: rgba(255,80,80,0.3);
            border-color: rgba(255,80,80,0.5) !important;
            color: white !important; transform: scale(1.05);
        }
        .auth-nav-container { display: flex; align-items: center; gap: 10px; margin-left: 20px; }
        .auth-username {
            font-size: 0.7rem; color: white; font-weight: bold;
            text-transform: uppercase; letter-spacing: 1px; text-align: center;
        }
        .auth-logged-in-wrapper { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    `;
    document.head.appendChild(style);
}
injectAuthStyles();

(function applyTheme() {
    const theme = localStorage.getItem('psi_mind_theme');
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        const icon = document.getElementById('theme-toggle-icon');
        if (icon) icon.className = 'fa-solid fa-moon';
    }
})();

const PROTECTED_PAGES = [
    'cours.html', 'cours_math.html', 'cours_physique.html', 'cours_si.html', 'cours_info.html', 'cours-chimie.html',
    'pratique.html', 'pratique_math.html', 'pratique_physique.html', 'pratique_si.html', 'pratique_info.html', 'pratique.chimie.html',
    'resume.html', 'resume_math.html', 'resume_physique.html', 'resume_si.html', 'resume_info.html', 'resume_chimie.html',
    'councours.html'
];

function isAuthenticated() {
    return localStorage.getItem('psi_mind_user') !== null;
}

function getCurrentUser() {
    const userData = localStorage.getItem('psi_mind_user');
    return userData ? JSON.parse(userData) : null;
}

async function logoutUser() {
    try {
        const client = window.supabaseClient;
        if (client) await client.auth.signOut();
    } catch (e) {
        console.warn('Supabase signOut error:', e);
    }
    localStorage.removeItem('psi_mind_user');
    window.location.href = 'index.html';
}

function authGuard() {
    const path = window.location.pathname;
    let pageName = path.split('/').pop() || 'index.html';
    if (!pageName.includes('.')) pageName += '.html'; 

    if (PROTECTED_PAGES.includes(pageName) && !isAuthenticated()) {
        localStorage.setItem('psi_mind_redirect', pageName);
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function injectAuthButton() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    let authContainer = document.querySelector('.auth-btn-container');
    if (!authContainer) {
        authContainer = document.createElement('div');
        authContainer.className = 'auth-btn-container auth-nav-container';
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) nav.insertBefore(authContainer, menuToggle);
        else nav.appendChild(authContainer);
    }

    if (isAuthenticated()) {
        const user = getCurrentUser();
        authContainer.innerHTML = `
            <div class="auth-logged-in-wrapper">
                <span class="auth-username">${user.name}</span>
                <button onclick="logoutUser()" class="auth-nav-btn auth-logout-btn">
                    <i class="fa-solid fa-right-from-bracket"></i> Déconnexion
                </button>
            </div>
        `;
    } else {
        authContainer.innerHTML = `
            <a href="login.html" class="auth-nav-btn auth-login-btn">
                <i class="fa-solid fa-user"></i> Connexion
            </a>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (authGuard()) {
        injectAuthButton();
    }
});