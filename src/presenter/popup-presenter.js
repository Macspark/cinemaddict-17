import {render, remove, RenderPosition} from '../framework/render.js';
import MoviePopupView from '../view/movie-popup.js';
import AbstractMoviePresenter from './abstract-movie-presenter.js';

export default class PopupPresenter extends AbstractMoviePresenter {
  #popupComponent = null;
  #oldPopupComponent = null;
  #isPopupActive = false;

  constructor(container, changeData) {
    super(container, changeData);
  }

  init = (movie, comments = this._comments) => {
    if (this.#popupComponent) {
      this.#oldPopupComponent = this.#popupComponent;
      this.#oldPopupComponent.scrollTop = this.#popupComponent.element.scrollTop;
    }

    if (this.#isPopupActive) {
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
    this.#isPopupActive = true;
  };

  restorePopup = () => {
    this.#popupComponent.scrollTop = this.#oldPopupComponent.scrollTop;
    this.#popupComponent.restoreState(this.#oldPopupComponent.state);
    this.#popupComponent.restorePosition();
  };

  #closePopup = () => {
    remove(this.#popupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#isPopupActive = false;
  };

  get isPopupActive() {
    return this.#isPopupActive;
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
