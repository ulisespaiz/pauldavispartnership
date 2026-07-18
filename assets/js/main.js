/* ============================================================
   Paul Davis Partnership — main.js
   Mobile menu · Shared reveal helper · Active nav link
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("mobileToggle");
  const mobileNav = document.getElementById("mobileNav");
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll("a") : [];

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      const isOpen = mobileNav.classList.toggle("active");
      toggle.setAttribute("aria-expanded", isOpen);
      toggle.classList.toggle("active");
    });

    // Close on link click
    mobileLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("active");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", false);
      });
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (!mobileNav.contains(e.target) && !toggle.contains(e.target)) {
        mobileNav.classList.remove("active");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", false);
      }
    });
  }

  /* ---------- Hamburger icon morph ---------- */
  // The CSS handles the animation via .active class on the toggle.
  // The spans transform into an ✕ via CSS (see main.css).

  /* ---------- Shared reveal-on-scroll helper ---------- */
  // Builds one IntersectionObserver for the given selector(s) and toggles
  // the `revealed` class as elements enter the viewport. Reveal CSS lives in
  // main.css (motion wrapped in prefers-reduced-motion: no-preference), so
  // reduced-motion users simply get the content with no animation.
  // Page scripts add their .reveal / .reveal-delay-* classes, then call this.
  window.pdpReveal = function (selectors, options) {
    const opts = options || { threshold: 0.12, rootMargin: "0px 0px -40px 0px" };
    const els = document.querySelectorAll(selectors);
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, opts);

    els.forEach(function (el) {
      observer.observe(el);
    });
  };

  /* ---------- Active nav link highlight ---------- */
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPath =
    window.location.pathname.split("/").filter(Boolean).pop() || "index.html";

  navLinks.forEach(function (link) {
    const href =
      link.getAttribute("href").split("/").filter(Boolean).pop() || "";
    if (href && currentPath.includes(href.replace(".html", ""))) {
      link.style.color = "var(--pdp-teal)";
      link.style.borderBottomColor = "var(--pdp-teal)";
    }
  });
})();
