/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-pharma. Base: hero. Source: https://www.vyepti.com/
 *
 * Supports two modes:
 * - Single teaser: Row 1 = background image, Row 2 = content (legacy)
 * - Dual teaser: Row 1 = [dark image | dark text], Row 2 = [light image | light text]
 *
 * Detection: if the source element contains 2+ .cmp-teaser elements, dual-panel mode activates.
 * Each teaser becomes a row with 2 cells: [image, text content].
 * Updated: 2026-04-30 for dual-panel hero support.
 */
export default function parse(element, { document }) {
  const teasers = element.querySelectorAll('.cmp-teaser');

  if (teasers.length >= 2) {
    parseDualPanel(element, document, teasers);
  } else {
    parseSinglePanel(element, document);
  }
}

function parseDualPanel(element, document, teasers) {
  const cells = [];

  teasers.forEach((teaser) => {
    const img = teaser.querySelector('.cmp-teaser__image img, .cmp-teaser__image picture');
    const contentEl = teaser.querySelector('.cmp-teaser__content, .cmp-teaser__description');
    const ctaLink = teaser.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');
    const actorText = teaser.querySelector('.cmp-teaser__pretitle, [class*="actor"]');

    // Build text cell content
    const textWrapper = document.createElement('div');

    // Extract text paragraphs from the content area
    if (contentEl) {
      const paragraphs = contentEl.querySelectorAll('h1, h2, h3, p, [class*="title"], [class*="description"]');
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) {
          const para = document.createElement('p');
          para.innerHTML = p.innerHTML;
          textWrapper.appendChild(para);
        }
      });
    }

    // Add CTA if present
    if (ctaLink) {
      const arrowImg = ctaLink.querySelector('img');
      if (arrowImg) arrowImg.remove();
      const ctaPara = document.createElement('p');
      ctaPara.appendChild(ctaLink.cloneNode(true));
      textWrapper.appendChild(ctaPara);
    }

    // Add "Actor portrayal"
    if (actorText && actorText.textContent.trim().toLowerCase().includes('actor')) {
      const actorP = document.createElement('p');
      actorP.textContent = 'Actor portrayal';
      textWrapper.appendChild(actorP);
    } else {
      // Check for actor portrayal elsewhere in the teaser
      const allText = teaser.querySelectorAll('p, span, div');
      allText.forEach((el) => {
        if (el.textContent.trim().toLowerCase() === 'actor portrayal') {
          const actorP = document.createElement('p');
          actorP.textContent = 'Actor portrayal';
          textWrapper.appendChild(actorP);
        }
      });
    }

    // Row: [image cell, text cell]
    const row = [img || '', textWrapper];
    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-pharma', cells });
  element.replaceWith(block);
}

function parseSinglePanel(element, document) {
  const bgImage = element.querySelector('.cmp-teaser__image img, .cmp-teaser__image picture');
  const subheading = element.querySelector('.cmp-teaser__description h3');
  const heading = element.querySelector('.cmp-teaser__description h1');
  const description = element.querySelector('.cmp-teaser__description p');
  const ctaLink = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

  const cells = [];

  if (bgImage) {
    cells.push([bgImage]);
  }

  const contentWrapper = document.createElement('div');
  if (heading) contentWrapper.append(heading);
  if (subheading) contentWrapper.append(subheading);
  if (description) contentWrapper.append(description);
  if (ctaLink) {
    const arrowImg = ctaLink.querySelector('img');
    if (arrowImg) arrowImg.remove();
    contentWrapper.append(ctaLink);
  }
  if (contentWrapper.children.length > 0) {
    cells.push([contentWrapper]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-pharma', cells });
  element.replaceWith(block);
}
