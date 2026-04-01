/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base: cards. Source: https://www.vyepti.com/
 * Cards block: 2 columns per row. Col 1 = image, Col 2 = text content (heading + description + CTA)
 * Source selectors from captured DOM: .boxed-parsys .img-wrapper img, .description-after h2, .description-after p, .boxed-link a
 */
export default function parse(element, { document }) {
  // Find all card items (found: .boxed-parsys inside .col-lg-4 containers)
  const cardItems = element.querySelectorAll('.boxed-parsys');
  const cells = [];

  cardItems.forEach((card) => {
    // Col 1: Image (found: .img-wrapper img)
    const image = card.querySelector('.img-wrapper img, .img-wrapper picture');

    // Col 2: Text content in a wrapper (found: .description-after h2, p; .boxed-link a)
    const heading = card.querySelector('.description-after h2');
    const description = card.querySelector('.description-after p');
    const ctaLink = card.querySelector('.boxed-link a');

    const textWrapper = document.createElement('div');
    if (heading) textWrapper.append(heading);
    if (description) textWrapper.append(description);
    if (ctaLink) {
      // Clean CTA - remove arrow icon spans
      const arrowSpan = ctaLink.querySelector('.arrow-icon');
      if (arrowSpan) arrowSpan.remove();
      textWrapper.append(ctaLink);
    }

    if (image || textWrapper.children.length > 0) {
      cells.push([image || '', textWrapper]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
