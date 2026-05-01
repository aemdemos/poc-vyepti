import { createOptimizedPicture } from '../../scripts/aem.js';

function applyAccentColor(block) {
  block.querySelectorAll('h1 strong, h2 strong, h3 strong, p strong').forEach((strong) => {
    const span = document.createElement('span');
    span.className = 'accent-color';
    span.textContent = strong.textContent;
    strong.replaceWith(span);
  });
}

function decorateSinglePanel(block) {
  applyAccentColor(block);

  const contentDiv = block.querySelector(':scope > div:last-child');
  const lastP = contentDiv?.querySelector(':scope > div > p:last-child');
  if (lastP && lastP.textContent.trim().toLowerCase() === 'actor portrayal') {
    lastP.classList.add('actor-portrayal');
    block.appendChild(lastP);
  }
}

/** Default breakpoints for single hero image (same defaults as `createOptimizedPicture` in aem.js). */
const HERO_PHARMA_SINGLE_PICTURE_BREAKPOINTS = [
  { media: '(min-width: 600px)', width: '2000' },
  { width: '750' },
];

/** Default &lt;img&gt; CDN width (first art-direction asset, viewports &lt; 768px). */
const HERO_PHARMA_ART_DIRECTION_DEFAULT_WIDTH = '750';

/**
 * Art-direction `media` + `width` for source index 1..4 (whitelist — avoids computed array keys).
 * @param {number} imageIndex
 * @returns {{ media: string, width: string }}
 */
function getHeroPharmaArtDirectionSourceMeta(imageIndex) {
  switch (imageIndex) {
    case 1:
      return { media: '(min-width: 768px)', width: '992' };
    case 2:
      return { media: '(min-width: 992px)', width: '1200' };
    case 3:
      return { media: '(min-width: 1200px)', width: '2000' };
    case 4:
      return { media: '(min-width: 1600px)', width: '2560' };
    default:
      return { media: '(min-width: 768px)', width: '750' };
  }
}

/**
 * Walks the image cell in document order and collects up to 5 distinct hero images.
 * @param {HTMLElement} imgCell
 * @returns {{ src: string, alt: string }[]}
 */
function collectHeroPharmaImageSources(imgCell) {
  const out = [];
  const walk = (root) => {
    if (out.length >= 5) return;
    [...root.children].forEach((el) => {
      if (out.length >= 5) return;
      if (el.matches('picture')) {
        const img = el.querySelector('img[src]');
        if (img) {
          out.push({ src: img.src, alt: img.getAttribute('alt') ?? '' });
        }
      } else if (el.matches('img[src]')) {
        if (!el.closest('picture')) {
          out.push({ src: el.src, alt: el.getAttribute('alt') ?? '' });
        }
      } else {
        walk(el);
      }
    });
  };
  walk(imgCell);
  return out;
}

/**
 * One &lt;picture&gt; with art-direction sources (different assets per viewport), same URL pattern as `createOptimizedPicture`.
 * @param {{ src: string, alt: string }[]} sources 2–5 entries
 * @returns {HTMLPictureElement}
 */
function createHeroPharmaArtDirectionPicture(sources) {
  const capped = sources.slice(0, 5);
  const picture = document.createElement('picture');
  const eager = true;

  for (let i = capped.length - 1; i >= 1; i -= 1) {
    const { src } = capped[i];
    const url = !src.startsWith('http') ? new URL(src, window.location.href) : new URL(src);
    const { origin, pathname } = url;
    const ext = pathname.split('.').pop();
    const { media, width } = getHeroPharmaArtDirectionSourceMeta(i);

    const webp = document.createElement('source');
    webp.setAttribute('media', media);
    webp.setAttribute('type', 'image/webp');
    webp.setAttribute('srcset', `${origin}${pathname}?width=${width}&format=webply&optimize=medium`);
    picture.append(webp);

    const fallback = document.createElement('source');
    fallback.setAttribute('media', media);
    fallback.setAttribute(
      'srcset',
      `${origin}${pathname}?width=${width}&format=${ext}&optimize=medium`,
    );
    picture.append(fallback);
  }

  const defaultSrc = capped[0].src;
  const defaultAlt = capped[0].alt;
  const url0 = !defaultSrc.startsWith('http')
    ? new URL(defaultSrc, window.location.href)
    : new URL(defaultSrc);
  const { origin, pathname } = url0;
  const ext = pathname.split('.').pop();
  const width0 = HERO_PHARMA_ART_DIRECTION_DEFAULT_WIDTH;

  const img = document.createElement('img');
  img.setAttribute('loading', eager ? 'eager' : 'lazy');
  img.setAttribute('alt', defaultAlt);
  img.setAttribute(
    'src',
    `${origin}${pathname}?width=${width0}&format=${ext}&optimize=medium`,
  );
  picture.append(img);

  return picture;
}

