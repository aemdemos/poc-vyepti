/**
 * Partner referral grid — bordered grid of infusion-partner referral forms:
 * each item is a partner logo plus a "Download" link (with an inline
 * download-icon image). Used by infusion-information's "Referral forms for
 * our provider partners" section.
 *
 * Authoring: one row per partner — cell 1 = logo picture, cell 2 = a
 * paragraph holding the download link (link text + inline icon <img>).
 *   <div><div><picture>…</picture></div><div><p><a href="…">Download<img …></a></p></div></div>
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'partner-referral-grid-item';
    const [logoCell, linkCell] = [...row.children];
    if (logoCell) logoCell.className = 'partner-referral-grid-logo';
    if (linkCell) linkCell.className = 'partner-referral-grid-link';
  });
}
