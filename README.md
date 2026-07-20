# Senatek Recruitment — Website Documentation

> Project reference for the Senatek Recruitment website: company research, brand system,
> page-by-page content map, technical notes and outstanding items.
> Last updated: 20 July 2026.

---

## 1. What this site is for

A multi-page marketing website for **Senatek Recruitment Ltd** — a specialist recruitment
consultancy. The site's job is to:

- Position Senatek as a **premium, founder-led talent partner** (not a volume CV agency)
  for the energy and infrastructure sectors.
- Convert two audiences: **clients** (employers briefing permanent roles) and
  **candidates** (professionals exploring their next move).
- Look dramatically better than typical recruitment sites — the design bar was set by
  [hub-scale.com](https://www.hub-scale.com/) and the brief was to exceed it.

It replaces the previous one-page GoDaddy placeholder at
[senatekrecruitment.com](https://senatekrecruitment.com/).

**Current scope:** permanent recruitment only (no contract/interim). A **Job Opportunities**
board (`jobs.html` + individual role pages) launched in v0.0.2 with four example postings.

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
  light-streak arc motif. Also used as the site's Open Graph share image.
- `images/Design2.jpeg` — business-card style layout: wordmark (orange apex on the A),
  Jordan's contact details, tagline, sector icon row.
- Example/benchmark site: https://www.hub-scale.com/ — notable for its floating pill nav,
  rounded card sections, light/dark contrast pacing, scroll reveals, client/candidate
  dual funnel. Senatek's site inverts its formula: cinematic dark canvas where amber
  light is the hero element.

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
Recreated in HTML/CSS (no logo file exists yet): `SENATEK` in white Space Grotesk with a
small **orange triangle apex above the A** (`.a-mark`), `RECRUITMENT` letter-spaced in
amber beneath.

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
4. **Founder section** — photo frame (currently a styled "JC" placeholder — see §6),
   bio, pull-quote *"Behind every project powering tomorrow, there's a person who made it
   happen. My job is finding them."*, Email + LinkedIn buttons.
5. CTA band.

### `sectors.html` — Sectors
1. Page hero — "Four sectors. Total focus."
2. Four alternating **sector rows** (anchors: `#power-energy`, `#data-centres`,
   `#building-services`, `#renewables`), each with a glowing icon panel, sector narrative
   and pill **role tags** (roles listed in §2).
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

Four example postings ship at launch, one per sector, each its own detail page:
`job-bd-director-data-centres.html`, `job-hv-project-manager.html`,
`job-me-contract-manager.html`, `job-bess-project-manager.html`.

**Job detail page pattern** (all four follow it):
1. Page hero — back-link to `jobs.html`, sector eyebrow, job title, meta pills
   (location, salary, employment type).
2. **`.job-figure`** — a gradient + line-icon visual panel keyed to the role's sector,
   captioned *"Real photography incoming"* (placeholder until real site/office photography
   is supplied — see §6).
3. Two-column **body**: narrative copy + **Key Requirements** checklist (amber ticks) on
   the left; a **sticky apply box** on the right (*Apply Now* → `contact.html?type=
   candidate&role=…`, *Email Your CV* mailto with the role in the subject line).
4. CTA band linking back to the full list / Register Your Interest.
5. Per-role **`JobPosting` JSON-LD** (title, description, salary, location, employment
   type) for Google Jobs eligibility.

The contact form (`js/main.js`) reads a `?role=` query param and pre-fills the message
field with the role name, in addition to the existing `?type=client|candidate` toggle.

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

---

## 5. Technical notes

- **Stack:** static HTML + CSS + vanilla JS. No framework, no build step. Hostable on
  anything (GoDaddy, Netlify, Cloudflare Pages…).
- **Files:** eleven `.html` pages (six core pages + `jobs.html` + four job detail pages) ·
  `css/styles.css` (design system) · `js/main.js` (nav, reveals, counters, streak draw,
  embers, timeline, form toggle, job sector filter, `?role=` prefill) ·
  `images/` (brand reference JPEGs, Design1 doubles as OG image).
- **SEO:** unique title/meta description + OG tags per page; Organization JSON-LD on the
  home page (includes founder, contact, areaServed, LinkedIn sameAs); `JobPosting` JSON-LD
  on each job detail page; semantic markup; favicon is an inline SVG (orange apex mark on
  dark).
- **Accessibility:** aria-current nav states, aria labels on toggles, focus styles on
  inputs, `prefers-reduced-motion` support, `aria-live` form status.
- **Responsive:** fluid type, grids collapse (4→2→1), split panels stack, nav becomes a
  full-screen menu below 900px. Verified at 375px and desktop widths.

---

## 6. Outstanding items / swap-in points

1. **Founder photo** — `about.html` shows a styled "JC" placeholder. Replace with
   `assets/jordan-camm.jpg` (a comment in the file marks the exact spot):
   `<img src="assets/jordan-camm.jpg" alt="Jordan Camm, Director of Senatek Recruitment">`
2. **Contact form backend** — form currently shows a client-side success message only.
   Point the form `action` (and the marked handler in `js/main.js`) at the mail endpoint
   when hosting is arranged; submissions should deliver to **Jordan@senatekrecruitment.com**.
   All fields are named and ready (`name`, `email`, `phone`, `company` / `current_role`,
   `sector`, `message`, hidden `enquiry_type`).
3. **Logo files** — no vector/PNG logo exists; the wordmark is coded in HTML/CSS. If a
   proper logo is produced later, swap it into `.brand` in the nav/footer.
4. **Job posting photography** — each job detail page's `.job-figure` banner is currently
   a styled gradient + line-icon placeholder (captioned "Real photography incoming"),
   matching the founder-photo treatment in §6.1. Swap in real site/office photography per
   role when available — the markup comment in each `job-*.html` marks the spot.
5. **Job postings are illustrative** — the four roles on `jobs.html` are example/sample
   postings drafted to demonstrate the page, not live vacancies. Replace with real briefs
   (and add/remove postings) as roles come in; each is a self-contained HTML file so this
   is a copy-and-content edit, no rebuild needed.
6. **Future additions (out of scope for v1):** contract/interim services, testimonials/
   client logos, insights/blog, privacy policy page (worth adding before the form goes
   live), analytics, and (longer-term) turning the jobs board into a CMS-backed listing
   if the number of live roles grows beyond what's practical to hand-maintain.
