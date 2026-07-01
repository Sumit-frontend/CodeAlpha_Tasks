let choices = document.querySelectorAll(".choice");
let galleries = document.querySelectorAll(".gallery");
let menuBtn = document.querySelector(".menu-btn");
let navLinks = document.querySelector(".nav-links");

choices.forEach(function(choice){

    choice.addEventListener("click", function(){

        // Remove active class from all buttons
        choices.forEach(function(btn){
            btn.classList.remove("active");
        });

        // Add active class to clicked button
        choice.classList.add("active");

        // Hide all galleries
        galleries.forEach(function(gallery)
        {
            gallery.classList.remove("active-gallery");
        });

        // Get target gallery
        let target = choice.getAttribute("data-target");

        // Show selected gallery
        document.getElementById(target)
                .classList.add("active-gallery");

    });

});
menuBtn.addEventListener("click", function () {
    navLinks.classList.toggle("active");
});

const allGallery = document.getElementById("all");

const natureCards =
    document.querySelectorAll("#nature .card");

const travelCards =
    document.querySelectorAll("#travel .card");

const animalCards =
    document.querySelectorAll("#animals .card");

const allCards = [
    ...natureCards,
    ...travelCards,
    ...animalCards
];

allCards.forEach(card => {
    allGallery.appendChild(card.cloneNode(true));
});
