/* ── Image Slider ── */
(function () {
  "use strict";

  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".slider-dot");
  const counter = document.getElementById("sliderCounter");
  const prevBtn = document.getElementById("sliderPrev");
  const nextBtn = document.getElementById("sliderNext");
  const dotsWrap = document.getElementById("sliderDots");
  const container = document.querySelector(".project-slider-col");
  const total = slides.length;

  // Nothing to drive without slides.
  if (total === 0) return;

  let current = 0;

  // Announce counter updates to assistive tech.
  if (counter) counter.setAttribute("aria-live", "polite");

  // Initial ARIA state.
  slides.forEach(function (slide, i) {
    if (i === current) {
      slide.removeAttribute("aria-hidden");
    } else {
      slide.setAttribute("aria-hidden", "true");
    }
  });
  dots.forEach(function (dot, i) {
    if (i === current) {
      dot.setAttribute("aria-current", "true");
    } else {
      dot.removeAttribute("aria-current");
    }
  });

  // Single slide: hide the controls, run no autoplay, wire no listeners.
  if (total <= 1) {
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    if (dotsWrap) dotsWrap.style.display = "none";
    return;
  }

  let autoTimer = null;

  function goTo(index) {
    // Leave the current slide/dot.
    slides[current].classList.remove("active");
    slides[current].setAttribute("aria-hidden", "true");
    if (dots[current]) {
      dots[current].classList.remove("active");
      dots[current].removeAttribute("aria-current");
    }

    current = (index + total) % total;

    // Enter the new slide/dot.
    slides[current].classList.add("active");
    slides[current].removeAttribute("aria-hidden");
    if (dots[current]) {
      dots[current].classList.add("active");
      dots[current].setAttribute("aria-current", "true");
    }
    if (counter) counter.textContent = current + 1 + " / " + total;
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function startAuto() {
    // Respect reduced-motion: never auto-advance.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stopAuto();
    autoTimer = setInterval(function () {
      goTo(current + 1);
    }, 4500);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      stopAuto();
      goTo(current - 1);
      startAuto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      stopAuto();
      goTo(current + 1);
      startAuto();
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      stopAuto();
      goTo(parseInt(dot.getAttribute("data-index"), 10));
      startAuto();
    });
  });

  // Pause autoplay while the user hovers or keyboard-focuses the slider.
  if (container) {
    container.addEventListener("mouseenter", stopAuto);
    container.addEventListener("mouseleave", startAuto);
    container.addEventListener("focusin", stopAuto);
    container.addEventListener("focusout", startAuto);
  }

  startAuto();
})();
