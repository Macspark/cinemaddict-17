import AbstractView from '../framework/view/abstract-view.js';

const createMovieListTemplate = () => (
  `<section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
        <div class="films-list__container">
        </div>
  </section>`
);

export default class MovieListView extends AbstractView {
  get template() {
    return createMovieListTemplate();
  }

  get container() {
    return this.element.querySelector('.films-list__container');
  }
}
