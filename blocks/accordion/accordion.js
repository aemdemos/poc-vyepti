/**
 * loads and decorates the accordion block
 * @param {Element} block The accordion block element
 */
export default function decorate(block) {
  [...block.children].forEach((row, index) => {
    const [titleCell, bodyCell] = [...row.children];
    if (!titleCell || !bodyCell) return;

    const panelId = `accordion-panel-${crypto.randomUUID()}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'accordion-item-label';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', panelId);
    button.append(...titleCell.childNodes);
    titleCell.replaceChildren(button);
    titleCell.className = 'accordion-item-title';

    bodyCell.id = panelId;
    bodyCell.className = 'accordion-item-body';
    bodyCell.hidden = true;

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      bodyCell.hidden = expanded;
    });

    row.className = 'accordion-item';
    row.dataset.index = index;
  });
}
