import {render} from './render.js';
import UserView from './view/user.js';
import NavigationView from './view/navigation.js';
import SortView from './view/sort.js';
import StatisticsView from './view/statistics.js';
import BoardPresenter from './presenter/board-presenter.js';

import MoviesModel from './model/movies-model.js';
import CommentModel from './model/comments-model.js';

const movieModel = new MoviesModel();
const commentModel = new CommentModel();

const EntryPoints = {
  HEADER: document.querySelector('.header'),
  MAIN: document.querySelector('.main'),
  FOOTER: document.querySelector('.footer')
};

const boardPresenter = new BoardPresenter();

render(new UserView(), EntryPoints.HEADER);
render(new NavigationView(), EntryPoints.MAIN);
render(new SortView(), EntryPoints.MAIN);

boardPresenter.init(EntryPoints, movieModel, commentModel);

render(new StatisticsView(), EntryPoints.FOOTER);

// TEMP
boardPresenter.createPopup(movieModel.getMovies()[0]);
