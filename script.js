const SIZES = {
  '3x3': 3,
  '4x4': 4,
  '5x5': 5,
  '6x6': 6,
  '7x7': 7,
  '8x8': 8,
};

class Puzzle {
  constructor() {
    this.size = SIZES[localStorage.getItem('size')] || SIZES['4x4'];
  }

  createBoard() {
    this.board.innerHTML = '';
    let n = 0;

    for (let i = 1; i <= this.size; i += 1) {
      for (let j = 1; j <= this.size; j += 1) {
        const cell = document.createElement('div');
        cell.id = `cell-${i}-${j}`;
        cell.classList.add('cell');

        n += 1;
        if (n < this.size ** 2) {
          cell.classList.add('number');
          cell.classList.add(
            (i % 2 == 0 && j % 2 > 0) || (i % 2 > 0 && j % 2 == 0)
              ? 'dark'
              : 'light',
          );
          cell.textContent = n;
        } else {
          cell.classList.add('empty');
        }

        this.board.appendChild(cell);
      }
    }

    this.board.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
  }

  init() {
    // Create main elements
    this.wrapper = document.createElement('main');
    this.title = document.createElement('h1');
    this.buttons = document.createElement('div');
    this.infoTop = document.createElement('div');
    this.board = document.createElement('div');
    this.infoBottom = document.createElement('div');

    // Setup main elements
    this.wrapper.classList.add('wrapper');

    this.title.classList.add('title');
    this.title.textContent = 'RSS Gem puzzle';

    this.buttons.classList.add('buttons');
    this.infoTop.classList.add('infoTop');
    this.board.classList.add('board');
    this.infoBottom.classList.add('infoBottom');

    // Add to DOM
    this.wrapper.appendChild(this.title);
    this.wrapper.appendChild(this.buttons);
    this.wrapper.appendChild(this.infoTop);
    this.wrapper.appendChild(this.board);
    this.wrapper.appendChild(this.infoBottom);

    document.body.appendChild(this.wrapper);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const puzzle = new Puzzle();
  puzzle.init();
  puzzle.createBoard();
});
