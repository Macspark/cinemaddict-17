import AbstractView from '../framework/view/abstract-view.js';

const createMovieContainerTemplate = () => '<section class="films"></section>';

export default class MovieContainerView extends AbstractView {
  get template() {
    return createMovieContainerTemplate();
  }
}
