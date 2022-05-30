import { UserAction, UpdateType } from '../../const.js';

export default class AbstractMoviePresenter {
  _container;
  _movie;
  _comments;
  _changeData;

  constructor(container, changeData) {
    if (new.target === AbstractMoviePresenter) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
    this._container = container;
    this._changeData = changeData;
  }

  init = () => {
    throw new Error('Abstract method not implemented: get template');
  };

  _handleWatchlistClick = () => {
    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this._movie, isWatchlist: !this._movie.isWatchlist},
    );
  };

  _handleWatchedClick = () => {
    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this._movie, isWatched: !this._movie.isWatched},
    );
  };

  _handleFavoriteClick = () => {
    this._changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this._movie, isFavorite: !this._movie.isFavorite},
    )
  };
}
