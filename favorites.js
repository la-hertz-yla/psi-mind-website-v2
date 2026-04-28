/**
 * favorites.js
 * À inclure dans toutes les pages de cours (cours_math.html, cours_physique.html, etc.)
 * Dépendances : supabase.js chargé avant ce fichier
 */

(async function initFavorites() {
    const client = window.supabaseClient;
    if (!client) return console.error('[Favorites] supabaseClient introuvable.');

    // ── 1. Récupérer la session Supabase ──────────────────────────────────────
    const { data: { session } } = await client.auth.getSession();
    const userId = session?.user?.id ?? null;

    // ── 2. Charger les favoris de CET utilisateur uniquement ──────────────────
    let userFavorites = new Set();

    if (userId) {
        const { data, error } = await client
            .from('favorites')
            .select('pdf_id')
            .eq('user_id', userId); // ← correction : filtrer par user_id

        if (error) {
            console.error('[Favorites] Erreur chargement favoris :', error.message);
        } else {
            data.forEach(row => userFavorites.add(row.pdf_id));
        }
    }

    // ── 3. Initialiser tous les boutons heart sur la page ─────────────────────
    const buttons = document.querySelectorAll('.fav-btn');

    buttons.forEach(btn => {
        const pdfId  = btn.dataset.file;
        const title  = btn.dataset.title;
        const icon   = btn.querySelector('i');

        if (!pdfId || !icon) return;

        // ── Appliquer l'état initial (rouge si déjà en favori) ────────────────
        if (userFavorites.has(pdfId)) {
            icon.className = 'fa-solid fa-heart';
            icon.style.color = '#ff4444';
            btn.classList.add('active');
        } else {
            icon.className = 'fa-regular fa-heart';
            icon.style.color = '';
            btn.classList.remove('active');
        }

        // ── Clic sur le bouton heart ──────────────────────────────────────────
        btn.addEventListener('click', async () => {

            // Rediriger si non connecté
            if (!userId) {
                localStorage.setItem('psi_mind_redirect', window.location.pathname.split('/').pop());
                window.location.href = 'login.html';
                return;
            }

            const isFav = userFavorites.has(pdfId);

            if (isFav) {
                // ── Supprimer des favoris ─────────────────────────────────────
                const { error } = await client
                    .from('favorites')
                    .delete()
                    .eq('user_id', userId)
                    .eq('pdf_id', pdfId);

                if (error) {
                    console.error('[Favorites] Erreur suppression :', error.message);
                    return;
                }

                userFavorites.delete(pdfId);
                icon.className = 'fa-regular fa-heart';
                icon.style.color = '';
                btn.classList.remove('active');

            } else {
                // ── Ajouter aux favoris ───────────────────────────────────────
                const { error } = await client
                    .from('favorites')
                    .insert({
                        user_id:  userId,
                        pdf_id:   pdfId,
                        title:    title,
                        pdf_link: pdfId
                    });

                if (error) {
                    console.error('[Favorites] Erreur ajout :', error.message);
                    return;
                }

                userFavorites.add(pdfId);
                icon.className = 'fa-solid fa-heart';
                icon.style.color = '#ff4444';
                btn.classList.add('active');
            }
        });
    });

})();