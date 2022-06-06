const TOP_MOVIES = 2;
const MOVIE_COUNT_PER_STEP = 5;
const AUTHORIZATION = 'Basic fw23fhja22';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const BlockerTimeLimit = {
  LOWER_LIMIT: 300,
  UPPER_LIMIT: 1000,
};

const MovieLabel = {
  GENRE: 'Genre',
  ACTOR: 'Actor',
  WRITER: 'Writer',
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const FilterName = {
  [FilterType.ALL]: 'All movies',
  [FilterType.WATCHLIST]: 'Watchlist',
  [FilterType.HISTORY]: 'History',
  [FilterType.FAVORITES]: 'Favorites',
};

const FilterEmptyText = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserAction = {
  UPDATE_MOVIE: 'UPDATE_MOVIE',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  NONE: 'NONE',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const UserRankTitle = {
  NONE: '',
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

const UserRankRequirement = {
  NONE: 0,
  NOVICE: 1,
  FAN: 11,
  MOVIE_BUFF: 21,
};

const RequestMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export {
  AUTHORIZATION,
  END_POINT,
  TOP_MOVIES,
  MOVIE_COUNT_PER_STEP,
  BlockerTimeLimit,
  MovieLabel,
  FilterType,
  FilterName,
  FilterEmptyText,
  SortType,
  UserAction,
  UpdateType,
  UserRankTitle,
  UserRankRequirement,
  RequestMethod,
};

