import {render} from './framework/render.js';
import UserView from './view/user.js';
import MovieFilterView from './view/filter.js';
import StatisticsView from './view/statistics.js';
import BoardPresenter from './presenter/board-presenter.js';
import MoviesModel from './model/movies-model.js';
import CommentModel from './model/comments-model.js';
import {generateFilter} from './mock/filter.js';

const EntryPoints = {
  HEADER: document.querySelector('.header'),
  MAIN: document.querySelector('.main'),
  FOOTER: document.querySelector('.footer')
};

const movieModel = new MoviesModel();
const commentModel = new CommentModel();
const movieBoardPresenter = new BoardPresenter(EntryPoints, movieModel, commentModel);
const filters = generateFilter(movieModel.movies);

render(new UserView(), EntryPoints.HEADER);
render(new MovieFilterView(filters), EntryPoints.MAIN);

movieBoardPresenter.init();

render(new StatisticsView(), EntryPoints.FOOTER);