/**
 * @param {HTMLElement} imgCell
 * @returns {DocumentFragment|HTMLPictureElement|HTMLElement}
 */
function buildHeroPharmaPanelBackgroundContent(imgCell) {
  const sources = collectHeroPharmaImageSources(imgCell);
  const frag = document.createDocumentFragment();

  if (sources.length === 0) {
    frag.append(...imgCell.childNodes);
    return frag;
  }

  if (sources.length === 1) {
    frag.append(
      createOptimizedPicture(
        sources[0].src,
        sources[0].alt,
        true,
        HERO_PHARMA_SINGLE_PICTURE_BREAKPOINTS,
      ),
    );
    return frag;
  }

  frag.append(createHeroPharmaArtDirectionPicture(sources));
  return frag;
}

function decorateDualPanel(block, rows) {
  block.classList.add('hero-pharma-dual');
  const panels = [];

  rows.forEach((row, index) => {
    const cells = [...row.children];
    const panel = document.createElement('div');
    panel.className = `hero-pharma-panel hero-pharma-panel-${index === 0 ? 'dark' : 'light'}`;

    // First cell: image (background)
    const imgCell = cells[0];
    if (imgCell) {
      const bgDiv = document.createElement('div');
      bgDiv.className = 'hero-pharma-panel-bg';
      const bgContent = buildHeroPharmaPanelBackgroundContent(imgCell);
      imgCell.replaceChildren();
      bgDiv.append(bgContent);
      panel.appendChild(bgDiv);
    }

    // Second cell: text content overlay
    const textCell = cells[1];
    if (textCell) {
      const contentDiv = document.createElement('div');
      contentDiv.className = 'hero-pharma-panel-content';
      contentDiv.append(...textCell.childNodes);

      // Move "Actor portrayal" to panel level for absolute positioning
      const allP = contentDiv.querySelectorAll('p');
      allP.forEach((p) => {
        if (p.textContent.trim().toLowerCase() === 'actor portrayal') {
          p.classList.add('actor-portrayal');
          panel.appendChild(p);
        }
      });

      // CTA row: sole link in a paragraph — matches vyepti split-banner absolute CTA band
      contentDiv.querySelectorAll('p').forEach((p) => {
        const a = p.querySelector(':scope > a[href]');
        if (a && p.childElementCount === 1 && p.firstElementChild === a) {
          p.classList.add('hero-pharma-panel-cta-wrap');
        }
      });

      // Group headline/body copy for vyepti-style margin-left/right at wide breakpoints
      const toWrap = [...contentDiv.children].filter(
        (el) => !el.classList.contains('hero-pharma-panel-cta-wrap'),
      );
      if (toWrap.length) {
        const desc = document.createElement('div');
        desc.className = 'hero-pharma-panel-description';
        toWrap.forEach((el) => desc.append(el));
        contentDiv.prepend(desc);
      }

      panel.appendChild(contentDiv);
    }

    panels.push(panel);
  });

  block.textContent = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-pharma-panels';
  panels.forEach((p) => wrapper.appendChild(p));
  block.appendChild(wrapper);

  applyAccentColor(block);
}

export default function decorate(block) {
  const rows = [...block.children];

  // Detect mode: if any row has 2 cells (image + text), it's dual-panel
  const isDual = rows.some((row) => row.children.length >= 2);

  if (!isDual) {
    decorateSinglePanel(block);
    return;
  }

  // Dual-panel: each row has [image cell, text cell]
  decorateDualPanel(block, rows);
}
