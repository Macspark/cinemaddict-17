import {generateMovie} from '../mock/movie.js';

export default class MoviesModel {
  #movies = Array.from({length: 13}, generateMovie);

  get movies() {
    return this.#movies;
  }
}
