// =========================
// PILL NAVIGATION
// Vanilla JavaScript adaptation of the React Bits PillNav interaction.
// Uses the GSAP library already loaded by index.html.
// =========================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const mobileNavMenu = document.getElementById("mobileNavMenu");
const themeToggle = document.getElementById("themeToggle");
const navItems = Array.from(document.querySelectorAll(".pill-list .pill"));
const mobileNavItems = Array.from(document.querySelectorAll(".mobile-menu-link"));
const navSections = navItems
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

function setActiveNav(sectionId) {
    navItems.forEach(item => {
        item.classList.toggle("is-active", item.dataset.section === sectionId);
    });

    mobileNavItems.forEach(item => {
        item.classList.toggle("is-active", item.getAttribute("href") === `#${sectionId}`);
    });
}

function closeMobileNav() {
    if (!mobileNavMenu || !menuToggle) return;
    mobileNavMenu.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");

    const lines = menuToggle.querySelectorAll(".hamburger-line");
    if (typeof gsap !== "undefined") {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.25, ease: "power2.out" });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.25, ease: "power2.out" });
    }
}

function toggleMobileNav() {
    if (!mobileNavMenu || !menuToggle) return;
    const opening = !mobileNavMenu.classList.contains("show");
    mobileNavMenu.classList.toggle("show", opening);
    menuToggle.setAttribute("aria-expanded", String(opening));

    const lines = menuToggle.querySelectorAll(".hamburger-line");
    if (typeof gsap !== "undefined") {
        if (opening) {
            gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.25, ease: "power2.out" });
            gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.25, ease: "power2.out" });
        } else {
            gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.25, ease: "power2.out" });
            gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.25, ease: "power2.out" });
        }
    }
}

menuToggle?.addEventListener("click", toggleMobileNav);

