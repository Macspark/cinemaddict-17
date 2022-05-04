import {createElement} from '../render.js';

const createMovieListExtraTemplate = (filter = 'all') => {
  const FILTERS = {
    'all': 'There are no movies in our database',
    'watchlist': 'There are no movies to watch now',
    'history': 'There are no watched movies now',
    'favorites': 'There are no favorite movies now'
  };

  return (
    `<section class="films-list">
        <h2 class="films-list__title">${FILTERS[filter]}</h2>
    </section>`
  );
};

export default class MovieListExtraView {
  #element;
  #filter;

  constructor(filter) {
    this.#filter = filter;
  }

  get template() {
    return createMovieListExtraTemplate(this.#filter);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
