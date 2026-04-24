document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // 🌐 MOBILE MENU
    // ==================================================
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {
            mobileMenu.classList.toggle("active");
        });

        // fermer menu quand on clique sur un lien
        document.querySelectorAll(".mobile-menu a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
            });
        });
    }

    // ==================================================
    // 🌙 LIGHT / DARK MODE
    // ==================================================
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-toggle-icon");

    if (themeToggleBtn && themeIcon) {
        themeToggleBtn.addEventListener("click", () => {

            document.body.classList.toggle("light-theme");

            if (document.body.classList.contains("light-theme")) {
                themeIcon.classList.remove("fa-sun");
                themeIcon.classList.add("fa-moon");
            } else {
                themeIcon.classList.remove("fa-moon");
                themeIcon.classList.add("fa-sun");
            }
        });
    }

    // ==================================================
    // 🔥 SUPABASE INIT
    // ==================================================
    const SUPABASE_URL = "https://uyhwwqlcophdvjgeucef.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5aHd3cWxjb3BoZHZqZ2V1Y2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDU2NjIsImV4cCI6MjA5MjE4MTY2Mn0.ecDNU4OyjbqP6PFclRzHd7OXGVP1eugGw-29mLdoDXc";

    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    let currentUser = null;

    // ==================================================
    // 👤 LOAD USER PROFILE
    // ==================================================
    async function loadUserProfile() {

        const { data: { user } } = await supabaseClient.auth.getUser();

        if (!user) return;

        currentUser = user;

        const emailInput = document.getElementById("email");
        if (emailInput) emailInput.value = user.email;

        const { data } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (data) {
            document.getElementById("full_name").value = data.full_name || "";
            document.getElementById("filiere").value = data.filiere || "";
            document.getElementById("prepa_name").value = data.prepa_name || "";
            document.getElementById("phone").value = data.phone || "";
        }

        loadFavorites();
    }

    // ==================================================
    // 💾 SAVE PROFILE
    // ==================================================
    const saveBtn = document.getElementById("saveProfile");

    if (saveBtn) {
        saveBtn.addEventListener("click", async () => {

            if (!currentUser) return;

            const updates = {
                id: currentUser.id,
                full_name: document.getElementById("full_name").value,
                filiere: document.getElementById("filiere").value,
                prepa_name: document.getElementById("prepa_name").value,
                phone: document.getElementById("phone").value,
                email: currentUser.email
            };

            await supabaseClient.from("profiles").upsert(updates);

            alert("Profil sauvegardé !");
        });
    }

    // ==================================================
    // ❤️ LOAD FAVORITES
    // ==================================================
    async function loadFavorites() {

        if (!currentUser) return;

        const container = document.getElementById("favoritesList");
        if (!container) return;

        const { data } = await supabaseClient
            .from("favorites")
            .select("*")
            .eq("user_id", currentUser.id);

        container.innerHTML = "";

        if (!data) return;

        data.forEach(item => {

            const div = document.createElement("div");
            div.classList.add("fav-item");

            div.innerHTML = `
                <div>
                    <i class="fa-solid fa-file-pdf"></i>
                    <span>${item.title}</span>
                </div>
                <a href="${item.file_url}" target="_blank">Ouvrir</a>
            `;

            container.appendChild(div);
        });
    }

    // ==================================================
    // ❤️ HEART BUTTON (PDF FAVORITES)
    // ==================================================
    document.addEventListener("click", async (e) => {

        const btn = e.target.closest(".fav-btn");
        if (!btn) return;

        if (!currentUser) {
            alert("Connecte-toi d'abord !");
            return;
        }

        const icon = btn.querySelector("i");
        const title = btn.dataset.title;
        const file = btn.dataset.file;

        const isActive = icon.classList.contains("active-heart");

        icon.classList.toggle("fa-regular");
        icon.classList.toggle("fa-solid");
        icon.classList.toggle("active-heart");

        if (!isActive) {
            // ➜ ADD FAVORITE
            await supabaseClient.from("favorites").insert({
                user_id: currentUser.id,
                title: title,
                file_url: file
            });
        } else {
            // ➜ REMOVE FAVORITE
            await supabaseClient
                .from("favorites")
                .delete()
                .eq("user_id", currentUser.id)
                .eq("title", title);
        }

        loadFavorites();
    });

    // ==================================================
    // 🚀 INIT
    // ==================================================
    loadUserProfile();

});