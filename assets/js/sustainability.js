/* ============================================================
   Paul Davis Partnership — sustainability.js
   Sustainability page micro-animations via IntersectionObserver
   Mirrors index.js patterns exactly.
   ============================================================ */

(function () {
  "use strict";

  function prepareRevealElements() {
    // Section headings
    document
      .querySelectorAll(
        ".sust-hero-title, .sust-fit-heading, .sust-tips-heading, .sust-resources-heading, .sust-legacy-title, .sust-impact-statement",
      )
      .forEach(function (el) {
        el.classList.add("reveal");
      });

    // Cards with stagger
    document.querySelectorAll(".sust-tip-card").forEach(function (el, i) {
      el.classList.add("reveal", "reveal-delay-" + Math.min((i % 3) + 1, 5));
    });

    // Resource items with stagger
    document.querySelectorAll(".sust-resource-item").forEach(function (el, i) {
      el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 5));
    });

    // Body text
    document
      .querySelectorAll(
        ".sust-hero-subtitle, .sust-impact-sub, .sust-legacy-text, .sust-fit-right p",
      )
      .forEach(function (el, i) {
        el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 5));
      });

    // Stat items
    document.querySelectorAll(".sust-hero-stat").forEach(function (el, i) {
      el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 5));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    prepareRevealElements();
    window.pdpReveal(".reveal", {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    });
  });
})();
