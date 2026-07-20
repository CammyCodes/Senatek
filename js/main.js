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
    "head-of-solar-operations": {
      title: "Head of Solar Operations (Solar & BESS)",
      sector: "Renewables & Energy Storage",
      location: "Manchester (Hybrid)",
      salary: "£70,000–£85,000 per annum",
      sections: [
        { heading: "Overview", paragraphs: [
          "An exciting opportunity has arisen for an experienced Head of Solar Operations to lead the delivery and operational performance of utility-scale Solar PV and Battery Energy Storage System (BESS) projects. This leadership role is ideal for a driven professional with a strong background in renewable energy operations, team management, and project delivery.",
          "You will be responsible for overseeing day-to-day operations, driving operational excellence, ensuring health and safety compliance, and leading high-performing teams across multiple renewable energy projects."
        ] },
        { heading: "Key Responsibilities", items: [
          "Lead and manage all operational activities across Solar PV and BESS projects.",
          "Develop and implement operational strategies to improve efficiency and performance.",
          "Oversee project delivery, ensuring work is completed safely, on time, and within budget.",
          "Manage and support operational teams, providing leadership and professional development.",
          "Monitor project performance and identify opportunities for continuous improvement.",
          "Ensure compliance with health, safety, environmental, and industry regulations.",
          "Work closely with senior stakeholders to achieve business objectives.",
          "Manage operational budgets and resource planning.",
          "Build and maintain strong relationships with clients, contractors, and suppliers."
        ] },
        { heading: "Requirements", items: [
          "Proven experience in a senior operational leadership role within the renewable energy sector.",
          "Strong knowledge of Solar PV and Battery Energy Storage Systems (BESS).",
          "Excellent leadership and people management skills.",
          "Experience managing multiple projects and operational teams.",
          "Strong commercial awareness and problem-solving abilities.",
          "Excellent communication and stakeholder management skills.",
          "Full UK driving licence may be required."
        ] },
        { heading: "Benefits", items: [
          "Competitive salary of £70,000–£85,000 per year.",
          "Hybrid working arrangement.",
          "Company pension.",
          "Gym membership.",
          "Permanent, full-time position.",
          "Opportunity to join a growing renewable energy business with excellent career progression."
        ] }
      ]
    },
    "commercial-gas-engineer-essex": {
      title: "Commercial Gas Engineer (Essex)",
      sector: "Building Services & Facilities",
      location: "Essex & Surrounding Areas",
      salary: "£55,000–£60,000 per annum",
      sections: [
        { heading: "Overview", paragraphs: [
          "We are seeking an experienced Commercial Gas Engineer to join a growing engineering team covering Essex and the surrounding areas. This is an excellent opportunity to work on a portfolio of high-quality commercial contracts while enjoying a healthy work-life balance, competitive salary, and excellent employee benefits.",
          "You'll be responsible for servicing, maintaining, and repairing commercial gas systems across a variety of prestigious sites, ensuring all work is completed safely, efficiently, and to the highest standards."
        ] },
        { heading: "Key Responsibilities", items: [
          "Carry out servicing, maintenance, and repair of commercial gas appliances and heating systems.",
          "Diagnose and resolve faults across a range of commercial installations.",
          "Complete planned preventative maintenance (PPM) and reactive maintenance tasks.",
          "Ensure all work complies with current gas safety regulations and industry standards.",
          "Produce accurate service reports and certification.",
          "Deliver excellent customer service while maintaining strong client relationships.",
          "Work across a range of commercial properties within Essex and the surrounding areas."
        ] },
        { heading: "Requirements", items: [
          "ACS Commercial Gas qualifications (current and valid).",
          "Previous experience working within commercial gas maintenance.",
          "Strong fault-finding and diagnostic skills.",
          "Full UK Driving Licence.",
          "Excellent communication and customer service skills.",
          "Ability to work independently and manage your own workload."
        ] },
        { heading: "Salary & Benefits", items: [
          "£55,000–£60,000 annual salary.",
          "25 days annual leave plus Bank Holidays.",
          "No weekend work required (optional overtime available).",
          "No call-out rota.",
          "Fully expensed company van with personal use.",
          "Company pension.",
          "Uniform provided.",
          "Company mobile phone.",
          "Fuel card.",
          "Flue gas analyser and power tools supplied.",
          "Opportunity to work on prestigious commercial contracts, including government and education facilities.",
          "Supportive team environment with excellent long-term career prospects."
        ] }
      ]
    },
    "commercial-gas-engineer-guildford": {
      title: "Commercial Gas Engineer (Guildford)",
      sector: "Building Services & Facilities",
      location: "Guildford & Surrounding Areas",
      salary: "£55,000–£60,000 per annum",
      sections: [
        { heading: "The Opportunity", paragraphs: [
          "An established building services provider is looking to recruit an experienced Commercial Gas Engineer to support a growing portfolio of commercial properties across Guildford and the surrounding region.",
          "This role offers a fantastic work-life balance, a competitive salary, and the chance to work on a variety of commercial sites, carrying out planned maintenance, servicing, fault diagnosis, and repairs."
        ] },
        { heading: "What You'll Be Doing", items: [
          "Service and maintain commercial gas boilers, heating systems, and associated plant.",
          "Carry out reactive repairs and planned preventative maintenance.",
          "Diagnose faults and complete repairs efficiently to minimise downtime.",
          "Complete all job reports and compliance documentation accurately.",
          "Ensure work is carried out in line with current Gas Safe regulations and health and safety standards.",
          "Build positive relationships with clients by providing a professional and reliable service.",
          "Travel to commercial sites throughout Guildford and nearby areas."
        ] },
        { heading: "What We're Looking For", items: [
          "Current ACS Commercial Gas qualifications.",
          "Proven experience within commercial gas engineering or building services.",
          "Strong fault-finding and problem-solving abilities.",
          "Good communication and organisational skills.",
          "Ability to work independently and manage your own schedule.",
          "Full UK Driving Licence."
        ] },
        { heading: "What's On Offer", items: [
          "Competitive salary of £55,000–£60,000.",
          "Company van with fuel card and personal use.",
          "25 days annual leave plus Bank Holidays.",
          "No mandatory weekend working.",
          "Optional overtime for additional earnings.",
          "No call-out rota.",
          "Company pension scheme.",
          "Mobile phone, uniform, gas analyser, and specialist tools provided.",
          "Ongoing training and opportunities for career development.",
          "A supportive working environment with a strong focus on employee wellbeing."
        ] }
      ]
    },
    "business-development-manager-power-energy": {
      title: "Business Development Manager – Power & Energy Solutions",
      sector: "Power & Energy",
      location: "United Kingdom",
      salary: "£55,000–£60,000 per annum",
      sections: [
        { heading: "About the Role", paragraphs: [
          "An exciting opportunity has become available for an experienced Business Development Manager to join a growing organisation specialising in commercial and industrial power solutions. This position is ideal for a commercially driven professional who enjoys developing client relationships, identifying new opportunities, and delivering engineered energy projects across the UK.",
          "Working closely with internal technical and project delivery teams, you'll play a key role in expanding the company's presence within the power generation and energy infrastructure sector."
        ] },
        { heading: "Key Responsibilities", items: [
          "Develop and implement business development strategies to drive revenue growth.",
          "Identify and secure new opportunities across commercial and industrial markets throughout the UK.",
          "Build and manage a strong sales pipeline from initial enquiry through to project award.",
          "Meet with prospective clients to understand their requirements and recommend tailored energy solutions.",
          "Prepare technical proposals, quotations, and commercial tenders.",
          "Negotiate contracts and manage opportunities through the full sales process.",
          "Collaborate with engineering, operations, and project teams to ensure successful project delivery.",
          "Develop lasting relationships with consultants, contractors, end users, and key stakeholders.",
          "Keep up to date with market trends, competitor activity, and emerging technologies.",
          "Represent the business at customer meetings, industry events, and exhibitions where required."
        ] },
        { heading: "About You", paragraphs: [
          "The successful candidate will have experience in technical sales or business development within the power generation, electrical engineering, renewable energy, or wider industrial sectors. You'll ideally have:"
        ], items: [
          "Proven success in winning new business and developing long-term customer relationships.",
          "Experience managing project-based or technical sales opportunities.",
          "Strong commercial awareness with excellent negotiation skills.",
          "Experience using CRM systems such as Salesforce or equivalent.",
          "The ability to understand technical solutions and present them confidently to clients.",
          "Excellent communication, organisational, and relationship-building skills.",
          "A proactive approach with the ability to work independently and manage multiple opportunities."
        ] },
        { heading: "What's on Offer", items: [
          "Salary of £55,000–£60,000 per annum.",
          "Performance-related bonus.",
          "Company car or car allowance.",
          "Company pension scheme.",
          "Ongoing training and professional development.",
          "Clear opportunities for career progression.",
          "Exposure to high-profile commercial and industrial energy projects.",
          "Supportive and collaborative working environment."
        ] }
      ]
    },
    "regional-operations-director-data-centre": {
      title: "Regional Operations Director – Data Centre Infrastructure",
      sector: "Critical Infrastructure & Data Centres",
      location: "London, United Kingdom (Hybrid)",
      salary: "£150,000–£160,000 per annum + Bonus + Benefits",
      sections: [
        { heading: "About the Role", paragraphs: [
          "An exciting opportunity has arisen for an experienced Regional Operations Director to lead the operational performance of a growing data centre portfolio across the EMEA region. This executive-level position offers the chance to shape operational strategy, drive business performance, and support the continued expansion of a leading organisation within the critical infrastructure sector.",
          "Working closely with senior leadership, you will oversee regional operations, enhance operational standards, and lead multidisciplinary teams to deliver exceptional service across multiple high-profile facilities."
        ] },
        { heading: "Key Responsibilities", items: [
          "Provide strategic leadership for operations across a multi-site EMEA data centre portfolio.",
          "Drive operational excellence, standardisation, and continuous improvement initiatives.",
          "Lead regional engineering and operations teams, fostering a high-performance culture.",
          "Take ownership of operational budgets, financial performance, and P&L management.",
          "Build and maintain strong relationships with clients, partners, and senior stakeholders.",
          "Develop and implement operational strategies that support long-term business growth.",
          "Ensure compliance with health, safety, regulatory, and industry best practices.",
          "Work closely with executive leadership to influence business strategy and expansion plans.",
          "Identify opportunities to improve efficiency, resilience, and customer satisfaction across all sites."
        ] },
        { heading: "About You", paragraphs: [
          "We're looking for an experienced senior operations leader with a proven background in data centres, critical infrastructure, or mission-critical environments. The ideal candidate will have:"
        ], items: [
          "Extensive operational leadership experience within the data centre or critical infrastructure sector.",
          "A strong engineering or technical background.",
          "Experience managing regional or multi-site operations across the UK, Europe, or EMEA.",
          "Demonstrable P&L responsibility and strong commercial awareness.",
          "Excellent leadership and stakeholder management skills.",
          "A track record of developing high-performing operational and engineering teams.",
          "Strong strategic planning, decision-making, and organisational abilities.",
          "The ability to operate confidently at executive and board level."
        ] },
        { heading: "What's on Offer", items: [
          "Salary of £150,000–£160,000 per annum.",
          "Performance-related bonus.",
          "Hybrid working arrangement.",
          "Executive-level role with significant autonomy.",
          "Comprehensive benefits package.",
          "Opportunity to influence regional strategy and long-term business growth.",
          "Career progression within a rapidly expanding critical infrastructure organisation.",
          "Collaborative leadership team and high-profile international projects."
        ] }
      ]
    },
    "chief-operating-officer": {
      title: "Chief Operating Officer (COO)",
      sector: "Renewables & Energy Storage",
      location: "Greater London, United Kingdom",
      salary: "£230,000–£250,000 per annum + Executive Bonus & Benefits",
      sections: [
        { heading: "About the Role", paragraphs: [
          "An exceptional opportunity has arisen for an accomplished Chief Operating Officer (COO) to join a fast-growing international renewable energy business at a pivotal stage of its expansion. Reporting directly to the Chief Executive Officer, you will provide strategic leadership across the organisation, ensuring operational excellence while supporting the successful delivery of major renewable energy and infrastructure projects.",
          "As a key member of the executive leadership team, you'll help shape the company's long-term strategy, drive business performance, and lead operational functions across multiple international markets."
        ] },
        { heading: "Key Responsibilities", items: [
          "Lead the overall operational strategy, ensuring alignment with the company's long-term vision and growth plans.",
          "Oversee the successful delivery of utility-scale renewable energy and infrastructure projects from execution through to operation.",
          "Manage engineering, construction, procurement, project delivery, and operational teams to maximise efficiency and performance.",
          "Introduce scalable business processes, governance frameworks, and operational best practices.",
          "Drive continuous improvement initiatives that enhance productivity, quality, and organisational performance.",
          "Monitor key business metrics, budgets, and operational performance, reporting to the executive board.",
          "Work closely with finance, commercial, legal, and development teams to support business growth and project success.",
          "Build and mentor high-performing leadership teams across multiple regions.",
          "Maintain strong relationships with investors, clients, contractors, strategic partners, and key stakeholders.",
          "Support mergers, acquisitions, business integration, and international expansion initiatives where required."
        ] },
        { heading: "About You", paragraphs: [
          "We're looking for a proven executive leader with extensive experience managing complex operations within renewable energy, infrastructure, utilities, or other large-scale capital project environments. The ideal candidate will have:"
        ], items: [
          "Significant senior leadership experience within renewable energy, infrastructure, power generation, or a related sector.",
          "A successful track record overseeing large, complex operational businesses through periods of sustained growth.",
          "Experience delivering utility-scale renewable energy or major infrastructure projects.",
          "Strong commercial acumen, including budget management, strategic planning, and operational leadership.",
          "Experience managing international operations and geographically dispersed teams.",
          "The ability to implement operational improvements and business transformation programmes.",
          "Outstanding communication, leadership, and stakeholder management skills.",
          "Degree qualified in Engineering, Business, Project Management, or a related discipline (MBA or equivalent desirable)."
        ] },
        { heading: "What's on Offer", items: [
          "£230,000–£250,000 annual salary.",
          "Executive performance bonus.",
          "Comprehensive executive benefits package.",
          "Opportunity to shape the future of a rapidly expanding international renewable energy business.",
          "Board-level influence and strategic decision-making responsibilities.",
          "Exposure to major global renewable energy and infrastructure projects.",
          "Excellent long-term career progression within a high-growth organisation.",
          "Collaborative executive leadership team focused on innovation and sustainable growth."
        ] }
      ]
    },
    "electrical-maintenance-engineer": {
      title: "Electrical Maintenance Engineer – Commercial Building Services",
      sector: "Building Services & Facilities",
      location: "Covering London & the South East",
      salary: "£47,000–£50,000 per annum",
      sections: [
        { heading: "About the Role", paragraphs: [
          "We are looking for an experienced Electrical Maintenance Engineer to join a growing building services team supporting a diverse portfolio of commercial properties across London and the South East.",
          "This is a mobile role offering a varied workload, including planned preventative maintenance, fault finding, installations, testing, and reactive repairs. You'll be responsible for delivering a high standard of service while ensuring compliance with current industry regulations."
        ] },
        { heading: "Key Responsibilities", items: [
          "Carry out planned preventative maintenance (PPM) on commercial electrical systems.",
          "Respond to reactive maintenance and fault-finding tasks.",
          "Install and maintain lighting, power, and electrical distribution systems.",
          "Complete emergency lighting testing and routine inspections.",
          "Assist with control systems and associated electrical equipment where required.",
          "Produce accurate maintenance reports and job documentation.",
          "Ensure all work is completed safely and in accordance with current regulations.",
          "Maintain excellent customer relationships through a professional and reliable approach.",
          "Support wider building services maintenance activities when required."
        ] },
        { heading: "About You", paragraphs: [
          "To be considered, you'll ideally have:"
        ], items: [
          "NVQ Level 3 or equivalent in Electrical Installation.",
          "Proven experience within commercial electrical maintenance.",
          "Strong diagnostic and fault-finding skills.",
          "Experience working within commercial building services or facilities management.",
          "Knowledge of BMS or controls systems would be beneficial but is not essential.",
          "The ability to work independently and manage your own workload.",
          "Excellent communication and organisational skills.",
          "Full UK Driving Licence."
        ] },
        { heading: "What's on Offer", items: [
          "£47,000–£50,000 annual salary.",
          "40-hour working week.",
          "Optional overtime opportunities.",
          "28 days annual leave, including Bank Holidays.",
          "Company van and fuel card.",
          "Company pension scheme.",
          "Private healthcare.",
          "Mobile phone and workwear provided.",
          "Ongoing technical training and career development.",
          "Opportunity to work across a varied portfolio of commercial maintenance contracts within a supportive and professional environment."
        ] }
      ]
    },
    "key-account-manager-data-centre-solutions": {
      title: "Key Account Manager – Data Centre Solutions",
      sector: "Critical Infrastructure & Data Centres",
      location: "United Kingdom (Hybrid)",
      salary: "£90,000–£100,000 per annum + Uncapped Commission",
      sections: [
        { heading: "About the Role", paragraphs: [
          "An exciting opportunity has arisen for an experienced Key Account Manager to join a growing organisation supplying solutions to the rapidly expanding data centre sector. This role is ideal for a commercially driven sales professional with a proven track record of developing strategic client relationships and winning high-value business within critical infrastructure.",
          "You'll take ownership of key customer accounts while identifying new opportunities across the UK market, working closely with technical and commercial teams to deliver tailored solutions for some of the industry's largest operators and contractors."
        ] },
        { heading: "Key Responsibilities", items: [
          "Develop and manage relationships with strategic accounts across the data centre industry.",
          "Identify, pursue, and secure new business opportunities within existing and target customers.",
          "Manage the full sales process, from initial engagement through to contract negotiation and project award.",
          "Build long-term account growth strategies to maximise revenue and customer retention.",
          "Work closely with engineering, operations, and commercial teams to deliver customer-focused solutions.",
          "Prepare proposals, presentations, and commercial quotations.",
          "Engage with senior stakeholders and decision-makers across client organisations.",
          "Monitor market activity, competitor trends, and emerging opportunities within the data centre sector.",
          "Maintain accurate sales forecasts and CRM records.",
          "Represent the business at client meetings, exhibitions, and industry events."
        ] },
        { heading: "About You", paragraphs: [
          "The successful candidate will have a strong background in business development or strategic account management within the data centre, electrical, critical infrastructure, or technical engineering sectors. You'll ideally have:"
        ], items: [
          "A proven history of winning and growing major customer accounts.",
          "Experience selling technical or engineered products and solutions.",
          "Excellent commercial awareness and negotiation skills.",
          "Strong understanding of the data centre market and its key stakeholders.",
          "Outstanding communication and relationship-building abilities.",
          "The confidence to engage with senior executives and decision-makers.",
          "Experience using CRM systems to manage opportunities and sales pipelines.",
          "A degree in Engineering, Science, Business, or equivalent industry experience is advantageous."
        ] },
        { heading: "What's on Offer", items: [
          "£90,000–£100,000 annual salary.",
          "Uncapped commission structure.",
          "Hybrid working.",
          "Company pension scheme.",
          "Ongoing training and career development.",
          "Opportunity to work within one of the fastest-growing sectors in critical infrastructure.",
          "Clear progression opportunities within a growing commercial team.",
          "Supportive and collaborative working environment."
        ] }
      ]
    },
    "bd-director-data-centres": {
      title: "Business Development Director – Data Centres",
      sector: "Critical Infrastructure & Data Centres",
      location: "UK & Ireland (Hybrid / Home-Based)",
      salary: "£120,000–£150,000 + Bonus + Benefits",
      sections: [
        { heading: "The Opportunity", paragraphs: [
          "We're recruiting on behalf of a global manufacturer of critical power and energy infrastructure for a senior commercial leadership role within its rapidly growing Data Centre division.",
          "This is an opportunity to lead business development across the UK & Ireland, driving growth within the hyperscale, colocation and enterprise data centre sectors. You'll be responsible for developing strategic customer relationships, identifying new business opportunities and leading the pursuit of major infrastructure projects from early engagement through to contract award.",
          "Working closely with engineering, technical and commercial teams, you'll help deliver tailored power solutions for mission-critical environments while strengthening the company's position within the UK & Ireland data centre market."
        ] },
        { heading: "Key Requirements", items: [
          "Proven experience selling into the data centre sector.",
          "Strong understanding of critical power, electrical infrastructure or mission-critical systems.",
          "Experience managing complex, high-value sales opportunities.",
          "Established relationships across the UK & Ireland data centre market.",
          "Commercially driven with excellent stakeholder management and negotiation skills."
        ] },
        { heading: "Why This Role", paragraphs: [
          "This is an excellent opportunity to join an internationally recognised business at a time of significant investment and growth within one of the fastest-growing sectors in infrastructure."
        ] }
      ]
    },
    "hv-project-manager": {
      title: "HV Project Manager – Transmission & Distribution",
      sector: "Power & Energy",
      location: "North West England (Site-Based)",
      salary: "£65,000–£80,000 + Car + Package",
      sections: [
        { heading: "The Opportunity", paragraphs: [
          "We're partnering with a leading transmission & distribution contractor to find an experienced HV Project Manager to lead the delivery of substation and grid reinforcement schemes across the North West. With record investment flowing into network upgrades, this is a business with a full order book and a genuine pipeline of long-term work.",
          "Reporting to the Contracts Director, you'll take end-to-end ownership of projects up to 132kV — managing programme, budget, safety and quality from mobilisation through to energisation. You'll lead multidisciplinary site teams and subcontractors, and act as the key point of contact for the client and DNO stakeholders throughout.",
          "This is a hands-on leadership role for someone who knows what good looks like on an HV site, and who wants the autonomy to run their projects their way."
        ] },
        { heading: "Key Requirements", items: [
          "Proven project management experience on HV substation or grid infrastructure projects.",
          "Strong working knowledge of transmission & distribution networks up to 132kV.",
          "A track record of delivering projects safely, on programme and on budget.",
          "Confident managing site teams, subcontractors and DNO / client stakeholders.",
          "NEBOSH / SMSTS and a relevant engineering qualification (HNC/HND/degree) preferred."
        ] },
        { heading: "Why This Role", paragraphs: [
          "You'll join a contractor at the heart of the UK's grid transformation, with a secure pipeline, a supportive senior team and a clear route into a Senior PM or Contracts Manager position as the business grows."
        ] }
      ]
    },
    "me-contract-manager": {
      title: "Critical Facilities / M&E Contract Manager",
      sector: "Building Services & Facilities",
      location: "London (Hybrid)",
      salary: "£70,000–£85,000 + Benefits",
      sections: [
        { heading: "The Opportunity", paragraphs: [
          "A market-leading building services provider is looking for a Critical Facilities / M&E Contract Manager to take ownership of hard-services delivery across a portfolio of high-profile commercial and mission-critical estates in central London.",
          "You'll be accountable for the safe, compliant and efficient operation of building services across your sites — leading a team of shift and mobile engineers, managing planned and reactive maintenance, and holding the commercial performance of the contract. Working closely with the client, you'll drive continuous improvement, manage supply-chain partners and ensure critical systems never miss a beat.",
          "It's a role that blends engineering leadership, client relationship management and commercial ownership — ideal for an M&E professional ready to step up and run a flagship contract."
        ] },
        { heading: "Key Requirements", items: [
          "Strong M&E or building services background, ideally within critical environments.",
          "Experience managing hard-services / FM contracts and leading engineering teams.",
          "Sound understanding of statutory compliance, PPM regimes and SLA / KPI delivery.",
          "Commercial awareness — P&L, budgets and supply-chain management.",
          "Excellent client-facing and stakeholder communication skills."
        ] },
        { heading: "Why This Role", paragraphs: [
          "You'll take the lead on a prestigious, high-visibility contract with a provider that invests in its people — with genuine scope to grow into a Senior or Account Director remit."
        ] }
      ]
    },
    "bess-project-manager": {
      title: "BESS Project Manager – Grid-Scale Storage",
      sector: "Renewables & Energy Storage",
      location: "UK (Remote with site travel)",
      salary: "£75,000–£95,000 + Bonus",
      sections: [
        { heading: "The Opportunity", paragraphs: [
          "We're working with a fast-scaling energy storage developer to appoint a BESS Project Manager to lead the delivery of grid-scale battery projects across the UK. Backed by significant investment and a growing pipeline of consented sites, this is a business helping to balance the grid as renewables come online.",
          "You'll own projects from financial close through construction to energisation and handover — managing EPC contractors, grid connection works, budgets and programme. Acting as the developer's representative on site, you'll drive safety, quality and commercial performance, and keep a wide group of stakeholders — from DNOs and National Grid to landowners and investors — aligned and informed.",
          "This is a genuinely mission-led role at the sharp end of the energy transition, with the autonomy to shape how projects are delivered."
        ] },
        { heading: "Key Requirements", items: [
          "Project management experience delivering BESS, solar, or grid-connection infrastructure.",
          "Understanding of the grid connection process and DNO / National Grid requirements.",
          "Experience managing EPC contractors and multi-million-pound project budgets.",
          "Strong commercial, programme and stakeholder-management capability.",
          "A relevant engineering or construction background and a full UK driving licence."
        ] },
        { heading: "Why This Role", paragraphs: [
          "Join a developer at an inflection point, with a long-term pipeline, equity upside and the chance to build and lead a delivery team as the portfolio scales."
        ] }
      ]
    }
  };

  function buildApplicationMessage(job) {
    var lines = [];
    lines.push("I'd like to apply for: " + job.title);
    lines.push("");
    lines.push("Location: " + job.location);
    lines.push("Salary: " + job.salary);
    job.sections.forEach(function (s) {
      lines.push("");
      lines.push(s.heading.toUpperCase());
      lines.push("");
      if (s.paragraphs) lines.push(s.paragraphs.join("\n\n"));
      if (s.items) {
        s.items.forEach(function (it) { lines.push("- " + it); });
      }
    });
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

  /* ---------- Job detail: floating "Apply Now" pill ----------
     Only exists on pages with an .apply-box (the job detail pages). Mirrors the real
     Apply Now link, follows the reader, and hides while the real apply panel is on
     screen (CSS restricts it to mobile/tablet — see .floating-apply). */
  var applyBox = document.querySelector(".apply-box");
  var applyPrimary = applyBox ? applyBox.querySelector(".btn-primary") : null;
  if (applyBox && applyPrimary) {
    var fab = document.createElement("div");
    fab.className = "floating-apply";
    var fabBtn = document.createElement("a");
    fabBtn.className = "btn btn-primary floating-apply-btn";
    fabBtn.setAttribute("href", applyPrimary.getAttribute("href"));
    fabBtn.innerHTML =
      'Apply Now <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    fab.appendChild(fabBtn);
    document.body.appendChild(fab);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          // show the pill whenever the real apply panel is NOT on screen
          fab.classList.toggle("show", !entries[0].isIntersecting);
        },
        { threshold: 0, rootMargin: "0px 0px -15% 0px" }
      ).observe(applyBox);
    } else {
      fab.classList.add("show");
    }
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
