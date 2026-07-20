/* SENATEK RECRUITMENT — interactions */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Navigation ---------- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  function onScrollNav() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var ro = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            ro.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var co = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          co.unobserve(e.target);
          var el = e.target;
          var target = parseFloat(el.getAttribute("data-count"));
          var suffix = el.getAttribute("data-suffix") || "";
          if (reduceMotion) { el.textContent = target + suffix; return; }
          var dur = 1400;
          var start = null;
          function tick(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- Card cursor glow ---------- */
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---------- Hero streak draw ---------- */
  var streakPaths = document.querySelectorAll(".hero-streak path");
  if (streakPaths.length && !reduceMotion) {
    streakPaths.forEach(function (path, i) {
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.style.transition = "stroke-dashoffset 2.6s cubic-bezier(0.22,1,0.36,1) " + (0.25 + i * 0.35) + "s";
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          path.style.strokeDashoffset = "0";
        });
      });
    });
  }

  /* ---------- Ember particles ---------- */
  var canvas = document.getElementById("embers");
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var W, H;

    function sizeCanvas() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = rect.width;
      H = canvas.height = rect.height;
    }
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    var COUNT = Math.min(46, Math.floor(window.innerWidth / 30));
    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 1200,
        r: Math.random() * 1.8 + 0.4,
        vy: Math.random() * 0.35 + 0.12,
        vx: (Math.random() - 0.5) * 0.18,
        a: Math.random() * 0.5 + 0.15,
        tw: Math.random() * 0.02 + 0.004,
        ph: Math.random() * Math.PI * 2
      });
    }

    var visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }).observe(canvas);
    }

    var t = 0;
    (function drawEmbers() {
      requestAnimationFrame(drawEmbers);
      if (!visible || !W) return;
      t += 1;
      ctx.clearRect(0, 0, W, H);
      particles.forEach(function (p) {
        p.y -= p.vy;
        p.x += p.vx + Math.sin(t * 0.008 + p.ph) * 0.08;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        var alpha = p.a * (0.6 + 0.4 * Math.sin(t * p.tw * 60 + p.ph));
        ctx.beginPath();
        ctx.arc(p.x % (W + 20), p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(247, 158, 49, " + alpha.toFixed(3) + ")";
        ctx.shadowColor = "rgba(247, 148, 29, 0.8)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    })();
  }

  /* ---------- Timeline progress line ---------- */
  var timeline = document.querySelector(".timeline");
  if (timeline) {
    function updateLine() {
      var r = timeline.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = (vh * 0.82 - r.top) / r.height;
      progress = Math.max(0, Math.min(1, progress));
      timeline.style.setProperty("--line-progress", progress.toFixed(3));
    }
    window.addEventListener("scroll", updateLine, { passive: true });
    updateLine();
  }

  /* ---------- Contact: audience toggle ---------- */
  var audienceBtns = document.querySelectorAll(".audience-toggle button");
  if (audienceBtns.length) {
    var clientOnly = document.querySelectorAll("[data-audience='client']");
    var candidateOnly = document.querySelectorAll("[data-audience='candidate']");
    var typeInput = document.getElementById("enquiry-type");

    function setAudience(mode) {
      audienceBtns.forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-mode") === mode);
      });
      clientOnly.forEach(function (el) { el.style.display = mode === "client" ? "" : "none"; });
      candidateOnly.forEach(function (el) { el.style.display = mode === "candidate" ? "" : "none"; });
      if (typeInput) typeInput.value = mode;
    }

    audienceBtns.forEach(function (b) {
      b.addEventListener("click", function () { setAudience(b.getAttribute("data-mode")); });
    });

    var params = new URLSearchParams(window.location.search);
    setAudience(params.get("type") === "candidate" ? "candidate" : "client");
  }

  /* ---------- Contact form (backend pending) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      /* Backend integration point: POST the FormData below to the mail
         endpoint once hosting is in place. */
      var note = document.getElementById("form-status");
      if (note) {
        note.textContent = "Thanks — your message has been received. Jordan will come back to you within 24 hours.";
        note.style.color = "var(--amber-bright)";
      }
      form.reset();
    });
  }

  /* ---------- Jobs: sector filter ---------- */
  var jobFilter = document.querySelector(".job-filter");
  if (jobFilter) {
    var filterBtns = jobFilter.querySelectorAll("button");
    var jobCards = document.querySelectorAll(".job-card");
    var noResults = document.getElementById("no-results");
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        filterBtns.forEach(function (b) { b.classList.toggle("active", b === btn); });
        var shown = 0;
        jobCards.forEach(function (card) {
          var match = f === "all" || card.getAttribute("data-sector") === f;
          card.style.display = match ? "" : "none";
          if (match) shown++;
        });
        if (noResults) noResults.style.display = shown ? "none" : "";
      });
    });
  }

  /* ---------- Contact: prefill role from ?role= ---------- */
  var messageField = document.getElementById("f-message");
  if (messageField) {
    var roleParam = new URLSearchParams(window.location.search).get("role");
    if (roleParam) {
      messageField.value = "I'd like to apply for: " + roleParam + "\n\n";
      var caret = messageField.value.length;
      messageField.setSelectionRange(caret, caret);
    }
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
