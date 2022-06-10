import AbstractView from '../framework/view/abstract-view.js';

const createPopupCommentCountTemplate = (count) => (`
  <h3 class="film-details__comments-title">Comments 
    <span class="film-details__comments-count">
      ${count}
    </span>
  </h3>`
);

export default class PopupCommentCountView extends AbstractView {
  #commentCount;

  constructor(commentCount) {
    super();
    this.#commentCount = commentCount;
  }

  get template() {
    return createPopupCommentCountTemplate(this.#commentCount);
  }
}
