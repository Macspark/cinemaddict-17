import { FilterType } from '../const.js';
import Observable from '../framework/observable.js';

export default class FilterModel extends Observable {
  #currentFilter;

  constructor() {
    super();
    this.#currentFilter = FilterType.ALL;
  }

  get currentFilter() {
    return this.#currentFilter;
  }

  setFilter(updateType, newFilter) {
    this.#currentFilter = newFilter;

    this._notify(updateType, newFilter);
  }
}
