/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-pharma. Base: hero. Source: https://www.vyepti.com/
 * Hero block: Row 1 = background image, Row 2 = heading + subheading + text + CTA
 * Source selectors from captured DOM: .cmp-teaser__image img, .cmp-teaser__description h1/h3/p, .cmp-teaser__action-link
 */
export default function parse(element, { document }) {
  // Extract background image (found: .cmp-teaser__image img)
  const bgImage = element.querySelector('.cmp-teaser__image img, .cmp-teaser__image picture');

  // Extract content (found: .cmp-teaser__description)
  const subheading = element.querySelector('.cmp-teaser__description h3');
  const heading = element.querySelector('.cmp-teaser__description h1');
  const description = element.querySelector('.cmp-teaser__description p');

  // Extract CTA (found: .cmp-teaser__action-link)
  const ctaLink = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

  const cells = [];

  // Row 1: Background image (per block library: 2nd row = image)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: All content in a single cell (per block library: 3rd row = one cell with heading + text + CTA)
  const contentWrapper = document.createElement('div');
  if (heading) contentWrapper.append(heading);
  if (subheading) contentWrapper.append(subheading);
  if (description) contentWrapper.append(description);
  if (ctaLink) {
    // Clean the CTA link - remove inline arrow icon images
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
