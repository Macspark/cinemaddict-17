import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getHumanRelativeTime } from '../utils/time.js';
import he from 'he';

const createPopupCommentTemplate = (comment, state) => (
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment.text)}</p>
      <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${getHumanRelativeTime(comment.date)}</span>
          <button class="film-details__comment-delete" ${state.isDisabled ? 'disabled' : ''}>${state.isDeleting ? 'Deleting' : 'Delete'}</button>
      </p>
    </div>
  </li>`
);

export default class PopupCommentView extends AbstractStatefulView {
  #comment;

  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createPopupCommentTemplate(this.#comment, this._state);
  }

  setCommentRemoveHandler = (callback) => {
    this._callback.removeComment = callback;
    this.element.querySelector('.film-details__comment-delete')
      .addEventListener('click', this.#handleRemoveComment);
  };

  #handleRemoveComment = (evt) => {
    evt.preventDefault();
    this._callback.removeComment(this.#comment.id);
  };

  _restoreHandlers = () => {
    this.setCommentRemoveHandler(this._callback.removeComment);
  };
}
