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

  init = async () => {
    try {
      const movies = await this.#moviesApiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch(err) {
      this.#movies = [];
    }
    this._notify(UpdateType.INIT);
  };

  updateMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  #adaptToClient = (movie) => {
    let adaptedMovie = flattenObject(movie);
    console.log(movie)
    
    adaptedMovie = {...adaptedMovie,
      ageRating: adaptedMovie.age_rating,
      alternativeTitle: adaptedMovie.alternative_title,
      releaseCountry: adaptedMovie.release_country,
      totalRating: adaptedMovie.total_rating,
      isWatched: adaptedMovie.already_watched,
      isWatchlisted: adaptedMovie.watchlist,
      isFavorite: adaptedMovie.favorite,
      watchingDate: adaptedMovie.watching_date,
      release: adaptedMovie.date,
    };

    delete adaptedMovie.age_rating;
    delete adaptedMovie.alternative_title;
    delete adaptedMovie.already_watched;
    delete adaptedMovie.release_country;
    delete adaptedMovie.total_rating;
    delete adaptedMovie.already_watched;
    delete adaptedMovie.favorite;
    delete adaptedMovie.watching_date;
    delete adaptedMovie.date;

    return adaptedMovie;
  }

  #adaptToServer = (movie) => {
    const movieInfo = {
      actors: movie.actors,
      age_rating: movie.ageRating,
      alternative_title: movie.alternativeTitle,
      description: movie.description,
      director: movie.director,
      genre: movie.genre,
      poster: movie.poster,
      release: {
        date: movie.release,
        release_country: movie.releaseCountry,
      },
      runtime: movie.runtime,
      title: movie.title,
      total_rating: movie.totalRating,
      writers: movie.writers,
    }

    const userDetails = {
      already_watched: movie.isWatched,
      favorite: movie.isFavorite,
      watching_date: movie.watchingDate,
      watchlist: movie.isWatchlisted,
    }

    const adaptedMovie = {
      id: movie.id,
      comments: movie.comments,
      film_info: movieInfo,
      user_details: userDetails,
    }

    return adaptedMovie;
  }
}
