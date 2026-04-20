
// Supabase client
const supabase = window.supabaseClient

// =========================
// Pages protégées
// =========================
const PROTECTED_PAGES = [
    'cours.html', 'cours_math.html', 'cours_physique.html', 'cours_si.html', 'cours_info.html', 'cours-chimie.html',
    'pratique.html', 'pratique_math.html', 'pratique_physique.html', 'pratique_si.html', 'pratique_info.html', 'pratique.chimie.html',
    'resume.html', 'resume_math.html', 'resume_physique.html', 'resume_si.html', 'resume_info.html', 'resume_chimie.html',
    'councours.html'
]

// =========================
// AUTH SUPABASE (source unique)
// =========================
async function isAuthenticated() {
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
}

async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// =========================
// LOGOUT
// =========================
async function logoutUser() {
    await supabase.auth.signOut()
    window.location.href = 'index.html'
}

// =========================
// GUARD
// =========================
async function authGuard() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'

    if (PROTECTED_PAGES.includes(currentPage)) {
        const loggedIn = await isAuthenticated()

        if (!loggedIn) {
            localStorage.setItem('psi_mind_redirect', currentPage)
            window.location.href = 'login.html'
            return false
        }
    }

    return true
}

// =========================
// BUTTON UI
// =========================
async function injectAuthButton() {
    const nav = document.querySelector('nav')
    if (!nav) return

    let authContainer = document.querySelector('.auth-btn-container')

    if (!authContainer) {
        authContainer = document.createElement('div')
        authContainer.className = 'auth-btn-container'
        authContainer.style.marginLeft = '20px'
        authContainer.style.display = 'flex'
        authContainer.style.alignItems = 'center'

        const menuToggle = document.getElementById('menu-toggle')
        if (menuToggle) nav.insertBefore(authContainer, menuToggle)
        else nav.appendChild(authContainer)
    }

    const user = await getCurrentUser()

    if (user) {
        const name =
            user.user_metadata?.full_name ||
            user.email.split('@')[0]

        authContainer.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
                <span style="font-size:0.7rem; color:white; font-weight:bold; text-transform:uppercase;">
                    ${name}
                </span>
                <button onclick="logoutUser()" 
                    style="cursor:pointer; background:rgba(255,255,255,0.2); border:1px solid white; color:white; padding:4px 10px; border-radius:15px; font-size:0.8rem;">
                    Logout
                </button>
            </div>
        `
    } else {
        authContainer.innerHTML = `
            <a href="login.html" 
               style="text-decoration:none; background:white; color:#00126e; padding:6px 15px; border-radius:20px; font-weight:bold; font-size:0.9rem;">
                Login
            </a>
        `
    }
}

// =========================
// INIT
// =========================
document.addEventListener('DOMContentLoaded', async () => {
    await authGuard()
    await injectAuthButton()
})