/* ── Image Slider ── */
(function () {
  "use strict";

  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".slider-dot");
  const counter = document.getElementById("sliderCounter");
  const total = slides.length;
  let current = 0;
  let autoTimer;

  function goTo(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (index + total) % total;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
    counter.textContent = current + 1 + " / " + total;
  }

  document.getElementById("sliderPrev").addEventListener("click", function () {
    clearInterval(autoTimer);
    goTo(current - 1);
    startAuto();
  });

  document.getElementById("sliderNext").addEventListener("click", function () {
    clearInterval(autoTimer);
    goTo(current + 1);
    startAuto();
  });

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      clearInterval(autoTimer);
      goTo(parseInt(dot.getAttribute("data-index"), 10));
      startAuto();
    });
  });

  function startAuto() {
    autoTimer = setInterval(function () {
      goTo(current + 1);
    }, 4500);
  }

  startAuto();
})();
