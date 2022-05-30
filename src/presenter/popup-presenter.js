import { render, remove, RenderPosition } from '../framework/render.js';
import PopupView from '../view/popup.js';
import PopupNewCommentView from '../view/popup-new-comment.js';
import PopupCommentView from '../view/popup-comment.js';
import AbstractMoviePresenter from '../framework/presenter/abstract-movie-presenter.js';
import { findIndexByValue, removeIndexFromArray } from '../utils/common.js';
import { UserAction, UpdateType } from '../const.js';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

export default class PopupPresenter extends AbstractMoviePresenter {
  #popupComponent = null;
  #popupNewCommentComponent = null;
  #popupCommentViewMap = new Set();
  #oldState = null;
  #oldScrollTop = 0;
  #currentMovieId = -1;
  #isPopupActive = false;

  constructor(container, changeData) {
    super(container, changeData);
  }

  init = (movie, comments = this._comments) => {
    if (this.#popupComponent) {
      this.#oldScrollTop = this.#popupComponent.element.scrollTop;
    }

    if (this.#popupNewCommentComponent) {
      this.#oldState = this.#popupNewCommentComponent.state;
    }

    if (this.#isPopupActive) {
      this.#closePopup();
    }

    this._movie = movie;
    this._comments = comments;

    this.#renderPopup();
    this.#renderComments();
    this.#renderNewComment();

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#isPopupActive = true;
    this.#currentMovieId = this._movie.id;
  };

  restorePopupState = () => {
    if (this.#oldState) {
      this.#popupNewCommentComponent.restoreState(this.#oldState);
    }
  };

  restorePopupPosition = () => {
    this.#popupComponent.element.scrollTop = this.#oldScrollTop;
  };

  #renderPopup = () => {
    this.#popupComponent = new PopupView(this._movie, this._comments.length);
    this.#popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this.#popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this.#popupComponent.setCloseClickHandler(this.#handleCloseButtonClick);
    render(this.#popupComponent, this._container, RenderPosition.AFTEREND);
  };

  #renderComments = () => {
    this._comments.forEach((comment) => {
      const popupCommentView = new PopupCommentView(comment);
      popupCommentView.setCommentRemoveHandler(this.#handleCommentRemove);
      render(popupCommentView, this.#popupComponent.commentsContainerElement, RenderPosition.BEFOREEND);
      this.#popupCommentViewMap.add(popupCommentView);
    });
  };

  #renderNewComment = () => {
    this.#popupNewCommentComponent = new PopupNewCommentView();
    this.#popupNewCommentComponent.setCommentSubmitHandler(this.#handleCommentSubmit);
    render(this.#popupNewCommentComponent, this.#popupComponent.newCommentContainerElement, RenderPosition.BEFOREEND);
  };

  #closePopup = () => {
    this.#clearPopupComponents();
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#isPopupActive = false;
    this.#currentMovieId = -1;
  };

  #clearPopupComponents = () => {
    this.#clearCommentsViewMap();
    remove(this.#popupComponent);
    remove(this.#popupNewCommentComponent);
  };

  #clearCommentsViewMap = () => {
    if (!this.#popupCommentViewMap.size) {
      return;
    }

    this.#popupCommentViewMap.forEach((comment) => remove(comment));
    this.#popupCommentViewMap.clear();
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
  };

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
  };

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
  };
}
