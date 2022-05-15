import {render, remove, RenderPosition} from '../framework/render.js';
import {TOP_MOVIES, MOVIES_COUNT_PER_STEP} from '../const.js';
import {updateItem, sortMoviesByRating, sortMoviesByComments} from '../utils/movie.js';
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
  #listMovies;
  #sourcedListMovies;
  #listComments;
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  #cardPresenter = new Map();

  #movieListBodyComponent = new MovieContainerView();
  #movieListComponent = new MovieListView();
  #movieListExtraRatingComponent = new MovieListExtraView('Top rated');
  #movieListExtraCommentsComponent = new MovieListExtraView('Most comments');
  #movieEmptyComponent = new MovieEmptyView();
  #showMoreButtonComponent = new ShowMoreButtonView();
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

  #renderMovieCard = (movie, container) => {
    const comments = movie.comments.length
      ? movie.comments.map((commentId) =>
        this.#listComments.find((comment) =>
          comment.id === commentId
        )
      )
      : [];

    //if (this.#cardPresenter.has(movie.id)) {
    //  this.#cardPresenter.get(movie.id).init(movie, comments);
    //} else {
      const cardPresenter = new CardPresenter(container, this.#popupPresenter, this.#handleMovieChange);
      cardPresenter.init(movie, comments);
      this.#cardPresenter.set(movie.id, cardPresenter);
    //}
  };

  #renderMovieCards = (from, to, container) => {
    this.#listMovies
      .slice(from, to)
      .forEach((movie) => this.#renderMovieCard(movie, container));
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

  #renderTopRatedMovies = () => {
    const topMovies = this.#listMovies
      .filter((movie) => movie.rating > 0)
      .sort(sortMoviesByRating)
      .slice(0, TOP_MOVIES);
      
    render(this.#movieListExtraRatingComponent, this.#movieListBodyComponent.element);
    topMovies.forEach((movie) => {
      this.#renderMovieCard(movie, this.#movieListExtraRatingComponent.container);
    });
  }

  #renderMostCommentedMovies = () => {
    const topMovies = this.#listMovies
      .filter((movie) => movie.comments.length > 0)
      .sort(sortMoviesByComments)
      .slice(0, TOP_MOVIES);
      
    render(this.#movieListExtraCommentsComponent, this.#movieListBodyComponent.element);
    topMovies.forEach((movie) => {
      this.#renderMovieCard(movie, this.#movieListExtraCommentsComponent.container);
    });
  }

  #renderMovieLists = () => {
    render(this.#movieListComponent, this.#movieListBodyComponent.element);
    this.#renderMovieCards(
      0,
      Math.min(this.#listMovies.length, MOVIES_COUNT_PER_STEP),
      this.#movieListComponent.container
    );

    this.#renderTopRatedMovies();
    this.#renderMostCommentedMovies();

    if (this.#listMovies.length >= this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }
  };

  #renderBoard = () => {
    render(this.#movieListBodyComponent, this.#EntryPoints.MAIN);

    if (!this.#listMovies.length) {
      this.#renderEmptyList();
    }

    this.#renderMovieLists();
  };

  #renderEmptyList = () => {
    render(this.#movieEmptyComponent, this.#movieListBodyComponent.element);
  }

  #handleMovieChange = (updatedMovie) => {
    this.#listMovies = updateItem(this.#listMovies, updatedMovie);
    this.#sourcedListMovies = updateItem(this.#sourcedListMovies, updatedMovie);
    this.#cardPresenter.get(updatedMovie.id).init(updatedMovie);
    console.log(this.#popupPresenter);
    if (this.#popupPresenter.popupActive) {
      this.#popupPresenter.init(updatedMovie);
    }
  };
}
