import AbstractView from '../framework/view/abstract-view.js';

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

export default class MovieListExtraView extends AbstractView {
  #filter;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createMovieListExtraTemplate(this.#filter);
  }
}
