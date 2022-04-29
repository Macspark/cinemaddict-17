import {render} from '../render.js';
import MovieContainerView from '../view/movie-container.js';
import MovieListView from '../view/movie-list.js';
import MovieListExtraView from '../view/movie-list-extra.js';
import MovieCardView from '../view/movie-card.js';
import ShowMoreButtonView from '../view/show-more-button.js';

const TOP_MOVIES = 2;

export default class BoardPresenter {
  init(siteMain, movieModel) {
    this.movieModel = movieModel;
    this.boardMovies = [...this.movieModel.getMovies()];

    render(new MovieContainerView(), siteMain);
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
}

