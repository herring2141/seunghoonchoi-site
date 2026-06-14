/* Molecular Precision — interactions */
(function () {
  "use strict";

  /* Mobile nav toggle */
  var burger = document.querySelector(".hamburger");
  var nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Nav dropdowns — click/touch + keyboard (hover handled by CSS) */
  var toggles = document.querySelectorAll(".nav__toggle");
  toggles.forEach(function (btn) {
    var group = btn.closest(".nav__group");
    if (!group) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var open = group.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  document.addEventListener("click", function (e) {
    if (e.target.closest(".nav__group")) return;
    document.querySelectorAll(".nav__group.is-open").forEach(function (g) {
      g.classList.remove("is-open");
      var t = g.querySelector(".nav__toggle");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".nav__group.is-open").forEach(function (g) {
      g.classList.remove("is-open");
      var t = g.querySelector(".nav__toggle");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  });

  /* Reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 6, 5) * 0.05) + "s";
      ro.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Category filter (list pages) */
  var bar = document.querySelector("[data-filter]");
  var list = document.querySelector("[data-list]");
  if (bar && list) {
    bar.addEventListener("click", function (ev) {
      var btn = ev.target.closest(".chip");
      if (!btn) return;
      bar.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var cat = btn.getAttribute("data-cat");
      list.querySelectorAll(".card").forEach(function (card) {
        var cats = (card.getAttribute("data-cat") || "").split(/\s+/);
        var show = cat === "*" || cats.indexOf(cat) !== -1;
        card.classList.toggle("is-hidden", !show);
      });
    });
  }
})();
