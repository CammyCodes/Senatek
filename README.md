# Senatek Recruitment — Website Documentation

> Project reference for the Senatek Recruitment website: company research, brand system,
> and page-by-page content map.
> Last updated: 21 July 2026 (v0.0.10).

For technical implementation details, deployment/hosting info, versioning, and developer
working notes, see **[AGENT.md](AGENT.md)**. For generating new site imagery, see
**[IMAGE-BRIEF.md](IMAGE-BRIEF.md)**.

---

## 1. What this site is for

A multi-page marketing website for **Senatek Recruitment Ltd** — a specialist recruitment
consultancy. The site's job is to:

- Position Senatek as a **premium, founder-led talent partner** (not a volume CV agency)
  for the energy and infrastructure sectors.
- Convert two audiences: **clients** (employers briefing permanent roles) and
  **candidates** (professionals exploring their next move).
- Look dramatically better than typical recruitment sites — cinematic and premium
  rather than a generic corporate template.

It replaces the previous one-page GoDaddy placeholder at
[senatekrecruitment.com](https://senatekrecruitment.com/).

**Current scope:** permanent recruitment only (no contract/interim). A **Job Opportunities**
board (`jobs.html` + individual role pages) launched in v0.0.2 and carries twelve live
postings as of v0.0.4 (see §4).

---

## 2. Company research

### Company facts (Companies House)
| Field | Value |
|---|---|
| Legal name | SENATEK RECRUITMENT LIMITED |
| Company number | 16446557 |
| Incorporated | 13 May 2025 |
| Status | Active — Private limited company |
| Registered office | 16 Winchester Close, Worksop, England, S81 0PW |
| SIC code | 96090 — Other service activities n.e.c. |
| Source | https://find-and-update.company-information.service.gov.uk/company/16446557 |

### Positioning (LinkedIn + brand imagery)
- **LinkedIn:** https://www.linkedin.com/company/senatek-recruitment
- Tagline used on LinkedIn: *"Expert recruitment solutions, tailored to your business needs."*
- Positioned as a **talent partner** to engineering/manufacturing businesses — works with
  leadership teams, aligns hiring with business objectives rather than just filling vacancies.
- Specialties listed: Engineering Recruitment, Manufacturing Recruitment, Permanent
  Staffing, Strategic Partnerships.
- Founded 2025 · 1 employee (founder-led) · Coverage: **UK & Europe**.

### The founder
- **Jordan Camm — Founder & Director**
- Email: Jordan@senatekrecruitment.com
- Phone: +44 7568 572 675
- Background (as positioned on site): experience across built-environment and energy
  recruitment markets; personally manages every search end-to-end.

### The four sectors (from brand imagery + LinkedIn)
1. **Power & Energy** — HV/LV, power systems, protection & control, SAP/AP, T&D project
   managers, commissioning, site/project managers.
2. **Critical Infrastructure & Data Centres** — critical facilities engineers, shift
   engineers, CSA/MEP PMs, commissioning managers, ops managers, EHS, white space techs.
3. **Building Services & Facilities** — M&E, BMS, HVAC, facilities managers, maintenance
   engineers, project engineers, contract managers.
4. **Renewables & Energy Storage** — solar PV, wind, BESS, grid connection, O&M,
   development managers, asset managers.

### Brand taglines (from the supplied design images)
- Primary: **"Powering Connections. Building Futures."**
- Secondary: **"Powering Tomorrow — connecting leading talent with the projects that
  build a better future."**

### Design references
- `images/Design1.jpeg` — banner: logo, four sector icons, energy-sunset imagery,
  light-streak arc motif. Was the site-wide Open Graph image until v0.0.8; **no longer
  referenced by any page** (the fallback card is now `images/og-default.jpg`). Kept as a
  design reference.
- `images/Design2.jpeg` — business-card style layout: wordmark (orange apex on the A),
  Jordan's contact details, tagline, sector icon row.

### Sector photography
Client-supplied 16:9 sector banners — dark, sunset-lit industrial photography with the
light-streak arc sweeping across the frame, the wordmark and the sector title set into the
left ~40%. Held in `images/sectors/` as three files per sector:

| File | Use |
|---|---|
| `<sector>-og.jpg` | The full banner, branding intact — **Open Graph cards only** |
| `<sector>-wide.jpg` | 21:9 crop, photography only — job detail page banners |
| `<sector>-tile.jpg` | 4:3 crop, photography only — `sectors.html` sector rows |

The crops deliberately discard the branded left-hand panel: on-page, the wordmark is
already in the nav and footer and the sector name is already the heading, so the full
banner would triple up on both. Off-page, on a share card, that same branding is exactly
what you want.

**All four sectors are complete as of v0.0.8.** Power & Energy, Data Centres and Building
Services came from client-supplied banners; Renewables & Energy Storage was generated to
match and its branded share card composited in-repo, so that sector also keeps
`renewables-source.jpg` (the un-branded master).

Beyond the sectors, v0.0.8 added page hero backgrounds (`hero-*.jpg`), client/candidate
journey imagery, home-page split-panel textures and a generic `og-default.jpg` share card.
For the style rules, prompts, naming and post-processing behind all of it — and before
generating anything new — see **[IMAGE-BRIEF.md](IMAGE-BRIEF.md)**.

---

## 3. Brand & design system

### Colours
| Token | Hex / value | Use |
|---|---|---|
| `--bg` | `#07090e` | Page background (near-black) |
| `--bg-raised` | `#0c1017` | Raised panels |
| `--bg-panel` | `#10151f` | Cards/visual panels |
| `--amber` | `#f7941d` | **Primary brand orange** |
| `--amber-bright` | `#ffb84d` | Gradient highlight / hover |
| `--amber-deep` | `#e8720c` | Gradient depth |
| `--amber-glow` | `rgba(247,148,29,0.35)` | Glows and shadows |
| `--text` | `#f4f2ee` | Headings / primary text |
| `--text-dim` | `#a8adb8` | Body copy |
| `--text-faint` | `#6b7280` | Captions, labels |
| `--grad-amber` | `linear-gradient(100deg, #ffb84d → #f7941d → #e8720c)` | Buttons, gradient text, accents |

Rule of thumb: orange is used **sparingly** (accents, one or two gradient words per
headline, icons, CTAs) so it stays electric against the dark canvas.

### Typography (Google Fonts)
- **Space Grotesk** (500/600/700) — display: headlines, buttons, wordmark, numbers.
- **Inter** (400/500/600) — body copy.
- Fluid sizing via `clamp()` throughout; hero display ~2.6–4.9rem.

### Wordmark
`images/main-logo.png` — a real logo file (transparent PNG, processed from the client's
square source JPEG; see AGENT.md §3.3 in Outstanding items for how). `SENATEK` in white with a
small **orange triangle apex above the A** and a thin amber underline glow, used via the
`.brand-logo` class in the nav and footer on every page. Earlier versions of this site
(pre-v0.0.3) recreated the wordmark in HTML/CSS text since no logo file existed yet —
that approach has been fully replaced; there is no text-wordmark fallback in the current
codebase.

### Signature motifs & effects
- **Light-streak arc** — animated SVG paths (stroke-dash draw-on) sweeping across the
  home hero; echoes the arc in the brand imagery.
- **Ember particles** — subtle drifting canvas particles in the hero.
- **Scroll reveals** — IntersectionObserver fade/rise with per-element stagger (`--rd`).
- **Animated stat counters**, **cursor-tracking card glow**, **glowing process timeline**
  that fills as you scroll, **sector marquee strip**, glass nav that shrinks/blurs on
  scroll, full-screen mobile menu.
- All motion is CSS-transform based and disabled under `prefers-reduced-motion`.

---

## 4. Site structure — what's on each page

Shared on every page: fixed glass **nav** (Home / About / Sectors / Job Opportunities /
For Clients / For Candidates + "Get in Touch" CTA) and **footer** (wordmark + blurb,
Explore links, Sector links, contact details, company number line).

### `index.html` — Home
1. **Hero** — animated light streaks + embers, eyebrow "Specialist Recruitment · UK & Europe",
   headline "Powering **Connections.** Building **Futures.**" (staggered word reveal),
   dual CTAs: *Hire Talent* → `contact.html?type=client`, *Find a Role* → `contact.html?type=candidate`.
2. **Sector marquee strip** — scrolling ticker of the four sector names.
3. **Intro** — "A talent partner for the projects powering tomorrow" + Our Story link.
4. **Stats band** — 4 Specialist Sectors · 24hr Response Time · 1 Point of Contact ·
   100% Founder-Led Delivery (animated counters).
5. **Sector cards** — four hover-glow cards with custom line icons, linking to sector anchors.
6. **Split panel** — For Clients vs For Candidates, mirrored value bullets + CTAs.
7. **Why Senatek** — 01 Founder-led / 02 Sector depth / 03 Partnership over placement.
8. **CTA band** — "Ready to make your next connection?" + phone button.

### `about.html` — About
1. Page hero — "Built to power tomorrow's workforce".
2. **Our Story** — founded 2025 by Jordan Camm; why the four-sector focus; delivery promise.
3. **Values** — 01 Partnership · 02 Precision · 03 Pace · 04 Integrity.
4. **Founder section** — photo frame showing `images/Jordan1.jpeg` (real headshot, see
   AGENT.md §3.1),
   bio, pull-quote *"Behind every project powering tomorrow, there's a person who made it
   happen. My job is finding them."*, Email + LinkedIn buttons.
5. CTA band.

### `sectors.html` — Sectors
1. Page hero — "Four sectors. Total focus."
2. Four alternating **sector rows** (anchors: `#power-energy`, `#data-centres`,
   `#building-services`, `#renewables`), each with a visual panel, sector narrative
   and pill **role tags** (roles listed in §2). All four panels show sector photography
   (see "Sector photography" in §2).
3. CTA band with both client and candidate CTAs.

### `jobs.html` — Job Opportunities
1. Page hero — "Roles powering tomorrow" + intro noting many roles are never advertised.
2. **Sector filter bar** — All / Power & Energy / Data Centres / Building Services /
   Renewables pills, filters the grid client-side (`js/main.js`), with a "no results"
   message for empty sectors.
3. **Job card grid** (2-column, `.job-grid` / `.job-card`) — each card shows sector tag,
   icon, title, **location & salary meta pills**, teaser and a *View Role* link through to
   its own detail page.
4. CTA band — "The best roles are never advertised" + Register Your Interest / Email CV.

**Live roles** (real briefs supplied by Jordan, not placeholders), one detail page each:

| Detail page | Role | Sector |
|---|---|---|
| `job-head-of-solar-operations.html` | Head of Solar Operations (Solar & BESS) | Renewables & Energy Storage |
| `job-commercial-gas-engineer-essex.html` | Commercial Gas Engineer | Building Services & Facilities |
| `job-commercial-gas-engineer-guildford.html` | Commercial Gas Engineer | Building Services & Facilities |
| `job-business-development-manager-power-energy.html` | Business Development Manager – Power & Energy Solutions | Power & Energy |
| `job-regional-operations-director-data-centre.html` | Regional Operations Director – Data Centre Infrastructure | Critical Infrastructure & Data Centres |
| `job-chief-operating-officer.html` | Chief Operating Officer (COO) | Renewables & Energy Storage |
| `job-electrical-maintenance-engineer.html` | Electrical Maintenance Engineer – Commercial Building Services | Building Services & Facilities |
| `job-key-account-manager-data-centre-solutions.html` | Key Account Manager – Data Centre Solutions | Critical Infrastructure & Data Centres |
| `job-bd-director-data-centres.html` | Business Development Director – Data Centres | Critical Infrastructure & Data Centres |
| `job-hv-project-manager.html` | HV Project Manager – Transmission & Distribution | Power & Energy |
| `job-me-contract-manager.html` | Critical Facilities / M&E Contract Manager | Building Services & Facilities |
| `job-bess-project-manager.html` | BESS Project Manager – Grid-Scale Storage | Renewables & Energy Storage |

To add, edit, or remove a posting, use the **`job-listings` skill**
(`.claude/skills/job-listings/SKILL.md`) — it documents the three places every job lives
(detail page, `jobs.html` card, `JOBS` entry in `js/main.js`) and the exact templates/sector
reference needed to keep them in sync.

**Job detail page pattern** (all of the above follow it):
1. Page hero — back-link to `jobs.html`, sector eyebrow, job title, meta pills
   (location, salary, employment type).
2. **`.job-figure`** — a 21:9 banner showing the role's **sector photography**
   (`images/sectors/<sector>-wide.jpg`, keyed to the page's `data-sector`). Four images
   cover all twelve roles; swapping in role-specific site/office shots is still an option
   if the client supplies them (see AGENT.md §3.4).
3. Two-column **body**: narrative copy in named sections (each role keeps its own original
   section headers as supplied — e.g. "Key Responsibilities" vs "What You'll Be Doing",
   "Requirements" vs "About You" vs "What We're Looking For", "Benefits" vs "Salary &
   Benefits" vs "What's on Offer" — content is reproduced verbatim, not paraphrased) with
   amber-tick checklists on the left; a **sticky apply box** on the right (*Apply Now* →
   `contact.html?type=candidate&job=<slug>`, *Email Your CV* mailto with the role in the
   subject line).
4. CTA band linking back to the full list / Register Your Interest.
5. Per-role **`JobPosting` JSON-LD** (title, description, salary, location, employment
   type) for Google Jobs eligibility.

The contact form (`js/main.js`) reads the `?job=<slug>` query param, looks up the matching
entry in the `JOBS` data object (each entry has a `sections` array of `{heading,
paragraphs?, items?}` mirroring the detail page's own structure), selects the matching
**Sector**, and pre-fills the message field with the full role — title, location, salary,
and every section verbatim — in addition to the existing `?type=client|candidate` toggle.

### `clients.html` — For Clients
1. Page hero — "Hires that stick" + *Brief a Role* CTA.
2. **Why clients choose Senatek** — Search not sift / Vetted to stick / Founder accountability.
3. **Process timeline** (glowing line fills on scroll):
   1 Discover → 2 Search → 3 Vet → 4 Present → 5 Support.
4. CTA band — 24hr response promise.

### `candidates.html` — For Candidates
1. Page hero — "Power your career" + *Register Your Interest* CTA.
2. **What you get** — Access to real projects / Honest expert advice / Total confidentiality.
3. **What to expect** timeline — proper conversation → right opportunities only →
   preparation that counts → support to the finish.
4. CTA band — includes *Email Your CV* mailto button.

### `contact.html` — Contact
1. Page hero — "Let's talk" (24hr response promise).
2. **Direct lines** — phone, email, LinkedIn, UK & Europe coverage cards.
3. **Form** with **I'm Hiring / I'm a Candidate toggle**:
   - Shared fields: name*, email*, phone, sector (select), message*.
   - Client mode adds **Company**; candidate mode swaps in **Current/Recent Role** and a
     confidential-CV note.
   - Hidden `enquiry_type` field records the mode; `?type=client|candidate` in the URL
     pre-selects the toggle (used by CTAs across the site).
   - `?job=<slug>` (set by every job detail page's Apply button) pre-selects the matching
     **Sector** and pre-fills the message field with the full role — title, location,
     salary, description, Key Requirements and closing line — verbatim, sourced from a
     `JOBS` data object in `js/main.js` that mirrors each `job-*.html` page.

