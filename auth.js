
// Inject shared styles for authentication buttons
function injectAuthStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .auth-nav-btn {
            text-decoration: none;
            color: #00126e !important;
            background-color: rgba(237, 237, 237, 0.47) !important;
            padding: 6px 14px !important;
            border-radius: 20px !important;
            transition: all 0.3s ease !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 8px !important;
            font-family: inherit !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            line-height: normal !important;
        }
        .auth-nav-btn:hover {
            background-color: rgba(237, 237, 237, 0.73) !important;
            transform: scale(1.05) !important;
            border-color: white !important;
        }
        .auth-logged-in-wrapper {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 4px !important;
        }
        .auth-username {
            font-size: 0.8rem !important;
            color: rgba(255, 255, 255, 0.9) !important;
            font-weight: bold !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            line-height: 1 !important;
        }
        .auth-btn-container {
            display: flex !important;
            align-items: center !important;
            margin-left: 20px !important;
        }
        nav {
            display: flex !important;
            justify-content: space-between !important;
        }
    `;
    document.head.appendChild(style);
}

// Run style injection immediately
injectAuthStyles();

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
async function logoutUser() {
    try {
        // Clear Supabase session if global supabase object exists
        if (typeof supabase !== 'undefined' && supabase.auth) {
            await supabase.auth.signOut();
        }
    } catch (error) {
        console.error("Erreur lors de la déconnexion Supabase:", error);
    } finally {
        localStorage.removeItem('psi_mind_user');
        // Clear Supabase local storage tokens as well if needed, 
        // though signOut usually handles this.
        window.location.href = 'index.html';
    }
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

    // Remove existing auth container if any
    const existing = document.querySelector('.auth-btn-container');
    if (existing) existing.remove();

    // Create auth button container
    const authContainer = document.createElement('div');
    authContainer.className = 'auth-btn-container';

    if (isAuthenticated()) {
        const user = getCurrentUser();
        const fullName = user.name;

        authContainer.innerHTML = `
            <div class="auth-logged-in-wrapper">
                <span class="auth-username">${fullName}</span>
                <button class="auth-nav-btn auth-logout-btn" onclick="logoutUser()" title="Se déconnecter">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <span>Déconnexion</span>
                </button>
            </div>
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
