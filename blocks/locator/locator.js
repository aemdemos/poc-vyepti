/**
 * Locator block — provider/infusion center finder.
 *
 * Authored with one row containing configuration text:
 *   Row 1, Cell 1: Google Maps API key
 *   Row 1, Cell 2: Default search radius (e.g., "25")
 *
 * The block builds the full locator UI scaffolding:
 *   - Search bar (address input, radius selector, filters, search button)
 *   - Google Map container
 *   - Results panel (welcome message → provider list after search)
 *
 * The customer's back-end integration script initializes the map and
 * populates results via the hook points documented below.
 *
 * Hook points for back-end integration:
 *   #locator-search-input  — address/ZIP text input
 *   #locator-radius-select — distance dropdown
 *   #locator-filter-btn    — filter toggle button
 *   #locator-search-btn    — search submit button
 *   #locator-map            — Google Maps render target
 *   #locator-results        — results list container
 *   data-api-key            — on .locator block, holds the Maps API key
 *
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  const firstRow = rows[0];
  const cells = firstRow ? [...firstRow.children] : [];

  const apiKey = cells[0]?.textContent.trim() || '';
  const defaultRadius = cells[1]?.textContent.trim() || '25';

  block.textContent = '';
  if (apiKey) block.dataset.apiKey = apiKey;

  // Search bar
  const searchBar = document.createElement('div');
  searchBar.className = 'locator-search-bar';

  const requiredLabel = document.createElement('p');
  requiredLabel.className = 'locator-required';
  requiredLabel.textContent = '*Required field';

  const searchRow = document.createElement('div');
  searchRow.className = 'locator-search-row';

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'locator-input-wrapper';
  const inputLabel = document.createElement('label');
  inputLabel.setAttribute('for', 'locator-search-input');
  inputLabel.textContent = 'From city, state, or ZIP code*';
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'locator-search-input';
  input.name = 'location';
  input.required = true;
  input.autocomplete = 'off';
  inputWrapper.append(inputLabel, input);

  const radiusSelect = document.createElement('select');
  radiusSelect.id = 'locator-radius-select';
  radiusSelect.name = 'radius';
  [10, 25, 50, 75, 100].forEach((miles) => {
    const opt = document.createElement('option');
    opt.value = miles;
    opt.textContent = `${miles} miles`;
    if (String(miles) === defaultRadius) opt.selected = true;
    radiusSelect.append(opt);
  });

  const filterBtn = document.createElement('button');
  filterBtn.type = 'button';
  filterBtn.id = 'locator-filter-btn';
  filterBtn.className = 'locator-filter-btn';
  filterBtn.textContent = 'Filters (0 selected)';

  const searchBtn = document.createElement('button');
  searchBtn.type = 'button';
  searchBtn.id = 'locator-search-btn';
  searchBtn.className = 'locator-search-btn';
  searchBtn.textContent = 'Search';

  searchRow.append(inputWrapper, radiusSelect, filterBtn, searchBtn);
  searchBar.append(requiredLabel, searchRow);

  // Filters panel (hidden by default, toggled by filter button)
  const filtersPanel = document.createElement('div');
  filtersPanel.id = 'locator-filters-panel';
  filtersPanel.className = 'locator-filters-panel';
  filtersPanel.hidden = true;

  const filtersHeading = document.createElement('p');
  filtersHeading.className = 'locator-filters-heading';
  filtersHeading.textContent = 'Facility Types';
  filtersPanel.append(filtersHeading);

  filterBtn.addEventListener('click', () => {
    filtersPanel.hidden = !filtersPanel.hidden;
  });

  // Map + Results container
  const mapResultsContainer = document.createElement('div');
  mapResultsContainer.className = 'locator-map-results';

  const mapContainer = document.createElement('div');
  mapContainer.id = 'locator-map';
  mapContainer.className = 'locator-map';

  const resultsContainer = document.createElement('div');
  resultsContainer.id = 'locator-results';
  resultsContainer.className = 'locator-results';

  const welcomeHeading = document.createElement('h1');
  welcomeHeading.className = 'locator-welcome-heading';
  welcomeHeading.textContent = 'Welcome';
  const welcomeText = document.createElement('h2');
  welcomeText.className = 'locator-welcome-text';
  welcomeText.textContent = 'Please enter your information to begin your search.';
  resultsContainer.append(welcomeHeading, welcomeText);

  mapResultsContainer.append(mapContainer, resultsContainer);

  // Assemble
  block.append(searchBar, filtersPanel, mapResultsContainer);
}
