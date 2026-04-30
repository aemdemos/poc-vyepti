# Hero Pharma — Dual-Panel Authoring Guide

## How to Author the Two-Panel Hero in DA

The hero-pharma block supports two modes:

### Single-Panel (Legacy)
Two rows, each with one cell:
```
| Hero Pharma |
| [Image] |
| [H3 + H1 + paragraph + CTA link + "Actor portrayal"] |
```

### Dual-Panel (New — Two-Slide Split)
Two rows, each with TWO cells (image | text):
```
| Hero Pharma |
| [Dark background image] | [White text: "When a showstopping migraine is one big **nope**" + "Actor portrayal"] |
| [Light background image] | [Teal/rose text: "It may be time to say **yep** to **VYEPTI**" + body copy + CTA link + "Actor portrayal"] |
```

## Detection Logic
- If any row has **2 cells**: dual-panel mode activates
- If all rows have **1 cell**: legacy single-panel mode

## Panel Styling
- **Row 1 → Dark panel** (left on desktop, first slide on mobile): white text, large "nope" word, dark image background
- **Row 2 → Light panel** (right on desktop, second slide on mobile): teal/rose text, CTA button, light image background

## Example DA Content (HTML)
```html
<div class="hero-pharma">
  <div>
    <div>
      <picture><!-- dark/nope background image --></picture>
    </div>
    <div>
      <p>When a showstopping</p>
      <p>migraine is one big</p>
      <p>nope</p>
      <p><em>Actor portrayal</em></p>
    </div>
  </div>
  <div>
    <div>
      <picture><!-- light/yep background image --></picture>
    </div>
    <div>
      <p>It may be time to</p>
      <p>say <strong>yep</strong> to <strong>VYEPTI</strong></p>
      <p>Migraine prevention that's proven to last 3 months in clinical studies.</p>
      <p><a href="/vyepti-study-results">Check out study results</a></p>
      <p><em>Actor portrayal</em></p>
    </div>
  </div>
</div>
```
