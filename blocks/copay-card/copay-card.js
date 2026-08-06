/**
 * Copay card — the bespoke teal "your patients may pay as little as $0"
 * card (`.cs-copay-card__inner` in the source prototype). Heading, an
 * image + bullet-list grid, and a callout box. ISI is never embedded here
 * (or in any other block) — it lives solely in the sitewide `isi` block,
 * authored once at /fragments/isi and referenced from a single section at
 * the bottom of each page.
 *
 * Authoring rows (positional):
 *   1. heading cell — the "$0 for VYEPTI" headline
 *   2. image + bullet grid — 2 cells: [picture], [fine print / list / links]
 *   3. callout — 1 cell, the "ready to get started" box
 *
 * @param {HTMLElement} block
 */

export default function decorate(block) {
  const [headingRow, gridRow, calloutRow] = [...block.children];

  const inner = document.createElement('div');
  inner.className = 'copay-card-inner';

  if (headingRow) {
    const cell = headingRow.firstElementChild;
    const src = cell?.querySelector('h1, h2, h3, h4, h5, h6') || cell;
    const heading = document.createElement('h3');
    heading.className = 'copay-card-heading';
    if (src?.id) heading.id = src.id;
    if (src) heading.append(...src.childNodes);
    inner.append(heading);
  }

  if (gridRow) {
    const [imgCell, textCell] = [...gridRow.children];
    const grid = document.createElement('div');
    grid.className = 'copay-card-grid';

    if (imgCell) {
      const pic = imgCell.querySelector('picture, img');
      const imgWrap = document.createElement('div');
      imgWrap.className = 'copay-card-img';
      if (pic) imgWrap.append(pic);
      grid.append(imgWrap);
    }

    if (textCell) {
      textCell.className = 'copay-card-text';
      grid.append(textCell);
    }

    inner.append(grid);
  }

  if (calloutRow) {
    const cell = calloutRow.firstElementChild;
    const callout = document.createElement('div');
    callout.className = 'copay-card-callout';
    if (cell) callout.append(...cell.childNodes);
    inner.append(callout);
  }

  block.replaceChildren(inner);
}
