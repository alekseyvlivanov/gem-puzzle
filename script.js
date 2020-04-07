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
    this.moves = 0;
    this.time = 0;
    this.timerStart = 0;
    this.size = SIZES['4x4'];
    this.shuffled = false;
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

    this.movesCount = document.createElement('span');
    this.movesCount.id = 'moves';
    this.movesCount.textContent = '000';
    this.infoTop.appendChild(this.movesCount);

    const timeLabel = document.createElement('span');
    timeLabel.textContent = 'Time: ';
    this.infoTop.appendChild(timeLabel);

    this.timeCount = document.createElement('span');
    this.timeCount.id = 'time';
    this.timeCount.textContent = '00:00';
    this.infoTop.appendChild(this.timeCount);
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
    if (this.timerId) {
      this.moves = 0;
      this.movesCount.textContent = '000';
      clearTimeout(this.timerId);
      this.timeCount.textContent = '00:00';
    }
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
    if (!this.getCell(this.size, this.size).classList.contains('empty')) {
      return false;
    }

    let n = 0;
    let maxN = this.size ** 2 - 1;

    for (let i = 1; i <= this.size; i += 1) {
      for (let j = 1; j <= this.size; j += 1) {
        n += 1;
        if (n <= maxN) {
          if (parseInt(this.getCell(i, j).textContent) !== n) {
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
      this.moves += 1;
      this.movesCount.textContent = this.moves.toString().padStart(3, '0');
      if (this.checkSolved()) {
        this.shuffled = false;
        clearInterval(this.timerId);

        this.time = (Date.now() - this.timerStart) / 1000;
        this.timeCount.textContent =
          parseInt(this.time / 60)
            .toString()
            .padStart(2, '0') +
          ':' +
          parseInt(this.time % 60)
            .toString()
            .padStart(2, '0');

        setTimeout(
          () =>
            alert(
              `Ура! Вы решили головоломку за ${this.timeCount.textContent} и ${this.moves} ходов`,
            ),
          0,
        );
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

    if (this.timerId) {
      this.moves = 0;
      this.movesCount.textContent = '000';
      clearTimeout(this.timerId);
      this.timeCount.textContent = '00:00';
    }

    this.timerStart = Date.now();
    this.startTimer();
  }

  saveBoard() {
    if (confirm('Save current position?')) {
      const cellsObject = {
        moves: this.moves,
        time: this.time,
        timerStart: this.timerStart,
        shuffled: this.shuffled,
        size: this.size,
      };

      for (const cell of this.board.children) {
        cellsObject[cell.style.order] = JSON.stringify(cell, [
          'id',
          'className',
          'textContent',
        ]);
      }

      localStorage.setItem('lastSaved', JSON.stringify(cellsObject));
    }
  }

  restoreBoard() {
    if (confirm('Restore last saved position?')) {
      const lastSaved = JSON.parse(localStorage.getItem('lastSaved'));
      if (lastSaved) {
        if (this.timerId) {
          clearTimeout(this.timerId);
        }

        this.moves = lastSaved.moves;
        this.movesCount.textContent = this.moves.toString().padStart('0', 3);

        this.time = lastSaved.time;
        this.timeCount.textContent =
          parseInt(this.time / 60)
            .toString()
            .padStart(2, '0') +
          ':' +
          parseInt(this.time % 60)
            .toString()
            .padStart(2, '0');

        this.shuffled = lastSaved.shuffled;
        this.size = lastSaved.size;

        this.board.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;

        while (this.board.firstChild) {
          this.board.removeChild(this.board.firstChild);
        }

        for (let i = 1; i <= this.size ** 2; i += 1) {
          const cellObject = JSON.parse(lastSaved[i]);
          const cell = document.createElement('div');

          cell.id = cellObject.id;
          cell.className = cellObject.className;
          cell.textContent = cellObject.textContent;
          cell.style.order = i;

          this.board.appendChild(cell);
        }

        this.timerStart = Date.now() - this.time * 1000;
        this.startTimer();
      } else {
        alert('No saved position!');
      }
    }
  }

  startTimer() {
    this.timerId = setInterval(() => {
      this.time = (Date.now() - this.timerStart) / 1000;
      this.timeCount.textContent =
        parseInt(this.time / 60)
          .toString()
          .padStart(2, '0') +
        ':' +
        parseInt(this.time % 60)
          .toString()
          .padStart(2, '0');
    }, 1000);
  }

  showResults() {
    alert('Not implemented yet..');
  }

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
  puzzle.createButtons();
  puzzle.createInfoTop();
  puzzle.createBoard();
  puzzle.createInfoBottom();
  puzzle.createListeners();
});
