// =========================
// PORTFOLIO NAVIGATION
// =========================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");

menuToggle?.addEventListener("click", () => navLinks?.classList.toggle("show"));

const navItems = Array.from(document.querySelectorAll(".nav-links a"));

function setActiveNav(sectionId) {
    navItems.forEach(item => {
        item.classList.toggle("active", item.getAttribute("href") === `#${sectionId}`);
    });
}

navItems.forEach(link => {
    link.addEventListener("click", () => {
        navLinks?.classList.remove("show");
        const targetId = link.getAttribute("href")?.replace("#", "");
        if (targetId) setActiveNav(targetId);
    });
});

const navSections = navItems
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

// Update the highlighted navigation item automatically while scrolling.
// The section whose top is closest to the upper-middle of the viewport becomes active.
// This avoids overlapping IntersectionObserver entries selecting the wrong tab.
let navTicking = false;

function updateActiveNavOnScroll() {
    if (navTicking) return;

    navTicking = true;
    requestAnimationFrame(() => {
        const marker = window.scrollY + window.innerHeight * 0.35;
        let activeSection = navSections[0];

        navSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;

            if (sectionTop <= marker) {
                activeSection = section;
            }
        });

        if (activeSection) {
            setActiveNav(activeSection.id);
        }

        navTicking = false;
    });
}

if (navSections.length) {
    window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });
    window.addEventListener('resize', updateActiveNavOnScroll);

    // Make sure the correct tab is selected when the page first loads.
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash && navSections.some(section => section.id === currentHash)) {
        setActiveNav(currentHash);
    } else {
        updateActiveNavOnScroll();
    }
}

// =========================
// DARK / LIGHT MODE
// =========================
if (themeToggle) {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeToggle.textContent = "☾";
    } else {
        themeToggle.textContent = "☀";
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        const isLight = document.body.classList.contains("light-mode");
        themeToggle.textContent = isLight ? "☾" : "☀";
        localStorage.setItem("theme", isLight ? "light" : "dark");
    });
}

