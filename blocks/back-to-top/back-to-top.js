/**
 * Back to top — a small fixed-position icon link back to the top of the
 * page (`.cs-back-to-top` in the source prototype).
 *
 * Authoring rows: 1 row, 1 cell containing the icon-image link.
 *
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const cell = block.firstElementChild?.firstElementChild;
  const link = cell?.querySelector('a[href]');
  if (link) link.className = 'back-to-top-link';
}
