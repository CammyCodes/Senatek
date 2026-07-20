---
name: job-listings
description: Add, edit, or remove job postings on the Senatek Recruitment site (jobs.html listing + job-*.html detail pages + the JOBS dataset in js/main.js). Use whenever the user wants to add a new role, update an existing posting, or take a role down.
---

# Managing job listings on the Senatek site

Every job posting lives in **three places** that must stay in sync. Missing one leaves the
site inconsistent (e.g. a card that 404s, or an Apply button that pre-fills the wrong role).

1. **`job-<slug>.html`** — the standalone detail page (its own URL, own SEO, own `JobPosting` JSON-LD).
2. **A card in `jobs.html`** — inside `<div class="job-grid">`, links to the detail page.
3. **An entry in the `JOBS` object in `js/main.js`** — powers the Apply-page auto-fill (selects
   the right Sector, fills the message box with the full role text) when someone clicks
   *Apply Now* on the detail page (`contact.html?type=candidate&job=<slug>`).

Content is always reproduced **verbatim** from what the user supplies — don't paraphrase,
condense, or "clean up" the wording of a real job ad. If the user's source material uses its
own section headers (e.g. "What You'll Be Doing" instead of "Key Responsibilities"), keep
those headers as given rather than forcing every posting into identical section names.

The site is static HTML/CSS/JS with no build step and no CMS — every change is a direct file
edit. Read `README.md` (site map, content, brand system) and `AGENT.md` (technical notes,
deployment, working notes) in the repo root first; this skill only covers the jobs workflow.

## Sector reference

Every posting must be assigned to exactly one of these four sectors. Use the exact strings
below — the sector select's `<option>` text, the eyebrow text, the `data-sector` filter
value, and the icon SVG must all match one of these four rows exactly, or the Apply-page
sector auto-select and the jobs.html filter buttons will silently fail to match.

| Sector (eyebrow / `<option>` text) | `data-sector` (filter slug) | Icon `<path>`/`<rect>` (paste inside the `viewBox="0 0 24 24"` svg) |
|---|---|---|
| Power & Energy | `power-energy` | `<path d="M9 22 12 2l3 20M6.5 9h11M4.5 15.5h15M9.7 9l4.9 6.5M14.3 9l-4.9 6.5M2 22h20"/>` |
| Critical Infrastructure & Data Centres | `data-centres` | `<rect x="4" y="3" width="16" height="6" rx="1.5"/><rect x="4" y="11" width="16" height="6" rx="1.5"/><path d="M7.5 6h.01M7.5 14h.01M11 6h4M11 14h4M9 21h6M12 17v4"/>` |
| Building Services & Facilities | `building-services` | `<path d="M3 21h18M5 21V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v16M14 9h4a1 1 0 0 1 1 1v11"/><path d="M8 8h3M8 12h3M8 16h3M16.5 13h.01M16.5 17h.01"/>` |
| Renewables & Energy Storage | `renewables` | `<path d="M8 21h4M10 21V11M10 11 4.5 8.2M10 11l5.6-2.6M10 11l-.2 6.3"/><circle cx="10" cy="10.8" r="1.2"/><rect x="16.5" y="13" width="5" height="8" rx="1"/><path d="M18.2 11.5h1.6V13h-1.6zM17.8 17h2.4"/>` |

Note: on the contact form the "Critical Infrastructure & Data Centres" sector's `<option>`
text is written in full; everywhere else on the jobs pages it's shortened to just
"Data Centres" (job card sector pill, filter button label). "Power & Energy" and
"Renewables"/"Building Services" are shortened similarly on cards — see the card template
below.

## Adding a job

Pick a URL-safe slug from the role title, e.g. "Site Manager – Grid Connections" →
`site-manager-grid-connections`. It must be unique and not collide with an existing
`job-*.html` file.

### 1. Create `job-<slug>.html`

Copy an **existing** `job-*.html` file that's closest in tone (an exec role for another exec
role, a trades role for another trades role) rather than building from scratch — it keeps
formatting mistakes from creeping in. Then update, in order:

- `<title>` — `{Role Title} | Senatek Recruitment`
- `<meta name="description">` and both `<meta property="og:*">` tags — one or two sentences,
  include location and salary
- The `JobPosting` JSON-LD `<script>` block: `title`, `description` (short, one paragraph,
  HTML-wrapped in `<p>`), `datePosted` (today, `YYYY-MM-DD`), `validThrough` (+60 days is the
  house convention), `jobLocation.address` (`addressLocality` for a city, or
  `addressRegion` for "UK & Ireland" / "United Kingdom" style locations), `jobLocationType:
  "TELECOMMUTE"` if hybrid/remote (omit the field entirely if fully site-based), and
  `baseSalary.value.minValue`/`maxValue` (numbers only, no £ or commas)
- Nav `<p class="eyebrow reveal in">` — the sector name (see table above)
- `<h1>` — the role title, exactly as supplied
- `.job-hero-meta` — three (or four, if working hours are specified separately) `<li>`
  pills: location, salary, employment type. Reuse the existing SVG icons verbatim — location
  pin, salary tag, briefcase, and a clock icon if a fourth "working hours" pill is needed
