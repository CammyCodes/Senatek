# Senatek Recruitment — Image Generation Brief

> A generation brief for producing site imagery with Gemini (or any image model).
> Paste the **Global style block** plus one **image prompt** per generation.
>
> Companion docs: **[README.md](README.md)** (brand system, content map) ·
> **[AGENT.md](AGENT.md)** (technical/dev notes).
> Last updated: 21 July 2026.

---

## Status — executed in v0.0.8

**All 14 images in this brief have been generated, processed and wired in.** What follows
is kept as the **standing style contract** for any future imagery: the hard rules (§1),
the style block (§2), naming and post-processing (§4) all still apply to anything new.
Read §1 and §2 before generating a single additional image, so new work matches what's
already on the site. §3's manifest is now a record of what was produced, not a to-do list.

---

## 0. Why this exists

*(Written before v0.0.8 — describes the problem this brief was created to solve.)*

The site had almost no photography. Across all nineteen pages there were only
three distinct images in use, and **57 of the 58 image renders on the site were the logo**
(nav wordmark ×19, footer wordmark ×19, plus `Design1.jpeg` — which itself contains the
wordmark — as the Open Graph image on all 19 pages). Everything else is line-art SVG.

The fix is **additive**: give the site real imagery so the wordmark stops being the only
visual element. This brief defines what to generate and how it must look.

---

## 1. Hard rules — read before generating anything

These apply to **every** image in this brief, without exception.

| # | Rule | Why |
|---|---|---|
| 1 | **No text. No lettering. No signage. No numbers.** | The site renders its own headings in Space Grotesk. Baked-in type duplicates it and can't be translated or restyled. |
| 2 | **No logo, no wordmark, no watermark.** | See §0 — the logo problem is what we're solving. Also: image models garble wordmarks. The Senatek mark is **composited in-repo**, never generated. |
| 3 | **Dark-dominant.** Deep near-black shadows, no bright/white backgrounds. | Every image sits on `#07090e`. A light image creates a hard rectangular seam. |
| 4 | **Amber `#f7941d` is the only accent colour.** No blue, teal, purple or green light. | The palette is strictly dark + amber. A blue LED glow instantly looks off-brand. |
| 5 | **Weight the subject right-of-centre**, keep the left third quieter. | Slots crop differently at different breakpoints; a right-weighted subject survives cropping. |
| 6 | **No recognisable faces, no identifiable brands, no readable plates.** | Real people imply real placements we can't substantiate; brands imply clients we don't have. |
| 7 | **16:9 output** unless the entry says otherwise. Cropping to 4:3 / 21:9 / 1:1 happens in post (§4). | One master per subject, many crops. |

---

## 2. Global style block

> Paste this ahead of each individual prompt.

```
Photorealistic, cinematic industrial photography. Shot at dusk or golden hour under a
dramatic sunset sky. Deep near-black shadows; the image is dark-dominant with a rich
amber and burnt-orange glow as the only accent colour — no blue, teal or green light
anywhere. Warm rim-lighting on metal and glass. Wet or reflective ground catching orange
highlights. Moody, premium, engineered — confident and clean, never gritty, never
dystopian. Wide cinematic framing with strong leading lines. Subject weighted slightly
right of centre; the left third of the frame is quieter and darker.
Absolutely no text, no lettering, no signage, no numbers, no logos, no watermarks,
no visible brand names. No people's faces.
16:9 aspect ratio, high detail, sharp focus.
```

### Style anchors

Three finished banners already define the look. Attach them as reference images if the
tool supports it:

- `images/sectors/power-energy-og.jpg`
- `images/sectors/data-centres-og.jpg`
- `images/sectors/building-services-og.jpg`

Match their **lighting, colour grade and mood**. Ignore their left-hand panel — that's
the branded text zone, which we crop away for on-page use (§4).

### Palette reference

| Token | Hex | Role in imagery |
|---|---|---|
| `--bg` | `#07090e` | Shadows / darkest values |
| `--amber` | `#f7941d` | Primary glow, the dominant accent |
| `--amber-bright` | `#ffb84d` | Highlights, sun flare |
| `--amber-deep` | `#e8720c` | Deeper sunset tones |

---

## 3. Image manifest — 14 images

Naming is kebab-case, no spaces, no ampersands (a space in a filename needs `%20`
encoding and is a real footgun on GitHub Pages — the three source banners had to be
renamed for exactly this reason).

### Group A — complete the sector set (1 image)

Three of four sectors have artwork. Renewables is the gap, and it blocks
`sectors.html`, two job detail pages, and the renewables OG card.

| # | Filename | Subject |
|---|---|---|
| A1 | `renewables-source.jpg` | **Renewables & Energy Storage** |

