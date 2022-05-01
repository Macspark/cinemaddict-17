import {render, RenderPosition} from '../render.js';
import MovieContainerView from '../view/movie-container.js';
import MovieListView from '../view/movie-list.js';
import MovieListExtraView from '../view/movie-list-extra.js';
import MovieCardView from '../view/movie-card.js';
import MoviePopupView from '../view/movie-popup.js';
import ShowMoreButtonView from '../view/show-more-button.js';

const TOP_MOVIES = 2;

export default class BoardPresenter {
  init(EntryPoints, movieModel, commentModel) {
    this.EntryPoints = EntryPoints;
    this.movieModel = movieModel;
    this.commentModel = commentModel;
    this.boardMovies = [...this.movieModel.getMovies()];
    this.boardComments = [...this.commentModel.getComments()];

    render(new MovieContainerView(), this.EntryPoints.MAIN);
    const siteMovieListContainerElement = document.querySelector('.films');

    render(new MovieListView(), siteMovieListContainerElement);
    const siteMovieListElement = document.querySelector('.films-list__container');

    for (let i = 0; i < this.boardMovies.length; i++) {
      render(new MovieCardView(this.boardMovies[i]), siteMovieListElement);
    }

    const siteMovieListRatingsElement = new MovieListExtraView('Top rated');
    const siteMovieListRatingsContainerElement = siteMovieListRatingsElement
      .getElement()
      .querySelector('.films-list__container');

    render(siteMovieListRatingsElement, siteMovieListContainerElement);
    for (let i = 0; i < TOP_MOVIES; i++) {
      render(new MovieCardView(this.boardMovies[i]), siteMovieListRatingsContainerElement);
    }

    const siteMovieListCommentsElement = new MovieListExtraView('Most comments');
    const siteMovieListCommentsContainerElement = siteMovieListCommentsElement
      .getElement()
      .querySelector('.films-list__container');

    render(siteMovieListCommentsElement, siteMovieListContainerElement);
    for (let i = 0; i < TOP_MOVIES; i++) {
      render(new MovieCardView(this.boardMovies[i]), siteMovieListCommentsContainerElement);
    }

    render(new ShowMoreButtonView(), siteMovieListElement, RenderPosition.AFTEREND);
  }

  createPopup(movie) {
    const popupComments = movie.comments.length
      ? movie.comments.map((commentId) =>
        this.boardComments.find((comment) =>
          comment.id === commentId
        )
      )
      : [];

    const moviePopupView = new MoviePopupView(movie, popupComments);

    render(moviePopupView, this.EntryPoints.FOOTER, RenderPosition.AFTEREND);
    document.addEventListener('click', () => document.querySelector('.film-details').remove());
  }
}
