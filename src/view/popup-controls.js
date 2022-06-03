import AbstractView from '../framework/view/abstract-view.js';

const createPopupControlsTemplate = (movie) => {
  const {
    isWatchlist,
    isWatched,
    isFavorite,
  } = movie;

  return (
    `<section class="film-details__controls">
      <button type="button" class="film-details__control-button film-details__control-button--watchlist ${isWatchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button film-details__control-button--watched ${isWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button film-details__control-button--favorite ${isFavorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
     </section>`
  );
};

export default class PopupControlsView extends AbstractView {
  #movie;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createPopupControlsTemplate(this.#movie);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
