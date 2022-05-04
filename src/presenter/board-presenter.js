import {render, RenderPosition} from '../render.js';
import {TOP_MOVIES, MOVIES_COUNT_PER_STEP} from '../consts.js';
import MovieContainerView from '../view/movie-container.js';
import MovieListView from '../view/movie-list.js';
import MovieListExtraView from '../view/movie-list-extra.js';
import MovieCardView from '../view/movie-card.js';
import MovieEmptyView from '../view/movie-empty.js';
import MoviePopupView from '../view/movie-popup.js';
import ShowMoreButtonView from '../view/show-more-button.js';

export default class BoardPresenter {
  #EntryPoints;
  #movieModel;
  #commentModel;
  #boardMovies;
  #boardComments;
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  #moviePopupView = null;

  #boardMovieListMainComponent = new MovieContainerView();
  #movieListMainContainerComponent = new MovieListView();
  #movieListByRatingContainerComponent = new MovieListExtraView('Top rated');
  #movieListByCommentsContainerComponent = new MovieListExtraView('Most comments');
  #showMoreButtonView = new ShowMoreButtonView();

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
      render(this.#showMoreButtonView, this.#movieListMainContainerComponent.container, RenderPosition.AFTEREND);
      this.#showMoreButtonView.element.addEventListener('click', this.#handleShowMoreButtonClick);
    }
  };

  #renderMovieCard = (movie, place) => {
    const movieComponent = new MovieCardView(movie);

    const closePopup = () => {
      this.#moviePopupView.element.remove();
      this.#moviePopupView = null;
      document.body.classList.remove('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        document.removeEventListener('keydown', onEscKeyDown);
        closePopup();
      }
    };

    const openPopup = () => {
      if (this.#moviePopupView) {
        document.removeEventListener('keydown', onEscKeyDown);
        closePopup();
      }

      const popupComments = movie.comments.length
        ? movie.comments.map((commentId) =>
          this.#boardComments.find((comment) =>
            comment.id === commentId
          )
        )
        : [];

      this.#moviePopupView = new MoviePopupView(movie, popupComments);
      this.#moviePopupView.closeButton.addEventListener('click', (evt) => {
        evt.preventDefault();
        document.removeEventListener('keydown', onEscKeyDown);
        closePopup();
      });

      document.body.classList.add('hide-overflow');
      render(this.#moviePopupView, this.#EntryPoints.FOOTER, RenderPosition.AFTEREND);
    };

    movieComponent.cardBody.addEventListener('click', () => {
      document.addEventListener('keydown', onEscKeyDown);
      openPopup();
    });

    render(movieComponent, place);
  };

  #handleShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#boardMovies
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovieCard(movie, this.#movieListMainContainerComponent.container));

    this.#renderedMoviesCount += MOVIES_COUNT_PER_STEP;

    if (this.#renderedMoviesCount >= this.#boardMovies.length) {
      this.#showMoreButtonView.element.remove();
      this.#showMoreButtonView.removeElement();
    }
  };
}
