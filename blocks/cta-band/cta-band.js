/**
 * CTA band — a single teal rounded band with an image, a line of copy, and
 * a CTA button (the "download the brochure" banner, `.cs-cta-card` in the
 * source prototype). Not a fit for the existing `columns-cta` block, whose
 * default treatment is a per-column white shadow-card with a ghost-outline
 * CTA — this is one solid-color band with a filled accent CTA.
 *
 * Authoring rows: 1 row, 2 cells — [image], [copy + CTA link].
 *
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const [imgCell, textCell] = [...row.children];

  if (imgCell) {
    const pic = imgCell.querySelector('picture, img');
    imgCell.className = 'cta-band-img';
    if (pic) imgCell.replaceChildren(pic);
  }

  if (textCell) {
    textCell.className = 'cta-band-content';
  }
}
