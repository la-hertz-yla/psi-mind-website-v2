let themeToggleBtn = document.getElementById("theme-toggle"); 
let icon = document.getElementById("theme-toggle-icon");
let themeText = document.getElementById("theme-text");


themeToggleBtn.onclick = function(){
    if(icon.classList.contains("fa-sun")){
        document.body.classList.add("light-theme");
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        themeText.textContent = "Dark Mode";
    } else {
        document.body.classList.remove("light-theme");
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
        themeText.textContent = "Light Mode";
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


document.querySelectorAll("a[href='#accueil']").forEach(function(link){
    link.addEventListener("click", function(e){
        e.preventDefault();
        nav.classList.remove("active");
        window.location.href = "index.html";
    });
});

document.querySelectorAll("a[href='#apropos']").forEach(function(link){
    link.addEventListener("click", function(e){
        e.preventDefault();
        nav.classList.remove("active");
        window.location.href = "index.html#apropos";
    });
});

document.querySelectorAll("a[href='#cours']").forEach(function(link){
    link.addEventListener("click", function(e){
        e.preventDefault();
        nav.classList.remove("active");
        window.location.href = "index.html#cours";
    });
});

document.querySelectorAll("a[href='#contact']").forEach(function(link){
    link.addEventListener("click", function(e){
        e.preventDefault();
        nav.classList.remove("active");
        window.location.href = "index.html#contact";
    });
});

(async function initProfile() {
    const client = window.supabaseClient;
    if (!client) return console.error('[Profile] supabaseClient introuvable.');

    // ── 1. Vérifier que l'utilisateur est connecté ────────────────────────────
    const { data: { session } } = await client.auth.getSession();

    if (!session) {
        localStorage.setItem('psi_mind_redirect', 'profile.html');
        window.location.href = 'login.html';
        return;
    }

    const user   = session.user;
    const userId = user.id;

    // ── 2. Pré-remplir l'email (non modifiable) ───────────────────────────────
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.value    = user.email;
        emailInput.readOnly = true;
        emailInput.style.opacity = '0.6';
        emailInput.style.cursor  = 'not-allowed';
    }

    // ── 3. Charger les données du profil depuis la table 'profiles' ───────────
    const { data: profile, error: profileError } = await client
        .from('profiles')
        .select('full_name, filiere, prepa_name, phone')
        .eq('id', userId)
        .single();

    if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 = aucune ligne trouvée (nouveau utilisateur), pas une vraie erreur
        console.error('[Profile] Erreur chargement profil :', profileError.message);
    }

    if (profile) {
        setValue('full_name',   profile.full_name);
        setValue('filiere',     profile.filiere);
        setValue('prepa_name',  profile.prepa_name);
        setValue('phone',       profile.phone);
    } else {
        // Pré-remplir le nom depuis les métadonnées auth si nouveau utilisateur
        setValue('full_name', user.user_metadata?.full_name || '');
    }

    // ── 4. Sauvegarder le profil ──────────────────────────────────────────────
    const saveBtn = document.getElementById('saveProfile');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            saveBtn.disabled    = true;
            saveBtn.textContent = 'Sauvegarde...';

            const payload = {
                id:         userId,
                full_name:  getValue('full_name'),
                filiere:    getValue('filiere'),
                prepa_name: getValue('prepa_name'),
                phone:      getValue('phone'),
                created_at: new Date().toISOString(),
            };

            const { error } = await client
                .from('profiles')
                .upsert(payload, { onConflict: 'id' });

            if (error) {
                console.error('[Profile] Erreur sauvegarde :', error.message);
                showToast('Erreur lors de la sauvegarde.', 'error');
            } else {
                // Mettre à jour le nom dans le localStorage pour la navbar
                const stored = JSON.parse(localStorage.getItem('psi_mind_user') || '{}');
                stored.name  = payload.full_name || stored.name;
                localStorage.setItem('psi_mind_user', JSON.stringify(stored));

                showToast('Profil sauvegardé !', 'success');
            }

            saveBtn.disabled    = false;
            saveBtn.textContent = 'Sauvegarder';
        });
    }

    // ── 5. Charger et afficher les favoris ────────────────────────────────────
    const favoritesList = document.getElementById('favoritesList');

    if (favoritesList) {
        const { data: favs, error: favError } = await client
            .from('favorites')
            .select('pdf_id, title, pdf_link, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (favError) {
            console.error('[Profile] Erreur chargement favoris :', favError.message);
            favoritesList.innerHTML = '<p class="fav-empty">Erreur lors du chargement des favoris.</p>';
            return;
        }

        if (!favs || favs.length === 0) {
            favoritesList.innerHTML = '<p class="fav-empty">Aucun cours en favori pour l\'instant.</p>';
            return;
        }

        favoritesList.innerHTML = favs.map(fav => `
            <div class="fav-item">
                <div class="fav-info">
                    <i class="fa-solid fa-heart fav-icon"></i>
                    <span class="fav-title">${escapeHtml(fav.title)}</span>
                </div>
                <div class="fav-actions">
                    <a href="${escapeHtml(fav.pdf_link)}" 
                       download 
                       class="fav-download" 
                       title="Télécharger">
                        <i class="fa-solid fa-download"></i> Télécharger
                    </a>
                    <button class="fav-remove" data-pdf-id="${escapeHtml(fav.pdf_id)}" title="Retirer des favoris">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // ── Boutons "retirer" depuis le profil ────────────────────────────────
        favoritesList.querySelectorAll('.fav-remove').forEach(btn => {
            btn.addEventListener('click', async () => {
                const pdfId = btn.dataset.pdfId;

                const { error } = await client
                    .from('favorites')
                    .delete()
                    .eq('user_id', userId)
                    .eq('pdf_id', pdfId);

                if (error) {
                    console.error('[Profile] Erreur suppression favori :', error.message);
                    showToast('Erreur lors de la suppression.', 'error');
                    return;
                }

                // Retirer l'élément du DOM
                btn.closest('.fav-item').remove();

                // Afficher message si liste vide
                if (favoritesList.querySelectorAll('.fav-item').length === 0) {
                    favoritesList.innerHTML = '<p class="fav-empty">Aucun cours en favori pour l\'instant.</p>';
                }

                showToast('Favori supprimé.', 'success');
            });
        });
    }

    // ── Utilitaires ───────────────────────────────────────────────────────────
    function getValue(id) {
        return (document.getElementById(id)?.value || '').trim();
    }

    function setValue(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function showToast(message, type = 'success') {
        // Supprimer un éventuel toast existant
        const existing = document.getElementById('psi-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'psi-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 30px; right: 30px;
            padding: 12px 22px; border-radius: 10px;
            font-family: 'Nunito', sans-serif; font-size: 0.9rem; font-weight: 600;
            color: white; z-index: 9999;
            background: ${type === 'success' ? 'rgba(50,200,100,0.9)' : 'rgba(255,80,80,0.9)'};
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            animation: fadeInToast 0.3s ease;
        `;

        // Ajouter l'animation CSS si pas encore présente
        if (!document.getElementById('toast-style')) {
            const style = document.createElement('style');
            style.id = 'toast-style';
            style.textContent = `
                @keyframes fadeInToast {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

})();