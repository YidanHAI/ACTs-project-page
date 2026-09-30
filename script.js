(function () {
  "use strict";

  function renderIcons() {
    if (window.lucide) {
      window.lucide.createIcons({
        attrs: {
          "stroke-width": 1.9
        }
      });
    }
  }

  renderIcons();
  window.addEventListener("load", renderIcons);

  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  function closeNavigation() {
    if (!navToggle || !navLinks) {
      return;
    }
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    var icon = navToggle.querySelector("[data-lucide]");
    if (icon) {
      icon.setAttribute("data-lucide", "menu");
      renderIcons();
    }
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      var icon = navToggle.querySelector("[data-lucide]");
      if (icon) {
        icon.setAttribute("data-lucide", isOpen ? "x" : "menu");
        renderIcons();
      }
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("click", function (event) {
      if (!navLinks.classList.contains("is-open")) {
        return;
      }
      if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
        closeNavigation();
      }
    });
  }

  var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-tab]"));
  var panels = Array.prototype.slice.call(document.querySelectorAll("[data-panel]"));

  function activateTab(tab) {
    var target = tab.getAttribute("data-tab");

    tabs.forEach(function (candidate) {
      var active = candidate === tab;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-selected", String(active));
      candidate.setAttribute("tabindex", active ? "0" : "-1");
    });

    panels.forEach(function (panel) {
      var active = panel.getAttribute("data-panel") === target;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  }

  tabs.forEach(function (tab, index) {
    tab.setAttribute("tabindex", tab.classList.contains("is-active") ? "0" : "-1");

    tab.addEventListener("click", function () {
      activateTab(tab);
    });

    tab.addEventListener("keydown", function (event) {
      var nextIndex = index;
      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex]);
    });
  });

  var revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealItems.length) {
    document.documentElement.classList.add("reveal-enabled");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08
      }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }
})();
