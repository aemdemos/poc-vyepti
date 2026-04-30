/**
 * Locator block — static shell matching PICL (vyepti.com infusion locator) layout
 * and styling for desktop and mobile. Map/list region is present for future
 * integration; no search or geocoding behavior is implemented.
 *
 * Optional authoring: empty block, or one metadata row for future use (ignored
 * for the static shell so no secrets appear in document HTML).
 *
 * @param {HTMLElement} block
 */
import { decorateIcons } from '../../scripts/aem.js';

export default function decorate(block) {
  block.textContent = '';

  const shell = document.createElement('div');
  shell.className = 'locator-shell';

  const searchSection = document.createElement('div');
  searchSection.className = 'locator-search-section';

  const requiredLabel = document.createElement('p');
  requiredLabel.className = 'locator-required';
  requiredLabel.textContent = '*Required field';

  const form = document.createElement('form');
  form.className = 'locator-form';
  form.setAttribute('novalidate', '');
  form.addEventListener('submit', (e) => e.preventDefault());

  const formRow = document.createElement('div');
  formRow.className = 'locator-form-row';

  const addressCol = document.createElement('div');
  addressCol.className = 'locator-field locator-field-address';
  const addressBlock = document.createElement('div');
  addressBlock.className = 'locator-address-block';
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'locator-search-input';
  input.name = 'location';
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('aria-required', 'true');
  input.addEventListener('input', () => {
    addressBlock.classList.toggle('locator-address-block-filled', Boolean(input.value.trim()));
  });
  const inputLabel = document.createElement('label');
  inputLabel.setAttribute('for', 'locator-search-input');
  inputLabel.textContent = 'From city, state, or ZIP code*';
  addressBlock.append(input, inputLabel);
  addressCol.append(addressBlock);

  const mileCol = document.createElement('div');
  mileCol.className = 'locator-field locator-field-mile';
  const mileWrap = document.createElement('div');
  mileWrap.className = 'locator-mile-block';
  const radiusSelect = document.createElement('select');
  radiusSelect.id = 'locator-radius-select';
  radiusSelect.name = 'radius';
  radiusSelect.setAttribute('aria-label', 'Search radius in miles');
  [10, 25, 50, 75, 100].forEach((miles) => {
    const opt = document.createElement('option');
    opt.value = String(miles);
    opt.textContent = `${miles} miles`;
    if (miles === 25) opt.selected = true;
    radiusSelect.append(opt);
  });
  mileWrap.append(radiusSelect);
  mileCol.append(mileWrap);

  const filterCol = document.createElement('div');
  filterCol.className = 'locator-field locator-field-filter';
  const filterWrap = document.createElement('div');
  filterWrap.className = 'locator-filter-wrap';
  const filterBtn = document.createElement('button');
  filterBtn.type = 'button';
  filterBtn.id = 'locator-filter-btn';
  filterBtn.className = 'locator-filter-dd-trigger';
  filterBtn.setAttribute('aria-expanded', 'false');
  filterBtn.setAttribute('aria-haspopup', 'true');
  filterBtn.setAttribute('aria-controls', 'locator-filters-panel');
  const filterBtnLabel = document.createElement('span');
  filterBtnLabel.className = 'locator-filter-dd-label';
  filterBtnLabel.textContent = 'Filters';
  const filterBtnMeta = document.createElement('span');
  filterBtnMeta.className = 'locator-filter-dd-meta';
  filterBtnMeta.textContent = '(0 selected)';
  const filterIcon = document.createElement('span');
  filterIcon.className = 'icon icon-locator-plus';
  filterIcon.setAttribute('aria-hidden', 'true');
  filterBtn.append(filterBtnLabel, filterBtnMeta, filterIcon);

  const filtersPanel = document.createElement('div');
  filtersPanel.id = 'locator-filters-panel';
  filtersPanel.className = 'locator-filters-dropdown';
  filtersPanel.hidden = true;
  filtersPanel.setAttribute('role', 'region');
  filtersPanel.setAttribute('aria-label', 'Facility filters');

  const filterOpt1 = document.createElement('label');
  filterOpt1.className = 'locator-filter-option';
  const cb1 = document.createElement('input');
  cb1.type = 'checkbox';
  cb1.disabled = true;
  cb1.setAttribute('aria-disabled', 'true');
  const mark1 = document.createElement('span');
  mark1.className = 'locator-filter-checkmark';
  const txt1 = document.createElement('span');
  txt1.className = 'locator-filter-option-text';
  txt1.textContent = 'Infusion Service Provider';
  filterOpt1.append(cb1, mark1, txt1);

  const filterOpt2 = document.createElement('label');
  filterOpt2.className = 'locator-filter-option';
  const cb2 = document.createElement('input');
  cb2.type = 'checkbox';
  cb2.disabled = true;
  cb2.setAttribute('aria-disabled', 'true');
  const mark2 = document.createElement('span');
  mark2.className = 'locator-filter-checkmark';
  const txt2 = document.createElement('span');
  txt2.className = 'locator-filter-option-text';
  txt2.textContent = 'Home Infusion';
  filterOpt2.append(cb2, mark2, txt2);

  filtersPanel.append(filterOpt1, filterOpt2);

  filterBtn.addEventListener('click', () => {
    filtersPanel.hidden = !filtersPanel.hidden;
    const expanded = !filtersPanel.hidden;
    filterBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    filterWrap.classList.toggle('locator-filter-wrap-open', expanded);
    const filterIconSpan = filterBtn.querySelector('span.icon');
    if (filterIconSpan) {
      filterIconSpan.replaceChildren();
      filterIconSpan.className = `icon ${expanded ? 'icon-locator-minus' : 'icon-locator-plus'}`;
      decorateIcons(filterBtn);
    }
  });

  filterWrap.append(filterBtn, filtersPanel);
  filterCol.append(filterWrap);

  const searchCol = document.createElement('div');
  searchCol.className = 'locator-field locator-field-search';
  const searchBtnDesktop = document.createElement('button');
  searchBtnDesktop.type = 'button';
  searchBtnDesktop.id = 'locator-search-btn';
  searchBtnDesktop.className = 'locator-search-btn locator-search-btn-desktop';
  searchBtnDesktop.setAttribute('aria-label', 'Search');

  const searchBtnMobile = document.createElement('button');
  searchBtnMobile.type = 'button';
  searchBtnMobile.className = 'locator-search-btn locator-search-btn-mobile';
  searchBtnMobile.textContent = 'SEARCH';

  searchCol.append(searchBtnDesktop, searchBtnMobile);

  formRow.append(addressCol, mileCol, filterCol, searchCol);
  form.append(formRow);

  const facilityBand = document.createElement('div');
  facilityBand.className = 'locator-facility-band';
  const facilityHeading = document.createElement('div');
  facilityHeading.className = 'locator-facility-heading';
  const facilityTitle = document.createElement('p');
  facilityTitle.textContent = 'Facility Types';
  const facilityExpand = document.createElement('button');
  facilityExpand.type = 'button';
  facilityExpand.className = 'locator-facility-expand';
  facilityExpand.setAttribute('aria-expanded', 'false');
  facilityExpand.setAttribute('aria-controls', 'locator-facility-legends');
  facilityExpand.setAttribute('aria-label', 'Expand facility type descriptions');
  const facilityExpandIcon = document.createElement('span');
  facilityExpandIcon.className = 'icon icon-locator-plus';
  facilityExpandIcon.setAttribute('aria-hidden', 'true');
  facilityExpand.append(facilityExpandIcon);
  facilityHeading.append(facilityTitle, facilityExpand);

  const legends = document.createElement('div');
  legends.id = 'locator-facility-legends';
  legends.className = 'locator-facility-legends';

  const leg1 = document.createElement('div');
  leg1.className = 'locator-facility-legend locator-facility-legend-infusion';
  const leg1Icon = document.createElement('span');
  leg1Icon.className = 'icon icon-locator-service-infusion';
  leg1Icon.setAttribute('aria-hidden', 'true');
  const leg1Text = document.createElement('span');
  leg1Text.textContent = 'Infusion center';
  leg1.append(leg1Icon, leg1Text);

  const leg2 = document.createElement('div');
  leg2.className = 'locator-facility-legend locator-facility-legend-home';
  const leg2Icon = document.createElement('span');
  leg2Icon.className = 'icon icon-locator-home-infusion';
  leg2Icon.setAttribute('aria-hidden', 'true');
  const leg2Text = document.createElement('span');
  leg2Text.append(
    document.createTextNode(' Home Infusion '),
    document.createElement('br'),
    document.createTextNode('(availability depends on insurance coverage)'),
  );
  leg2.append(leg2Icon, leg2Text);

  const leg3 = document.createElement('div');
  leg3.className = 'locator-facility-legend locator-facility-legend-pin';
  const leg3Pin = document.createElement('div');
  leg3Pin.className = 'locator-facility-pin-wrap';
  const leg3Icon = document.createElement('span');
  leg3Icon.className = 'icon icon-locator-pin-red';
  leg3Icon.setAttribute('aria-hidden', 'true');
  leg3Pin.append(leg3Icon);
  const leg3Text = document.createElement('span');
  leg3Text.textContent = 'VYEPTI Infusion Network';
  leg3.append(leg3Pin, leg3Text);

  legends.append(leg1, leg2, leg3);

  facilityExpand.addEventListener('click', () => {
    const open = facilityBand.classList.toggle('locator-facility-band-open');
    facilityExpand.setAttribute('aria-expanded', open ? 'true' : 'false');
    const expIcon = facilityExpand.querySelector('span.icon');
    if (expIcon) {
      expIcon.replaceChildren();
      expIcon.className = `icon ${open ? 'icon-locator-minus' : 'icon-locator-plus'}`;
      decorateIcons(facilityExpand);
    }
  });

  facilityBand.append(facilityHeading, legends);

  searchSection.append(requiredLabel, form, facilityBand);

  const mapResultsContainer = document.createElement('div');
  mapResultsContainer.className = 'locator-map-results';

  const mapContainer = document.createElement('div');
  mapContainer.id = 'locator-map';
  mapContainer.className = 'locator-map';
  mapContainer.setAttribute('role', 'presentation');
  mapContainer.setAttribute('aria-label', 'Map area');

  const resultsContainer = document.createElement('div');
  resultsContainer.id = 'locator-results';
  resultsContainer.className = 'locator-results';

  const welcome = document.createElement('div');
  welcome.className = 'locator-welcome';
  const welcomeHeading = document.createElement('p');
  welcomeHeading.className = 'locator-welcome-title';
  welcomeHeading.textContent = 'Get Started';
  const welcomeText = document.createElement('p');
  welcomeText.className = 'locator-welcome-subtitle';
  welcomeText.textContent = 'Please enter your information to begin your search.';
  welcome.append(welcomeHeading, welcomeText);
  resultsContainer.append(welcome);

  mapResultsContainer.append(mapContainer, resultsContainer);
  shell.append(searchSection, mapResultsContainer);
  block.append(shell);

  decorateIcons(block);
}
