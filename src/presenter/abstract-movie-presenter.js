export default class AbstractMoviePresenter {
  _container;
  _movie;
  _comments;

  #changeData;

  constructor(container, changeData) {
    if (new.target === AbstractMoviePresenter) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
    this._container = container;
    this.#changeData = changeData;
  }

  init = () => {
    throw new Error('Abstract method not implemented: get template');
  };

  _handleWatchlistClick = () => {
    this.#changeData({...this._movie, isWatchlist: !this._movie.isWatchlist});
  };

  _handleWatchedClick = () => {
    this.#changeData({...this._movie, isWatched: !this._movie.isWatched});
  };

  _handleFavoriteClick = () => {
    this.#changeData({...this._movie, isFavorite: !this._movie.isFavorite});
  };
}
