import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll(':scope > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

function closeAllDropdowns(nav) {
  nav.querySelectorAll('[aria-expanded="true"]').forEach((el) => {
    el.setAttribute('aria-expanded', 'false');
  });
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    closeAllDropdowns(nav);
  }
}

function closeOnClickOutside(e) {
  const nav = document.getElementById('nav');
  if (nav && !nav.contains(e.target)) {
    closeAllDropdowns(nav);
  }
}

/**
 * Builds the search form (form controls in JS per EDS convention)
 * @returns {HTMLElement} search form element
 */
function buildSearchForm() {
  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'nav-search';

  const form = document.createElement('form');
  form.className = 'nav-search-form';
  form.setAttribute('role', 'search');
  form.action = '/search';
  form.method = 'get';

  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = 'Search';
  input.setAttribute('aria-label', 'Search');
  input.autocomplete = 'off';

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.setAttribute('aria-label', 'Search');

  const icon = document.createElement('img');
  icon.src = '/content/images/search-icon.svg';
  icon.alt = '';
  icon.width = 18;
  icon.height = 18;
  icon.loading = 'lazy';
  btn.append(icon);

  form.append(input, btn);
  searchWrapper.append(form);
  return searchWrapper;
}

/**
 * Decorates the utility bar section (top teal bar)
 * @param {Element} utilSection The utility bar section from nav fragment
 * @returns {HTMLElement} decorated utility bar
 */
function decorateUtilityBar(utilSection) {
  const utilBar = document.createElement('div');
  utilBar.className = 'nav-utility';

  const container = document.createElement('div');
  container.className = 'nav-utility-container';

  // Tagline
  const tagline = utilSection.querySelector('p');
  if (tagline) {
    const taglineEl = document.createElement('span');
    taglineEl.className = 'nav-utility-tagline';
    taglineEl.textContent = tagline.textContent.trim();
    container.append(taglineEl);
  }

  // Utility links (PI dropdowns, HCP link)
  const utilLinks = document.createElement('div');
  utilLinks.className = 'nav-utility-links';

  const ul = utilSection.querySelector('ul');
  if (ul) {
    [...ul.children].forEach((li) => {
      const subUl = li.querySelector('ul');
      const link = li.querySelector(':scope > a');

      if (subUl) {
        // Dropdown item (Patient Info, Prescribing Info)
        const dropdown = document.createElement('div');
        dropdown.className = 'nav-utility-dropdown';

        const trigger = document.createElement('button');
        trigger.className = 'nav-utility-dropdown-trigger';
        trigger.setAttribute('aria-expanded', 'false');
        const directText = Array.from(li.childNodes)
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent.trim())
          .join('');
        trigger.textContent = directText;

        const menu = document.createElement('div');
        menu.className = 'nav-utility-dropdown-menu';
        [...subUl.children].forEach((subLi) => {
          const a = subLi.querySelector('a');
          if (a) menu.append(a.cloneNode(true));
        });

        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const expanded = trigger.getAttribute('aria-expanded') === 'true';
          // Close other utility dropdowns
          dropdown.closest('.nav-utility-links')
            .querySelectorAll('.nav-utility-dropdown-trigger[aria-expanded="true"]')
            .forEach((t) => t.setAttribute('aria-expanded', 'false'));
          trigger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });

        dropdown.append(trigger, menu);
        utilLinks.append(dropdown);
      } else if (link) {
        // Simple link (HCP)
        const a = link.cloneNode(true);
        a.className = 'nav-utility-link';
        utilLinks.append(a);
      }
    });
  }

  // Social icons
  const socialParagraphs = utilSection.querySelectorAll('p');
  const socialP = [...socialParagraphs].find((p) => p.querySelector('a img'));
  if (socialP) {
    const socialLinks = document.createElement('div');
    socialLinks.className = 'nav-utility-social';
    socialP.querySelectorAll('a').forEach((a) => {
      const clone = a.cloneNode(true);
      clone.className = 'nav-utility-social-link';
      socialLinks.append(clone);
    });
    utilLinks.append(socialLinks);
  }

  container.append(utilLinks);
  utilBar.append(container);
  return utilBar;
}

