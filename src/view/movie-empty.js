import AbstractView from '../framework/view/abstract-view.js';
import { FilterType, FilterEmptyText } from '../const.js';

const createMovieListExtraTemplate = (filter = FilterType.ALL) => (
  `<section class="films-list">
    <h2 class="films-list__title">${FilterEmptyText[filter]}</h2>
  </section>`
);

export default class MovieListExtraView extends AbstractView {
  #filter;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    console.log(this.#filter);
    return createMovieListExtraTemplate(this.#filter);
  }
}
