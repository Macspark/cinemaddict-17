import AbstractView from '../framework/view/abstract-view.js';
import { getHumanDate, formatMovieRunningTime } from '../utils/time.js';

const createGenresLayout = (genres) => {
  if (!genres || !genres.length) {
    return '';
  }

  const genresLayout = genres.reduce((result, genre) => (
    `${result}
      <span class="film-details__genre">${genre}</span>`
  ), '');

  const genresTitle = genres.length === 1
    ? 'Genre'
    : 'Genres';

  return `
  <td class="film-details__term">${genresTitle}</td>
  <td class="film-details__cell">${genresLayout}</td>`;
};

const createPopupTemplate = (movie, commentsCount) => {
  const {
    poster,
    title,
    alternativeTitle,
    totalRating,
    director,
    writers,
    actors,
    release,
    runtime,
    releaseCountry,
    genre,
    description,
    ageRating,
    isWatchlist,
    isWatched,
    isFavorite,
    comments,
  } = movie;

  return (
    `<section class="film-details">
        <form class="film-details__inner" action="" method="get">
            <div class="film-details__top-container">
            <div class="film-details__close">
                <button class="film-details__close-btn" type="button">close</button>
            </div>
            <div class="film-details__info-wrap">
                <div class="film-details__poster">
                  <img class="film-details__poster-img" src="${poster}" alt="">

                  <p class="film-details__age">${ageRating}</p>
                </div>

                <div class="film-details__info">
                <div class="film-details__info-head">
                    <div class="film-details__title-wrap">
                      <h3 class="film-details__title">${title}</h3>
                      <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                    </div>

                    <div class="film-details__rating">
                      <p class="film-details__total-rating">${totalRating}</p>
                    </div>
                </div>

                <table class="film-details__table">
                    <tr class="film-details__row">
                      <td class="film-details__term">Director</td>
                      <td class="film-details__cell">${director}</td>
                    </tr>
                    <tr class="film-details__row">
                      <td class="film-details__term">Writers</td>
                      <td class="film-details__cell">${writers}</td>
                    </tr>
                    <tr class="film-details__row">
                      <td class="film-details__term">Actors</td>
                      <td class="film-details__cell">${actors}</td>
                    </tr>
                    <tr class="film-details__row">
                      <td class="film-details__term">Release Date</td>
                      <td class="film-details__cell">${getHumanDate(release)}</td>
                    </tr>
                    <tr class="film-details__row">
                      <td class="film-details__term">Runtime</td>
                      <td class="film-details__cell">${formatMovieRunningTime(runtime)}</td>
                    </tr>
                    <tr class="film-details__row">
                      <td class="film-details__term">Country</td>
                      <td class="film-details__cell">${releaseCountry}</td>
                    </tr>
                    <tr class="film-details__row">
                        ${createGenresLayout(genre)}
                    </tr>
                </table>

                <p class="film-details__film-description">
                    ${description}
                </p>
                </div>
            </div>

            <section class="film-details__controls">
                <button type="button" class="film-details__control-button film-details__control-button--watchlist ${isWatchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
                <button type="button" class="film-details__control-button film-details__control-button--watched ${isWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
                <button type="button" class="film-details__control-button film-details__control-button--favorite ${isFavorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
            </section>
            </div>

            <div class="film-details__bottom-container">
              <section class="film-details__comments-wrap">
                <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
                <ul class="film-details__comments-list">
                  
                </ul>
                </section>
            </div>
        </form>
    </section>`
  );
};

export default class PopupView extends AbstractView {
  #movie;
  scrollTop;

  constructor(movie, commentsCount) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createPopupTemplate(this.#movie);
  }

  get newCommentContainerElement() {
    return this.element.querySelector('.film-details__comments-wrap');
  }

  get commentsContainerElement() {
    return this.element.querySelector('.film-details__comments-list');
  }

  restorePosition = (scrollTop = this.scrollTop) => {
    this.element.scrollTop = scrollTop;
  };

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.scrollTop = 0;
    this._callback.closeClick();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
