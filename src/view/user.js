import AbstractView from '../framework/view/abstract-view.js';
import { UserRankTitle, UserRankRequirement } from '../const.js';

const getUserRank = (watchedMoviesCount) => {
  switch (true) {
    case (watchedMoviesCount >= UserRankRequirement.MOVIE_BUFF):
      return UserRankTitle.MOVIE_BUFF;
    case (watchedMoviesCount >= UserRankRequirement.FAN):
      return UserRankTitle.FAN;
    case (watchedMoviesCount >= UserRankRequirement.NOVICE):
      return UserRankTitle.NOVICE;
    default:
      return UserRankTitle.NONE;
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
