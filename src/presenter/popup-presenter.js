import {render, remove, RenderPosition} from '../framework/render.js';
import MoviePopupView from '../view/movie-popup.js';
import AbstractCardPresenter from './abstract-card-presenter.js';

export default class PopupPresenter extends AbstractCardPresenter {
  #popupComponent = null;
  #popupActive = false;

  constructor(container, changeData) {
    super(container, changeData);
  }

  init = (movie, comments = this._comments) => {
    if (this.#popupActive) {
      this.#closePopup();
    }

    this._movie = movie;
    this._comments = comments;

    this.#popupComponent = new MoviePopupView(movie, comments);
    this.#popupComponent.setCloseClickHandler(this.#handleCloseButtonClick);
    this.#popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this.#popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    render(this.#popupComponent, this._container, RenderPosition.AFTEREND);
    this.#popupActive = true;
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

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #handleCloseButtonClick = () => {
    this.#closePopup();
  };
}
