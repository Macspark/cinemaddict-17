import {render, remove, RenderPosition} from '../framework/render.js';
import MoviePopupView from '../view/movie-popup.js';

export default class PopupPresenter {
  #popupActive = false;
  #container;
  #popupComponent = null;
  #movie;
  #comments;
  #changeData;

  constructor(container, changeData) {
    this.#container = container;
    this.#changeData = changeData;
  }

  init = (movie, comments = this.#comments) => {
    if (this.#popupActive) {
      this.#closePopup();
    }

    this.#movie = movie;
    this.#comments = comments;

    this.#popupComponent = new MoviePopupView(movie, comments);
    this.#popupComponent.setCloseClickHandler(this.#handleCloseButtonClick);
    this.#popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    render(this.#popupComponent, this.#container, RenderPosition.AFTEREND);
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
    this.#changeData({...this.#movie, isWatchlist: !this.#movie.isWatchlist});
  };

  #handleWatchedClick = () => {
    this.#changeData({...this.#movie, isWatched: !this.#movie.isWatched});
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#movie, isFavorite: !this.#movie.isFavorite});
  };

  #closePopup = () => {
    remove(this.#popupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#popupActive = false;
  };

  get popupActive() {
    return this.#popupActive;
  }
}
