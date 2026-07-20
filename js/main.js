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
    var scrollLockY = 0;
    function lockScroll() {
      scrollLockY = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = "fixed";
      document.body.style.top = -scrollLockY + "px";
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    }
    function unlockScroll() {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo({ top: scrollLockY, left: 0, behavior: "instant" });
    }

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
      if (open) lockScroll(); else unlockScroll();
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
        unlockScroll();
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

  /* ---------- Jobs: reference data (mirrors job-*.html content, used to prefill applications) ---------- */
  var JOBS = {
    "bd-director-data-centres": {
      title: "Business Development Director – Data Centres",
      sector: "Critical Infrastructure & Data Centres",
      location: "UK & Ireland (Hybrid / Home-Based)",
      salary: "£120,000–£150,000 + Bonus + Benefits",
      description: [
        "We're recruiting on behalf of a global manufacturer of critical power and energy infrastructure for a senior commercial leadership role within its rapidly growing Data Centre division.",
        "This is an opportunity to lead business development across the UK & Ireland, driving growth within the hyperscale, colocation and enterprise data centre sectors. You'll be responsible for developing strategic customer relationships, identifying new business opportunities and leading the pursuit of major infrastructure projects from early engagement through to contract award.",
        "Working closely with engineering, technical and commercial teams, you'll help deliver tailored power solutions for mission-critical environments while strengthening the company's position within the UK & Ireland data centre market."
      ],
      requirements: [
        "Proven experience selling into the data centre sector.",
        "Strong understanding of critical power, electrical infrastructure or mission-critical systems.",
        "Experience managing complex, high-value sales opportunities.",
        "Established relationships across the UK & Ireland data centre market.",
        "Commercially driven with excellent stakeholder management and negotiation skills."
      ],
      why: "This is an excellent opportunity to join an internationally recognised business at a time of significant investment and growth within one of the fastest-growing sectors in infrastructure."
    },
    "hv-project-manager": {
      title: "HV Project Manager – Transmission & Distribution",
      sector: "Power & Energy",
      location: "North West England (Site-Based)",
      salary: "£65,000–£80,000 + Car + Package",
      description: [
        "We're partnering with a leading transmission & distribution contractor to find an experienced HV Project Manager to lead the delivery of substation and grid reinforcement schemes across the North West. With record investment flowing into network upgrades, this is a business with a full order book and a genuine pipeline of long-term work.",
        "Reporting to the Contracts Director, you'll take end-to-end ownership of projects up to 132kV — managing programme, budget, safety and quality from mobilisation through to energisation. You'll lead multidisciplinary site teams and subcontractors, and act as the key point of contact for the client and DNO stakeholders throughout.",
        "This is a hands-on leadership role for someone who knows what good looks like on an HV site, and who wants the autonomy to run their projects their way."
      ],
      requirements: [
        "Proven project management experience on HV substation or grid infrastructure projects.",
        "Strong working knowledge of transmission & distribution networks up to 132kV.",
        "A track record of delivering projects safely, on programme and on budget.",
        "Confident managing site teams, subcontractors and DNO / client stakeholders.",
        "NEBOSH / SMSTS and a relevant engineering qualification (HNC/HND/degree) preferred."
      ],
      why: "You'll join a contractor at the heart of the UK's grid transformation, with a secure pipeline, a supportive senior team and a clear route into a Senior PM or Contracts Manager position as the business grows."
    },
    "me-contract-manager": {
      title: "Critical Facilities / M&E Contract Manager",
      sector: "Building Services & Facilities",
      location: "London (Hybrid)",
      salary: "£70,000–£85,000 + Benefits",
      description: [
        "A market-leading building services provider is looking for a Critical Facilities / M&E Contract Manager to take ownership of hard-services delivery across a portfolio of high-profile commercial and mission-critical estates in central London.",
        "You'll be accountable for the safe, compliant and efficient operation of building services across your sites — leading a team of shift and mobile engineers, managing planned and reactive maintenance, and holding the commercial performance of the contract. Working closely with the client, you'll drive continuous improvement, manage supply-chain partners and ensure critical systems never miss a beat.",
        "It's a role that blends engineering leadership, client relationship management and commercial ownership — ideal for an M&E professional ready to step up and run a flagship contract."
      ],
      requirements: [
        "Strong M&E or building services background, ideally within critical environments.",
        "Experience managing hard-services / FM contracts and leading engineering teams.",
        "Sound understanding of statutory compliance, PPM regimes and SLA / KPI delivery.",
        "Commercial awareness — P&L, budgets and supply-chain management.",
        "Excellent client-facing and stakeholder communication skills."
      ],
      why: "You'll take the lead on a prestigious, high-visibility contract with a provider that invests in its people — with genuine scope to grow into a Senior or Account Director remit."
    },
    "bess-project-manager": {
      title: "BESS Project Manager – Grid-Scale Storage",
      sector: "Renewables & Energy Storage",
      location: "UK (Remote with site travel)",
      salary: "£75,000–£95,000 + Bonus",
      description: [
        "We're working with a fast-scaling energy storage developer to appoint a BESS Project Manager to lead the delivery of grid-scale battery projects across the UK. Backed by significant investment and a growing pipeline of consented sites, this is a business helping to balance the grid as renewables come online.",
        "You'll own projects from financial close through construction to energisation and handover — managing EPC contractors, grid connection works, budgets and programme. Acting as the developer's representative on site, you'll drive safety, quality and commercial performance, and keep a wide group of stakeholders — from DNOs and National Grid to landowners and investors — aligned and informed.",
        "This is a genuinely mission-led role at the sharp end of the energy transition, with the autonomy to shape how projects are delivered."
      ],
      requirements: [
        "Project management experience delivering BESS, solar, or grid-connection infrastructure.",
        "Understanding of the grid connection process and DNO / National Grid requirements.",
        "Experience managing EPC contractors and multi-million-pound project budgets.",
        "Strong commercial, programme and stakeholder-management capability.",
        "A relevant engineering or construction background and a full UK driving licence."
      ],
      why: "Join a developer at an inflection point, with a long-term pipeline, equity upside and the chance to build and lead a delivery team as the portfolio scales."
    }
  };

  function buildApplicationMessage(job) {
    var lines = [];
    lines.push("I'd like to apply for: " + job.title);
    lines.push("");
    lines.push("Location: " + job.location);
    lines.push("Salary: " + job.salary);
    lines.push("");
    lines.push(job.description.join("\n\n"));
    lines.push("");
    lines.push("Key Requirements:");
    job.requirements.forEach(function (r) { lines.push("- " + r); });
    lines.push("");
    lines.push(job.why);
    return lines.join("\n");
  }

  /* ---------- Contact: prefill full application from ?job= (or legacy ?role=) ---------- */
  var messageField = document.getElementById("f-message");
  var sectorField = document.getElementById("f-sector");
  if (messageField) {
    var searchParams = new URLSearchParams(window.location.search);
    var jobSlug = searchParams.get("job");
    var job = jobSlug ? JOBS[jobSlug] : null;

    if (job) {
      messageField.value = buildApplicationMessage(job);
      if (sectorField) sectorField.value = job.sector;
    } else {
      var roleParam = searchParams.get("role");
      if (roleParam) messageField.value = "I'd like to apply for: " + roleParam + "\n\n";
    }

    if (messageField.value) {
      var caret = messageField.value.length;
      messageField.setSelectionRange(caret, caret);
    }
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
