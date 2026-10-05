// The Paul Davis Partnership — shared behaviour: mobile menu, reveal-on-scroll,
// carousels ([data-carousel]) and lightbox ([data-lightbox] galleries).
(function () {
  "use strict";

  // ---- Mobile menu ----
  var toggle = document.querySelector(".pdp-mobile-toggle");
  var menu = document.querySelector(".pdp-mobile-menu");
  var overlay = document.querySelector(".pdp-mobile-overlay");
  var closeBtn = document.querySelector(".pdp-mobile-close");

  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle("active", open);
    overlay.classList.toggle("active", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    if (open) closeBtn.focus(); else toggle.focus();
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
        header.classList.toggle("is-scrolled", window.scrollY > 40);
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
  // Arrows and dots are generated here.
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector(".carousel-track");
    var slides = Array.prototype.slice.call(track.children);
    if (slides.length < 2) return;
    var index = 0, timer = null;
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
      d.addEventListener("click", function () { go(i); restart(); });
      dots.appendChild(d);
    });
    root.appendChild(prev); root.appendChild(next); root.appendChild(dots);

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      Array.prototype.forEach.call(dots.children, function (d, j) {
        d.setAttribute("aria-current", j === index ? "true" : "false");
      });
    }
    function restart() {
      if (!delay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      clearInterval(timer);
      timer = setInterval(function () { go(index + 1); }, delay);
    }
    prev.addEventListener("click", function () { go(index - 1); restart(); });
    next.addEventListener("click", function () { go(index + 1); restart(); });
    root.addEventListener("mouseenter", function () { clearInterval(timer); });
    root.addEventListener("mouseleave", restart);

    var startX = null;
    track.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
      startX = null;
    });

    go(0); restart();
  });

  // ---- Lightbox ----
  // Any container with [data-lightbox] makes its <a href="large.webp"> children open in a lightbox.
  var groups = document.querySelectorAll("[data-lightbox]");
  if (groups.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true");
    lb.innerHTML = '<button class="lb-close" type="button" aria-label="Close">&times;</button>' +
      '<button class="lb-prev" type="button" aria-label="Previous">&#8249;</button>' +
      '<img alt=""><button class="lb-next" type="button" aria-label="Next">&#8250;</button>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector("img"), items = [], cur = 0, opener = null;

    function show(i) {
      cur = (i + items.length) % items.length;
      lbImg.src = items[cur].href;
      var inner = items[cur].querySelector("img");
      lbImg.alt = inner ? inner.alt : "";
    }
    function close() { lb.classList.remove("open"); lbImg.removeAttribute("src"); if (opener) opener.focus(); }

    groups.forEach(function (g) {
      var links = Array.prototype.slice.call(g.querySelectorAll("a[href]"));
      links.forEach(function (a, i) {
        a.addEventListener("click", function (e) {
          e.preventDefault(); items = links; opener = a; show(i);
          lb.classList.add("open"); lb.querySelector(".lb-close").focus();
        });
      });
    });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(cur - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
  }
})();
