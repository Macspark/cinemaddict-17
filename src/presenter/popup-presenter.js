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
  #oldState = null;
  #oldScrollTop = 0;
  #currentMovieId = -1;
  #isPopupActive = false;
  #commentModel;

  constructor(container, commentModel, changeData) {
    super(container, changeData);
    this.#commentModel = commentModel;
  }

  init = (movie) => {
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

    this.#renderPopup(movie);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#isPopupActive = true;
    this.#currentMovieId = this._movie.id;

    this.#commentModel
      .getMovieComments(movie.id)
      .then((comments) => {
        console.log(comments);
        this.#renderComments(comments);
        this.#renderNewComment();
      });
  };

  restorePopupState = () => {
    if (this.#oldState) {
      this.#popupNewCommentComponent.restoreState(this.#oldState);
    }
  };

  restorePopupPosition = () => {
    this.#popupComponent.element.scrollTop = this.#oldScrollTop;
  };

  #renderPopup = (movie) => {
    this.#popupComponent = new PopupView(movie);
    this.#popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this.#popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this.#popupComponent.setCloseClickHandler(this.#handleCloseButtonClick);
    render(this.#popupComponent, this._container, RenderPosition.AFTEREND);
  };

  #renderComments = (comments) => {
    comments.forEach((comment) => {
      this.#renderComment(comment);
    });
  };

  #renderComment = (comment) => {
    if (comment) {
      const popupCommentView = new PopupCommentView(comment);
      popupCommentView.setCommentRemoveHandler(this.#handleCommentRemove);
      render(popupCommentView, this.#popupComponent.commentsContainerElement, RenderPosition.BEFOREEND);
    }
  };

  #renderNewComment = () => {
    this.#popupNewCommentComponent = new PopupNewCommentView();
    this.#popupNewCommentComponent.setCommentSubmitHandler(this.#handleCommentSubmit);
    render(this.#popupNewCommentComponent, this.#popupComponent.newCommentContainerElement, RenderPosition.BEFOREEND);
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

  #adaptCommentState = (data) => {
    const comment = data;

    comment.id = nanoid();
    comment.date = dayjs().format();

    return comment;
  };

  #handleCommentSubmit = (data) => {
    const comment = this.#adaptCommentState(data);

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
