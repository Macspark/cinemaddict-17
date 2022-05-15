import {render, remove} from '../framework/render.js';
import MovieCardView from '../view/movie-card.js';

export default class CardPresenter {
  #movieListContainer;
  #movie;
  #comments;
  #popupPresenter;
  #movieComponent;

  constructor(container, popupPresenter) {
    this.#movieListContainer = container;
    this.#popupPresenter = popupPresenter;
  }

  init = (movie, comments) => {
    this.#movie = movie;
    this.#comments = comments;

    this.#movieComponent = new MovieCardView(movie);
    this.#movieComponent.setCardClickHandler(this.#handleMovieCardClick);
    this.#movieComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#movieComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#movieComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    render(this.#movieComponent, this.#movieListContainer);
  };

  destroy = () => {
    remove(this.#movieComponent);
  };

  #handleMovieCardClick = () => {
    this.#popupPresenter.init(this.#movie, this.#comments);
  };

  #handleWatchlistClick = () => {
    console.log('watchlist');
  };

  #handleWatchedClick = () => {
    console.log('watched');
  };

  #handleFavoriteClick = () => {
    console.log('fav');
  };
}
