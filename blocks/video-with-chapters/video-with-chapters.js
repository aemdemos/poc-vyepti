/**
 * loads and decorates the video-with-chapters block
 * Expected content: row 1 = poster image (+ optional video link);
 * subsequent rows = [chapter title cell, chapter description cell]
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [playerRow, ...chapterRows] = rows;
  if (!playerRow) return;

  const playerCell = playerRow.firstElementChild;
  playerCell.className = 'video-with-chapters-player';

  const link = playerCell.querySelector('a');
  const picture = playerCell.querySelector('picture');
  if (picture) {
    picture.querySelector('img').className = 'video-with-chapters-poster';
  }

  const playButton = document.createElement('button');
  playButton.type = 'button';
  playButton.className = 'video-with-chapters-play';
  playButton.setAttribute('aria-label', 'Play video');
  playButton.textContent = '▶';
  if (link) {
    playButton.addEventListener('click', () => {
      window.open(link.href, '_blank', 'noopener');
    });
    link.remove();
  }
  playerCell.append(playButton);

  const list = document.createElement('div');
  list.className = 'video-with-chapters-list';

  chapterRows.forEach((row) => {
    const [titleCell, descCell] = [...row.children];
    const chapter = document.createElement('div');
    chapter.className = 'video-with-chapters-chapter';
    if (titleCell) chapter.append(...titleCell.childNodes);
    if (descCell) chapter.append(...descCell.childNodes);
    list.append(chapter);
    row.remove();
  });

  playerRow.append(list);
}
