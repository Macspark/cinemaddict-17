import {createElement} from '../render.js';
import {getYear} from '../utils.js';

const createMovieCardTemplate = (movie) => {
  const {
    poster,
    title,
    rating,
    releaseDate,
    runningTime,
    genres,
    fullDescription,
    comments
  } = movie;
  const MAX_DESCRIPTION_LENGTH = 139;

  const description = fullDescription.length > MAX_DESCRIPTION_LENGTH
    ? `${fullDescription.slice(0, MAX_DESCRIPTION_LENGTH)}…`
    : fullDescription;

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${getYear(releaseDate)}</span>
          <span class="film-card__duration">${runningTime}</span>
          <span class="film-card__genre">${genres[0]}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class MovieCardView {
  constructor(movie) {
    this._movie = movie;
  }

  getTemplate() {
    return createMovieCardTemplate(this._movie);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
