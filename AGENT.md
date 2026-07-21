# Senatek Recruitment — Agent / Developer Notes

> Technical implementation details, deployment & hosting info, versioning history, and
> hard-won working notes for anyone (human or agent) doing further development on this
> site. For company research, brand system, and page-by-page content map, see
> **[README.md](README.md)**. For generating new site imagery, see
> **[IMAGE-BRIEF.md](IMAGE-BRIEF.md)**.
> Last updated: 21 July 2026 (v0.0.8).

**Quick orientation for an agent picking this up cold:** static HTML/CSS/JS, no build
step, no CMS, no backend — every page is a hand-authored file you edit directly. Live at
**https://cammycodes.github.io/Senatek/** (GitHub Pages, `CammyCodes/Senatek`, deployed
from `master`). Full deployment details and version history: §2. Job postings are the one
piece of content that changes often — use the **`job-listings` skill**
(`.claude/skills/job-listings/SKILL.md`) rather than re-deriving the pattern, and always
reproduce a supplied job posting's wording **verbatim** (see README.md §4). Read this file
before making changes; it has caught real bugs and stale-copy issues that weren't obvious
from the code alone.

---

## 1. Technical notes

- **Stack:** static HTML + CSS + vanilla JS. No framework, no build step. Hostable on
  anything (GoDaddy, Netlify, Cloudflare Pages…).
- **Files:** nineteen `.html` pages (six core pages + `jobs.html` + twelve job detail
  pages) · `css/styles.css` (design system) · `js/main.js` (nav, reveals, counters, streak
  draw, embers, timeline, form toggle, job sector filter, job application prefill, floating
  apply pill) · `images/` (brand reference JPEGs, `main-logo.png`, founder photos, page
  hero/section imagery, `og-default.jpg` as the fallback OG card) · `images/sectors/`
  (sector photography — see "Sector imagery" below) · `IMAGE-BRIEF.md` (generation brief
  for producing new site imagery) · `tools/process_images.py` (Pillow crop/compress
  pipeline) · `.claude/skills/job-listings/SKILL.md` (workflow reference for
  adding/editing/removing job postings) · `.claude/launch.json` (local static-server
  config for the preview tooling).
- **Sector imagery (v0.0.7+):** `images/sectors/` holds three files per sector —
  `<sector>-og.jpg` (the full 1672×941 client banner, wordmark and sector title baked in),
  `-wide.jpg` (21:9) and `-tile.jpg` (4:3). The `-og` file is the untouched original and
  is the **master** for any future re-crop. Sectors are keyed by the same slugs as
  `data-sector` in `jobs.html`: `power-energy`, `data-centres`, `building-services`,
  `renewables`. **All four sectors are complete as of v0.0.8.** The first three came from
  client-supplied banners; `renewables` was generated from IMAGE-BRIEF.md item A1 and its
  branded `-og.jpg` composited in-repo (see §5 of the brief) — so `renewables-source.jpg`,
  the un-branded master, also lives in that folder.
  - **Why the crops exist:** the supplied banners have the SENATEK wordmark *and* the
    sector title rendered into the left ~40% of the frame. Used whole on a page they'd put
    a third logo on screen beside an `<h2>` that already says the same words. The
    derivatives crop from `x0 = 700` (of 1672), which drops the text zone entirely and
    keeps only the photographic right-hand side. 700 was found by scanning pixel columns
    for white/amber type, then confirmed visually — it also leaves the orange arc clipping
    the lower-left corner, which reads as a deliberate echo of the hero streak. Don't crop
    tighter than ~700 without re-checking; don't crop looser or the title bleeds in.
  - **Where the full banner *is* right:** `og:image`. The baked-in branding is an asset on
    a LinkedIn share card, so **all twelve** job detail pages point at their sector's
    `-og.jpg`. The seven remaining pages (six core + `jobs.html`) use `images/og-default.jpg`.
    `Design1.jpeg` is no longer referenced by any page — it's kept only as a design
    reference (see README.md §2).
- **Photo-capable visual slots:** `.sector-visual` (4:3, 16:9 ≤860px) and `.job-figure`
  (21:9) both keep their gradient + grid-overlay placeholder **by default**; adding
  `.has-photo` alongside an `<img>` swaps in a real photo (`object-fit: cover`) and
  replaces the technical grid with a soft vignette. This is deliberate — imagery lands
  sector by sector, so a slot with no artwork yet must still render correctly. Don't
  delete the placeholder CSS.
- **Branding:** `images/main-logo.png` — a transparent PNG cropped tightly to the wordmark
  (see §3.3 for how it was produced from the client's square source file) — is used as the
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
     is not `position: fixed`, so it was never affected). See §4 for the general gotcha.
