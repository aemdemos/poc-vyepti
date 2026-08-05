# Stardust → EDS conversion log — VyeptiHCP homepage

Source: `stardust:replica` prototype `stardust/prototypes/home-proposed.html` in the
`VyeptiHCP/stardust/stardust-replica` project (bounded single-page pilot against
`https://vyeptihcp-stage.d.lundbeckus.com/`). Target: this repo (`aemdemos/poc-vyepti`),
branch `stardust-replica`, content path `/index-vyeptihcp` (existing `/index` — the
Vyepti.com POC homepage — is left untouched).

Design tokens were **not** re-extracted (`.agents/skills/get-general-styling.md`
skipped deliberately): `styles/styles.css` already carries real VYEPTI brand tokens
(`--brand-teal-muted: #41748d`, `--brand-rose: #c02c57`, `--card-bg-light: #eff6f9`)
that match the stardust extraction (`DESIGN.json`) exactly — this is the sibling
vyepti.com brand, same design system. Only additive token changes are made (see below).

## Section → block mapping (locked before writing code)

| Prototype section | Block | Notes |
|---|---|---|
| Utility bars (audience gate + ISI strip + Rx/Patient-info links) | default content, 2 sections w/ section-metadata style | No repeating units — D1 default content, not a block |
| Header nav (logo, links, CTA pills) | `header` (existing) | Content authored in `/nav`; VyeptiHCP nav items replace vyepti.com's |
| Hero (photo + eyebrow ribbon + headline) | `hero-pharma` (existing, single-panel mode) | Eyebrow italic style is a small CSS addition — block doesn't currently style an italic accent line |
| 3-tab strip (Fewer migraine days / Safety & tolerability / Infusion options) | `tabs` (existing, canonical Block Collection shape) | Per-tab color variants (navy-active/magenta/light-teal) are new CSS on top of the existing block — a `hero-tabs` variant class |
| PIVOTAL TRIAL RESULTS 3-stat grid | `columns` (existing, 3-col) | Inside tab 1's panel |
| Safety & tolerability teaser + adverse-reactions copy | `columns-cta` (existing, 2-col) + default content | Inside tab 2's panel |
| Infusion/coverage 3 mini-headings + 3 teaser rows | `columns` (headings) + `columns-cta` ×3 (existing) | Inside tab 3's panel |
| Fixed ISI bar + full inline ISI | `isi` (existing — exact content-model match: row 1 = abbreviated, row 2 = full inline) | Best existing-block match of the whole conversion |
| Safety/tolerability band (photo + text + CTA) | `columns-cta` (existing, 2-col) | |
| Position-statement quote + CTA | **default content** (not `quote` block) | Plain prose + one CTA, no repeating unit — D1 |
| Copay support band (image + heading + list + CTA + fine print) | `columns-cta` (existing, 2-col) | |
| Explore-efficacy / review-safety divider band | default content, section-metadata style | Two plain links, no card treatment |
| Full ISI section | *(same `isi` block, row 2)* | Not a separate block — see above |
| Footer | `footer` (existing) | Content authored in `/footer`; VyeptiHCP links/social/copyright replace vyepti.com's |

## Deferred (explicit user decision, 2026-08-05)

- **Exit-intent "leave site" modal** — fires on any outbound link in the captured
  page; the existing `modal` block only auto-triggers on authored `/modals/` links.
  Would need a small site-wide click-interceptor addition to `scripts.js`. Deferred.
- **LuMi AI chat widget** — third-party embed (`lumichat.norta.ai`); only the UI
  mockup was captured, not real vendor embed/init code. Deferred — needs the actual
  embed snippet from Lundbeck/vendor before it can be wired up.

## Font

`proxima-nova` — same licensed Typekit face as the stardust extraction found;
this repo already ships the `size-adjust: 98%; src: local('Arial')` metric-matched
fallback (no Google Fonts substitute needed — simpler and already established here).

## David's Model lint (`davids-model-lint.mjs drafts/`)

`PASS — 0 🔴, 4 🟡` after two fixes:
- The in-panel layout wrappers (`stat-grid`, `teaser-row`, `mini-heading-row` inside
  the `tabs` cells) were first authored with `class="…"`, which the lint's D2 check
  flags as a suspected nested block table (it can't distinguish a real block from a
  plain CSS wrapper by class name alone). Switched to `data-layout="…"` attributes —
  same CSS targeting, no false positive, and genuinely correct per D2 (no block is
  actually nested).
- `LinkedIn.svg` embeds a base64 PNG behind a pattern fill (the #99 trap — would 409
  the whole page's preview). Extracted the raster (`data:image/png;base64,…` → PNG,
  635×540) to `icons/linkedin-vyeptihcp.png`, committed as a fixed code asset.

Remaining 🟡 (informational, not blocking):
- 5 other authored SVGs (`logo-lundbeck-desktop`, `facebook`, `instagram`, `youtube`,
  `Homepage_tab4_infusion`) — verified pure-vector (no `data:image`/`<image>`) by
  direct fetch; safe as authored.
- `hero-pharma` and `isi` flagged as "default-content candidates" (single-column,
  2-row blocks holding prose) — both are genuine bespoke widgets, not D1 violations:
  `hero-pharma` has a real background-image + scrim compositing treatment (not
  expressible as default content), and `isi` has real behavior (fixed bottom bar +
  `IntersectionObserver` show/hide + expand/collapse toggle).

## Tooling note: `sanitise.js` multi-file invocation bug

Running `node sanitise.js drafts/index-vyeptihcp.html drafts/nav.html drafts/footer.html`
in one invocation silently overwrote `nav.html` with `index-vyeptihcp.html`'s content
(only `nav.html` was reported as changed — "encoded 2 non-ASCII character(s)"). Running
it once per file individually does not reproduce the issue. Restored `nav.html` from
source and re-sanitised it alone; re-ran `davids-model-lint.mjs drafts/` to confirm
`PASS — 0 🔴` afterward. Flagging for whoever maintains the bundled deploy scripts —
**always sanitise one file per invocation**, not a multi-path argument list.

## New token added

`--brand-navy: #073348` — used once, for the hero eyebrow line only (not previously
in `styles.css`'s token set).