/**
 * Decorates the brand row with logo and tool links
 * @param {Element} brandSection The brand section (logo)
 * @param {Element} toolsSection The tools section (icon links)
 * @returns {HTMLElement} decorated brand row
 */
function decorateBrandRow(brandSection, toolsSection) {
  const brandRow = document.createElement('div');
  brandRow.className = 'nav-brand-row';

  const container = document.createElement('div');
  container.className = 'nav-brand-container';

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.className = 'nav-brand';
  const logoLink = brandSection.querySelector('a');
  if (logoLink) {
    const clone = logoLink.cloneNode(true);
    clone.className = 'nav-brand-link';
    logoWrapper.append(clone);
  }
  container.append(logoWrapper);

  // Tools (icon links)
  const toolsWrapper = document.createElement('div');
  toolsWrapper.className = 'nav-tools';

  if (toolsSection) {
    toolsSection.querySelectorAll('p').forEach((p) => {
      const a = p.querySelector('a');
      if (a) {
        const toolLink = a.cloneNode(true);
        toolLink.className = 'nav-tool-link';
        const img = toolLink.querySelector('img');
        if (img) img.className = 'nav-tool-icon';
        toolsWrapper.append(toolLink);
      }
    });
  }

  // Search form (built in JS)
  toolsWrapper.append(buildSearchForm());
  container.append(toolsWrapper);
  brandRow.append(container);
  return brandRow;
}

/**
 * Decorates the navigation links row
 * @param {Element} sectionsEl The sections element (nav links with dropdowns)
 * @returns {HTMLElement} decorated nav links row
 */
function decorateNavLinks(sectionsEl) {
  const navRow = document.createElement('div');
  navRow.className = 'nav-links-row';

  const container = document.createElement('div');
  container.className = 'nav-links-container';

  const ul = sectionsEl.querySelector('ul');
  if (ul) {
    const navList = ul.cloneNode(true);
    navList.className = 'nav-links-list';

    // Add dropdown behavior to items with sub-menus
    navList.querySelectorAll(':scope > li').forEach((li) => {
      const subUl = li.querySelector('ul');
      if (subUl) {
        li.classList.add('nav-drop');
        li.setAttribute('aria-expanded', 'false');
        li.setAttribute('tabindex', '0');
        subUl.className = 'nav-dropdown-menu';

        // Hover open/close
        li.addEventListener('mouseenter', () => {
          toggleAllNavSections(navList);
          li.setAttribute('aria-expanded', 'true');
        });
        li.addEventListener('mouseleave', () => {
          li.setAttribute('aria-expanded', 'false');
        });

        // Click toggle
        li.addEventListener('click', (e) => {
          if (e.target.closest('a')) return;
          e.stopPropagation();
          const expanded = li.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navList);
          li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });

        // Keyboard
        li.addEventListener('keydown', (e) => {
          if (e.code === 'Enter' || e.code === 'Space') {
            e.preventDefault();
            const expanded = li.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navList);
            li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        });
      }
    });

    container.append(navList);
  }

  navRow.append(container);
  return navRow;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/content/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  // Collect sections from fragment: brand, sections, tools, utility
  const sections = [...fragment.children];

  const [brandSection, sectionsEl, toolsSection, utilitySection] = sections;

  // Build 3-row header: utility (top), brand+tools (middle), nav links (bottom)
  if (utilitySection) nav.append(decorateUtilityBar(utilitySection));
  if (brandSection) nav.append(decorateBrandRow(brandSection, toolsSection));
  if (sectionsEl) nav.append(decorateNavLinks(sectionsEl));

  // Keyboard and click-outside handlers
  window.addEventListener('keydown', closeOnEscape);
  document.addEventListener('click', closeOnClickOutside);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
