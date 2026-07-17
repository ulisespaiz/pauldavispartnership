/* ============================================================
   Paul Davis Partnership — design.js
   Design page micro-animations via IntersectionObserver
   Mirrors index.js patterns exactly.
   ============================================================ */

(function () {
  "use strict";

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

  document.addEventListener("DOMContentLoaded", function () {
    prepareRevealElements();
    window.pdpReveal(".reveal, .reveal-left", {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    });
  });
})();
