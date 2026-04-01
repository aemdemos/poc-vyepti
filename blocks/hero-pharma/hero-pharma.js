export default function decorate(block) {
  // Convert bold text in headings to accent color (authoring convention:
  // authors use bold to mark words that should appear in the rose accent color)
  block.querySelectorAll('h1 strong, h2 strong, h3 strong').forEach((strong) => {
    const span = document.createElement('span');
    span.className = 'accent-color';
    span.textContent = strong.textContent;
    strong.replaceWith(span);
  });

  // Move "Actor portrayal" text out of the constrained content wrapper
  // so it can be absolutely positioned relative to the full-bleed hero
  const contentDiv = block.querySelector(':scope > div:last-child');
  const lastP = contentDiv?.querySelector(':scope > div > p:last-child');
  if (lastP && lastP.textContent.trim().toLowerCase() === 'actor portrayal') {
    lastP.classList.add('actor-portrayal');
    block.appendChild(lastP);
  }
}
