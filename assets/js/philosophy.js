/* ============================================================
   Paul Davis Partnership — philosophy.js
   Philosophy page animations and interactions
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Mark elements ---------- */
  function prepareReveal() {
    // Page hero
    document
      .querySelectorAll(".phil-hero-title, .phil-hero-subtitle")
      .forEach(function (el, i) {
        el.classList.add("reveal", "reveal-delay-" + (i + 1));
      });

    // Section headings
    document
      .querySelectorAll(
        ".phil-philosophy-heading, .phil-principals-heading, .phil-team-heading",
      )
      .forEach(function (el) {
        el.classList.add("reveal-left");
      });

    // Philosophy body paragraphs
    document
      .querySelectorAll(".phil-philosophy-body p")
      .forEach(function (el, i) {
        el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 4));
      });

    // Principal cards
    document.querySelectorAll(".phil-principal-card").forEach(function (el, i) {
      el.classList.add("reveal", "reveal-delay-" + (i + 1));
    });

    // Team cards
    document.querySelectorAll(".phil-team-card").forEach(function (el, i) {
      el.classList.add("reveal", "reveal-delay-" + Math.min((i % 4) + 1, 4));
    });

    // CTA
    document
      .querySelectorAll(".phil-cta-heading, .phil-cta-body, .phil-cta-btn")
      .forEach(function (el, i) {
        el.classList.add("reveal", "reveal-delay-" + (i + 1));
      });
  }

  /* ---------- Image placeholder fallback ---------- */
  // If a principal/team image fails to load, show a tasteful initials
  // placeholder. Wraps without an <img> (e.g. div placeholders) are skipped
  // because the selector only matches image elements.
  function initImageFallbacks() {
    document
      .querySelectorAll(".phil-principal-img-wrap img, .phil-team-img-wrap img")
      .forEach(function (img) {
        img.addEventListener("error", function () {
          var wrap = this.parentElement;
          var name = this.getAttribute("alt") || "Team Member";
          var initials = name
            .split(" ")
            .slice(0, 2)
            .map(function (n) {
              return n[0];
            })
            .join("");

          // Hide broken image
          this.style.display = "none";

          // Build placeholder
          var placeholder = document.createElement("div");
          placeholder.style.cssText =
            "width:100%;height:100%;display:flex;align-items:center;justify-content:center;" +
            "background-color:var(--pdp-teal-pale);color:var(--pdp-teal);font-family:var(--pdp-font-display);" +
            "font-size:clamp(24px,4vw,48px);font-weight:700;letter-spacing:0.05em;";
          placeholder.textContent = initials;
          wrap.insertBefore(placeholder, this.nextSibling);
        });
      });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    prepareReveal();
    window.pdpReveal(".reveal, .reveal-left", {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    });
    initImageFallbacks();
  });
})();
