import AbstractView from '../framework/view/abstract-view.js';
import {getHumanDate, getHumanDateTime} from '../utils.js';

const createGenresLayout = (genres) => {
  if (!genres || !genres.length) {
    return '';
  }

  const genresLayout = genres.reduce((result, genre) => (
    `${result}
      <span class="film-details__genre">${genre}</span>`), ''
  );

  return genresLayout;
};

const createCommentsLayout = (comments) => {
  if (!comments || !comments.length) {
    return '';
  }

  const commentsLayout = comments.reduce((result, comment) => (
    `${result}
    <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${comment.text}</p>
          <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.author}</span>
              <span class="film-details__comment-day">${getHumanDateTime(comment.date)}</span>
              <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`), ''
  );

  return commentsLayout;
};

const createMoviePopupTemplate = (movie, comments) => {
  const {
    poster,
    title,
    originalTitle,
    rating,
    director,
    writers,
    stars,
    releaseDate,
    runningTime,
    country,
    genres,
    fullDescription,
    ageRestriction
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

                <p class="film-details__age">${ageRestriction}</p>
                </div>

                <div class="film-details__info">
                <div class="film-details__info-head">
                    <div class="film-details__title-wrap">
                    <h3 class="film-details__title">${title}</h3>
                    <p class="film-details__title-original">Original: ${originalTitle}</p>
                    </div>

                    <div class="film-details__rating">
                    <p class="film-details__total-rating">${rating}</p>
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
                    <td class="film-details__cell">${stars}</td>
                    </tr>
                    <tr class="film-details__row">
                    <td class="film-details__term">Release Date</td>
                    <td class="film-details__cell">${getHumanDate(releaseDate)}</td>
                    </tr>
                    <tr class="film-details__row">
                    <td class="film-details__term">Runtime</td>
                    <td class="film-details__cell">${runningTime}</td>
                    </tr>
                    <tr class="film-details__row">
                    <td class="film-details__term">Country</td>
                    <td class="film-details__cell">${country}</td>
                    </tr>
                    <tr class="film-details__row">
                    <td class="film-details__term">Genres</td>
                    <td class="film-details__cell">
                        ${createGenresLayout(genres)}
                    </tr>
                </table>

                <p class="film-details__film-description">
                    ${fullDescription}
                </p>
                </div>
            </div>

            <section class="film-details__controls">
                <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
                <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
                <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
            </section>
            </div>

            <div class="film-details__bottom-container">
              <section class="film-details__comments-wrap">
                <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments && comments.length ? comments.length : '0'}</span></h3>

                <ul class="film-details__comments-list">
                  ${createCommentsLayout(comments)}
                </ul>

                <div class="film-details__new-comment">
                  <div class="film-details__add-emoji-label"></div>
    
                  <label class="film-details__comment-label">
                    <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                  </label>
    
                  <div class="film-details__emoji-list">
                    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                    <label class="film-details__emoji-label" for="emoji-smile">
                    <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                    </label>
    
                    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                    <label class="film-details__emoji-label" for="emoji-sleeping">
                      <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                    </label>
    
                    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                    <label class="film-details__emoji-label" for="emoji-puke">
                      <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                    </label>
    
                    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                    <label class="film-details__emoji-label" for="emoji-angry">
                      <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                    </label>
                  </div>
                </div>
              </section>
            </div>
        </form>
    </section>`
  );
};

export default class MoviePopupView extends AbstractView {
  #movie;
  #comments;

  constructor(movie, comments) {
    super();
    this.#movie = movie;
    this.#comments = comments;
  }

  get template() {
    return createMoviePopupTemplate(this.#movie, this.#comments);
  }

  get closeButton() {
    return this.element.querySelector('.film-details__close-btn');
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.closeButton.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
