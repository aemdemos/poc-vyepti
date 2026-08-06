/**
 * Icon info grid — a repeating row of [icon, text] items. Reused across
 * copay-support for three visually-different but structurally-identical
 * patterns (D9: one block, variant classes):
 *   - `.claims`   — 4 items, icon + bold label + description (2 text cells)
 *   - `.connect`  — 4 items, circular icon + single description paragraph
 *   - `.resources`— 3 items, icon + a single link (whole item is a download)
 *
 * Authoring rows: one row per item. First cell = icon (picture/img).
 * Remaining cells (or the remaining content of a single second cell) are
 * appended as-is.
 *
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    row.className = 'icon-info-grid-item';

    if (cells.length < 2) {
      // single cell holds the whole item (e.g. an icon+link resource row)
      cells.forEach((cell) => cell.classList.add('icon-info-grid-content'));
      return;
    }

    const [iconCell, ...rest] = cells;
    const pic = iconCell?.querySelector('picture, img');
    iconCell.className = 'icon-info-grid-icon';
    if (pic) iconCell.replaceChildren(pic);

    rest.forEach((cell) => cell.classList.add('icon-info-grid-content'));
  });
}
