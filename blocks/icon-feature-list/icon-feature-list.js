/**
 * Icon feature list — a repeating row of [icon, text] items.
 * Used (with variant classes) for infusion-information's VYEPTI Infusion
 * Network callout (`.callout` variant, 3 items) and its "Additional infusion
 * site options" list (default variant, 3 items, one item's text cell may
 * carry a nested <ul>).
 *
 * Authoring: one row per item — cell 1 = icon picture, cell 2 = text.
 *   <div><div><picture>…</picture></div><div><p>…</p></div></div>
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'icon-feature-list-item';
    const [iconCell, textCell] = [...row.children];
    if (iconCell) iconCell.className = 'icon-feature-list-icon';
    if (textCell) textCell.className = 'icon-feature-list-text';
  });
}
