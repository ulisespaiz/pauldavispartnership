// The Paul Davis Partnership: shared behaviour: mobile menu, reveal-on-scroll,
// carousels ([data-carousel]).
(function () {
  "use strict";

  // ---- Mobile menu ----
  var toggle = document.querySelector(".pdp-mobile-toggle");
  var menu = document.querySelector(".pdp-mobile-menu");
  var overlay = document.querySelector(".pdp-mobile-overlay");
  var closeBtn = document.querySelector(".pdp-mobile-close");

  function setMenu(open) {
    if (!menu) return;
    // Keep keyboard and screen reader users inside the drawer while it is open
    document.querySelectorAll("main, footer, .skip-link, .pdp-header-container").forEach(function (el) { el.inert = open; });
    menu.classList.toggle("active", open);
    overlay.classList.toggle("active", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    if (open) closeBtn.focus({ preventScroll: true }); else toggle.focus({ preventScroll: true });
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(true); });
    closeBtn.addEventListener("click", function () { setMenu(false); });
    overlay.addEventListener("click", function () { setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("active")) setMenu(false);
    });
  }

  // ---- Header: compact + shadow once the page is scrolled ----
  var header = document.querySelector(".pdp-header");
  if (header) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        // Hysteresis wider than the header's height change (up to 57px), so compacting it
        // cannot pull scrollY back across the threshold and make it flicker
        var y = window.scrollY;
        header.classList.toggle("is-scrolled", header.classList.contains("is-scrolled") ? y > 8 : y > 72);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---- Footer year ----
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // ---- Reveal on scroll ----
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ---- Carousel ----
  // Markup: <div class="carousel" data-carousel data-autoplay="3000">
  //           <div class="carousel-track"><figure class="carousel-slide">...</figure>...</div>
  //         </div>
  // Arrows, dots and (with autoplay) a pause button are generated here.
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector(".carousel-track");
    var slides = Array.prototype.slice.call(track.children);
    if (slides.length < 2) return;
    var index = 0, timer = null, playing = false, onScreen = true, pauseBtn = null;
    var delay = parseInt(root.getAttribute("data-autoplay"), 10) || 0;

    var prev = document.createElement("button");
    prev.className = "carousel-arrow carousel-prev"; prev.type = "button";
    prev.setAttribute("aria-label", "Previous image"); prev.innerHTML = "&#8249;";
    var next = document.createElement("button");
    next.className = "carousel-arrow carousel-next"; next.type = "button";
    next.setAttribute("aria-label", "Next image"); next.innerHTML = "&#8250;";
    var dots = document.createElement("div");
    dots.className = "carousel-dots";
    slides.forEach(function (_, i) {
      var d = document.createElement("button");
      d.type = "button"; d.setAttribute("aria-label", "Go to image " + (i + 1));
      d.addEventListener("click", function () { go(i); halt(); });
      dots.appendChild(d);
    });
    root.appendChild(prev); root.appendChild(next); root.appendChild(dots);
    // Autoplay always comes with a visible Pause button (WCAG 2.2.2); without the button there is no autoplay.
    if (delay && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pauseBtn = document.createElement("button");
      pauseBtn.className = "carousel-pause"; pauseBtn.type = "button";
      pauseBtn.addEventListener("click", function () { setPlaying(!playing); });
      root.insertBefore(pauseBtn, root.firstChild); // first in tab order
    }

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      Array.prototype.forEach.call(dots.children, function (d, j) {
        d.setAttribute("aria-current", j === index ? "true" : "false");
      });
    }
    function setPlaying(on) {
      playing = !!on && !!pauseBtn;
      clearInterval(timer);
      if (playing) timer = setInterval(function () { if (onScreen && !document.hidden) go(index + 1); }, delay);
      if (pauseBtn) {
        pauseBtn.classList.toggle("is-paused", !playing);
        pauseBtn.setAttribute("aria-label", (playing ? "Pause" : "Play") + " automatic slide show");
      }
    }
    function halt() { setPlaying(false); } // using any other control stops autoplay until Play is pressed
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { onScreen = en[en.length - 1].isIntersecting; }).observe(root);
    }
    prev.addEventListener("click", function () { go(index - 1); halt(); });
    next.addEventListener("click", function () { go(index + 1); halt(); });
    root.addEventListener("focusin", function (e) { if (e.target !== pauseBtn) halt(); });

    var startX = null, startY = 0;
    function touchDone() { startX = null; if (playing) setPlaying(true); } // tap or page scroll: carry on
    track.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX; startY = e.touches[0].clientY; clearInterval(timer); // hold still while touched
    }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX, dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) { go(index + (dx < 0 ? 1 : -1)); halt(); }
      touchDone();
    });
    track.addEventListener("touchcancel", touchDone);

    go(0); setPlaying(true);
  });
})();
