import AbstractView from '../framework/view/abstract-view.js';

const createMovieListExtraTemplate = (title) => (
  `<section class="films-list films-list--extra">
        <h2 class="films-list__title">${title}</h2>
        <div class="films-list__container">
        </div>
  </section>`
);

export default class MovieListExtraView extends AbstractView {
  #title;

  constructor(title) {
    super();
    this.#title = title;
  }

  get template() {
    return createMovieListExtraTemplate(this.#title);
  }

  get container() {
    return this.element.querySelector('.films-list__container');
  }
}
