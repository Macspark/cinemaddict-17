import AbstractView from '../framework/view/abstract-view.js';

const getUserRank = (watchedMoviesCount) => {
  switch (true) {
    case (watchedMoviesCount > 0 && watchedMoviesCount <= 10):
      return 'Novice';
    case (watchedMoviesCount > 10 && watchedMoviesCount <= 20):
      return 'Fan';
    case (watchedMoviesCount > 20):
      return 'Movie Buff';
    default:
      return '';
  }
};

const createUserTemplate = (watchedMoviesCount) => (
  `<section class="header__profile profile">
        <p class="profile__rating">${getUserRank(watchedMoviesCount)}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserView extends AbstractView {
  #watchedMoviesCount = 0;

  constructor(watchedMoviesCount) {
    super();
    this.#watchedMoviesCount = watchedMoviesCount;
  }

  get template() {
    return createUserTemplate(this.#watchedMoviesCount);
  }
}
