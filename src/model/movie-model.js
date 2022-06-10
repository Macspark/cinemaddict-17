import { UpdateType } from '../const.js';
import { flattenObject } from '../utils/common.js';
import Observable from '../framework/observable.js';

export default class MovieModel extends Observable {
  #moviesApiService;
  #movies = [];

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  get movies() {
    return this.#movies;
  }

  getMovieById = (movieId) => {
    const index = this.#movies.findIndex((movie) => movie.id === movieId);

    if (index === -1) {
      throw new Error('Movie doesn\'t exist');
    }

    return this.#movies[index];
  };

  init = async () => {
    try {
      const movies = await this.#moviesApiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch(err) {
      this.#movies = [];
    }
    this._notify(UpdateType.INIT);
  };

  refreshMovieModel = async () => {
    try {
      const movies = await this.#moviesApiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch(err) {
      this.#movies = [];
    }
    this._notify(UpdateType.MINOR);
  };

  updateMovie = async (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#moviesApiService.updateMovie(update);
      const updatedMovie = this.#adaptToClient(response);
      this.#movies = [
        ...this.#movies.slice(0, index),
        updatedMovie,
        ...this.#movies.slice(index + 1),
      ];
      this._notify(updateType, updatedMovie);
    } catch(err) {
      throw new Error('Can\'t update movie');
    }
  };

  #adaptToClient = (movie) => {
    let adaptedMovie = flattenObject(movie);

    adaptedMovie = {...adaptedMovie,
      'ageRating': adaptedMovie.age_rating,
      'alternativeTitle': adaptedMovie.alternative_title,
      'releaseCountry': adaptedMovie.release_country,
      'totalRating': adaptedMovie.total_rating,
      'isWatched': adaptedMovie.already_watched,
      'isWatchlist': adaptedMovie.watchlist,
      'isFavorite': adaptedMovie.favorite,
      'watchingDate': adaptedMovie.watching_date,
      'release': adaptedMovie.date,
    };

    delete adaptedMovie.age_rating;
    delete adaptedMovie.alternative_title;
    delete adaptedMovie.release_country;
    delete adaptedMovie.total_rating;
    delete adaptedMovie.already_watched;
    delete adaptedMovie.watchlist;
    delete adaptedMovie.favorite;
    delete adaptedMovie.watching_date;
    delete adaptedMovie.date;

    return adaptedMovie;
  };
}
