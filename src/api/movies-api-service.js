import ApiService from '../framework/api-service.js';
import { Method } from '../const.js';

export default class MoviesApiService extends ApiService {
  get movies() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

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
      watchlist: movie.isWatchlist,
    }

    const adaptedMovie = {
      id: movie.id,
      comments: movie.comments,
      film_info: movieInfo,
      user_details: userDetails,
    }

    return adaptedMovie;
  };
}
