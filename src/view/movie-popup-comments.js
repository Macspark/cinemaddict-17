import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createCommentsLayout = (comments) => {
  if (!comments || !comments.length) {
    return '';
  }

  const commentsLayout = comments.reduce((result, comment) => (
    `${result}
    <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji-${comment.emoji}">
        </span>
        <div>
          <p class="film-details__comment-text">${comment.text}</p>
          <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.author}</span>
              <span class="film-details__comment-day">${getHumanDateTime(comment.date)}</span>
              <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`
  ), '');

  return commentsLayout;
};

const createMoviePopupCommentsTemplate = (comments, newComment) => {
  return `
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">
        ${createCommentsLayout(comments)}
      </ul>`;
};

export default class MoviePopupCommentsView extends AbstractStatefulView {
  #comments;
  scrollTop;

  constructor(comments) {
    super();
    this.#comments = comments;
    this.#setInnerHandlers();
  }

  get template() {
    return createMoviePopupCommentsTemplate(this.#comments, this._state);
  }

  get state() {
    return this._state;
  }

  restoreState = (state) => {
    this.updateElement(state);
  };

  restorePosition = () => {
    this.element.scrollTop = this.scrollTop;
  };

  #convertStateToComment = () => {
    const comment = {...this._state};

    comment.id = nanoid();
    delete comment.scrollTop;

    return comment;
  };

  setCommentSubmitHandler = (callback) => {
    this._callback.submitComment = callback;
    this.element.addEventListener('keydown', this.#onCtrlEnterKeyDown);
  };

  setCommentSubmitRemove = (callback) => {
    this._callback.removeComment = callback;
    this.element.addEventListener('click', this.#handleRemoveComment);
  };

  #handleRemoveComment = (evt) => {
    evt.preventDefault();
    this._callback.removeComment(targetComment);
  }

  #onCtrlEnterKeyDown = (evt) => {
    if (evt.ctrlKey && evt.keyCode == 13) {
      evt.preventDefault();
      this.#commentSubmitHandler();
    }
  }
  
  #commentSubmitHandler = () => {
    const newComment = this.#convertStateToComment(this._state);
    this._callback.submitComment(newComment);
  }

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.scrollTop = 0;
    this._callback.closeClick();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #newCommentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      text: evt.target.value
    });
  };

  #emojiClickHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this.scrollTop = this.element.scrollTop;

    this.updateElement({
      emoji: evt.target.value,
    });
  };

  _restoreHandlers = () => {
    this.setCloseClickHandler(this._callback.closeClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setCommentSubmitHandler(this._callback.submitComment);
    this.#setInnerHandlers();
    this.restorePosition();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#emojiClickHandler);

    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#newCommentInputHandler);
  };
}
