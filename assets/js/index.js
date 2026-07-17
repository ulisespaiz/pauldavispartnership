/* ============================================================
   Paul Davis Partnership — index.js
   Homepage micro-animations via IntersectionObserver
   No libraries. CSS does the heavy lifting; JS just toggles classes.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Mark elements for reveal ---------- */
  function prepareRevealElements() {
    // Section headings
    document
      .querySelectorAll(
        ".about-heading, .projects-heading, .spec-heading, .philosophy-heading, .contact-heading, .mv-card-title",
      )
      .forEach(function (el) {
        el.classList.add("reveal");
      });

    // About body paragraphs with stagger
    document.querySelectorAll(".about-text-col p").forEach(function (el, i) {
      el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 5));
    });

    // Cards
    document
      .querySelectorAll(".mv-card, .spec-card, .project-card")
      .forEach(function (el, i) {
        el.classList.add("reveal", "reveal-delay-" + Math.min((i % 3) + 1, 5));
      });

    // Philosophy and contact sections
    document
      .querySelectorAll(
        ".philosophy-right p, .contact-body, .contact-details",
      )
      .forEach(function (el, i) {
        el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 5));
      });

    // Hero: no animation delay — visible immediately
    document
      .querySelectorAll(
        ".hero-eyebrow, .hero-title, .hero-subtitle, .hero-actions, .hero-stat",
      )
      .forEach(function (el, i) {
        el.classList.add("reveal", "reveal-delay-" + Math.min(i + 1, 5));
      });
  }

  /* ---------- Animated number counter for hero stats ---------- */
  function animateCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    // Reduced motion: show final values immediately, no animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      counters.forEach(function (el) {
        const target = parseInt(el.getAttribute("data-count"), 10);
        const suffix = el.getAttribute("data-suffix") || "";
        el.textContent = target + suffix;
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"), 10);
          const suffix = el.getAttribute("data-suffix") || "";
          const duration = 1400;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Smooth anchor scroll ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        const offset = 80; // header height
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  /* ---------- Hero parallax (object-position trick) ---------- */
  function initHeroParallax() {
    // Reduced motion: no parallax at all.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const heroImage = document.querySelector(".hero-image");
    if (!heroImage) return;

    var ticking = false;

    function applyParallax() {
      if (window.innerWidth <= 768) {
        heroImage.style.objectPosition = "";
        ticking = false;
        return;
      }

      var wrapRect = heroImage.parentElement.getBoundingClientRect();
      // How far the wrap top has scrolled above the viewport top (0 when just entering)
      var progress = -wrapRect.top / (wrapRect.height || 1);
      // Map 0→1 progress to objectPosition 0%→40% (top→bottom of image)
      var pos = Math.max(0, Math.min(100, progress * 40));
      heroImage.style.objectPosition = "center " + pos + "%";
      ticking = false;
    }

    applyParallax();

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(applyParallax);
          ticking = true;
        }
      },
      { passive: true },
    );
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    prepareRevealElements();
    window.pdpReveal(".reveal, .reveal-left", {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    });
    animateCounters();
    initSmoothScroll();
    initHeroParallax();
  });
})();
