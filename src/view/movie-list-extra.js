import {createElement} from '../render.js';

const createMovieListExtraTemplate = (title) => (
  `<section class="films-list films-list--extra">
        <h2 class="films-list__title">${title}</h2>
        <div class="films-list__container">
        </div>
  </section>`
);

export default class MovieListExtraView {
  #element;
  #title;

  constructor(title) {
    this.#title = title;
  }

  get template() {
    return createMovieListExtraTemplate(this.#title);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get container() {
    return this.element.querySelector('.films-list__container');
  }

  removeElement() {
    this.#element = null;
  }
}
