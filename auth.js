
// List of protected pages that require authentication
const PROTECTED_PAGES = [
    'cours.html', 'cours_math.html', 'cours_physique.html', 'cours_si.html', 'cours_info.html', 'cours-chimie.html',
    'pratique.html', 'pratique_math.html', 'pratique_physique.html', 'pratique_si.html', 'pratique_info.html', 'pratique.chimie.html',
    'resume.html', 'resume_math.html', 'resume_physique.html', 'resume_si.html', 'resume_info.html', 'resume_chimie.html',
    'councours.html'
];

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('psi_mind_user') !== null;
}

// Get current user
function getCurrentUser() {
    const userData = localStorage.getItem('psi_mind_user');
    return userData ? JSON.parse(userData) : null;
}

// Login user
function loginUser(name, email) {
    const user = {
        name: name,
        email: email,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('psi_mind_user', JSON.stringify(user));
}

// Logout user
function logoutUser() {
    localStorage.removeItem('psi_mind_user');
    window.location.href = 'index.html';
}

// Guard: redirect to login if not authenticated on protected pages
function authGuard() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (PROTECTED_PAGES.includes(currentPage) && !isAuthenticated()) {
        // Save the requested page so we can redirect after login
        localStorage.setItem('psi_mind_redirect', currentPage);
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Inject login/logout button into the navbar
function injectAuthButton() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Create auth button container
    const authContainer = document.createElement('div');
    authContainer.className = 'auth-btn-container';

    if (isAuthenticated()) {
        const user = getCurrentUser();
        const firstName = user.name.split(' ')[0];

        authContainer.innerHTML = `
            <div class="auth-user-info">
                <div class="auth-avatar">${firstName.charAt(0).toUpperCase()}</div>
                <span class="auth-username">${firstName}</span>
            </div>
            <button class="auth-nav-btn auth-logout-btn" onclick="logoutUser()" title="Se déconnecter">
                <i class="fa-solid fa-right-from-bracket"></i>
            </button>
        `;
    } else {
        authContainer.innerHTML = `
            <a href="login.html" class="auth-nav-btn auth-login-btn" title="Se connecter">
                <i class="fa-solid fa-user"></i>
                <span>Connexion</span>
            </a>
        `;
    }

    // Insert before the menu toggle icon
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        nav.insertBefore(authContainer, menuToggle);
    } else {
        nav.appendChild(authContainer);
    }
}

// Run auth guard and inject button on page load
document.addEventListener('DOMContentLoaded', function () {
    if (authGuard()) {
        injectAuthButton();
    }
});
