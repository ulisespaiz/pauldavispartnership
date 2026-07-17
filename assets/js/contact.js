/* ============================================================
   Paul Davis Partnership — contact.js
   Contact page micro-animations via IntersectionObserver
   Mirrors index.js / sustainability.js patterns exactly.
   ============================================================ */

(function () {
  "use strict";

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

  document.addEventListener("DOMContentLoaded", function () {
    prepareRevealElements();
    window.pdpReveal(".reveal", {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    });
  });
})();
