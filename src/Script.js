// =========================
// PORTFOLIO LOADING INTRO
// =========================

const loader =
    document.getElementById("loader");

const loaderPercentage =
    document.getElementById("loader-percentage");

const loaderProgressBar =
    document.getElementById("loader-progress-bar");

const homeSection =
    document.getElementById("home");

let progress = 0;

function loadPortfolio() {

    const loadingSpeed = 25;

    const loadingInterval =
        setInterval(() => {

            progress++;

            loaderPercentage.textContent =
                progress;

            loaderProgressBar.style.width =
                progress + "%";


            if (progress >= 100) {

                clearInterval(loadingInterval);

                // Small pause after reaching 100%
                setTimeout(() => {

                    // Start Home section animation
                    homeSection.classList.add("loaded");

                    // Fade out loader
                    loader.classList.add("hide");

                }, 500);

            }

        }, loadingSpeed);
}


// Start loading when page is ready
window.addEventListener("load", () => {

    loadPortfolio();

});
const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");

const themeToggle =
    document.getElementById("themeToggle");


menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("show");

});


document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("show");

        });

    });


const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "light") {

    document.body.classList.add("light-mode");

    themeToggle.textContent = "☾";

} else {

    themeToggle.textContent = "☀";

}


themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    const isLight =
        document.body.classList.contains("light-mode");


    if (isLight) {

        themeToggle.textContent = "☾";

        localStorage.setItem(
            "theme",
            "light"
        );

    } else {

        themeToggle.textContent = "☀";

        localStorage.setItem(
            "theme",
            "dark"
        );

    }

});


const typingText =
    document.getElementById("typing-text");


const roles = [
    "Programmer",
    "Web Developer",
    "UI/UX Designer",
    "Student",
    "Problem Solver"
];


let roleIndex = 0;
let characterIndex = 0;
let deleting = false;


function typeEffect() {

    const currentRole =
        roles[roleIndex];


    if (!deleting) {

        typingText.textContent =
            currentRole.substring(
                0,
                characterIndex + 1
            );

        characterIndex++;


        if (
            characterIndex ===
            currentRole.length
        ) {

            deleting = true;

            setTimeout(
                typeEffect,
                1500
            );

            return;

        }

    } else {

        typingText.textContent =
            currentRole.substring(
                0,
                characterIndex - 1
            );

        characterIndex--;


        if (characterIndex === 0) {

            deleting = false;

            roleIndex++;


            if (
                roleIndex ===
                roles.length
            ) {

                roleIndex = 0;

            }

        }

    }


    setTimeout(
        typeEffect,
        deleting ? 50 : 100
    );

}


typeEffect();


const contactForm =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("form-message");


contactForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        formMessage.textContent =
            "Thanks! Your message has been received.";

        contactForm.reset();

        setTimeout(() => {

            formMessage.textContent = "";

        }, 5000);

    }
);


const sections =
    document.querySelectorAll("section");

const navItems =
    document.querySelectorAll(
        ".nav-links a"
    );


window.addEventListener(
    "scroll",
    () => {

        let current = "";


        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 150;


            if (
                window.scrollY >=
                sectionTop
            ) {

                current =
                    section.getAttribute("id");

            }

        });


        navItems.forEach(link => {

            link.classList.remove("active");


            if (
                link.getAttribute("href") ===
                "#" + current
            ) {

                link.classList.add("active");

            }

        });

    }
);
