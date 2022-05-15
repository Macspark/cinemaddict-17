import {render, remove, RenderPosition} from '../framework/render.js';
import {TOP_MOVIES, MOVIES_COUNT_PER_STEP} from '../const.js';
import MovieContainerView from '../view/movie-container.js';
import MovieListView from '../view/movie-list.js';
import MovieListExtraView from '../view/movie-list-extra.js';
import MovieEmptyView from '../view/movie-empty.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import CardPresenter from './card-presenter.js';
import PopupPresenter from './popup-presenter.js';

export default class ListPresenter {
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
  #popupPresenter;

  constructor(EntryPoints, movieModel, commentModel) {
    this.#EntryPoints = EntryPoints;
    this.#movieModel = movieModel;
    this.#commentModel = commentModel;
    this.#popupPresenter = new PopupPresenter(EntryPoints.FOOTER);
  }

  init = () => {
    this.#boardMovies = [...this.#movieModel.movies];
    this.#boardComments = [...this.#commentModel.comments];

    this.#renderBoard();
  };

  #renderMovieCard = (movie, container) => {
    const cardPresenter = new CardPresenter(container, this.#popupPresenter);

    const comments = movie.comments.length
      ? movie.comments.map((commentId) =>
        this.#boardComments.find((comment) =>
          comment.id === commentId
        )
      )
      : [];

    cardPresenter.init(movie, comments);
    // this.#cardPresenter.set(task.id, cardPresenter);
  };

  #renderMovieCards = (from, to, container) => {
    this.#boardMovies
      .slice(from, to)
      .forEach((movie) => this.#renderMovieCard(movie, container));
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonViewComponent, this.#movieListMainContainerComponent.container, RenderPosition.AFTEREND);
    this.#showMoreButtonViewComponent.setClickHandler(this.#handleShowMoreButtonClick);
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

  #renderMovieLists = () => {
    render(this.#movieListMainContainerComponent, this.#boardMovieListMainComponent.element);
    this.#renderMovieCards(
      0,
      Math.min(this.#boardMovies.length, MOVIES_COUNT_PER_STEP),
      this.#movieListMainContainerComponent.container
    );

    render(this.#movieListByRatingContainerComponent, this.#boardMovieListMainComponent.element);
    this.#renderMovieCards(
      0,
      TOP_MOVIES,
      this.#movieListByRatingContainerComponent.container
    );

    render(this.#movieListByCommentsContainerComponent, this.#boardMovieListMainComponent.element);
    this.#renderMovieCards(
      0,
      TOP_MOVIES,
      this.#movieListByCommentsContainerComponent.container
    );

    if (this.#boardMovies.length >= this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }
  };

  #renderBoard = () => {
    render(this.#boardMovieListMainComponent, this.#EntryPoints.MAIN);

    if (!this.#boardMovies.length) {
      render(new MovieEmptyView(), this.#boardMovieListMainComponent.element);
      return;
    }

    this.#renderMovieLists();
  };
}
