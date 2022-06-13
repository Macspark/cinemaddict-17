import { FilterType, FilterName } from '../const.js';

const filterByType = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.isWatchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.isWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.isFavorite)
};

const getFilteredMovies = (filterType, movies) => filterByType[filterType](movies);

const getFilters = (movies) => Object.entries(filterByType).map(
  ([name, filterMovies]) => ({
    name: name,
    displayableName: FilterName[name],
    count: filterMovies(movies).length,
  }),
);

export {
  getFilteredMovies,
  getFilters,
};
