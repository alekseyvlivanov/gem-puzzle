class Puzzle {
  constructor() {}

  init() {
    // Create main elements
    this.wrapper = document.createElement('main');
    this.title = document.createElement('h1');

    // Setup main elements
    this.wrapper.classList.add('wrapper');

    this.title.classList.add('title');
    this.title.textContent = 'RSS Gem puzzle';

    // Add to DOM
    this.wrapper.appendChild(this.title);

    document.body.appendChild(this.wrapper);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const puzzle = new Puzzle();
  puzzle.init();
});
