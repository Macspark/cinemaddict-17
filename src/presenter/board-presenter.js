import {render, RenderPosition} from '../render.js';
import MovieContainerView from '../view/movie-container.js';
import MovieListView from '../view/movie-list.js';
import MovieListExtraView from '../view/movie-list-extra.js';
import MovieCardView from '../view/movie-card.js';
import MoviePopupView from '../view/movie-popup.js';
import ShowMoreButtonView from '../view/show-more-button.js';

const TOP_MOVIES = 2;

export default class BoardPresenter {
  #EntryPoints;
  #movieModel;
  #commentModel;
  #boardMovies;
  #boardComments;

  #boardMovieListMainComponent = new MovieContainerView();
  #movieListMainContainerComponent = new MovieListView();
  #movieListByRatingContainerComponent = new MovieListExtraView('Top rated');
  #movieListByCommentsContainerComponent = new MovieListExtraView('Most comments');

  #moviePopupView = null;

  init(EntryPoints, movieModel, commentModel) {
    this.#EntryPoints = EntryPoints;
    this.#movieModel = movieModel;
    this.#commentModel = commentModel;
    this.#boardMovies = [...this.#movieModel.movies];
    this.#boardComments = [...this.#commentModel.comments];

    render(this.#boardMovieListMainComponent, this.#EntryPoints.MAIN);
    render(this.#movieListMainContainerComponent, this.#boardMovieListMainComponent.element);

    for (let i = 0; i < this.#boardMovies.length; i++) {
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

    render(new ShowMoreButtonView(), this.#movieListMainContainerComponent.container, RenderPosition.AFTEREND);
  }

  #renderMovieCard(movie, place){
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
  }
}
