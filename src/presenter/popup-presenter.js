import { render, remove, RenderPosition } from '../framework/render.js';
import PopupView from '../view/popup.js';
import PopupControlsView from '../view/popup-controls.js';
import PopupNewCommentView from '../view/popup-new-comment.js';
import PopupCommentView from '../view/popup-comment.js';
import AbstractMoviePresenter from '../framework/presenter/abstract-movie-presenter.js';
import { findIndexByValue, removeIndexFromArray } from '../utils/common.js';
import { UserAction, UpdateType } from '../const.js';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

export default class PopupPresenter extends AbstractMoviePresenter {
  #popupComponent = null;
  #controlsComponent = null;
  #popupNewCommentComponent = null;
  #oldState = {};
  #currentMovieId = -1;
  #isPopupActive = false;
  #commentModel;
  #renderedComments;

  constructor(container, commentModel, changeData) {
    super(container, changeData);
    this.#commentModel = commentModel;
  }

  init = (movie) => {
    if (this.#popupNewCommentComponent) {
      this.#oldState = this.#popupNewCommentComponent.state;
    }

    if (this.#isPopupActive) {
      this.#closePopup();
    }

    this._movie = movie;

    this.#renderPopup(movie);
    this.#renderControls(movie);
    this.#commentModel
      .getMovieComments(movie.id)
      .then((comments) => {
        this.#renderComments(comments);
        this.#renderNewComment();
      });

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#isPopupActive = true;
    this.#currentMovieId = this._movie.id;
  };

  #renderPopup = (movie) => {
    this.#popupComponent = new PopupView(movie);
    this.#popupComponent.setCloseClickHandler(this.#handleCloseButtonClick);
    render(this.#popupComponent, this._container, RenderPosition.AFTEREND);
  };

  #renderControls = (movie) => {
    this.#controlsComponent = new PopupControlsView(movie);
    this.#controlsComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this.#controlsComponent.setWatchedClickHandler(this._handleWatchedClick);
    this.#controlsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    render(this.#controlsComponent, this.#popupComponent.bottomContainerElement, RenderPosition.BEFOREBEGIN);
  }

  #renderComments = (comments) => {
    this.#renderedComments = new Set();
    comments.forEach((comment) => {
      this.#renderComment(comment);
    });
  };

  #renderComment = (comment) => {
    if (comment) {
      const popupCommentView = new PopupCommentView(comment);
      popupCommentView.setCommentRemoveHandler(this.#handleCommentRemove);
      render(popupCommentView, this.#popupComponent.commentsContainerElement, RenderPosition.BEFOREEND);
      this.#renderedComments.add(popupCommentView);
    }
  };

  #clearComments = () => {
    this.#renderedComments.forEach((comment) => remove(comment));
    this.#renderedComments.clear();
  }

  #renderNewComment = () => {
    this.#popupNewCommentComponent = new PopupNewCommentView(this.#oldState);
    this.#popupNewCommentComponent.setCommentSubmitHandler(this.#handleCommentSubmit); 
    render(this.#popupNewCommentComponent, this.#popupComponent.newCommentContainerElement, RenderPosition.BEFOREEND);
  };

  #closePopup = () => {
    remove(this.#popupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#isPopupActive = false;
    this.#currentMovieId = -1;
    this.#oldState = {};
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
    const movieId = this._movie.id;

    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {movieId, data}
    );
  };

  #handleCommentRemove = (commentId) => {
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      {commentId}
    );
  };

  //Эта хуйня ожидает, что тут будут комменты. И они есть при POST. Но при DELETE с сервера не приходит массив с комментами ...

  handleMovieModelEvent = (updateType, data) => {
    if (data && this.currentMovieId === data.id) {
      this.#updateControls(data);
    }
  };

  handleCommentModelEvent = (updateType, data) => {
    this.#updateComments(data);
    
    if (updateType === UpdateType.MINOR) {
      this.#oldState = {};
      remove(this.#popupNewCommentComponent);
      this.#renderNewComment();
    }
  };

  #updateControls = (movie) => {
    remove(this.#controlsComponent);
    this.#renderControls(movie);
  }

  #updateComments = (comments) => {
    this.#clearComments();
    this.#renderComments(comments);
  }
}
