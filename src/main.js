import {render} from './render.js';
import ShowMoreButtonView from './view/show-more-button.js';
import UserView from './view/user.js';
import NavigationView from './view/navigation.js';
import SortView from './view/sort.js';
import MovieContainerView from './view/movie-container.js';
import MovieListView from './view/movie-list.js';
import MovieListExtraView from './view/movie-list-extra.js';
import MovieCardView from './view/movie-card.js';
import StatisticsView from './view/statistics.js';
import MoviePopupView from './view/movie-popup.js';

const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');

render(new UserView(), siteHeader);
render(new NavigationView(), siteMain);
render(new SortView(), siteMain);
render(new MovieContainerView(), siteMain);

const siteMovieListContainer = document.querySelector('.films');

render(new MovieListView(), siteMovieListContainer);

const siteMovieList = document.querySelector('.films-list__container');

for (let i = 0; i < 5; i++) {
  render(new MovieCardView(), siteMovieList);
}

render(new MovieListExtraView('Top rated'), siteMovieListContainer);
const siteMovieListRatings = document.querySelector('.films .films-list:last-child .films-list__container');
for (let i = 0; i < 2; i++) {
  render(new MovieCardView(), siteMovieListRatings);
}

render(new MovieListExtraView('Most commented'), siteMovieListContainer);
const siteMovieListComments = document.querySelector('.films .films-list:last-child .films-list__container');
for (let i = 0; i < 2; i++) {
  render(new MovieCardView(), siteMovieListComments);
}

render(new ShowMoreButtonView(), siteMovieList, 'afterend');

render(new StatisticsView(), siteFooter);

render(new MoviePopupView(), siteFooter, 'afterend');
