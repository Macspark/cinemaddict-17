import { render } from './framework/render.js';
import { AUTHORIZATION, END_POINT } from './const.js';
import StatisticsView from './view/statistics.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MovieModel from './model/movie-model.js';
import CommentModel from './model/comment-model.js';
import FilterModel from './model/filter-model.js';
import MoviesApiService from './api/movies-api-service.js';
import CommentsApiService from './api/comments-api-service.js';

const EntryPoints = {
  HEADER: document.querySelector('.header'),
  MAIN: document.querySelector('.main'),
  FOOTER: document.querySelector('.footer')
};

const commentsApiService = new CommentsApiService(END_POINT, AUTHORIZATION)
const commentModel = new CommentModel(commentsApiService);
const moviesApiService = new MoviesApiService(END_POINT, AUTHORIZATION);
const movieModel = new MovieModel(moviesApiService);
const filterModel = new FilterModel();

const statisticsView = new StatisticsView(movieModel.movies.length);

const filterPresenter = new FilterPresenter(EntryPoints.MAIN, movieModel, filterModel);
const boardPresenter = new BoardPresenter(EntryPoints, movieModel, commentModel, filterModel);

render(statisticsView, EntryPoints.FOOTER);
filterPresenter.init();
boardPresenter.init();
movieModel.init();
