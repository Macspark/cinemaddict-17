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

const createPeopleLayout = (array) => {
  if (!array || !array.length) {
    return '';
  }

  const layout = array.reduce((result, element) => (
    `${result}
      ${element}, `
  ), '').replace(/,\s*$/, '');

  return layout;
};

const createPopupTemplate = (movie) => {
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
                        <td class="film-details__cell">${createPeopleLayout(writers)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${createPeopleLayout(actors)}</td>
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
            </div>

            <div class="film-details__bottom-container">
              <section class="film-details__comments-wrap">
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

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createPopupTemplate(this.#movie);
  }

  get commentWrapElement() {
    return this.element.querySelector('.film-details__comments-wrap');
  }

  get commentsContainerElement() {
    return this.element.querySelector('.film-details__comments-list');
  }

  get bottomContainerElement() {
    return this.element.querySelector('.film-details__bottom-container');
  }

  restorePosition = (scrollTop = this.scrollTop) => {
    this.element.scrollTop = scrollTop;
  };

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.scrollTop = 0;
    this._callback.closeClick();
  };
}
