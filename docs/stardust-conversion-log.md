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

---

# coverage-reimbursement page (stardust:replica, 2026-08-06)

Source: `stardust/prototypes/coverage-reimbursement-proposed.html` — gated against
`https://www.vyeptihcp.com/coverage-reimbursement` with the strongest source-fidelity
result of this batch (content-diff and visual-diff both fully clean). Target content
path `/coverage-reimbursement`.

## Section → block mapping

| Prototype section | Block | Notes |
|---|---|---|
| `.cr-hero` (photo banner + h1) | `hero-pharma` (existing, `.page-title` variant) | Reused as-is, no new CSS |
| Anchor-jump nav card (Coverage / PA resources / Reimbursement) | default content, `data-layout="jump-nav"` | Plain `<a href="#...">` pills — not `tabs` (no panel-switching JS in source) |
| `#coverage` (VYEPTI Coverage Finder) | `columns-cta` (existing, 2-col) | Callout box (`data-layout="callout-box"`) is new page-scoped CSS for the highlighted stat line |
| `#vyepti-connect-help` | `columns-cta` (existing, 2-col) | `Style: light` section-metadata for the soft-teal band |
| `#pa-resources` top (text+CTA / image) | `columns-cta` (existing, 2-col) | |
| `#pa-resources` quicklinks (3 icon-links) | `columns resource-list` (existing variant) | Direct fit, no new CSS |
| Contact-a-rep band | default content, `data-layout="contact-a-rep"` (existing, reused from vyepti-resources) | Source has a rose arrow-circle button this shared pattern doesn't render; accepted as a minor fidelity gap rather than edit the shared pattern |
| `#reimbursement` NDC/HCPCS billing table | real semantic `<table class="cr-drug-table">` in default content (decision already made — no bespoke block) | Exact CSS values from source (`border:1px solid teal`, `th{background:teal;padding:4px 60px}`, `td{padding:8px 20px;width:50%}`) added as page-scoped rules |
| `#resources` quicklinks (4 icon-links) | `columns resource-list` (existing variant) | Direct fit, no new CSS |
| Explore-links teal band (2 icon-arrow links) | default content, `data-layout="arrow-nav"` (existing, reused from vyepti-resources) | Direct fit, no new CSS |
| Fixed/inline ISI | `isi` (existing) | See scroll-behavior note below |

## Page-scoped CSS addition (`styles/styles.css`)

Per this page's specific instructions, avoided touching shared blocks and used
distinctly-named, additive-only rules (`[data-layout="jump-nav"]`, `[data-layout="callout-box"]`,
`.cr-drug-table`, `.cr-jcode-row`, `.cr-jcode-badge`), all scoped under `body.vyeptihcp main`,
appended at the end of the file after the existing vyepti-resources block — same established
convention already used by that page. This was a deliberate, scoped exception to the general
"don't touch shared files" rule for this batch, made because (a) this codebase's own convention
already puts page-scoped default-content CSS in `styles.css` (see the vyepti-resources
`[data-layout="resource-link-row"]` etc. rules), and (b) the class/attribute names chosen are
unique to this page and unlikely to collide with concurrent sibling-page edits to the same file.
**Diff was purely additive** (142 new lines at EOF, nothing else touched) — flagging here in
case it needs reconciling against a sibling agent's own `styles.css` additions.

## ISI scroll-behavior finding (no code change needed)

This page's source ISI bar converts from `position:fixed` to a static in-flow block once
scrolled past `<main>` (rather than the homepage's simpler always-fixed treatment). Read
`blocks/isi/isi.js`: it already implements the equivalent end-to-end behavior via an
`IntersectionObserver` on the block's parent `.section` — the fixed abbreviated bar hides
and the full inline content (already in normal document flow, row 2) is revealed exactly
when the ISI section scrolls into view, and a click-to-expand toggle covers the pre-scroll
"+/−" behavior too. Confirmed working as-is; no changes made to the shared `isi` block.

## Known fidelity gaps (accepted, not fixed, to stay in scope)

- `columns-cta`'s CTA styling renders pills in **teal**, not this page's source **rose/magenta**
  (`btn-pill-primary`) — same accepted deviation already baked into the homepage's use of this
  block; not re-litigated here.
- `contact-a-rep` (reused as-is) has no rose arrow-circle button, unlike this page's source.
- The coverage-finder image cell keeps its caption paragraph inside the same cell as the
  `<picture>`, which prevents `columns-cta.js`'s auto img-col detection (picture must be the
  *sole* child) — minor mobile stacking-order difference only (image doesn't jump above text
  on narrow viewports); desktop layout unaffected.

## David's Model lint

`PASS — 0 🔴, 3 🟡` — the 3 yellow flags are the same categories already justified elsewhere
in this log: `hero-pharma`/`isi` default-content-candidate (both genuine bespoke widgets, see
above), and 8 authored SVGs batch-flagged for the #99 trap (all verified pure-vector via direct
`curl | grep -c data:image` → 0, safe as authored).
