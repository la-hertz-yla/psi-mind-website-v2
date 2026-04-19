let themeToggleBtn = document.getElementById("theme-toggle");
let icon = document.getElementById("theme-toggle-icon");
let heroTitle = document.querySelector(".hero-content h1");
let heroparagraph = document.querySelector(".hero-content p");
let stats = document.querySelectorAll("#stats div");
let statsparagraphs = document.querySelectorAll("#stats div p");

if (themeToggleBtn) {
    themeToggleBtn.onclick = function () {
        if (icon.classList.contains("fa-sun")) {
            document.body.classList.add("light-theme");
            if (heroTitle) heroTitle.classList.add("text-light");
            if (heroparagraph) heroparagraph.classList.add("text-light");
            statsparagraphs.forEach(p => p.classList.add("stats-text-light"));
            stats.forEach(s => s.classList.add("stats-light"));
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        }
        else {
            document.body.classList.remove("light-theme");
            if (heroTitle) heroTitle.classList.remove("text-light");
            if (heroparagraph) heroparagraph.classList.remove("text-light");
            statsparagraphs.forEach(p => p.classList.remove("stats-text-light"));
            stats.forEach(s => s.classList.remove("stats-light"));
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        }
    };
}

let moreinfo = document.getElementById("more-info");
let btn = document.getElementById("learn-more");
let lessinfos = document.getElementById("less-infos");
let features = document.querySelector(".features");

function savoirplus() {
    if (moreinfo.style.display === "none") {
        moreinfo.style.display = "block";
        btn.textContent = "En savoir moins";
        lessinfos.style.display = "none";
        features.style.display = "none";
    }
    else {
        moreinfo.style.display = "none";
        btn.textContent = "En savoir plus";
        lessinfos.style.display = "block";
        features.style.display = "block";
    }
}

let explorercoursBtn = document.querySelector(".hero-content button");
function explorercours() {
    window.location.href = "index.html#cours";
}

let logo = document.querySelector(".logo");
logo.addEventListener("click", function () {
    window.location.href = "index.html";
});

let infoLink = document.getElementById("info-link");
infoLink.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "index.html#apropos";
});

let questionLink = document.getElementById("question-link");
questionLink.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "whatsapp://send?phone=+212605044759&text=Bonjour%20PSI-MIND%20!%20J'ai%20une%20question%20concernant%20votre%20site.";
});

let callLink = document.getElementById("call-link");
callLink.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "tel:+212605044759";
});

let acceilLink = document.querySelector("a[href='#accueil']");
let aproposLink = document.querySelector("a[href='#apropos']");
let coursLink = document.querySelector("a[href='#cours']");
let contactLink = document.querySelector("a[href='#contact']");

window.addEventListener("scroll", function () {
    const scrollPos = window.scrollY;
    // Simple scroll highlight logic
});
