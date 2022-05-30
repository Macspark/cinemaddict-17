import { render, remove, RenderPosition } from '../framework/render.js';
import PopupView from '../view/popup.js';
import AbstractMoviePresenter from '../framework/presenter/abstract-movie-presenter.js';
import { findIndexByValue, removeIndexFromArray } from '../utils/common.js';
import { UserAction, UpdateType } from '../const.js';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

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

    this.#popupComponent = new PopupView(movie, comments);
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

  restorePopupState = () => {
    this.#popupComponent.restoreState(this.#oldPopupComponent.state);
  };

  restorePopupPosition = () => {
    this.#popupComponent.restorePosition(this.#oldPopupComponent.scrollTop);
  }

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

  #convertStateToComment = (data) => {
    const comment = data;

    comment.id = nanoid();
    comment.date = dayjs().format();
    
    return comment;
  }

  #handleCommentSubmit = (data) => {
    if (!data.text || !data.emoji) {
      return;
    }
    
    const comment = this.#convertStateToComment(data);

    const updatedMovie = {
      ...this._movie,
      comments: [...this._movie.comments, comment.id]
    };

    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {comment, updatedMovie}
    );
  }

  #handleCommentRemove = (commentId) => {
    const movieCommentIndex = findIndexByValue(this._movie.comments, commentId);
    const updatedComments = removeIndexFromArray(this._movie.comments, movieCommentIndex);

    const updatedMovie = {
      ...this._movie,
      comments: updatedComments
    };

    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {commentId, updatedMovie}
    );
  }
}