- **Floating "Apply Now" pill (v0.0.6):** on job detail pages, `js/main.js` injects a
  fixed bottom-centre Apply pill (it clones the page's real `.apply-box .btn-primary`
  href, so the per-job link is always correct — no per-page HTML). An IntersectionObserver
  on `.apply-box` toggles a `.show` class: the pill is shown whenever the real apply panel
  is *off* screen and drops away (slides down) when it scrolls into view, springing back up
  with a bounce (spring `cubic-bezier` overshoot) plus a gentle idle float — a "liquid
  glass" frosted-amber look (`backdrop-filter` blur + inset highlights). **Mobile/tablet
  only** (`.floating-apply` is `display:none` above 900px): on desktop the `.apply-box` is
  `position:sticky` and permanently visible, so a floating duplicate would be redundant and
  would essentially never show. Note: the automated browser-preview pane does **not**
  dispatch IntersectionObserver callbacks (it never has — that's why `.reveal` has to be
  force-shown in test scripts), so this feature can't be exercised through it; verify in a
  real browser at a mobile width.
- **Cache-busting (v0.0.5+):** both shared assets are linked with a version query —
  `css/styles.css?v=0.0.8` and `js/main.js?v=0.0.8` — on every page. The `?v=` is bumped
  whenever `styles.css` **or** `js/main.js` changes so browsers (and the Pages CDN) fetch
  the new file instead of a stale cached copy. This matters especially when the client
  previews via `file://` while iterating — browsers cache `file://` subresources
  aggressively, so without the query bump an edit may not show up on reload. Keep the query
  in sync with the release version, and bump **both** links whenever either file changes.
- **Native form control theming:** `color-scheme: dark` (root) plus explicit
  `<option>` background/color rules fix the sector `<select>` popup rendering with a
  white background in Chromium-based browsers.

---

## 2. Deployment & repository

