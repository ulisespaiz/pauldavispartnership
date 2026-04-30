/* ============================================================
   Paul Davis Partnership — main.js
   Mobile menu · Header scroll behavior
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

  /* ---------- Sticky header border ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 10) {
          header.style.borderBottomColor = "var(--pdp-rule)";
        } else {
          header.style.borderBottomColor = "var(--pdp-rule)";
        }
      },
      { passive: true },
    );
  }

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
