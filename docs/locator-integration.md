# Locator Block — Back-End Integration Guide

The locator block provides the front-end scaffolding for a Google Maps-based provider/infusion center finder. The customer's back-end team connects to the hook points described below to initialize the map, handle search, and populate results.

---

## Hook Points

The locator block renders the following elements with stable IDs that the integration script should target:

| Element | ID | Type | Purpose |
|---|---|---|---|
| Address input | `#locator-search-input` | `<input type="text">` | User enters city, state, or ZIP code |
| Radius dropdown | `#locator-radius-select` | `<select>` | Distance filter (10, 25, 50, 75, 100 miles) |
| Filter button | `#locator-filter-btn` | `<button>` | Toggles facility type filters panel |
| Search button | `#locator-search-btn` | `<button>` | Triggers provider search |
| Filters panel | `#locator-filters-panel` | `<div>` | Container for facility type checkboxes (hidden by default) |
| Map container | `#locator-map` | `<div>` | Google Maps render target (400px mobile / 500px desktop) |
| Results container | `#locator-results` | `<div>` | Provider results list. Initially shows welcome message. |

### Data Attributes

| Attribute | Location | Value |
|---|---|---|
| `data-api-key` | `.locator` block element | Google Maps API key (authored in DA) |

---

## Integration Script

The integration script should be loaded via `scripts/delayed.js` (post-LCP) or as an external script tag in `head.html`. It should:

1. **Read the API key** from `document.querySelector('.locator').dataset.apiKey`
2. **Load Google Maps JS API** with the key and `libraries=places`
3. **Initialize the map** in `#locator-map`
4. **Set up Places Autocomplete** on `#locator-search-input`
5. **Listen for search** — click on `#locator-search-btn` or Enter key in the input
6. **Query the provider database** with the geocoded location + radius from `#locator-radius-select`
7. **Render results** into `#locator-results` (clear the welcome message first)
8. **Add markers** to the map for each result
9. **Handle filters** — populate `#locator-filters-panel` with facility type checkboxes, update `#locator-filter-btn` text with count

### Example Integration Skeleton

```javascript
// In scripts/delayed.js or a separate integration script
(async function initLocator() {
  const block = document.querySelector('.locator');
  if (!block) return;

  const apiKey = block.dataset.apiKey;
  if (!apiKey) return;

  // Load Google Maps
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=Function.prototype`;
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    const map = new google.maps.Map(document.getElementById('locator-map'), {
      center: { lat: 37.09, lng: -95.71 },
      zoom: 4,
    });

    // Set up autocomplete on search input
    const input = document.getElementById('locator-search-input');
    const autocomplete = new google.maps.places.Autocomplete(input);

    // Handle search
    document.getElementById('locator-search-btn').addEventListener('click', () => {
      const radius = document.getElementById('locator-radius-select').value;
      const place = autocomplete.getPlace();
      // ... query provider API, render results into #locator-results
    });
  };
})();
```

---

## Authored Content

The locator block is authored in DA with a simple 2-cell row:

| Cell 1 | Cell 2 |
|---|---|
| Google Maps API Key | Default radius (e.g., "25") |

The block's `decorate()` function reads these values and builds the full UI. Authors don't need to create the search bar, map, or results — just provide the configuration.

---

## Page Structure

```
Section 1: Hero intro
  H3 "Infusion Locator" (eyebrow)
  H1 "Find an infusion location that's right for you"

Section 2: Description
  Two paragraphs about the VYEPTI Infusion Network

Section 3: Locator block
  [Search bar | Map | Results — all rendered by JS]

Section 4: Disclaimer
  Legal text + document number

Section 5: CTA Cards (cards-feature block)
  Card 1: "Curious about IV infusion?" → /why-iv-treatment
  Card 2: "Treatment worry is real" → /what-to-expect

Section 6: ISI (if using ISI fragment)

Metadata block
```

---

## CSS Classes Available for Styling

| Class | Element | Purpose |
|---|---|---|
| `.locator` | Block wrapper | Main container, holds `data-api-key` |
| `.locator-search-bar` | Search area | Contains input, selects, buttons |
| `.locator-search-row` | Search controls row | Flexbox row of all controls |
| `.locator-input-wrapper` | Input + label | Label + text input group |
| `.locator-filter-btn` | Filter toggle | Teal outline pill button |
| `.locator-search-btn` | Search submit | Rose filled pill button |
| `.locator-filters-panel` | Filter checkboxes | Hidden panel, toggled by filter button |
| `.locator-map-results` | Map + results wrapper | Side-by-side on desktop, stacked on mobile |
| `.locator-map` | Map target | 400px (mobile) / 500px (desktop) height |
| `.locator-results` | Results list | Scrollable on desktop (max-height 500px) |
| `.locator-welcome-heading` | Welcome H1 | Teal, shown before first search |
| `.locator-welcome-text` | Welcome subtitle | Shown before first search |
