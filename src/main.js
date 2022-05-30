import { render } from './framework/render.js';
import StatisticsView from './view/statistics.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MovieModel from './model/movie-model.js';
import CommentModel from './model/comment-model.js';
import FilterModel from './model/filter-model.js';

const EntryPoints = {
  HEADER: document.querySelector('.header'),
  MAIN: document.querySelector('.main'),
  FOOTER: document.querySelector('.footer')
};

const movieModel = new MovieModel();
const commentModel = new CommentModel();
const filterModel = new FilterModel();

const statisticsView = new StatisticsView(movieModel.movies.length);

const filterPresenter = new FilterPresenter(EntryPoints.MAIN, movieModel, filterModel);
const movieBoardPresenter = new BoardPresenter(EntryPoints, movieModel, commentModel, filterModel);

render(statisticsView, EntryPoints.FOOTER);
filterPresenter.init();
movieBoardPresenter.init();
