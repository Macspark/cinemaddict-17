import {render, remove, RenderPosition} from '../framework/render.js';
import {TOP_MOVIES, MOVIES_COUNT_PER_STEP, SortType} from '../const.js';
import {updateItem, sortMoviesByRating, sortMoviesByComments, sortMoviesByDate} from '../utils/movie.js';
import MovieContainerView from '../view/movie-container.js';
import MovieListView from '../view/movie-list.js';
import MovieListExtraView from '../view/movie-list-extra.js';
import MovieEmptyView from '../view/movie-empty.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import SortView from '../view/sort.js';
import MoviePresenter from './movie-presenter.js';
import PopupPresenter from './popup-presenter.js';

export default class BoardPresenter {
  #EntryPoints;
  #movieModel;
  #commentModel;
  #listMovies;
  #currentSortType = SortType.DEFAULT;
  #sourcedListMovies;
  #listComments;
  #scrollTop = 0;
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  #moviePresenter = new Map();
  #movieTopRatedPresenter = new Map();
  #movieMostCommentedPresenter = new Map();

  #movieListBodyComponent = new MovieContainerView();
  #movieListComponent = new MovieListView();
  #movieListExtraRatingComponent = new MovieListExtraView('Top rated');
  #movieListExtraCommentsComponent = new MovieListExtraView('Most comments');
  #movieEmptyComponent = new MovieEmptyView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #movieSortComponent = new SortView();
  #popupPresenter;

  constructor(EntryPoints, movieModel, commentModel) {
    this.#EntryPoints = EntryPoints;
    this.#movieModel = movieModel;
    this.#commentModel = commentModel;
    this.#popupPresenter = new PopupPresenter(EntryPoints.FOOTER, this.#handleMovieChange);
  }

  init = () => {
    this.#listMovies = [...this.#movieModel.movies];
    this.#sourcedListMovies = [...this.#movieModel.movies];
    this.#listComments = [...this.#commentModel.comments];

    this.#renderBoard();
  };

  #getMovieComments = (movie) => {
    const comments = movie.comments.length
      ? movie.comments.map((commentId) =>
        this.#listComments.find((comment) =>
          comment.id === commentId
        )
      )
      : [];
    return comments;
  };

  #renderMovieCard = (movie) => {
    const comments = this.#getMovieComments(movie);
    const moviePresenter = new MoviePresenter(this.#movieListComponent.container, this.#popupPresenter, this.#handleMovieChange);
    moviePresenter.init(movie, comments);
    this.#moviePresenter.set(movie.id, moviePresenter);
  };

  #renderTopRatedMovieCard = (movie) => {
    const comments = this.#getMovieComments(movie);
    const movieTopRatedPresenter = new MoviePresenter(this.#movieListExtraRatingComponent.container, this.#popupPresenter, this.#handleMovieChange);
    movieTopRatedPresenter.init(movie, comments);
    this.#movieTopRatedPresenter.set(movie.id, movieTopRatedPresenter);
  };

  #renderMostCommentedMovieCard = (movie) => {
    const comments = this.#getMovieComments(movie);
    const movieMostCommentedPresenter = new MoviePresenter(this.#movieListExtraCommentsComponent.container, this.#popupPresenter, this.#handleMovieChange);
    movieMostCommentedPresenter.init(movie, comments);
    this.#movieMostCommentedPresenter.set(movie.id, movieMostCommentedPresenter);
  };

  #renderMovieCards = (from, to) => {
    this.#listMovies
      .slice(from, to)
      .forEach((movie) => this.#renderMovieCard(movie));
  };

  #renderTopRatedMovies = () => {
    const topMovies = this.#listMovies
      .filter((movie) => movie.rating > 0)
      .sort(sortMoviesByRating)
      .slice(0, TOP_MOVIES);

    render(this.#movieListExtraRatingComponent, this.#movieListBodyComponent.element);
    topMovies.forEach((movie) => {
      this.#renderTopRatedMovieCard(movie, this.#movieListExtraRatingComponent.container);
    });
  };

  #renderMostCommentedMovies = () => {
    const topMovies = this.#listMovies
      .filter((movie) => movie.comments.length > 0)
      .sort(sortMoviesByComments)
      .slice(0, TOP_MOVIES);

    render(this.#movieListExtraCommentsComponent, this.#movieListBodyComponent.element);
    topMovies.forEach((movie) => {
      this.#renderMostCommentedMovieCard(movie, this.#movieListExtraCommentsComponent.container);
    });
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#movieListComponent.container, RenderPosition.AFTEREND);
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #handleShowMoreButtonClick = () => {
    this.#listMovies
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovieCard(movie, this.#movieListComponent.container));

    this.#renderedMoviesCount += MOVIES_COUNT_PER_STEP;

    if (this.#renderedMoviesCount >= this.#listMovies.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderMainMovieList = () => {
    this.#renderMovieCards(0, Math.min(this.#listMovies.length, MOVIES_COUNT_PER_STEP));

    if (this.#listMovies.length >= this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }
  };

  #renderBoard = () => {
    if (!this.#listMovies.length) {
      render(this.#movieListBodyComponent, this.#EntryPoints.MAIN);
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    render(this.#movieListBodyComponent, this.#EntryPoints.MAIN);
    render(this.#movieListComponent, this.#movieListBodyComponent.element);
    this.#renderMainMovieList();
    this.#renderTopRatedMovies();
    this.#renderMostCommentedMovies();
  };

  #renderEmptyList = () => {
    render(this.#movieEmptyComponent, this.#movieListBodyComponent.element);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTasks(sortType);
    this.#clearMainMovieList();
    this.#renderMainMovieList();
  };

  #sortTasks = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#listMovies.sort(sortMoviesByDate);
        break;

      case SortType.RATING:
        this.#listMovies.sort(sortMoviesByRating);
        break;

      default:
        this.#listMovies = [...this.#sourcedListMovies];
    }

    this.#currentSortType = sortType;
  };

  #renderSort = () => {
    render(this.#movieSortComponent, this.#EntryPoints.MAIN);
    this.#movieSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #clearMainMovieList = () => {
    this.#moviePresenter.forEach((movie) => movie.destroy());
    this.#moviePresenter.clear();
    this.#renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #handleMovieChange = (updatedMovie) => {
    this.#listMovies = updateItem(this.#listMovies, updatedMovie);
    this.#sourcedListMovies = updateItem(this.#sourcedListMovies, updatedMovie);
    if (this.#moviePresenter.has(updatedMovie.id)) {
      this.#moviePresenter.get(updatedMovie.id).init(updatedMovie);
    }
    if (this.#movieTopRatedPresenter.has(updatedMovie.id)) {
      this.#movieTopRatedPresenter.get(updatedMovie.id).init(updatedMovie);
    }
    if (this.#movieMostCommentedPresenter.has(updatedMovie.id)) {
      this.#movieMostCommentedPresenter.get(updatedMovie.id).init(updatedMovie);
    }
    if (this.#popupPresenter.isPopupActive) {
      this.#popupPresenter.init(updatedMovie);
      this.#popupPresenter.restorePopup();
    }
  };
}
