import {render} from './render.js';
import UserView from './view/user.js';
import NavigationView from './view/navigation.js';
import SortView from './view/sort.js';
import StatisticsView from './view/statistics.js';
import MoviePopupView from './view/movie-popup.js';
import BoardPresenter from './presenter/board-presenter.js';

const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');

render(new UserView(), siteHeader);
render(new NavigationView(), siteMain);
render(new SortView(), siteMain);

const boardPresenter = new BoardPresenter();
boardPresenter.init();

render(new StatisticsView(), siteFooter);
render(new MoviePopupView(), siteFooter, 'afterend');

