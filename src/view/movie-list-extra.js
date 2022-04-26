import {createElement} from '../render.js';

const createMovieListExtraTemplate = (title) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${title}</h2>
    <div class="films-list__container">
    </div>
  </section>`
);

export default class MovieListExtraView {
  constructor(title) {
    this._title = title;
  }
  getTemplate() {
    return createMovieListExtraTemplate(this._title);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
