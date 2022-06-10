import { render, remove, RenderPosition } from '../framework/render.js';
import PopupView from '../view/popup.js';
import PopupControlsView from '../view/popup-controls.js';
import PopupNewCommentView from '../view/popup-new-comment.js';
import PopupCommentCountView from '../view/popup-comment-count.js';
import PopupCommentView from '../view/popup-comment.js';
import AbstractMoviePresenter from '../framework/presenter/abstract-movie-presenter.js';
import { UserAction, UpdateType } from '../const.js';

export default class PopupPresenter extends AbstractMoviePresenter {
  #popupComponent = null;
  #controlsComponent = null;
  #newCommentComponent = null;
  #commentCountView = null;
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
    if (this.#newCommentComponent) {
      this.#oldState = this.#newCommentComponent.state;
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
  };

  #renderComments = (comments) => {
    this.#renderedComments = new Map();
    this.#renderCommentCount(comments.length);
    comments.forEach((comment) => {
      this.#renderComment(comment);
    });
  };

  #renderCommentCount = (count) => {
    if (this.#commentCountView) {
      remove(this.#commentCountView);
    }
    this.#commentCountView = new PopupCommentCountView(count);
    render(this.#commentCountView, this.#popupComponent.commentWrapElement, RenderPosition.AFTERBEGIN);
  };

  #renderComment = (comment) => {
    if (comment) {
      const popupCommentView = new PopupCommentView(comment);
      popupCommentView.setCommentRemoveHandler(this.#handleCommentRemove);
      render(popupCommentView, this.#popupComponent.commentsContainerElement, RenderPosition.BEFOREEND);
      this.#renderedComments.set(comment.id, popupCommentView);
    }
  };

  #clearComments = () => {
    this.#renderedComments.forEach((comment) => remove(comment));
    this.#renderedComments.clear();
  };

  #renderNewComment = () => {
    this.#newCommentComponent = new PopupNewCommentView(this.#oldState);
    this.#newCommentComponent.setCommentSubmitHandler(this.#handleCommentSubmit);
    render(this.#newCommentComponent, this.#popupComponent.commentWrapElement, RenderPosition.BEFOREEND);
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

    this.#setSubmitting();
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {movieId, data}
    );
  };

  #handleCommentRemove = (commentId) => {
    this.#setDeleting(commentId);
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      {commentId}
    );
  };

  handleMovieModelEvent = (updateType, data = null) => {
    if (data && this.currentMovieId === data.id) {
      this.#updateControls(data);
    }
    if (data === null) {
      return;
    }
    this._movie = data;
  };

  handleCommentModelEvent = (updateType, data = null) => {
    this.#updateComments(data);

    if (updateType === UpdateType.MINOR) {
      this.#oldState = {};
      remove(this.#newCommentComponent);
      this.#renderNewComment();
    }
  };

  #updateControls = (movie) => {
    remove(this.#controlsComponent);
    this.#renderControls(movie);
  };

  #updateComments = (data) => {
    if (data === null) {
      this.#commentModel
        .getMovieComments(this._movie.id)
        .then((comments) => {
          this.#clearComments();
          this.#renderComments(comments);
        });
      return;
    }
    this.#clearComments();
    this.#renderComments(data);
  };

  #setDeleting = (commentId) => {
    const comment = this.#renderedComments.get(commentId);
    comment.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
  };

  #setSubmitting = () => {
    this.#newCommentComponent
      .updateElement({
        isDisabled: true,
      });
  };

  unblockComment = (commentId) => {
    const comment = this.#renderedComments.get(commentId);
    comment.updateElement({
      isDisabled: false,
      isDeleting: false,
    });
    comment.shake();
  };

  unblockNewCommentForm = () => {
    this.#newCommentComponent
      .updateElement({
        isDisabled: false,
      });
    this.#newCommentComponent.shake();
  };
}
