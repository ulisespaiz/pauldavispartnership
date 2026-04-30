/* ============================================================
   Paul Davis Partnership — sustainability.js
   Sustainability page micro-animations via IntersectionObserver
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
  `;
  document.head.appendChild(style);

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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
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
