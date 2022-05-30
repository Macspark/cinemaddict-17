import { FilterType, FilterName } from '../const.js';

const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.isWatchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.isWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.isFavorite)
};

const filterMovies = (filterType, movies) => {
  return filter[filterType](movies);
}

const getFilters = (movies) => Object.entries(filter).map(
  ([name, filterMovies]) => ({
    name: name,
    displayableName: FilterName[name],
    count: filterMovies(movies).length,
  }),
);

export {filterMovies, getFilters};
