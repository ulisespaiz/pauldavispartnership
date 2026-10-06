/* ============================================================
   Paul Davis Partnership — philosophy.js
   Philosophy page animations and interactions
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Add reveal styles to page-specific elements ---------- */
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

  /* ---------- Mark elements ---------- */
  function prepareReveal() {
    // Page hero
    document
      .querySelectorAll(".page-hero-title, .page-hero-subtitle")
      .forEach(function (el, i) {
        el.classList.add("reveal", "reveal-delay-" + (i + 1));
      });

    // Philosophy text
    document.querySelectorAll(".phil-heading").forEach(function (el) {
      el.classList.add("reveal-left");
    });

    document
      .querySelectorAll(".phil-statement-right p")
      .forEach(function (el, i) {
        el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 4));
      });

    // Principal cards
    document.querySelectorAll(".principal-card").forEach(function (el, i) {
      el.classList.add("reveal", "reveal-delay-" + (i + 1));
    });

    // Team cards
    document.querySelectorAll(".team-card").forEach(function (el, i) {
      el.classList.add("reveal", "reveal-delay-" + Math.min((i % 4) + 1, 4));
    });

    // CTA
    document
      .querySelectorAll(".phil-cta-title, .phil-cta-sub, .phil-cta-btn")
      .forEach(function (el, i) {
        el.classList.add("reveal", "reveal-delay-" + (i + 1));
      });
  }

  /* ---------- IntersectionObserver ---------- */
  function initObserver() {
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

  /* ---------- Image placeholder fallback ---------- */
  // If a team image fails to load, show a tasteful initials placeholder
  function initImageFallbacks() {
    document
      .querySelectorAll(".principal-image, .team-image")
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
    initObserver();
    initImageFallbacks();
  });
})();
