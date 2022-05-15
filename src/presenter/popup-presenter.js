import {render, remove, RenderPosition} from '../framework/render.js';
import MoviePopupView from '../view/movie-popup.js';

export default class PopupPresenter {
  #container;
  #moviePopupView = null;
  #popupActive = false;

  constructor(container) {
    this.#container = container;
  }

  init = (movie, comments) => {
    if (this.#popupActive) {
      this.#closePopup();
    }

    this.#moviePopupView = new MoviePopupView(movie, comments);
    this.#moviePopupView.setCloseClickHandler(this.#handleCloseButtonClick);
    this.#moviePopupView.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#moviePopupView.setWatchedClickHandler(this.#handleWatchedClick);
    this.#moviePopupView.setFavoriteClickHandler(this.#handleFavoriteClick);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    render(this.#moviePopupView, this.#container, RenderPosition.AFTEREND);
    this.#popupActive = true;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #handleCloseButtonClick = () => {
    this.#closePopup();
  };

  #handleWatchlistClick = () => {
    console.log('watchlist');
  };

  #handleWatchedClick = () => {
    console.log('watched');
  };

  #handleFavoriteClick = () => {
    console.log('fav');
  };

  #closePopup = () => {
    remove(this.#moviePopupView);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#popupActive = false;
  };
}