- `.job-figure svg.job-figure-icon` — paste the sector's icon markup from the table above
  (this is a placeholder visual, captioned "Real photography incoming" — leave the caption
  as-is; it's a known, documented placeholder, see AGENT.md §3.4)
- `.job-content` — one `<h2>` per section, in the source material's own order and using its
  own headers. For each bullet list use `<ul class="req-list">` with each `<li>` starting
  with the exact same checkmark SVG (copy it from any existing `<li>` — don't retype it) followed
  directly by the bullet text
- `.apply-box .btn-primary` href — `contact.html?type=candidate&job=<slug>` (the slug you
  picked, HTML-entity-escape the `&` as `&amp;`)
- `.apply-box .btn-ghost` href — `mailto:Jordan@senatekrecruitment.com?subject=Application%20%E2%80%93%20{Role%20Title%20URL-encoded}`
  (space → `%20`, the en dash "–" → `%E2%80%93`)
- `.apply-note` — `Sector: {full sector name}.` (keep the trailing confidentiality sentence
  unchanged)

Everything else in the file (nav, footer, CTA band, `<script src="js/main.js">`) is
boilerplate identical across every page — do not modify it per-job.

### 2. Add a card to `jobs.html`

Inside `<div class="job-grid">`, add a new `<a class="card job-card reveal" ...>` block
before the closing `</div>`. Copy the structure of an existing card and set:

- `style="--rd:.Ns"` — stagger delay, `.06s` more than the previous card in the list (purely
  a scroll-reveal animation offset, not load-bearing — eyeball it)
- `href="job-<slug>.html"`
- `data-sector="<filter-slug>"` (from the sector table — this is what the filter buttons
  match against)
- `.job-sector` text — the short sector label
- the icon SVG — same markup as the detail page's `.job-figure-icon`
- `<h3>` — role title
- `.job-meta` — two `<li>` pills: a short location string and a short salary string (these
  can be abbreviated, e.g. "£90k–£100k + Commission", unlike the detail page's full pill text)
- the `<p>` — a one-sentence teaser, written fresh (not lifted verbatim from the ad — this is
  the one piece of copy on the page that's supposed to be a summary, not a quote)

### 3. Add the `JOBS` entry in `js/main.js`

Find the `var JOBS = { ... }` object (search for `var JOBS`). Add a new key matching the
slug, before the closing `};`. Shape:

```js
"your-slug-here": {
  title: "Exact Role Title",
  sector: "Exact Sector Option Text",   // must match a contact.html <option> exactly
  location: "Full location string as shown on the detail page hero",
  salary: "Full salary string as shown on the detail page hero",
  sections: [
    { heading: "Section Heading", paragraphs: ["First paragraph.", "Second paragraph."] },
    { heading: "Another Heading", items: ["Bullet one.", "Bullet two."] },
    { heading: "Intro Then Bullets", paragraphs: ["One intro sentence:"], items: ["Bullet one.", "Bullet two."] }
  ]
}
```

`sections` must mirror the `<h2>` blocks on the detail page **in the same order, with the
same headings**, so the Apply-page prefill matches what the candidate just read. A section
can have `paragraphs` only, `items` only, or both (intro paragraph(s) followed by bullets) —
match whatever the detail page actually has for that section.

Run `node -c js/main.js` after editing to catch stray commas/quotes before testing in a
browser.

## Editing a job

Find and update all three places for that slug — the detail page's own content, the
`jobs.html` card's teaser/meta pills, and the `JOBS` entry — so the Apply prefill doesn't go
stale relative to the page. If the role's **sector** changes, update it in all three places
(`eyebrow`, `data-sector`, icon, and `JOBS[...].sector`) — a mismatch there breaks the jobs
page filter and/or the Apply-page auto-select.

## Removing a job

1. Delete `job-<slug>.html`.
2. Delete its card block from `jobs.html`'s `.job-grid`.
3. Delete its entry from the `JOBS` object in `js/main.js`.
4. Grep the repo for the slug to make sure nothing else references it:
   `grep -rn "<slug>" *.html js/main.js README.md`

## Verifying before shipping

There's no build step, so serve the repo locally and click through:

```
python -m http.server 8000
```

Then in a browser: open `jobs.html`, confirm the new/edited card renders and the sector
filter still isolates it correctly; open the detail page directly; click *Apply Now* and
confirm the sector dropdown on the contact page auto-selects correctly and the message box
is filled with the exact role text.

## Committing

After a jobs change:

1. Update `README.md`'s job listing table and role count (§4). If the change is notable,
   also update `AGENT.md`'s file count (§1) and version history table (§2).
2. `git add`, commit with a message describing what changed (which roles added/edited/removed).
3. **Ask the user whether this change bumps the version tag.** Feature releases have been
   tagged (`v0.0.1`–`v0.0.5` so far, annotated tags), but content-only job changes have
   also shipped as plain commits on the current tag when the user said to keep the version
   — both are established. If tagging: `git tag -a v0.0.X -m "..."` then push both:
   `git push origin master && git push origin v0.0.X`. If not: just `git push origin master`.

The site is GitHub Pages off `master` — pushing deploys it live within a minute or two.
