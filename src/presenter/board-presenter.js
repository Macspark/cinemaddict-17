import { render, remove, RenderPosition } from '../framework/render.js';
import { TOP_MOVIES, MOVIE_COUNT_PER_STEP, SortType, UpdateType, UserAction } from '../const.js';
import { sortMoviesByRating, sortMoviesByComments, sortMoviesByDate } from '../utils/movie.js';
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
  #currentSortType = SortType.DEFAULT;
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;
  #moviePresenter = new Map();
  #movieTopRatedPresenter = new Map();
  #movieMostCommentedPresenter = new Map();

  #movieListBodyComponent = new MovieContainerView();
  #movieListComponent = new MovieListView();
  #movieListExtraRatingComponent = new MovieListExtraView('Top rated');
  #movieListExtraCommentsComponent = new MovieListExtraView('Most comments');
  #movieEmptyComponent = new MovieEmptyView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #movieSortComponent = null;
  #popupPresenter;

  constructor(EntryPoints, movieModel, commentModel) {
    this.#EntryPoints = EntryPoints;
    this.#movieModel = movieModel;
    this.#commentModel = commentModel;
    this.#popupPresenter = new PopupPresenter(EntryPoints.FOOTER, this.#handleViewAction);
    this.#movieModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#renderBoard();
  };

  get movies() {    
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#movieModel.movies].sort(sortMoviesByDate);
      case SortType.RATING:
        return [...this.#movieModel.movies].sort(sortMoviesByRating);
    }

    return this.#movieModel.movies;
  }

  get comments() {
    return this.#commentModel.comments;
  }

  #getMovieComments = (movie) => {
    const comments = movie.comments.length
      ? movie.comments.map((commentId) =>
        this.comments.find((comment) =>
          comment.id === commentId
        )
      )
      : [];
    return comments;
  };

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderMovie(movie));
  }

  #renderMovie = (movie) => {
    const comments = this.#getMovieComments(movie);
    const moviePresenter = new MoviePresenter(this.#movieListComponent.container, this.#popupPresenter, this.#handleViewAction);
    moviePresenter.init(movie, comments);
    this.#moviePresenter.set(movie.id, moviePresenter);
  };

  #renderTopRatedMovieCard = (movie) => {
    const comments = this.#getMovieComments(movie);
    const movieTopRatedPresenter = new MoviePresenter(this.#movieListExtraRatingComponent.container, this.#popupPresenter, this.#handleViewAction);
    movieTopRatedPresenter.init(movie, comments);
    this.#movieTopRatedPresenter.set(movie.id, movieTopRatedPresenter);
  };

  #renderMostCommentedMovieCard = (movie) => {
    const comments = this.#getMovieComments(movie);
    const movieMostCommentedPresenter = new MoviePresenter(this.#movieListExtraCommentsComponent.container, this.#popupPresenter, this.#handleViewAction);
    movieMostCommentedPresenter.init(movie, comments);
    this.#movieMostCommentedPresenter.set(movie.id, movieMostCommentedPresenter);
  };

  #renderTopRatedMovies = () => {
    const topMovies = this.#movieModel.movies
      .filter((movie) => movie.rating > 0)
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
    const movies = this.movies;
    const movieCount = movies.length;

    if (movieCount === 0) {
      render(this.#movieListBodyComponent, this.#EntryPoints.MAIN);
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    render(this.#movieListBodyComponent, this.#EntryPoints.MAIN);
    render(this.#movieListComponent, this.#movieListBodyComponent.element);

    this.#renderMovies(movies.slice(0, Math.min(movieCount, this.#renderedMovieCount)));

    if (this.movies.length > this.#renderedMovieCount) {
      this.#renderShowMoreButton();
    }

    this.#renderTopRatedMovies();
    this.#renderMostCommentedMovies();
  };

  #clearBoard = ({resetRenderedMovieCount = false, resetSortType = false} = {}) => {
    const movieCount = this.movies.length;

    remove(this.#movieSortComponent);
    remove(this.#movieEmptyComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#movieListBodyComponent);
    remove(this.#movieListComponent);
    remove(this.#movieListExtraRatingComponent);
    remove(this.#movieListExtraCommentsComponent)
    
    this.#clearMoviePresenter(this.#moviePresenter);
    this.#clearMoviePresenter(this.#movieTopRatedPresenter);
    this.#clearMoviePresenter(this.#movieMostCommentedPresenter);

    if (resetRenderedMovieCount) {
      this.#renderedMovieCount = MOVIE_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #clearMoviePresenter = (presenter) => {
    if (!presenter.length) {
      return;
    }

    presenter.forEach((movie) => movie.destroy());
    presenter.clear();
  }

  #renderEmptyList = () => {
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
    render(this.#movieSortComponent, this.#EntryPoints.MAIN);
  };

  #updatePopup = (data, restorePopup) => {
    if (this.#popupPresenter.isPopupActive && this.#popupPresenter.currentMovieId === data.id) {
      const comments = this.#getMovieComments(data);
      this.#popupPresenter.init(data, comments);
      if (restorePopup) {
        this.#popupPresenter.restorePopup();
      }
    }
  }
  
  #updateMovieCard = (updatedMovie) => {
    if (this.#moviePresenter.has(updatedMovie.id)) {
      this.#moviePresenter.get(updatedMovie.id).init(updatedMovie);
    }
    if (this.#movieTopRatedPresenter.has(updatedMovie.id)) {
      this.#movieTopRatedPresenter.get(updatedMovie.id).init(updatedMovie);
    }
    if (this.#movieMostCommentedPresenter.has(updatedMovie.id)) {
      this.#movieMostCommentedPresenter.get(updatedMovie.id).init(updatedMovie);
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#movieModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        console.log(update);
        this.#commentModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentModel.deleteComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    this.#updatePopup(data);

    switch (updateType) {
      case UpdateType.PATCH:
        this.#updateMovieCard(data)
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedMovieCount: true, resetSortType: true});
        this.#renderBoard();
        break;
    }
  };
}
