/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-cta.
 * Base: columns. Source: https://www.vyepti.com/
 * Generated: 2026-03-31
 *
 * Source structure: .columncontainer with two .bgcardparsys side-by-side columns.
 * Each column has eyebrow (h4), heading (h2), description (p), and CTA link.
 *
 * Target: Columns block with 1 row and 2 cells (one per column).
 * Each cell contains: eyebrow + heading + description + CTA.
 */
export default function parse(element, { document }) {
  const columns = element.querySelectorAll('.bgcardparsys');

  const row = [];

  columns.forEach((col) => {
    const cellWrapper = document.createElement('div');

    // Eyebrow - h4 with .dtc-teal-text
    const eyebrow = col.querySelector('.description-after h4');
    if (eyebrow) {
      cellWrapper.append(eyebrow);
    }

    // Heading - h2 with .red-text
    const heading = col.querySelector('.description-after h2');
    if (heading) {
      cellWrapper.append(heading);
    }

    // Description - paragraph
    const description = col.querySelector('.description-after p');
    if (description) {
      cellWrapper.append(description);
    }

    // CTA link
    const ctaLink = col.querySelector('.boxed-link a');
    if (ctaLink) {
      // Remove arrow icon image from CTA
      const arrowImg = ctaLink.querySelector('img');
      if (arrowImg) arrowImg.remove();
      const ctaPara = document.createElement('p');
      ctaPara.append(ctaLink);
      cellWrapper.append(ctaPara);
    }

    if (cellWrapper.children.length > 0) {
      row.push(cellWrapper);
    }
  });

  const cells = [];
  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