function setupPillNav() {
    if (typeof gsap === "undefined") return;

    const circles = navItems.map(item => item.querySelector(".hover-circle"));

    function layout() {
        circles.forEach((circle, index) => {
            if (!circle) return;
            const pill = circle.parentElement;
            const rect = pill.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            const R = ((w * w) / 4 + h * h) / (2 * h);
            const D = Math.ceil(2 * R) + 2;
            const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
            const originY = D - delta;

            gsap.set(circle, {
                width: D,
                height: D,
                bottom: -delta,
                xPercent: -50,
                scale: 0,
                transformOrigin: `50% ${originY}px`
            });

            const label = pill.querySelector(".pill-label");
            const hoverLabel = pill.querySelector(".pill-label-hover");
            if (label) gsap.set(label, { y: 0 });
            if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });

            const tl = gsap.timeline({ paused: true });
            tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.45, ease: "power3.out", overwrite: "auto" }, 0);
            if (label) {
                tl.to(label, { y: -(h + 8), duration: 0.45, ease: "power3.out", overwrite: "auto" }, 0);
            }
            if (hoverLabel) {
                tl.to(hoverLabel, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", overwrite: "auto" }, 0);
            }

            pill._hoverTimeline?.kill();
            pill._hoverTimeline = tl;
        });
    }

    layout();
    window.addEventListener("resize", layout);
    document.fonts?.ready?.then(layout).catch(() => {});

    navItems.forEach((pill) => {
        pill.addEventListener("mouseenter", () => {
            pill._hoverTween?.kill();
            if (pill._hoverTimeline) {
                pill._hoverTween = pill._hoverTimeline.tweenTo(pill._hoverTimeline.duration(), {
                    duration: 0.25,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
        });

        pill.addEventListener("mouseleave", () => {
            pill._hoverTween?.kill();
            if (pill._hoverTimeline) {
                pill._hoverTween = pill._hoverTimeline.tweenTo(0, {
                    duration: 0.2,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
        });
    });

    const logo = document.querySelector(".pill-logo img");
    const logoLink = document.querySelector(".pill-logo");
    logoLink?.addEventListener("mouseenter", () => {
        if (!logo) return;
        gsap.killTweensOf(logo);
        gsap.fromTo(logo, { rotate: 0 }, { rotate: 360, duration: 0.45, ease: "power2.out" });
    });

    const pillNav = document.querySelector(".pill-nav");
    const pillItems = document.getElementById("pillNavItems");
    if (pillNav && pillItems) {
        gsap.fromTo(pillNav, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
        gsap.fromTo(pillItems, { width: 0, opacity: 0 }, { width: "auto", opacity: 1, duration: 0.6, ease: "power3.out" });
    }
}

navItems.forEach(link => {
    link.addEventListener("click", () => {
        const targetId = link.getAttribute("href")?.replace("#", "");
        if (targetId) setActiveNav(targetId);
        closeMobileNav();
    });
});

mobileNavItems.forEach(link => {
    link.addEventListener("click", () => {
        const targetId = link.getAttribute("href")?.replace("#", "");
        if (targetId) setActiveNav(targetId);
        closeMobileNav();
    });
});

let navTicking = false;
function updateActiveNavOnScroll() {
    if (navTicking) return;
    navTicking = true;

    requestAnimationFrame(() => {
        const marker = window.scrollY + window.innerHeight * 0.35;
        let activeSection = null;

        navSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            if (sectionTop <= marker) activeSection = section;
        });

        if (activeSection) {
            setActiveNav(activeSection.id);
        } else {
            navItems.forEach(item => item.classList.remove("is-active"));
            mobileNavItems.forEach(item => item.classList.remove("is-active"));
        }
        navTicking = false;
    });
}

if (navSections.length) {
    window.addEventListener("scroll", updateActiveNavOnScroll, { passive: true });
    window.addEventListener("resize", updateActiveNavOnScroll);

    const currentHash = window.location.hash.replace("#", "");
    if (currentHash && navSections.some(section => section.id === currentHash)) {
        setActiveNav(currentHash);
    } else {
        updateActiveNavOnScroll();
    }
}

setupPillNav();

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


// =========================
// PROFILE CARD
// Vanilla JavaScript adaptation of the React Bits ProfileCard interaction.
// =========================
(() => {
    const wrapper = document.getElementById("profileCard");
    if (!wrapper) return;

    const shell = wrapper.querySelector(".pc-card-shell");
    const card = wrapper.querySelector(".pc-card");
    if (!shell || !card) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const enableTilt = !reduceMotion;

    const clamp = (value, min = 0, max = 100) =>
        Math.min(Math.max(value, min), max);

    const setVarsFromXY = (x, y) => {
        const width = shell.clientWidth || 1;
        const height = shell.clientHeight || 1;

        const percentX = clamp((100 / width) * x);
        const percentY = clamp((100 / height) * y);

        const centerX = percentX - 50;
        const centerY = percentY - 50;

        wrapper.style.setProperty("--pointer-x", `${percentX}%`);
        wrapper.style.setProperty("--pointer-y", `${percentY}%`);
        wrapper.style.setProperty(
            "--background-x",
            `${35 + (percentX * 30) / 100}%`
        );
        wrapper.style.setProperty(
            "--background-y",
            `${35 + (percentY * 30) / 100}%`
        );
        wrapper.style.setProperty(
            "--pointer-from-center",
            `${clamp(Math.hypot(centerX, centerY) / 50, 0, 1)}`
        );
        wrapper.style.setProperty("--pointer-from-top", `${percentY / 100}`);
        wrapper.style.setProperty("--pointer-from-left", `${percentX / 100}`);
        wrapper.style.setProperty(
            "--rotate-x",
            `${(-centerX / 5).toFixed(3)}deg`
        );
        wrapper.style.setProperty(
            "--rotate-y",
            `${(centerY / 4).toFixed(3)}deg`
        );
    };

    let rafId = null;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastTime = 0;
    let active = false;
    let initialUntil = performance.now() + 900;

    const animate = (timestamp) => {
        if (!active) {
            rafId = null;
            lastTime = 0;
            return;
        }

        if (!lastTime) lastTime = timestamp;

        const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
        lastTime = timestamp;

        const tau = timestamp < initialUntil ? 0.42 : 0.12;
        const k = 1 - Math.exp(-dt / tau);

        currentX += (targetX - currentX) * k;
        currentY += (targetY - currentY) * k;

        setVarsFromXY(currentX, currentY);

        const far =
            Math.abs(targetX - currentX) > 0.05 ||
            Math.abs(targetY - currentY) > 0.05;

        if (far || wrapper.matches(":hover")) {
            rafId = requestAnimationFrame(animate);
        } else {
            active = false;
            rafId = null;
            lastTime = 0;
        }
    };

    const startAnimation = () => {
        if (active || !enableTilt) return;
        active = true;
        rafId = requestAnimationFrame(animate);
    };

    const setTarget = (x, y) => {
        targetX = x;
        targetY = y;
        startAnimation();
    };

    const center = () => {
        setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
    };

    if (enableTilt) {
        wrapper.addEventListener("pointerenter", event => {
            wrapper.classList.add("active", "entering");
            window.clearTimeout(wrapper._enterTimer);

            wrapper._enterTimer = window.setTimeout(() => {
                wrapper.classList.remove("entering");
            }, 180);

            const rect = shell.getBoundingClientRect();
            setTarget(event.clientX - rect.left, event.clientY - rect.top);
        });

        wrapper.addEventListener("pointermove", event => {
            const rect = shell.getBoundingClientRect();
            setTarget(event.clientX - rect.left, event.clientY - rect.top);
        });

        wrapper.addEventListener("pointerleave", () => {
            center();

            const settle = () => {
                const distance = Math.hypot(
                    targetX - currentX,
                    targetY - currentY
                );

                if (distance < 0.6) {
                    wrapper.classList.remove("active");
                    return;
                }

                requestAnimationFrame(settle);
            };

            requestAnimationFrame(settle);
        });

        const initialX = Math.max((shell.clientWidth || 0) - 70, 0);
        const initialY = 60;

        currentX = initialX;
        currentY = initialY;
        targetX = shell.clientWidth / 2;
        targetY = shell.clientHeight / 2;
        setVarsFromXY(currentX, currentY);
        startAnimation();
    } else {
        setVarsFromXY(
            shell.clientWidth / 2,
            shell.clientHeight / 2
        );
    }

    window.addEventListener("resize", () => {
        if (!wrapper.matches(":hover")) {
            setVarsFromXY(
                shell.clientWidth / 2,
                shell.clientHeight / 2
            );
        }
    });
})();
