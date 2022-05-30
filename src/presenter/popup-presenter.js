import { render, remove, RenderPosition } from '../framework/render.js';
import MoviePopupView from '../view/movie-popup.js';
import AbstractMoviePresenter from '../framework/presenter/abstract-movie-presenter.js';
import { UserAction, UpdateType } from '../const.js';

export default class PopupPresenter extends AbstractMoviePresenter {
  #popupComponent = null;
  #oldPopupComponent = null;
  #isPopupActive = false;
  #currentMovieId = -1;

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
    this.#popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this.#popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this.#popupComponent.setCloseClickHandler(this.#handleCloseButtonClick);
    this.#popupComponent.setCommentSubmitHandler(this.#handleCommentSubmit);
    this.#popupComponent.setCommentRemoveHandler(this.#handleCommentRemove);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    render(this.#popupComponent, this._container, RenderPosition.AFTEREND);
    this.#isPopupActive = true;
    this.#currentMovieId = this._movie.id;
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
    this.#currentMovieId = -1;
  };

  get isPopupActive() {
    return this.#isPopupActive;
  }

  get currentMovieId() {
    return this.#currentMovieId;
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

  #handleCommentSubmit = (data) => {
    if (!data.id || !data.text || !data.emoji) {
      throw new Error('Comment is missing required fields')
    }

    const updatedMovie = {
      ...this._movie,
      comments: [data.id, ...this._movie.comments]
    };

    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.NONE,
      data
    );

    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      updatedMovie
    );
  }

  #handleCommentRemove = (data) => {
    if (!data.id || !data.text || !data.emoji) {
      throw new Error('Comment is missing required fields')
    }

    const updatedMovie = {
      ...this._movie,
      comments: [data.id, ...this._movie.comments]
    };

    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.NONE,
      data
    );

    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      updatedMovie
    );
  }
}
