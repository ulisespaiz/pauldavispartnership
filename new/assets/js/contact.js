/* ============================================================
   Paul Davis Partnership — contact.js
   Contact page micro-animations via IntersectionObserver
   Mirrors index.js / sustainability.js patterns exactly.
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
  `;
  document.head.appendChild(style);

  function prepareRevealElements() {
    // Hero
    document
      .querySelectorAll(".cont-hero-title, .cont-hero-subtitle, .cont-eyebrow")
      .forEach(function (el, i) {
        el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 5));
      });

    // Info bar items
    document.querySelectorAll(".cont-info-item").forEach(function (el, i) {
      el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 5));
    });

    // Principal cards
    document.querySelectorAll(".cont-principal-card").forEach(function (el, i) {
      el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 3));
    });

    // Team items — staggered
    document.querySelectorAll(".cont-team-item").forEach(function (el, i) {
      el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 5));
    });

    // Team heading
    document.querySelectorAll(".cont-team-heading").forEach(function (el) {
      el.classList.add("reveal");
    });

    // Office panel
    document
      .querySelectorAll(
        ".cont-office-heading, .cont-office-row, .cont-directions-btn",
      )
      .forEach(function (el, i) {
        el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 5));
      });
  }

  function initRevealObserver() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(function (el) {
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

    document.querySelectorAll(".reveal").forEach(function (el) {
      observer.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    prepareRevealElements();
    initRevealObserver();
  });
})();
