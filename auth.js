
// auth.js - Gestion partagée de la session Supabase

// List of protected pages that require authentication
const PROTECTED_PAGES = [
    'cours.html', 'cours_math.html', 'cours_physique.html', 'cours_si.html', 'cours_info.html', 'cours-chimie.html',
    'pratique.html', 'pratique_math.html', 'pratique_physique.html', 'pratique_si.html', 'pratique_info.html', 'pratique.chimie.html',
    'resume.html', 'resume_math.html', 'resume_physique.html', 'resume_si.html', 'resume_info.html', 'resume_chimie.html',
    'councours.html'
];

// Vérifier si l'utilisateur est authentifié via Supabase ou le cache local
function isAuthenticated() {
    return localStorage.getItem('psi_mind_user') !== null;
}

// Récupérer les données de l'utilisateur actuel
function getCurrentUser() {
    const userData = localStorage.getItem('psi_mind_user');
    return userData ? JSON.parse(userData) : null;
}

// Fonction de déconnexion
async function logoutUser() {
    const supabase = window.supabaseClient;
    if (supabase) {
        await supabase.auth.signOut();
    }
    localStorage.removeItem('psi_mind_user');
    window.location.href = 'index.html';
}

// Garde d'authentification : redirige vers login si non connecté
function authGuard() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (PROTECTED_PAGES.includes(currentPage) && !isAuthenticated()) {
        localStorage.setItem('psi_mind_redirect', currentPage);
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Injection dynamique du bouton de connexion/déconnexion
function injectAuthButton() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    let authContainer = document.querySelector('.auth-btn-container');
    if (!authContainer) {
        authContainer = document.createElement('div');
        authContainer.className = 'auth-btn-container';
        // Style inline pour l'intégration rapide
        authContainer.style.marginLeft = '20px';
        authContainer.style.display = 'flex';
        authContainer.style.alignItems = 'center';
        
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) nav.insertBefore(authContainer, menuToggle);
        else nav.appendChild(authContainer);
    }

    if (isAuthenticated()) {
        const user = getCurrentUser();
        authContainer.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
                <span style="font-size:0.7rem; color:white; font-weight:bold; text-transform:uppercase;">${user.name}</span>
                <button onclick="logoutUser()" class="auth-nav-btn" style="cursor:pointer; background:rgba(255,255,255,0.2); border:1px solid white; color:white; padding:4px 10px; border-radius:15px; font-size:0.8rem;">
                    <i class="fa-solid fa-right-from-bracket"></i> Déconnexion
                </button>
            </div>
        `;
    } else {
        authContainer.innerHTML = `
            <a href="login.html" class="auth-nav-btn" style="text-decoration:none; background:white; color:#00126e; padding:6px 15px; border-radius:20px; font-weight:bold; font-size:0.9rem;">
                <i class="fa-solid fa-user"></i> Connexion
            </a>
        `;
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    if (authGuard()) {
        injectAuthButton();
    }
});
