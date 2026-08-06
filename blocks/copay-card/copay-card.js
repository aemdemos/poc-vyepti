/**
 * Copay card — the bespoke teal "your patients may pay as little as $0"
 * card (`.cs-copay-card__inner` in the source prototype). A genuinely
 * unique composited widget: heading, an embedded contextual mini-ISI with
 * its own expand/collapse (distinct from the sitewide `isi` block's fixed
 * bottom-bar pattern — this one is inline, collapsed-by-default, and lives
 * INSIDE this card), an image + bullet-list grid, and a callout box.
 *
 * Authoring rows (positional):
 *   1. heading cell — the "$0 for VYEPTI" headline
 *   2. mini-ISI — 3 cells: [title], [always-visible teaser], [expandable "more"]
 *   3. image + bullet grid — 2 cells: [picture], [fine print / list / links]
 *   4. callout — 1 cell, the "ready to get started" box
 *
 * @param {HTMLElement} block
 */

function textOf(cell) {
  return cell ? cell.textContent.trim() : '';
}

export default function decorate(block) {
  const [headingRow, isiRow, gridRow, calloutRow] = [...block.children];

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

  if (isiRow) {
    const [titleCell, teaserCell, moreCell] = [...isiRow.children];

    const isi = document.createElement('div');
    isi.className = 'copay-card-isi copay-card-isi-collapsed';
    isi.id = 'copayIsi';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'copay-card-isi-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span class="sr-only">Expand important safety information</span>';

    const title = document.createElement('h4');
    title.className = 'copay-card-isi-title';
    title.textContent = textOf(titleCell);

    const teaser = document.createElement('div');
    teaser.className = 'copay-card-isi-teaser';
    if (teaserCell) teaser.append(...teaserCell.childNodes);

    const more = document.createElement('div');
    more.className = 'copay-card-isi-more';
    more.id = 'copayIsiBody';
    more.hidden = true;
    if (moreCell) more.append(...moreCell.childNodes);

    toggle.setAttribute('aria-controls', more.id);
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      more.hidden = expanded;
      isi.classList.toggle('copay-card-isi-collapsed', expanded);
    });

    isi.append(toggle, title, teaser, more);
    inner.append(isi);
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
