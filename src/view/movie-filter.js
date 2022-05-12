import AbstractView from '../framework/view/abstract-view.js';
import {FilterType, FilterName} from '../const.js';

const createFilterItemTemplate  = (filter, isActive) => {
  const {name, count} = filter;

  const moviesCount = name === FilterType.ALL
    ? ''
    : `<span class="main-navigation__item-count">${count}</span>`;

  return (
    `<a href="#${name}" class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''}">${FilterName[name]} 
      ${moviesCount}
    </a>`
  );
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return (
    `<nav class="main-navigation">
      ${filterItemsTemplate}
    </nav>`
  );
};

export default class FilterView extends AbstractView {
  #filters;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
