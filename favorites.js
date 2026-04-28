/**
 * favorites.js
 * À inclure dans toutes les pages de cours (cours_math.html, cours_physique.html, etc.)
 * ET dans profile.html
 * Dépendances : supabase.js chargé avant ce fichier
 */

(async function initFavorites() {
    const client = window.supabaseClient;
    if (!client) return console.error('[Favorites] supabaseClient introuvable.');

    // ── 1. Récupérer la session Supabase ──────────────────────────────────────
    const { data: { session } } = await client.auth.getSession();
    const userId = session?.user?.id ?? null;

    // ── 2. Charger les favoris existants (si connecté) ────────────────────────
    let userFavorites = new Set(); // contient les pdf_id déjà en favori

    if (userId) {
        const { data, error } = await client
            .from('favorites')
            .select('pdf_id');

        if (error) {
            console.error('[Favorites] Erreur chargement favoris :', error.message);
        } else {
            data.forEach(row => userFavorites.add(row.pdf_id));
        }
    }

    // ── 3. Initialiser tous les boutons heart sur la page ─────────────────────
    const buttons = document.querySelectorAll('.fav-btn');

    buttons.forEach(btn => {
        const pdfId   = btn.dataset.file;   // identifiant unique = chemin du fichier
        const title   = btn.dataset.title;
        const pdfLink = btn.dataset.file;
        const icon    = btn.querySelector('i');

        if (!pdfId || !icon) return;

        // Colorier en rouge si déjà en favori
        if (userFavorites.has(pdfId)) {
            icon.className = 'fa-solid fa-heart';
            btn.classList.add('active');
        }

        // ── Clic sur le bouton heart ──────────────────────────────────────────
        btn.addEventListener('click', async () => {
            if (!userId) {
                // Rediriger vers login si non connecté
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
                btn.classList.remove('active');

            } else {
                // ── Ajouter aux favoris ───────────────────────────────────────
                const { error } = await client
                    .from('favorites')
                    .insert({
                        user_id:  userId,
                        pdf_id:   pdfId,
                        title:    title,
                        pdf_link: pdfLink
                    });

                if (error) {
                    console.error('[Favorites] Erreur ajout :', error.message);
                    return;
                }

                userFavorites.add(pdfId);
                icon.className = 'fa-solid fa-heart';
                btn.classList.add('active');
            }
        });
    });

})();