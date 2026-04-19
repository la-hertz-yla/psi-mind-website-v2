let themeToggleBtn=document.getElementById("theme-toggle"); 
let icon=document.getElementById("theme-toggle-icon");
let themeText=document.getElementById("theme-text");
let heroTitle=document.querySelector(".hero-content h1");
let heroparagraph=document.querySelector(".hero-content p");
let stats=document.querySelectorAll("#stats div");
let statsparagraphs=document.querySelectorAll("#stats div p");
themeToggleBtn.onclick=function(){
    if(icon.classList.contains("fa-sun")){
        document.body.classList.add("light-theme");
        heroTitle.classList.add("text-light");
        heroparagraph.classList.add("text-light");
        statsparagraphs[0].classList.add("stats-text-light");
        statsparagraphs[1].classList.add("stats-text-light");
        statsparagraphs[2].classList.add("stats-text-light");
        stats[0].classList.add("stats-light");
        stats[1].classList.add("stats-light");
        stats[2].classList.add("stats-light");
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        themeText.textContent = "Dark Mode";
    }
    else{
        document.body.classList.remove("light-theme");
        heroTitle.classList.remove("text-light");
        heroparagraph.classList.remove("text-light");
        statsparagraphs[0].classList.remove("stats-text-light");
        statsparagraphs[1].classList.remove("stats-text-light");
        statsparagraphs[2].classList.remove("stats-text-light");
        stats[0].classList.remove("stats-light");
        stats[1].classList.remove("stats-light");
        stats[2].classList.remove("stats-light");   
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
        themeText.textContent = "Light Mode";
    }
};

let moreinfo=document.getElementById("more-info");
let btn=document.getElementById("learn-more");
let lessinfos=document.getElementById("less-infos");
let features=document.querySelector(".features");
function savoirplus(){
    if(moreinfo.style.display==="none"){
        moreinfo.style.display="block";
        btn.textContent="En savoir moins";
        lessinfos.style.display="none";
        features.style.display="none";
    }
    else{
        moreinfo.style.display="none";
        btn.textContent="En savoir plus";
        lessinfos.style.display="block";
        features.style.display="block";
    }
}

let images=['img/chatimg1.png','img/chatimg2.png','img/chatimg3.png'];   
let photo=document.getElementById("photo");
function changeimage(){
    photo.src=images[Math.floor(Math.random() * images.length)];
    photo.style.cssText="transition: all 3s ease-in-out;";
}
setInterval(() => {
  changeimage();
}, 4000);

function explorercours(){
    window.location.href="cours.html";
}

let menuToggle=document.getElementById("menu-toggle");
let nav=document.querySelector(".mobile-menu");

menuToggle.onclick=function(){
    nav.classList.toggle("active");
};    

menuToggle.addEventListener("mouseenter", function() {
    nav.classList.add("active");
});

nav.addEventListener("mouseleave", function() {
    nav.classList.remove("active");
});

let menuItems=document.querySelectorAll(".mobile-menu ul li a");
menuItems.forEach(item => {
    item.addEventListener("click", () => {
        nav.classList.remove("active");
    });
});

let emailLink=document.getElementById("email-link");
emailLink.addEventListener("click", function(e){
    e.preventDefault();
    window.location.href="mailto:lailareda269@gmail.com";
});
let infoLink=document.getElementById("info-link");
infoLink.addEventListener("click", function(e){
    e.preventDefault();
    window.location.href="index.html#apropos";
});

let questionLink=document.getElementById("question-link");
questionLink.addEventListener("click", function(e){
    e.preventDefault();
    window.location.href="whatsapp://send?phone=+212605044759&text=Bonjour%20PSI-MIND%20!%20J'ai%20une%20question%20concernant%20votre%20site.";
});
let callLink=document.getElementById("call-link");
callLink.addEventListener("click", function(e){
    e.preventDefault();
    window.location.href="tel:+212605044759";
});

acceilLink=document.querySelector("a[href='#accueil']");
aproposLink=document.querySelector("a[href='#apropos']");
coursLink=document.querySelector("a[href='#cours']");
contactLink=document.querySelector("a[href='#contact']");
window.addEventListener("scroll", function(){
    if (this.window.location=="index.html#accueil"){
        acceilLink.style.textDecoration="underline";
    }
    else if (this.window.location=="index.html#apropos"){
        aproposLink.style.textDecoration="underline";
    }
    else if (this.window.location=="index.html#cours"){
        coursLink.style.textDecoration="underline";
    }
    else if (this.window.location=="index.html#contact"){
        contactLink.style.textDecoration="underline";
    }
});
