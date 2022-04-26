import {createElement} from '../render.js';

const createMovieContainerTemplate = () => '<section class="films"></section>';

export default class MovieContainerView {
  getTemplate() {
    return createMovieContainerTemplate();
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
