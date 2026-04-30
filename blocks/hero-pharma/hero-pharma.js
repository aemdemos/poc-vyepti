function applyAccentColor(block) {
  block.querySelectorAll('h1 strong, h2 strong, h3 strong').forEach((strong) => {
    const span = document.createElement('span');
    span.className = 'accent-color';
    span.textContent = strong.textContent;
    strong.replaceWith(span);
  });
}

function decorateSinglePanel(block) {
  applyAccentColor(block);

  const contentDiv = block.querySelector(':scope > div:last-child');
  const lastP = contentDiv?.querySelector(':scope > div > p:last-child');
  if (lastP && lastP.textContent.trim().toLowerCase() === 'actor portrayal') {
    lastP.classList.add('actor-portrayal');
    block.appendChild(lastP);
  }
}

function decorateDualPanel(block, rows) {
  block.classList.add('hero-pharma-dual');
  const panels = [];

  rows.forEach((row, index) => {
    const cells = [...row.children];
    const panel = document.createElement('div');
    panel.className = `hero-pharma-panel hero-pharma-panel-${index === 0 ? 'dark' : 'light'}`;

    // First cell: image (background)
    const imgCell = cells[0];
    if (imgCell) {
      const bgDiv = document.createElement('div');
      bgDiv.className = 'hero-pharma-panel-bg';
      bgDiv.append(...imgCell.childNodes);
      panel.appendChild(bgDiv);
    }

    // Second cell: text content overlay
    const textCell = cells[1];
    if (textCell) {
      const contentDiv = document.createElement('div');
      contentDiv.className = 'hero-pharma-panel-content';
      contentDiv.append(...textCell.childNodes);

      // Move "Actor portrayal" to panel level for absolute positioning
      const allP = contentDiv.querySelectorAll('p');
      allP.forEach((p) => {
        if (p.textContent.trim().toLowerCase() === 'actor portrayal') {
          p.classList.add('actor-portrayal');
          panel.appendChild(p);
        }
      });

      panel.appendChild(contentDiv);
    }

    panels.push(panel);
  });

  block.textContent = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-pharma-panels';
  panels.forEach((p) => wrapper.appendChild(p));
  block.appendChild(wrapper);

  applyAccentColor(block);
}

export default function decorate(block) {
  const rows = [...block.children];

  // Detect mode: if any row has 2 cells (image + text), it's dual-panel
  const isDual = rows.some((row) => row.children.length >= 2);

  if (!isDual) {
    decorateSinglePanel(block);
    return;
  }

  // Dual-panel: each row has [image cell, text cell]
  decorateDualPanel(block, rows);
}