```
A utility-scale renewable energy site at sunset. Rows of dark solar PV panels in the
foreground angled toward a low sun, their glass catching amber reflections. Two or three
tall wind turbines in the mid-distance, silhouetted against a dramatic orange and
charcoal cloudscape. A line of dark battery-storage container units along the right side,
edge-lit in amber. Wet ground reflecting the orange sky. Deep black shadows throughout.
```

> **Post-step:** the branded `renewables-og.jpg` (wordmark + "Renewables & Energy
> Storage" title + arc sweep) is **composited in-repo with Pillow** to match the other
> three exactly — see §5. Do **not** ask the model to render that text.

### Group B — page heroes (4 images)

Backgrounds for the `.page-hero` band on the four pages that currently have no imagery
at all. These sit *behind* a headline, so they must be **darker and lower-contrast** than
the sector banners — heavy negative space, no busy detail competing with the type.

| # | Filename | Page |
|---|---|---|
| B1 | `hero-about.jpg` | `about.html` |
| B2 | `hero-clients.jpg` | `clients.html` |
| B3 | `hero-candidates.jpg` | `candidates.html` |
| B4 | `hero-contact.jpg` | `contact.html` |

```
B1 — about.html
A wide, calm view of UK energy infrastructure at blue-hour dusk: distant transmission
towers and a low city skyline on the horizon, heavily shadowed, with a single band of
amber light along the horizon line. Very dark overall, minimal detail in the upper two
thirds — near-empty sky. Quiet and atmospheric rather than busy.

B2 — clients.html
The interior of a dark modern office at night, viewed toward a floor-to-ceiling window.
An empty meeting table in silhouette in the lower third; beyond the glass, an out-of-focus
city skyline with warm amber lights. Shallow depth of field, heavy bokeh, very dark.
No people, no screens, no visible text.

B3 — candidates.html
A lone engineer in high-visibility workwear and a hard hat, seen from behind in full
silhouette, standing on a gantry looking out over an illuminated industrial site at dusk.
Face not visible. Amber site lighting below, dark sky above with a sunset band on the
horizon. Aspirational, forward-looking.

B4 — contact.html
An abstract dark aerial view of a UK landscape at night — a web of faint amber light
trails tracing roads and grid connections across near-black terrain, like a long-exposure
network map. Very low contrast, very dark, no labels, no text, no borders.
```

### Group C — section imagery (5 images)

Supporting images for the process/timeline and copy blocks on the client and candidate
journeys. **4:3 or 16:9**, sit alongside body copy at roughly half-column width.

| # | Filename | Slot |
|---|---|---|
| C1 | `clients-briefing.jpg` | clients.html — "briefing" step |
| C2 | `clients-shortlist.jpg` | clients.html — "shortlist / delivery" step |
| C3 | `candidates-onsite.jpg` | candidates.html — "your market" block |
| C4 | `candidates-progression.jpg` | candidates.html — "progression" block |
| C5 | `about-values.jpg` | about.html — values block |

```
C1 — Two people in business dress seen from behind and in silhouette, standing at a dark
window reviewing a site together, warm amber light from beyond the glass. Faces not
visible. Very dark, shallow depth of field.

C2 — An architectural close-up of a dark modern building facade at dusk, strong vertical
leading lines, amber interior lights glowing in a rhythmic pattern across the glass.
Abstract and graphic. No people.

C3 — Close-up of gloved hands working on industrial electrical switchgear, lit by warm
amber worklight against deep shadow. Hands and equipment only — no face, no readable
labels or markings on the equipment.

C4 — A single silhouetted figure ascending an external industrial staircase or gantry
against a dusk sky, shot from below. Strong diagonal lines, amber sky, near-black
structure. Sense of upward momentum. Face not visible.

C5 — A wide substation or switchyard at dawn, symmetrical and orderly, bathed in low
amber light with long shadows. Calm, precise, engineered. No people, no signage.
```

### Group D — home page split panels (2 images)

Backgrounds for the two `.split-panel` blocks on `index.html`. Must be **subtle** —
these sit behind a heading, body copy, a list and a button, so they need to work at very
low opacity as texture rather than as a subject.

| # | Filename | Slot |
|---|---|---|
| D1 | `split-clients.jpg` | index.html — "For Clients" panel |
| D2 | `split-candidates.jpg` | index.html — "For Candidates" panel |

```
D1 — An extremely dark, near-abstract texture: the blurred glass-and-steel facade of a
tower at night with faint amber window lights, heavily defocused. Almost entirely black
with a soft amber gradient toward one corner. Texture, not subject.

D2 — An extremely dark, near-abstract texture: defocused amber bokeh lights from an
industrial site at night over deep black, with a faint diagonal light streak. Almost
entirely black. Texture, not subject.
```

### Group E — site-wide (2 images)

| # | Filename | Slot |
|---|---|---|
| E1 | `og-default.jpg` | Generic Open Graph card — replaces `Design1.jpeg` as the fallback |
| E2 | `hero-jobs.jpg` | `jobs.html` listing page header |

```
E1 — A sweeping composite of UK energy and digital infrastructure at sunset: transmission
pylons on the left, wind turbines and solar panels centre, a dark data-centre facade on
the right, unified under one dramatic orange sky. Cinematic, wide, balanced across the
full frame. Leave the left third relatively open and dark — branding is composited over
it afterwards. No text, no logos.

E2 — A dark industrial site at dusk seen from a distance, many small amber lights across
the structure suggesting scale and activity. Wide, calm, heavily shadowed, with an empty
darker band across the upper third for headline text.
```

---

## 4. Post-processing

Every delivered image gets the same treatment the three sector banners already had.

**Targets:** JPEG, `quality=82`, `optimize=True`, `progressive=True`. Aim under ~150 KB
each. Master (`-og`) files may run larger. No WebP for now — single `<img>` tags keep the
markup simple across nineteen hand-edited pages; WebP + `<picture>` is a future
optimisation, not a v1 requirement.

**No ImageMagick on this machine — use Python + Pillow via `python` (not `python3`).**

```python
# tools recipe — crop a delivered master into the site's slot ratios
from PIL import Image
import os

def crop_ratio(im, x0, ratio, ya=0.5):
    """Largest box of `ratio` inside the region right of x0, anchored vertically by ya."""
    W, H = im.size
    aw, ah = W - x0, H
    if aw / ah > ratio: ch = ah;             cw = int(ch * ratio)
    else:               cw = aw;             ch = int(cw / ratio)
    y0 = int((ah - ch) * ya)
    return im.crop((x0, y0, x0 + cw, y0 + ch))

def save(im, path, q=82):
    im.save(path, 'JPEG', quality=q, optimize=True, progressive=True)
    print('%-46s %-12s %5d KB' % (path, '%dx%d' % im.size, os.path.getsize(path) / 1024))

im = Image.open('incoming/renewables-source.jpg').convert('RGB')
save(crop_ratio(im, 0, 21/9), 'images/sectors/renewables-wide.jpg')  # job-figure banner
save(crop_ratio(im, 0, 4/3),  'images/sectors/renewables-tile.jpg')  # sector-visual
```

### Why `x0` exists

The three original banners had the wordmark and sector title baked into the **left ~40%**
of the frame. On-page use crops them away with `x0 = 700` (of 1672px) — determined by
scanning pixel columns for white/amber type and confirming visually. The full uncropped
file is kept as `-og.jpg`, where the baked-in branding is genuinely useful.

**Images generated from this brief have no baked-in text, so they use `x0 = 0`.** The
parameter is retained only for reprocessing the three original banners.

### Slot ratios

| Slot | CSS | Ratio | Renders at |
|---|---|---|---|
| `.job-figure` | `css/styles.css` ~L1196 | **21:9** | up to 1180px wide |
| `.sector-visual` | `css/styles.css` ~L677 | **4:3** (16:9 ≤860px) | ~520px wide |
| `.page-hero` background | — | **21:9** or wider | full-bleed |
| Open Graph card | `<meta property="og:image">` | **16:9** (1200×630 ideal) | off-site |

---

## 5. Compositing the branded renewables banner

Once `renewables-source.jpg` lands, the branded OG card is built in-repo so it matches
the other three exactly — **never generated**:

1. Start from the 16:9 source at 1672×941 (match the existing three).
2. Darken the left ~40% with a linear gradient to near-black `#07090e`.
3. Draw the arc sweep — a circular stroke in `#f7941d`, ~4px, plus the two light streaks
   entering from the lower left. Sample the geometry from `power-energy-og.jpg`.
4. Paste `images/main-logo.png` (transparent PNG) at the same offset and scale as the
   other three.
5. Render "Renewables &" in `#f4f2ee` / "Energy Storage" in `#f7941d`, Space Grotesk,
   plus the short amber underline rule beneath.
6. Save as `images/sectors/renewables-og.jpg`.

Verify by opening all four `-og.jpg` files side by side — logo position, type size,
baseline and arc geometry must line up.

---

## 6. Delivery checklist

For each delivered image, confirm before it goes in:

- [ ] No text, lettering, signage or numbers anywhere in frame
- [ ] No logo, wordmark or watermark
- [ ] No recognisable faces; no identifiable third-party brands
- [ ] Dark enough to sit on `#07090e` without a visible seam
- [ ] Amber is the only accent — no blue/teal/green light
- [ ] Cropped to its slot ratio via §4 and under ~150 KB
- [ ] Filename kebab-case, no spaces, no ampersands
- [ ] Landed in `images/` (or `images/sectors/` for sector artwork)

After wiring any image into a page, per AGENT.md: bump the `?v=` cache-buster on **both**
`css/styles.css` and `js/main.js` across all nineteen pages if either shared file changed,
and verify in a real browser — several bugs on this site were invisible in the code.
