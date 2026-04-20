// ===============================
// Supabase client (GLOBAL ONLY)
// ===============================
const supabase = window.supabaseClient

if (!supabase) {
    console.error("❌ Supabase client not initialized. Check supabase.js")
}

// ===============================
// Redirection si déjà connecté
// ===============================
(async function checkSession() {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const redirect = localStorage.getItem('psi_mind_redirect') || 'index.html'
        localStorage.removeItem('psi_mind_redirect')
        window.location.href = redirect
    }
})()

// ===============================
// Particules UI
// ===============================
function createLoginParticles() {
    const container = document.getElementById('loginParticles')
    if (!container) return

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div')
        particle.className = 'login-particle'

        const size = Math.random() * 5 + 2
        particle.style.width = size + 'px'
        particle.style.height = size + 'px'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.top = Math.random() * 100 + '%'
        particle.style.setProperty('--dur', (Math.random() * 4 + 3) + 's')
        particle.style.setProperty('--delay', (Math.random() * 3) + 's')

        container.appendChild(particle)
    }
}
createLoginParticles()

// ===============================
// Switch tabs
// ===============================
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm')
    const registerForm = document.getElementById('registerForm')
    const tabLogin = document.getElementById('tab-login')
    const tabRegister = document.getElementById('tab-register')
    const message = document.getElementById('formMessage')

    message.className = 'form-message'
    message.textContent = ''

    if (tab === 'login') {
        loginForm.style.display = 'flex'
        registerForm.style.display = 'none'
        tabLogin.classList.add('active')
        tabRegister.classList.remove('active')
    } else {
        loginForm.style.display = 'none'
        registerForm.style.display = 'flex'
        tabLogin.classList.remove('active')
        tabRegister.classList.add('active')
    }
}

// ===============================
// Messages UI
// ===============================
function showMessage(text, type) {
    const msg = document.getElementById('formMessage')
    msg.textContent = text
    msg.className = 'form-message ' + type
}

// ===============================
// REGISTER
// ===============================
async function handleRegister(e) {
    e.preventDefault()

    const name = document.getElementById('register-name').value.trim()
    const email = document.getElementById('register-email').value.trim().toLowerCase()
    const password = document.getElementById('register-password').value
    const confirm = document.getElementById('register-confirm').value

    if (password !== confirm) {
        return showMessage('Les mots de passe ne correspondent pas.', 'error')
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name
                }
            }
        })

        if (error) throw error

        showMessage('Inscription réussie ! Vérifie ton email ou connecte-toi.', 'success')

        setTimeout(() => {
            switchTab('login')
            document.getElementById('login-email').value = email
        }, 2000)

    } catch (error) {
        showMessage('Erreur d\'inscription : ' + error.message, 'error')
    }
}

// ===============================
// LOGIN
// ===============================
async function handleLogin(e) {
    e.preventDefault()

    const email = document.getElementById('login-email').value.trim().toLowerCase()
    const password = document.getElementById('login-password').value

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw error

        const user = data.user

        // session locale pour UI (optionnel)
        const sessionData = {
            name: user.user_metadata?.full_name || user.email.split('@')[0],
            email: user.email,
            id: user.id
        }

        localStorage.setItem('psi_mind_user', JSON.stringify(sessionData))

        showMessage('Connexion réussie !', 'success')

        setTimeout(() => {
            const redirect = localStorage.getItem('psi_mind_redirect') || 'index.html'
            localStorage.removeItem('psi_mind_redirect')
            window.location.href = redirect
        }, 1000)

    } catch (error) {
        showMessage('Erreur de connexion : ' + error.message, 'error')
    }
}

// ===============================
// PASSWORD TOGGLE
// ===============================
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId)
    const icon = btn.querySelector('i')

    if (input.type === 'password') {
        input.type = 'text'
        icon.classList.replace('fa-eye', 'fa-eye-slash')
    } else {
        input.type = 'password'
        icon.classList.replace('fa-eye-slash', 'fa-eye')
    }
}

// ===============================
// MOBILE MENU
// ===============================
const menuToggle = document.getElementById('menu-toggle')

if (menuToggle) {
    menuToggle.onclick = () => {
        document.querySelector('.mobile-menu')?.classList.toggle('active')
    }
}