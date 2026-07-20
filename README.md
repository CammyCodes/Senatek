# Senatek Recruitment — Website Documentation

> Project reference for the Senatek Recruitment website: company research, brand system,
> page-by-page content map, technical notes, deployment info and outstanding items.
> Last updated: 21 July 2026 (v0.0.5).

**Quick orientation for an agent picking this up cold:** static HTML/CSS/JS, no build
step, no CMS, no backend — every page is a hand-authored file you edit directly. Live at
**https://cammycodes.github.io/Senatek/** (GitHub Pages, `CammyCodes/Senatek`, deployed
from `master`). Full deployment details and version history: §6. Job postings are the one
piece of content that changes often — use the **`job-listings` skill**
(`.claude/skills/job-listings/SKILL.md`) rather than re-deriving the pattern, and always
reproduce a supplied job posting's wording **verbatim** (see §4). Read this file before
making changes; it has caught real bugs and stale-copy issues that weren't obvious from
the code alone.

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
`images/main-logo.png` — a real logo file (transparent PNG, processed from the client's
square source JPEG; see §7.3 in Outstanding items for how). `SENATEK` in white with a
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
4. **Founder section** — photo frame showing `images/Jordan1.jpeg` (real headshot, see §7.1),
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
2. **`.job-figure`** — a gradient + line-icon visual panel keyed to the role's sector,
   captioned *"Real photography incoming"* (placeholder until real site/office photography
   is supplied — see §7.4).
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

---

## 5. Technical notes

- **Stack:** static HTML + CSS + vanilla JS. No framework, no build step. Hostable on
  anything (GoDaddy, Netlify, Cloudflare Pages…).
- **Files:** nineteen `.html` pages (six core pages + `jobs.html` + twelve job detail
  pages) · `css/styles.css` (design system) · `js/main.js` (nav, reveals, counters, streak
  draw, embers, timeline, form toggle, job sector filter, job application prefill) ·
  `images/` (brand reference JPEGs, `main-logo.png`, founder photos, Design1 doubles as OG
  image) · `.claude/skills/job-listings/SKILL.md` (workflow reference for adding/editing/
  removing job postings).
