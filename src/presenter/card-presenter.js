import {render, remove, replace} from '../framework/render.js';
import MovieCardView from '../view/movie-card.js';

export default class CardPresenter {
  #container;
  #movie;
  #comments;
  #popupPresenter;
  #movieComponent = null;
  #changeData;

  constructor(container, popupPresenter, changeData) {
    this.#container = container;
    this.#popupPresenter = popupPresenter;
    this.#changeData = changeData;
  }

  init = (movie, comments = this.#comments) => {
    this.#movie = movie;
    this.#comments = comments;

    const prevMovieComponent = this.#movieComponent;

    this.#movieComponent = new MovieCardView(movie);
    this.#movieComponent.setCardClickHandler(this.#handleMovieCardClick);
    this.#movieComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#movieComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#movieComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevMovieComponent === null) {
      render(this.#movieComponent, this.#container);
      return;
    }

    replace(this.#movieComponent, prevMovieComponent)

    remove(prevMovieComponent);
  };

  destroy = () => {
    remove(this.#movieComponent);
  };

  #handleMovieCardClick = () => {
    this.#popupPresenter.init(this.#movie, this.#comments);
  };

  #handleWatchlistClick = () => {
    this.#changeData({...this.#movie, isWatchlist: !this.#movie.isWatchlist});
  };

  #handleWatchedClick = () => {
    this.#changeData({...this.#movie, isWatched: !this.#movie.isWatched});
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#movie, isFavorite: !this.#movie.isFavorite});
  };
}
