/* ============================================================
   Paul Davis Partnership — design.js
   Design page micro-animations via IntersectionObserver
   Mirrors index.js patterns exactly.
   ============================================================ */

(function () {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
    .reveal-delay-1 { transition-delay: 0.1s; }
    .reveal-delay-2 { transition-delay: 0.2s; }
    .reveal-delay-3 { transition-delay: 0.3s; }
    .reveal-delay-4 { transition-delay: 0.4s; }
    .reveal-delay-5 { transition-delay: 0.5s; }

    .reveal-left {
      opacity: 0;
      transform: translateX(-18px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .reveal-left.revealed {
      opacity: 1;
      transform: translateX(0);
    }
  `;
  document.head.appendChild(style);

  function prepareRevealElements() {
    // Page hero
    document
      .querySelectorAll(".dsgn-hero-title, .dsgn-hero-subtitle, .dsgn-eyebrow")
      .forEach(function (el, i) {
        el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 5));
      });

    // Stats bar items
    document.querySelectorAll(".dsgn-hero-stat").forEach(function (el, i) {
      el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 5));
    });

    // Step titles
    document.querySelectorAll(".dsgn-step-title").forEach(function (el) {
      el.classList.add("reveal");
    });

    // Step text paragraphs — staggered within each card
    document.querySelectorAll(".dsgn-step-text p").forEach(function (el, i) {
      el.classList.add("reveal", "reveal-delay-" + Math.min((i % 3) + 1, 5));
    });

    // Sub-items
    document.querySelectorAll(".dsgn-step-sub-item").forEach(function (el, i) {
      el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 3));
    });

    // List items
    document.querySelectorAll(".dsgn-step-list li").forEach(function (el, i) {
      el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 5));
    });

    // CTA section
    document
      .querySelectorAll(
        ".dsgn-cta-heading, .dsgn-cta-body, .dsgn-cta-right-heading, .dsgn-cta-right-text",
      )
      .forEach(function (el, i) {
        el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 4));
      });
  }

  function initRevealObserver() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal, .reveal-left").forEach(function (el) {
        el.classList.add("revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    document.querySelectorAll(".reveal, .reveal-left").forEach(function (el) {
      observer.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    prepareRevealElements();
    initRevealObserver();
  });
})();
