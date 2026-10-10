/* ============================================================================
   main.js — renders content.js into the page, then wires up the motion.
   No dependencies. Works from file:// as well as a server.
   ==========================================================================*/
(function () {
  "use strict";

  var C = window.PORTFOLIO_CONTENT || {};

  /* ------------------------------------------------------------------ utils */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function setText(sel, value) { var n = $(sel); if (n) n.textContent = value; }
  function link(a, cls) {
    return "<a" + (cls ? ' class="' + cls + '"' : "") +
      ' href="' + esc(a.href) + '"' +
      (/^https?:/i.test(a.href) ? ' target="_blank" rel="noopener noreferrer"' : "") +
      ">" + esc(a.label) + "</a>";
  }

  /* ------------------------------------------------------------------- hero */
  var id = C.identity || {};
  var year = new Date().getFullYear();

  setText("#hero-name", id.name || "");
  setText("#hero-location", id.location || "");
  setText("#hero-year", year);
  setText("#footer-year", year);
  setText("#footer-note", "© " + year + " " + (id.name || ""));

  var mail = $("#hero-email");
  if (mail && id.email) { mail.href = "mailto:" + id.email; mail.textContent = id.email; }
  var ns = $(".noscript a");
  if (ns && id.email) { ns.href = "mailto:" + id.email; ns.textContent = id.email; }

  /* --------------------------------------------------------------- projects */
  var projects = C.projects || [];
  var mount = $("#work-mount");

  if (mount) {
    mount.innerHTML = projects.map(function (p) {
      var decisions = (p.decisions || []).map(function (d) {
        return "<li>" + esc(d) + "</li>";
      }).join("");

      var metrics = (p.metrics || []).map(function (m) {
        return '<div class="metric"><span class="metric__value">' + esc(m.value) +
          '</span><span class="metric__label">' + esc(m.label) + "</span></div>";
      }).join("");

      return "" +
        '<section class="chapter project" id="work-' + esc(p.id) + '"' +
        ' data-chapter="' + esc(p.index) + '" data-title="' + esc(p.title) + '">' +
          '<div class="project__grid">' +
            '<div class="project__frame">' +
              '<div class="frame__inner">' +
                '<div class="frame__top"><span>Chapter ' + esc(p.index) + "</span>" +
                  "<span>" + esc(p.year) + "</span></div>" +
                '<div class="frame__glyph">' + esc(p.title) + "</div>" +
                '<div class="frame__bottom"><span>' + esc(p.role) + "</span>" +
                  "<span>" + esc(p.context) + "</span></div>" +
              "</div>" +
            "</div>" +
            '<div class="project__body">' +
              '<p class="eyebrow reveal">Chapter ' + esc(p.index) + " — " + esc(p.kicker) + "</p>" +
              '<h2 class="display project__title reveal" data-delay="1">' + esc(p.title) + "</h2>" +
              '<p class="project__kicker reveal" data-delay="1">' + esc(p.role) + "</p>" +
              '<p class="project__summary reveal" data-delay="2">' + esc(p.summary) + "</p>" +
              (decisions ? '<ul class="decisions reveal" data-delay="2">' + decisions + "</ul>" : "") +
              (metrics ? '<div class="metrics reveal" data-delay="3">' + metrics + "</div>" : "") +
            "</div>" +
          "</div>" +
        "</section>";
    }).join("");
  }

  /* --------------------------------------------------------- proof of work */
  var proofMount = $("#proof-mount");
  if (proofMount) {
    var rows = [];
    projects.forEach(function (p) {
      (p.proof || []).forEach(function (it, i) {
        var ref = p.index + "." + (i + 1);
        var hasLink = it.href && it.href !== "#";
        rows.push(
          '<article class="proof__item reveal">' +
            '<span class="proof__id">' + esc(ref) + "</span>" +
            '<p class="proof__claim">' + esc(it.claim) +
              (hasLink ? "<br>" + link({ label: "Open artefact", href: it.href }, "proof__link") : "") +
            "</p>" +
            '<p class="proof__artefact">' + esc(it.artefact) + "</p>" +
            '<span class="proof__kind">' + esc(it.kind || "Evidence") + "</span>" +
          "</article>"
        );
      });
    });
    proofMount.innerHTML = rows.length ? rows.join("") :
      '<p class="proof__artefact">Add entries to content.js to populate this section.</p>';
  }

  /* ------------------------------------------------------------ about/stack */
  var aboutBody = $("#about-body");
  if (aboutBody) {
    aboutBody.innerHTML = (C.about || []).map(function (para) {
      return "<p>" + esc(para) + "</p>";
    }).join("");
  }

  var stackMount = $("#stack-mount");
  if (stackMount) {
    stackMount.innerHTML = (C.stack || []).map(function (g) {
      return '<div class="stack__group"><h3>' + esc(g.group) + "</h3><ul>" +
        (g.items || []).map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") +
        "</ul></div>";
    }).join("");
  }

  var contactMount = $("#contact-mount");
  if (contactMount) {
    var all = (C.links || []).slice();
    if (id.email) all.unshift({ label: "Email me", href: "mailto:" + id.email });
    contactMount.innerHTML = all.map(function (a) { return link(a); }).join("");
  }

  /* ------------------------------------------------------------ reveal pass */
  var revealables = document.querySelectorAll(".reveal, .hero__title, .section-head");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

    Array.prototype.forEach.call(revealables, function (n) { io.observe(n); });
  } else {
    Array.prototype.forEach.call(revealables, function (n) { n.classList.add("is-in"); });
  }

  /* --------------------------------------------------------- hud + chapters */
  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-chapter]"));
  var total = sections.length;
  var bar = $("#progress");
  var nowEl = $("#chapter-now");
  var totalEl = $("#chapter-total");
  if (totalEl) totalEl.textContent = total < 10 ? "0" + total : String(total);

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      if (bar) bar.style.width = pct.toFixed(2) + "%";

      // which section owns the middle of the viewport?
      var mid = window.scrollY + window.innerHeight * 0.42;
      var current = 1;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= mid) current = i + 1;
      }
      if (nowEl) nowEl.textContent = current < 10 ? "0" + current : String(current);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* --------------------------------------------------------------- nav menu */
  var toggle = $(".nav__toggle");
  var links = $(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