- **Repository:** [github.com/CammyCodes/Senatek](https://github.com/CammyCodes/Senatek)
  (GitHub account: CammyCodes). Single branch, `master` — no `develop`/feature-branch
  workflow in use; commits go straight to `master`.
- **Live site:** **https://cammycodes.github.io/Senatek/** — GitHub Pages, configured to
  build from the `master` branch root (no `/docs` folder, no build step — it serves the
  repo's HTML files directly). Pushing to `master` redeploys automatically, usually live
  within a minute or two.
- **Production domain:** the site is written to eventually replace the placeholder at
  [senatekrecruitment.com](https://senatekrecruitment.com/) (see README.md §1), but that
  domain is **not currently pointed** at this repo/Pages site — the GitHub Pages URL above
  is the only live URL right now. Pointing the custom domain (CNAME/DNS + a `CNAME` file
  in the repo) is not yet done.
- **Local preview:** no dev server needed — from the repo root run
  `python -m http.server 8000` (or any static file server) and open
  `http://localhost:8000/index.html`. Opening files directly via `file://` mostly works
  too, but the sector-filter/apply-prefill JS and some relative asset paths behave more
  reliably over `http://`.
- **Versioning:** annotated git tags `v0.0.1`–`v0.0.6`, bumped for most content/feature
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
| `v0.0.4` (same tag, later commits) | `621fb15` | README overhauled into a full agent handbook — no site behaviour changed. Later split into README.md (business/content reference) + this file (technical/agent reference) — see the current commit. |
| `v0.0.5` | `094c619` | Two real mobile-nav bugs found and fixed (see §1's "Mobile nav — three separate fixes"): (1) the full-screen menu overlay bled page content through for ~0.4s because it faded whole-element `opacity` including its own solid background — fixed by toggling the backdrop with `visibility` (always opaque) and animating only the menu items on top of it; (2) the real culprit for "only glitches when scrolled" — `.nav.scrolled`'s `backdrop-filter` made the nav the containing block for the fixed-position overlay, collapsing it down to the ~82px nav-bar height whenever the menu was opened while scrolled — fixed by dropping `backdrop-filter` (and using a near-solid background instead) on the scrolled nav at mobile widths only; desktop is unaffected. Stylesheet cache-busted to `?v=0.0.5` on every page. |
| — | `9357e63` | Docs reorg: split the old single README into README.md (business/content reference) + AGENT.md (this file — technical/dev reference), and removed all references to the external site the design was benchmarked against (client request). No site behaviour changed. |
| `v0.0.7` | — | First real photography pass: the three client-supplied sector banners (Power & Energy, Data Centres, Building Services) processed into `images/sectors/` as `-og`/`-wide`/`-tile` derivatives and wired into `sectors.html` and 9 of 12 job detail pages; `.has-photo` pattern added; [IMAGE-BRIEF.md](IMAGE-BRIEF.md) authored. **Never shipped as a standalone commit** — it was still in the working tree when the v0.0.8 rollout landed on top, so both phases went out together in the v0.0.8 commit below. No `v0.0.7` tag exists. |
| `v0.0.8` | _(pending)_ | **Full site photography rollout (IMAGE-BRIEF.md complete).** 14 master images generated and processed into `images/` & `images/sectors/`. Renewables sector source, wide, tile, and composited branded OG card produced via Pillow (`renewables-og.jpg`); page heroes added to `about.html`, `clients.html`, `candidates.html`, `contact.html`, and `jobs.html`; section imagery added to client & candidate journey steps; split panels added to `index.html`. Generic Open Graph fallback updated to `og-default.jpg` across core pages. Asset query parameters bumped to `?v=0.0.8` across all 19 HTML files. |
| `v0.0.6` | `a259873` | Floating "Apply Now" pill on job detail pages (mobile/tablet) — a fixed bottom-centre CTA injected by `js/main.js` that follows the reader, drops away when the real `.apply-box` is on screen, and springs back up with a liquid-glass bounce + idle float. See §1's "Floating Apply Now pill". Also extended cache-busting to `js/main.js` (both shared assets now carry `?v=0.0.6`). |

---

## 3. Outstanding items / swap-in points

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
4. **Job posting photography** — **done, 12 of 12 (v0.0.8).** Every job detail page's
   `.job-figure` banner shows its sector's `-wide.jpg`, mapped by the same sector as the
   page's `data-sector` in `jobs.html`. The "Real photography incoming" placeholder is
   gone from all twelve. Note these are **sector** images, not role-specific photography —
   four images cover twelve roles. Swapping in genuine site/office shots per role is still
   an option if the client supplies them.
5. **Job postings are live** — done (v0.0.4). The twelve roles on `jobs.html` (see
   README.md §4 table) are live postings. Two origins worth knowing about: eight arrived
   as **verbatim briefs from Jordan** (their wording must never be paraphrased), and four
   (BD Director – Data Centres, HV Project Manager, M&E Contract Manager, BESS Project
   Manager) were **agent-drafted samples** that Jordan later confirmed represent real
   roles Senatek has and asked to be listed. If Jordan later sends real ad copy for any of
   those four, replace the drafted wording with the supplied copy. To add, remove or edit
   any posting, use the `job-listings` skill (see README.md §4).
6. **Future additions (out of scope for v1):** contract/interim services, testimonials/
   client logos, insights/blog, privacy policy page (worth adding before the form goes
   live), analytics, and (longer-term) turning the jobs board into a CMS-backed listing
   if the number of live roles grows beyond what's practical to hand-maintain.

---

## 4. Working notes for agents

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
  descendants.** This bit us twice on the mobile nav (see §1, "Mobile nav — three separate
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
- **Image processing:** no ImageMagick on this machine, and **no numpy** — but Python +
  Pillow is available via `python` (not `python3`). The logo transparency recipe is in
  §3.3; the sector crop recipe (and the `crop_ratio`/`save` helpers) is in
  [IMAGE-BRIEF.md](IMAGE-BRIEF.md) §4. Export JPEGs with
  `quality=82, optimize=True, progressive=True` and keep them under ~150 KB.
- **Never ask an image model to render the wordmark.** Image models garble lettering, and
  the result won't match `main-logo.png`. Generated imagery is always text-free and
  logo-free; branding is composited in-repo afterwards (see IMAGE-BRIEF.md §5). This is
  rule 1–2 of the brief and the reason the on-page sector crops exist at all.
- **Adding an image to a page:** always set `width`/`height` (intrinsic pixel size, so the
  browser reserves space and avoids layout shift), `decoding="async"`, real descriptive
  `alt`, and `loading="lazy"` for anything below the fold — but **not** on the first
  above-the-fold image, where lazy-loading delays the LCP. Note the browser-preview pane
  doesn't composite frames, so native lazy-loading never fires there and images below the
  fold will report `complete: false` — that's a tooling artifact, not a bug. Verify image
  loading in a real browser, or HEAD-fetch the URLs directly.
- **Windows environment quirks:** the repo lives on `Y:\Github\Senatek`; the shell used
  for automation is Git Bash (POSIX-style paths work). Line-ending warnings
  (`LF will be replaced by CRLF`) on commit are normal and harmless here.
- **Versioning is user-directed** — always confirm with the user whether a change bumps
  the version tag or ships as a plain commit on the current tag (both have happened; see
  §2 Version history).
- **Don't mention or link to any external "benchmark"/reference sites this design was
  based on**, in this file, README.md, commit messages, or anywhere else user-facing —
  removed by explicit client request.
- **Update README.md and this file as part of any change** that alters pages, roles,
  assets, or workflow — stale counts and cross-references here have caused real confusion.
  README.md's job table (§4); this file's file counts (§1), version history (§2), and
  outstanding items (§3) are the usual suspects.
