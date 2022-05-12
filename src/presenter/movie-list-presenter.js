import {render, remove, RenderPosition} from '../framework/render.js';
import {TOP_MOVIES, MOVIES_COUNT_PER_STEP} from '../const.js';
import MovieContainerView from '../view/movie-container.js';
import MovieListView from '../view/movie-list.js';
import MovieListExtraView from '../view/movie-list-extra.js';
import MovieCardView from '../view/movie-card.js';
import MovieEmptyView from '../view/movie-empty.js';
import MoviePopupView from '../view/movie-popup.js';
import ShowMoreButtonView from '../view/show-more-button.js';

export default class MovieListPresenter {
  #EntryPoints;
  #movieModel;
  #commentModel;
  #boardMovies;
  #boardComments;
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;

  #boardMovieListMainComponent = new MovieContainerView();
  #movieListMainContainerComponent = new MovieListView();
  #movieListByRatingContainerComponent = new MovieListExtraView('Top rated');
  #movieListByCommentsContainerComponent = new MovieListExtraView('Most comments');
  #showMoreButtonViewComponent = new ShowMoreButtonView();
  #moviePopupView = null;

  constructor(EntryPoints, movieModel, commentModel) {
    this.#EntryPoints = EntryPoints;
    this.#movieModel = movieModel;
    this.#commentModel = commentModel;
  }

  init = () => {
    this.#boardMovies = [...this.#movieModel.movies];
    this.#boardComments = [...this.#commentModel.comments];

    this.#renderBoard();
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #closePopup = () => {
    remove(this.#moviePopupView);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #renderPopup = (movie) => {
    if (this.#moviePopupView) {
      this.#closePopup();
    }

    const popupComments = movie.comments.length
      ? movie.comments.map((commentId) =>
        this.#boardComments.find((comment) =>
          comment.id === commentId
        )
      )
      : [];

    this.#moviePopupView = new MoviePopupView(movie, popupComments);
    this.#moviePopupView.setClickHandler(() => {
      this.#closePopup();
    });

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    render(this.#moviePopupView, this.#EntryPoints.FOOTER, RenderPosition.AFTEREND);
  };

  #renderMovieCard = (movie, place) => {
    const movieComponent = new MovieCardView(movie);

    movieComponent.setClickHandler(() => {
      this.#renderPopup(movie);
    });

    render(movieComponent, place);
  };

  #handleShowMoreButtonClick = () => {
    this.#boardMovies
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovieCard(movie, this.#movieListMainContainerComponent.container));

    this.#renderedMoviesCount += MOVIES_COUNT_PER_STEP;

    if (this.#renderedMoviesCount >= this.#boardMovies.length) {
      remove(this.#showMoreButtonViewComponent);
    }
  };

  #renderBoard = () => {
    render(this.#boardMovieListMainComponent, this.#EntryPoints.MAIN);

    if (!this.#boardMovies.length) {
      render(new MovieEmptyView(), this.#boardMovieListMainComponent.element);
      return;
    }

    render(this.#movieListMainContainerComponent, this.#boardMovieListMainComponent.element);

    for (let i = 0; i < Math.min(this.#boardMovies.length, MOVIES_COUNT_PER_STEP); i++) {
      this.#renderMovieCard(this.#boardMovies[i], this.#movieListMainContainerComponent.container);
    }

    render(this.#movieListByRatingContainerComponent, this.#boardMovieListMainComponent.element);
    for (let i = 0; i < TOP_MOVIES; i++) {
      this.#renderMovieCard(this.#boardMovies[i], this.#movieListByRatingContainerComponent.container);
    }

    render(this.#movieListByCommentsContainerComponent, this.#boardMovieListMainComponent.element);
    for (let i = 0; i < TOP_MOVIES; i++) {
      this.#renderMovieCard(this.#boardMovies[i], this.#movieListByCommentsContainerComponent.container);
    }

    if (this.#boardMovies.length >= this.#renderedMoviesCount) {
      render(this.#showMoreButtonViewComponent, this.#movieListMainContainerComponent.container, RenderPosition.AFTEREND);
      this.#showMoreButtonViewComponent.setClickHandler(this.#handleShowMoreButtonClick);
    }
  };
}
