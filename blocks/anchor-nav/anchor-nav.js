/**
 * Anchor nav — a pill-shaped row of same-page scroll-jump links
 * (`<a href="#section">`), not a JS panel-switcher. Distinct from the
 * `tabs` block, which swaps content panels.
 *
 * Authoring rows: one row per link, single cell holding the `<a href="#…">`.
 *
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    const link = cell?.querySelector('a[href]');
    if (!link) return;

    const label = document.createElement('span');
    label.append(...link.childNodes);

    const arrow = document.createElement('span');
    arrow.className = 'anchor-nav-arrow';
    arrow.setAttribute('aria-hidden', 'true');

    link.replaceChildren(label, arrow);
    link.className = 'anchor-nav-item';

    cell.replaceChildren(link);
    row.className = 'anchor-nav-item-row';
  });
}
