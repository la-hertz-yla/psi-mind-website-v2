let themeToggleBtn=document.getElementById("theme-toggle"); 
let icon=document.getElementById("theme-toggle-icon");
let themeText=document.getElementById("theme-text");
let pageTag=document.querySelector(".page-tag");
let pagdiverd=document.querySelector(".divider");
let pageText=document.querySelector(".page-text");
themeToggleBtn.onclick=function(){
    if(icon.classList.contains("fa-sun")){
        document.body.classList.add("light-theme");
        pageTag.style.color="#000000";
        pagdiverd.style.background=" #fafafa61";
        pageText.style.color="#000000";
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        themeText.textContent = "Dark Mode";
    }
    else{
        document.body.classList.remove("light-theme");
        pageTag.style.color="#fff";
        pagdiverd.style.background="transparent";
        pageText.style.color="#fff";
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

let accueil=document.querySelector("a[href='#accueil']");
let apropos=document.querySelector("a[href='#apropos']");
let cours=document.querySelector("a[href='#cours']");
let contact=document.querySelector("a[href='#contact']");

accueil.addEventListener("click", function(e){
    e.preventDefault();
    window.location.href="index.html";
}
);

apropos.addEventListener("click", function(e){
    e.preventDefault();
    window.location.href="index.html#apropos";
});

cours.addEventListener("click", function(e){
    e.preventDefault();
    window.location.href="index.html#cours";
});

contact.addEventListener("click", function(e){
    e.preventDefault();
    window.location.href="index.html#contact";
});