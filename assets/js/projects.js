// Projects page: category filter (buttons toggle items by data-category).
(function () {
  "use strict";
  var bar = document.querySelector(".pg-filters");
  if (!bar) return;
  var buttons = bar.querySelectorAll("button");
  var items = document.querySelectorAll(".pg-grid > .pg-item");
  var status = document.getElementById("pg-status");

  bar.addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn) return;
    var f = btn.getAttribute("data-filter"), shown = 0;
    buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
    items.forEach(function (it) {
      var show = f === "*" || it.getAttribute("data-category") === f;
      it.hidden = !show;
      if (show) shown++;
    });
    if (status) status.textContent = "Showing " + shown + (shown === 1 ? " project" : " projects");
  });
})();
