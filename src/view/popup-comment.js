import AbstractView from '../framework/view/abstract-view.js';
import { getHumanRelativeTime } from '../utils/time.js';

const createPopupCommentTemplate = (comment) => (
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji-${comment.emoji}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.text}</p>
      <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${getHumanRelativeTime(comment.date)}</span>
          <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
);

export default class PopupCommentView extends AbstractView {
  #comment;

  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createPopupCommentTemplate(this.#comment);
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
}
