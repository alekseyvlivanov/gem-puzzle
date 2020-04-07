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
    this.shuffled = false;
    this.size = SIZES['4x4'];
  }

  createButtons() {
    this.buttons.innerHTML = '';

    const btnShuffle = document.createElement('button');
    btnShuffle.textContent = 'Shuffle';
    btnShuffle.id = 'btn-shuffle';
    btnShuffle.setAttribute('title', 'Shuffle from current position');
    btnShuffle.classList.add('btn', 'btn-big');
    this.buttons.appendChild(btnShuffle);

    const btnSave = document.createElement('button');
    btnSave.textContent = 'Save';
    btnSave.id = 'btn-save';
    btnSave.setAttribute('title', 'Save current position');
    btnSave.classList.add('btn', 'btn-big');
    this.buttons.appendChild(btnSave);

    const btnRestore = document.createElement('button');
    btnRestore.textContent = 'Restore';
    btnRestore.id = 'btn-restore';
    btnRestore.setAttribute('title', 'Restore from last saved position');
    btnRestore.classList.add('btn', 'btn-big');
    this.buttons.appendChild(btnRestore);

    const btnResults = document.createElement('button');
    btnResults.textContent = 'Results';
    btnResults.id = 'btn-results';
    btnResults.setAttribute('title', 'Best of the Best');
    btnResults.classList.add('btn', 'btn-big');
    this.buttons.appendChild(btnResults);
  }

  createInfoTop() {
    this.infoTop.innerHTML = '';

    const movesLabel = document.createElement('span');
    movesLabel.textContent = 'Moves: ';
    this.infoTop.appendChild(movesLabel);

    const movesCount = document.createElement('span');
    movesCount.id = 'moves';
    movesCount.textContent = '00';
    this.infoTop.appendChild(movesCount);

    const timeLabel = document.createElement('span');
    timeLabel.textContent = 'Time: ';
    this.infoTop.appendChild(timeLabel);

    const timeCount = document.createElement('span');
    timeCount.id = 'time';
    timeCount.textContent = '00:00';
    this.infoTop.appendChild(timeCount);
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
        cell.style.order = n;

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

  createInfoBottom() {
    this.infoBottom.innerHTML = '';

    for (const sizeKey of Object.keys(SIZES)) {
      const btn = document.createElement('button');
      btn.id = sizeKey;
      btn.classList.add('btn', 'btn-small');
      btn.setAttribute('title', `Create new ${sizeKey} game`);
      btn.textContent = sizeKey;
      this.infoBottom.appendChild(btn);
    }
  }

  createListeners() {
    document
      .getElementById('btn-shuffle')
      .addEventListener('click', () => this.shuffleBoard());

    document
      .getElementById('btn-save')
      .addEventListener('click', () => this.saveBoard());

    document
      .getElementById('btn-restore')
      .addEventListener('click', () => this.restoreBoard());

    document
      .getElementById('btn-results')
      .addEventListener('click', () => this.showResults());

    this.board.addEventListener('click', (e) => {
      this.shiftCell(e.target);
    });

    this.infoBottom.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        this.size = SIZES[e.target.id];
        this.createBoard();
      }
    });
  }

  checkSolved() {
    let n = 0;
    let maxN = this.size ** 2 - 1;

    for (let i = 1; i <= this.size; i += 1) {
      for (let j = 1; j <= this.size; j += 1) {
        n += 1;
        if (n <= maxN) {
          if (parseInt(this.getCell(i, j).textContent) !== n) {
            return false;
          }
        } else {
          if (!this.getCell(i, j).classList.contains('empty')) {
            return false;
          }
        }
      }
    }

    return true;
  }

  shiftCell(cell) {
    if (!cell.classList.contains('empty')) {
      const emptyAdjacentCell = this.getEmptyAdjacentCell(cell);

      if (emptyAdjacentCell) {
        const tmp = {
          id: cell.id,
          order: cell.style.order,
        };

        cell.id = emptyAdjacentCell.id;
        cell.style.order = emptyAdjacentCell.style.order;

        emptyAdjacentCell.id = tmp.id;
        emptyAdjacentCell.style.order = tmp.order;
      }
    }

    if (this.shuffled) {
      if (this.checkSolved()) {
        this.shuffled = false;
        setTimeout(() => alert('Ура! Вы решили головоломку'), 500);
      }
    }
  }

  getEmptyAdjacentCell(cell) {
    const adjacentCells = this.getAdjacentCells(cell);

    for (const e of adjacentCells) {
      if (e.classList.contains('empty')) {
        return e;
      }
    }

    return false;
  }

  getAdjacentCells(cell) {
    const adjacentCells = [];

    const cellLocation = cell.id.split('-');
    const cellRow = parseInt(cellLocation[1]);
    const cellCol = parseInt(cellLocation[2]);

    if (cellRow < this.size) {
      adjacentCells.push(this.getCell(cellRow + 1, cellCol));
    }

    if (cellRow > 1) {
      adjacentCells.push(this.getCell(cellRow - 1, cellCol));
    }

    if (cellCol < this.size) {
      adjacentCells.push(this.getCell(cellRow, cellCol + 1));
    }

    if (cellCol > 1) {
      adjacentCells.push(this.getCell(cellRow, cellCol - 1));
    }

    return adjacentCells;
  }

  getCell(row, col) {
    return document.getElementById(`cell-${row}-${col}`);
  }

  getEmptyCell() {
    return this.board.querySelector('.empty');
  }

  rand(from, to) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
  }

  shuffleBoard() {
    let previousCell;

    for (let i = 0; i < 100; i += 1) {
      const emptyCell = this.getEmptyCell();
      const adjacentCells = this.getAdjacentCells(emptyCell);

      if (previousCell) {
        for (let j = adjacentCells.length - 1; j >= 0; j -= 1) {
          if (adjacentCells[j].innerHTML === previousCell.innerHTML) {
            adjacentCells.splice(j, 1);
          }
        }
      }

      previousCell = adjacentCells[this.rand(0, adjacentCells.length - 1)];
      this.shiftCell(previousCell);
    }

    this.shuffled = true;
  }

  saveBoard() {
    if (confirm('Save current position?')) {
      localStorage.setItem(
        'lastSaved',
        JSON.stringify({
          size: this.size,
          board: JSON.stringify(Array.from(this.board.children)),
        }),
      );
    }
  }

  restoreBoard() {
    if (confirm('Restore last saved position?')) {
      const lastSaved = JSON.parse(localStorage.getItem('lastSaved'));
      if (lastSaved) {
        if (lastSaved.size && lastSaved.board) {
          this.size = lastSaved.size;
          // this.board.innerHTML = lastSaved.board;
        } else {
          localStorage.removeItem('lastSaved');
          alert('Bad saved data! Cleared');
        }
      } else {
        alert('No saved position!');
      }
    }
  }

  showResults() {}

  init() {
    document.body.innerHTML = '';

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
    this.title.textContent = 'RSS Gem puzzle (not finished yet)';

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
  puzzle.createButtons();
  puzzle.createInfoTop();
  puzzle.createBoard();
  puzzle.createInfoBottom();
  puzzle.createListeners();
});
