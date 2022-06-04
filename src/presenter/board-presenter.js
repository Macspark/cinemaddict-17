import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { TOP_MOVIES, MOVIE_COUNT_PER_STEP, SortType, FilterType, UpdateType, UserAction, BlockerTimeLimit } from '../const.js';
import { sortMoviesByRating, sortMoviesByComments, sortMoviesByDate } from '../utils/movie.js';
import MovieContainerView from '../view/movie-container.js';
import MovieListView from '../view/movie-list.js';
import MovieListExtraView from '../view/movie-list-extra.js';
import MovieEmptyView from '../view/movie-empty.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import SortView from '../view/sort.js';
import MoviePresenter from './movie-presenter.js';
import PopupPresenter from './popup-presenter.js';
import { getFilteredMovies } from '../utils/filter.js';
import UserView from '../view/user.js';
import LoadingView from '../view/loading.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class BoardPresenter {
  #EntryPoints;

  #movieModel;
  #commentModel;
  #filterModel;

  #currentSortType = SortType.DEFAULT;
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;
  #moviePresenter = new Map();
  #movieTopRatedPresenter = new Map();
  #movieMostCommentedPresenter = new Map();

  #userComponent = null;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #movieListBodyComponent = new MovieContainerView();
  #movieListComponent = new MovieListView();
  #movieListExtraRatingComponent = new MovieListExtraView('Top rated');
  #movieListExtraCommentsComponent = new MovieListExtraView('Most comments');
  #movieEmptyComponent = null;
  #showMoreButtonComponent = new ShowMoreButtonView();
  #movieSortComponent = null;
  #uiBlocker = new UiBlocker(BlockerTimeLimit.LOWER_LIMIT, BlockerTimeLimit.UPPER_LIMIT);

  #popupPresenter = null;

  constructor(EntryPoints, movieModel, commentModel, filterModel) {
    this.#EntryPoints = EntryPoints;
    this.#movieModel = movieModel;
    this.#commentModel = commentModel;
    this.#filterModel = filterModel;
    this.#popupPresenter = new PopupPresenter(EntryPoints.FOOTER, this.#commentModel, this.#handleViewAction);
    this.#movieModel.addObserver(this.#handleModelEvent);
    this.#movieModel.addObserver(this.#popupPresenter.handleMovieModelEvent);
    this.#commentModel.addObserver(this.#movieModel.refreshMovieModel);
    this.#commentModel.addObserver(this.#popupPresenter.handleCommentModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#renderBoard();
  };

  get movies() {
    const filterType = this.#filterModel.currentFilter;
    const filteredMovies = getFilteredMovies(filterType, this.#movieModel.movies);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...filteredMovies].sort(sortMoviesByDate);
      case SortType.RATING:
        return [...filteredMovies].sort(sortMoviesByRating);
    }

    return filteredMovies;
  }

  #renderUser = () => {
    const oldUserComponent = this.#userComponent;
    const watchedMoviesCount = getFilteredMovies(FilterType.HISTORY, this.#movieModel.movies).length;

    this.#userComponent = new UserView(watchedMoviesCount);

    if (oldUserComponent === null) {
      render(this.#userComponent, this.#EntryPoints.HEADER);
      return;
    }

    replace(this.#userComponent, oldUserComponent);
    remove(oldUserComponent);
  };

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderMovie(movie));
  };

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#movieListComponent.container, this.#popupPresenter, this.#handleViewAction);
    moviePresenter.init(movie);
    this.#moviePresenter.set(movie.id, moviePresenter);
  };

  #renderTopRatedMovieCard = (movie) => {
    const movieTopRatedPresenter = new MoviePresenter(this.#movieListExtraRatingComponent.container, this.#popupPresenter, this.#handleViewAction);
    movieTopRatedPresenter.init(movie);
    this.#movieTopRatedPresenter.set(movie.id, movieTopRatedPresenter);
  };

  #renderMostCommentedMovieCard = (movie) => {
    const movieMostCommentedPresenter = new MoviePresenter(this.#movieListExtraCommentsComponent.container, this.#popupPresenter, this.#handleViewAction);
    movieMostCommentedPresenter.init(movie);
    this.#movieMostCommentedPresenter.set(movie.id, movieMostCommentedPresenter);
  };

  #renderTopRatedMovies = () => {
    const topMovies = this.#movieModel.movies
      .filter((movie) => movie.totalRating > 0)
      .sort(sortMoviesByRating)
      .slice(0, TOP_MOVIES);

    if (!topMovies.length) {
      return;
    }

    render(this.#movieListExtraRatingComponent, this.#movieListBodyComponent.element);
    topMovies.forEach((movie) => {
      this.#renderTopRatedMovieCard(movie, this.#movieListExtraRatingComponent.container);
    });
  };

  #renderMostCommentedMovies = () => {
    const topMovies = this.#movieModel.movies
      .filter((movie) => movie.comments.length > 0)
      .sort(sortMoviesByComments)
      .slice(0, TOP_MOVIES);

    if (!topMovies.length) {
      return;
    }

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
    const movieCount = this.movies.length;
    const newRenderedMovieCount = Math.min(movieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP);
    const movies = this.movies.slice(this.#renderedMovieCount, newRenderedMovieCount);

    this.#renderMovies(movies);
    this.#renderedMovieCount = newRenderedMovieCount;

    if (this.#renderedMovieCount >= this.movies.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderBoard = () => {
    this.#renderUser();

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const movies = this.movies;
    const movieCount = movies.length;
    render(this.#movieListBodyComponent, this.#EntryPoints.MAIN);

    if (movieCount === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    render(this.#movieListComponent, this.#movieListBodyComponent.element);

    this.#renderMovies(movies.slice(0, Math.min(movieCount, this.#renderedMovieCount)));

    if (this.movies.length > this.#renderedMovieCount) {
      this.#renderShowMoreButton();
    }

    this.#renderTopRatedMovies();
    this.#renderMostCommentedMovies();
  };

  #clearBoard = ({resetRenderedMovieCount = false, resetSortType = false} = {}) => {
    remove(this.#movieSortComponent);
    remove(this.#movieEmptyComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#movieListBodyComponent);
    remove(this.#movieListComponent);
    remove(this.#movieListExtraRatingComponent);
    remove(this.#movieListExtraCommentsComponent);

    this.#clearMoviePresenter(this.#moviePresenter);
    this.#clearMoviePresenter(this.#movieTopRatedPresenter);
    this.#clearMoviePresenter(this.#movieMostCommentedPresenter);

    if (resetRenderedMovieCount) {
      this.#renderedMovieCount = MOVIE_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #clearMoviePresenter = (presenter) => {
    if (!presenter.length) {
      return;
    }

    presenter.forEach((movie) => movie.destroy());
    presenter.clear();
  };

  #renderEmptyList = () => {
    const filterType = this.#filterModel.currentFilter;
    this.#movieEmptyComponent =  new MovieEmptyView(filterType);
    render(this.#movieEmptyComponent, this.#movieListBodyComponent.element);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedMovieCount: true});
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#movieSortComponent = new SortView(this.#currentSortType);
    this.#movieSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#movieSortComponent, this.#movieListBodyComponent.element, RenderPosition.BEFOREBEGIN);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#EntryPoints.MAIN);
  };

  #updateMovieCard = (updatedMovie) => {
    if (this.#moviePresenter.has(updatedMovie.id)) {
      this.#moviePresenter.get(updatedMovie.id).init(updatedMovie);
    }

    if (this.#movieTopRatedPresenter.has(updatedMovie.id)) {
      remove(this.#movieListExtraRatingComponent);
      this.#clearMoviePresenter(this.#movieTopRatedPresenter);
      this.#renderTopRatedMovies();
    }

    if (this.#movieMostCommentedPresenter.has(updatedMovie.id)) {
      remove(this.#movieListExtraCommentsComponent);
      this.#clearMoviePresenter(this.#movieMostCommentedPresenter);
      this.#renderMostCommentedMovies();
    }
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#movieModel.updateMovie(updateType, update.updatedMovie);
        break;
      case UserAction.ADD_COMMENT:
        try {
          await this.#commentModel.addCommentToMovie(updateType, update.movieId, update.data);
        } catch(err) {
          this.#popupPresenter.unblockNewCommentForm();
        }
        break;
      case UserAction.DELETE_COMMENT:
        try {
          await this.#commentModel.deleteCommentFromMovie(updateType, update.commentId);
        } catch(err) {
          this.#popupPresenter.unblockComment(update.commentId);
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#updateMovieCard(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedMovieCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };
}
