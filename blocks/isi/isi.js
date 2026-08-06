/**
 * ISI (Important Safety Information) block.
 *
 * Authored with two rows:
 *   Row 1 – abbreviated content shown in the persistent fixed bottom bar.
 *   Row 2 – full inline content rendered in-page when the section scrolls into view.
 *
 * Behaviour:
 *   • When the ISI **section** is outside the viewport the fixed bar is visible.
 *   • Clicking the "+" expands the bar (adds `.full`); clicking "−" collapses it.
 *   • Once the section scrolls into view the bar hides and the inline content displays.
 *   • While expanded, page scroll is locked so only the bar's own content scrolls.
 *   • The expanded panel opens flush below the header, accounting for its live height.
 */

/** Build the toggle (+/−) button. */
function buildToggle() {
  const toggle = document.createElement('button');
  toggle.className = 'isi-bar-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Expand safety information');
  toggle.type = 'button';
  const icon = document.createElement('span');
  icon.className = 'isi-bar-toggle-icon';
  toggle.append(icon);
  return toggle;
}

/**
 * Build the fixed bottom bar from the abbreviated row and return
 * { bar, toggle }.
 * @param {Element} abbreviatedRow
 */
function buildBar(abbreviatedRow) {
  const bar = document.createElement('div');
  bar.className = 'isi-bar';
  bar.setAttribute('aria-label', 'Important Safety Information');

  /* Pin critical positioning AND the collapsed height inline so the bar is
     both fixed and height-capped the instant it enters the DOM — prevents a
     layout shift when the block CSS has not finished loading, since the bar
     is appended straight to <body>. --isi-bar-height is the same token
     isi.css uses; the literal fallback covers the window before
     isi-tokens.css resolves the custom property. */
  bar.style.position = 'fixed';
  bar.style.left = '0';
  bar.style.right = '0';
  bar.style.bottom = '0';
  bar.style.boxSizing = 'border-box';
  bar.style.overflow = 'hidden';
  bar.style.maxHeight = 'var(--isi-bar-height, 118px)';

  /* Hidden until its internal layout settles (revealed in decorate on the
     next frame). visibility:hidden elements are excluded from layout-shift
     scoring, so the bar's content reflow while isi.css finishes applying is
     not counted as CLS. */
  bar.style.visibility = 'hidden';

  const barContent = document.createElement('div');
  barContent.className = 'isi-bar-content';

  [...abbreviatedRow.children].forEach((cell) => {
    cell.classList.add('isi-bar-col');
    barContent.append(cell);
  });

  const toggle = buildToggle();
  bar.append(barContent, toggle);
  return { bar, toggle };
}

/**
 * Wire up the bar behaviour: expanded-height measurement, expand/collapse
 * toggle, click-to-expand, and the IntersectionObserver that shows/hides it.
 * @param {Element} bar
 * @param {Element} toggle
 * @param {Element} section
 */
function wireBar(bar, toggle, section) {
  /* On mobile/tablet the expanded panel must open flush against the header
     bottom with no gap. The header height differs per breakpoint, so measure
     it and expose it as a custom property the CSS uses to cap the expanded
     height. */
  const updateExpandedHeight = () => {
    const header = document.querySelector('header .nav-wrapper') || document.querySelector('header');
    const offset = header ? Math.round(header.getBoundingClientRect().height) : 0;
    bar.style.setProperty('--isi-expanded-offset', `${offset}px`);
  };
  updateExpandedHeight();
  window.addEventListener('resize', updateExpandedHeight);

  /* Lock/unlock page scroll while the panel is open — only the ISI panel
     scrolls internally. Applied at all widths (harmless on desktop, where
     the panel is short). */
  const setExpanded = (expanded) => {
    bar.classList.toggle('full', expanded);
    /* Drop the inline CLS-guard height cap (set in buildBar) so the
       stylesheet's .isi-bar / .isi-bar.full rules govern height from the
       first interaction — an inline max-height would out-specify the .full
       rule and block expansion. By the time any expand/collapse fires,
       isi.css has long since loaded. */
    bar.style.removeProperty('max-height');
    bar.style.removeProperty('overflow');
    document.body.classList.toggle('isi-scroll-locked', expanded);
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute(
      'aria-label',
      expanded ? 'Collapse safety information' : 'Expand safety information',
    );
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    updateExpandedHeight();
    setExpanded(!bar.classList.contains('full'));
  });

  /* Clicking anywhere on the collapsed bar also expands it */
  bar.addEventListener('click', () => {
    if (!bar.classList.contains('full')) {
      updateExpandedHeight();
      setExpanded(true);
    }
  });

  if (!section) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        bar.classList.add('isi-bar-hidden');
        setExpanded(false);
      } else {
        bar.classList.remove('isi-bar-hidden');
      }
    },
    { threshold: 0 },
  );
  observer.observe(section);
}

/**
 * loads and decorates the block
 * @param {HTMLElement} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const [abbreviatedRow, inlineRow] = rows;

  /* Mark the inline row so CSS can control its visibility */
  inlineRow.classList.add('isi-inline');

  /* Build the fixed bottom bar from the abbreviated row. */
  const { bar, toggle } = buildBar(abbreviatedRow);

  /* Remove the now-empty abbreviated row and append the bar outside page flow. */
  abbreviatedRow.remove();
  document.body.append(bar);

  /* Wire behaviour + visibility observer. */
  wireBar(bar, toggle, block.closest('.section'));

  /* Reveal the bar once its internal layout has settled. Two RAFs ensure a
     full style/layout pass has run so no post-reveal reflow is scored. */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bar.style.removeProperty('visibility');
    });
  });
}
