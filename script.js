
/* =========================================
   DT DIGITAL — INTERACTIVE EXPERIENCE
   Version 1.0
========================================= */

"use strict";

/* =========================================
   ELEMENTS
========================================= */

const loader = document.getElementById("loader");
const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");
const backToTop = document.getElementById("backToTop");

const characterScene = document.getElementById("characterScene");
const character = document.getElementById("character");

const yearElement = document.getElementById("currentYear");

/* =========================================
   LOADING SCREEN
========================================= */

window.addEventListener("load", () => {
    setTimeout(() => {
        loader?.classList.add("hidden");
        document.body.classList.add("loaded");
    }, 700);
});

/* =========================================
   CURRENT YEAR
========================================= */

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

/* =========================================
   MOBILE NAVIGATION
========================================= */

if (menuToggle && navigation) {

    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("active");

        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {
            navigation.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });

    });

    document.addEventListener("click", event => {

        if (
            !navigation.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            navigation.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        }

    });

}

/* =========================================
   HEADER SCROLL EFFECT
========================================= */

let lastScroll = 0;

window.addEventListener("scroll", () => {

    const currentScroll = window.scrollY;

    if (header) {
        header.classList.toggle("scrolled", currentScroll > 50);
    }

    if (backToTop) {
        backToTop.classList.toggle("visible", currentScroll > 500);
    }

    lastScroll = currentScroll;

}, { passive: true });

/* =========================================
   BACK TO TOP
========================================= */

if (backToTop) {

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

/* =========================================
   SCROLL REVEAL ANIMATIONS
========================================= */

const revealElements = document.querySelectorAll(
    ".section-heading, .service-card, .project-card, .about-content, .about-visual, .contact-box, .partnership-panel"
);

revealElements.forEach(element => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity .8s ease, transform .8s ease";
});

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

} else {

    revealElements.forEach(element => {
        element.style.opacity = "1";
        element.style.transform = "none";
    });

}

/* =========================================
   3D MOUSE PARALLAX
========================================= */

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const hasFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;

let mouseX = 0;
let mouseY = 0;

let currentX = 0;
let currentY = 0;

let animationFrame = null;

if (hasFinePointer && !prefersReducedMotion) {

    window.addEventListener("pointermove", event => {

        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;

    }, { passive: true });

    function animateParallax() {

        currentX += (mouseX - currentX) * 0.035;
        currentY += (mouseY - currentY) * 0.035;

        const x = currentX;
        const y = currentY;

        if (character) {

            character.style.transform = `
                translate3d(${x * 12}px, ${y * 8}px, 0)
                rotateY(${x * 5}deg)
                rotateX(${-y * 3}deg)
            `;

        }

        if (characterScene) {

            characterScene.style.transform = `
                translate3d(${x * -5}px, ${y * -4}px, 0)
            `;

        }

        const visual = document.querySelector(".hero-visual");

        if (visual) {

            visual.style.transform = `
                perspective(1000px)
                rotateY(${x * 4}deg)
                rotateX(${-y * 3}deg)
            `;

        }

        animationFrame = requestAnimationFrame(animateParallax);

    }

    animateParallax();

}

/* =========================================
   MOBILE TILT
========================================= */

if (!hasFinePointer && !prefersReducedMotion) {

    const heroVisual = document.querySelector(".hero-visual");

    if (heroVisual) {

        let touchTimer;

        heroVisual.addEventListener("touchmove", event => {

            const touch = event.touches[0];
            const rect = heroVisual.getBoundingClientRect();

            const x = (touch.clientX - rect.left) / rect.width - 0.5;
            const y = (touch.clientY - rect.top) / rect.height - 0.5;

            heroVisual.style.transform = `
                perspective(900px)
                rotateY(${x * 8}deg)
                rotateX(${-y * 8}deg)
            `;

            clearTimeout(touchTimer);

            touchTimer = setTimeout(() => {
                heroVisual.style.transform = "";
            }, 350);

        }, { passive: true });

    }

}

/* =========================================
   3D SERVICE CARDS
========================================= */

if (hasFinePointer && !prefersReducedMotion) {

    const cards = document.querySelectorAll(".service-card");

    cards.forEach(card => {

        card.addEventListener("pointermove", event => {

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateY = ((x - centerX) / centerX) * 4;
            const rotateX = ((centerY - y) / centerY) * 4;

            card.style.transform = `
                perspective(900px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-8px)
            `;

        });

        card.addEventListener("pointerleave", () => {

            card.style.transform = "";

        });

    });

}

/* =========================================
   PROJECT CARD MOUSE EFFECT
========================================= */

if (hasFinePointer && !prefersReducedMotion) {

    document.querySelectorAll(".project-card").forEach(card => {

        card.addEventListener("pointermove", event => {

            const rect = card.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            card.style.transform = `
                perspective(1000px)
                rotateY(${(x - .5) * 5}deg)
                rotateX(${(.5 - y) * 4}deg)
                translateY(-5px)
            `;

        });

        card.addEventListener("pointerleave", () => {
            card.style.transform = "";
        });

    });

}

/* =========================================
   ACTIVE NAVIGATION
========================================= */

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".navigation a");

if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                navLinks.forEach(link => {

                    const active = link.getAttribute("href") ===
                        `#${entry.target.id}`;

                    link.classList.toggle("active", active);

                });

            }

        });

    }, {
        rootMargin: "-35% 0px -55% 0px"
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

}

/* =========================================
   BUTTON RIPPLE EFFECT
========================================= */

document.querySelectorAll(".btn-primary, .btn-secondary, .instagram-button").forEach(button => {

    button.addEventListener("pointerdown", event => {

        if (event.pointerType === "touch") return;

        const rect = button.getBoundingClientRect();

        const ripple = document.createElement("span");

        ripple.style.position = "absolute";
        ripple.style.width = "8px";
        ripple.style.height = "8px";
        ripple.style.borderRadius = "50%";
        ripple.style.background = "rgba(255,255,255,.3)";
        ripple.style.pointerEvents = "none";
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        ripple.style.transform = "translate(-50%, -50%) scale(1)";
        ripple.style.transition = "transform .5s ease, opacity .5s ease";

        button.style.position = "relative";
        button.style.overflow = "hidden";

        button.appendChild(ripple);

        requestAnimationFrame(() => {
            ripple.style.transform = "translate(-50%, -50%) scale(15)";
            ripple.style.opacity = "0";
        });

        setTimeout(() => {
            ripple.remove();
        }, 550);

    });

});

/* =========================================
   PAGE VISIBILITY PERFORMANCE
========================================= */

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

    } else if (
        hasFinePointer &&
        !prefersReducedMotion &&
        !animationFrame
    ) {

        animateParallax();

    }

});

/* =========================================
   CONSOLE BRANDING
========================================= */

console.log(
    "%c DT DIGITAL TEAM ",
    "background:#7138df;color:white;font-size:20px;font-weight:bold;padding:12px;border-radius:8px;"
);

console.log(
    "%c Your Idea × Our Technology ",
    "color:#b98aff;font-size:13px;font-weight:bold;"
);

