import { render, remove, replace } from '../framework/render.js';
import MovieCardView from '../view/movie-card.js';
import AbstractMoviePresenter from '../framework/presenter/abstract-movie-presenter.js';

export default class MoviePresenter extends AbstractMoviePresenter {
  #movieComponent = null;
  #popupPresenter;

  constructor(container, popupPresenter, changeData) {
    super(container, changeData);
    this.#popupPresenter = popupPresenter;
  }

  init = (movie, comments = this._comments) => {
    this._movie = movie;
    this._comments = comments;

    const prevMovieComponent = this.#movieComponent;

    this.#movieComponent = new MovieCardView(movie);
    this.#movieComponent.setCardClickHandler(this.#handleMovieCardClick);
    this.#movieComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this.#movieComponent.setWatchedClickHandler(this._handleWatchedClick);
    this.#movieComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevMovieComponent === null) {
      render(this.#movieComponent, this._container);
      return;
    }

    replace(this.#movieComponent, prevMovieComponent);
    remove(prevMovieComponent);
  };

  destroy = () => {
    remove(this.#movieComponent);
  };

  #handleMovieCardClick = () => {
    this.#popupPresenter.init(this._movie, this._comments);
  };
}
