let menuBtn = document.querySelector(".menu-btn");
let navLinks = document.querySelector(".nav-links");

if(menuBtn){
    menuBtn.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
}