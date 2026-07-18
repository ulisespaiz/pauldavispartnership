(function () {
  "use strict";

  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".gallery-card");
  const countEl = document.getElementById("resultCount");
  const noResults = document.getElementById("noResults");

  // Required for the filter UI — bail out cleanly if either is absent.
  if (!countEl || !noResults) return;

  function filterGallery(filter) {
    let visible = 0;

    cards.forEach(function (card) {
      const cat = card.getAttribute("data-category");
      const match = filter === "all" || cat === filter;

      if (match) {
        card.classList.remove("hidden");
        visible++;
      } else {
        card.classList.add("hidden");
      }
    });

    countEl.textContent = visible;
    noResults.style.display = visible === 0 ? "block" : "none";
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      // Update active state
      filterBtns.forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      filterGallery(btn.getAttribute("data-filter"));
    });
  });

  /* ── Scroll-reveal for cards ── */
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
    );

    cards.forEach(function (card, i) {
      card.style.opacity = "0";
      card.style.transform = "translateY(18px)";
      card.style.transition =
        "opacity 0.55s ease " +
        (i % 3) * 0.1 +
        "s, transform 0.55s ease " +
        (i % 3) * 0.1 +
        "s, border-color 0.3s ease";
      observer.observe(card);
    });
  }
})();
