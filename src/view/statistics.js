import AbstractView from '../framework/view/abstract-view.js';

const createStatisticsTemplate = (movieCount) => `<p>${movieCount} movies inside</p>`;

export default class StatisticsView extends AbstractView {
  #movieCount;

  constructor(movieCount) {
    super();
    this.#movieCount = movieCount;
  }
  get template() {
    return createStatisticsTemplate(this.#movieCount);
  }
}
