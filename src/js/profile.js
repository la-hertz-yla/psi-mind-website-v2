let themeToggleBtn = document.getElementById("theme-toggle"); 
let icon = document.getElementById("theme-toggle-icon");

themeToggleBtn.onclick = function(){
    if(icon.classList.contains("fa-sun")){
        document.body.classList.add("light-theme");
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        localStorage.setItem('psi_mind_theme', 'light');
    } else {
        document.body.classList.remove("light-theme");
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
        localStorage.setItem('psi_mind_theme', 'dark');
    }
};

let menuToggle = document.getElementById("menu-toggle");
let nav = document.querySelector(".mobile-menu");

menuToggle.onclick = function(){
    nav.classList.toggle("active");
};    

menuToggle.addEventListener("mouseenter", function() {
    nav.classList.add("active");
});

nav.addEventListener("mouseleave", function() {
    nav.classList.remove("active");
});

// ── Appliquer le thème sauvegardé ────────────────────────────
if (localStorage.getItem('psi_mind_theme') === 'light') {
    document.body.classList.add('light-theme');
    if (icon) icon.className = 'fa-solid fa-moon';
} else {
    if (icon) icon.className = 'fa-solid fa-sun';
}

// ── Vérifier l'authentification ──────────────────────────────
function checkAuth() {
    const user = localStorage.getItem('psi_mind_user');
    if (!user) {
        localStorage.setItem('psi_mind_redirect', 'profile.html');
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(user);
}

// ── Utilitaires ──────────────────────────────────────────────
function setValue(id, value) {
    const input = document.getElementById(id);
    if (input) input.value = value || '';
}

function getValue(id) {
    const input = document.getElementById(id);
    return input ? input.value.trim() : '';
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ── Initialisation du profil ─────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    const user = checkAuth();
    if (!user) return;

    // Pré-remplir l'email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.value = user.email;
        emailInput.readOnly = true;
        emailInput.style.opacity = '0.6';
        emailInput.style.cursor = 'not-allowed';
    }

    // Pré-remplir le nom si disponible
    setValue('full_name', user.name || '');

    // Charger les données du profil depuis le serveur
    try {
        const res = await fetch(`/profile/${user.id}`);
        if (res.ok) {
            const profile = await res.json();
            setValue('filiere', profile.filiere);
            setValue('prepa_name', profile.prepa_name);
            setValue('phone', profile.phone);
            setValue('full_name', profile.full_name || user.name);
        }
    } catch (error) {
        console.warn('Erreur chargement profil:', error);
    }

    // Bouton sauvegarder
    const saveBtn = document.getElementById('saveProfile');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Sauvegarde...';

            try {
                const res = await fetch(`/profile/${user.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        full_name: getValue('full_name'),
                        email: user.email,
                        filiere: getValue('filiere'),
                        prepa_name: getValue('prepa_name'),
                        phone: getValue('phone')
                    })
                });

                if (!res.ok) {
                    throw new Error('Erreur sauvegarde');
                }

                // Mettre à jour le localStorage
                const updated = JSON.parse(localStorage.getItem('psi_mind_user'));
                updated.name = getValue('full_name') || updated.name;
                localStorage.setItem('psi_mind_user', JSON.stringify(updated));

                showToast('✅ Profil sauvegardé !', 'success');
            } catch (error) {
                showToast('❌ Erreur: ' + error.message, 'error');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Sauvegarder';
            }
        });
    }
});