// =========================
// TYPING EFFECT
// =========================
const typingText = document.getElementById("typing-text");
if (typingText) {
    const words = ["Programmer", "Developer", "IT Student"];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {
        const word = words[wordIndex];
        typingText.textContent = word.substring(0, deleting ? charIndex - 1 : charIndex + 1);
        if (!deleting) {
            charIndex++;
            if (charIndex === word.length) {
                deleting = true;
                setTimeout(typeEffect, 1500);
                return;
            }
        } else {
            charIndex--;
            if (charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
        }
        setTimeout(typeEffect, deleting ? 60 : 100);
    }
    typeEffect();
}

// =========================
// CONTACT FORM
// =========================
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("form-message");
contactForm?.addEventListener("submit", event => {
    event.preventDefault();
    if (formMessage) formMessage.textContent = "Thank you! Your message has been received.";
    contactForm.reset();
});

// =========================
// PORTFOLIO LOADING INTRO
// =========================
const loader = document.getElementById("loader");
const loaderPercentage = document.getElementById("loader-percentage");
const loaderProgressBar = document.getElementById("loader-progress-bar");
const homeSection = document.getElementById("home");
let progress = 0;

function loadPortfolio() {
    progress++;
    if (loaderPercentage) loaderPercentage.textContent = progress + "%";
    if (loaderProgressBar) loaderProgressBar.style.width = progress + "%";
    if (progress < 100) {
        setTimeout(loadPortfolio, 25);
    } else {
        setTimeout(() => {
            homeSection?.classList.add("loaded");
            loader?.classList.add("hide");
        }, 500);
    }
}
window.addEventListener("load", loadPortfolio);

// =========================
// CERTIFICATION DEPTH CAROUSEL
// Robust vanilla JavaScript version.
// Requires GSAP to be loaded before this script.
// =========================
const carousel = document.getElementById("certificateCarousel");

if (carousel && typeof gsap !== "undefined") {
    const cards = [...carousel.querySelectorAll(".depth-carousel__card")];
    const prev = carousel.querySelector(".depth-carousel__arrow--prev");
    const next = carousel.querySelector(".depth-carousel__arrow--next");
    const dots = [...carousel.querySelectorAll(".depth-carousel__dot")];
    const count = cards.length;

    const cfg = {
        depth: 220,
        spread: 90,
        tilt: 22,
        visibleCards: 4,
        falloff: 0.2,
        blur: 6,
        duration: 0.7,
        autoplayDelay: 3200
    };

    let position = 0;
    let active = 0;
    let tween = null;
    let autoTimer = null;
    let paused = false;
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startPosition = 0;
    let wheelTimer = null;

    const normalize = index => ((index % count) + count) % count;

    function layout(pos) {
        cards.forEach((card, i) => {
            let d = i - pos;

            if (count > 1) {
                d = ((d % count) + count) % count;
                if (d > count / 2) d -= count;
            }

            const back = Math.max(0, d);
            const shown = Math.abs(d) <= cfg.visibleCards + 0.5;
            const opacity = shown ? (d < 0 ? Math.max(0, 1 + d) : 1) : 0;
            const brightness = Math.max(0.15, 1 - back * cfg.falloff);
            const blur = Math.min(cfg.blur, (back / Math.max(1, cfg.visibleCards)) * cfg.blur);

            card.style.transform =
                `translate(-50%, -50%) translateX(${cfg.spread * d}px) ` +
                `translateZ(${-cfg.depth * d}px) rotateY(${cfg.tilt * Math.max(0, Math.min(d, 1))}deg)`;
            card.style.opacity = opacity.toFixed(3);
            card.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(2)}px)`;
            card.style.zIndex = String(2000 - Math.round(d * 20));
            card.style.pointerEvents = shown && opacity > 0.05 ? "auto" : "none";
        });
    }

    const caption = document.getElementById("certificateCaption");

    function updateDots(index) {
        dots.forEach((dot, i) => {
            const selected = i === index;
            dot.classList.toggle("is-active", selected);
            dot.setAttribute("aria-selected", selected ? "true" : "false");
        });
    }

    function updateCaption(index) {
        if (!caption || !cards[index]) return;
        const title = cards[index].dataset.title || "Certificate";
        const description = cards[index].dataset.description || "";
        const detail = cards[index].dataset.detail || "";
        caption.innerHTML = `<strong>${title}</strong><span>${description}<br>${detail}</span>`;
    }

    function goTo(index, animate = true) {
        if (!count) return;

        const target = normalize(index);
        let delta = target - active;

        if (count > 1) {
            if (delta > count / 2) delta -= count;
            if (delta < -count / 2) delta += count;
        }

        tween?.kill();
        const proxy = { p: position };

        tween = gsap.to(proxy, {
            p: position + delta,
            duration: animate ? cfg.duration : 0,
            ease: "power3.out",
            overwrite: true,
            onUpdate: () => {
                position = proxy.p;
                layout(position);
            },
            onComplete: () => {
                position = target;
                layout(position);
            }
        });

        active = target;
        updateDots(active);
        updateCaption(active);
    }

    function previous(event) {
        event?.preventDefault();
        event?.stopPropagation();
        paused = true;
        goTo(active - 1);
        restartAutoplay();
    }

    function following(event) {
        event?.preventDefault();
        event?.stopPropagation();
        paused = true;
        goTo(active + 1);
        restartAutoplay();
    }

    // Buttons are explicitly isolated from drag handling.
    prev?.addEventListener("pointerdown", event => event.stopPropagation());
    next?.addEventListener("pointerdown", event => event.stopPropagation());
    prev?.addEventListener("click", previous);
    next?.addEventListener("click", following);

    dots.forEach((dot, i) => {
        dot.addEventListener("pointerdown", event => event.stopPropagation());
        dot.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            goTo(i);
            paused = true;
            restartAutoplay();
        });
    });

    // Keyboard navigation.
    carousel.addEventListener("keydown", event => {
        if (event.key === "ArrowLeft") previous(event);
        if (event.key === "ArrowRight") following(event);
    });

    // Drag / swipe navigation.
    carousel.addEventListener("pointerdown", event => {
        if (event.target.closest("button, a")) return;

        dragging = true;
        moved = false;
        startX = event.clientX;
        startPosition = position;
        paused = true;
        tween?.kill();
        carousel.setPointerCapture?.(event.pointerId);
    });

    carousel.addEventListener("pointermove", event => {
        if (!dragging) return;

        const dx = event.clientX - startX;
        if (Math.abs(dx) > 6) moved = true;
        if (!moved) return;

        const step = Math.max(carousel.clientWidth * 0.35, 100);
        position = startPosition - dx / step;
        layout(position);
    });

    function finishDrag(event) {
        if (!dragging) return;

        dragging = false;
        carousel.releasePointerCapture?.(event?.pointerId);

        if (moved) {
            goTo(Math.round(position));
        }

        restartAutoplay();
    }

    carousel.addEventListener("pointerup", finishDrag);
    carousel.addEventListener("pointercancel", finishDrag);
    carousel.addEventListener("lostpointercapture", () => {
        dragging = false;
    });

    // IMPORTANT: do not hijack the mouse wheel.
    // Normal page scrolling now works over the certification section.
    // The carousel changes only with arrows, dots, keyboard, or drag/swipe.

    function startAutoplay() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => {
            if (!paused && !dragging) goTo(active + 1);
        }, cfg.autoplayDelay);
    }

    function restartAutoplay() {
        clearInterval(autoTimer);
        startAutoplay();
        setTimeout(() => {
            paused = false;
        }, 800);
    }

    carousel.addEventListener("mouseenter", () => { paused = true; });
    carousel.addEventListener("mouseleave", () => { paused = false; });
    carousel.addEventListener("focusin", () => { paused = true; });
    carousel.addEventListener("focusout", () => { paused = false; });

    updateDots(0);
    updateCaption(0);
    layout(0);
    startAutoplay();

    window.addEventListener("beforeunload", () => {
        clearInterval(autoTimer);
        clearTimeout(wheelTimer);
        tween?.kill();
    });
}


// =========================
// CERTIFICATE IMAGE LIGHTBOX
// Click any certificate image to view it at full size.
// =========================
const certificateLightbox = document.getElementById("certificateLightbox");
const certificateLightboxImage = document.getElementById("certificateLightboxImage");
const certificateLightboxClose = document.getElementById("certificateLightboxClose");
const certificateLightboxBackdrop = document.getElementById("certificateLightboxBackdrop");

function openCertificateLightbox(button) {
    const image = button?.querySelector("img");
    if (!image || !certificateLightbox || !certificateLightboxImage) return;

    certificateLightboxImage.src = image.currentSrc || image.src;
    certificateLightboxImage.alt = image.alt || "Certificate full-size preview";
    certificateLightbox.classList.add("is-open");
    certificateLightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("certificate-lightbox-open");
    certificateLightboxClose?.focus();
}

function closeCertificateLightbox() {
    if (!certificateLightbox) return;
    certificateLightbox.classList.remove("is-open");
    certificateLightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("certificate-lightbox-open");
    if (certificateLightboxImage) certificateLightboxImage.src = "";
}

document.querySelectorAll(".certificate-image-button").forEach(button => {
    button.addEventListener("pointerdown", event => event.stopPropagation());
    button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        openCertificateLightbox(button);
    });
});

certificateLightboxClose?.addEventListener("click", closeCertificateLightbox);
certificateLightboxBackdrop?.addEventListener("click", closeCertificateLightbox);

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && certificateLightbox?.classList.contains("is-open")) {
        closeCertificateLightbox();
    }
});
