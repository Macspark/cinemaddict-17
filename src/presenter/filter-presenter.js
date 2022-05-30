import { render, remove, replace } from '../framework/render.js';
import MovieFilterView from '../view/filter.js';
import { getFilters } from '../utils/filter.js';
import { UpdateType } from '../const.js';

export default class FilterPresenter {
  #entryPoint;
  #movieModel;
  #filterComponent = null;
  #filterModel;
  #currentFilter;
  
  constructor(entryPoint, movieModel, filterModel) {
    this.#entryPoint = entryPoint;
    this.#movieModel = movieModel;
    this.#filterModel = filterModel;
    
    this.#movieModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const movies = this.#movieModel.movies;
    const filters = getFilters(movies);
    const oldFilterComponent = this.#filterComponent;
    
    this.#currentFilter = this.#filterModel.currentFilter;
    this.#filterComponent = new MovieFilterView(filters, this.#currentFilter);
    this.#filterComponent.setFilterClickHandler(this.#handleFilterChange);

    if (oldFilterComponent === null) {
      render(this.#filterComponent, this.#entryPoint);
      return;
    }

    replace(this.#filterComponent, oldFilterComponent);
    remove(oldFilterComponent);
  };

  #handleFilterChange = (newFilter) => {
    this.#filterModel.setFilter(UpdateType.MAJOR, newFilter);
  }

  #handleModelEvent = () => {
    this.init();
  }
}
