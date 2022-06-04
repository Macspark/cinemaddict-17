
import Observable from '../framework/observable.js';

export default class CommentModel extends Observable {
  #commentsApiService;
  #movieModel;

  constructor(commentsApiService, movieModel) {
    super();
    this.#commentsApiService = commentsApiService;
    this.#movieModel = movieModel;
  }

  getMovieComments = async (movieId) => {
    try {
      const comments = await this.#commentsApiService.getMovieComments(movieId);
      return comments.map(this.#adaptToClient);
    } catch(err) {
      return [];
    }
  };

  addCommentToMovie = async (updateType, movieId, comment) => {
    try {
      const response = await this.#commentsApiService.addCommentToMovie(movieId, comment);
      const update = this.#adaptToClient(response);
      const updatedComments = update.comments.map(this.#adaptToClient);
      this._notify(updateType, updatedComments);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteCommentFromMovie = async (updateType, commentId) => {
    await this.#commentsApiService.removeCommentFromMovie(commentId);
    this._notify(updateType);
  };

  #adaptToClient = (comment) => {
    const adaptedComment = {...comment,
      'text': comment.comment,
    };

    delete adaptedComment.comment;

    return adaptedComment;
  };
}
