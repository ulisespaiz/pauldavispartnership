/* ============================================================
   Paul Davis Partnership — index.js
   Homepage micro-animations via IntersectionObserver
   No libraries. CSS does the heavy lifting; JS just toggles classes.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Helper: add global reveal styles ---------- */
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

        .stat-count {
            display: inline-block;
        }
    `;
  document.head.appendChild(style);

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
    document.querySelectorAll(".about-body p").forEach(function (el, i) {
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
        ".philosophy-right p, .contact-body, .contact-details, .contact-form",
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

  /* ---------- IntersectionObserver for reveals ---------- */
  function initRevealObserver() {
    if (!("IntersectionObserver" in window)) {
      // Fallback: show everything immediately
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    document.querySelectorAll(".reveal, .reveal-left").forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Animated number counter for hero stats ---------- */
  function animateCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

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

  /* ---------- Contact form simple feedback ---------- */
  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = form.querySelector(".form-submit");
      const originalText = btn.textContent;

      btn.textContent = "Message Sent";
      btn.style.backgroundColor = "var(--pdp-teal-dark)";
      btn.disabled = true;

      // Reset after 4s (in production, replace with real submission)
      setTimeout(function () {
        btn.textContent = originalText;
        btn.style.backgroundColor = "";
        btn.disabled = false;
        form.reset();
      }, 4000);
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
    initRevealObserver();
    animateCounters();
    initContactForm();
    initSmoothScroll();
    initHeroParallax();
  });
})();
