/**
 * Page subnav — pill-shaped row of in-page jump links shown under a page-title
 * hero (infusion-information's "Referring out / Ordering VYEPTI / Starting
 * VYEPTI / Resources" quick links).
 *
 * Authoring: one row per link, a single paragraph link cell per row.
 *   <div><p><a href="#referring-out">Referring out</a></p></div>
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'page-subnav-item';
    const link = row.querySelector('a');
    if (!link) return;
    const icon = document.createElement('span');
    icon.className = 'page-subnav-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '→';
    link.append(icon);
  });
}
