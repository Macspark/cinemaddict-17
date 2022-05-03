import {createElement} from '../render.js';

const createMovieContainerTemplate = () => '<section class="films"></section>';

export default class MovieContainerView {
  #element;

  get template() {
    return createMovieContainerTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
