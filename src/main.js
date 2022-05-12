import {render} from './framework/render.js';
import UserView from './view/user.js';
import MovieFilterView from './view/movie-filter.js';
import SortView from './view/sort.js';
import StatisticsView from './view/statistics.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
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
const movieListPresenter = new MovieListPresenter(EntryPoints, movieModel, commentModel);
const filters = generateFilter(movieModel.movies);

render(new UserView(), EntryPoints.HEADER);
render(new MovieFilterView(filters), EntryPoints.MAIN);
render(new SortView(), EntryPoints.MAIN);

movieListPresenter.init();

render(new StatisticsView(), EntryPoints.FOOTER);
