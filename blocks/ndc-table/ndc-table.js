/**
 * NDC table — renders the VYEPTI national-drug-code display as a real
 * semantic <table> (infusion-information's "Ordering VYEPTI" section).
 * Distinct block/class name from coverage-reimbursement's drug-code table
 * to avoid any CSS collision between the two concurrently-authored pages.
 *
 * Authoring:
 *   Row 1: single cell — the product title (e.g. "100 mg/mL Solution in
 *          Single-Dose Vial").
 *   Row 2+: two cells each — [format label, code]. Each pair becomes one
 *          column of the rendered table.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [titleRow, ...codeRows] = rows;
  if (!titleRow) return;

  const table = document.createElement('table');
  table.className = 'ndc-table';

  const caption = document.createElement('caption');
  caption.append(...titleRow.firstElementChild.childNodes);
  table.append(caption);

  const tbody = document.createElement('tbody');
  const tr = document.createElement('tr');

  codeRows.forEach((row) => {
    const [labelCell, codeCell] = [...row.children];
    const td = document.createElement('td');
    if (labelCell) {
      const p = document.createElement('p');
      p.className = 'ndc-table-format';
      p.append(...labelCell.childNodes);
      td.append(p);
    }
    if (codeCell) {
      const p = document.createElement('p');
      p.className = 'ndc-table-code';
      p.append(...codeCell.childNodes);
      td.append(p);
    }
    tr.append(td);
  });

  tbody.append(tr);
  table.append(tbody);
  block.replaceChildren(table);
}
