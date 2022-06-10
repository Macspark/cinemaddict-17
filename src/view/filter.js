import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const createFilterItemTemplate  = (filter, isActive) => {
  const {
    name,
    displayableName,
    count
  } = filter;

  const moviesCount = name === FilterType.ALL
    ? ''
    : `<span class="main-navigation__item-count">${count}</span>`;

  return (
    `<a href="#" data-filter-type="${name}" class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''} ${count === 0 ? 'disabled' : ''}">
      ${displayableName} 
      ${moviesCount}
    </a>`
  );
};

const createFilterTemplate = (filterItems, currentFilter) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilter === filter.name))
    .join('');

  return (
    `<nav class="main-navigation">
      ${filterItemsTemplate}
    </nav>`
  );
};

export default class FilterView extends AbstractView {
  #filters;
  #currentFilter;

  constructor(filters, currentFilter) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterClickHandler = (callback) => {
    this._callback.filterClick = callback;
    this.element.addEventListener('click', this.#filterClickHandler);
  };

  #filterClickHandler = (evt) => {
    const target = evt.target.closest('a');

    if (!target) {
      return;
    }

    evt.preventDefault();
    const newFilter = target.dataset.filterType;
    this._callback.filterClick(newFilter);
  };
}