- **Branding:** `images/main-logo.png` — a transparent PNG cropped tightly to the wordmark
  (see §7.3 for how it was produced from the client's square source file) — is used as the
  nav and footer wordmark everywhere via `.brand-logo`, sized by height with its natural
  aspect ratio.
- **SEO:** unique title/meta description + OG tags per page; Organization JSON-LD on the
  home page (includes founder, contact, areaServed, LinkedIn sameAs); `JobPosting` JSON-LD
  on each job detail page; semantic markup; favicon is an inline SVG (orange apex mark on
  dark).
- **Accessibility:** aria-current nav states, aria labels on toggles, focus styles on
  inputs, `prefers-reduced-motion` support, `aria-live` form status.
- **Responsive:** fluid type, grids collapse (4→2→1), split panels stack, nav becomes a
  full-screen menu below 900px. Verified at 375px and desktop widths.
- **Mobile nav — three separate fixes** (the full-screen menu overlay `.nav-links` below
  900px was surprisingly bug-prone; all three were needed):
  1. **Scroll-lock** (`js/main.js`): opening the menu pins `<body>` with `position: fixed`
     at the current scroll offset and restores it (instantly, `behavior: "instant"` to
     bypass the site's `scroll-behavior: smooth`) on close/link-click, so the background
     doesn't scroll behind the menu.
  2. **Opaque overlay, item-only animation** (v0.0.5, `css/styles.css`): the overlay no
     longer fades its whole self (`opacity 0→1`) — fading a solid-background element makes
     the background translucent mid-transition, so page content bled through for ~0.4s.
     Instead the backdrop is toggled via `visibility` (always fully opaque when shown) and
     only the menu *items* animate (staggered opacity + translateY) on top of it. Also
     makes the links non-focusable while hidden (a11y win).
  3. **No `backdrop-filter` on the scrolled nav, on mobile** (v0.0.5, `css/styles.css`):
     **the important one.** `.nav.scrolled` applies `backdrop-filter: blur(18px)`, and a
     `backdrop-filter` (like `transform`/`filter`) makes its element the *containing block
     for `position: fixed` descendants*. Since `.nav-links` is a fixed descendant of
     `.nav`, whenever you opened the menu **while scrolled** the "full-screen" overlay was
     sized to the ~82px nav bar instead of the viewport, and the menu items spilled over
     the visible page for a split second (until the scroll-lock reset dropped the
     `.scrolled` class and its blur). Fix: at ≤900px, `.nav.scrolled` uses a near-solid
     `rgba(7,9,14,0.95)` background and **no** `backdrop-filter` — no blur, no containing
     block, overlay always fills the viewport. Desktop keeps the blur (its `.nav-links`
     is not `position: fixed`, so it was never affected). See §8 for the general gotcha.
- **Cache-busting (v0.0.5):** the stylesheet is linked as `css/styles.css?v=0.0.5` on every
  page. The `?v=` query is bumped whenever `styles.css` changes so browsers (and the Pages
  CDN) fetch the new file instead of a stale cached copy. This matters especially when the
  client previews via `file://` while iterating — browsers cache `file://` subresources
  aggressively, so without the query bump an edit to the CSS may not show up on reload.
  Keep the query in sync with the release version when you change the stylesheet.
- **Native form control theming:** `color-scheme: dark` (root) plus explicit
  `<option>` background/color rules fix the sector `<select>` popup rendering with a
  white background in Chromium-based browsers.

---

## 6. Deployment & repository

- **Repository:** [github.com/CammyCodes/Senatek](https://github.com/CammyCodes/Senatek)
  (GitHub account: CammyCodes). Single branch, `master` — no `develop`/feature-branch
  workflow in use; commits go straight to `master`.
- **Live site:** **https://cammycodes.github.io/Senatek/** — GitHub Pages, configured to
  build from the `master` branch root (no `/docs` folder, no build step — it serves the
  repo's HTML files directly). Pushing to `master` redeploys automatically, usually live
  within a minute or two.
- **Production domain:** the site is written to eventually replace the placeholder at
  [senatekrecruitment.com](https://senatekrecruitment.com/) (see §1), but that domain is
  **not currently pointed** at this repo/Pages site — the GitHub Pages URL above is the
  only live URL right now. Pointing the custom domain (CNAME/DNS + a `CNAME` file in the
  repo) is not yet done.
- **Local preview:** no dev server needed — from the repo root run
  `python -m http.server 8000` (or any static file server) and open
  `http://localhost:8000/index.html`. Opening files directly via `file://` mostly works
  too, but the sector-filter/apply-prefill JS and some relative asset paths behave more
  reliably over `http://`.
- **Versioning:** annotated git tags `v0.0.1`–`v0.0.4`, bumped for most content/feature
  changes (see table below). Not every commit gets a new tag — small content-only changes
  (e.g. adding/restoring a job posting) have shipped as plain commits on top of the current
  tag when the user asked to "keep this as vX" rather than bump. Check `git tag -n99` for
  the authoritative list and `git log --oneline` for the full commit history; don't assume
  the tag list alone tells the whole story.
- **Commit convention:** descriptive commit messages, `Co-Authored-By: Claude Sonnet 5
  <noreply@anthropic.com>` trailer on AI-assisted commits, annotated tags
  (`git tag -a vX.Y.Z -m "..."`) with both the commit and the tag pushed
  (`git push origin master && git push origin vX.Y.Z`). Ask the user for the target
  version number rather than assuming whether/how far to bump it.

### Version history

| Tag | Commit | What shipped |
|---|---|---|
| `v0.0.1` | `d09cd63` | Initial site: home, about, sectors, clients, candidates, contact — six core pages, full design system, coded text wordmark (no logo file yet). |
| — | `178b3b7` | Hid the browser scrollbar while preserving scroll behaviour (`overflow` + `scrollbar-width`/`::-webkit-scrollbar` trick). |
| `v0.0.2` | `fcb7218` | Added the Job Opportunities section: `jobs.html` listing page (sector filter, card grid) + 4 job detail pages (drafted by the agent as samples to demonstrate the pattern; Jordan later confirmed they represent real roles — see `b32c9a8`). |
| `v0.0.3` | `d3809a8` | Real branding pass: client-supplied logo and founder photo wired in (still JPEG, still visibly boxed at this point — see below), job Apply buttons made to auto-fill the contact form (sector + full role text) via a `?job=` param and a `JOBS` object in `js/main.js`, sector `<select>` dark-theme fix, and a real mobile-nav bug fixed (full-screen overlay rendered incorrectly when opened partway down a scrolled page — root-caused to a `position:fixed`/scroll-offset interaction and fixed with a JS scroll-lock). |
| `v0.0.4` | `5769b06` | Logo fixed properly: the v0.0.3 logo was a square JPEG with a visible black background box wherever it wasn't over pure black — cropped it to the wordmark band and matted it to a transparent PNG (`images/main-logo.png`) via Pillow. The 4 agent-drafted sample postings from v0.0.2 were removed and replaced with 7 real briefs supplied by the client, each keeping its own original section headers rather than a forced template. (The 4 removed postings later came back — see `b32c9a8`.) |
| `v0.0.4` (same tag, later commits) | `71d6b90` | Added an 8th real role (Key Account Manager – Data Centre Solutions) and the `.claude/skills/job-listings/SKILL.md` skill so future job-posting changes don't require re-deriving the three-file pattern from scratch. |
| `v0.0.4` (same tag, later commits) | `b32c9a8` | Restored the 4 postings removed in `5769b06` after Jordan confirmed they represent real roles Senatek has (they'd been drafted by the agent as samples, so the agent checked before re-listing them) — `jobs.html` now carries 12 live postings total. |
| `v0.0.4` (same tag, later commits) | `621fb15` | README overhauled into a full agent handbook (this section, §8, quick-orientation header) — no site behaviour changed. |
| `v0.0.5` | `094c619` | Two real mobile-nav bugs found and fixed (see §5's "Mobile nav — three separate fixes"): (1) the full-screen menu overlay bled page content through for ~0.4s because it faded whole-element `opacity` including its own solid background — fixed by toggling the backdrop with `visibility` (always opaque) and animating only the menu items on top of it; (2) the real culprit for "only glitches when scrolled" — `.nav.scrolled`'s `backdrop-filter` made the nav the containing block for the fixed-position overlay, collapsing it down to the ~82px nav-bar height whenever the menu was opened while scrolled — fixed by dropping `backdrop-filter` (and using a near-solid background instead) on the scrolled nav at mobile widths only; desktop is unaffected. Stylesheet cache-busted to `?v=0.0.5` on every page. |

---

## 7. Outstanding items / swap-in points

1. **Founder photo** — done (v0.0.3). `about.html`'s founder frame now shows
   `images/Jordan1.jpeg`. A second option, `images/Jordan2.jpeg`, is also in the repo if a
   different shot is preferred later — just swap the `src`.
2. **Contact form backend** — form currently shows a client-side success message only.
   Point the form `action` (and the marked handler in `js/main.js`) at the mail endpoint
   when hosting is arranged; submissions should deliver to **Jordan@senatekrecruitment.com**.
   All fields are named and ready (`name`, `email`, `phone`, `company` / `current_role`,
   `sector`, `message`, hidden `enquiry_type`).
3. **Logo files** — done (v0.0.3, cleaned up v0.0.4). The source `images/main-logo.jpeg`
   the client supplied is a square asset on a solid black background. It's processed into
   `images/main-logo.png` — cropped tightly to the wordmark band and matted to a
   transparent background (via Pillow: alpha = max channel per pixel, unpremultiplied from
   black) — so it sits cleanly on the dark theme with no visible logo tile/box, at any
   scroll position or backdrop. `.brand-logo` sizes it by height with natural aspect ratio.
   If a new logo file is supplied later, re-run the same crop-and-matte process (or ask for
   the source with a transparent background directly) before dropping it in.
4. **Job posting photography** — each job detail page's `.job-figure` banner is currently
   a styled gradient + line-icon placeholder (captioned "Real photography incoming"),
   matching the founder-photo treatment in §7.1 pre-swap. Swap in real site/office
   photography per role when available — the markup comment in each `job-*.html` marks
   the spot.
5. **Job postings are live** — done (v0.0.4). The twelve roles on `jobs.html` (see §4 table)
   are live postings. Two origins worth knowing about: eight arrived as **verbatim briefs
   from Jordan** (their wording must never be paraphrased), and four (BD Director – Data
   Centres, HV Project Manager, M&E Contract Manager, BESS Project Manager) were
   **agent-drafted samples** that Jordan later confirmed represent real roles Senatek has
   and asked to be listed. If Jordan later sends real ad copy for any of those four,
   replace the drafted wording with the supplied copy. To add, remove or edit any posting,
   use the `job-listings` skill (see §4).
6. **Future additions (out of scope for v1):** contract/interim services, testimonials/
   client logos, insights/blog, privacy policy page (worth adding before the form goes
   live), analytics, and (longer-term) turning the jobs board into a CMS-backed listing
   if the number of live roles grows beyond what's practical to hand-maintain.

---

## 8. Working notes for agents

Hard-won specifics that aren't obvious from the code and have bitten before:

- **Nav/footer are duplicated in every HTML file.** There's no shared include — a nav or
  footer change (new link, logo swap, label change) must be applied to **all nineteen**
  pages. Grep to verify a sweep landed everywhere, e.g.
  `grep -c "main-logo.png" *.html` should return 2 per page (nav + footer).
- **Job postings live in three places** (detail page, `jobs.html` card, `JOBS` entry in
  `js/main.js`) — the `job-listings` skill is the canonical how-to. After editing
  `main.js`, run `node -c js/main.js` to catch syntax slips before browser-testing.
- **Reproduce supplied job-ad copy verbatim** — never paraphrase, condense, or normalise
  section headers on real briefs. This is an explicit, repeated client requirement.
- **Verify in a real browser before shipping.** Serve locally (`python -m http.server`)
  and click through — several bugs here (mobile nav overlay, dropdown theming, logo box)
  were invisible in the code and only found in the browser. For scroll-position-dependent
  checks note that `scroll-behavior: smooth` on `<html>` makes programmatic
  `window.scrollTo` animate (or appear to no-op in automation) — set
  `document.documentElement.style.scrollBehavior = 'auto'` first in test scripts, which is
  also why the nav scroll-lock restore in `main.js` passes `behavior: "instant"`.
- **The `.reveal` animation hides content until scrolled into view.** In automated
  screenshots, force it with
  `document.querySelectorAll('.reveal').forEach(e => e.classList.add('in'))` — otherwise
  below-the-fold sections screenshot as empty black.
- **`backdrop-filter`/`filter`/`transform` create a containing block for `position: fixed`
  descendants.** This bit us twice on the mobile nav (see §5, "Mobile nav — three separate
  fixes"): `.nav-links` is `position: fixed` and a DOM descendant of `.nav`, so whenever
  `.nav` picked up `backdrop-filter` (its `.scrolled` state) the "full-screen" menu overlay
  silently stopped sizing against the viewport and sized against the ~82px nav bar instead
  — collapsing the menu for a fraction of a second, invisible unless caught in a live
  screenshot or reported by an actual user tapping the actual page. **Don't reintroduce
  `backdrop-filter`/`filter`/`transform` on `.nav` (or `.nav.scrolled`) at mobile widths**;
  the flat opaque backgrounds there are intentional. More generally: if a `position: fixed`
  element ever behaves as though it's positioned/sized relative to the wrong box, check
  every ancestor for `transform`, `filter`, `backdrop-filter`, `perspective`, or
  `will-change` naming one of those — any of them silently breaks the "fixed = relative to
  viewport" assumption.
- **Image processing:** no ImageMagick on this machine, but Python + Pillow is available
  via `python` (not `python3`). The logo transparency recipe is in §7.3.
- **Windows environment quirks:** the repo lives on `Y:\Github\Senatek`; the shell used
  for automation is Git Bash (POSIX-style paths work). Line-ending warnings
  (`LF will be replaced by CRLF`) on commit are normal and harmless here.
- **Versioning is user-directed** — always confirm with the user whether a change bumps
  the version tag or ships as a plain commit on the current tag (both have happened; see
  §6 Version history).
- **Update this README as part of any change** that alters pages, roles, assets, or
  workflow — stale counts and cross-references here have caused real confusion. The job
  table (§4), file counts (§5), version history (§6), and outstanding items (§7) are the
  usual suspects.
