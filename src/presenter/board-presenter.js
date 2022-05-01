import {render} from '../render.js';
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
    const siteMovieListContainer = document.querySelector('.films');

    render(new MovieListView(), siteMovieListContainer);
    const siteMovieList = document.querySelector('.films-list__container');

    for (let i = 0; i < this.boardMovies.length; i++) {
      render(new MovieCardView(this.boardMovies[i]), siteMovieList);
    }

    const siteMovieListRatings = new MovieListExtraView('Top rated');
    const siteMovieListRatingsContainer = siteMovieListRatings.getElement().querySelector('.films-list__container');
    render(siteMovieListRatings, siteMovieListContainer);
    for (let i = 0; i < TOP_MOVIES; i++) {
      render(new MovieCardView(this.boardMovies[i]), siteMovieListRatingsContainer);
    }

    const siteMovieListComments = new MovieListExtraView('Most comments');
    const siteMovieListCommentsContainer = siteMovieListComments.getElement().querySelector('.films-list__container');
    render(siteMovieListComments, siteMovieListContainer);
    for (let i = 0; i < TOP_MOVIES; i++) {
      render(new MovieCardView(this.boardMovies[i]), siteMovieListCommentsContainer);
    }

    render(new ShowMoreButtonView(), siteMovieList, 'afterend');
  }

  createPopup(movie) {
    const popupComments = movie.comments.length
      ? this.boardComments.filter((x) => movie.comments.includes(x.id))
      : [];
    const moviePopupView = new MoviePopupView(movie, popupComments);

    render(moviePopupView, this.EntryPoints.FOOTER, 'afterend');
    document.addEventListener('click', () => document.querySelector('.film-details').remove());
  }
}

