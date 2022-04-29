import {render} from './render.js';
import UserView from './view/user.js';
import NavigationView from './view/navigation.js';
import SortView from './view/sort.js';
import StatisticsView from './view/statistics.js';
import MoviePopupView from './view/movie-popup.js';
import BoardPresenter from './presenter/board-presenter.js';

import MoviesModel from './model/movies-model.js';

const movieModel = new MoviesModel();
const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
const boardPresenter = new BoardPresenter();

render(new UserView(), siteHeader);
render(new NavigationView(), siteMain);
render(new SortView(), siteMain);

boardPresenter.init(siteMain, movieModel);

render(new StatisticsView(), siteFooter);


// TEMP
const moviePopupView = new MoviePopupView(movieModel.getMovies()[0]);
render(moviePopupView, siteFooter, 'afterend');
document.addEventListener('click', () => document.querySelector('.film-details').remove());
