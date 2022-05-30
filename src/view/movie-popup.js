import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import MoviePopupCommentsView from './movie-popup-comments.js';
import { getHumanDate, getHumanDateTime } from '../utils/common.js';
import { formatMovieRunningTime } from '../utils/movie.js';
import { nanoid } from 'nanoid';

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
    : 'Genres'

  return `
  <td class="film-details__term">${genresTitle}</td>
  <td class="film-details__cell">${genresLayout}</td>`;
};

const createCommentsLayout = (comments) => {
  if (!comments || !comments.length) {
    return '';
  }

  const commentsLayout = comments.reduce((result, comment) => (
    `${result}
    <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji-${comment.emoji}">
        </span>
        <div>
          <p class="film-details__comment-text">${comment.text}</p>
          <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.author}</span>
              <span class="film-details__comment-day">${getHumanDateTime(comment.date)}</span>
              <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`
  ), '');

  return commentsLayout;
};

const createNewCommentLayout = (newComment) => {
  const {
    text = null,
    emoji = null
  } = newComment;

  const emojiImage = emoji
    ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">`
    : '';

  const newCommentLayout = `
    <div class="film-details__add-emoji-label">
      ${emojiImage}
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${text ? text : ''}</textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${emoji === 'smile' ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${emoji === 'sleeping' ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${emoji === 'puke' ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${emoji === 'angry' ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>`;

  return newCommentLayout;
};

const createMoviePopupTemplate = (movie, comments, newComment) => {
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
    ageRestriction,
    isWatchlist,
    isWatched,
    isFavorite
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
                      <td class="film-details__cell">${formatMovieRunningTime(runningTime)}</td>
                    </tr>
                    <tr class="film-details__row">
                      <td class="film-details__term">Country</td>
                      <td class="film-details__cell">${country}</td>
                    </tr>
                    <tr class="film-details__row">
                        ${createGenresLayout(genres)}
                    </tr>
                </table>

                <p class="film-details__film-description">
                    ${fullDescription}
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
                  ${createCommentsLayout(comments)}
                </ul>

                <div class="film-details__new-comment">
                  ${createNewCommentLayout(newComment)}
                </div>
              </section>
            </div>
        </form>
    </section>`
  );
};

export default class MoviePopupView extends AbstractStatefulView {
  #movie;
  #comments;
  scrollTop;

  constructor(movie, comments) {
    super();
    this.#movie = movie;
    this.#comments = comments;
    this.#setInnerHandlers();
  }

  get template() {
    return createMoviePopupTemplate(this.#movie, this.#comments, this._state);
  }

  get state() {
    return this._state;
  }

  restoreState = (state) => {
    this.updateElement(state);
  };

  restorePosition = () => {
    this.element.scrollTop = this.scrollTop;
  };

  #convertStateToComment = () => {
    const comment = {...this._state};

    comment.id = nanoid();
    delete comment.scrollTop;

    return comment;
  };

  setCommentSubmitHandler = (callback) => {
    this._callback.submitComment = callback;
    this.element.addEventListener('keydown', this.#onCtrlEnterKeyDown);
  };

  setCommentSubmitRemove = (callback) => {
    this._callback.removeComment = callback;
    this.element.addEventListener('click', this.#handleRemoveComment);
  };

  #handleRemoveComment = (evt) => {
    evt.preventDefault();
    this._callback.removeComment(targetComment);
  }

  #onCtrlEnterKeyDown = (evt) => {
    if (evt.ctrlKey && evt.keyCode == 13) {
      evt.preventDefault();
      this.#commentSubmitHandler();
    }
  }
  
  #commentSubmitHandler = () => {
    const newComment = this.#convertStateToComment(this._state);
    this._callback.submitComment(newComment);
  }

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

  #newCommentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      text: evt.target.value
    });
  };

  #emojiClickHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this.scrollTop = this.element.scrollTop;

    this.updateElement({
      emoji: evt.target.value,
    });
  };

  _restoreHandlers = () => {
    this.setCloseClickHandler(this._callback.closeClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setCommentSubmitHandler(this._callback.submitComment);
    this.#setInnerHandlers();
    this.restorePosition();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#emojiClickHandler);

    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#newCommentInputHandler);
  };
}
